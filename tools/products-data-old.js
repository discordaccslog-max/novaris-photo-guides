const S = require("./svg");

const products = [
  {
    id: "portrait-session-guide",
    name: "Portrait Session Guide",
    price: 34,
    icon: "portrait",
    short: "Shot lists by session type, posing reference diagrams, natural-light and one- or two-light setups, and client session planning sheets.",
    title: "Portrait Session Guide — PDF shot lists, posing and lighting reference",
    meta: "A printable PDF reference for portrait sessions: shot lists for headshots, families and couples, posing diagrams, natural-light and one- or two-light setups, and planning sheets. $34.",
    lede: "A printable reference for portrait sessions: shot lists organized by session type, posing reference diagrams, lighting setups for natural light and for one or two lights, and planning sheets for preparing each client session.",
    contents: [
      ["Shot lists by session type", "Separate shot lists for headshot, family, and couples sessions, laid out as checklists you can mark off during the session and add to on the day."],
      ["Posing reference diagrams", "Line-drawn diagrams of standing, seated, and group arrangements, used as a quick visual reference for positioning people in the frame."],
      ["Natural-light setups", "Top-down diagrams of common natural-light situations, such as window light, open shade, and backlight, showing subject, camera, and light direction."],
      ["One- and two-light setups", "Diagrams for single-light and two-light portraits that mark light placement, angle, modifier type, and the position of reflectors or backgrounds."],
      ["Client session planning sheets", "Worksheets for recording session details ahead of time: people in the session, location, timing, wardrobe notes, and must-have shots."]
    ],
    forWho: [
      "Photographers who run headshot, family, or couples sessions and want a printed shot list and setup reference on hand",
      "Anyone who plans sessions on paper and wants consistent worksheets for each client",
      "Photographers who work with natural light, a single light, or a simple two-light kit"
    ],
    notFor: [
      "Anyone looking for a course or lessons: this guide is reference pages, not instruction",
      "Photographers who need editable or fillable templates: the PDFs are flat and meant for printing",
      "Large studio productions built around complex multi-light rigs",
      "Anyone hoping for feedback on their photos: the guide contains no critique"
    ],
    extraFormat: null,
    previews: [
      () => ({ cap: ["Lighting diagram", "A two-light portrait setup shown from above, with placement notes."], svg: S.lighting({
        label: "Lighting setups", title: "Two-light portrait: key and fill",
        desc: "Top-down diagram with a backdrop at the top, the subject in the center, a softbox key light at 45 degrees to camera left, a reflector for fill on the right, and the camera at the bottom, followed by placement notes.",
        items: [
          { type: "backdrop", x: 150, y: 86, text: "Backdrop", ty: 102 },
          { type: "subject", x: 150, y: 140, text: "Subject", tx: 150, ty: 166 },
          { type: "softbox", x: 80, y: 170, rot: -135, text: "Key — softbox", tx: 70, ty: 196 },
          { type: "beam", x: 90, y: 162, x2: 140, y2: 146 },
          { type: "reflector", x: 222, y: 168, rot: 125, text: "Fill — reflector", tx: 226, ty: 192 },
          { type: "camera", x: 150, y: 226, rot: 0, text: "Camera", tx: 196, ty: 230 }
        ],
        notes: ["Key: 45° camera left, slightly above eye line", "Fill: opposite side, close enough to soften shadow", "Backdrop: leave space to avoid spill"]
      }) }),
      () => ({ cap: ["Shot list layout", "The family session shot list, with framing notes and checkboxes."], svg: S.shotList({
        label: "Shot lists", title: "Shot list: family session",
        desc: "A table of family session shots with a framing column and a checkbox for each row, followed by blank lines for shots added on the day.",
        rows: [["Full group, looking at camera", "Wide"], ["Full group, interacting", "Wide"], ["Parents together", "Medium"], ["Each parent with each child", "Medium"], ["Siblings together", "Medium"], ["Each child alone", "Tight"], ["Hands and details", "Close"], ["Walking toward camera", "Wide"], ["Seated group, variation", "Medium"]]
      }) }),
      () => ({ cap: ["Planning sheet", "The client session planning sheet, completed before the session."], svg: S.planning({
        label: "Planning worksheets", title: "Client session planning sheet",
        desc: "A worksheet with fields for client name, session type, date, time, location, number of people, and wardrobe, plus boxes for must-have shots and location light notes.",
        fields: ["Client name", "Session type", "Date", "Start time", "Location", "People in session", "Wardrobe colors", "Backup location"],
        boxes: [{ title: "Must-have shots", h: 86 }, { title: "Light at location and time of day", h: 72 }]
      }) })
    ]
  },
  {
    id: "wedding-day-guide",
    name: "Wedding Day Guide",
    price: 52,
    icon: "wedding",
    short: "Full-day timeline templates, shot lists by phase, a family formals grouping planner, a venue scouting worksheet, a gear checklist, and a client questionnaire.",
    title: "Wedding Day Guide — PDF timeline templates, shot lists and planners",
    meta: "A printable PDF reference for wedding days: full-day timeline templates, shot lists by phase, family formals planner, venue scouting worksheet, gear checklist and client questionnaire. $52.",
    lede: "A printable planning and reference set for covering a wedding day from preparation to reception: timeline templates, shot lists for each phase, a family formals grouping planner, a venue scouting worksheet, a gear checklist, and a client questionnaire.",
    contents: [
      ["Full-day timeline templates", "Templates for laying out the whole day in order, with space for times, locations, travel between venues, and buffer time."],
      ["Shot lists by phase", "Separate shot lists for preparation, ceremony, formals, and reception, each laid out as a checklist with room for couple-specific additions."],
      ["Family formals grouping planner", "A planner for listing each family group in the order it will be photographed, with space for names and for the family contact who can gather people."],
      ["Venue scouting worksheet", "A worksheet for recording ceremony and reception spaces, light at the relevant times, backup spots for poor weather, and venue rules."],
      ["Gear checklist", "A checklist for packing and checking equipment before the day, organized by category and written without reference to any brand."],
      ["Client questionnaire", "A questionnaire to share with the couple to collect key names, timings, priorities, and family details ahead of the wedding."]
    ],
    forWho: [
      "Photographers covering full wedding days who plan the timeline and shot lists in advance",
      "Second shooters and assistants who need a printed copy of the plan for their part of the day",
      "Photographers who want a consistent questionnaire to send couples before every wedding"
    ],
    notFor: [
      "Anyone looking for a wedding photography course: these are planning and reference pages, not lessons",
      "Anyone who wants fillable digital forms: the PDFs are flat and designed to be printed and written on",
      "Wedding planners looking for vendor or budget management tools",
      "Anyone looking for posing or lighting instruction: this guide focuses on planning and shot lists"
    ],
    extraFormat: null,
    previews: [
      () => ({ cap: ["Timeline template", "A page from the full-day timeline template, with blank times for each part of the day."], svg: S.timeline({
        label: "Timeline templates", title: "Full-day timeline",
        desc: "A vertical timeline with blank time fields beside each part of the wedding day, from preparation details through ceremony, formals, portraits, and reception, followed by lines for travel and buffer notes.",
        rows: [["Preparation: details", "Rings, attire, invitation, flowers"], ["Preparation: getting ready", "Both sides, final touches"], ["First look (optional)", "Location and privacy"], ["Ceremony", "Processional to recessional"], ["Family formals", "Use the grouping planner"], ["Couple portraits", "Location and light"], ["Reception entrance", "Room set before guests enter"], ["Toasts and first dance", "Confirm order with planner"], ["Cake, dances, exit", "Final coverage time"]]
      }) }),
      () => ({ cap: ["Shot list layout", "The ceremony shot list, part of the shot lists organized by phase."], svg: S.shotList({
        label: "Shot lists by phase", title: "Shot list: ceremony",
        columns: ["Shot", "Position", "Done"],
        desc: "A ceremony shot list with a position column and checkboxes, listing shots from the empty venue through the processional, vows, rings, kiss, and recessional.",
        rows: [["Venue before guests arrive", "Back"], ["Guests arriving", "Entrance"], ["Partner waiting at the front", "Aisle"], ["Processional", "Aisle"], ["Reactions at first sight", "Front side"], ["Vows, wide and tight", "Side"], ["Ring exchange", "Side"], ["First kiss", "Aisle"], ["Recessional", "Aisle"]]
      }) }),
      () => ({ cap: ["Grouping planner", "The family formals grouping planner, with groups in shooting order."], svg: S.grouping({
        label: "Family formals", title: "Family formals grouping planner",
        desc: "A list of family groups in the order they will be photographed, each with simple figure icons showing group size and a checkbox, followed by a line for the family contact who knows everyone.",
        groups: [["Couple with both families", 8, 2], ["Couple with partner A's family", 6, 2], ["Couple with partner A's parents", 4, 2], ["Couple with partner B's family", 6, 2], ["Couple with partner B's parents", 4, 2], ["Couple with grandparents", 6, 2]]
      }) })
    ]
  },
  {
    id: "product-photography-guide",
    name: "Product Photography Guide",
    price: 39,
    icon: "product",
    short: "Tabletop lighting setups, background and surface reference, shot lists for standard e-commerce angles, and settings charts for common scenarios.",
    title: "Product Photography Guide — PDF tabletop lighting and shot list reference",
    meta: "A printable PDF reference for product photography: tabletop lighting setups, background and surface reference, e-commerce angle shot lists and settings charts. $39.",
    lede: "A printable reference for tabletop product work: lighting setup diagrams, a reference for backgrounds and surfaces, shot lists covering the standard e-commerce angles, and settings charts for common product scenarios.",
    contents: [
      ["Tabletop lighting setups", "Top-down diagrams of tabletop lighting arrangements, showing light position, modifier type, bounce cards, and background placement relative to the product."],
      ["Background and surface reference", "Reference pages describing common backgrounds and surfaces, such as seamless sweeps, textured boards, and reflective surfaces, and how each tends to behave under light."],
      ["Shot lists for e-commerce angles", "Checklists covering standard catalogue angles, including front, three-quarter, side, back, top-down, detail, and scale shots, so each product gets a consistent set."],
      ["Settings charts for common scenarios", "Charts with starting-point settings for situations such as white backgrounds, reflective items, and flat lays, with space to record your own adjustments."]
    ],
    forWho: [
      "Photographers shooting products on a tabletop for online shops, catalogues, or listings",
      "Small-business owners who photograph their own products and want a consistent shot list for every item",
      "Anyone who wants a printed lighting and settings reference beside the shooting table"
    ],
    notFor: [
      "Anyone looking for a course or step-by-step lessons: this guide is reference material, not instruction",
      "Large-product, vehicle, or architectural photography that doesn't fit on a tabletop",
      "Anyone who needs editing or retouching instructions: the guide covers setup and capture planning only",
      "Anyone who needs editable templates: the PDFs are flat and designed for printing"
    ],
    extraFormat: null,
    previews: [
      () => ({ cap: ["Lighting diagram", "A tabletop setup with soft side light and a bounce card, shown from above."], svg: S.lighting({
        label: "Tabletop lighting", title: "Soft side light with bounce card",
        desc: "Top-down tabletop diagram with a curved sweep background at the top, the product in the center, a softbox to the left, a white bounce card to the right, and the camera at the bottom, followed by placement notes.",
        items: [
          { type: "backdrop", x: 150, y: 88, text: "Sweep", ty: 104 },
          { type: "product", x: 150, y: 146, text: "Product", tx: 150, ty: 170 },
          { type: "softbox", x: 70, y: 146, rot: -90, text: "Softbox", tx: 62, ty: 178 },
          { type: "beam", x: 80, y: 146, x2: 138, y2: 146 },
          { type: "reflector", x: 222, y: 146, rot: 90, text: "Bounce card", tx: 230, ty: 176 },
          { type: "camera", x: 150, y: 226, rot: 0, text: "Camera", tx: 196, ty: 230 }
        ],
        notes: ["Softbox level with product, slightly behind", "Bounce card opposite to lift shadow side", "Sweep far enough back to stay even"]
      }) }),
      () => ({ cap: ["Shot list layout", "The standard e-commerce angles shot list."], svg: S.shotList({
        label: "Shot lists", title: "E-commerce angles",
        columns: ["Angle", "Framing", "Done"],
        desc: "A shot list of standard e-commerce angles with a framing column and checkboxes: front, three-quarter left and right, side, back, top-down, detail, scale, and packaging.",
        rows: [["Front", "Centered"], ["Three-quarter left", "Centered"], ["Three-quarter right", "Centered"], ["Side profile", "Centered"], ["Back", "Centered"], ["Top-down", "Overhead"], ["Material detail", "Close"], ["Scale reference", "Wide"], ["Packaging", "Centered"]]
      }) }),
      () => ({ cap: ["Settings chart", "A settings reference chart for common tabletop scenarios."], svg: S.chart({
        label: "Settings reference", title: "Settings: common scenarios",
        desc: "A chart listing tabletop scenarios with starting aperture, shutter speed, and ISO for each, a reminder that values are starting points, and lines for your own adjustments.",
        headers: ["Scenario", "Aperture", "Shutter", "ISO"],
        rows: [["White sweep", "f/8–f/11", "1/125", "100"], ["Reflective item", "f/8", "1/125", "100"], ["Flat lay", "f/5.6–f/8", "1/125", "100"], ["Small detail", "f/11–f/16", "1/125", "100–200"], ["Continuous light", "f/8", "1/60", "200–400"], ["Dark product", "f/8", "1/125", "100"]],
        foot: ["Starting points with a tripod and controlled light.", "Adjust for your light output, distance, and lens."]
      }) })
    ]
  },
  {
    id: "landscape-travel-field-guide",
    name: "Landscape & Travel Field Guide",
    price: 29,
    icon: "landscape",
    short: "Location scouting worksheets, sunrise and sunset planning sheets, composition reference, field settings charts, and a gear checklist, plus a pocket format for a camera bag.",
    title: "Landscape & Travel Field Guide — PDF scouting and field settings reference",
    meta: "A printable PDF field reference for landscape and travel photography: scouting worksheets, sunrise and sunset planning sheets, composition reference, field settings charts, gear checklist and pocket format. $29.",
    lede: "A printable field reference for landscape and travel work: location scouting worksheets, sunrise and sunset planning sheets, a composition reference, field settings charts, and a gear checklist, with a pocket format of the field pages to carry in a camera bag.",
    contents: [
      ["Location scouting worksheets", "Worksheets for recording a location before or during a visit: access, parking, permits, hazards, viewpoints, and a sketch area for marking positions."],
      ["Sunrise and sunset planning sheets", "Sheets for noting sunrise, sunset, golden hour and blue hour times, sun direction on a compass diagram, weather, and when to arrive."],
      ["Composition reference", "Diagram pages illustrating common composition structures, such as leading lines, foreground framing, layering, and horizon placement."],
      ["Field settings charts", "Charts with starting-point settings for common field situations, such as handheld scenes, tripod work at low light, moving water, and night skies."],
      ["Gear checklist", "A packing checklist for day trips and longer travel, organized by category and written without reference to any brand."],
      ["Pocket format", "A pocket version of the field references, sized to carry in a camera bag for use on location."]
    ],
    forWho: [
      "Photographers who plan landscape shoots around sunrise, sunset, and weather",
      "Travelling photographers who want a printed scouting and packing routine",
      "Anyone who prefers a paper reference in the camera bag over checking a phone on location"
    ],
    notFor: [
      "Anyone looking for a landscape photography course: this guide is reference and planning material, not instruction",
      "Anyone who needs location-specific information, maps, or permit details for particular places",
      "Anyone who needs fillable digital worksheets: the PDFs are flat and meant to be printed",
      "Anyone looking for editing or post-processing guidance"
    ],
    extraFormat: "Includes a pocket format of the field references for carrying in a camera bag.",
    previews: [
      () => ({ cap: ["Planning sheet", "The sunrise and sunset planning sheet, with a compass for sun direction."], svg: S.sunPlanner({
        label: "Sunrise and sunset planning", title: "Sunrise and sunset planning sheet",
        desc: "A planning sheet with fields for location, date, sunrise, sunset, golden hour and blue hour times, a compass diagram with sunrise and sunset directions marked, fields for bearings, weather and arrival time, and lines for composition ideas."
      }) }),
      () => ({ cap: ["Scouting worksheet", "The location scouting worksheet, with a dotted sketch area for marking viewpoints."], svg: S.scouting({
        label: "Location scouting", title: "Location scouting worksheet",
        desc: "A worksheet with fields for location name, access, permits, and best light, a dotted sketch area showing a path, two marked viewpoints and a north arrow, and lines for hazards, tides, and closures."
      }) }),
      () => ({ cap: ["Settings chart", "A field settings chart for common landscape situations."], svg: S.chart({
        label: "Field settings", title: "Field settings reference",
        desc: "A chart of field situations with starting aperture, shutter speed, and ISO for each, a reminder that values are starting points, and lines for your own adjustments.",
        headers: ["Situation", "Aperture", "Shutter", "ISO"],
        rows: [["Handheld daylight", "f/8", "1/250", "100–200"], ["Tripod, golden hour", "f/11", "1/15–1s", "100"], ["Blue hour", "f/8", "2–10s", "100"], ["Silky water", "f/11–f/16", "1–4s", "100"], ["Frozen waves", "f/8", "1/1000", "400"], ["Night sky", "f/2.8", "15–20s", "1600–3200"]],
        foot: ["Starting points only. Light, lens, and conditions vary.", "Check your histogram and adjust from here."]
      }) })
    ]
  },
  {
    id: "event-coverage-guide",
    name: "Event Coverage Guide",
    price: 44,
    icon: "event",
    short: "Shot lists for corporate events, parties, and conferences, low-light settings reference, flash setups, and run-of-show planning sheets.",
    title: "Event Coverage Guide — PDF event shot lists, flash setups and run-of-show sheets",
    meta: "A printable PDF reference for event photography: shot lists for corporate events, parties and conferences, low-light settings, flash setup diagrams and run-of-show planning sheets. $44.",
    lede: "A printable reference for covering events: shot lists for corporate events, parties, and conferences, a low-light settings reference, flash setup diagrams, and run-of-show planning sheets for matching coverage to the event schedule.",
    contents: [
      ["Shot lists by event type", "Separate shot lists for corporate events, parties, and conferences, covering venue and signage, speakers, attendees, key moments, and details."],
      ["Low-light settings reference", "Charts with starting-point settings for dim venues, stage lighting, mixed light, and evening receptions, with space to note your adjustments."],
      ["Flash setups", "Diagrams of on-camera bounce flash and simple off-camera flash arrangements for rooms of different sizes, showing flash direction and bounce surfaces."],
      ["Run-of-show planning sheets", "Sheets for matching coverage to the event schedule: time, segment, location, people involved, and shots that must not be missed."]
    ],
    forWho: [
      "Photographers covering corporate events, conferences, launches, and private parties",
      "Photographers who work from a client's schedule and want coverage planned against it",
      "Anyone who wants a printed low-light and flash reference for dim venues"
    ],
    notFor: [
      "Anyone looking for event photography lessons: this guide is reference and planning material, not instruction",
      "Weddings: the Wedding Day Guide is built for that day's structure",
      "Concert or sports coverage with its own access rules and equipment demands",
      "Anyone who needs editable templates: the PDFs are flat and meant for printing"
    ],
    extraFormat: null,
    previews: [
      () => ({ cap: ["Lighting diagram", "A flash setup for a conference room, with bounce and off-camera flash."], svg: S.lighting({
        label: "Flash setups", title: "Bounce plus off-camera flash",
        desc: "Top-down diagram of a conference room with a speaker near the top, an off-camera flash on a stand at the side, the camera at the bottom with its on-camera flash bounced off a side wall toward the speaker, and placement notes.",
        items: [
          { type: "subject", x: 150, y: 100, text: "Speaker", tx: 150, ty: 126 },
          { type: "flash", x: 232, y: 112, rot: 120, text: "Off-camera flash", tx: 226, ty: 140 },
          { type: "beam", x: 226, y: 108, x2: 162, y2: 100 },
          { type: "camera", x: 150, y: 206, rot: 0, text: "Camera + bounce flash", tx: 150, ty: 230 },
          { type: "angle", d: "M34 66 L34 240" },
          { type: "beam", x: 144, y: 198, x2: 36, y2: 160 },
          { type: "beam", x: 36, y: 160, x2: 138, y2: 104 },
          { type: "wall", x: 34, y: 153, text: "Bounce wall", tx: 66, ty: 196 }
        ],
        notes: ["On-camera flash bounced off a side wall", "Off-camera flash on a stand, aimed across the stage", "Check bounce surface color before relying on it"]
      }) }),
      () => ({ cap: ["Shot list layout", "The corporate event shot list."], svg: S.shotList({
        label: "Shot lists", title: "Shot list: corporate event",
        columns: ["Shot", "When", "Done"],
        desc: "A corporate event shot list with a timing column and checkboxes, covering venue, signage, registration, speakers, audience, networking, awards, group photos, and details.",
        rows: [["Venue exterior and signage", "Arrival"], ["Registration and welcome", "Arrival"], ["Room set before doors open", "Before"], ["Each speaker, wide and tight", "Talks"], ["Audience reactions", "Talks"], ["Networking conversations", "Breaks"], ["Awards or announcements", "Agenda"], ["Team group photo", "Agenda"], ["Branding and catering details", "Any time"]]
      }) }),
      () => ({ cap: ["Planning sheet", "The run-of-show planning sheet, used against the client's schedule."], svg: S.planning({
        label: "Run of show", title: "Run-of-show planning sheet",
        desc: "A planning sheet with fields for event name, date, client contact, and venue, followed by boxes for the schedule with must-capture moments and for access and restricted areas.",
        fields: ["Event name", "Date", "Client contact", "Venue", "Coverage start", "Coverage end"],
        boxes: [{ title: "Time · segment · location · must-capture", h: 126 }, { title: "Access, restricted areas, and VIPs", h: 58 }]
      }) })
    ]
  },
  {
    id: "complete-reference-library",
    name: "Complete Reference Library",
    price: 119,
    icon: "library",
    short: "All five guides together: Portrait Session, Wedding Day, Product Photography, Landscape & Travel Field, and Event Coverage.",
    title: "Complete Reference Library — all five Novaris photography reference guides",
    meta: "All five Novaris Photo Guides in one purchase: Portrait Session, Wedding Day, Product Photography, Landscape & Travel Field, and Event Coverage. Printable PDFs in US Letter and A4. $119.",
    lede: "All five Novaris Photo Guides in a single purchase: the Portrait Session Guide, Wedding Day Guide, Product Photography Guide, Landscape & Travel Field Guide, and Event Coverage Guide, each in US Letter and A4.",
    contents: null,
    forWho: [
      "Photographers who work across several kinds of photography and want the whole set of references",
      "Anyone who wants one consistent set of shot lists, diagrams, charts, and worksheets for portraits, weddings, products, landscapes, and events"
    ],
    notFor: [
      "Anyone who only needs one kind of reference: each guide is also sold on its own",
      "Anyone looking for a course or lessons: the library is reference and planning material, not instruction",
      "Anyone who needs editable templates: every guide is a flat PDF meant for printing"
    ],
    extraFormat: "Delivered as five separate guides, each in both US Letter and A4. The Landscape & Travel Field Guide includes its pocket format.",
    previews: [
      () => ({ cap: ["Lighting diagram", "From the Portrait Session Guide: a two-light portrait setup."], ref: 0, idx: 0 }),
      () => ({ cap: ["Shot list layout", "From the Wedding Day Guide: the ceremony shot list."], ref: 1, idx: 1 }),
      () => ({ cap: ["Planning sheet", "From the Landscape & Travel Field Guide: the sunrise and sunset planning sheet."], ref: 3, idx: 0 })
    ]
  }
];

module.exports = products;
