/* Event Coverage Guide — content for the Novaris Field Kit. */
export default {
  slug: "event-coverage-guide",
  name: "Event Coverage Guide",
  tabs: ["shotlists", "lighting", "settings", "planning"],

  shotlists: [
    {
      id: "corporate",
      title: "Corporate event",
      description: "Launches, dinners, and company gatherings, in rough running order.",
      sections: [
        { title: "Before doors open", items: [
          { text: "Venue exterior and signage" },
          { text: "Room set: stage, tables, branding", note: "Empty and tidy, before guests arrive." },
          { text: "Catering and table details" },
          { text: "Sponsors' or partners' branding" }
        ] },
        { title: "Arrivals", items: [
          { text: "Registration and welcome desk" },
          { text: "Guests arriving and greeting" },
          { text: "Key people arriving (confirm the list with the client)" }
        ] },
        { title: "Program", items: [
          { text: "Each speaker: wide with stage, and tight" },
          { text: "Audience listening and reacting" },
          { text: "Awards or announcements" },
          { text: "Handshakes and presentations to camera" },
          { text: "Team or group photo" }
        ] },
        { title: "Networking", items: [
          { text: "Conversations in small groups" },
          { text: "Key people with guests" },
          { text: "Wide room shot at its busiest" }
        ] }
      ]
    },
    {
      id: "party",
      title: "Party or celebration",
      description: "Birthdays, anniversaries, and private parties.",
      sections: [
        { title: "Set up", items: [
          { text: "Decorations and venue details" },
          { text: "Cake, food, and drinks table" },
          { text: "Host portraits before guests arrive" }
        ] },
        { title: "Guests", items: [
          { text: "Arrivals and greetings" },
          { text: "Small group photos at tables" },
          { text: "Candid conversations and laughter" }
        ] },
        { title: "Key moments", items: [
          { text: "Speeches and toasts, with reactions" },
          { text: "Cake, candles, or gifts" },
          { text: "First dance or special performance" },
          { text: "Dance floor at its busiest" },
          { text: "Group photo of everyone (plan a time)" }
        ] }
      ]
    },
    {
      id: "conference",
      title: "Conference",
      description: "Multi-session conferences and summits.",
      sections: [
        { title: "Each day", items: [
          { text: "Venue exterior, signage, and wayfinding" },
          { text: "Registration and badge collection" },
          { text: "Exhibition or sponsor stands" }
        ] },
        { title: "Sessions", items: [
          { text: "Keynote: speaker, stage wide, and audience" },
          { text: "Panel: each panelist and the full panel" },
          { text: "Breakout rooms: one wide and one detail each" },
          { text: "Questions from the audience" },
          { text: "Slides or screens only if the client asks" }
        ] },
        { title: "Between sessions", items: [
          { text: "Networking and coffee breaks" },
          { text: "Speaker portraits (schedule with organizers)" },
          { text: "Sponsors with visitors at stands" }
        ] }
      ]
    }
  ],

  lighting: [
    {
      id: "ceiling-bounce",
      title: "On-camera flash bounced off the ceiling",
      summary: "Soft, even light in rooms with low, light-colored ceilings.",
      elements: [
        { id: "ceiling", type: "ceiling", x: 180, y: 70, label: "Ceiling (bounce surface)", role: "Becomes a large soft light source.", notes: "Works best with ceilings under about 3 m that are white or neutral. Colored ceilings tint the light." },
        { id: "subject", type: "subject", x: 180, y: 130, label: "Guests", role: "Lit from above and slightly in front.", notes: "Tilt the flash head a little forward of straight up so light lands in front of the subject; straight up can leave dark eye sockets." },
        { id: "flash", type: "camera-flash", x: 180, y: 252, label: "Camera with flash, head up", role: "Flash bounced off the ceiling.", notes: "Use flash exposure compensation (+0.3 to +1) because bounced light loses power. A small bounce card adds catchlights." }
      ],
      beams: [{ from: "flash", to: "ceiling" }, { from: "ceiling", to: "subject", kind: "bounce" }],
      tips: ["Higher ISO lets the flash work less hard and recycle faster.", "Drag the shutter (1/30–1/60) to keep some room light."]
    },
    {
      id: "wall-bounce",
      title: "Flash bounced off a side wall",
      summary: "Directional, soft light when the ceiling is too high or dark.",
      elements: [
        { id: "wall", type: "wall", x: 44, y: 150, label: "Side wall", role: "Bounce surface beside or behind you.", notes: "Turn the flash head toward a light wall behind you and to one side. The light then comes from an angle, like window light." },
        { id: "subject", type: "subject", x: 196, y: 120, label: "Speaker or guests", role: "Lit from the side and front.", notes: "Turn people slightly toward the lit side for flattering light." },
        { id: "flash", type: "camera-flash", x: 196, y: 244, label: "Camera with flash, head turned", role: "Flash aimed at the wall.", notes: "Distance matters: the further the wall, the more power you need. Check the flash confirmation light or histogram." }
      ],
      beams: [{ from: "flash", to: "wall" }, { from: "wall", to: "subject", kind: "bounce" }],
      tips: ["Watch for color casts from painted walls.", "Black foil or a flag on the flash head stops direct light reaching the subject."]
    },
    {
      id: "off-camera",
      title: "Off-camera flash with on-camera fill",
      summary: "A flash on a stand for direction, plus gentle bounce fill from the camera.",
      elements: [
        { id: "stand", type: "flash", x: 270, y: 92, rot: -125, label: "Flash on stand", role: "Key light: direction and shape.", notes: "Place it high, at 45° to the main area of action. Secure stands in busy rooms with a sandbag and tape down cables." },
        { id: "subject", type: "subject", x: 180, y: 134, label: "Subject area", role: "Where key moments happen.", notes: "Pre-set the stand for the stage, cake table, or dance floor so you can move freely." },
        { id: "fill", type: "camera-flash", x: 180, y: 252, label: "Camera with fill flash", role: "Fill: softens shadows.", notes: "Bounce the on-camera flash at low power, one or two stops below the off-camera flash." }
      ],
      beams: [{ from: "stand", to: "subject" }, { from: "fill", to: "subject" }],
      tips: ["Use wireless triggers with groups so you can change each flash from the camera.", "Avoid pointing the stand flash at the audience's eyes."]
    },
    {
      id: "stage",
      title: "Stage and podium, available light",
      summary: "Using the venue's stage lighting without flash during talks.",
      elements: [
        { id: "spot", type: "light", x: 104, y: 46, rot: 140, label: "Stage lights", role: "Venue lighting on the speaker.", notes: "Meter for the speaker's face; stage lights are often much brighter than the room, so the background goes dark." },
        { id: "speaker", type: "subject", x: 180, y: 96, label: "Speaker at lectern", role: "Main subject.", notes: "Time frames for gestures and expressions; avoid mid-word mouth shapes." },
        { id: "audience", type: "audience", x: 180, y: 182, label: "Audience", role: "Context and reactions.", notes: "Shoot from the side aisles to include audience heads in the foreground." },
        { id: "camera", type: "camera", x: 290, y: 252, label: "Camera (side aisle)", role: "Long lens from the side or back.", notes: "A side angle avoids projector screens behind the speaker and gives a more natural profile." }
      ],
      beams: [{ from: "spot", to: "speaker" }],
      tips: ["Set white balance from the stage lights, not the room.", "Use silent shutter mode during quiet moments if your camera has it."]
    },
    {
      id: "group",
      title: "Group photo with two flashes",
      summary: "Two lights either side for even coverage across a large group.",
      elements: [
        { id: "left", type: "umbrella", x: 70, y: 214, rot: 40, label: "Flash with umbrella (left)", role: "Lights the left half and overlaps the right.", notes: "Place at about 45° to the group, raised above head height, aimed across to the far side to even out the light." },
        { id: "right", type: "umbrella", x: 290, y: 214, rot: -40, label: "Flash with umbrella (right)", role: "Lights the right half and overlaps the left.", notes: "Same power and distance as the left light for even coverage." },
        { id: "group", type: "audience", x: 180, y: 110, label: "Group (two or three rows)", role: "Subjects.", notes: "Rows stepped up or seated in front. Check that every face is visible from the camera position." },
        { id: "camera", type: "camera", x: 180, y: 262, label: "Camera on tripod", role: "Centered, raised slightly.", notes: "f/8 keeps rows in focus. Take several frames to catch everyone with eyes open." }
      ],
      beams: [{ from: "left", to: "group" }, { from: "right", to: "group" }],
      tips: ["Cross the beams (left light aimed right, right light aimed left) for evener light.", "Count down and shoot on the count to get attention."]
    }
  ],

  settings: {
    tables: [
      { title: "Low-light starting points", rows: [
        { situation: "Ballroom, bounce flash", aperture: "f/4", shutter: "1/60", iso: "1600", notes: "Drag the shutter to keep room light." },
        { situation: "Conference stage, no flash", aperture: "f/2.8", shutter: "1/250", iso: "3200", notes: "Meter for the speaker's face." },
        { situation: "Dim bar or party room", aperture: "f/2", shutter: "1/125", iso: "3200", notes: "Fast prime; watch focus on eyes." },
        { situation: "Dance floor with flash", aperture: "f/2.8", shutter: "1/30", iso: "1600", notes: "Slow shutter adds motion from party lights." },
        { situation: "Group photo, two flashes", aperture: "f/8", shutter: "1/125", iso: "400", notes: "Deeper focus for several rows." },
        { situation: "Outdoor evening event", aperture: "f/2.8", shutter: "1/200", iso: "1600–3200", notes: "Use flash fill as daylight fades." }
      ] }
    ],
    rules: [
      "Speakers gesturing: 1/200 or faster to freeze hands.",
      "Raise ISO before slowing the shutter below what you can hold steady.",
      "Settings are starting points. Venues and light vary."
    ],
    nd: false
  },

  planning: [
    { id: "run-of-show", kind: "table", title: "Run-of-show planning sheet",
      description: "Match coverage to the client's schedule. Tick rows off as the event runs.",
      columns: [{ id: "time", label: "Time", width: 0.12 }, { id: "segment", label: "Segment", width: 0.26 }, { id: "location", label: "Location", width: 0.18 }, { id: "people", label: "People", width: 0.2 }, { id: "must", label: "Must capture", width: 0.24 }],
      rows: [
        ["", "Arrival and setup", "", "", "Room before doors open"],
        ["", "Doors open", "", "", "Registration, welcome"],
        ["", "Opening remarks", "", "", ""],
        ["", "Keynote or main talk", "", "", ""],
        ["", "Break", "", "", "Networking"],
        ["", "Sessions or panels", "", "", ""],
        ["", "Awards or announcements", "", "", ""],
        ["", "Group photo", "", "", ""],
        ["", "Dinner or reception", "", "", ""],
        ["", "Close", "", "", ""]
      ] },
    { id: "brief", kind: "worksheet", title: "Event brief",
      description: "Capture the client's priorities and contacts before the event.",
      sections: [
        { title: "Event", fields: [
          { id: "name", label: "Event name" }, { id: "date", label: "Date", type: "date" },
          { id: "venue", label: "Venue" }, { id: "hours", label: "Coverage hours" },
          { id: "contact", label: "Client contact on the day" }, { id: "dress", label: "Dress code" }
        ] },
        { title: "Coverage", fields: [
          { id: "vips", label: "Key people to photograph", type: "textarea" },
          { id: "restricted", label: "Restricted areas and no-photo guests", type: "textarea" },
          { id: "branding", label: "Branding and sponsors to include", type: "textarea" },
          { id: "delivery", label: "Delivery expectations (same-day selects, full gallery)", type: "textarea" }
        ] }
      ] }
  ],

  previews: [
    { view: "lighting", item: "ceiling-bounce" },
    { view: "shotlists", item: "conference" },
    { view: "planning", item: "run-of-show" }
  ]
};
