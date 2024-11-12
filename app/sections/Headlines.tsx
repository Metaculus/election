"use client";

import React, { useState } from "react";
import NewsCard from "@/app/components/NewsCard";
import Headline from "@/app/types/Headline";
import { toTuples } from "@/app/lib/utils";
import { IoIosArrowDown } from "react-icons/io";

const Headlines = ({ headlines }: { headlines: Headline[] }) => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const [firstHeadline, ...otherHeadlines] = headlines;

  return (
    <div>
      <div className="pt-12 pb-3 flex items-center justify-between">
        <h3 className="font-primary text-2xl">Latest News</h3>
      </div>
      <p className="text-gray-text">
        Below are the latest high-ranking news stories related to the election.
        These can help explain changes in trends. Sourced from{" "}
        <a className="text-bright-orange underline" href="https://newsdata.io/">
          NewsData.
        </a>
      </p>
      {/* Mobile */}
      <div className="flex flex-col justify-between gap-[15px] mt-5 md:hidden">
        {headlines.slice(0, 3).map((headline: Headline, index: number) => (
          <NewsCard
            key={index}
            headlineData={headline}
            isPrimary={index === 0}
          />
        ))}
      </div>
      {/* Desktop */}
      <div className="hidden md:flex md:justify-between md:gap-[15px] md:mt-5">
        <NewsCard headlineData={firstHeadline} isPrimary={true} />
        <div className="flex flex-col gap-[15px] w-1/2 justify-between">
          {otherHeadlines
            .slice(0, 2)
            .map((headline: Headline, index: number) => (
              <NewsCard key={index} headlineData={headline} isPrimary={false} />
            ))}
        </div>
      </div>

      {headlines.length > 3 && (
        <div className="relative">
          {!showMore && (
            <div
              className="absolute top-[5px] w-full h-full z-[1] font-normal text-gray-text text-[14px] cursor-pointer"
              onClick={() => setShowMore((prev) => !prev)}
            >
              <div className="flex justify-center items-center gap-2 hover:text-black">
                <span>Show more</span> <IoIosArrowDown className="mt-[3px]" />
              </div>
            </div>
          )}
          <div
            className={`flex flex-col justify-between gap-[15px] mt-[15px] ${
              showMore ? "h-full" : "h-[15px] fade-out"
            } overflow-hidden`}
          >
            {toTuples(otherHeadlines.slice(2)).map(
              ([headlineA, headlineB], index: number) => (
                <div
                  key={index}
                  className="hidden md:flex md:gap-[15px] md:w-full md:justify-between"
                >
                  <NewsCard headlineData={headlineA} isPrimary={false} />
                  {headlineB && (
                    <NewsCard headlineData={headlineB} isPrimary={false} />
                  )}
                </div>
              )
            )}
            {otherHeadlines
              .slice(2)
              .map((headline: Headline, index: number) => (
                <div key={index} className="md:hidden">
                  <NewsCard headlineData={headline} isPrimary={false} />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Headlines;
