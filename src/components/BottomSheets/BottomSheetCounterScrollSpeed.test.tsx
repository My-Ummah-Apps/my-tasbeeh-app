import { fireEvent, render, screen } from "@testing-library/react";
import {
  dummyCounterText,
  renderModalContent,
} from "./BottomSheetCounterScrollSpeed";
import { vi } from "vitest";
import { calcScrollSpeed, speedMap } from "../../utils/constants";
import { userPreferencesType } from "../../utils/types";
import { MemoryRouter } from "react-router-dom";

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

describe("Dummy Counter", () => {
  let slider: HTMLElement;
  beforeEach(() => {
    render(
      <MemoryRouter>
        {renderModalContent(
          mockedSetLanguageDirection,
          mockedSetScrollSpeed,
          mockedScrollSpeed,
          mockedUpdateUserPreference,
          mockedUserPreferencesState
        )}
      </MemoryRouter>
    );
    slider = screen.getByLabelText("Range with ticks");
  });

  it("renders the dummy counter", () => {
    const dummyCounter = screen.getAllByText(dummyCounterText);

    expect(dummyCounter[0]).toBeInTheDocument();
    expect(dummyCounter).toHaveLength(2);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  //   ! This test will need moving to the active counter components test file
  //   it("scrolls the dummy counter", () => {

  //   });

  it("renders slider", () => {
    expect(slider).toBeInTheDocument();
    expect(screen.getByText("Very Slow")).toBeInTheDocument();
    expect(screen.getByText("Very Fast")).toBeInTheDocument();
  });

  it("changes speed when slider moves", () => {
    expect(slider).toBeInTheDocument();
    fireEvent.input(slider, { target: { value: "3" } });
    expect(slider).toHaveValue(3);
    // const scrollContainer = screen.getByTestId("scroll-container");
    // const scrollText = screen.getAllByText(dummyCounterText)[0];
  });
  it("calculates correct scroll speed", () => {
    expect(calcScrollSpeed(10, 1)).toBe(10 * speedMap[1]);
    expect(calcScrollSpeed(100, 3)).toBe(100 * speedMap[3]);
    expect(calcScrollSpeed(25, 4)).toBe(25 * speedMap[4]);
    expect(calcScrollSpeed(13, 2)).toBe(13 * speedMap[2]);
    expect(calcScrollSpeed(56, 0)).toBe(56 * speedMap[0]);
  });
});
