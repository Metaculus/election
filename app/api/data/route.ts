import { buildFaviconSource } from '@/app/lib/utils';
import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
import DateRange from '@/app/types/DateRange';
import DataPoint from '@/app/types/DataPoint';

async function fetchForecasts() {
    const market = 'Metaculus';
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000) * 1);

    const fetchForecast = async (candidate: string) => {
        const latestRecord = await prisma.forecasts.findFirst({
          where: {
            market,
            candidateName: candidate,
          },
          orderBy: {
            timestamp: 'desc',
          },
        });
  
        const record24hAgo = await prisma.forecasts.findFirst({
          where: {
            market,
            candidateName: candidate,
            timestamp: {
              lte: twentyFourHoursAgo,
            },
          },
          orderBy: {
            timestamp: 'desc',
          },
        });

        return {
          candidate,
          latestRecord,
          record24hAgo,
        };
    };
    const [trumpResult, harrisResult] = await Promise.all([fetchForecast("Donald Trump"), fetchForecast("Kamala Harris")]);
    const getCandidateValue = (result: any) => {
        const value = result?.latestRecord?.value ?? null;
        return value ? (value * 100) : null;
    }
    const getCandidateDelta = (result: any) => {
        return result?.latestRecord?.value != null && result?.record24hAgo?.value != null ? (result.latestRecord.value - result.record24hAgo.value) * 100: null;
        // return result?.latestRecord?.value != null && result?.record24hAgo?.value != null 
        //     ? ((result.latestRecord.value - result.record24hAgo.value) / result.record24hAgo.value) * 100 
        //     : null;
    }
    return {
        trumpForecast: {
            name: "Trump",
            value: getCandidateValue(trumpResult),
            delta: getCandidateDelta(trumpResult),
            image: "/trump.webp"
        },
        harrisForecast: {
            name: "Harris",
            value: getCandidateValue(harrisResult),
            delta: getCandidateDelta(harrisResult),
            image: "/harris.webp"
        },
        lastUpdated: trumpResult.latestRecord?.timestamp ?? new Date()
    }
  }

const buildBettingDataPoints = (records: any[]) => {
    const recordsByDate = records.reduce((acc: { [key: string]: any[] }, record) => {
        const date = record.timestamp.toISOString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(record);
        return acc;
    }, {});

    const dataPoints = Object.keys(recordsByDate).map(date => {
        const records = recordsByDate[date]; // Four records ([Trump, Harris], [PredictIt, Polymarket])

        const groupedByName = records.reduce((acc: { [key: string]: any[] }, record) => {
            if (!acc[record.candidateName]) {
                acc[record.candidateName] = [];
            }
            acc[record.candidateName].push(record);
            return acc;
        }, {});

        const candidateValues = Object.keys(groupedByName).map(candidateName => {
            const candidateRecords = groupedByName[candidateName];
            const averagedValue = candidateRecords.reduce((acc, record) => acc + record.value, 0) / candidateRecords.length;
            return {
                candidateName,
                value: averagedValue,
            };
        });

        const getCandidateValue = (candidateName: string) => {
            const value = candidateValues.find(candidate => candidate.candidateName === candidateName)?.value ?? null;
            return value ? Number((value * 100).toFixed(1)): null;
        }

        const dataPoint: DataPoint = {
            date,
            'Donald Trump': getCandidateValue("Donald Trump"),
            'Kamala Harris': getCandidateValue("Kamala Harris"),
        };
        return dataPoint;
    });

    return dataPoints
}

const consolidateDataPoints = (dataPoints: DataPoint[], getTimeUnit: (date: Date) => void, maxRecords: number) => {
    let consolidatedDataPoints = [];
    const timeMarkersSet = new Set();

    for (let i = 0; i < dataPoints.length; i++) {
        const dataPoint = dataPoints[i];
        const timeMarker = getTimeUnit(new Date(dataPoint.date)); // date.getHours()

        if (!timeMarkersSet.has(timeMarker)) {
            consolidatedDataPoints.push(dataPoint);
            timeMarkersSet.add(timeMarker);
        }

        // Stop if we have collected maxRecords data points
        if (consolidatedDataPoints.length === maxRecords) {
            break;
        }
    }

    // Ensure the most recent data point is included
    // if (consolidatedDataPoints.length < maxRecords) {
    //     consolidatedDataPoints.unshift(dataPoints[0]);
    // }

    consolidatedDataPoints = consolidatedDataPoints.slice(0, maxRecords);
    consolidatedDataPoints = consolidatedDataPoints.reverse();

    return consolidatedDataPoints;
}

