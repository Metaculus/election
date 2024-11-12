"use client";

import React, { useState } from "react";
import LineChart from "@/app/components/LineChart";
import DateRange from "@/app/types/DateRange";
import SelectTimePeriod from "@/app/components/SelectTimePeriod";
import BettingData from "@/app/types/BettingData";
import { setDateLabels, toMillions } from "@/app/lib/utils";
import MiniCandidateThumbnail from "../components/MiniCandidateThumbnail";
import CandidateForecast from "../types/CandidateForecast";
import DataPoint from "../types/DataPoint";

const calculateDelta = (
  data: DataPoint[],
  name: "Donald Trump" | "Kamala Harris"
) => {
  const current = data[data?.length - 1]?.[name] ?? 0;
  const previous = data[data?.length - 2]?.[name] ?? 0;

  return current - previous;
};

const BettingOdds = ({ data }: { data: BettingData }) => {
  const [timeRange, setTimeRange] = useState<DateRange>(DateRange.Weekly);

  const getLatestOdds = (name: "Donald Trump" | "Kamala Harris") =>
    ({
      name,
      value: data[timeRange][data[timeRange].length - 1][name],
      delta: calculateDelta(data[timeRange], name),
      image: name === "Donald Trump" ? "/trump.webp" : "/harris.webp",
    } as CandidateForecast);
  const trumpOdds = getLatestOdds("Donald Trump");
  const harrisOdds = getLatestOdds("Kamala Harris");

  return (
    <div>
      <div className="pt-12 pb-3 flex items-center justify-between">
        <h3 className="font-primary text-2xl">Betting Odds</h3>
        <SelectTimePeriod includeDaily={true} onSelect={setTimeRange} />
      </div>
      <p className="text-gray-text">
        <a
          className="text-bright-orange underline"
          href="https://researchdmr.com/RothschildPOQ2009.pdf"
        >
          Studies show
        </a>{" "}
        that political betting markets beat polls as leading predictors of
        elections. Below is an updating average of the odds from the two largest
        American markets:{" "}
        <a
          className="text-bright-orange underline"
          href="https://polymarket.com/event/presidential-election-winner-2024"
        >
          Polymarket
        </a>{" "}
        and{" "}
        <a
          className="text-bright-orange underline"
          href="https://www.predictit.org/markets/detail/7456/Who-will-win-the-2024-US-presidential-election"
        >
          PredictIt.
        </a>
        {/* {" "}
        ({toMillions(data.totalVolume)} in total volume). */}
      </p>
      <LineChart chartData={setDateLabels(data[timeRange], timeRange)} />
      <div className="hidden md:flex md:items-center md:justify-between md:gap-3 md:mt-5">
        <MiniCandidateThumbnail data={trumpOdds} />
        <MiniCandidateThumbnail data={harrisOdds} />
      </div>
      <div className="md:hidden flex flex-col gap-2 mt-5">
        <MiniCandidateThumbnail data={trumpOdds} />
        <MiniCandidateThumbnail data={harrisOdds} />
      </div>
    </div>
  );
};

export default BettingOdds;
