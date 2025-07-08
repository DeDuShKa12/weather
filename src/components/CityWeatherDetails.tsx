import { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import {
  fetchHourlyForecast,
  fetchWeatherByCityName,
} from "../redux/slices/weatherSlice";

const CityDetails = ({ city }: { city: string }) => {
  const dispatch = useAppDispatch();
  const weather = useAppSelector(
    (state) => state.weatherSlice.weatherData[city!]
  );
  const hourly = useAppSelector((state) => state.weatherSlice.hourly[city!]);

  useEffect(() => {
    if (city) {
      if (!weather) {
        dispatch(fetchWeatherByCityName(city));
      } else {
        dispatch(fetchHourlyForecast({ city }));
      }
    }
  }, [city, weather, dispatch]);

  const iconCode = weather?.weather[0]?.icon;
  const iconUrl = iconCode
    ? `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    : "";

  const data =
    hourly?.map((h) => ({
      time: new Date(h.dt * 1000).getHours() + ":00",
      temp: h.main.temp,
    })) || [];

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md relative">
      {weather && (
        <>
          <div className="flex items-center gap-4 mb-4">
            {iconUrl && (
              <img
                src={iconUrl}
                alt="weather icon"
                className="w-16 h-16 object-contain"
              />
            )}
            <div>
              <h2 className="text-3xl font-bold text-blue-800 capitalize">
                {city}
              </h2>
              <p className="text-gray-600">
                {weather.weather[0].description},{" "}
                <span className="font-semibold">{weather.main.temp}°C</span>
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Hourly Temperature Forecast
          </h3>

          <div className="w-full h-72 bg-white rounded-lg p-4 border">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="time" stroke="#888" />
                <YAxis domain={["auto", "auto"]} stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f9fafb",
                    border: "1px solid #ddd",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {(!weather || !hourly) && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <svg
            className="animate-spin h-6 w-6 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export { CityDetails };
