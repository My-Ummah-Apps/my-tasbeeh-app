import { render } from "@testing-library/react";
import { calcScrollSpeed, speedMap } from "../utils/constants";
import ActiveCounter from "./ActiveCounter";
import { userPreferencesType } from "../utils/types";
import { vi } from "vitest";

const mockedSetLanguageDirection = vi.fn();
const mockedSetScrollSpeed = vi.fn();
const mockedScrollSpeed = 3;
const mockedUpdateUserPreference = vi.fn().mockResolvedValue(undefined);

const mockedUserPreferencesState: userPreferencesType = {
  morningNotification: 1,
  afternoonNotification: 0,
  eveningNotification: 0,
  isExistingUser: 1,
  appLaunchCount: 3,
  haptics: 1,
  previousLaunchDate: "2025-10-07",
  dailyCounterReset: 0,
  autoSwitchCounter: 0,
  activeColor: "#5C6BC0",
  theme: "dark",
  scrollSpeed: 2,
};

it("calculates correct scroll speed", () => {
  expect(calcScrollSpeed(10, 1)).toBe(10 * speedMap[1]);
  expect(calcScrollSpeed(100, 3)).toBe(100 * speedMap[3]);
  expect(calcScrollSpeed(25, 4)).toBe(25 * speedMap[4]);
  expect(calcScrollSpeed(13, 2)).toBe(13 * speedMap[2]);
  expect(calcScrollSpeed(56, 0)).toBe(56 * speedMap[0]);
  expect(calcScrollSpeed(56, 4)).toBe(56 * speedMap[4]);
});

describe("Active Counter", () => {
  beforeEach(() => {
    render(<ActiveCounter />);
  });

  //   ! This test will need moving to the active counter components test file
  //   it("scrolls the dummy counter", () => {

  //   });

  // it("renders the counter text", () => {
  //   const dummyCounter = screen.getAllByText(dummyCounterText);
  //   expect(dummyCounter[0]).toBeInTheDocument();
  //   expect(dummyCounter).toHaveLength(2);
  //   // expect(screen.getByText("100%")).toBeInTheDocument();
  // });
});
