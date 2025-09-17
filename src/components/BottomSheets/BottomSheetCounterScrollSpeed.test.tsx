import { render, screen } from "@testing-library/react";
import { renderModalContent } from "./BottomSheetCounterScrollSpeed";
import { vi } from "vitest";

describe("Dummy Counter", () => {
  it("renders the dummy counter", () => {
    render(renderModalContent(vi.fn()));

    const dummyCounter = screen.getAllByText(
      "This is an example tasbeeh This is an example tasbeeh"
    );
    const targetText = screen.getByText("100%");

    expect(dummyCounter[0]).toBeInTheDocument();
    expect(dummyCounter).toHaveLength(2);
    expect(targetText).toBeInTheDocument();
  });

  //   it("scrolls the dummy counter", () => {
  //     render(modalContent)

  //   })
});
