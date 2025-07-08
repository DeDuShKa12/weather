import { useParams } from "react-router-dom";
import { CityDetails } from "../components/CityWeatherDetails";

const CityDetailsPage = () => {
  const { city } = useParams<{ city: string }>();

  if (!city) return null;

  return <CityDetails city={city} />;
};

export { CityDetailsPage };
