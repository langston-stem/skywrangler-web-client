import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import EventSource from 'eventsourcemock';

Object.defineProperty(window, 'EventSource', {
  value: EventSource,
});

test("renders header", () => {
  render(<App />);
  const headerElement = screen.getByText(/Sky Wrangler UAV/i);
  expect(headerElement).toBeInTheDocument();
});
