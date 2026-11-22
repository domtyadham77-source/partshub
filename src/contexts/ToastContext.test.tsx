import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ToastProvider, useToast } from "./ToastContext";

function Probe() {
  const { show } = useToast();
  return <button onClick={() => show("Saved successfully", "success")}>Show toast</button>;
}

describe("ToastProvider", () => {
  it("renders a toast when show is called", () => {
    render(<ToastProvider><Probe /></ToastProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));
    expect(screen.getByText("Saved successfully")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveClass("ph-toast-success");
  });

  it("dismisses a toast when its close button is pressed", () => {
    render(<ToastProvider><Probe /></ToastProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));
    fireEvent.click(screen.getByRole("button", { name: "Dismiss notification" }));
    expect(screen.queryByText("Saved successfully")).not.toBeInTheDocument();
  });
});
