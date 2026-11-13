/* Wedding Day Guide — content for the Novaris Field Kit. */
export default {
  slug: "wedding-day-guide",
  name: "Wedding Day Guide",
  tabs: ["shotlists", "settings", "planning"],

  shotlists: [
    {
      id: "wedding-day",
      title: "Full wedding day",
      description: "Every phase of the day in shooting order: preparation, ceremony, formals, and reception.",
      sections: [
        { title: "Preparation", items: [
          { text: "Venue and getting-ready room, wide" },
          { text: "Rings, invitation suite, shoes, jewelry", note: "Gather details early, before rooms get busy." },
          { text: "Attire hanging or laid out" },
          { text: "Hair and makeup candids" },
          { text: "Partner A: final touches (buttons, veil, jewelry)" },
          { text: "Partner B: getting ready (tie, cufflinks, flowers)" },
          { text: "Letters or gifts exchanged, and reactions" },
          { text: "Parents seeing each partner ready" },
          { text: "Portrait of each partner, ready" },
          { text: "First look (if planned)" }
        ] },
        { title: "Ceremony", items: [
          { text: "Venue before guests arrive" },
          { text: "Guests arriving, programs, signage" },
          { text: "Officiant and partner waiting at the front" },
          { text: "Processional: each member of the wedding party" },
          { text: "Entrance, and the reaction at the front", note: "Have a second angle covered if you can." },
          { text: "Wide from the back, whole aisle" },
          { text: "Vows, wide and tight" },
          { text: "Ring exchange, close" },
          { text: "Readings and musicians" },
          { text: "Family reactions" },
          { text: "First kiss" },
          { text: "Recessional" },
          { text: "Exit, confetti or petals" }
        ] },
        { title: "Formals", items: [
          { text: "Family groups (follow the grouping planner)" },
          { text: "Full wedding party" },
          { text: "Each partner with their attendants" },
          { text: "Couple: classic full length" },
          { text: "Couple: close portrait" },
          { text: "Couple: walking" },
          { text: "Couple: wide scenic" },
          { text: "Couple: golden hour (if the timeline allows)" }
        ] },
        { title: "Reception", items: [
          { text: "Room details before guests enter", note: "Tables, centerpieces, place cards, cake." },
          { text: "Grand entrance" },
          { text: "First dance: wide, tight, and guest reactions" },
          { text: "Toasts: each speaker and the couple's reaction" },
          { text: "Parent dances" },
          { text: "Cake cutting" },
          { text: "Bouquet or garter toss (if planned)" },
          { text: "Open dance floor candids" },
          { text: "Guest table candids" },
          { text: "Send-off or exit" }
        ] }
      ]
    }
  ],

  settings: {
    tables: [
      { title: "Wedding day starting points", rows: [
        { situation: "Bright outdoor ceremony", aperture: "f/4", shutter: "1/500", iso: "100", notes: "Find shade for faces if you can." },
        { situation: "Indoor ceremony, no flash", aperture: "f/2.8", shutter: "1/200", iso: "3200", notes: "Check venue rules on flash and movement." },
        { situation: "Ring and detail close-ups", aperture: "f/4", shutter: "1/200", iso: "800", notes: "Stop down for more of the ring in focus." },
        { situation: "Formals in open shade", aperture: "f/5.6–f/8", shutter: "1/250", iso: "400", notes: "Deeper focus for multiple rows." },
        { situation: "Reception, bounce flash", aperture: "f/4", shutter: "1/100", iso: "1600", notes: "Bounce off a light ceiling or wall." },
        { situation: "First dance, flash with ambient", aperture: "f/2.8", shutter: "1/60", iso: "1600", notes: "A slower shutter keeps room light in the frame." }
      ] }
    ],
    rules: [
      "Moving people at a walking pace: 1/250 or faster.",
      "Check venue rules on flash before the ceremony starts.",
      "Settings are starting points. Adjust for your light, lens, and the venue."
    ],
    nd: false
  },

  planning: [
    { id: "timeline", kind: "table", title: "Full-day timeline",
      description: "Lay out the whole day with times, locations, and notes. Tick rows off on the day.",
      columns: [{ id: "time", label: "Time", width: 0.14 }, { id: "event", label: "Event", width: 0.36 }, { id: "location", label: "Location", width: 0.22 }, { id: "notes", label: "Notes", width: 0.28 }],
      rows: [
        ["", "Photographer arrives", "", ""],
        ["", "Details: rings, attire, invitation suite", "", ""],
        ["", "Getting ready: Partner A", "", ""],
        ["", "Getting ready: Partner B", "", ""],
        ["", "First look (optional)", "", ""],
        ["", "Wedding party photos", "", ""],
        ["", "Travel to ceremony", "", "Allow buffer time"],
        ["", "Guests arrive", "", ""],
        ["", "Ceremony begins", "", ""],
        ["", "Recessional", "", ""],
        ["", "Family formals", "", "Use the grouping planner"],
        ["", "Couple portraits", "", ""],
        ["", "Reception room details", "", "Before guests enter"],
        ["", "Grand entrance", "", ""],
        ["", "First dance", "", ""],
        ["", "Dinner", "", ""],
        ["", "Toasts", "", ""],
        ["", "Parent dances", "", ""],
        ["", "Cake cutting", "", ""],
        ["", "Open dancing", "", ""],
        ["", "Golden hour portraits (if timing allows)", "", ""],
        ["", "Send-off", "", ""],
        ["", "Photographer departs", "", ""]
      ] },
    { id: "formals", kind: "groups", title: "Family formals grouping planner",
      description: "List each family group in shooting order with names, and tick groups off as you go.",
      groups: [
        "Couple with both families",
        "Couple with Partner A's immediate family",
        "Couple with Partner A's parents",
        "Couple with Partner A's grandparents",
        "Couple with Partner B's immediate family",
        "Couple with Partner B's parents",
        "Couple with Partner B's grandparents",
        "Full wedding party"
      ] },
    { id: "venue-scouting", kind: "worksheet", title: "Venue scouting worksheet",
      description: "Record what you find on a venue visit so the day holds no surprises.",
      sections: [
        { title: "Venue", fields: [
          { id: "venue", label: "Venue name" }, { id: "visited", label: "Date visited", type: "date" },
          { id: "contact", label: "Venue contact" }, { id: "access", label: "Access, parking, and load-in" }
        ] },
        { title: "Ceremony space", fields: [
          { id: "ceremonyLight", label: "Light direction at ceremony time", type: "textarea" },
          { id: "ceremonyRules", label: "Where you can stand, and any restrictions", type: "textarea" }
        ] },
        { title: "Reception space", fields: [
          { id: "ceiling", label: "Ceiling height and color (for bounce flash)" },
          { id: "receptionLight", label: "Light sources and color", type: "textarea" }
        ] },
        { title: "Portraits", fields: [
          { id: "spots", label: "Portrait spots and best times", type: "textarea" },
          { id: "weather", label: "Bad-weather backup spots", type: "textarea" },
          { id: "notes", label: "Notes", type: "textarea" }
        ] }
      ] },
    { id: "gear", kind: "checklist", title: "Wedding gear checklist",
      description: "Pack and check equipment the night before. Add your own items.",
      sections: [
        { title: "Cameras and media", items: ["Main camera body", "Backup camera body", "Batteries charged, plus spares", "Memory cards formatted, plus spares"] },
        { title: "Lenses", items: ["Wide zoom", "Standard zoom", "Telephoto zoom", "Fast prime for low light", "Macro lens for rings and details"] },
        { title: "Lighting", items: ["Two on-camera flashes", "Off-camera flash and stand", "Wireless triggers", "Spare flash batteries", "Bounce card or small modifier"] },
        { title: "Support and day kit", items: ["Monopod or tripod", "Lens cloths", "Rain cover", "Printed timeline and family list", "Venue and planner contact details", "Water and snacks"] }
      ] },
    { id: "client-questionnaire", kind: "questionnaire", title: "Client questionnaire",
      description: "Customize the questions, add your business name, and export a PDF to send to the couple.",
      intro: "Congratulations on your upcoming wedding. Your answers help us plan photography around your day. Please return this questionnaire at least four weeks before the wedding.",
      questions: [
        "Your names, and how you would like to be addressed",
        "Wedding date",
        "Ceremony venue, address, and start time",
        "Reception venue, address, and start time",
        "Getting-ready locations and times for each of you",
        "Wedding planner or coordinator, and how to reach them on the day",
        "Approximate number of guests",
        "Family members to include in formal photos (names and relationships)",
        "Family situations we should be aware of",
        "Must-have moments, traditions, or surprises",
        "Venue rules on photography (flash, movement during the ceremony)",
        "Wedding party, officiant, and other key people",
        "Details to photograph (rings, heirlooms, invitation suite)",
        "Preferred time and place for couple portraits",
        "Other vendors (video, music, florist)",
        "Anything else we should know"
      ] }
  ],

  previews: [
    { view: "shotlists", item: "wedding-day" },
    { view: "planning", item: "timeline" },
    { view: "planning", item: "formals" }
  ]
};
