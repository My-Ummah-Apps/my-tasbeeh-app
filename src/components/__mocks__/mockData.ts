// const mockedResetSingleCounter = vi.fn().mockResolvedValue(undefined);
// const mockColor = materialColors[0];

import { vi } from "vitest";
import { materialColors } from "../../utils/constants";
import { counterObjType, userPreferencesType } from "../../utils/types";

export const mockColor = materialColors[0];

export const mockedCounterObj: counterObjType = {
  id: 1,
  orderIndex: 1,
  name: "This is a test counter for unit and integration tests",
  count: 5,
  target: 10,
  color: mockColor,
  isActive: 1,
};

export const mockedUserPreferencesState: userPreferencesType = {
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

export const mockedResetSingleCounter = vi.fn().mockResolvedValue(undefined);
export const mockedSetLanguageDirection = vi.fn();
export const mockedSetScrollSpeed = vi.fn();
export const mockedScrollSpeed = 3;
