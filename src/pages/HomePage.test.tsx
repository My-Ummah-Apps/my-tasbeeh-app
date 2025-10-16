import { render } from "@testing-library/react";
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
} from "../components/__mocks__/mockData";

const setActiveCounter = vi.fn();

const mockedLanguageDirection = "ltr";

// beforeEach(() => {
//   render(
//     <MemoryRouter>
//       <HomePage
//         dbConnection={dbConnection}
//         toggleDBConnection={toggleDBConnection}
//         updateActiveCounter={updateActiveCounter}
//         activeColor={mockColor}
//         activeCounter={mockedCounterObj}
//         resetSingleCounter={mockedResetSingleCounter}
//         updateCountersState={updateCountersState}
//         countersState={countersState}
//         setLanguageDirection={mockedSetLanguageDirection}
//         languageDirection={mockedLanguageDirection}
//         setScrollSpeed={mockedSetScrollSpeed}
//         scrollSpeed={mockedScrollSpeed}
//         // animationDelay={1700}
//       />
//     </MemoryRouter>
//   );
// });

// Upon button being tapped, does the percentage increase
// When reset button is tapped, does the count return to 0

it("increases progress when counter button is tapped", () => {});
