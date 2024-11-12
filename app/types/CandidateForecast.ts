type CandidateForecast = {
    name: string;
    value: number; // Forecast value (as a %)
    delta: number; // Change in forecast value (as a %)
    image: string; // Thumbnail image
}

export default CandidateForecast;