import { shotlist, checklist, worksheet, table, cards, settings, setup, text, rows, el, beam, fiveHundredRule } from "./helpers.js";

const camera = (notes, x = 180, label = "Camera") => el("camera", "camera", x, 262, label, "Your shooting position.", notes);

export default [
  /* ------------------------------------------------------------------ */
  {
    slug: "astrophotography-night-sky-guide",
    name: "Astrophotography & Night Sky Guide",
    subtitle: "Night-sky settings, exposure limits by focal length, a dark-site checklist, and planning sheets for Milky Way, star trails, and the Moon.",
    intro: [
      "Night-sky photography depends on planning more than any other kind: the Moon's phase, the time the Milky Way's core rises, the weather, and a dark site away from light pollution. This guide gives you the references and planning sheets for each.",
      "Milky Way visibility, position, and season depend on your latitude. Use a sky map or star chart for your location and date alongside these sheets."
    ],
    blocks: [
      settings("Night sky settings", "Starting points for wide-angle night photography on a tripod.", rows([
        ["Milky Way, wide lens", "f/2.8 or wider", "15–20 s", "3200", "Keep under the 500-rule limit."],
        ["Stars over a landscape", "f/2.8", "15–25 s", "1600–3200", "Light paint or blend the foreground."],
        ["Star trails, stacked", "f/4", "30 s × many", "400–800", "Continuous shooting with a remote."],
        ["Single long star trail", "f/5.6–f/8", "15–60 min", "100–200", "Watch battery and sensor heat."],
        ["Moon, telephoto", "f/8", "1/250", "100", "The 'f/11, 1/ISO' rule is a good start."],
        ["Aurora", "f/2.8", "2–8 s", "1600–3200", "Shorter exposures keep curtain detail."]
      ]), ["Focus manually: magnify a bright star in live view until it is a pinpoint.", "Turn off image stabilization on a tripod.", "Shoot raw and set white balance around 3800–4500 K."]),
      table("Exposure limits: the 500 rule", "A simple guide to the longest exposure before stars start to trail: 500 divided by the effective focal length. For sharper stars on high-resolution sensors, use about half these times.", ["Focal length", "Full frame", "Crop 1.5×", "Crop 1.6×"], fiveHundredRule([14, 16, 20, 24, 28, 35, 50]), { kicker: "Reference", widths: [0.28, 0.24, 0.24, 0.24] }),
      cards("Planning factors", "Check each one before choosing a night.", [
        { title: "Moon phase", text: "Within a few days of the new moon, or when the Moon is below the horizon, the sky is darkest. A bright moon washes out the Milky Way but lights landscapes beautifully." },
        { title: "Milky Way core", text: "The bright core is visible only part of the year and only part of the night. Check its rise time and direction for your date and location." },
        { title: "Light pollution", text: "Use a light-pollution map to find dark skies. Even 30–60 minutes' drive from a town can make a large difference." },
        { title: "Weather and cloud", text: "Clear skies and low humidity matter most. Check cloud forecasts by layer; high thin cloud dims stars." },
        { title: "Foreground", text: "Scout the location in daylight. Plan where the Milky Way or stars will sit above your foreground." },
        { title: "Safety", text: "Tell someone where you're going, carry a head torch with a red mode, and check access rules for parks after dark." }
      ]),
      worksheet("Night shoot plan", "Plan each night shoot.", ["Location", "Date", "Sunset and end of twilight", "Moon phase and moonset", "Milky Way core rise and direction", "Cloud forecast", "Arrival time", "Who knows where you are", "+Composition and foreground", "+Settings plan", "+Notes"]),
      checklist("Dark-site checklist", "Pack and check before leaving.", [
        { title: "Camera", items: ["Wide, fast lens", "Sturdy tripod", "Remote release or intervalometer", "Spare batteries (cold drains them)", "Lens heater or hand warmers for dew"] },
        { title: "Field", items: ["Head torch with red mode", "Warm layers and gloves", "Offline map and sky chart", "Water and snacks", "Phone charged"] },
        { title: "Settings before leaving home", items: ["Raw format", "Long-exposure noise reduction off (for stacking)", "Screen brightness low", "Image stabilization off"] }
      ])
    ],
    addons: [
      { name: "Moon phase planning sheet", subtitle: "Plan the year's dark-sky and moonlit nights.", blocks: [
        table("Moon phase planning sheet", "Fill in new moon and full moon dates from a calendar for your location. Darkest nights fall within a few days of the new moon.", ["Month", "New moon", "Full moon", "Best dark nights", "Planned location"], ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => [m, "", "", "", ""]), { kicker: "Add-on", widths: [0.16, 0.16, 0.16, 0.24, 0.28] })
      ] },
      { name: "Star trail stacking worksheet", subtitle: "Plan, shoot, and stack star trails.", blocks: [
        text("Star trail stacking steps", "Many shorter exposures stacked together create long trails with less noise and no risk of losing a whole night to one bad frame.", [], [
          "Compose with the North Star (north) or South Celestial Pole (south) in frame for circular trails; face east or west for straighter lines.",
          "Focus manually on a bright star; switch the lens to manual focus and tape the ring.",
          "Set a test exposure: about 30 s at f/4 and ISO 400–800. Adjust for a dark but not black sky.",
          "Turn off long-exposure noise reduction, then shoot continuously with a remote or intervalometer.",
          "Shoot for at least 30 minutes; one to two hours gives long arcs.",
          "Take a few dark frames with the lens cap on at the same settings, to reduce noise when stacking.",
          "Stack the frames with a lighten blend or stacking software."
        ], { kicker: "Add-on" }),
        table("Star trail log", "Record each session.", ["Date", "Location", "Direction", "Exposure", "ISO", "Frames", "Total time"], Array.from({ length: 10 }, () => ["", "", "", "", "", "", ""]), { kicker: "Add-on", widths: [0.13, 0.22, 0.13, 0.13, 0.1, 0.1, 0.19] })
      ] },
      { name: "Red-light pocket card", size: "pocket", subtitle: "Night settings and checks on a 4 × 6 in card.", blocks: [
        settings("Night settings", "Starting points on a tripod.", rows([
          ["Milky Way", "f/2.8", "15–20 s", "3200", ""],
          ["Star trails", "f/4", "30 s ×", "400–800", "Stack"],
          ["Moon", "f/8", "1/250", "100", ""],
          ["Aurora", "f/2.8", "2–8 s", "1600–3200", ""]
        ]), ["Focus: magnify a bright star to a pinpoint.", "Stabilization off. Raw. WB about 4000 K.", "500 ÷ focal length = max seconds (full frame)."])
      ] },
      { name: "Dark-site scouting form", subtitle: "Record dark sites for future night shoots.", blocks: [
        worksheet("Dark-site scouting form", "Visit in daylight and note what you'll need at night.", ["Site name", "Coordinates", "Light-pollution level", "Access after dark", "Parking", "Walking time from parking", "Phone signal", "Horizon views: N, E, S, W", "+Foreground interest", "+Hazards: cliffs, water, wildlife, uneven ground", "+Notes"], { kicker: "Add-on" })
      ] }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "food-photography-guide",
    name: "Food Photography Guide",
    subtitle: "Window-light and overhead setups, styling checklists, a menu shot list, and settings for food photography.",
    intro: [
      "Food photography is a race against time: drinks lose bubbles, herbs wilt, and sauces skin over. Set up the light, camera, and props with a stand-in plate, then bring the real dish in last.",
      "Side and back light reveal texture; front light flattens it. Most of the setups in this guide use light from the side or behind."
    ],
    blocks: [
      shotlist("Menu shot list", "For each dish, a consistent set of angles.", [
        { title: "Each dish", items: [["Hero shot at about 45°", "The angle diners see the dish from."], "Overhead (flat lay)", "Straight-on (for tall food: burgers, layered cakes)", "Close-up detail: texture, steam, a drip"] },
        { title: "Supporting frames", items: ["Hands serving or eating", "Ingredients laid out", "Process: pouring, slicing, plating", "Table scene with several dishes", "Drinks with condensation"] }
      ], { fields: ["Client", "Dish"] }),
      setup("Side window light with bounce", "Soft daylight from the side and slightly behind, the classic food setup.", [
        el("window", "window", 46, 118, "Window", "Main light, slightly behind the dish.", "Light from the side and a little behind shows texture and gives glossy highlights. Diffuse direct sun with a sheer curtain."),
        el("dish", "product", 180, 140, "Dish", "On the shooting surface.", "Turn the plate until the best side faces the camera and highlights fall on sauces."),
        el("card", "card", 262, 156, "White card", "Fill on the front-right.", "Lifts shadows on the camera-facing side. Use a black card instead for moody images."),
        el("surface", "table", 180, 150, "Surface", "Board, cloth, or tabletop.", "Matte surfaces avoid reflections."),
        camera("About 45° above the table for the hero angle.")
      ], [beam("window", "dish"), beam("card", "dish", "bounce")], ["Turn off overhead lights.", "Shoot a frame with a stand-in plate to set exposure first."]),
      setup("Overhead flat lay", "Even light for overhead table scenes.", [
        el("window", "window", 46, 140, "Window or softbox", "Light from one side.", "Side light across the table gives soft shadows that show shape."),
        el("table", "table", 180, 150, "Table scene", "Dishes and props.", "Arrange in odd numbers with varied heights and plenty of space between."),
        el("card", "card", 290, 150, "White card", "Fill.", "Opposite the light to keep shadows open."),
        camera("Directly above, level with the table. A tripod arm or stepladder helps.")
      ], [beam("window", "table"), beam("card", "table", "bounce")], ["Use a level on the camera so the table edges stay square."]),
      settings("Food settings", "Starting points; most food work is done on a tripod.", rows([
        ["Hero shot, window light", "f/4", "1/60", "200", "Tripod; focus on the front edge of the dish."],
        ["Overhead flat lay", "f/5.6–f/8", "1/60", "200", "Everything on one plane."],
        ["Close-up texture", "f/2.8", "1/125", "400", "Shallow focus on one detail."],
        ["Pouring or splash", "f/5.6", "1/500–1/1000", "800", "Burst mode or flash."],
        ["Restaurant, available light", "f/2.8", "1/125", "1600", "Ask to turn off colored lights."]
      ]), ["Set a custom white balance from a grey card; food color must look natural."]),
      cards("Styling tips", "Small touches that keep food looking fresh on camera.", [
        { title: "Undercook vegetables", text: "Slightly undercooked greens stay brighter. A quick brush of oil restores shine." },
        { title: "Build height", text: "Stack or prop items so the dish has height. Hidden supports such as a small cut sponge lift garnishes." },
        { title: "Steam on cue", text: "Shoot hot dishes first. Steam shows best backlit against a dark background." },
        { title: "Fresh garnish last", text: "Add herbs and sauces right before shooting; use tweezers for placement." },
        { title: "Crumbs and drips", text: "A few crumbs or a drip make food look real; too many look messy." },
        { title: "Clean edges", text: "Wipe rims with a cloth or cotton bud before each frame." }
      ]),
      checklist("Food shoot kit", "Pack for a food shoot.", [
        { title: "Light and camera", items: ["Tripod", "Diffuser and white and black cards", "Grey card for white balance", "Tethering cable (optional)"] },
        { title: "Styling", items: ["Tweezers and small brushes", "Cotton buds and paper towels", "Oil and spray bottle", "Backgrounds and surfaces", "Neutral plates, cutlery, linen"] }
      ])
    ],
    addons: [
      { name: "Plating and styling checklist", subtitle: "Check every plate before the shutter.", blocks: [
        checklist("Plating and styling checklist", "Run through for each dish.", [
          { title: "Plate", items: ["Rim wiped clean", "Plate size suits the portion", "Best side facing camera", "Odd numbers of items where possible"] },
          { title: "Food", items: ["Height and layers visible", "Sauces glossy, not skinned over", "Fresh garnish placed with tweezers", "Colors balanced"] },
          { title: "Scene", items: ["Props support, not compete", "Crumbs or drips placed on purpose", "Cutlery and glass reflections checked", "Background clean"] }
        ], { kicker: "Add-on", fields: ["Dish", "Client"] })
      ] },
      { name: "Window-light setup cards", subtitle: "Two more window-light setups for food.", blocks: [
        setup("Backlight for drinks and steam", "Light behind the subject makes drinks glow and shows steam.", [
          el("window", "window", 180, 54, "Window (behind)", "Backlight.", "The window is behind the subject. A sheer curtain evens it."),
          el("drink", "product", 180, 140, "Drink or hot dish", "Backlit subject.", "Liquids glow when light passes through them."),
          el("cardL", "card", 116, 162, "White card", "Front fill, left.", "Lifts the front of the glass or plate."),
          el("cardR", "card", 244, 162, "White card", "Front fill, right.", "Balance both sides for symmetry."),
          camera("Slightly above level; a lens hood helps with flare.")
        ], [beam("window", "drink"), beam("cardL", "drink", "bounce"), beam("cardR", "drink", "bounce")], ["A dark background behind the subject shows steam best."]),
        setup("Moody side light", "Narrow side light and black cards for dark, dramatic images.", [
          el("window", "window", 46, 140, "Window (partly blocked)", "Narrow, directional light.", "Block most of the window with black card so only a narrow strip lights the dish."),
          el("dish", "product", 180, 140, "Dish", "Lit from the side.", "Dark plates and surfaces suit this look."),
          el("flag", "flag", 262, 150, "Black card", "Deepens shadows.", "Opposite the window, close to the dish."),
          camera("45° or straight-on.")
        ], [beam("window", "dish")], ["Expose for the highlights and let shadows fall dark."])
      ] },
      { name: "Overhead rig planning sheet", subtitle: "Plan an overhead camera setup safely.", blocks: [
        worksheet("Overhead rig planning sheet", "Plan height, framing, and safety before mounting a camera over a table.", ["Table size", "Frame size needed", "Lens", "Camera height above table", "Mount: tripod arm, boom, or stand", "Counterweight", "Tethering", "Light position", "+Safety: sandbags, cable routing, nothing over hot food", "+Layout sketch and notes"], { kicker: "Add-on" })
      ] }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "wildlife-bird-photography-guide",
    name: "Wildlife & Bird Photography Guide",
    subtitle: "Field settings, fieldcraft reference, ethics, a field log, and planning sheets for wildlife and bird photography.",
    intro: [
      "Wildlife photography depends on fieldcraft: knowing where animals will be, approaching without disturbing them, and being ready when they move. Settings come second, but they need to be right before the moment arrives.",
      "The welfare of the animal comes first. Keep your distance, never bait or disturb nests and dens, and follow the rules of every reserve and park."
    ],
    blocks: [
      settings("Wildlife settings", "Starting points with a telephoto lens. Auto ISO with a set shutter speed works well.", rows([
        ["Birds in flight", "f/6.3–f/8", "1/2000–1/3200", "Auto", "Continuous AF, tracking area."],
        ["Perched birds", "f/6.3", "1/500–1/1000", "Auto", "Focus on the eye."],
        ["Mammals at dawn or dusk", "Wide open", "1/250–1/500", "1600–6400", "Raise ISO; motion blur is worse than noise."],
        ["Mammals running", "f/5.6", "1/2000", "Auto", "Pan with the animal."],
        ["Intentional panning blur", "f/8–f/11", "1/30–1/60", "100–400", "Smooth pan; many frames."],
        ["Backlit subject", "", "", "", "+0.7 to +1 stop exposure compensation."]
      ]), ["Fill the frame with the subject's eye in focus.", "Get down to the animal's eye level where you can.", "Pre-set settings before approaching."]),
      cards("Fieldcraft", "Ways to get closer without disturbing wildlife.", [
        { title: "Know the routine", text: "Learn where and when animals feed, drink, and rest. Early morning and late afternoon are usually most active." },
        { title: "Light behind you", text: "Approach with the sun behind you for well-lit subjects, or deliberately into it for rim light." },
        { title: "Move slowly and low", text: "Approach indirectly, pausing often. Stop if the animal changes behavior." },
        { title: "Use cover", text: "Hides, vehicles, and natural cover let animals behave naturally around you." },
        { title: "Clean backgrounds", text: "Move a few steps to put distant, plain backgrounds behind the subject." },
        { title: "Wait", text: "Find a good spot and let the animals come. Patience gives natural behavior." }
      ]),
      text("Field ethics", "Principles to follow on every outing.", [], [
        "The animal's welfare comes before any photograph.",
        "Keep a distance that doesn't change the animal's behavior; if it becomes alert or moves away, you are too close.",
        "Never disturb nests, dens, or roosts, and avoid flash with nocturnal animals.",
        "Do not bait or call animals in ways that alter their natural behavior or put them at risk.",
        "Stay on paths and follow reserve and park rules, including seasonal closures.",
        "Be careful sharing locations of sensitive or rare species."
      ], { kicker: "Ethics" }),
      table("Field log", "Record sightings and settings for future trips.", ["Date", "Time", "Location", "Species", "Behavior", "Light", "Settings"], Array.from({ length: 14 }, () => ["", "", "", "", "", "", ""]), { kicker: "Log", widths: [0.11, 0.09, 0.18, 0.18, 0.18, 0.1, 0.16] }),
      worksheet("Outing plan", "Plan each wildlife outing.", ["Location", "Date", "Sunrise or sunset", "Target species", "Where they're likely to be", "Wind direction", "Access rules", "Hide or vehicle", "+Kit list", "+Notes"]),
      checklist("Wildlife kit", "Pack for a day in the field.", [
        { title: "Camera", items: ["Telephoto lens", "Beanbag, monopod, or tripod with gimbal head", "Spare batteries and cards", "Rain cover"] },
        { title: "Field", items: ["Muted clothing", "Binoculars", "Water, food, and seat pad", "Field guide to local species"] }
      ])
    ],
    addons: [
      { name: "Hide and blind planning sheet", subtitle: "Plan where and how to set up a hide.", blocks: [
        worksheet("Hide and blind planning sheet", "Check permission and rules before placing any hide.", ["Location", "Landowner permission", "Target species", "Distance to subject area", "Sun direction morning and evening", "Wind direction", "Hide type", "Set-up time before dawn", "+Entry and exit route without disturbing wildlife", "+Background and perches", "+Notes"], { kicker: "Add-on" })
      ] },
      { name: "Species log worksheet", subtitle: "Track species photographed and those still to find.", blocks: [
        table("Species log", "Build a record of what you've photographed.", ["Species", "First photographed", "Location", "Best image", "Want to improve"], Array.from({ length: 20 }, () => ["", "", "", "", ""]), { kicker: "Add-on", widths: [0.24, 0.16, 0.2, 0.18, 0.22] })
      ] },
      { name: "Field ethics checklist", subtitle: "A quick ethics check for every outing.", blocks: [
        checklist("Field ethics checklist", "Check before and during each outing.", [
          { title: "Before", items: ["Reserve rules and seasonal closures checked", "Permission for private land", "Sensitive species information kept private"] },
          { title: "In the field", items: ["Distance keeps behavior natural", "No disturbance to nests, dens, or roosts", "No baiting or calling that alters behavior", "No flash with nocturnal animals", "Stay on paths"] },
          { title: "Afterwards", items: ["Locations of sensitive species not shared", "Litter and kit taken home"] }
        ], { kicker: "Add-on" })
      ] },
      { name: "Shutter and ISO pocket card", size: "pocket", subtitle: "Wildlife shutter speeds on a 4 × 6 in card.", blocks: [
        settings("Wildlife shutter speeds", "Use Auto ISO with these shutter speeds.", rows([
          ["Birds in flight", "f/6.3–8", "1/2000+", "Auto", ""],
          ["Perched birds", "f/6.3", "1/500", "Auto", ""],
          ["Mammals, low light", "Wide", "1/250", "1600–6400", ""],
          ["Running", "f/5.6", "1/2000", "Auto", ""],
          ["Panning blur", "f/8–11", "1/30", "100–400", ""]
        ]), ["Focus on the eye.", "Backlit: +0.7 to +1 stop.", "Motion blur is worse than noise."])
      ] }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "headshot-corporate-team-guide",
    name: "Headshot & Corporate Team Guide",
    subtitle: "Consistent lighting setups, a per-person shot list, team-day scheduling, settings, and a consistency checklist for corporate headshots.",
    intro: [
      "Corporate headshots are judged as a set: every person should look like they belong on the same page. Consistency comes from a fixed setup: the same light positions, camera height, focal length, distance, and background.",
      "Plan the day with a schedule that gives each person a few relaxed minutes, and keep a reference frame on screen to match against."
    ],
    blocks: [
      setup("Two-light headshot on a grey backdrop", "A key light and fill for clean, consistent business headshots.", [
        el("backdrop", "backdrop", 180, 44, "Grey backdrop", "Neutral background.", "Keep people 1.5–2 m in front so the backdrop renders as an even grey."),
        el("key", "softbox", 100, 118, "Key light (softbox)", "Main light.", "45° to one side, slightly above eye level. Mark the stand position."),
        el("fill", "umbrella", 250, 226, "Fill (umbrella)", "Opens shadows.", "Near the camera on the opposite side, 1–1.5 stops below the key."),
        el("subject", "subject", 180, 142, "Person on a stool", "Posed the same way each time.", "A stool with a marked position keeps distance consistent."),
        camera("Same focal length, height, and distance for everyone. Tether to a screen if you can.")
      ], [beam("key", "subject"), beam("fill", "subject")], ["Take a reference frame and compare each person against it.", "A hair light from behind adds separation on dark backdrops."]),
      setup("Office window light", "Natural light headshots in the client's workspace.", [
        el("window", "window", 46, 134, "Window", "Main light.", "Indirect daylight; avoid direct sun."),
        el("subject", "subject", 172, 140, "Person", "Angled toward the window.", "About 1–2 m from the window."),
        el("reflector", "reflector", 258, 156, "Reflector", "Fill.", "On a stand opposite the window."),
        el("bg", "backdrop", 180, 44, "Office background", "Soft, out of focus.", "Keep 3 m or more behind for a soft background."),
        camera("Use a longer focal length and wide aperture to soften the office behind.", 196)
      ], [beam("window", "subject"), beam("reflector", "subject", "bounce")], ["Light changes through the day; check exposure every few people."]),
      shotlist("Per-person headshot list", "Three to five minutes per person.", [
        { title: "Core frames", items: ["Shoulders angled, face to camera, relaxed smile", "Same pose, closed-mouth smile", "Opposite shoulder angle", "Slightly tighter crop"] },
        { title: "Optional", items: ["Glasses on and off", "Half-length or standing frame", "Environmental frame at their desk"] }
      ], { fields: ["Name", "Department"] }),
      settings("Headshot settings", "Starting points for consistent results.", rows([
        ["Studio, two lights", "f/8", "1/160", "100", "Deep enough focus for eyes and ears."],
        ["Office window light", "f/2.8–f/4", "1/200", "400", "Softens the background."],
        ["Mixed office lighting", "f/4", "1/160", "400", "Flash overpowers room light; turn off overheads."],
        ["Outdoor shade", "f/2.8", "1/500", "200", "Find even shade with depth behind."]
      ]), ["An 85–105 mm full-frame equivalent focal length is flattering at head-and-shoulders crops.", "Lock white balance with a grey card for the whole day."]),
      table("Team day schedule", "Allow 5 minutes per person plus a buffer every hour.", ["Time", "Name", "Department", "Email", "Done", "Notes"], Array.from({ length: 16 }, () => ["", "", "", "", "", ""]), { kicker: "Planner", widths: [0.1, 0.22, 0.18, 0.26, 0.08, 0.16] }),
      checklist("Consistency checklist", "Check at the start and every hour.", [
        { title: "Setup", items: ["Light positions marked on the floor", "Camera height and distance marked", "Same focal length", "Same backdrop exposure"] },
        { title: "Each person", items: ["Collar and hair tidy", "Glasses angled to avoid glare", "Eyes sharp at full magnification", "Matches the reference frame"] }
      ])
    ],
    addons: [
      { name: "Team day scheduling sheet", subtitle: "A full-day schedule for large teams.", blocks: [
        table("Team day scheduling sheet: morning", "Five-minute slots with a buffer each hour.", ["Time", "Name", "Department", "Email", "Done"], ["8:30", "8:35", "8:40", "8:45", "8:50 buffer", "9:00", "9:05", "9:10", "9:15", "9:20 buffer", "9:30", "9:35", "9:40", "9:45", "9:50 buffer", "10:00", "10:05", "10:10"].map((t) => [t, "", "", "", ""]), { kicker: "Add-on", widths: [0.14, 0.26, 0.2, 0.3, 0.1] }),
        table("Team day scheduling sheet: afternoon", "Five-minute slots with a buffer each hour.", ["Time", "Name", "Department", "Email", "Done"], ["13:00", "13:05", "13:10", "13:15", "13:20 buffer", "13:30", "13:35", "13:40", "13:45", "13:50 buffer", "14:00", "14:05", "14:10", "14:15", "14:20 buffer", "14:30", "14:35", "14:40"].map((t) => [t, "", "", "", ""]), { kicker: "Add-on", widths: [0.14, 0.26, 0.2, 0.3, 0.1] })
      ] },
      { name: "Client wardrobe and background guide", subtitle: "Send to the team before headshot day.", blocks: [
        cards("Wardrobe and background guide", "Share with everyone being photographed.", [
          { title: "Solid colors", text: "Solid, mid-tone colors photograph best. Avoid small patterns and thin stripes, which can shimmer on screen." },
          { title: "Necklines", text: "Collared shirts and structured necklines frame the face. Bring a jacket if your company style includes one." },
          { title: "Match the backdrop", text: "On a grey or white backdrop, avoid clothing the same shade so you don't blend in." },
          { title: "Glasses", text: "Wear your usual glasses. Anti-glare coatings help; we'll angle them to avoid reflections." },
          { title: "Grooming", text: "Bring a comb or brush. A light powder reduces shine under lights." },
          { title: "Bring a spare", text: "A second top lets you choose on the day." }
        ], { kicker: "Add-on" })
      ] },
      { name: "Retouch notes template", subtitle: "Record retouching requests per person.", blocks: [
        table("Retouch notes", "Agree a standard retouch level with the client, then note individual requests.", ["Name", "Selected frame", "Standard retouch", "Extra requests", "Delivered"], Array.from({ length: 18 }, () => ["", "", "", "", ""]), { kicker: "Add-on", widths: [0.22, 0.16, 0.16, 0.34, 0.12] })
      ] },
      { name: "Multi-location setup cards", subtitle: "Match the look across several office locations.", blocks: [
        setup("Portable two-light setup", "A compact kit that sets up the same way in any room.", [
          el("backdrop", "backdrop", 180, 44, "Portable backdrop", "Same backdrop at every site.", "Pop-up or roll backdrop, same color and distance each time."),
          el("key", "softbox", 100, 118, "Key light", "Main light.", "Measure and record its distance and height from the stool."),
          el("fill", "reflector", 260, 160, "Fill reflector", "Fill.", "Fixed position on a stand."),
          el("subject", "subject", 180, 142, "Person", "Marked position.", "Same stool height at every site."),
          camera("Record camera height and distance; reproduce exactly.")
        ], [beam("key", "subject"), beam("fill", "subject", "bounce")], ["Write the measurements on a card kept in the kit bag."]),
        worksheet("Location setup record", "Record measurements so every site matches.", ["Site", "Date", "Key light distance", "Key light height", "Fill distance", "Camera distance", "Camera height", "Focal length", "Settings", "Backdrop distance", "+Room notes: windows, ceiling, power", "+Notes"], { kicker: "Add-on" })
      ] }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "real-estate-interiors-guide",
    name: "Real Estate & Interiors Guide",
    subtitle: "Room-by-room shot lists, interior technique, bracketing settings, a property brief, and a homeowner prep checklist.",
    intro: [
      "Property photography is about clarity: straight verticals, balanced light between bright windows and darker interiors, and rooms that look spacious and tidy. A consistent approach makes every listing quicker to shoot and edit.",
      "Most interior images in this guide use a tripod, a wide lens, and exposure bracketing or flash to handle bright windows."
    ],
    blocks: [
      shotlist("Room-by-room shot list", "In walking order through a typical home.", [
        { title: "Exterior", items: ["Front exterior, straight-on", "Front exterior, corner angle", "Street view and entrance"] },
        { title: "Living spaces", items: ["Living room, two angles", "Kitchen, two angles", "Kitchen detail: counter or appliance", "Dining area"] },
        { title: "Private spaces", items: ["Primary bedroom", "Primary bathroom", "Other bedrooms", "Other bathrooms"] },
        { title: "Extras", items: ["Back garden or yard", "Features: fireplace, view, balcony", "Garage or storage (if asked)"] }
      ], { fields: ["Property", "Date"] }),
      cards("Interior technique", "Habits that make interiors look clean and spacious.", [
        { title: "Camera height", text: "About 1.2–1.5 m (roughly chest height) for most rooms; lower in small bathrooms. Too high shows too much floor." },
        { title: "Straight verticals", text: "Keep the camera level so walls and door frames stay vertical. Correct remaining tilt in editing." },
        { title: "Shoot into corners", text: "Shooting from a corner toward the opposite corner shows the most of a room." },
        { title: "Don't go too wide", text: "Very wide lenses stretch furniture at the edges. A full-frame 16–24 mm range covers most rooms." },
        { title: "Windows", text: "Bracket exposures or use flash to balance bright windows with the interior so the view isn't blown out." },
        { title: "Lights on, consistent", text: "Turn on all lamps for warmth, or all off for even color; avoid mixing warm bulbs with cool daylight where possible." }
      ]),
      settings("Interior settings", "Starting points on a tripod.", rows([
        ["Interior, bracketed", "f/8", "Bracket ±2 stops", "100", "3 or 5 frames; blend in editing."],
        ["Interior with flash", "f/8", "1/100", "400", "Bounce flash off the ceiling."],
        ["Exterior, daylight", "f/8", "1/250", "100", "Sun on the facade if possible."],
        ["Twilight exterior", "f/8", "2–8 s", "100", "Shoot 10–25 min after sunset."],
        ["Bathroom, small space", "f/8", "Bracket", "100", "Lower camera; check mirrors."]
      ]), ["f/7.1–f/8 keeps a whole room sharp with wide lenses.", "Use a remote or 2-second timer for bracketed frames."]),
      worksheet("Property brief", "Fill in with the agent or owner before the shoot.", ["Address", "Agent or owner", "Contact phone", "Shoot date and time", "Number of bedrooms and bathrooms", "Access: keys, alarm, pets", "Delivery date", "Image count", "+Features to highlight", "+Rooms to skip", "+Notes"]),
      checklist("Homeowner property prep checklist", "Share with the owner a few days before.", [
        { title: "Throughout", items: ["Clear surfaces and countertops", "Replace blown bulbs; matching color where possible", "Open curtains and blinds", "Hide cables, bins, and pet items"] },
        { title: "Rooms", items: ["Beds made with smooth covers", "Towels folded, toilet lids down", "Fridge front cleared of magnets and notes", "Cars moved from the driveway"] }
      ])
    ],
    addons: [
      { name: "Room-by-room shot list cards", subtitle: "Shot cards for each room type.", blocks: [
        cards("Room-by-room shot list cards", "Keep on hand while walking through the property.", [
          { title: "Front exterior", text: "Straight-on · corner angle · entrance detail · street context. Sun on the facade if possible." },
          { title: "Living room", text: "From the main doorway · from the opposite corner · feature detail (fireplace, window view)." },
          { title: "Kitchen", text: "Wide from the dining side · wide from the opposite end · counter detail · island or breakfast bar." },
          { title: "Dining", text: "Wide showing table and connection to kitchen or living room." },
          { title: "Bedrooms", text: "From the doorway or a corner, showing the bed and window · primary suite detail." },
          { title: "Bathrooms", text: "From the doorway at a lower height · avoid showing yourself in mirrors · vanity detail." },
          { title: "Outdoor", text: "Garden from the house · house from the garden · patio or balcony · view." },
          { title: "Extras", text: "Office, laundry, garage, storage, amenities (pool, gym) as requested." }
        ], { kicker: "Add-on" })
      ] },
      { name: "Twilight exterior planner", subtitle: "Plan a twilight exterior shoot.", blocks: [
        worksheet("Twilight exterior planner", "The best twilight window is usually about 10–25 minutes after sunset, when the sky and interior lights balance.", ["Property", "Date", "Sunset time", "Arrive by (45 min before sunset)", "Start shooting", "Camera position", "Which way the facade faces", "Interior lights to switch on", "+Exterior lights and garden lighting", "+Backup date if cloudy", "+Notes"], { kicker: "Add-on" })
      ] },
      { name: "Flash bracketing reference card", subtitle: "A flash-and-ambient method for interiors.", blocks: [
        text("Flash and ambient blending", "Combine an ambient exposure for overall light with flash frames for color and windows.", [], [
          "Tripod at chest height, camera level, settings in manual: f/8, ISO 400.",
          "Ambient frame: shutter speed so the room looks natural, often 1/4–1 s.",
          "Window frame: shorter shutter so the view outside is correctly exposed.",
          "Flash frame: bounce flash off the ceiling or a wall behind you to clean up color casts.",
          "Optional: extra flash frames lighting dark corners from different positions.",
          "Blend in editing: ambient as the base, flash for color, window frame for the view."
        ], { kicker: "Add-on" })
      ] },
      { name: "Homeowner property prep checklist", subtitle: "Send to the owner before the shoot.", blocks: [
        checklist("Homeowner property prep checklist", "A tidy home photographs faster and better.", [
          { title: "Outside", items: ["Cars moved from the driveway and street front", "Bins out of sight", "Lawn mowed and paths swept", "Garden hoses and toys put away"] },
          { title: "Inside", items: ["Counters cleared except a few decorative items", "Fridge front cleared", "Beds made with smooth covers", "Bathrooms: towels folded, toiletries away, toilet lids down", "Curtains and blinds open", "All bulbs working", "Pets and pet items out of sight", "Personal photos and paperwork put away"] }
        ], { kicker: "Add-on" })
      ] }
    ]
  }
];
