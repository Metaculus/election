"use client";

import React from "react";
import { Separator } from "@/app/components/Separator";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  XIcon,
} from "react-share";

const Footer = () => {
  return (
    <div className="pt-12 pb-6">
      <Separator className="mb-3" />
      <div className="flex items-center text-sm justify-between">
        <div className="flex items-center gap-3">
          <span>
            Powered by{" "}
            <a
              className="text-bright-orange underline"
              href="https://www.metaculus.com/"
            >
              Metaculus
            </a>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <FacebookShareButton url="https://willtrumpwin.com/">
            <FacebookIcon size={26} borderRadius={10} />
          </FacebookShareButton>
          <TwitterShareButton url="https://willtrumpwin.com/">
            <XIcon size={26} borderRadius={10} />
          </TwitterShareButton>
        </div>
      </div>
    </div>
  );
};

export default Footer;
