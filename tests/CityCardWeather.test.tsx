import { render, screen, fireEvent } from "@testing-library/react";

import { WeatherResponse } from "../src/interfaces/weatherInterfaces";
import { CityCardWeather } from "../src/components/CityCardWeather";

const mockWeather: WeatherResponse = {
  weather: [{ description: "clear sky", icon: "01d", id: 1, main: "Clear" }],
  main: { temp: 25 },
  name: "Kyiv",
} as WeatherResponse;

describe("CityCardWeather", () => {
  it("renders city name and temperature", () => {
    render(
      <CityCardWeather
        city="Kyiv"
        weatherData={mockWeather}
        isLoading={false}
        onRefresh={jest.fn()}
        onRemove={jest.fn()}
        onOpenModal={jest.fn()}
      />
    );

    expect(screen.getByText("Kyiv")).toBeInTheDocument();
    expect(screen.getByText(/25°C/)).toBeInTheDocument();
    expect(screen.getByAltText("weather icon")).toBeInTheDocument();
  });

  it("calls onRefresh and onRemove when buttons are clicked", () => {
    const onRefresh = jest.fn();
    const onRemove = jest.fn();

    render(
      <CityCardWeather
        city="Kyiv"
        weatherData={mockWeather}
        isLoading={false}
        onRefresh={onRefresh}
        onRemove={onRemove}
        onOpenModal={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Refresh"));
    fireEvent.click(screen.getByText("Remove"));

    expect(onRefresh).toHaveBeenCalledWith("Kyiv");
    expect(onRemove).toHaveBeenCalledWith("Kyiv");
  });
});
