# Who Will Win?

Single-page NextJS app featuring real-time forecasting, betting odds, polls, and news for any given election. It's currently set up for the 2024 presidential election, but could be repurposed for tracking any election.

## Running locally

> This assumes you have a Postgres database up and running. When you first spin up the database, make sure to run `npx prisma db push` to initialize the tables.

First, install the dependencies:

```bash
npm install
```

Then, create a `.env` file in the root directory of this codebase with the following variables:

```bash
API_URL="http://localhost:3000/api"
DATABASE_URI="" # Postgres URI goes here
SECRET_KEY="jOFASFL3foj3oi4p32O3%$" # Used to authenticate requests from the cron job
NEWSDATA_API_KEY="" # Get one here: https://newsdata.io/free-news-api
METACULUS_API_KEY=""
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the site.

To actually populate the site with data, you need to run a cron job that periodically hits the [http://localhost:3000/api/refresh](http://localhost:3000/api/refresh) endpoint. This will fetch the latest data from Metaculus, Polymarket, PredictIt, 538 (polls), and news, and add it to the database. Make sure to include the `SECRET_KEY` (from the `.env` file above) in the authorization header of the request.

## Acknowledgements

Built by [Jonathan Shobrook](https://github.com/shobrook) and originally used to power [willtrumpwin.com](https://willtrumpwin.com) (now associated with Kalshi).
