import {describe,expect,it,vi} from "vitest";
import {render,screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import Header from "./Header";
vi.mock("../../contexts/CartContext",()=>({useCart:()=>({count:2})}));
vi.mock("../../contexts/AuthContext",()=>({useAuth:()=>({user:null,loading:false})}));
vi.mock("../../contexts/NotificationContext",()=>({useNotifications:()=>({unreadCount:0})}));
vi.mock("../../contexts/LanguageContext",()=>({useLanguage:()=>({language:"en",setLanguage:vi.fn(),t:(s:string)=>s})}));
describe("Header",()=>{
 it("renders the approved brand wordmark and catalog links",()=>{
  render(<MemoryRouter><Header/></MemoryRouter>);
  expect(screen.getByRole("img",{name:"Parts Hub"})).toHaveAttribute("src","/brand/parts-hub-wordmark.png");
  expect(screen.getByRole("link",{name:/parts hub home/i})).toBeInTheDocument();
  expect(screen.getByRole("link",{name:/car parts/i})).toHaveAttribute("href","/cars");
  expect(screen.getByRole("button",{name:"Open menu"})).toBeInTheDocument();
 });
});
