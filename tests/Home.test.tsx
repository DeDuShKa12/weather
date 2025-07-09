import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import router, { MemoryRouter, useNavigate } from "react-router-dom";

import { Home } from "../src/pages/Home";
import * as reduxHooks from "../src/hooks/reduxHook";
import * as weatherSlice from "../src/redux/slices/weatherSlice";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(() => ({ search: "" })),
}));

jest.mock("../src/hooks/reduxHook");

const mockDispatch = jest.fn();

describe("Home component with Redux", () => {
  const useAppDispatch = reduxHooks.useAppDispatch as jest.Mock;
  const useAppSelector = reduxHooks.useAppSelector as jest.Mock;
  const mockedUseNavigate = useNavigate as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    useAppDispatch.mockReturnValue(mockDispatch);
    mockedUseNavigate.mockReturnValue(jest.fn());

    useAppSelector.mockImplementation((selectorFn) =>
      selectorFn({
        weatherSlice: {
          cities: ["Kyiv", "Lviv"],
          weatherData: {
            Kyiv: { weather: [{ description: "clear sky", icon: "01d" }], main: { temp: 25 } },
            Lviv: { weather: [{ description: "cloudy", icon: "02d" }], main: { temp: 20 } },
          },
          hourly: {
            Kyiv: [
              { dt: 1234567890, main: { temp: 25 } },
              { dt: 1234567891, main: { temp: 26 } },
            ],
            Lviv: [
              { dt: 1234567890, main: { temp: 18 } },
              { dt: 1234567891, main: { temp: 20 } },
            ],
          },
          statusByCity: { Kyiv: "succeeded", Lviv: "succeeded" },
          error: null,
        },
      })
    );
  });

  it("renders cities from localStorage", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Kyiv")).toBeInTheDocument();
    expect(screen.getByText("Lviv")).toBeInTheDocument();
  });

  it("adds new city when clicking Add", async () => {
    mockDispatch.mockResolvedValue({
      type: "weather/fetchWeatherByCityName/fulfilled",
      payload: {},
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Enter a city...");
    const addButton = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "Odesa" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it("opens modal when URL query param has city", () => {
    jest.spyOn(router, "useLocation").mockReturnValue({ search: "?city=Kyiv" } as unknown);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Hourly Temperature Forecast")).toBeInTheDocument();
  });

  it("dispatches removeCity when Remove is clicked", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const removeButtons = screen.getAllByText("Remove");
    fireEvent.click(removeButtons[0]);

    expect(mockDispatch).toHaveBeenCalledWith(weatherSlice.removeCity("Kyiv"));
  });

  it("shows error alert if error is present in Redux state", () => {
    useAppSelector.mockImplementation((selectorFn) =>
      selectorFn({
        weatherSlice: {
          cities: [],
          weatherData: {},
          hourly: {},
          statusByCity: {},
          error: "City not found",
        },
      })
    );

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByRole("alert")).toHaveTextContent("City not found");
  });
});
