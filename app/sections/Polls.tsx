"use client";

import { useState } from "react";
import { Legend } from "@tremor/react";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { calculateWeightedMovingAverage } from "@/app/lib/utils";
import { twMerge } from "tailwind-merge";
import ChartTooltip from "../components/ChartTooltip";
import DateRange from "../types/DateRange";
import SelectTimePeriod from "../components/SelectTimePeriod";
import MiniCandidateThumbnail from "../components/MiniCandidateThumbnail";
import CandidateForecast from "../types/CandidateForecast";

const Polls = ({
  data,
}: {
  data: {
    [DateRange.Weekly]: {
      date: number;
      createdAt: number;
      sampleSize: number;
      trump: number;
      harris: number;
    }[];
    [DateRange.Monthly]: {
      date: number;
      createdAt: number;
      sampleSize: number;
      trump: number;
      harris: number;
    }[];
  };
}) => {
  const [timeRange, setTimeRange] = useState<
    Exclude<DateRange, DateRange.Daily>
  >(DateRange.Monthly);

  const lineData = calculateWeightedMovingAverage(
    data[timeRange],
    timeRange === DateRange.Weekly ? 1 : 7
  );

  const trumpPolls = {
    name: "Donald Trump",
    value: lineData[lineData.length - 1].trump,
    delta:
      lineData[lineData.length - 1]?.trump -
      lineData[lineData.length - 2].trump,
    image: "/trump.webp",
  } as CandidateForecast;
  const harrisPolls = {
    name: "Kamala Harris",
    value: lineData[lineData.length - 1].harris,
    delta:
      lineData[lineData.length - 1]?.harris -
      lineData[lineData.length - 2].harris,
    image: "/harris.webp",
  } as CandidateForecast;

  const selectTimeRange = (timeRange: DateRange) => {
    if (timeRange === DateRange.Daily) {
      return;
    }

    setTimeRange(timeRange);
  };

  return (
    <div>
      <div className="pt-12 pb-3 flex items-center justify-between">
        <h3 className="font-primary text-2xl">Polls</h3>
        <SelectTimePeriod
          includeDaily={false}
          defaultValue={30}
          onSelect={selectTimeRange}
        />
      </div>
      <p className="text-gray-text">
        Below is a 7-day moving average of the latest general election polls,
        weighted based on each poll&apos;s recency and sample size. Poll results
        are sourced from{" "}
        <a
          className="text-bright-orange underline"
          href="https://projects.fivethirtyeight.com/polls/"
        >
          FiveThirtyEight.
        </a>
      </p>
      <PollsGraph data={data[timeRange]} lineData={lineData} />
      <div className="hidden md:flex md:items-center md:justify-between md:gap-3 md:mt-5">
        <MiniCandidateThumbnail data={trumpPolls} />
        <MiniCandidateThumbnail data={harrisPolls} />
      </div>
      <div className="md:hidden flex flex-col gap-2 mt-5">
        <MiniCandidateThumbnail data={trumpPolls} />
        <MiniCandidateThumbnail data={harrisPolls} />
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const favorable = payload[0]?.payload.favorable || 0;
    const unfavorable = payload[0]?.payload.unfavorable || 0;
    const difference = favorable - unfavorable;

    return (
      <div className="text-center bg-white rounded-md shadow-lg px-2">
        <p>{`${new Date(label).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}`}</p>
        <p>{difference.toFixed(2)}%</p>
      </div>
    );
  }

  return null;
};

export const constructCategoryColors = (
  categories: string[],
  colors: string[]
): Map<string, string> => {
  const categoryColors = new Map<string, string>();
  categories.forEach((category, idx) => {
    categoryColors.set(category, colors[idx % colors.length]);
  });
  return categoryColors;
};

const PollsGraph = ({
  data,
  lineData,
}: {
  data: {
    date: number;
    createdAt: number;
    trump: number;
    harris: number;
    sampleSize: number;
  }[];
  lineData: { date: number; trump: number; harris: number }[];
}) => {
  const categoryColors = constructCategoryColors(
    ["trump", "harris"],
    ["orange-500", "blue-600"]
  );
  const [legendValue, setLegendValue] = useState("");
  const scatterData = data
    .map((d) => ({
      date: new Date(d.createdAt).getTime(),
      trump: d.trump,
      harris: d.harris,
    }))
    .sort((a, b) => a.date - b.date);
  const startDate = Math.min(
    ...data.map((d) => new Date(d.createdAt).getTime())
  );
  const endDate = Math.max(...data.map((d) => new Date(d.createdAt).getTime()));
  const maxValue = Math.max(...data.map((d) => Math.max(d.trump, d.harris)));
  const minValue = Math.min(...data.map((d) => Math.min(d.trump, d.harris)));

  return (
    <div className="mt-5">
      <div className="flex items-center justify-end mb-3">
        <Legend
          categories={["Donald Trump", "Kamala Harris"]}
          colors={["orange-500", "blue-600"]}
          onClickLegendItem={(e) => {
            legendValue === e ? setLegendValue("") : setLegendValue(e);
          }}
          activeLegend={legendValue}
        />
      </div>
      <div className="w-full h-72 pb-10 -mb-10">
        <ResponsiveContainer className="w-full h-full">
          <ComposedChart margin={{ left: -14, top: 10 }}>
            <CartesianGrid
              className={twMerge("stroke-1", "stroke-tremor-border")}
              horizontal={true}
              vertical={false}
            />

            <XAxis
              tickCount={9}
              type="number"
              padding={{ left: 20, right: 20 }}
              domain={[startDate, endDate]}
              name="Date"
              dataKey="date"
              tick={{ transform: "translate(0, 6)" }}
              ticks={Array.from(
                { length: 9 },
                (_, i) => startDate + (i * (endDate - startDate)) / 8
              )}
              tickFormatter={(unixTime) =>
                new Date(unixTime).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })
              }
              fill=""
              stroke=""
              className={twMerge("text-tremor-label", "fill-tremor-content")}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              width={56}
              name="Percentage"
              domain={[
                Math.floor(Math.max(Math.round((minValue - 10) / 10) * 10, 0)),
                Math.ceil(Math.min(Math.round((maxValue + 10) / 10) * 10, 100)),
              ]}
              axisLine={false}
              tickLine={false}
              type="number"
              tick={{ transform: "translate(-3, 0)" }}
              fill=""
              stroke=""
              className={twMerge("text-tremor-label", "fill-tremor-content")}
              allowDecimals={false}
              tickFormatter={(value) => `${Math.round(value)}%`}
            />

            <Tooltip
              wrapperStyle={{ outline: "none" }}
              isAnimationActive={false}
              cursor={{ stroke: "#d1d5db", strokeWidth: 1 }}
              content={({ active, payload, label }) => (
                <ChartTooltip
                  active={active}
                  payload={payload}
                  label={label}
                  valueFormatter={(value: number) => value.toString()}
                  categoryColors={categoryColors}
                />
              )}
              position={{ y: 0 }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Scatter
              name="Donald Trump"
              data={scatterData}
              fill="#ff7300"
              dataKey="trump"
              opacity={0.2}
            />
            <Scatter
              name="Kamala Harris"
              data={scatterData}
              fill="#2463ec"
              dataKey="harris"
              opacity={0.2}
            />
            <Line
              data={lineData}
              dataKey="trump"
              stroke="#ff7300"
              strokeWidth={2}
              dot={false}
              legendType="none"
            />
            <Line
              data={lineData}
              dataKey="harris"
              stroke="#2463ec"
              strokeWidth={2}
              dot={false}
              legendType="none"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Polls;
