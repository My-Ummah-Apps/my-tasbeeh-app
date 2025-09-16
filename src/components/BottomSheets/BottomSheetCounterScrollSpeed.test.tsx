import { render, screen } from "@testing-library/react";
import { renderModalContent } from "./BottomSheetCounterScrollSpeed";
import { vi } from "vitest";

describe("Dummy Counter", () => {
  it("renders the dummy counter", () => {
    render(renderModalContent(vi.fn()));

    const dummyCounter = screen.getByText(
      "This is an example tasbeeh This is an example tasbeeh"
    );
    expect(dummyCounter).toBeInTheDocument();
  });

  //   it("scrolls the dummy counter", () => {
  //     render(modalContent)

  //   })
});
