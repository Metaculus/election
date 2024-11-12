"use client";

import React, { useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";

const Comments = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <div className="pt-12 pb-3 flex items-center justify-between">
        <h3 className="font-primary text-2xl">Comments</h3>
      </div>
      <p className="text-gray-text">
        Note that comments are for informational purposes only. They are not
        monitored or assessed for accuracy. Please be respectful!
      </p>
      <script
        src="https://static.elfsight.com/platform/platform.js"
        data-use-service-core
        defer
      />
      {isExpanded ? (
        <div className="mt-5 w-full bg-lightest-gray rounded-lg p-3 min-h-[45px]">
          <div
            className="elfsight-app-d913df1f-c5b9-4db4-b099-1f99f1d2deaa"
            data-elfsight-app-lazy
          />
        </div>
      ) : (
        <div
          className="text-[14px] mt-5 w-full h-[45px] rounded-lg bg-lightest-gray flex items-center justify-center cursor-pointer text-gray-text gap-1 hover:text-black"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <IoMdAddCircleOutline size={16} />
          <span>Click to expand</span>
        </div>
      )}
    </div>
  );
};

export default Comments;
