import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Analytics />
      <head>
        <title>Will Trump Win?</title>
        <link rel="icon" href="/favicon.png" />
        <meta
          name="description"
          content="Betting odds, polls, and news for the 2024 election –– all in one place."
        />
        <meta
          name="keywords"
          content="Trump, Harris, election, prediction, politics"
        />
        <meta name="author" content="@shobrook" />
        <meta property="og:title" content="Will Trump Win?" />
        <meta
          property="og:description"
          content="Betting odds, polls, and news for the 2024 election –– all in one place."
        />
        <meta property="og:image" content="/thumbnail.png" />
        <meta property="og:url" content="https://willtrumpwin.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Will Trump Win?" />
        <meta
          name="twitter:description"
          content="Betting odds, polls, and news for the 2024 election –– all in one place."
        />
        <meta name="twitter:image" content="/thumbnail.png" />
      </head>
      <body className="flex flex-col items-center h-screen overflow-y-auto m-0 pt-0 pb-0 pl-3 pr-3 sm:pl-5 sm:pr-5 relative">
        {children}
      </body>
    </html>
  );
}
