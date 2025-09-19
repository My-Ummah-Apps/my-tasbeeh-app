import { fireEvent, render, screen } from "@testing-library/react";
import {
  changeScrollSpeed,
  dummyCounterText,
  renderModalContent,
  speedMap,
} from "./BottomSheetCounterScrollSpeed";
import { vi } from "vitest";

describe("Dummy Counter", () => {
  let slider: HTMLElement;
  beforeEach(() => {
    render(renderModalContent(vi.fn()));
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
    const scrollText = screen.getAllByText(dummyCounterText)[0];
    // expect(scrollText[0].style.animationDuration).toBe("3s");
    expect(scrollText.style.animationDuration).toBe(
      `${scrollText.innerText.length * speedMap[2]}s`
    );
  });
});
