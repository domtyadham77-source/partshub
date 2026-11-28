import type {ReactNode} from "react";
import {describe,expect,it} from "vitest";
import {render,screen} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import {LanguageProvider} from "../contexts/LanguageContext";
import CarsPage from "./CarsPage";
import VehicleMakeCards from "../components/vehicles/VehicleMakeCards";
import {vi} from "vitest";
vi.mock("../components/layout/MainLayout",()=>({default:({children}:{children:ReactNode})=><div>{children}</div>}));
vi.mock("../components/products/ProductGrid",()=>({default:({products}:{products:any[]})=><div data-testid="vehicle-products">{products.length}</div>}));
vi.mock("../services/products",()=>({productsService:{list:async()=>[],get:async()=>null}}));
describe("CarsPage",()=>{
 it("starts with manufacturer image cards instead of dropdown fields",()=>{
  render(<BrowserRouter><LanguageProvider><CarsPage/></LanguageProvider></BrowserRouter>);
  expect(screen.getByText("Choose manufacturer")).toBeInTheDocument();
  expect(screen.getByRole("link",{name:/Chevrolet/})).toBeInTheDocument();
  expect(screen.getByRole("link",{name:/Opel/})).toBeInTheDocument();
  expect(document.querySelectorAll("select")).toHaveLength(0);
 });
 it("renders the same manufacturer card component for homepage and vehicle page",()=>{
  render(<BrowserRouter><LanguageProvider><VehicleMakeCards compact/></LanguageProvider></BrowserRouter>);
  expect(screen.getByRole("link",{name:/Mercedes-Benz/})).toBeInTheDocument();
 });
});
