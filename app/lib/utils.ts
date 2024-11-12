import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx"
import DataPoint from "@/app/types/DataPoint";
import DateRange from "@/app/types/DateRange";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // Difference in seconds

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];

  for (let i = 0; i < intervals.length; i++) {
    const interval = intervals[i];
    const count = Math.floor(diff / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

export const toMillions = (value: number) => '$' + Math.ceil(value / 1000000) + 'M';

export const getUrlDomain = (url: string) => {
  const urlObject = new URL(url);

  return urlObject.hostname.replace('www.', '');
};

export const buildFaviconSource = (url: string) => {
  const domain = getUrlDomain(url);
  const params = new URLSearchParams();
  params.set('sz', '32');
  params.set('domain_url', domain);

  return `https://www.google.com/s2/favicons?${params.toString()}`;
};

export const getHoursFromNow = (date: Date): number => {
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60)); // Convert milliseconds to hours
  return diffInHours;
};

export const setDateLabels = (dataPoints: DataPoint[], dateRange: DateRange) => {
  return dataPoints.map((dataPoint: DataPoint, index: number) => {
      const date = new Date(dataPoint.date);
      const numHours = dataPoints.length - index - 1 // getHoursFromNow(date);
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short'
      });

      switch (dateRange) {
          case DateRange.Daily:
              dataPoint.label = `${numHours === 0 ? '' : '-'}${numHours}h`;
              break;
          case DateRange.Weekly:
          case DateRange.Monthly:
              dataPoint.label = formattedDate;
              break;
      }

      return dataPoint;
  });
}

export const calculateWeightedMovingAverage = (
  data: { date: number; createdAt: number; trump: number; harris: number, sampleSize: number }[],
  days: number
) => {
  const convertToDay = (timestamp: number) => {
    const date = new Date(timestamp);
    date.setHours(23, 59, 59, 999); // Set time to the end of the day
    return date.getTime();
  };

  data = data.map(poll => ({
    ...poll,
    date: convertToDay(poll.createdAt)
  }));

  // Group polls by date
  const groupedByDate = data.reduce((acc: { [key: string]: any[] }, poll) => {
    if (poll && !acc[poll.date]) {
        acc[poll.date] = [];
    }
    if (poll) {
        acc[poll.date].push(poll);
    }
    return acc;
  }, {});
  let weightedAverages = Object.keys(groupedByDate).map((date: string) => {
      const polls = groupedByDate[date];
      const totalSampleSize = polls.reduce((acc, poll) => acc + poll.sampleSize, 0);
      const trumpWeightedAverage = polls.reduce((acc, poll) => acc + poll.trump * (poll.sampleSize / totalSampleSize), 0);
      const harrisWeightedAverage = polls.reduce((acc, poll) => acc + poll.harris * (poll.sampleSize / totalSampleSize), 0);

      return {
          date: parseInt(date, 10),
          trump: parseFloat(trumpWeightedAverage.toFixed(1)),
          harris: parseFloat(harrisWeightedAverage.toFixed(1)),
          sampleSize: totalSampleSize,
      }
  });

  const movingAverage = weightedAverages.map((_, index, array) => {
    if (index < days - 1) return null;

    const slice = array.slice(index - days + 1, index + 1);
    const totalWeight = slice.reduce((sum, item, i) => sum + (i + 1), 0);

    const trumpAvg =
      slice.reduce((sum, item, i) => sum + item.trump * (i + 1), 0) / totalWeight;
    const harrisAvg =
      slice.reduce((sum, item, i) => sum + item.harris * (i + 1), 0) / totalWeight;

    return {
      date: array[index].date,
      trump: parseFloat(trumpAvg.toFixed(1)),
      harris: parseFloat(harrisAvg.toFixed(1)),
    };
  });

  // Prepend initial points
  const initialPoints = weightedAverages.slice(0, days - 1).map(item => ({
    date: item.date,
    trump: item.trump,
    harris: item.harris,
  }));

  return [...initialPoints, ...movingAverage.filter(
    (item): item is NonNullable<typeof item> => item !== null
  )];
};

export function toTuples<T>(array: T[]): [T, T][] {
  const tuples: [T, T][] = [];
  for (let i = 0; i < array.length; i += 2) {
    tuples.push([array[i], array[i + 1]]);
  }
  return tuples;
}