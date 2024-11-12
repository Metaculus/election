import { getRelativeTime } from "./lib/utils";
import BettingOdds from "./sections/BettingOdds";
import Comments from "./sections/Comments";
import Footer from "./sections/Footer";
import Forecast from "./sections/Forecast";
import Headlines from "./sections/Headlines";
import Polls from "./sections/Polls";

const getData = async () => {
  try {
    const response = await fetch(`${process.env.API_URL}/data`, {
      cache: "no-store",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return {
      trumpForecast: null,
      harrisForecast: null,
      bettingData: null,
      pollingData: null,
      headlines: null,
      lastUpdated: new Date(),
    };
  }
};

const Home = async () => {
  const {
    trumpForecast,
    harrisForecast,
    bettingData,
    pollingData,
    headlines,
    lastUpdated,
  } = await getData();

  return (
    <>
      <div className="absolute right-[15px] top-[10px] text-[13px] flex items-center gap-1">
        <span className="opacity-70 text-metaculus">Updated</span>
        <span className="text-bright-orange font-medium">
          {getRelativeTime(lastUpdated)}
        </span>
      </div>
      <div className="w-[calc(100vw-30px)] max-w-[750px]">
        <div className="flex flex-col items-center sm:pt-17 pt-[110px]">
          <h1 className="font-primary sm:text-7xl text-center text-5xl">
            Will Trump Win?
          </h1>
          <h2 className="sm:text-2xl text-gray-text pt-4 text-center text-xl">
            Live odds, polls, and news –– all in one place
          </h2>
        </div>
        {trumpForecast && harrisForecast && (
          <Forecast
            trumpForecast={trumpForecast}
            harrisForecast={harrisForecast}
          />
        )}
        {bettingData && <BettingOdds data={bettingData} />}
        {pollingData && <Polls data={pollingData} />}
        {headlines && <Headlines headlines={headlines} />}
        {/* <Comments /> */}
        <Footer />
      </div>
    </>
  );
};

export default Home;
