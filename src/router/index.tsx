import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import { CityDetailsPage } from "../pages/CityDetailsPage";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/city/:city", element: <CityDetailsPage /> },
]);

export  {router};
