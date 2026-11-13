/* Landscape & Travel Field Guide — content for the Novaris Field Kit. */
export default {
  slug: "landscape-travel-field-guide",
  name: "Landscape & Travel Field Guide",
  tabs: ["settings", "planning"],

  settings: {
    tables: [
      { title: "Field starting points", rows: [
        { situation: "Handheld daylight scene", aperture: "f/8", shutter: "1/250", iso: "100–200", notes: "Fast enough to avoid shake with most lenses." },
        { situation: "Tripod, golden hour", aperture: "f/11", shutter: "1/15–1 s", iso: "100", notes: "Use a 2-second timer or remote." },
        { situation: "Blue hour city or coast", aperture: "f/8", shutter: "2–10 s", iso: "100", notes: "Expose so the sky keeps some color." },
        { situation: "Silky moving water", aperture: "f/11–f/16", shutter: "1–4 s", iso: "100", notes: "Add an ND filter in brighter light." },
        { situation: "Frozen waves or spray", aperture: "f/8", shutter: "1/1000", iso: "400", notes: "Continuous shooting helps." },
        { situation: "Night sky, wide lens", aperture: "f/2.8", shutter: "15–20 s", iso: "1600–3200", notes: "Longer exposures show stars as trails." },
        { situation: "Travel street scene", aperture: "f/5.6", shutter: "1/500", iso: "Auto", notes: "Fast shutter for people walking." }
      ] }
    ],
    rules: [
      "Sharp stars with a wide lens: keep exposures to about 500 ÷ focal length seconds on full frame (shorter on smaller sensors).",
      "Focus about a third of the way into the scene, or use a focus distance chart for your lens.",
      "Use the calculator below with the ND filter field to find long-exposure times.",
      "Settings are starting points. Light, lens, and conditions vary."
    ],
    nd: true
  },

  planning: [
    { id: "sun", kind: "sun", title: "Sunrise and sunset planner",
      description: "Sunrise, sunset, golden hour, and blue hour for any date and location, calculated on your device." },
    { id: "scouting", kind: "worksheet", title: "Location scouting worksheet",
      description: "Record each location's access, light, and hazards, before or during a visit.",
      sections: [
        { title: "Location", fields: [
          { id: "name", label: "Location name" }, { id: "visited", label: "Date visited", type: "date" },
          { id: "coords", label: "Coordinates or map reference" }, { id: "access", label: "Access and parking" },
          { id: "permits", label: "Permits or permissions needed" }, { id: "fees", label: "Opening hours or fees" }
        ] },
        { title: "Light and composition", fields: [
          { id: "light", label: "Best light (time of day, season)", type: "textarea" },
          { id: "viewpoints", label: "Viewpoints and compositions", type: "textarea" },
          { id: "foreground", label: "Foreground interest", type: "textarea" }
        ] },
        { title: "Safety and notes", fields: [
          { id: "hazards", label: "Hazards, tides, closures", type: "textarea" },
          { id: "signal", label: "Phone signal and nearest help" },
          { id: "notes", label: "Notes", type: "textarea" }
        ] }
      ] },
    { id: "gear", kind: "checklist", title: "Field gear checklist",
      description: "Pack for day trips and longer travel. Add your own items.",
      sections: [
        { title: "Camera", items: ["Camera body", "Wide lens", "Standard or telephoto lens", "Batteries charged, plus spares", "Memory cards, plus spares"] },
        { title: "Support and filters", items: ["Tripod and plate", "Remote release", "ND filters", "Graduated ND filter", "Polarizing filter", "Lens cloths and blower"] },
        { title: "Field kit", items: ["Head torch with red light", "Rain cover", "Warm and waterproof layers", "Water and food", "Offline map", "Printed pocket card"] },
        { title: "Travel", items: ["Chargers and plug adapters", "Card reader or backup drive", "Permits and bookings", "Insurance and emergency contacts"] }
      ] },
    { id: "composition", kind: "composition", title: "Composition reference",
      description: "Diagrams of common composition structures to check in the viewfinder.",
      items: [
        { id: "thirds", title: "Thirds", text: "Place the horizon or a key subject on a third line. Gives space and balance without centering everything." },
        { id: "leading", title: "Leading lines", text: "Roads, rivers, fences, and shorelines draw the eye into the frame toward the subject." },
        { id: "foreground", title: "Foreground frame", text: "A strong foreground element close to the lens adds depth. Get low and close to it." },
        { id: "layers", title: "Layers", text: "Overlapping ridges or buildings fading with distance create depth, especially in haze or low sun." },
        { id: "horizon", title: "Horizon placement", text: "A low horizon emphasizes sky; a high horizon emphasizes land or water. Keep it level." },
        { id: "symmetry", title: "Symmetry and reflection", text: "Still water and centered compositions suit symmetry. Center the horizon on purpose, not by default." }
      ] },
    { id: "pocket", kind: "pocket", title: "Pocket card",
      description: "A small printable card (4 × 6 in) with field settings, sun times for your saved location, and your gear checklist, to carry in a camera bag." }
  ],

  previews: [
    { view: "planning", item: "sun" },
    { view: "settings" },
    { view: "planning", item: "composition" }
  ]
};
