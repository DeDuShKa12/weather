import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import { addCity, fetchWeatherByCityName, removeCity } from "../redux/slices/weatherSlice";
import { CityCardWeather } from "../components/CityCardWeather";
import { Modal } from "../components/Modal";
import { CityDetails } from "../components/CityWeatherDetails";

const Home = () => {
  const dispatch = useAppDispatch();
  const { cities, weatherData, statusByCity, error } = useAppSelector(
    (state) => state.weatherSlice
  );

  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [newCity, setNewCity] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryCity = new URLSearchParams(location.search).get("city");
    setSelectedCity(queryCity);
  }, [location.search]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cities") || `["Kyiv", "Lviv"]`);
    saved.forEach(async (city: string) => {
      if (!cities.includes(city)) {
        const result = await dispatch(fetchWeatherByCityName(city));
        if (fetchWeatherByCityName.fulfilled.match(result)) {
          dispatch(addCity(city));
        }
      }
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("cities", JSON.stringify(cities));
  }, [cities]);

  const handleAddCity = async () => {
    const cityTrimmed = newCity.trim();
    if (!cityTrimmed || cities.includes(cityTrimmed)) return;

    const result = await dispatch(fetchWeatherByCityName(cityTrimmed));
    if (fetchWeatherByCityName.fulfilled.match(result)) {
      dispatch(addCity(cityTrimmed));
      setNewCity("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-blue-900 mb-6">Weather Forecast</h1>

        {selectedCity && (
          <Modal onClose={() => navigate("/")}>
            <CityDetails city={selectedCity} />
          </Modal>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            className="flex-1 px-4 py-3 rounded-lg border border-blue-300"
            placeholder="Enter a city..."
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCity()}
          />
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            onClick={handleAddCity}
          >
            Add
          </button>
        </div>

        {error && (
          <div
            className="fixed bottom-5 left-5 bg-red-600 text-white px-4 py-3 rounded shadow-lg"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cities.map((city) => (
            <CityCardWeather
              key={city}
              city={city}
              weatherData={weatherData[city]}
              isLoading={statusByCity?.[city] === "loading"}
              onRefresh={() => dispatch(fetchWeatherByCityName(city))}
              onRemove={() => dispatch(removeCity(city))}
              onOpenModal={() => navigate(`/?city=${encodeURIComponent(city)}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export { Home };
