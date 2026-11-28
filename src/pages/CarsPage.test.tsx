import {describe,expect,it,vi} from "vitest";
import {render,screen} from "@testing-library/react";
import {LanguageProvider} from "../contexts/LanguageContext";
import CarsPage from "./CarsPage";
vi.mock("../components/layout/MainLayout",()=>({default:({children}:{children:React.ReactNode})=><div>{children}</div>}));
vi.mock("../components/products/ProductGrid",()=>({default:({products}:{products:any[]})=><div data-testid="vehicle-products">{products.length}</div>}));
vi.mock("../services/products",()=>({productsService:{list:async()=>[],get:async()=>null}}));
describe("CarsPage",()=>{it("renders the vehicle-specific selector fields",()=>{render(<LanguageProvider><CarsPage/></LanguageProvider>);expect(screen.getByText("Make")).toBeInTheDocument();expect(screen.getByText("Model")).toBeInTheDocument();expect(screen.getByText("Model year")).toBeInTheDocument();expect(screen.getByText("Engine")).toBeInTheDocument();});});
