import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CityCardWeather } from "../components/CityCardWeather";
import { WeatherService } from "../services/queryWeather";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCity, setNewCity] = useState("");
  const [defaultCities, setDefaultCities] = useState<string[]>(() => {
    const stored = localStorage.getItem("cities");
    return stored ? JSON.parse(stored) : ["Kyiv", "Lviv", "Odesa", "Dnipro"];
  });

  const query = new URLSearchParams(location.search);
  const cityInQuery = query.get("city");
  const {
    mutate: fetchCityWeather,
    isError,
    error,
  } = WeatherService.useWeatherByCityNameMutation({
    onSuccess(_data, variables) {
      setDefaultCities((prev) => [...prev, variables.cityName]);
    },
  });

  useEffect(() => {
    if (cityInQuery) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [cityInQuery]);

  useEffect(() => {
    localStorage.setItem("cities", JSON.stringify(defaultCities));
  }, [defaultCities]);

  const handleAddCity = () => {
    const trimmed = newCity.trim();
    if (trimmed && !defaultCities.includes(trimmed)) {
      fetchCityWeather({ cityName: trimmed });
    }
    setNewCity("");
  };

  const openModal = (city: string) => {
    setIsModalOpen(true);
    navigate(`/?city=${encodeURIComponent(city)}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate(`/`);
  };

  const handleRemoveCity = (city: string) => {
    setDefaultCities((prev) => prev.filter((c) => c !== city));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-blue-900 mb-6">
          Weather Forecast
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            className="flex-1 px-4 py-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            placeholder="Enter a city..."
            onKeyDown={(e) => e.key === "Enter" && handleAddCity()}
          />
          <button
            onClick={handleAddCity}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
          >
            Add
          </button>
        </div>

        {isError && (
          <div
            className="fixed bottom-5 left-5 bg-red-600 text-white px-4 py-3 rounded shadow-lg animate-slideIn"
            role="alert"
          >
            {error.message}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {defaultCities.map((city) => (
            <CityCardWeather
              key={city}
              city={city}
              isModalOpen={isModalOpen}
              closeModal={closeModal}
              onRemove={handleRemoveCity}
              onOpenModal={openModal}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export { Home };
