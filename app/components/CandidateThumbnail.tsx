"use client";

import React from "react";
import { MdOutlineArrowDropUp, MdOutlineArrowDropDown } from "react-icons/md";
import CandidateForecast from "../types/CandidateForecast";
import Image from "next/image";

const CandidateThumbnail = ({
  data,
  side,
}: {
  data: CandidateForecast;
  side: "left" | "right";
}) => {
  const color = data.delta < 0 ? "text-red" : "text-green";

  const renderStats = () => {
    const deltaAdjustment = side === "left" ? "right-[-34px]" : "left-[5px]";
    const padding = side === "left" ? "pr-3" : "pl-3";

    return (
      <div className={`h-[150px] flex flex-col relative ${padding}`}>
        <span className="flex-grow flex items-center justify-center text-6xl font-semibold">
          {Math.round(data.value)}%
        </span>
        <div
          className={`absolute bottom-0 w-full flex items-center ${color} ${deltaAdjustment}`}
        >
          {data.delta < 0 ? (
            <MdOutlineArrowDropDown size={36} />
          ) : (
            <MdOutlineArrowDropUp size={36} />
          )}
          <span className="text-2xl font-semibold ml-[-4px]">
            {Math.abs(data.delta).toFixed(1)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex md:hidden">
        <div className="flex flex-col items-center">
          <Image src={data.image} alt={data.name} width={110} height={110} />
          <span className="flex-grow flex items-center justify-center text-4xl font-semibold pt-3">
            {Math.round(data.value)}%
          </span>
          <div className="flex items-center gap-1">
            <span className="text-xl font-medium">{data.name}</span>
            <div className={`w-full flex items-center ${color}`}>
              {data.delta < 0 ? (
                <MdOutlineArrowDropDown size={26} />
              ) : (
                <MdOutlineArrowDropUp size={26} />
              )}
              <span className="text-md font-semibold ml-[-3px]">
                {Math.abs(data.delta).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:flex">
        {side === "left" && renderStats()}
        <div className="flex flex-col items-center">
          <Image src={data.image} alt={data.name} width={150} height={150} />
          <span className="text-2xl font-medium pt-2">{data.name}</span>
        </div>
        {side === "right" && renderStats()}
      </div>
    </>
  );
};

export default CandidateThumbnail;
