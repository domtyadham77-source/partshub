import {describe,expect,it} from "vitest";
import {PRODUCT_CATEGORIES} from "../types/category";
import {categoriesService} from "./categories";
describe("categoriesService",()=>{it("returns the configured categories",async()=>{await expect(categoriesService.list()).resolves.toEqual(PRODUCT_CATEGORIES);});it("finds a category by id and returns undefined for unknown ids",()=>{expect(categoriesService.get("car_parts")).toEqual(PRODUCT_CATEGORIES[0]);expect(categoriesService.get("missing")).toBeUndefined();});});