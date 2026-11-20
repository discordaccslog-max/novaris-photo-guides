import { shotlist, checklist, worksheet, table, cards, settings, setup, diagram, text, rows, el, beam } from "./helpers.js";

const camera = (notes, x = 180, label = "Camera", y = 262) => el("camera", "camera", x, y, label, "Your shooting position.", notes);

const sportShotlists = {
  soccer: shotlist("Soccer and field sports", "Field sports with a telephoto from the touchline or behind the goal.", [
    { title: "Action", items: ["Player dribbling toward you, ball visible", "Shot on goal", "Goalkeeper save", "Header or aerial challenge", "Tackle"] },
    { title: "Story", items: ["Goal celebration", "Team huddle", "Coach on the sideline", "Fans and atmosphere", "Handshakes at full time"] }
  ], { kicker: "Shot list", blank: 2 }),
  basketball: shotlist("Basketball and indoor courts", "Indoor sports under arena or gym lighting.", [
    { title: "Action", items: ["Drive to the basket", "Layup or dunk from the baseline", "Jump shot at the top of the jump", "Rebound", "Defense: block or steal"] },
    { title: "Story", items: ["Bench reaction", "Timeout huddle", "Free throw concentration", "Final buzzer reaction"] }
  ], { kicker: "Shot list", blank: 2 }),
  running: shotlist("Running and track", "Road races and track events.", [
    { title: "Action", items: ["Start: runners leaving the line", "Leaders in the pack", "Head-on with a long lens", "Panning blur side-on", "Finish line, arms raised"] },
    { title: "Story", items: ["Warm-up and stretching", "Spectators cheering", "Medals and exhaustion after the finish"] }
  ], { kicker: "Shot list", blank: 2 }),
  outdoor: shotlist("Cycling, skate, and outdoor action", "Action sports where you can choose your position.", [
    { title: "Action", items: ["Rider at the peak of a jump", "Cornering, low angle", "Panning blur", "Wide frame showing the course or park", "Trick sequence (burst)"] },
    { title: "Story", items: ["Preparing equipment", "Crowd and atmosphere", "Podium or session wrap"] }
  ], { kicker: "Shot list", blank: 2 })
};

