import { createBrowserRouter } from "react-router-dom"
import Home from "../pages/Home"
import CityDetails from "../pages/CityDetails"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/city/:city",
    element: <CityDetails />,
  },
])

export default router