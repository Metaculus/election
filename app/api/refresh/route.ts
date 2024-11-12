import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import cheerio from "cheerio";
import { parse } from 'csv-parse/sync';

const METACULUS_API_KEY = process.env.METACULUS_API_KEY;
const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY;
const SECRET_KEY = process.env.SECRET_KEY;

// TODO: Each fetcher needs error-handling
// TODO: Add a retry mechanism

// Middleware to check for the token
function checkAuthToken(req: Request) {
  const token = req.headers.get("authorization");

  if (!token || token !== `Bearer ${SECRET_KEY}`) {
    return false;
  }
  return true;
}

async function fetchMetaculusData() {
  const url = "https://www.metaculus.com/api2/questions/11245";
  const headers = {
    Authorization: `Token ${METACULUS_API_KEY}`,
    "Content-Type": "application/json",
  };
  const response = await fetch(url, { headers });
  const data = await response.json();
  const question = data.group_of_questions.questions
    .find(
      (question: any) => question.id === 5717
    )
  const [harrisVal, trumpVal] = question.aggregations.recency_weighted.latest.forecast_values;

  return [
    {
      market: "Metaculus",
      candidateName: "Donald Trump",
      value: trumpVal,
    },
    {
      market: "Metaculus",
      candidateName: "Kamala Harris",
      value: harrisVal,
    }
  ];
}

async function fetchPredictItData() {
  const url = "https://www.predictit.org/api/marketdata/markets/7456";
  const response = await fetch(url);
  const data = await response.json();
  const forecastValues = data.contracts
    .filter(
      (contract: any) =>
        contract.name === "Donald Trump" || contract.name === "Kamala Harris"
    )
    .map((contract: any) => ({
      market: "PredictIt",
      candidateName: contract.name,
      value: contract.lastTradePrice,
    }));
  return forecastValues;
}

async function fetchPolymarketData() {
  const url = "https://polymarket.com/event/presidential-election-winner-2024";
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  const scriptContent = $("script#__NEXT_DATA__").html();
  const data = JSON.parse(scriptContent!);

  const marketData = data.props.pageProps.dehydratedState.queries[0].state.data;

  const markets = marketData.markets.filter(
    (market: any) => market["id"] === "253591" || market["id"] === "253597"
  );

  const parsedMarkets = markets.map((market: any) => {
    const outcomesMap = market.outcomes.reduce(
      (acc: any, outcome: any, index: number) => {
        acc[outcome] = index;
        return acc;
      },
      {}
    );

    return {
      market: "Polymarket",
      candidateName: market.groupItemTitle,
      value: Number(market.outcomePrices[outcomesMap["Yes"]]),
    };
  });

  return parsedMarkets;
}

async function fetchHeadlineData() {
  const sourceIdToName: { [key: string]: string } = {
    'foxnews': 'Fox News',
    'cnn': 'CNN',
    'cbsnews': 'CBS News',
    'washingtonpost': 'Washington Post',
    'axios': 'Axios',
    'npr': 'NPR',
    'nytimes': 'NYT',
    'politico': 'Politico',
    'wsj': 'Wall Street Journal',
    'reuters': 'Reuters',
    'yahoo': 'Yahoo News',
    'abcnews': 'ABC News',
    'forbes': 'Forbes',
    'nbcnews': 'NBC News'
  }
  const query = "(trump%20OR%20kamala)%20AND%20election";
  const apiKey = NEWSDATA_API_KEY;
  const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${query}&country=us&category=politics`;
  const response = await fetch(url);
  const data = await response.json();
  let headlines = data.results.map((headline: any) => ({
    title: headline.title,
    url: headline.link,
    image: headline.image_url,
    timestamp: new Date(headline.pubDate),
    source: headline.source_id
  }));
  headlines = headlines.filter((headline: any) => headline.source in sourceIdToName && headline.image);
  headlines = headlines.map((headline: any) => ({
    ...headline,
    source: sourceIdToName[headline.source] || headline.source
  }));

  return headlines;
}

async function fetchPollingData() {
    const response = await fetch('https://projects.fivethirtyeight.com/polls/data/president_polls.csv');
    const csvText = await response.text();

    let records = parse(csvText, {
        columns: true,
        skip_empty_lines: true,
        cast: true
    });

    // Exclude polls that are older than 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    records = records.filter((record: any) => {
        const pollDate = new Date(record.end_date);
        return pollDate >= ninetyDaysAgo;
    });

    // Exclude polls that are not for Trump or Harris
    records = records.filter((record: any) => {
        return record.candidate_name === "Donald Trump" || record.candidate_name === "Kamala Harris";
    });
    
    const polls = records.map((record: any) => ({
        candidateName: record.candidate_name,
        value: parseFloat(record.pct),
        pollId: parseInt(record.poll_id, 10),
        sampleSize: parseInt(record.sample_size, 10) || null,
        timestamp: new Date(record.end_date),
        createdAt: new Date(record.created_at)
    }));
    return polls;
}

export async function POST(request: Request) {
    // This endpoint is hit every five minutes by a cron job. It's used to refresh all data
    // on the site.

    if (!checkAuthToken(request)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (body.type === "polls") {
        const pollingData = await fetchPollingData();
        await prisma.polls.createMany({
            data: pollingData,
            skipDuplicates: true,
        });

        return NextResponse.json({ message: "Refreshed polling data" });
    } else if (body.type === "news") {
        const headlines = await fetchHeadlineData();
        await prisma.headlines.createMany({
            data: headlines,
            skipDuplicates: true,
        });

        return NextResponse.json({ message: "Refreshed news data" });
    }

    await Promise.all([
        fetchMetaculusData(),
        fetchPredictItData(),
        fetchPolymarketData(),
    ]).then(async (values) => {
        const timestamp = new Date();
        const forecastValues = values.flat().map((forecast: any) => ({
        ...forecast,
        timestamp,
        })); // Add timestamp to each forecast

        await prisma.forecasts.createMany({
        data: forecastValues,
        skipDuplicates: true,
        });
    });
    return NextResponse.json({ message: "Refreshed data" });
}

export const revalidate = 0;