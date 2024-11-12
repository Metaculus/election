"use client";

import React from "react";
import CandidateThumbnail from "../components/CandidateThumbnail";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../components/HoverCard";
import CandidateForecast from "../types/CandidateForecast";

const Forecast = ({
  trumpForecast,
  harrisForecast,
}: {
  trumpForecast: CandidateForecast;
  harrisForecast: CandidateForecast;
}) => {
  return (
    <>
      <div className="mt-16 gap-[30px] flex flex-col bg-lightest-gray rounded-3xl pl-4 pr-4 sm:pl-9 sm:pr-9 pt-7 pb-7">
        <div className="flex items-center justify-between">
          <CandidateThumbnail data={trumpForecast} side="right" />
          <div className="md:h-[60px] h-[120px] w-[2px] bg-light-gray" />
          <CandidateThumbnail data={harrisForecast} side="left" />
        </div>
        <div className="flex justify-center items-center gap-[5px] w-full">
          <span className="text-base opacity-70 text-metaculus font-medium">
            Forecast powered by
          </span>
          <a href="https://www.metaculus.com/questions/11245/winner-of-2024-us-presidential-election/">
            <img
              className="h-[25px] cursor-pointer"
              src="./metaculus.webp"
              alt="Metaculus"
            />
          </a>
        </div>
      </div>
      <div className="pt-3 text-gray-text text-sm w-full text-center">
        <span>Metaculus is a platform for scientific forecasters.</span>{" "}
        <a
          className="underline cursor-pointer text-bright-orange"
          href="https://metaculus.medium.com/why-i-reject-the-comparison-of-metaculus-to-prediction-markets-4175553bcbb8"
        >
          How is this different from a betting market?
        </a>
      </div>
    </>
  );
};

export default Forecast;
