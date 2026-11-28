import { beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "./LanguageContext";

function LanguageProbe() {
 const { language, setLanguage, t } = useLanguage();
 return <div>
  <button onClick={() => setLanguage(language === "en" ? "ar" : "en")}>{language === "en" ? "AR" : "EN"}</button>
  <span>{t("About us")}</span>
  <span>{t("Developed by Adham")}</span>
 </div>;
}

describe("global language and direction", () => {
 beforeEach(() => {
  localStorage.removeItem("partshub-language");
  document.documentElement.dir = "ltr";
  document.documentElement.lang = "en";
 });
 it("switches the whole document direction and persists the selected language", () => {
  render(<LanguageProvider><LanguageProbe/></LanguageProvider>);
  expect(screen.getByRole("button", { name: "AR" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "AR" }));
  expect(document.documentElement.dir).toBe("rtl");
  expect(document.documentElement.lang).toBe("ar");
  expect(localStorage.getItem("partshub-language")).toBe("ar");
  expect(screen.getByRole("button", { name: "EN" })).toBeInTheDocument();
  expect(screen.getByText("معلومات عنا")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "EN" }));
  expect(document.documentElement.dir).toBe("ltr");
  expect(document.documentElement.lang).toBe("en");
 });
});
