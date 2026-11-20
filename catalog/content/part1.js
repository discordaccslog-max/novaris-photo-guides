import { shotlist, checklist, worksheet, table, cards, templates, settings, setup, questionnaire, text, rows, el, beam, zoneFocusTable, macroDofTable } from "./helpers.js";

const camera = (notes) => el("camera", "camera", 180, 262, "Camera", "Your shooting position.", notes);

export default [
  /* ------------------------------------------------------------------ */
  {
    slug: "seasonal-mini-sessions-guide",
    name: "Seasonal Mini Sessions Guide",
    subtitle: "A shot list, scheduling template, set planning sheet, and setup notes for short, back-to-back seasonal sessions.",
    intro: [
      "Mini sessions are short bookings, often 15 to 20 minutes each, run one after another on a single set. Because every family gets the same set and the same light, the work is mostly in the planning: a set that photographs well all day, a schedule with realistic buffers, and a shot list that covers the essentials before attention runs out.",
      "Use the set planning sheet when you design the day, the schedule to take bookings, and the shot list on the day itself."
    ],
    blocks: [
      shotlist("Mini session shot list", "Organized so the most important frames happen in the first minutes, while everyone is fresh.", [
        { title: "First five minutes", items: [["Full group, everyone looking at the camera", "Your safety frame: take several."], "Full group interacting: a hug, a whisper, a tickle", "Seated or lower-angle variation of the full group"] },
        { title: "Middle of the session", items: ["Parents together", "Each child on their own", "Siblings together", ["Close detail: hands, a prop, a seasonal touch", "Quick to shoot while children reset."]] },
        { title: "Last minutes", items: ["Walking or movement frame", "Repeat of the family's favorite pose", "Final full group, in case earlier frames had blinks"] }
      ], { fields: ["Family", "Slot time"] }),
      setup("One-light mini session set", "A single soft key light gives every slot the same look, whatever the weather or time of day.", [
        el("backdrop", "backdrop", 180, 44, "Seasonal backdrop", "The themed set behind the family.", "Build it at least 1.5 m behind where people stand, so the key light falls off before it reaches the backdrop and the set stays slightly darker than faces."),
        el("key", "softbox", 92, 126, "Key light (large softbox)", "Main light for every family.", "Place it 45° to one side and a little above head height. A large modifier keeps light even across a group of four to six. Mark the stand position on the floor so it doesn't drift during the day."),
        el("subject", "audience", 180, 140, "Family", "Where each family stands or sits.", "Mark the spot with tape. Keep everyone within the same distance from the light so exposure stays consistent from slot to slot."),
        el("fill", "reflector", 266, 160, "Reflector", "Fill on the side away from the key.", "A large white reflector on a stand saves an assistant. Move it closer for children with darker clothing."),
        camera("Use a fixed position and focal length so every gallery matches. Check focus at full magnification every few families.")
      ], [beam("key", "subject"), beam("fill", "subject", "bounce")], ["Test the set with a stand-in at the start time and again halfway through the day.", "Keep a step stool by the camera for slightly higher angles on groups."]),
      settings("Mini session starting points", "Starting points for common mini session sets. Adjust for your light and lens.", rows([
        ["Open shade outdoors, small family", "f/4", "1/400", "200", "Find even shade with a darker background."],
        ["Open shade, family of 5–7", "f/5.6–f/8", "1/250", "400", "Keep everyone on one plane."],
        ["Indoor set, one softbox", "f/5.6", "1/160", "200", "Flash sets exposure; shutter controls room light."],
        ["String-light background glow", "f/2.8", "1/200", "800", "Lights 2 m or more behind the family for soft bokeh."],
        ["Late-afternoon backlight", "f/2.8", "1/500", "200", "Expose for faces; add a reflector in front."]
      ]), ["Lock exposure and white balance for the whole day so galleries match.", "Shoot a few frames of every family with a slightly deeper aperture for groups."]),
      table("Back-to-back schedule", "Plan slots with a buffer so a late family doesn't push the whole day.", ["Slot", "Start", "Family", "Contact", "Paid", "Notes"],
        Array.from({ length: 12 }, (_, i) => [String(i + 1), "", "", "", "", ""]), { widths: [0.07, 0.11, 0.25, 0.24, 0.08, 0.25] }),
      worksheet("Set planning sheet", "Design the set and the day before you open bookings.", ["Theme", "Date", "Location", "Slot length and buffer", "+Backdrop, props, and colors", "+Light: time of day, direction, or lighting setup", "Price and what's included", "Number of images per family", "+Weather or backup plan", "+Set-up and tear-down notes"]),
      checklist("Mini session day checklist", "Run through before the first family arrives and between slots.", [
        { title: "Before the first slot", items: ["Set built and tested with a stand-in", "Schedule printed or on a second device", "Spare props and a lint roller", "Water, snacks, and wipes for children", "Batteries charged and cards formatted"] },
        { title: "Between slots", items: ["Reset props and tidy the set", "Check focus and exposure on the last frames", "Note favorite frames for the family"] },
        { title: "After the day", items: ["Back up all cards before leaving", "Send each family the delivery timeline"] }
      ])
    ],
    addons: [
      {
        name: "Holiday backdrop setup cards",
        subtitle: "Six seasonal set ideas, each with how to build it, how to light it, and what to watch for.",
        blocks: [cards("Holiday backdrop setup cards", "Each set fits in about 2.5 × 2.5 m and works with the one-light setup in the guide.", [
          { title: "Winter cabin corner", text: "Build: a wooden crate or bench, a knit blanket, two lanterns, and a small evergreen. Light: soft key from the side; lanterns add warm points. Watch for: lantern glow overpowering faces; keep it a stop below the key." },
          { title: "Tree and string lights", text: "Build: a decorated tree 2–3 m behind the family with string lights. Light: key softbox on the family; shoot at f/2.8 or wider for round background bokeh. Watch for: green color cast on skin from the tree; keep people forward." },
          { title: "Autumn leaves floor", text: "Build: a hay bale or bench, pumpkins, a blanket of leaves. Light: open shade or a key from 45°. Watch for: orange reflecting onto faces; a white reflector neutralizes it." },
          { title: "Spring blossom arch", text: "Build: an arch with faux or real blossoms and a light backdrop. Light: bright, even key and fill for a high-key look. Watch for: the arch framing heads awkwardly; position the tallest person under its peak." },
          { title: "Snow-scene paper backdrop", text: "Build: white seamless paper, a faux-fur rug, scattered white props. Light: key plus a light on the backdrop for clean white. Watch for: overexposed white clothing; keep the backdrop one stop above faces." },
          { title: "Heart wall (February)", text: "Build: a painted board or paper hearts on a neutral wall. Light: soft frontal key and fill. Watch for: busy patterns behind heads; leave a clear space at head height." }
        ], { kicker: "Add-on" })]
      },
      {
        name: "Booking slot planner",
        subtitle: "A two-day slot planner for taking and tracking mini session bookings.",
        blocks: [
          table("Booking slot planner: day 1", "Fill in as bookings arrive. Tick deposit and gallery as you go.", ["Slot", "Start", "End", "Family", "Size", "Email or phone", "Deposit", "Gallery sent"], Array.from({ length: 14 }, (_, i) => [String(i + 1), "", "", "", "", "", "", ""]), { widths: [0.06, 0.09, 0.09, 0.22, 0.07, 0.25, 0.1, 0.12], kicker: "Add-on" }),
          table("Booking slot planner: day 2", "Fill in as bookings arrive. Tick deposit and gallery as you go.", ["Slot", "Start", "End", "Family", "Size", "Email or phone", "Deposit", "Gallery sent"], Array.from({ length: 14 }, (_, i) => [String(i + 1), "", "", "", "", "", "", ""]), { widths: [0.06, 0.09, 0.09, 0.22, 0.07, 0.25, 0.1, 0.12], kicker: "Add-on" })
        ]
      },
      {
        name: "Client reminder message templates",
        subtitle: "Ready-to-adapt messages for each step of a mini session booking.",
        blocks: [templates("Client reminder message templates", "Copy into your email or messaging app and fill in the blanks.", [
          { title: "Booking confirmation", text: "Hi ____,\n\nThank you for booking a ____ mini session. Your slot is on ____ at ____, at ____.\n\nSessions start on time and last ____ minutes, so please arrive five minutes early. I'll send a short what-to-wear note a week before.\n\nSee you soon,\n____" },
          { title: "What to wear (one week before)", text: "Hi ____,\n\nYour mini session is a week away. A few tips: choose two or three coordinating colors rather than matching outfits, avoid large logos and busy patterns, and bring a spare top for little ones.\n\nThe set is ____ in tone, so ____ works especially well.\n\n____" },
          { title: "Day-before reminder", text: "Hi ____,\n\nA quick reminder that your session is tomorrow at ____, at ____. Parking is ____.\n\nIf anything changes, reply to this message and I'll do my best to help.\n\n____" },
          { title: "Weather or schedule change", text: "Hi ____,\n\nBecause of ____, I'm moving sessions on ____. Your new time is ____ on ____. If that doesn't work, reply with a time that suits you and I'll find the closest available slot.\n\nThank you for understanding,\n____" },
          { title: "Gallery delivered", text: "Hi ____,\n\nYour mini session gallery is ready: ____\n\nThe gallery is available until ____. Download your images to keep them safe.\n\nThank you for choosing me,\n____" }
        ])]
      }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "street-photography-field-guide",
    name: "Street Photography Field Guide",
    subtitle: "Zone-focus reference, settings, scene ideas, a walk planner, and etiquette for photographing in public spaces.",
    intro: [
      "Street photography rewards preparation more than speed: settings decided before you leave, focus pre-set to a known distance, and a route chosen for its light. This guide collects the references you need on a walk.",
      "Laws on photographing people in public vary by country. Know the rules where you shoot, respect people who ask not to be photographed, and avoid photographing people in vulnerable situations."
    ],
    blocks: [
      cards("Scene approaches", "Ways of working a street scene. Pick one or two per walk.", [
        { title: "Find the stage, wait for the actor", text: "Find good light and a clean background first, then wait for someone to walk into it. Patience produces more keepers than chasing." },
        { title: "Layers", text: "Arrange foreground, middle, and background interest in one frame. Works best at f/8 or deeper and a wide lens." },
        { title: "Silhouettes", text: "Expose for a bright background such as a sunlit wall or sky so people in front fall to black. Look for clear outlines." },
        { title: "Reflections", text: "Shop windows, puddles, and glass facades double a scene. Change your angle until the reflection lines up." },
        { title: "Shadows and geometry", text: "Low sun throws long shadows across lines and steps. Frame the pattern and wait for a figure to complete it." },
        { title: "Juxtaposition", text: "Look for contrast between a person and a sign, poster, or object behind them. Keep the frame simple so the link reads." }
      ]),
      settings("Street settings", "Starting points. Auto ISO with a minimum shutter speed is a reliable way to keep these on a walk.", rows([
        ["Bright sun, zone focus", "f/8–f/11", "1/500", "200–400", "Deep focus for quick, unplanned frames."],
        ["Open shade or narrow streets", "f/5.6–f/8", "1/250", "Auto", "Set Auto ISO with 1/250 minimum."],
        ["Overcast day", "f/5.6", "1/250", "800", "Soft light suits close portraits."],
        ["Night, street lights", "f/2–f/2.8", "1/125", "3200", "Focus manually on a lit area."],
        ["Motion blur, panning", "f/11", "1/30", "100", "Follow the subject smoothly through the shot."],
        ["Silhouettes", "f/8", "1/1000", "100", "Expose for the bright background."]
      ]), ["For people walking, keep the shutter at 1/250 or faster.", "Pre-set focus with the zone-focus table so you can shoot without waiting for autofocus."]),
      table("Zone focus reference", "Sharp zone for full-frame cameras (circle of confusion 0.03 mm). With smaller sensors the zone is shallower; treat these as a guide.",
        ["Lens", "Aperture", "Hyperfocal", "Focus at 2 m", "Focus at 3 m", "Focus at 5 m"],
        zoneFocusTable([28, 35, 50], [5.6, 8, 11, 16], [2, 3, 5]), { kicker: "Reference", widths: [0.11, 0.12, 0.14, 0.21, 0.21, 0.21], small: true }),
      worksheet("Photo walk planner", "Plan a walk around light and places rather than a fixed list of photos.", ["Area or route", "Date", "Start time", "Sun direction and shadow side", "+Scenes and approaches to try", "+Backgrounds and corners to revisit", "+What worked last time", "+Notes"]),
      checklist("Street kit and etiquette", "A light kit and a clear approach.", [
        { title: "Kit", items: ["One small camera and one lens", "Spare battery and memory card", "Settings and focus zone set before leaving", "Comfortable shoes and a small bag"] },
        { title: "Etiquette", items: ["Smile and be open if someone notices you", "Delete a frame if someone asks", "Avoid people in vulnerable or private situations", "Know local laws on photographing people and private property"] }
      ])
    ],
    addons: [
      { name: "Pocket settings card", size: "pocket", subtitle: "Street settings and zone focus on a 4 × 6 in card.", blocks: [
        settings("Street settings", "Starting points.", rows([
          ["Bright sun", "f/8–11", "1/500", "200–400", "Zone focus"],
          ["Shade", "f/5.6–8", "1/250", "Auto", ""],
          ["Overcast", "f/5.6", "1/250", "800", ""],
          ["Night", "f/2–2.8", "1/125", "3200", ""],
          ["Panning", "f/11", "1/30", "100", ""]
        ]), ["35 mm at f/8 focused at 3 m: about 1.9–7.2 m sharp.", "28 mm at f/11 focused at 2.5 m: about 1.2 m to infinity."])
      ] },
      { name: "Zone focus distance chart", subtitle: "Hyperfocal distances and sharp zones for four common street focal lengths.", blocks: [
        table("Zone focus distance chart", "Full-frame values (circle of confusion 0.03 mm). Focus at the distance in the column heading; everything in the range is acceptably sharp.",
          ["Lens", "Aperture", "Hyperfocal", "Focus at 1.5 m", "Focus at 2.5 m", "Focus at 4 m"],
          zoneFocusTable([24, 28, 35, 50], [5.6, 8, 11, 16], [1.5, 2.5, 4]), { kicker: "Add-on", widths: [0.11, 0.12, 0.14, 0.21, 0.21, 0.21], small: true })
      ] },
      { name: "Photo walk route planner", subtitle: "A stop-by-stop route planner with space for a sketch map.", blocks: [
        table("Photo walk route planner", "List stops in walking order with the time the light suits each one.", ["Stop", "Location", "Best time", "Light", "What to look for"], Array.from({ length: 10 }, (_, i) => [String(i + 1), "", "", "", ""]), { kicker: "Add-on", widths: [0.07, 0.26, 0.13, 0.17, 0.37] }),
        worksheet("Route sketch", "Sketch the route, marking stops, sun direction, and north.", ["+Route sketch and notes", "+After the walk: what to revisit"], { columns: 1, kicker: "Add-on" })
      ] }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "large-group-reunion-guide",
    name: "Large Group & Reunion Guide",
    subtitle: "Group arrangements, a reunion shot list, an open-shade setup, settings for big groups, and a group-day planner.",
    intro: [
      "Large groups are a logistics problem as much as a photographic one. Getting thirty people into place, all visible and in focus, depends on a plan: a shot order, someone who knows everyone, and an arrangement chosen before the group gathers.",
      "This guide covers arrangements, settings for depth of field across rows, and a checklist for the moment you press the shutter."
    ],
    blocks: [
      cards("Group arrangements", "Choose an arrangement for the size of the group and the space you have.", [
        { title: "Two rows: seated and standing", text: "Up to about 15 people. Front row seated on chairs or a bench, back row standing between heads. Keep rows close together for depth of field." },
        { title: "Three rows on steps", text: "15–40 people. Steps lift each row so every face is visible. Shoot from slightly above the middle row." },
        { title: "Staggered rows", text: "Place each person in the gap between two in front, like bricks. Prevents heads hiding heads." },
        { title: "Family clusters", text: "For reunions, group each family branch together inside the larger group so smaller groupings can be cropped later." },
        { title: "High viewpoint", text: "50+ people. Shoot from a balcony, window, or ladder with the group looking up. Faces open up and rows matter less." },
        { title: "Generations line", text: "A single row from eldest to youngest. A popular reunion frame; works best with a wide, clean background." }
      ]),
      shotlist("Reunion shot list", "In shooting order. Do the full group early, before people leave or drift.", [
        { title: "Early", items: [["Full group", "Several frames; count down each time."], "Each family branch", "Generations: eldest to youngest"] },
        { title: "Combinations", items: ["Grandparents with all grandchildren", "Siblings of the eldest generation", "All the children together", "Couples"] },
        { title: "Candid and context", items: ["Arrivals and greetings", "Food and table details", "Wide frame of the venue with the group in it"] }
      ]),
      setup("Large group in open shade", "Even light from the open sky, a raised camera, and a reflector for the front rows.", [
        el("shade", "shade", 180, 96, "Shade", "Removes hard sun from faces.", "Choose shade large enough to cover the whole group with a margin; patchy shade across faces is hard to fix."),
        el("group", "audience", 180, 120, "Group", "Rows arranged facing open sky.", "Front row at the edge of the shade, facing out. Check that every face can see the lens."),
        el("sky", "sky", 300, 236, "Open sky", "Main light.", "The brightest part of the sky sets light direction. Turn the group slightly toward it."),
        el("reflector", "reflector", 80, 206, "Reflector", "Lifts the front rows.", "Large and low, angled up toward faces. Optional on bright days."),
        el("camera", "camera", 180, 262, "Camera on raised tripod", "Slightly above head height.", "A small step ladder helps people further back be seen. Use a remote or the timer.")
      ], [beam("sky", "group"), beam("reflector", "group", "bounce")], ["Raise the camera slightly and ask everyone to find the lens with both eyes.", "Take a burst of frames on each count to catch everyone with eyes open."]),
      settings("Group settings", "Starting points for depth of field across several rows.", rows([
        ["10–20 people, two rows", "f/8", "1/250", "400", "Focus on the front of the back row."],
        ["20–50 people, three or more rows", "f/8–f/11", "1/250", "800", "Keep rows close together."],
        ["Indoor hall, bounce flash", "f/5.6", "1/125", "1600", "Bounce off a light ceiling."],
        ["High viewpoint, 50+ people", "f/8", "1/250", "400", "Wide lens; watch edge distortion."],
        ["Backlit at sunset", "f/5.6", "1/250", "400", "Expose for faces; add fill if you can."]
      ]), ["Focus about a third of the way into the group's depth.", "With a wide lens, keep people away from the frame edges to avoid stretched faces."]),
      worksheet("Group day plan", "Fill in with the organizer before the event.", ["Event", "Date", "Location", "Number of people", "Organizer contact", "Family contact who knows everyone", "Time for the full group photo", "Backup indoor location", "+Shot order and groupings", "+Access: steps, balcony, ladder, or chairs", "+Notes"]),
      checklist("Before you press the shutter", "Check these in the few seconds before each group frame.", [
        { title: "Group", items: ["Can everyone see the camera?", "Gaps closed and rows staggered", "Tallest people at the back and ends", "Bags, drinks, and phones out of hands", "Glasses angled slightly down to avoid glare"] },
        { title: "Camera", items: ["Focus on the front of the middle row", "Aperture deep enough for all rows", "Count down out loud", "Take five or more frames"] }
      ])
    ],
    addons: [
      { name: "Group arrangement planner", subtitle: "Plan who stands where, row by row, before the group gathers.", blocks: [
        table("Group arrangement planner", "Write names left to right as seen from the camera.", ["Row", "Left → right (as seen from the camera)"], [["Back row", ""], ["Middle row", ""], ["Front row (seated)", ""], ["Front (on the ground)", ""], ["Back row", ""], ["Middle row", ""], ["Front row (seated)", ""], ["Front (on the ground)", ""]], { kicker: "Add-on", widths: [0.22, 0.78] }),
        worksheet("Arrangement notes", "Notes on height, mobility, and who should stand together.", ["Group 1 name", "Group 2 name", "+People who need a seat", "+People to keep together or apart", "+Notes"], { kicker: "Add-on" })
      ] },
      { name: "Name-list grouping sheet", subtitle: "List every grouping with names, then tick them off during the shoot.", blocks: [
        table("Name-list grouping sheet", "Order groups so people can leave once their groups are done.", ["#", "Group", "Names", "Done"], Array.from({ length: 15 }, (_, i) => [String(i + 1), "", "", ""]), { kicker: "Add-on", widths: [0.06, 0.26, 0.58, 0.1] })
      ] },
      { name: "Outdoor reflector setup card", subtitle: "Where to put a reflector for groups outdoors, with steps.", blocks: [
        setup("Reflector fill for an outdoor group", "Sun behind the group for rim light, a large reflector in front to lift faces.", [
          el("sun", "sun", 250, 40, "Sun (behind group)", "Rim light on hair and shoulders.", "Keep the sun behind and to one side. Low sun works best."),
          el("group", "audience", 180, 126, "Group", "Facing the camera, backs to the sun.", "Ask people to keep chins slightly down to avoid squinting into the reflector."),
          el("reflector", "reflector", 140, 206, "Large reflector", "Bounces sunlight onto faces.", "Use the largest reflector you have, held low and angled up. Two reflectors cover groups wider than five people."),
          el("camera", "camera", 220, 262, "Camera", "Expose for faces.", "Use a lens hood; shade the lens if flare washes out the frame.")
        ], [beam("sun", "group"), beam("reflector", "group", "bounce")], ["Ask a helper to hold the reflector; a stand can tip in wind.", "White gives natural fill; silver is brighter but can make people squint."])
      ] }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "pet-photography-guide",
    name: "Pet Photography Guide",
    subtitle: "Shot lists for dogs, cats, and small pets, settings for moving animals, attention techniques, a session plan, and safety notes.",
    intro: [
      "Pet sessions move at the animal's pace. Short bursts of attention, plenty of breaks, and settings chosen for speed make the difference. Plan with the owner, and let the animal settle before you start.",
      "The animal's comfort and safety always come first. Follow the owner's lead on what the pet enjoys and what to avoid."
    ],
    blocks: [
      shotlist("Dog session", "In rough order: calm frames first, energetic frames once the dog is comfortable.", [
        { title: "Settling in", items: ["Candid frames while the dog explores", ["Sitting portrait at the dog's eye level", "Get low; eye level matters more than anything."], "Close-up of eyes and nose"] },
        { title: "Action", items: [["Running toward the camera", "Continuous autofocus and burst mode."], "Play with a favorite toy", "Jumping or catching"] },
        { title: "With the owner and details", items: ["Owner and dog together", "Paws, collar, and tag details", "Wide frame in their favorite place", "Resting or calm frame to finish"] }
      ]),
      shotlist("Cat and small pet session", "Quieter, slower sessions, usually at home.", [
        { title: "Portraits", items: ["Calm window-light portrait", "Close-up of the eyes", "Favorite spot: shelf, chair, or windowsill"] },
        { title: "Interaction", items: ["With the owner's hands or lap", "Toy play", "Details: whiskers, paws, markings"] }
      ], { blank: 2 }),
      settings("Pet settings", "Fast shutter speeds are the priority with moving animals.", rows([
        ["Dog running toward camera", "f/4", "1/1000–1/2000", "Auto", "Continuous AF, burst mode."],
        ["Outdoor portrait in shade", "f/2.8", "1/500", "200–400", "Focus on the nearest eye."],
        ["Indoor window light", "f/2.8", "1/250", "1600", "Raise ISO before lowering shutter."],
        ["Small pet on a table", "f/5.6", "1/250", "800", "Deeper focus for small faces."],
        ["Dark coat", "", "", "", "Expose +0.3 to +1 stop to keep detail."],
        ["White or pale coat", "", "", "", "Expose −0.3 to −0.7 stop to protect highlights."]
      ]), ["Focus on the eye nearest the camera.", "Animals blink and move: take short bursts rather than single frames."]),
      cards("Attention techniques", "Use one at a time and save the best for the frames that matter most.", [
        { title: "Sound at the lens", text: "A squeaker or a crinkle held just above the lens brings the eyes to the camera. Use it sparingly so it stays interesting." },
        { title: "Treat at lens height", text: "Hold a treat right beside the lens. Check with the owner which treats are allowed." },
        { title: "A new word", text: "An unfamiliar word or sound often produces a head tilt. Try it once or twice." },
        { title: "Let them investigate", text: "Let the animal sniff the camera and you before starting. Curiosity settles into calm." },
        { title: "Owner behind you", text: "The owner calling from just behind the camera draws attention toward the lens." },
        { title: "Short sessions", text: "Work in short bursts with breaks for play, water, and rest. A tired animal won't engage." }
      ]),
      worksheet("Pet session plan", "Fill in with the owner before the session.", ["Pet name", "Species and breed", "Age", "Owner", "Temperament", "Favorite treats and toys", "+Things to avoid: fears, sounds, other animals", "Location", "+Owner's must-have shots", "+Notes"]),
      checklist("Safety and comfort", "Check before and during every pet session.", [
        { title: "Before", items: ["Location is safe and enclosed, or the pet is on a lead", "Water bowl and shade available", "Treats approved by the owner", "Check temperature: avoid hot pavement and midday heat"] },
        { title: "During", items: ["Introduce flash gradually, or use natural light for sensitive animals", "Take breaks when the pet loses interest", "Stop if the pet shows stress", "Leads can be removed later in editing"] }
      ])
    ],
    addons: [
      { name: "Owner questionnaire", subtitle: "Send before the session to plan around the pet's personality.", blocks: [
        questionnaire("Pet owner questionnaire", "Your answers help plan a session that suits your pet. Please return it before your session date.", [
          "Your name and best contact details", "Your pet's name, species, breed, and age", "How would you describe your pet's personality?", "Favorite treats, toys, or games", "Any fears or triggers (sounds, strangers, other animals)?", "Any health or mobility needs we should know about?", "Where would you like the session (home, park, studio)?", "Will other people or pets join the session?", "Must-have photos", "How will you use the photos (prints, gifts, social media)?", "Anything else we should know"
        ])
      ] },
      { name: "Attention prompt cards", subtitle: "Twelve ways to bring a pet's attention to the lens.", blocks: [
        cards("Attention prompt cards", "Rotate through these; any prompt loses its effect if repeated too often.", [
          { title: "Squeaker above the lens", text: "One short squeak, then shoot." }, { title: "Crinkly packet", text: "A treat bag rustled near the camera." },
          { title: "Kissing sound", text: "Quiet and close to the lens." }, { title: "Their name, whispered", text: "A whisper is often more intriguing than a call." },
          { title: "New word", text: "'Pancake?' or any word they haven't heard." }, { title: "Doorbell sound on a phone", text: "Use once; check with the owner first." },
          { title: "Ball held at lens height", text: "Hold still, then throw after the frame." }, { title: "Owner behind camera", text: "Owner kneels just behind your shoulder." },
          { title: "Treat on the lens hood", text: "Balanced briefly for a sharp, focused stare." }, { title: "Pause and wait", text: "Stop moving; animals often look to see why." },
          { title: "Animal sound app", text: "A short bird or cat sound; very sparingly." }, { title: "Break and play", text: "Two minutes of play resets attention." }
        ], { kicker: "Add-on", cols: 3 })
      ] },
      { name: "Outdoor session shot list", subtitle: "An outdoor shot list for parks, beaches, and trails.", blocks: [
        shotlist("Outdoor pet session", "Plan around the light and the pet's energy.", [
          { title: "Calm start", items: ["Sitting portrait in open shade", "Lying in grass or sand", "Close-up head and shoulders with soft background"] },
          { title: "Movement", items: ["Running toward camera", "Running alongside, panning", "Jumping for a toy", "Splash or water play (if they enjoy it)"] },
          { title: "Scene and owner", items: ["Walking with the owner, from behind", "Owner and pet silhouette at sunset", "Wide landscape with the pet small in frame"] }
        ], { kicker: "Add-on" })
      ] },
      { name: "Studio pet setup diagrams", subtitle: "Two simple studio setups for pets.", blocks: [
        setup("One light on a seamless backdrop", "A large soft light close to the pet, forgiving as the animal moves.", [
          el("backdrop", "backdrop", 180, 44, "Seamless backdrop", "Clean background.", "Run the paper onto the floor in a gentle curve. Tape the edge so it doesn't move when the pet steps on it."),
          el("key", "softbox", 110, 120, "Large softbox", "Main light.", "Close and slightly above, angled down. Large and close gives soft light that stays even as the pet shifts position."),
          el("pet", "subject", 180, 146, "Pet", "On a marked spot.", "A small mat or treat marks the spot. Have the owner just out of frame."),
          el("card", "card", 252, 156, "White card", "Fill for the shadow side.", "Large foam board on the floor, angled in."),
          camera("Get down to the pet's eye level. Keep the shutter at 1/200 or faster if mixing flash with room light.")
        ], [beam("key", "pet"), beam("card", "pet", "bounce")], ["Introduce the flash with a few test pops before the pet arrives on set.", "Dark-coated pets: bring the light closer rather than raising power."]),
        setup("Two lights: key and rim", "A rim light separates dark-coated pets from a dark background.", [
          el("backdrop", "backdrop", 180, 44, "Dark backdrop", "Lets the rim show.", "Keep it 2 m or more behind the pet."),
          el("rim", "strip", 282, 92, "Rim light (strip box)", "Outlines fur.", "Behind and to the side, aimed at the edge of the pet. Use a grid to stop flare."),
          el("key", "softbox", 96, 126, "Key light", "Main light on the face.", "45° from the camera, slightly above."),
          el("pet", "subject", 180, 146, "Pet", "Between key and rim.", "A slight turn away from the rim gives a cleaner edge."),
          camera("Use a lens hood. Check the edge glow isn't spilling into the lens.")
        ], [beam("key", "pet"), beam("rim", "pet")], ["Start with the rim at the same power as the key and adjust."])
      ] }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "macro-close-up-guide",
    name: "Macro & Close-Up Guide",
    subtitle: "Depth-of-field references, focus stacking, diffused light setups, settings, and subject lists for close-up work.",
    intro: [
      "At close range, depth of field shrinks to millimeters and small movements matter. Reliable macro work comes from controlling three things: support, light, and focus. This guide gives you references for each.",
      "Depth-of-field figures in this guide are calculated for full-frame cameras and are a guide; your results depend on your lens, sensor, and how large the image is viewed."
    ],
    blocks: [
      table("Depth of field at close range", "Total depth of field in millimeters by magnification and aperture (full frame, circle of confusion 0.03 mm).",
        ["Magnification", "f/4", "f/5.6", "f/8", "f/11", "f/16"], macroDofTable([0.25, 0.5, 1, 2], [4, 5.6, 8, 11, 16]), { kicker: "Reference", widths: [0.2, 0.16, 0.16, 0.16, 0.16, 0.16] }),
      setup("Diffused flash for small subjects", "A flash through a diffuser close to the subject gives soft light and freezes movement.", [
        el("subject", "product", 180, 140, "Subject", "Flower, insect, or small object.", "Keep the background well behind the subject so it falls dark or soft."),
        el("diffuser", "diffusion", 112, 112, "Diffuser", "Softens and spreads the flash.", "As close to the subject as possible without entering the frame. Closer means softer."),
        el("flash", "flash", 64, 80, "Flash", "Main light.", "Fire through the diffuser at low power. Off-camera on a short cable or wireless trigger gives the most control."),
        el("card", "card", 250, 150, "White card", "Fill.", "A small white card opposite the diffuser lifts the shadow side."),
        camera("Use manual focus and move the whole camera slightly to focus at high magnification.")
      ], [beam("flash", "diffuser"), beam("diffuser", "subject"), beam("card", "subject", "bounce")], ["Flash freezes small movements from wind and breathing.", "Set the shutter at your flash sync speed to darken ambient light behind the subject."]),
      setup("Window light still life", "Soft daylight from the side for stationary subjects, with a tripod for long exposures.", [
        el("window", "window", 46, 140, "Window", "Soft directional light.", "Sheer curtain or indirect daylight. Place the subject 0.5–1 m from the window."),
        el("subject", "product", 180, 140, "Subject", "On a small table.", "Turn it until the light describes texture."),
        el("card", "card", 262, 146, "White card", "Fill.", "Move closer to soften shadows; replace with black card for more contrast."),
        el("camera", "camera", 180, 262, "Camera on tripod", "Locked in place.", "Use a remote release or 2-second timer; long exposures are fine for still subjects.")
      ], [beam("window", "subject"), beam("card", "subject", "bounce")], ["Turn off room lights to avoid mixed color.", "A focus rail makes fine focus adjustments much easier at 1:1."]),
      settings("Macro settings", "Starting points for common close-up situations.", rows([
        ["Handheld with flash", "f/11", "1/200", "200", "Flash freezes motion."],
        ["Tripod still life, daylight", "f/8–f/11", "1/15–1 s", "100", "Remote or timer."],
        ["Insects outdoors, handheld", "f/8", "1/250", "800", "Early morning, insects are slower."],
        ["Focus stacking", "f/5.6–f/8", "As needed", "100", "Sharpest apertures, many frames."],
        ["Water drops and dew", "f/8", "1/250", "400", "Backlight makes drops sparkle."]
      ]), ["Above about f/16 at 1:1, diffraction softens detail; use focus stacking instead.", "At high magnification, focus by moving the camera rather than turning the focus ring.", "Wind is the biggest problem outdoors: shield the subject or shoot early."]),
      shotlist("Close-up subject list", "Ideas to work through, from easy to demanding.", [
        { title: "Plants", items: ["Whole flower against a dark background", "Petal edge and texture", "Leaf veins, backlit", "Dew or water drops"] },
        { title: "Small life", items: ["Insect at eye level", "Spider web with backlight", "Butterfly or moth wings"] },
        { title: "Objects", items: ["Texture abstracts: fabric, wood, metal", "Product details: stitching, engraving, labels"] }
      ]),
      checklist("Macro kit", "A compact kit for close-up work.", [
        { title: "Support and focus", items: ["Tripod with low-angle capability", "Focus rail", "Remote release or timer"] },
        { title: "Light control", items: ["Diffuser panel", "Small white and black cards", "Flash with off-camera cable or trigger"] },
        { title: "Field extras", items: ["Plant clamp to steady stems", "Spray bottle for water drops", "Kneeling pad"] }
      ])
    ],
    addons: [
      { name: "Focus stacking worksheet", subtitle: "Plan and log focus stacks so you can repeat what works.", blocks: [
        text("Focus stacking steps", "Combine several frames focused at different depths into one image that is sharp throughout.", [], [
          "Set the camera on a tripod, with manual exposure, manual focus, and fixed white balance.",
          "Choose a sharp aperture, usually f/5.6 to f/8.",
          "Focus on the nearest point that must be sharp; take the first frame.",
          "Move focus (or the focus rail) by a small step and take the next frame. Each step should overlap the previous zone of sharpness; use the depth-of-field chart to size steps.",
          "Continue until the furthest point is sharp. Take one extra frame beyond it.",
          "Combine in stacking software, then check edges and fine detail for errors."
        ], { kicker: "Add-on" }),
        table("Focus stack log", "Record each stack for future reference.", ["#", "Subject", "Magnification", "Aperture", "Step size", "Frames", "Result"], Array.from({ length: 12 }, (_, i) => [String(i + 1), "", "", "", "", "", ""]), { kicker: "Add-on", widths: [0.05, 0.25, 0.13, 0.11, 0.12, 0.1, 0.24] })
      ] },
      { name: "Depth of field chart", subtitle: "Close-range depth of field for six magnifications and five apertures.", blocks: [
        table("Depth of field chart", "Total depth of field (full frame, circle of confusion 0.03 mm). Smaller sensors at the same magnification have slightly less.",
          ["Magnification", "f/2.8", "f/4", "f/8", "f/11", "f/16"], macroDofTable([0.1, 0.2, 0.25, 0.5, 1, 2], [2.8, 4, 8, 11, 16]), { kicker: "Add-on", widths: [0.2, 0.16, 0.16, 0.16, 0.16, 0.16] })
      ] },
      { name: "Diffuser setup cards", subtitle: "Diffuser options and where to place them for close-up light.", blocks: [
        cards("Diffuser setup cards", "Softer light comes from a larger source, closer to the subject.", [
          { title: "Pop-up diffusion disc", text: "Hold between the sun and the subject outdoors. Turns hard sun into soft light instantly; ask a helper or use a clamp." },
          { title: "Flash with a small softbox", text: "Mount a small softbox on an off-camera flash, 20–30 cm from the subject, slightly above." },
          { title: "Translucent sheet", text: "A sheet of translucent plastic or baking parchment in front of a flash or window. Tape to a frame." },
          { title: "Light tent", text: "Encloses small objects in diffusion for shadowless light. Good for reflective subjects; can look flat on textured ones." },
          { title: "Two-sided diffusion", text: "Light through diffusion on one side, a white card on the other for gentle shadows that still show form." },
          { title: "Backlit diffusion", text: "Place diffusion behind a translucent subject such as a leaf or petal and light it from behind to reveal structure." }
        ], { kicker: "Add-on" })
      ] }
    ]
  }
];
