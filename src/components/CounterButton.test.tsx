import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// import { vi } from "vitest";

screen.logTestingPlaygroundURL();

test.skip("increases number upon button being tapped", async () => {
  //   render(
  //     <CounterButton
  //       setHaptics={vi.fn()}
  //       haptics={false}
  //       // saveArrayLocally={vi.fn()}
  //       // localSavedCountersArray={[
  //       //   {
  //       //     counter: "Alhumdulillah",
  //       //     count: 0,
  //       //     color: "#EF5350",
  //       //     isActive: true,
  //       //     target: 50,
  //       //     id: 1,
  //       //   },
  //       // ]}
  //       // setActiveCounterNumber={vi.fn()}
  //       // activeCounterNumber={0}
  //       // activeCounterTarget={3}
  //     />
  //   );
  const btn = screen.getByRole("button", {
    name: /Increase counter, current value is 0/i,
  });
  expect(btn).toBeInTheDocument();
  expect(btn).toHaveAttribute(
    "aria-label",
    "Increase counter, current value is 0"
  );
  userEvent.click(btn);
  await waitFor(() => {
    expect(btn).toHaveAttribute(
      "aria-label",
      "Increase counter, current value is 1"
    );
  });
});
