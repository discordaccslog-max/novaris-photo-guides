/* Storefront copy for each product page. Prices and names come from js/products.js. */

export const PRODUCT_PAGES = {
  "portrait-session-guide": {
    icon: "portrait",
    title: "Portrait Session Guide: interactive shot lists, lighting and posing references",
    meta: "A browser-based field guide for portrait sessions: checkable shot lists for headshots, families and couples, tap-to-explain lighting diagrams, illustrated poses, an exposure calculator, planning sheets and a client questionnaire. $34.",
    lede: "An interactive field guide for portrait sessions that runs in your browser and is built for use on a phone during the shoot. It holds shot lists for headshot, family, and couples sessions, overhead lighting diagrams you can tap for setup notes, illustrated posing references, a settings reference with an exposure calculator, a session planning sheet, and a client questionnaire you can send as a PDF.",
    contents: [
      ["Shot lists for three session types", "Headshot, family, and couples lists in shooting order. Start a session from a list, tick shots off as you go, see a progress bar and the next shot, and add, remove, or reorder shots for each client. Each session is saved on your device."],
      ["Six lighting diagrams", "Overhead diagrams for window light, open shade, backlight with a reflector, one softbox, two lights with fill, and two lights with a rim. Tap any light, modifier, person, or camera to see its role and setup notes."],
      ["Twelve posing references", "Figure diagrams in one consistent illustrated style, from a weight-shift stance and three-quarter headshot to couples walking and tiered family groups, each with notes and a suggested camera height."],
      ["Settings reference and exposure calculator", "Starting points for common portrait situations, plus a calculator that finds an equivalent exposure when you change aperture, shutter speed, or ISO."],
      ["Client session planning sheet", "Record the client, location, people, wardrobe, must-have shots, and light before each session. Saved on your device and exportable as a PDF."],
      ["Client questionnaire", "Edit the questions, add your business name, and export a PDF to send to your own clients, either blank or with answers you've recorded."]
    ],
    forWho: [
      "Photographers who run headshot, family, or couples sessions and want a shot list and setup reference on their phone",
      "Anyone who plans sessions in advance and wants a consistent planning sheet and client questionnaire",
      "Photographers working with natural light, one light, or a simple two-light kit"
    ],
    notFor: [
      "Anyone looking for a course or lessons: this is a reference and planning tool, not instruction",
      "Anyone hoping for feedback on their photos: the guide contains no critique",
      "Large studio productions built around complex multi-light rigs"
    ],
    previews: [
      { view: "lighting", item: "one-light", caption: "Lighting diagram: tap each part for its role and setup notes." },
      { view: "shotlists", item: "family", caption: "Family session shot list with progress and the next shot." },
      { view: "poses", item: "couple-side", caption: "Posing reference with notes and camera height." }
    ]
  },
  "wedding-day-guide": {
    icon: "wedding",
    title: "Wedding Day Guide: interactive shot list, timeline, and formals planner",
    meta: "A browser-based field guide for wedding days: a checkable shot list by phase, an editable full-day timeline, a family formals grouping planner, a venue scouting worksheet, a gear checklist, a client questionnaire, and an exposure calculator. $52.",
    lede: "An interactive field guide for covering a wedding day from preparation to reception, built for use on a phone. It holds a full-day shot list organized by phase, an editable wedding timeline, a family formals grouping planner, a venue scouting worksheet, a gear checklist, a client questionnaire, and a settings reference with an exposure calculator.",
    contents: [
      ["Full-day shot list by phase", "Preparation, ceremony, formals, and reception in shooting order. Tick shots off during the day, follow the progress bar and the next shot, and customize the list for each couple. Saved per wedding on your device."],
      ["Full-day timeline", "An editable timeline with time, event, location, and notes for each part of the day. Add, move, or remove rows, tick them off on the day, and export a PDF to share with the couple or planner."],
      ["Family formals grouping planner", "List each group in shooting order with the names of everyone in it, then tick groups off as you photograph them."],
      ["Venue scouting worksheet", "Record ceremony and reception spaces, light at the right times, ceiling height for bounce flash, portrait spots, and bad-weather backups."],
      ["Gear checklist", "A packing and checking list by category, written without reference to any brand, that you can tick off and customize."],
      ["Client questionnaire and settings", "A questionnaire you edit and export as a PDF for the couple, plus wedding settings starting points and an exposure calculator."]
    ],
    forWho: [
      "Photographers covering full wedding days who plan timelines and shot lists in advance",
      "Second shooters and assistants who need the plan on their phone on the day",
      "Photographers who want the same questionnaire and checklist for every wedding"
    ],
    notFor: [
      "Anyone looking for a wedding photography course: this is a planning and reference tool, not lessons",
      "Wedding planners looking for vendor or budget management",
      "Anyone looking for posing or lighting diagrams: this guide focuses on planning and shot lists"
    ],
    previews: [
      { view: "shotlists", item: "wedding-day", caption: "The full-day shot list, organized by phase." },
      { view: "planning", item: "timeline", caption: "The editable wedding timeline." },
      { view: "planning", item: "formals", caption: "The family formals grouping planner." }
    ]
  },
  "product-photography-guide": {
    icon: "product",
    title: "Product Photography Guide: tabletop lighting diagrams and e-commerce shot lists",
    meta: "A browser-based field guide for tabletop product photography: tap-to-explain lighting diagrams, a background and surface reference, shot lists for standard e-commerce angles, and settings charts with an exposure calculator. $39.",
    lede: "An interactive field guide for tabletop product photography that runs in your browser on a phone, tablet, or computer. It holds overhead lighting diagrams you can tap for setup notes, a reference for backgrounds and surfaces, shot lists covering the standard e-commerce angles, and settings charts with an exposure calculator.",
    contents: [
      ["Five tabletop lighting diagrams", "Soft side light with a bounce card, overhead flat lay, pure white background, reflective products, and backlit glass. Tap any light, card, diffuser, or the camera to see its role and setup notes."],
      ["Background and surface reference", "How seamless sweeps, black and white acrylic, textured boards, fabric, and colored paper look and behave under light, with practical notes for each."],
      ["E-commerce angle shot list", "A consistent set of catalog angles and supporting frames for each product. Tick angles off per product and customize the list for a client's catalog."],
      ["Pre-shoot setup check", "A checklist to run before the first product so a whole set matches: camera position, focal length, white balance, and exposure."],
      ["Settings charts and exposure calculator", "Starting points for white backgrounds, reflective items, flat lays, small details, and continuous light, plus a calculator for equivalent exposures."]
    ],
    forWho: [
      "Photographers shooting products on a tabletop for online shops, catalogs, or listings",
      "Small-business owners who photograph their own products and want a consistent shot list",
      "Anyone who wants a lighting and settings reference beside the shooting table"
    ],
    notFor: [
      "Anyone looking for a course or step-by-step lessons: this is a reference tool, not instruction",
      "Large-product, vehicle, or architectural photography that doesn't fit on a tabletop",
      "Anyone who needs editing or retouching instructions"
    ],
    previews: [
      { view: "lighting", item: "reflective", caption: "Lighting diagram for reflective products." },
      { view: "shotlists", item: "ecommerce", caption: "The e-commerce angle shot list." },
      { view: "settings", item: null, caption: "Settings reference and exposure calculator." }
    ]
  },
  "landscape-travel-field-guide": {
    icon: "landscape",
    title: "Landscape & Travel Field Guide: sun planner, scouting worksheets, field settings",
    meta: "A browser-based field guide for landscape and travel photography: sunrise, sunset, golden and blue hour planner, location scouting worksheets, a composition reference, field settings with an exposure and ND filter calculator, a gear checklist and a pocket card. $29.",
    lede: "An interactive field guide for landscape and travel work, built for a phone on location. It calculates sunrise, sunset, golden hour, and blue hour for any date and place on your device, and holds location scouting worksheets, a composition reference, field settings with an exposure and ND filter calculator, a gear checklist, and a printable pocket card.",
    contents: [
      ["Sunrise and sunset planner", "Sunrise, sunset, solar noon, golden hour, and blue hour times for any date and location, with sunrise and sunset directions on a compass. Use your current location if you like; coordinates are stored only on your device."],
      ["Location scouting worksheet", "Record access, permits, best light, viewpoints, foreground interest, hazards, and phone signal for each location. Saved on your device and exportable as a PDF."],
      ["Composition reference", "Diagrams of thirds, leading lines, foreground framing, layers, horizon placement, and symmetry, with a note on when each works."],
      ["Field settings and calculator", "Starting points for handheld scenes, golden and blue hour, moving water, waves, night skies, and street scenes, plus a calculator that includes ND filters for long exposures."],
      ["Gear checklist", "A packing list for day trips and travel that you can tick off and customize."],
      ["Pocket card", "A 4 × 6 in printable card with field settings, sun times for your saved location, and your gear checklist, to carry in a camera bag."]
    ],
    forWho: [
      "Photographers who plan landscape shoots around sunrise, sunset, and weather",
      "Traveling photographers who want a scouting and packing routine on their phone",
      "Anyone who wants sun times and settings available offline on location"
    ],
    notFor: [
      "Anyone looking for a landscape photography course: this is a reference and planning tool, not instruction",
      "Anyone who needs maps, trail information, or permit details for particular places",
      "Anyone looking for editing or post-processing guidance"
    ],
    previews: [
      { view: "planning", item: "sun", caption: "The sunrise and sunset planner." },
      { view: "settings", item: null, caption: "Field settings with the exposure and ND filter calculator." },
      { view: "planning", item: "composition", caption: "The composition reference." }
    ]
  },
  "event-coverage-guide": {
    icon: "event",
    title: "Event Coverage Guide: event shot lists, flash setups, run-of-show sheets",
    meta: "A browser-based field guide for event photography: checkable shot lists for corporate events, parties and conferences, tap-to-explain flash setups, a low-light settings reference with exposure calculator, run-of-show sheets and an event brief. $44.",
    lede: "An interactive field guide for covering events, built for use on a phone in the room. It holds shot lists for corporate events, parties, and conferences, overhead flash setup diagrams you can tap for notes, a low-light settings reference with an exposure calculator, a run-of-show planning sheet, and an event brief.",
    contents: [
      ["Shot lists for three event types", "Corporate events, parties, and conferences, in running order. Tick shots off, follow the progress bar and next shot, and customize each list for the client. Saved per event on your device."],
      ["Five flash and lighting diagrams", "Ceiling bounce, side-wall bounce, off-camera flash with on-camera fill, stage lighting without flash, and a two-flash group photo. Tap any part to see its role and setup notes."],
      ["Low-light settings and calculator", "Starting points for ballrooms, stages, dim party rooms, dance floors, group photos, and evening events, plus an exposure calculator."],
      ["Run-of-show planning sheet", "Match coverage to the client's schedule with time, segment, location, people, and must-capture shots. Tick rows off as the event runs and export a PDF."],
      ["Event brief", "Record the client contact, coverage hours, key people, restricted areas, branding, and delivery expectations before the day."]
    ],
    forWho: [
      "Photographers covering corporate events, conferences, launches, and private parties",
      "Photographers who work from a client's schedule and want coverage planned against it",
      "Anyone who wants a low-light and flash reference for dim venues"
    ],
    notFor: [
      "Anyone looking for event photography lessons: this is a reference and planning tool, not instruction",
      "Weddings: the Wedding Day Guide is built for that day's structure",
      "Concert or sports coverage with its own access rules"
    ],
    previews: [
      { view: "lighting", item: "ceiling-bounce", caption: "Flash setup: ceiling bounce." },
      { view: "shotlists", item: "conference", caption: "The conference shot list." },
      { view: "planning", item: "run-of-show", caption: "The run-of-show planning sheet." }
    ]
  },
  "complete-reference-library": {
    icon: "library",
    title: "Complete Reference Library: all five Novaris field guides, one license",
    meta: "All five Novaris field guides unlocked by a single license: Portrait Session, Wedding Day, Product Photography, Landscape & Travel Field, and Event Coverage. Runs in your browser on any device. $119.",
    lede: "All five Novaris field guides, unlocked together with one license code: the Portrait Session Guide, Wedding Day Guide, Product Photography Guide, Landscape & Travel Field Guide, and Event Coverage Guide. They run side by side in the Field Kit on any phone, tablet, or computer.",
    contents: null,
    forWho: [
      "Photographers who work across several kinds of photography and want every guide",
      "Anyone who wants one consistent set of shot lists, diagrams, calculators, and worksheets for portraits, weddings, products, landscapes, and events"
    ],
    notFor: [
      "Anyone who only needs one kind of guide: each is also sold on its own",
      "Anyone looking for a course or lessons: the guides are reference and planning tools, not instruction"
    ],
    previews: [
      { guide: "portrait-session-guide", view: "lighting", item: "one-light", caption: "From the Portrait Session Guide: a lighting diagram." },
      { guide: "wedding-day-guide", view: "shotlists", item: "wedding-day", caption: "From the Wedding Day Guide: the full-day shot list." },
      { guide: "landscape-travel-field-guide", view: "planning", item: "sun", caption: "From the Landscape & Travel Field Guide: the sun planner." }
    ]
  }
};

/* Sections each guide contains, for the comparison table. */
export const MATRIX = [
  ["portrait-session-guide", "Portrait Session", { shot: 1, light: 1, pose: 1, set: 1, plan: 1, quest: 1, sun: 0 }],
  ["wedding-day-guide", "Wedding Day", { shot: 1, light: 0, pose: 0, set: 1, plan: 1, quest: 1, sun: 0 }],
  ["product-photography-guide", "Product Photography", { shot: 1, light: 1, pose: 0, set: 1, plan: 0, quest: 0, sun: 0 }],
  ["landscape-travel-field-guide", "Landscape & Travel Field", { shot: 0, light: 0, pose: 0, set: 1, plan: 1, quest: 0, sun: 1 }],
  ["event-coverage-guide", "Event Coverage", { shot: 1, light: 1, pose: 0, set: 1, plan: 1, quest: 0, sun: 0 }]
];
