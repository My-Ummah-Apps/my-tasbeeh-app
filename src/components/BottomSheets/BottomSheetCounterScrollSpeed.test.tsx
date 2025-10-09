import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  dummyCounterText,
  renderModalContent,
} from "./BottomSheetCounterScrollSpeed";
import { vi } from "vitest";
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
    // expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("renders slider", () => {
    expect(slider).toBeInTheDocument();
    expect(screen.getByText("Very Slow")).toBeInTheDocument();
    expect(screen.getByText("Very Fast")).toBeInTheDocument();
  });

  it("updateUserPreference when slider changes", async () => {
    expect(slider).toBeInTheDocument();
    fireEvent(slider, new CustomEvent("ionChange", { detail: { value: 3 } }));
    await waitFor(() =>
      expect(mockedUpdateUserPreference).toHaveBeenCalledWith("scrollSpeed", 3)
    );
  });
});
