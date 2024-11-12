import React from "react";

import { twMerge } from "tailwind-merge";

export const ChartTooltipFrame = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div
    className={twMerge(
      "rounded-tremor-default text-tremor-default border",
      "bg-tremor-background shadow-tremor-dropdown border-tremor-border"
    )}
  >
    {children}
  </div>
);

export interface ChartTooltipRowProps {
  value: string;
  name: string;
  color: string;
}

interface ColorClassNames {
  bgColor: string;
  hoverBgColor: string;
  selectBgColor: string;
  textColor: string;
  selectTextColor: string;
  hoverTextColor: string;
  borderColor: string;
  selectBorderColor: string;
  hoverBorderColor: string;
  ringColor: string;
  strokeColor: string;
  fillColor: string;
}

const colorValues = [
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];

const getIsBaseColor = (color: string) => colorValues.includes(color);
const getIsArbitraryColor = (color: string) =>
  color.includes("#") || color.includes("--") || color.includes("rgb");

function getColorClassNames(color: string, shade?: number): ColorClassNames {
  const isBaseColor = getIsBaseColor(color);
  if (
    color === "white" ||
    color === "black" ||
    color === "transparent" ||
    !shade ||
    !isBaseColor
  ) {
    const unshadedColor = !getIsArbitraryColor(color) ? color : `[${color}]`;
    return {
      bgColor: `bg-${unshadedColor} dark:bg-${unshadedColor}`,
      hoverBgColor: `hover:bg-${unshadedColor} dark:hover:bg-${unshadedColor}`,
      selectBgColor: `ui-selected:bg-${unshadedColor} dark:ui-selected:bg-${unshadedColor}`,
      textColor: `text-${unshadedColor} dark:text-${unshadedColor}`,
      selectTextColor: `ui-selected:text-${unshadedColor} dark:ui-selected:text-${unshadedColor}`,
      hoverTextColor: `hover:text-${unshadedColor} dark:hover:text-${unshadedColor}`,
      borderColor: `border-${unshadedColor} dark:border-${unshadedColor}`,
      selectBorderColor: `ui-selected:border-${unshadedColor} dark:ui-selected:border-${unshadedColor}`,
      hoverBorderColor: `hover:border-${unshadedColor} dark:hover:border-${unshadedColor}`,
      ringColor: `ring-${unshadedColor} dark:ring-${unshadedColor}`,
      strokeColor: `stroke-${unshadedColor} dark:stroke-${unshadedColor}`,
      fillColor: `fill-${unshadedColor} dark:fill-${unshadedColor}`,
    };
  }
  return {
    bgColor: `bg-${color}-${shade} dark:bg-${color}-${shade}`,
    selectBgColor: `ui-selected:bg-${color}-${shade} dark:ui-selected:bg-${color}-${shade}`,
    hoverBgColor: `hover:bg-${color}-${shade} dark:hover:bg-${color}-${shade}`,
    textColor: `text-${color}-${shade} dark:text-${color}-${shade}`,
    selectTextColor: `ui-selected:text-${color}-${shade} dark:ui-selected:text-${color}-${shade}`,
    hoverTextColor: `hover:text-${color}-${shade} dark:hover:text-${color}-${shade}`,
    borderColor: `border-${color}-${shade} dark:border-${color}-${shade}`,
    selectBorderColor: `ui-selected:border-${color}-${shade} dark:ui-selected:border-${color}-${shade}`,
    hoverBorderColor: `hover:border-${color}-${shade} dark:hover:border-${color}-${shade}`,
    ringColor: `ring-${color}-${shade} dark:ring-${color}-${shade}`,
    strokeColor: `stroke-${color}-${shade} dark:stroke-${color}-${shade}`,
    fillColor: `fill-${color}-${shade} dark:fill-${color}-${shade}`,
  };
}

const colorPalette = {
  canvasBackground: 50,
  lightBackground: 100,
  background: 500,
  darkBackground: 600,
  darkestBackground: 800,
  lightBorder: 200,
  border: 500,
  darkBorder: 700,
  lightRing: 200,
  ring: 300,
  iconRing: 500,
  lightText: 400,
  text: 500,
  iconText: 600,
  darkText: 700,
  darkestText: 900,
  icon: 500,
};

export const ChartTooltipRow = ({
  value,
  name,
  color,
}: ChartTooltipRowProps) => (
  <div className="flex items-center justify-between space-x-8">
    <div className="flex items-center space-x-2">
      <span
        className={twMerge(
          "shrink-0 rounded-tremor-full border-2 h-3 w-3",
          "border-tremor-background shadow-tremor-card",
          getColorClassNames(color, colorPalette.background).bgColor
        )}
      />
      <p
        className={twMerge(
          "text-right whitespace-nowrap",
          "text-tremor-content"
        )}
      >
        {name}
      </p>
    </div>
    <p
      className={twMerge(
        "font-medium tabular-nums text-right whitespace-nowrap",
        "text-tremor-content-emphasis"
      )}
    >
      {value}
    </p>
  </div>
);

export interface ChartTooltipProps {
  active: boolean | undefined;
  payload: any;
  label: string;
  categoryColors: Map<string, string>;
  valueFormatter: {
    (value: number): string;
  };
}

const ChartTooltip = ({
  active,
  payload,
  label,
  categoryColors,
  valueFormatter,
}: ChartTooltipProps) => {
  if (active && payload) {
    const filteredPayload = payload.filter((item: any) => item.type !== "none");
    filteredPayload.forEach((item: any) => console.log(item));
    const shortNameToFullName: { [key: string]: string } = {
      harris: "Kamala Harris",
      trump: "Donald Trump",
    };

    return (
      <ChartTooltipFrame>
        <div
          className={twMerge(
            "border-tremor-border border-b px-4 py-2",
            "dark:border-dark-tremor-border"
          )}
        >
          <p className={twMerge("font-medium", "text-tremor-content-emphasis")}>
            {new Date(label).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            })}
          </p>
        </div>

        <div className={twMerge("px-4 py-2 space-y-1")}>
          {filteredPayload.map(
            ({ value, name }: { value: number; name: string }, idx: number) =>
              name !== "Donald Trump" &&
              name !== "Kamala Harris" && (
                <ChartTooltipRow
                  key={`id-${idx}`}
                  value={`${value}%`}
                  name={shortNameToFullName[name] ?? name}
                  color={categoryColors.get(name) ?? "gray"}
                />
              )
          )}
        </div>
      </ChartTooltipFrame>
    );
  }

  return null;
};

export default ChartTooltip;
