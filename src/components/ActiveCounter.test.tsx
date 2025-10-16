import { render, screen } from "@testing-library/react";
import { calcScrollSpeed, speedMap } from "../utils/constants";
import ActiveCounter from "./ActiveCounter";
import { expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import {
  mockColor,
  mockedCounterObj,
  mockedResetSingleCounter,
  mockedScrollSpeed,
  mockedSetLanguageDirection,
  mockedSetScrollSpeed,
  mockedUserPreferencesState,
} from "./__mocks__/mockData";

const mockedLanguageDirection = "ltr";
// const mockedUpdateUserPreference = vi.fn().mockResolvedValue(undefined);

vi.mock("./ActionSheet", () => ({
  default: ({ buttons }: any) => {
    return (
      <div>
        {buttons.map((btn: any, i: number) => (
          <button
            key={i}
            onClick={() => btn.handler && btn.handler()}
            data-testid={`action-sheet-btn-${btn.role}`}
          >
            {btn.text}
          </button>
        ))}
      </div>
    );
  },
}));

it("calculates correct scroll speed", () => {
  expect(calcScrollSpeed(10, 1)).toBe(10 * speedMap[1]);
  expect(calcScrollSpeed(100, 3)).toBe(100 * speedMap[3]);
  expect(calcScrollSpeed(25, 4)).toBe(25 * speedMap[4]);
  expect(calcScrollSpeed(13, 2)).toBe(13 * speedMap[2]);
  expect(calcScrollSpeed(56, 0)).toBe(56 * speedMap[0]);
  expect(calcScrollSpeed(56, 4)).toBe(56 * speedMap[4]);
});

// Test that the counter is scrolling
// Test that the reset button works
// Test that the correct direction (ltr / rtl) is applied

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

  it("renders reset icon", () => {
    const resetIcon = screen.getByRole("button", { name: /reset counter/i });
    expect(resetIcon).toBeInTheDocument();
  });

  it("triggers action sheet upon reset icon being clicked", () => {
    const resetIcon = screen.getByRole("button", { name: /reset counter/i });
    userEvent.click(resetIcon);
    const resetButton = screen.getByText(/reset tasbeeh/i);
    expect(resetButton).toBeVisible();
  });

  it("fires reset counter function upon 'Reset Tasbeeh' button being clicked", async () => {
    const destructiveButton = screen.getByTestId(
      "action-sheet-btn-destructive"
    );
    await userEvent.click(destructiveButton);
    expect(mockedResetSingleCounter).toBeCalledTimes(1);
    expect(mockedResetSingleCounter).toHaveBeenCalledWith(mockedCounterObj.id);
  });

  it("display correct progress percentage", () => {
    const percentageText = screen.getByTestId("counter-progress-percent-text");
    expect(percentageText.textContent).toBe("50%");
  });

  // it("scrolls the counter", () => {});
});

describe("Active Counter integration tests", () => {
  it("scrolls the counter", () => {});
});
