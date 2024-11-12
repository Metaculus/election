import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";
import DateRange from "@/app/types/DateRange";

const SelectTimePeriod = ({
  includeDaily,
  defaultValue,
  onSelect,
}: {
  includeDaily: boolean;
  defaultValue?: number;
  onSelect: (timeRange: DateRange) => void;
}) => {
  return (
    <Select onValueChange={(value: string) => onSelect(value as DateRange)}>
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder={`Last ${defaultValue ?? "7"} days`} />
      </SelectTrigger>
      <SelectContent>
        {includeDaily && <SelectItem value="Daily">Last 24 hours</SelectItem>}
        <SelectItem value="Weekly">Last 7 days</SelectItem>
        <SelectItem value="Monthly">Last 30 days</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SelectTimePeriod;
