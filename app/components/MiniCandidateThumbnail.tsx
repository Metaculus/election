"use client";

import React from "react";
import { MdOutlineArrowDropUp, MdOutlineArrowDropDown } from "react-icons/md";
import CandidateForecast from "../types/CandidateForecast";
import Image from "next/image";

const MiniCandidateThumbnail = ({ data }: { data: CandidateForecast }) => {
  const color = data.delta < 0 ? "text-red" : "text-green";

  const renderStats = () => (
    <>
      <div className="hidden md:flex md:items-center md:gap-2">
        <Image src={data.image} alt={data.name} width={45} height={45} />
        <span className="text-lg font-medium">{data.name}</span>
      </div>
      <div className="md:hidden flex items-center gap-2">
        <Image src={data.image} alt={data.name} width={35} height={35} />
        <span className="text-lg font-medium">{data.name}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-lg font-semibold">{data.value.toFixed(1)}%</span>
        <div className={`flex items-center ${color}`}>
          {data.delta < 0 ? (
            <MdOutlineArrowDropDown size={26} />
          ) : (
            <MdOutlineArrowDropUp size={26} />
          )}
          <span className="text-md font-semibold ml-[-5px]">
            {Math.abs(data.delta).toFixed(1)}%
          </span>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="hidden md:flex md:items-center md:justify-between md:w-[50%] md:bg-lightest-gray md:rounded-lg md:px-3 md:py-3">
        {renderStats()}
      </div>
      <div className="md:hidden flex items-center justify-between w-full bg-lightest-gray rounded-lg px-3 py-3">
        {renderStats()}
      </div>
    </>
  );
};

export default MiniCandidateThumbnail;
