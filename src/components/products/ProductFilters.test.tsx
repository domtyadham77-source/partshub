import { fireEvent,render,screen } from "@testing-library/react";
import { describe,expect,it,vi } from "vitest";
import ProductFilters from "./ProductFilters";
describe("ProductFilters",()=>{it("forwards search and category changes",()=>{const query=vi.fn(),category=vi.fn();render(<ProductFilters query="" onQueryChange={query} category="All" onCategoryChange={category}/>);fireEvent.change(screen.getByLabelText("Search products"),{target:{value:"Toyota"}});expect(query).toHaveBeenCalledWith("Toyota");fireEvent.click(screen.getByRole("button",{name:"Motorcycle parts"}));expect(category).toHaveBeenCalledWith("Motorcycle parts");});});
