import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import { addCity, fetchWeatherByCityName, removeCity } from "../redux/slices/weatherSlice";
import { CityCardWeather } from "../components/CityCardWeather"

const Home = () => {
  const dispatch = useAppDispatch();
  const { cities, weatherData, statusByCity, error } = useAppSelector(
    (state) => state.weatherSlice
  );

  const [newCity, setNewCity] = useState("");

  useEffect(() => {
    const savedCities = localStorage.getItem("cities");
    if (savedCities) {
      const parsedCities: string[] = JSON.parse(savedCities);
      parsedCities.forEach((city) => {
        if (!cities.includes(city)) {
          dispatch(addCity(city));
          dispatch(fetchWeatherByCityName(city));
        }
      });
    }
  }, [cities, dispatch]);

  useEffect(() => {
    localStorage.setItem("cities", JSON.stringify(cities));
  }, [cities]);

  useEffect(() => {
    cities.forEach((city) => {
      dispatch(fetchWeatherByCityName(city));
    });
  }, [cities, dispatch]);

  const handleAddCity = async () => {
  const cityTrimmed = newCity.trim();
  if (!cityTrimmed || cities.includes(cityTrimmed)) return;
    const resultAction = await dispatch(fetchWeatherByCityName(cityTrimmed));

    if (fetchWeatherByCityName.fulfilled.match(resultAction)) {
      dispatch(addCity(cityTrimmed));
      setNewCity("");
    } 
};


  const handleRemoveCity = (city: string) => {
    dispatch(removeCity(city));
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
        {error && (
          <div
            className="fixed bottom-5 left-5 bg-red-600 text-white px-4 py-3 rounded shadow-lg animate-slideIn"
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
    onRefresh={(city: string) => dispatch(fetchWeatherByCityName(city))}
    onRemove={handleRemoveCity}
  />
))}
        </div>
      </div>
    </div>
  );
};

export default Home;