export default [
  /* ------------------------------------------------------------------ */
  {
    slug: "elopement-small-wedding-guide",
    name: "Elopement & Small Wedding Guide",
    subtitle: "Elopement timelines, a shot list, location and permit planning, settings, and a weather backup plan.",
    intro: [
      "Elopements and small weddings often happen in remote or scenic places with few guests, so planning covers what a venue would normally handle: permits, access, timing with the light, and a plan for the weather.",
      "Rules for ceremonies and photography differ between parks and landowners. Check permits and conditions well in advance."
    ],
    blocks: [
      table("Elopement day timeline", "A sample half-day elopement timeline built around sunset. Adjust times to your date.", ["Time", "Moment", "Notes"], [
        ["Sunset −4:00", "Getting ready", "Details, letters, final touches."],
        ["Sunset −3:00", "First look", "Somewhere private near the location."],
        ["Sunset −2:30", "Travel or hike", "Allow extra time for terrain."],
        ["Sunset −1:30", "Ceremony", "Light is softening; check sun position."],
        ["Sunset −1:00", "Portraits and family", "Family groups first while everyone is fresh."],
        ["Sunset −0:30", "Golden hour portraits", "Backlight and silhouettes."],
        ["Sunset", "Celebration", "Champagne, picnic, or dinner."],
        ["Sunset +0:20", "Blue hour", "Wide scene with the couple small in frame."]
      ], { kicker: "Planner", widths: [0.18, 0.3, 0.52] }),
      shotlist("Elopement shot list", "Smaller than a full wedding, but the key moments are the same.", [
        { title: "Getting ready", items: ["Details: rings, attire, flowers, vows booklet", "Each partner getting ready", "Letters or gifts exchanged"] },
        { title: "Ceremony", items: ["Wide with the landscape", "Officiant and couple", "Vows, close", "Ring exchange", "First kiss", "Reactions from guests"] },
        { title: "Portraits", items: ["Classic full-length portrait", "Walking together", "Wide scenic with the couple small", "Golden hour backlight", "Blue hour frame"] },
        { title: "Celebration", items: ["Toast or picnic", "Signing the marriage document", "Exit or send-off"] }
      ], { fields: ["Couple", "Date"] }),
      checklist("Permit and location checklist", "Confirm everything for the ceremony site.", [
        { title: "Permits", items: ["Ceremony permit (if required)", "Commercial photography permit (if required)", "Guest number limits", "Allowed times and areas", "Rules on decorations, chairs, and confetti"] },
        { title: "Access", items: ["Parking and shuttle", "Walking time and terrain", "Accessibility for guests", "Restroom locations", "Phone signal"] }
      ]),
      settings("Elopement settings", "Starting points for outdoor elopements.", rows([
        ["Ceremony in open light", "f/4", "1/500", "200", "Expose for faces."],
        ["Wide landscape with couple", "f/8", "1/250", "200", "Couple small, scene sharp."],
        ["Golden hour portraits", "f/2.8", "1/500", "200", "Backlight with a reflector."],
        ["Blue hour", "f/2", "1/125", "1600", "Wide scene; slower shutter on a tripod."],
        ["Windy conditions", "", "1/500+", "", "Faster shutter for veils and hair."]
      ])),
      worksheet("Weather backup plan", "Agree the plan with the couple before the day.", ["Forecast to check (and when)", "Decision deadline", "Backup location", "Backup time", "Who to notify", "+Wet-weather kit: umbrellas, towels, rain covers", "+Indoor or covered alternatives", "+Notes"]),
      checklist("Elopement kit", "Pack for travel and terrain.", [
        { title: "Camera", items: ["Two bodies or a backup", "Wide and portrait lenses", "Spare batteries and cards", "Rain cover"] },
        { title: "Field", items: ["Comfortable footwear", "Water, snacks, first aid", "Head torch for after sunset", "Printed timeline and permit"] }
      ])
    ],
    addons: [
      { name: "Elopement timeline template", subtitle: "Plan the day around sunset and travel.", blocks: [
        worksheet("Elopement timeline: key times", "Fill in first, then build the timeline below.", ["Date", "Sunset", "Golden hour starts", "Blue hour ends", "Ceremony start", "Travel time to location"], { kicker: "Add-on" }),
        table("Elopement timeline template", "Build the day backward from sunset.", ["Time", "Moment", "Location", "Notes"], Array.from({ length: 12 }, () => ["", "", "", ""]), { kicker: "Add-on", widths: [0.14, 0.3, 0.24, 0.32] })
      ] },
      { name: "Permit and location checklist", subtitle: "Track permits and site conditions for each location.", blocks: [
        table("Permit tracker", "Many parks and landowners require ceremony or photography permits.", ["Location", "Permit type", "Applied", "Approved", "Cost", "Conditions"], Array.from({ length: 6 }, () => ["", "", "", "", "", ""]), { kicker: "Add-on", widths: [0.2, 0.18, 0.12, 0.12, 0.1, 0.28] }),
        checklist("Site conditions", "Confirm for each location.", [
          { title: "Rules", items: ["Guest limit", "Allowed hours", "Decorations, chairs, and arches", "Confetti and petals", "Drones (often restricted)"] },
          { title: "Practical", items: ["Parking", "Walking time", "Restrooms", "Accessibility", "Phone signal"] }
        ], { kicker: "Add-on" })
      ] },
      { name: "Vow moment shot list", subtitle: "Every frame to cover during the vows.", blocks: [
        shotlist("Vow moment shot list", "Vows happen once. Move quietly between positions.", [
          { title: "Positions", items: ["Wide from behind the officiant, showing the landscape", "Over Partner A's shoulder to Partner B", "Over Partner B's shoulder to Partner A", "Side profile of both"] },
          { title: "Moments", items: ["Reading vows, close", "Holding hands", "Tears or laughter", "Guests reacting", "Ring exchange, close", "First kiss, wide and close"] }
        ], { kicker: "Add-on" })
      ] },
      { name: "Weather backup planner", subtitle: "A decision plan for weather on the day.", blocks: [
        table("Weather backup planner", "Agree triggers and backups in advance.", ["If…", "Then…", "Decide by", "Who tells guests"], [["Rain forecast over 60%", "", "", ""], ["Strong wind", "", "", ""], ["Heat warning", "", "", ""], ["Fog or low cloud", "", "", ""], ["Snow or ice", "", "", ""], ["Road or trail closure", "", "", ""]], { kicker: "Add-on", widths: [0.24, 0.36, 0.16, 0.24] })
      ] }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "sports-action-guide",
    name: "Sports & Action Guide",
    subtitle: "Shutter speeds by sport, shooting positions, shot lists, autofocus settings, and season planning.",
    intro: [
      "Sports photography is anticipation: knowing where the play will go, being in the right position, and having settings fast enough to freeze the moment. This guide gives you starting settings by sport, positions, and shot lists.",
      "Event organizers and venues set rules on where photographers can stand. Confirm access and safety zones before every event."
    ],
    blocks: [
      settings("Shutter speeds by sport", "Starting points to freeze action. Use Auto ISO with these shutter speeds.", rows([
        ["Soccer, rugby, field sports", "f/2.8–f/4", "1/1000–1/1600", "Auto", "Telephoto from the touchline."],
        ["Basketball, volleyball (indoor)", "f/2.8", "1/800", "3200–6400", "Fast lens; raise ISO."],
        ["Running and track", "f/4", "1/1000", "Auto", "Head-on with a long lens."],
        ["Swimming", "f/4", "1/1000", "Auto", "Shoot during the breath."],
        ["Cycling and motorsport (spectator areas)", "f/5.6", "1/1600 or 1/60 pan", "Auto", "Panning shows speed."],
        ["Skate and BMX", "f/4", "1/1000+", "Auto", "Burst at the peak of the trick."]
      ]), ["Continuous autofocus with tracking; back-button focus helps.", "Burst mode, and keep shooting through the action.", "Raise ISO before lowering shutter speed below what freezes the action."]),
      cards("Shooting positions", "Positions that put action toward the camera.", [
        { title: "Behind the goal line", text: "Field sports: players run toward you; goals and saves face the camera." },
        { title: "Corner of the field", text: "Covers attacks toward goal and play along the touchline." },
        { title: "Baseline", text: "Basketball and volleyball: drives and dunks face you." },
        { title: "Finish straight", text: "Running: head-on views of the finish; stay outside safety zones." },
        { title: "Outside of a corner", text: "Cycling and skate: riders lean toward you; good for panning." },
        { title: "High vantage", text: "Shows formations and the whole field; good for context frames." }
      ]),
      sportShotlists.soccer,
      sportShotlists.running,
      worksheet("Event plan", "Plan each event.", ["Event", "Date and start time", "Venue", "Access and accreditation", "Position plan", "Lens plan", "Key athletes or players", "Delivery deadline", "+Safety zones and restrictions", "+Notes"]),
      checklist("Sports kit", "Pack for game day.", [
        { title: "Camera", items: ["Telephoto lens", "Second body with a wider lens", "Monopod", "Spare batteries and fast cards"] },
        { title: "Field", items: ["Rain cover", "Knee pads or a stool", "Weather-appropriate clothing", "Accreditation pass"] }
      ])
    ],
    addons: [
      { name: "Sport-specific shot list pack", subtitle: "Shot lists for four kinds of sport.", blocks: [sportShotlists.soccer, sportShotlists.basketball, sportShotlists.running, sportShotlists.outdoor] },
      { name: "Shutter speed pocket card", size: "pocket", subtitle: "Shutter speeds by sport on a 4 × 6 in card.", blocks: [
        settings("Shutter speeds by sport", "Auto ISO with these shutter speeds.", rows([
          ["Field sports", "f/2.8–4", "1/1000+", "Auto", ""],
          ["Indoor court", "f/2.8", "1/800", "3200+", ""],
          ["Running", "f/4", "1/1000", "Auto", ""],
          ["Swimming", "f/4", "1/1000", "Auto", ""],
          ["Panning", "f/8", "1/30–1/60", "Low", ""],
          ["Skate, BMX", "f/4", "1/1000+", "Auto", ""]
        ]), ["Continuous AF, tracking.", "Burst mode.", "Raise ISO before slowing the shutter."])
      ] },
      { name: "Sideline positioning diagrams", subtitle: "Overhead diagrams of shooting positions for three sports.", blocks: [
        diagram("Soccer: behind the goal line", "Players attack toward you; you see faces and the ball.", [
          el("goal", "backdrop", 180, 80, "Goal line", "End of the field.", "Stay outside the marked photographer zone."),
          el("keeper", "subject", 180, 112, "Goalkeeper", "In front of the goal.", "Saves face the camera from this position."),
          el("player", "subject", 180, 196, "Attacker", "Running toward goal.", "Pre-focus where play will arrive."),
          el("cam1", "camera", 66, 36, "Camera: corner", "Covers attacks and touchline.", "A 300–400 mm lens covers the far half.", 180),
          el("cam2", "camera", 292, 36, "Camera: behind goal", "Goals and saves.", "A shorter lens for action near the goal.", 180)
        ], [], ["Change ends at halftime to follow the attack."], "Position diagram"),
        diagram("Basketball: baseline", "Drives and dunks come straight at the camera.", [
          el("hoop", "backdrop", 180, 70, "Basket and backboard", "Focus point for drives.", "Pre-focus on the area below the rim."),
          el("player", "subject", 180, 160, "Player driving", "Toward the basket.", "Shoot as the player leaves the floor."),
          el("cam1", "camera", 70, 36, "Camera: baseline left", "Drives and layups.", "Sit low; a 70–200 mm lens covers the key.", 180),
          el("cam2", "camera", 290, 36, "Camera: baseline right", "Opposite side.", "Stay within the marked area.", 180)
        ], [], ["Indoor light flickers: use a flicker-reduction setting if your camera has one."], "Position diagram"),
        diagram("Running: finish straight", "Head-on views of runners approaching the finish.", [
          el("runner", "subject", 180, 96, "Runner on the finish straight", "Approaching the camera.", "Track focus from distance; burst as they near the line."),
          el("line", "ceiling", 180, 196, "Finish line", "Arms-raised moment.", "Stand outside the safety zone at a slight angle to the lane."),
          el("camera", "camera", 300, 262, "Camera", "Beyond the finish, off-axis.", "A long lens from beyond the finish line, slightly to the side.", -25)
        ], [], ["Arrive early to claim a clear position."], "Position diagram")
      ] },
      { name: "Season planning calendar", subtitle: "Plan a season of events and deliveries.", blocks: [
        table("Season planning calendar", "List fixtures, events, and delivery dates for the season.", ["Date", "Event or fixture", "Venue", "Accreditation", "Delivery due", "Done"], Array.from({ length: 20 }, () => ["", "", "", "", "", ""]), { kicker: "Add-on", widths: [0.12, 0.3, 0.2, 0.14, 0.14, 0.1] })
      ] }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "automotive-photography-guide",
    name: "Automotive Photography Guide",
    subtitle: "Static and rolling shot lists, reflection control, settings, a location plan, and rolling-shot safety.",
    intro: [
      "Cars are large, shiny, and reflective, which makes them as much about controlling reflections as lighting. Location, time of day, and angle matter more than anything else; a polarizing filter helps manage reflections on paint and glass.",
      "Rolling shots involve moving vehicles. Only shoot them with permission, on safe roads or closed areas, with clear communication between drivers."
    ],
    blocks: [
      shotlist("Static shot list", "A complete set for a vehicle feature or listing.", [
        { title: "Exterior", items: [["Front three-quarter", "The most common hero angle; front wheel turned slightly toward camera."], "Rear three-quarter", "Side profile", "Straight front", "Straight rear", "Low angle front"] },
        { title: "Details", items: ["Badge and grille", "Headlight and taillight", "Wheel and brake", "Interior: dashboard from the rear seat", "Steering wheel and controls", "Seats and stitching", "Engine bay"] }
      ], { fields: ["Vehicle", "Owner"] }),
      cards("Reflection control", "Paint and glass reflect everything around them.", [
        { title: "Polarizing filter", text: "Rotate it to reduce reflections on paint and windows. The effect changes with angle; check each frame." },
        { title: "Open, plain locations", text: "Large open spaces with nothing tall nearby give clean reflections of sky." },
        { title: "Soft light", text: "Overcast days, open shade, or the hour around sunrise and sunset give smooth highlights along body lines." },
        { title: "Move yourself", text: "Wear dark clothing and step sideways until you disappear from the reflections." },
        { title: "Light painting", text: "At night, a long exposure with a moving soft light paints clean highlights along the bodywork." },
        { title: "Clean the car", text: "Dust and fingerprints show strongly; a final wipe-down on location is worth it." }
      ]),
      settings("Automotive settings", "Starting points for common situations.", rows([
        ["Static, daylight", "f/8", "1/250", "100", "Polarizer; tripod for consistency."],
        ["Static, golden hour", "f/5.6–f/8", "1/125", "100–200", "Low warm light along body lines."],
        ["Detail shots", "f/4", "1/250", "200", "Shallow focus on one element."],
        ["Rolling shot, car to car", "f/8–f/11", "1/40–1/80", "100", "Slow shutter blurs wheels and road."],
        ["Panning from the roadside", "f/11", "1/30–1/60", "100", "Track smoothly; many frames."],
        ["Light painting at night", "f/8–f/11", "10–30 s", "100", "Tripod; dark location."]
      ]), ["Turn the front wheels slightly so the wheel face shows, not the tire tread.", "Shoot at roughly headlight height for a powerful stance."]),
      checklist("Rolling shot safety checklist", "Never compromise on these.", [
        { title: "Before", items: ["Permission from the owner and, where needed, for the road or site", "Quiet road or closed area chosen", "Route agreed between both drivers", "Speeds agreed (often 30–60 km/h is enough)", "Communication method agreed (radio or phone on speaker)"] },
        { title: "During", items: ["Everyone seat-belted", "Photographer secured in the camera car", "No standing in the road", "Driver of the subject car watches the road, not the camera", "Stop immediately if traffic appears"] }
      ]),
      worksheet("Automotive location plan", "Scout and plan each location.", ["Location", "Permission needed", "Date and time", "Sun position", "Background", "Space around the car", "Access for the car", "Traffic", "+Angles and positions", "+Notes"])
    ],
    addons: [
      { name: "Rolling shot safety checklist", subtitle: "A detailed safety brief for car-to-car shooting.", blocks: [
        checklist("Rolling shot safety checklist", "Brief everyone before the first run.", [
          { title: "Planning", items: ["Permission secured for the road or site", "Route with safe turnaround points", "Weather and road surface checked", "Speeds agreed", "Signals agreed for 'slow', 'stop', 'abort'"] },
          { title: "Camera car", items: ["Photographer belted or harnessed", "Loose items secured", "Camera strap secured to the photographer", "Door or tailgate open only on closed roads"] },
          { title: "Subject car", items: ["Driver keeps eyes on the road", "Steady speed and position", "Hazard lights if required"] },
          { title: "Stop if", items: ["Traffic appears", "Anyone feels unsafe", "Communication drops"] }
        ], { kicker: "Add-on", fields: ["Date", "Location", "Drivers", "Signal method"] })
      ] },
      { name: "Light painting worksheet", subtitle: "Plan and log light-painting sessions.", blocks: [
        text("Light painting steps", "Paint smooth highlights along a car with a moving light during a long exposure.", [], [
          "Choose a dark location away from street lights. Tripod, manual focus, f/8–f/11, ISO 100.",
          "Take a test frame of 10–20 seconds with no light to check ambient darkness.",
          "Walk alongside the car with a soft light (an LED panel or light wand), pointed at the bodywork, at a steady pace.",
          "Wear dark clothing and keep the light pointed away from the lens so you don't appear in the frame.",
          "Paint one section per frame (front, side, rear, wheels) and blend the best frames in editing."
        ], { kicker: "Add-on" }),
        table("Light painting log", "Record each pass.", ["Frame", "Section", "Exposure", "Light used", "Distance", "Keep?"], Array.from({ length: 14 }, (_, i) => [String(i + 1), "", "", "", "", ""]), { kicker: "Add-on", widths: [0.08, 0.24, 0.14, 0.22, 0.16, 0.16] })
      ] },
      { name: "Detail shot list", subtitle: "Every detail shot for a full vehicle feature.", blocks: [
        shotlist("Vehicle detail shot list", "Shallow focus on one element per frame.", [
          { title: "Exterior details", items: ["Badge or emblem", "Grille", "Headlight", "Taillight", "Wheel and brake caliper", "Mirror", "Door handle", "Exhaust tips", "Body lines in raking light"] },
          { title: "Interior", items: ["Dashboard from the rear seat", "Steering wheel", "Gauge cluster (ignition on)", "Gear selector", "Seat stitching", "Pedals"] },
          { title: "Under the hood", items: ["Engine bay, wide", "Engine detail or nameplate"] }
        ], { kicker: "Add-on" })
      ] }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "architecture-photography-guide",
    name: "Architecture Photography Guide",
    subtitle: "Exterior and interior shot lists, perspective technique, sun-path planning, settings, and bracketing.",
    intro: [
      "Architecture photography is about lines and light: verticals kept straight, the building shown at its best angle, and the facade lit by the sun at the right time of day. Planning around the sun's path is the biggest single factor.",
      "Some buildings and interiors require permission to photograph, especially for commercial use. Check before you shoot."
    ],
    blocks: [
      shotlist("Architecture shot list", "From context to detail.", [
        { title: "Exterior", items: ["Building in its context (street or landscape)", "Main facade, straight-on", "Two-point view from a corner", "Entrance", "Twilight with interior lights on"] },
        { title: "Interior", items: ["Main space, from a corner", "Circulation: stairs, corridors", "Light through windows", "Materials and textures"] },
        { title: "Details", items: ["Structural details: joints, columns", "Pattern and repetition", "Signage and wayfinding"] }
      ], { fields: ["Building", "Architect or client"] }),
      cards("Perspective technique", "Keep lines honest.", [
        { title: "Level camera", text: "Keep the camera level and back sensor vertical so verticals stay parallel. Use the camera's electronic level." },
        { title: "Shift instead of tilt", text: "To include the top of a building without tilting up, use a shift lens, or shoot wider and crop the lower part of the frame." },
        { title: "Correct in editing", text: "Small amounts of keystoning can be corrected later; leave extra space around the building for cropping." },
        { title: "Distance compresses", text: "Shooting from further away with a longer lens reduces distortion and makes facades look more natural." },
        { title: "Symmetry", text: "For symmetrical buildings, center the camera precisely; small offsets look like mistakes." },
        { title: "Two-point views", text: "A corner view shows two facades and gives depth. Keep verticals straight; let horizontals converge." }
      ]),
      worksheet("Sun-path facade planner", "Find when the sun lights the facade you want to photograph.", ["Building", "Facade orientation (N, E, S, W)", "Date", "Sunrise and sunset", "Time sun lights the facade", "Time facade is in shade", "Best time for twilight", "Shadows from nearby buildings", "+Planned angles and times", "+Notes"]),
      settings("Architecture settings", "Starting points on a tripod.", rows([
        ["Exterior, daylight", "f/8–f/11", "1/125", "100", "Polarizer deepens sky and cuts glass glare."],
        ["Twilight exterior", "f/8", "2–15 s", "100", "10–25 min after sunset."],
        ["Interior, bracketed", "f/8", "Bracket ±2 stops", "100", "Blend for windows and shadows."],
        ["Details and texture", "f/5.6–f/8", "1/125", "100–400", "Raking side light."],
        ["People for scale (motion blur)", "f/11", "1/4–1 s", "100", "Tripod; people blur, building stays sharp."]
      ]), ["f/8 is usually the sharpest aperture across the frame for wide lenses.", "Use a remote release and mirror lock-up or electronic shutter."]),
      checklist("Architecture kit", "Pack for a building shoot.", [
        { title: "Camera", items: ["Wide-angle and standard lenses", "Shift lens (optional)", "Sturdy tripod with a level", "Polarizer", "Remote release"] },
        { title: "Planning", items: ["Sun-path plan", "Permission for interiors", "Building contact", "Floor plan for interiors"] }
      ])
    ],
    addons: [
      { name: "Perspective correction reference", subtitle: "Ways to keep verticals straight and when to use each.", blocks: [
        cards("Perspective correction reference", "Choose the method that suits the building and your kit.", [
          { title: "Level the camera", text: "Simplest method. Keep the sensor vertical; include extra foreground and crop it out later." },
          { title: "Shift lens", text: "Shift up to include the top without tilting. Keeps maximum resolution and sharpness." },
          { title: "Step back and zoom in", text: "More distance and a longer focal length reduce the need to tilt up." },
          { title: "Raise the camera", text: "A tall tripod, balcony, or building opposite puts the camera closer to the middle height of the building." },
          { title: "Correct in editing", text: "Vertical correction in software works well for small tilts. Large corrections stretch the top of the frame." },
          { title: "When convergence is fine", text: "Dramatic upward views can be intentional. Make the convergence strong and obvious, not slight." }
        ], { kicker: "Add-on" })
      ] },
      { name: "Sun-path facade planner", subtitle: "Plan the light on each facade across the day and year.", blocks: [
        table("Facade light planner", "Note when each facade is lit by direct sun on your shoot date.", ["Facade", "Faces", "Morning", "Midday", "Afternoon", "Best time"], [["Main facade", "", "", "", "", ""], ["Side 1", "", "", "", "", ""], ["Side 2", "", "", "", "", ""], ["Rear", "", "", "", "", ""]], { kicker: "Add-on", widths: [0.18, 0.12, 0.17, 0.17, 0.17, 0.19] }),
        table("Seasonal guide (Northern Hemisphere)", "In the Southern Hemisphere, swap north and south. Use a sun tool for exact times.", ["Facade faces", "Gets direct sun", "Notes"], [["South", "Most of the day, year-round", "Low winter sun gives long shadows."], ["East", "Morning", "Best soon after sunrise."], ["West", "Afternoon and evening", "Warm light before sunset."], ["North", "Early morning and late evening in summer only", "Often best photographed in soft light or at twilight."]], { kicker: "Add-on", widths: [0.2, 0.4, 0.4] })
      ] },
      { name: "Interior bracketing sheet", subtitle: "Plan and log bracketed interior frames.", blocks: [
        table("Interior bracketing sheet", "Log each room's brackets for blending.", ["Room", "Position", "Frames", "Base exposure", "Step", "Window frame", "Notes"], Array.from({ length: 14 }, () => ["", "", "", "", "", "", ""]), { kicker: "Add-on", widths: [0.16, 0.14, 0.08, 0.14, 0.08, 0.14, 0.26] })
      ] }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "drone-aerial-planning-guide",
    name: "Drone & Aerial Planning Guide",
    subtitle: "Pre-flight checklists, airspace and permit planning, aerial shot patterns, settings, and a flight log.",
    intro: [
      "Drone photography is governed by aviation rules that differ by country and change over time: registration, pilot certification, height limits, distance from people, and restricted airspace. Check the current rules from your national aviation authority before every flight.",
      "This guide is a planning reference. It doesn't replace official rules, training, or the manufacturer's instructions for your aircraft."
    ],
    blocks: [
      checklist("Pre-flight checklist", "Run through before every flight.", [
        { title: "Rules and permissions", items: ["Airspace checked with an official map or app", "Permission from the landowner", "Registration and any required certificate carried", "Notices and temporary restrictions checked"] },
        { title: "Conditions", items: ["Wind speed within the aircraft's limits", "No rain, fog, or low cloud", "Enough daylight for the flight", "Take-off area clear of people and obstacles"] },
        { title: "Aircraft", items: ["Batteries charged and seated firmly", "Propellers undamaged and secure", "Firmware and maps updated", "Compass calibrated if prompted", "Return-to-home height set above obstacles", "Memory card inserted with space"] }
      ]),
      worksheet("Airspace and permit planning", "Plan each location before travelling.", ["Location", "Date", "Airspace classification", "Height limit at this site", "Nearby airports or heliports", "Permit or authorization needed", "Landowner permission", "People and roads nearby", "+Restrictions: parks, events, wildlife", "+Emergency landing spots", "+Notes"]),
      cards("Aerial shot patterns", "Common movements for photos and video.", [
        { title: "Top-down", text: "Camera pointing straight down. Patterns, roads, coastlines, and fields become graphic shapes." },
        { title: "Reveal", text: "Fly forward and rise over an object to reveal the scene behind it." },
        { title: "Orbit", text: "Circle a subject at constant distance and height with the camera locked on it." },
        { title: "Pull-back and rise", text: "Start close to a subject and fly backward and up to show its setting." },
        { title: "Tracking", text: "Follow a moving subject from the side or behind at a safe distance." },
        { title: "Low pass", text: "Fly low over water or a field for a sense of speed. Keep within height and distance rules." }
      ]),
      settings("Aerial settings", "Starting points for small camera drones.", rows([
        ["Photos, daylight", "Fixed or f/2.8–f/5.6", "1/500+", "100", "Raw; bracket high-contrast scenes."],
        ["Video, 24–30 fps", "Fixed", "1/50–1/60", "100", "ND filter to keep the 180° shutter."],
        ["Video, 60 fps", "Fixed", "1/120", "100", "ND filter."],
        ["Sunrise or sunset", "Fixed", "Bracket", "100", "Expose for highlights."],
        ["Low light", "Fixed", "1/30 or slower", "100–400", "Hover still; check sharpness."]
      ]), ["Lock exposure and white balance for video.", "Keep line of sight with the aircraft at all times where rules require it."]),
      table("Flight log", "Many rules require or recommend a flight log.", ["Date", "Location", "Take-off", "Landing", "Battery", "Max height", "Notes"], Array.from({ length: 14 }, () => ["", "", "", "", "", "", ""]), { kicker: "Log", widths: [0.11, 0.21, 0.11, 0.11, 0.1, 0.11, 0.25] })
    ],
    addons: [
      { name: "Pre-flight checklist cards", size: "pocket", subtitle: "Pre-flight checks on a 4 × 6 in card.", blocks: [
        checklist("Pre-flight checks", "Every flight.", [
          { title: "Rules", items: ["Airspace checked", "Landowner permission", "Registration carried"] },
          { title: "Conditions", items: ["Wind within limits", "Clear weather", "Take-off area clear"] },
          { title: "Aircraft", items: ["Batteries seated", "Props secure", "RTH height set", "Card inserted"] }
        ], { kicker: "Add-on", blank: 0 })
      ] },
      { name: "Airspace and permit planning sheet", subtitle: "Track authorizations for several locations.", blocks: [
        table("Authorization tracker", "Rules vary by country; check with your aviation authority.", ["Location", "Airspace", "Authorization", "Applied", "Approved", "Valid until"], Array.from({ length: 10 }, () => ["", "", "", "", "", ""]), { kicker: "Add-on", widths: [0.24, 0.14, 0.2, 0.14, 0.14, 0.14] }),
        worksheet("Site risk notes", "Assess each site before flying.", ["Site", "People present", "Roads and vehicles", "Wildlife", "Obstacles: trees, wires, towers", "+Emergency landing spots", "+Notes"], { kicker: "Add-on" })
      ] },
      { name: "Aerial shot pattern diagrams", subtitle: "Overhead diagrams of four flight patterns.", blocks: [
        diagram("Orbit", "Circle the subject at a constant distance with the camera locked on.", [
          el("subject", "product", 180, 150, "Subject", "Center of the orbit.", "Choose a clear subject with space around it."),
          el("d1", "camera", 180, 60, "Drone (start)", "Camera pointed at the subject.", "Constant height and radius.", 180),
          el("d2", "camera", 290, 150, "Drone (quarter turn)", "Still pointed at the subject.", "Smooth, slow yaw keeps the subject centered.", 270),
          el("d3", "camera", 70, 150, "Drone (three-quarter turn)", "Still pointed at the subject.", "Full orbits make easy loops in editing.", 90)
        ], [], ["Keep a safe distance from people and obstacles.", "Fly the orbit slowly; faster orbits look rushed on video."], "Flight pattern"),
        diagram("Reveal", "Fly forward and rise over a foreground object to reveal the scene.", [
          el("fg", "wall", 180, 170, "Foreground object", "Ridge, tree line, or building.", "Start low behind it."),
          el("scene", "table", 180, 70, "Scene revealed", "Landscape or subject beyond.", "Plan the reveal so the main subject appears near the center of the frame."),
          el("d1", "camera", 180, 250, "Drone (start, low)", "Camera level.", "Fly forward slowly while rising."),
          el("d2", "camera", 180, 130, "Drone (end, higher)", "Higher, past the foreground.", "Tilt the camera down gradually as the scene appears.")
        ], [beam("d1", "d2")], ["Practice the move in a clear area first.", "The arrow shows the flight path."], "Flight pattern")
      ] },
      { name: "Battery and flight log", subtitle: "Track battery health and flights.", blocks: [
        table("Battery log", "Track charge cycles and condition for each battery.", ["Battery", "Purchased", "Cycles", "Last used", "Condition", "Notes"], ["A", "B", "C", "D", "E", "F"].map((x) => [x, "", "", "", "", ""]), { kicker: "Add-on", widths: [0.1, 0.16, 0.12, 0.16, 0.18, 0.28] }),
        table("Flight log", "One line per flight.", ["Date", "Location", "Battery", "Duration", "Max height", "Notes"], Array.from({ length: 14 }, () => ["", "", "", "", "", ""]), { kicker: "Add-on", widths: [0.12, 0.26, 0.1, 0.12, 0.12, 0.28] })
      ] }
    ]
  }
];
