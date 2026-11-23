import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Keep each test isolated; Vitest does not expose Jest globals by default.
afterEach(() => cleanup());
