import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders heading text 'home'", () => {
  render(<App />);
  const homeHeading = screen.getByText(/home/i);
  expect(homeHeading).toBeInTheDocument();
});
