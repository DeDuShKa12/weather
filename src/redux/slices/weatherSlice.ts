import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { weatherServices } from "../../services/weatherService";
import { ForecastItem, WeatherResponse } from "../../interfaces/weatherInterfaces";

interface WeatherState {
  cities: string[];
  weatherData: Record<string, WeatherResponse>;
  hourly: Record<string, ForecastItem[]>;
  statusByCity: Record<string, "idle" | "loading" | "failed">;
  error: string | null;
}

const initialState: WeatherState = {
  cities: [],
  weatherData: {},
  hourly: {},
  statusByCity: {},
  error: null,
};

export const fetchWeatherByCityName = createAsyncThunk<
  { city: string; data: WeatherResponse },
  string,
  { rejectValue: string }
>("weatherSlice/fetchWeatherByCityName", async (city, { rejectWithValue }) => {
  try {
    const { data } = await weatherServices.getWetherByCityName(city);

    return { city, data: data };
  } catch (e) {
    const err = e as AxiosError;
    return rejectWithValue(err.response?.statusText || "Not Found");
  }
});

export const fetchHourlyForecast = createAsyncThunk(
  "weather/fetchHourlyForecast",
  async ({ city }: { city: string }, { rejectWithValue }) => {
    try {
      const { data } = await weatherServices.getWetherDetailsByCityName(city);

      return { city, hourly: data.list.slice(0, 12) };
    } catch (e) {
      const err = e as AxiosError;
      return rejectWithValue(err.response?.data);
    }
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    addCity: (state, action: PayloadAction<string>) => {
      if (!state.cities.includes(action.payload)) {
        state.cities.push(action.payload);
      }
    },
    removeCity: (state, action: PayloadAction<string>) => {
      const city = action.payload;
      state.cities = state.cities.filter((c) => c !== city);
      delete state.weatherData[city];
      delete state.hourly[city];
      delete state.statusByCity[city];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherByCityName.pending, (state, action) => {
        const city = action.meta.arg;
        state.statusByCity[city] = "loading";
        state.error = null;
      })
      .addCase(fetchWeatherByCityName.fulfilled, (state, action) => {
        const city = action.payload.city;
        state.statusByCity[city] = "idle";
        state.weatherData[city] = action.payload.data;
      })
      .addCase(fetchWeatherByCityName.rejected, (state, action) => {
        const city = action.meta.arg;
        state.statusByCity[city] = "failed";
        state.error = action.payload || "Error";
      })
      .addCase(fetchHourlyForecast.fulfilled, (state, action) => {
        state.hourly[action.payload.city] = action.payload.hourly;
      });
  },
});

export const { addCity, removeCity } = weatherSlice.actions;
export default weatherSlice.reducer;
