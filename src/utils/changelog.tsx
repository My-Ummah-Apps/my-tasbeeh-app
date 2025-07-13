export const LATEST_APP_VERSION = "2.8";

export const changeLogs = [
  {
    versionNum: LATEST_APP_VERSION,
    changes: [
      {
        heading: "Auto Tasbeeh Switch",
        text: (
          <>
            <strong>New</strong>: Enable this from the settings page to make
            your dhikr seamless — once a tasbeeh hits its target, the app will
            automatically move on to the next one in your tasbeeh list. You can
            also re-order your list from the settings page to control which
            tasbeeh comes next.
          </>
        ),
      },
      {
        heading: "Performance Improvements",
        text: (
          <>
            <strong>Improved</strong>: Bottom sheets are now smoother and more
            responsive.
          </>
        ),
      },
      {
        heading: "UX Enhancements",
        text: (
          <>
            <strong>Change</strong>: The reset-all-tasbeeh option has been moved
            from the settings page to the tasbeeh page, so it's now right where
            your tasbeehs are managed, other small improvements have also been
            made.
          </>
        ),
      },
    ],
  },
  {
    versionNum: "2.7",
    changes: [
      {
        heading: "Minor bug fixes",
        text: (
          <>
            <strong>Fixed</strong>: Resolved an issue where a duplicate tasbeeh
            could be added when modifying an existing tasbeeh.
            <br></br>
            <br></br>
            <strong>Fixed</strong>: Resolved daily reset setting applying
            immediately instead of from the next day.
            <br></br>
            <br></br>
            <strong>Fixed</strong>: Resolved an issue where no new active
            tasbeeh was set after deleting the current tasbeeh.
          </>
        ),
      },
    ],
  },
  {
    versionNum: "2.6",
    changes: [
      {
        heading: "Minor bug fixes",
        text: (
          <>
            <strong>Hotfix</strong>: Resolved a bug that prevented new users
            from accessing the app on first launch.
          </>
        ),
      },
    ],
  },
  {
    versionNum: "2.5",
    changes: [
      {
        heading: "Minor UI & UX Improvements",
        text: (
          <>
            <strong>Improvements</strong>: Minor improvements across the app
            including resizing the plus button for wider screens, improving user
            prompts, fixing dark mode borders in the notifications sheet, and
            updating the app icon and splash screens.
          </>
        ),
      },
    ],
  },
  {
    versionNum: "2.4",
    changes: [
      {
        heading: "Notification Fix",
        text: (
          <>
            <strong>Fixed</strong>: Resolved an issue where notifications
            continued to trigger even when turned off.{" "}
          </>
        ),
      },
    ],
  },
  {
    versionNum: "2.3",
    changes: [
      {
        heading: "Custom Tasbeeh fix",
        text: (
          <>
            <strong>Fixed</strong>: Issue with custom added Tasbeeh disappearing
            when the 'Auto Reset Tasbeehs' feature was being used.
          </>
        ),
      },
    ],
  },
  {
    versionNum: "2.2",
    changes: [
      {
        heading: "Text scrolling fix",
        text: (
          <>
            <strong>Fixed</strong>: Issue with scrolling text overlapping.
          </>
        ),
      },
    ],
  },
  {
    versionNum: "2.1",
    changes: [
      {
        heading: "RTL Language Fixes",
        text: (
          <>
            <strong>Fixed</strong>: Issues with right-to-left languages not
            displaying properly.
          </>
        ),
      },
    ],
  },
  {
    versionNum: "2.0",
    changes: [
      {
        heading: "Improved Modal Interaction",
        text: (
          <>
            <strong>Improvements</strong>: Switched from pop-up to slide-up
            modals throughout the app for a smoother, more intuitive experience,
            along with various tweaks within the modals to enhance usability.
          </>
        ),
      },
      {
        heading: "Scroll Speed Adjustment",
        text: (
          <>
            <strong>Fixed</strong>: A user reported an issue where scrolling was
            too fast for longer tasbeeh names, this has now been fixed
          </>
        ),
      },
    ],
  },
];
