import { WeatherService } from "../services/queryWeather";
import { Modal } from "./Modal";
import { CityDetails } from "./CityWeatherDetails";
import { Spiner } from "./Spiner";

interface CityCardWeatherProps {
  city: string;
  isModalOpen: boolean;
  closeModal: () => void;
  onRemove: (city: string) => void;
  onOpenModal: (city: string) => void;
}

const CityCardWeather = ({
  city,
  isModalOpen,
  closeModal,
  onRemove,
  onOpenModal,
}: CityCardWeatherProps) => {
  const { data, refetch, isLoading, isFetching } =
    WeatherService.useWeatherByCityName(city);
  const icon = data?.weather[0]?.icon;
  const iconUrl = icon
    ? `https://openweathermap.org/img/wn/${icon}@2x.png`
    : "";

  return (
    <>
      {isModalOpen && (
        <Modal onClose={() => closeModal()}>
          <CityDetails city={city} />
        </Modal>
      )}
      <div className="relative bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
        {isFetching && <Spiner className="absolute top-3 right-3" />}

        <div
          onClick={() => onOpenModal(city)}
          className="cursor-pointer group flex items-center gap-4"
        >
          {icon && (
            <img
              src={iconUrl}
              alt="weather icon"
              className="w-16 h-16 object-contain"
            />
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-800 group-hover:underline">
              {city}
            </h2>
            {data ? (
              <p className="text-gray-600 mt-1 capitalize">
                {data.weather[0].description},{" "}
                <span className="font-semibold">{data.main.temp}°C</span>
              </p>
            ) : (
              <p className="text-gray-400 mt-1">Loading data...</p>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => refetch()}
            className="bg-yellow-400 hover:bg-yellow-500 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
            disabled={isLoading}
          >
            Refresh
          </button>
          <button
            onClick={() => onRemove(city)}
            className="bg-red-500 hover:bg-red-600 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium"
            disabled={isLoading}
          >
            Remove
          </button>
        </div>
      </div>
    </>
  );
};

export { CityCardWeather };
