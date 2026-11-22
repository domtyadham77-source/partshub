import {describe,expect,it} from "vitest";
import {render,screen} from "@testing-library/react";
import Footer from "./Footer";

describe("Footer",()=>{
 it("uses the approved Parts Hub wordmark",()=>{
  render(<Footer/>);
  expect(screen.getByRole("img",{name:"Parts Hub"})).toHaveAttribute("src","/brand/parts-hub-wordmark.png");
  expect(screen.getByRole("link",{name:"Parts Hub home"})).toHaveAttribute("href","/");
 });
});
