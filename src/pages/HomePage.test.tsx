import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./HomePage";
import { vi } from "vitest";

import {
  mockColor,
  mockedCounterObj,
  mockedResetSingleCounter,
  mockedScrollSpeed,
  mockedSetLanguageDirection,
  mockedSetScrollSpeed,
  mockedUserPreferencesState,
} from "../components/__mocks__/mockData";
import userEvent from "@testing-library/user-event";

const mockedLanguageDirection = "ltr";

const mockedDbConnection = {
  current: {
    open: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
  } as any,
};

const mockedToggleDBConnection = vi.fn().mockResolvedValue(undefined);
const mockedUpdateActiveCounter = vi.fn().mockResolvedValue(undefined);
const mockedUpdateCountersState = vi.fn().mockResolvedValue(undefined);
const mockedCountersState = [mockedCounterObj];

describe("integration tests", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <HomePage
          dbConnection={mockedDbConnection}
          toggleDBConnection={mockedToggleDBConnection}
          updateActiveCounter={mockedUpdateActiveCounter}
          activeColor={mockColor}
          activeCounter={mockedCounterObj}
          resetSingleCounter={mockedResetSingleCounter}
          updateCountersState={mockedUpdateCountersState}
          countersState={mockedCountersState}
          setLanguageDirection={mockedSetLanguageDirection}
          languageDirection={mockedLanguageDirection}
          setScrollSpeed={mockedSetScrollSpeed}
          scrollSpeed={mockedScrollSpeed}
          userPreferencesState={mockedUserPreferencesState}
          // animationDelay={1700}
        />
      </MemoryRouter>
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("increases progress when counter button is tapped", () => {
    const progressText = screen.getByText("50%");
    expect(progressText).toBeInTheDocument();
    expect(progressText).toHaveTextContent("50%");
    const counterText = screen.getAllByText(mockedCounterObj.name)[0];
    expect(counterText).toBeInTheDocument();
    // const counterBtn = screen.getByText("of 10");
    const counterBtn = screen.getByText("of 10");
    console.log("counterBtn: ", counterBtn);

    userEvent.click(counterBtn);
    expect(progressText).toHaveTextContent("50%");
  });
});

// Upon button being tapped, does the percentage increase
// When reset button is tapped, does the count return to 0
