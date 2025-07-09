import axios from "axios";

import { urls, baseURL } from "../configs/urls";

const axiosService = axios.create({ baseURL });

const weatherServices = {
  getWetherByCityName: (cityName: string) => axiosService.get(urls.wetherByCityName(cityName)),
  getWetherDetailsByCityName: (cityName: string) =>
    axiosService.get(urls.wetherDetailsByCityName(cityName)),
};

export { weatherServices };
