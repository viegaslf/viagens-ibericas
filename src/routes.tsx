import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";
import { Destinos } from "./pages/Destinos";
import { HotelIndividual } from "./pages/Hotel Individual";
import { Teste } from "./pages/Teste";
import { Checkout } from "./pages/Checkout";
import { Conta } from "./pages/Conta";
import { Suporte } from "./pages/Suporte";
import { LogIn } from "./pages/LogIn";
import { SignUp } from "./pages/SignUp";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/teste",
    element: <Teste />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/conta",
    element: <Conta />,
  },
  {
    path: "/conta/entrar",
    element: <LogIn />,
  },
  {
    path: "/conta/registar",
    element: <SignUp />,
  },
  {
    path: "/suporte",
    element: <Suporte />,
  },
  {
    path: "/destinos",
    element: <Destinos />,
  },
  {
    path: "/destinos/hotel/:id",
    element: <HotelIndividual />,
  },
]);
