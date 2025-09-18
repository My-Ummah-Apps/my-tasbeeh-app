import { render, screen } from "@testing-library/react";
import {
  changeScrollSpeed,
  renderModalContent,
} from "./BottomSheetCounterScrollSpeed";
import { vi } from "vitest";

describe("Dummy Counter", () => {
  beforeEach(() => {
    render(renderModalContent(vi.fn()));
  });

  it("renders the dummy counter", () => {
    const dummyCounter = screen.getAllByText(
      "This is an example tasbeeh This is an example tasbeeh This is an example tasbeeh This is an example tasbeeh"
    );

    expect(dummyCounter[0]).toBeInTheDocument();
    expect(dummyCounter).toHaveLength(2);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  //   ! This test will need moving to the active counter components test file
  //   it("scrolls the dummy counter", () => {

  //   });

  it("renders slider", () => {
    expect(screen.getByLabelText("Range with ticks")).toBeInTheDocument();
    expect(screen.getByText("Very Slow")).toBeInTheDocument();
    expect(screen.getByText("Very Fast")).toBeInTheDocument();
  });

  it("changes slider speed", () => {
    const mockSetScrollSpeed = vi.fn();
    changeScrollSpeed(1, mockSetScrollSpeed);
  });
});
