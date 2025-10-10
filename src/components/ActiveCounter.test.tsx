import { act, render, screen, waitFor } from "@testing-library/react";
import { calcScrollSpeed, materialColors, speedMap } from "../utils/constants";
import ActiveCounter from "./ActiveCounter";
import { counterObjType, userPreferencesType } from "../utils/types";
import { expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import React from "react";

const mockedSetLanguageDirection = vi.fn();
const mockedLanguageDirection = "ltr";
const mockedSetScrollSpeed = vi.fn();
const mockedScrollSpeed = 3;
// const mockedUpdateUserPreference = vi.fn().mockResolvedValue(undefined);
const mockedResetSingleCounter = vi.fn().mockResolvedValue(undefined);
const mockColor = materialColors[0];

const mockedCounterObj: counterObjType = {
  id: 1,
  orderIndex: 1,
  name: "Counter 1",
  count: 5,
  target: 10,
  color: mockColor,
  isActive: 1,
};

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

// Test that the counter text shows up
// Test that the counter is scrolling
// Test that the reset button shows
// Test that the reset button works
// Test that the progress tet is correct
// Test that the progress tet is correct

describe("Active Counter unit tests", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <ActiveCounter
          userPreferencesState={mockedUserPreferencesState}
          activeColor={mockColor}
          activeCounter={mockedCounterObj}
          resetSingleCounter={mockedResetSingleCounter}
          setLanguageDirection={mockedSetLanguageDirection}
          languageDirection={mockedLanguageDirection}
          setScrollSpeed={mockedSetScrollSpeed}
          scrollSpeed={mockedScrollSpeed}
          animationDelay={1700}
        />
      </MemoryRouter>
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders counter text", () => {
    const counterText = screen
      .getAllByText(mockedCounterObj.name)
      .filter((el) => el.className === "active-counter-name");

    expect(counterText.length).toBe(2);
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
