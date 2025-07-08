import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { WeatherService } from "../services/queryWeather";
import { Spiner } from "./Spiner";

const CityDetails = ({ city }: { city: string }) => {
  console.log({ city });

  const { data: weather, isLoading } =
    WeatherService.useWeatherByCityName(city);
  const { data: detailedWeather, isLoading: isLoadingDetails } =
    WeatherService.useWetherDetailsByCityName(city);

  const hourly = useMemo(() => {
    return detailedWeather?.list?.slice(0, 12) || [];
  }, [detailedWeather]);

  const iconCode = weather?.weather[0]?.icon;
  const iconUrl = iconCode
    ? `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    : "";

  const data =
    hourly?.map((h: any) => ({
      time: new Date(h.dt * 1000).getHours() + ":00",
      temp: h.main.temp,
    })) || [];

  return (
    <div className="bg-white p-4 rounded-xl shadow-md relative">
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

          <div className="w-full h-72 bg-white rounded-lg py-4 pr-4 border">
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

      {(isLoadingDetails || isLoading) && <Spiner className="absolute top-1 right-8"/>}
    </div>
  );
};

export { CityDetails };
