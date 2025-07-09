import { render, screen } from "@testing-library/react";

import { CityDetails } from "../src/components/CityWeatherDetails";
import * as reduxHooks from "../src/hooks/reduxHook";

jest.mock("../src/hooks/reduxHook");

describe("CityDetails", () => {
  const useAppSelector = reduxHooks.useAppSelector as jest.Mock;
  const useAppDispatch = reduxHooks.useAppDispatch as jest.Mock;

  const mockDispatch = jest.fn();

  beforeEach(() => {
    useAppDispatch.mockReturnValue(mockDispatch);
  });

  it("shows spinner if data is not loaded", () => {
    useAppSelector.mockImplementation((selectorFn) =>
      selectorFn({
        weatherSlice: {
          weatherData: {},
          hourly: {},
        },
      })
    );

    render(<CityDetails city="Kyiv" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders chart and data when weather and hourly are present", () => {
    useAppSelector.mockImplementation((selectorFn) =>
      selectorFn({
        weatherSlice: {
          weatherData: {
            Kyiv: {
              weather: [{ icon: "01d", description: "sunny" }],
              main: { temp: 26 },
            },
          },
          hourly: {
            Kyiv: [
              { dt: 1620000000, main: { temp: 22 } },
              { dt: 1620003600, main: { temp: 23 } },
            ],
          },
        },
      })
    );

    render(<CityDetails city="Kyiv" />);

    expect(screen.getByText("Kyiv")).toBeInTheDocument();
    expect(screen.getByText(/26°C/)).toBeInTheDocument();
    expect(screen.getByText(/Hourly Temperature Forecast/)).toBeInTheDocument();
  });
});
