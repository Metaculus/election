import React from "react";
import Headline from "../types/Headline";
import { getRelativeTime } from "@/app/lib/utils";

const NewsCard = ({
  headlineData,
  isPrimary,
}: {
  headlineData: Headline;
  isPrimary: boolean;
}) => {
  if (isPrimary) {
    return (
      <div className="w-full md:w-1/2 rounded-lg bg-lightest-gray">
        <div className="relative">
          <div className="absolute inset-0 bg-black opacity-60 rounded-t-lg" />
          <div className="rounded-t-lg h-[245px] w-full overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={headlineData.image}
            />
          </div>
          <a
            className="absolute bottom-4 left-4 text-white text-xl hover:underline line-clamp-5 pr-4"
            href={headlineData.url}
          >
            {headlineData.title}
          </a>
        </div>
        <div className="flex items-center justify-between h-[40px] pl-4 pr-4">
          <div className="flex items-center gap-2">
            <img
              className="w-[20px] rounded-sm"
              src={headlineData.source.image}
            />
            <span className="text-sm font-medium line-clamp-1 w-[125px]">
              {headlineData.source.name}
            </span>
          </div>
          <span className="opacity-75 text-sm">
            {getRelativeTime(headlineData.timestamp)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center w-full pl-[15px] pr-[15px] bg-lightest-gray rounded-lg h-[135px] gap-[10px]">
      <div className="w-[105px] min-w-[105px] h-[105px] overflow-hidden rounded-sm">
        <img className="w-full h-full object-cover" src={headlineData.image} />
      </div>
      <div className="flex flex-col gap-1 justify-between w-full h-[inherit] pt-[15px] pb-[15px]">
        <a className="hover:underline line-clamp-3" href={headlineData.url}>
          {headlineData.title}
        </a>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              className="w-[20px] rounded-sm"
              src={headlineData.source.image}
            />
            <span className="text-sm font-medium line-clamp-1 w-[65px] sm:w-[100px] md:max-w-[90px]">
              {headlineData.source.name}
            </span>
          </div>
          <span className="opacity-75 text-sm">
            {getRelativeTime(headlineData.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
