import axios from "axios";
import { urls } from "../configs/urls";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { ApiError, WeatherResponse } from "../interfaces/weatherInterfaces";

export const WeatherService = {
  useWeatherByCityName: (
    cityName: string,
    options?: UseQueryOptions<WeatherResponse, ApiError>
  ) => {
    const req = async () => {
      const res = await axios.get(urls.wetherByCityName(cityName));
      return res.data;
    };

    return useQuery<WeatherResponse, ApiError>({
      queryKey: ["useWeatherByCityName", cityName],
      queryFn: req,
      ...options,
    });
  },
  useWeatherByCityNameMutation: (
    options?: UseMutationOptions<
      WeatherResponse,
      ApiError,
      { cityName: string }
    >
  ) => {
    const req = async ({ cityName }: { cityName: string }) => {
      const res = await axios.get(urls.wetherByCityName(cityName));
      return res.data;
    };

    return useMutation<WeatherResponse, ApiError, { cityName: string }>({
      mutationFn: req,
      ...options,
    });
  },
  useWetherDetailsByCityName: (
    cityName: string,
    options?: UseQueryOptions<any, ApiError>
  ) => {
    const req = async () => {
      console.log(urls.wetherDetailsByCityName(cityName));

      const res = await axios.get(urls.wetherDetailsByCityName(cityName));
      return res.data;
    };

    return useQuery<any, ApiError>({
      queryKey: ["useWetherDetailsByCityName", cityName],
      queryFn: req,
      ...options,
    });
  },
};