const fetchBettingData = async () => {
    const now = new Date();
    const startTime = new Date(now.getTime() - (24 * 60 * 60 * 1000) * 90); // 90 days ago

    const records = await prisma.forecasts.findMany({
        where: {
            timestamp: {
                gte: startTime,
            },
            market: {
                not: 'Metaculus',
            },
        },
        orderBy: {
            timestamp: 'desc',
        },
    });
    const dataPoints = buildBettingDataPoints(records);

    const dailyDataPoints = consolidateDataPoints(dataPoints, (date: Date) => date.getHours(), 24);
    const weeklyDataPoints = consolidateDataPoints(dataPoints, (date: Date) => date.getDay(), 7);
    const monthlyDataPoints = consolidateDataPoints(dataPoints, (date: Date) => date.getDate(), 30);

    return {
        [DateRange.Daily]: dailyDataPoints,
        [DateRange.Weekly]: weeklyDataPoints,
        [DateRange.Monthly]: monthlyDataPoints,
        totalVolume: 350000000 // TODO: Calculate total volume
    };
}

async function fetchHeadlines() {
    const headlines = await prisma.headlines.findMany({
        orderBy: {
            timestamp: 'desc',
        },
        take: 15,
    });
    
    const formattedHeadlines = headlines.filter((headline: any) => headline.source !== "Fox News").map((headline: any) => (
        {
            title: headline.title,
            url: headline.url,
            image: headline.image,
            timestamp: headline.timestamp,
            source: {
                name: headline.source,
                image: buildFaviconSource(headline.url),
            }
        }
    ));
    return formattedHeadlines.slice(0, 7);
}

async function fetchPollingData() {
    const polls = await prisma.polls.findMany({
        orderBy: {
            timestamp: 'desc',
        },
    });

    // Group records that belong to the same poll
    const groupedByPollId = polls.reduce((acc: { [key: string]: any[] }, poll) => {
        if (!acc[poll.pollId]) {
            acc[poll.pollId] = [];
        }
        acc[poll.pollId].push(poll);
        return acc;
    }, {});
    let pollingData = Object.keys(groupedByPollId).map((pollId: string) => {
        const records = groupedByPollId[pollId];
        const trumpRecord = records.find(record => record.candidateName === "Donald Trump");
        const harrisRecord = records.find(record => record.candidateName === "Kamala Harris");
        const date = (new Date(trumpRecord.timestamp)).getTime();
        
        // For polls that only included one or the other
        if (!trumpRecord || !harrisRecord) {
            return null;
        }

        // Because Kamala is new, we set June as the cutoff date
        const cutoffTimestamp = new Date('2024-06-10').getTime();
        if (date < cutoffTimestamp) {
            return null;
        }

        return {
            date,
            createdAt: trumpRecord.createdAt,
            trump: trumpRecord.value,
            harris: harrisRecord.value,
            sampleSize: trumpRecord.sampleSize,
        }
    });
    pollingData = pollingData.filter((poll: any) => poll !== null);

    // Sort by date
    pollingData = pollingData.sort((a, b) => {
        if (a && b) {
            return a.createdAt - b.createdAt;
        }
        return 0;
    });

    const now = new Date().getTime();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

    const lastSevenDaysData = pollingData.filter((poll: any) => poll.date >= sevenDaysAgo);
    const lastThirtyDaysData = pollingData.filter((poll: any) => poll.date >= thirtyDaysAgo);

    return {
        [DateRange.Weekly]: lastSevenDaysData,
        [DateRange.Monthly]: lastThirtyDaysData
    }
}

export async function GET(request: Request) {
        const [forecasts, bettingData, headlines, pollingData] = await Promise.all([
            fetchForecasts(),
            fetchBettingData(),
            fetchHeadlines(),
            fetchPollingData()
        ]);
        const { trumpForecast, harrisForecast, lastUpdated } = forecasts;
    
        return NextResponse.json({ trumpForecast, harrisForecast, bettingData, pollingData, headlines, lastUpdated });
}

export const revalidate = 300;
