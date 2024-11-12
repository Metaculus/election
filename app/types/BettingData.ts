import DataPoint from "./DataPoint";
import DateRange from "./DateRange";

type BettingData = {
    [DateRange.Daily]: DataPoint[];
    [DateRange.Weekly]: DataPoint[];
    [DateRange.Monthly]: DataPoint[];
    totalVolume: number;
}

export default BettingData;