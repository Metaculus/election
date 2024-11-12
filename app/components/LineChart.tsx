"use client";

import { AreaChart, EventProps } from "@tremor/react";
import DataPoint from "../types/DataPoint";
import { useState } from "react";

const LineChart = ({ chartData }: { chartData: DataPoint[] }) => {
  const [value, setValue] = useState<EventProps>(null);
  const latestValue = chartData[chartData.length - 1];
  const maxValue = Math.max(
    ...chartData.map((dataPoint) => dataPoint["Donald Trump"] ?? 0),
    ...chartData.map((dataPoint) => dataPoint["Kamala Harris"] ?? 0)
  );
  const minValue = Math.min(
    ...chartData.map((dataPoint) => dataPoint["Donald Trump"] ?? 0),
    ...chartData.map((dataPoint) => dataPoint["Kamala Harris"] ?? 0)
  );

  return (
    <div className="mt-5">
      <AreaChart
        className="h-72"
        data={chartData}
        index="label"
        categories={["Donald Trump", "Kamala Harris"]}
        colors={["orange-500", "blue-600"]}
        yAxisWidth={42}
        showGridLines={true}
        showAnimation={true}
        connectNulls={true}
        allowDecimals={false}
        noDataText="Sorry, something went wrong"
        onValueChange={(v) => setValue(v)}
        autoMinValue={false}
        minValue={Math.floor(
          Math.max(Math.round((minValue - 10) / 10) * 10, 0)
        )}
        maxValue={Math.ceil(
          Math.min(Math.round((maxValue + 10) / 10) * 10, 100)
        )}
        valueFormatter={(value) => `${value}%`}
      />
      {/* {value && <div>{JSON.stringify(value)}</div>} */}
      <div></div>
    </div>
  );
};

export default LineChart;
