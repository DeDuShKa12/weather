import { useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import { fetchHourlyForecast, fetchWeatherByCityName } from "../redux/slices/weatherSlice";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";

import { Spiner } from "./Spiner";

type Props = {
  city: string;
};

const CityDetails = ({ city }: Props) => {
  const dispatch = useAppDispatch();

  const weather = useAppSelector((state) => state.weatherSlice.weatherData[city]);
  const hourly = useAppSelector((state) => state.weatherSlice.hourly[city]);

  useEffect(() => {
    if (!weather) {
      dispatch(fetchWeatherByCityName(city));
    } else if (!hourly) {
      dispatch(fetchHourlyForecast({ city }));
    }
  }, [city, weather, hourly, dispatch]);

  const iconUrl = weather?.weather[0]?.icon
    ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    : "";

  const data =
    hourly?.map((h) => ({
      time: new Date(h.dt * 1000).getHours() + ":00",
      temp: Math.round(h.main.temp),
    })) || [];

  if (!weather || !hourly) {
    return <Spiner className="absolute top-1 right-8" />;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md relative">
      <div className="flex items-center gap-4 mb-4">
        {iconUrl && <img src={iconUrl} alt="weather icon" className="w-16 h-16 object-contain" />}
        <div>
          <h2 className="text-3xl font-bold text-blue-800 capitalize">{city}</h2>
          <p className="text-gray-600">
            {weather.weather[0].description},{" "}
            <span className="font-semibold">{Math.round(weather.main.temp)}°C</span>
          </p>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-2">Hourly Temperature Forecast</h3>

      <div className="w-full h-72 bg-white rounded-lg p-4 border">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" stroke="#888" />
            <YAxis stroke="#888" />
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
    </div>
  );
};

export { CityDetails };
