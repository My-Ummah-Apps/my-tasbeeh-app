export const LATEST_APP_VERSION = "2.3";

export const changeLogs = [
  {
    versionNum: LATEST_APP_VERSION,
    changes: [
      {
        heading: "Custom Tasbeeh fix",
        text: (
          <>
            <strong>Fixed</strong>: Issue with custom added Tasbeeh disapearing
            when the 'Auto Reset Adhkar' feature was being used.
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
