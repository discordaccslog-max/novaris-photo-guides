import { shotlist, checklist, worksheet, table, cards, templates, settings, setup, questionnaire, text, storyboard, rows, el, beam } from "./helpers.js";

const camera = (notes, x = 180) => el("camera", "camera", x, 262, "Camera", "Your shooting position.", notes);
const backlitSetup = (title, subjectLabel) => setup(title, "Low sun behind the subjects for warm rim light, with a reflector lifting faces.", [
  el("sun", "sun", 236, 36, "Sun (low, behind)", "Rim light on hair and shoulders.", "Shoot in the hour before sunset or after sunrise. Keep the sun behind and slightly to one side."),
  el("subject", "subject", 180, 134, subjectLabel, "Facing the camera, backs to the sun.", "Turn slightly so the sun catches one side of the hair. Watch for squinting if the reflector is too bright."),
  el("reflector", "reflector", 104, 206, "Reflector", "Bounces sunlight onto faces.", "Low and in front, angled up. White for natural fill; gold for extra warmth."),
  camera("Expose for faces; the sky will be brighter. Use a lens hood or shade the lens to control flare.", 196)
], [beam("sun", "subject"), beam("reflector", "subject", "bounce")], ["Spot or center-weighted metering on faces avoids underexposure.", "Lens flare can be part of the look: shoot some frames with and some without."]);

export default [
  /* ------------------------------------------------------------------ */
  {
    slug: "engagement-session-guide",
    name: "Engagement Session Guide",
    subtitle: "An engagement shot list, posing prompts, a golden-hour setup, settings, and a session planning sheet.",
    intro: [
      "Engagement sessions work best when the couple stops performing and starts interacting. A clear plan for locations and light, plus prompts that give people something to do rather than a pose to hold, does most of the work.",
      "Schedule outdoor sessions around golden hour where you can, and plan two locations or outfits for variety."
    ],
    blocks: [
      shotlist("Engagement session shot list", "From easy to more personal, so the couple warms up as you go.", [
        { title: "Easy start", items: ["Walking together, wide", "Side by side, natural smiles to camera", ["Laughing together", "Use a prompt from the prompt cards."]] },
        { title: "Closer", items: ["Facing each other, foreheads close", "Back-to-chest embrace", "Seated together", "Over-the-shoulder look to camera", "Almost-kiss"] },
        { title: "Details and solos", items: [["Ring close-up on hands", "Clean nails and a simple background."], "Each person alone", "Hands intertwined"] },
        { title: "Golden hour", items: ["Backlit silhouette or rim-lit embrace", "Wide scene with the couple small in frame"] }
      ], { fields: ["Couple", "Date"] }),
      cards("Posing prompts", "Prompts create movement and real expressions. Give one, then shoot continuously.", [
        { title: "Whisper", text: "One partner whispers their first impression of the other. Shoot the reaction." },
        { title: "Slow walk", text: "Walk toward me holding hands, slower than feels natural, and look at each other halfway." },
        { title: "Nose to nose", text: "Bring noses together and close eyes. Count to five slowly before moving." },
        { title: "Spin", text: "One partner spins the other, then pulls them close." },
        { title: "Forehead kiss", text: "A kiss on the forehead; the other closes their eyes." },
        { title: "Tell a story", text: "Ask them to tell each other how they met while you shoot from a distance." },
        { title: "Piggyback", text: "Good for a playful couple and a natural laugh." },
        { title: "Sit and lean", text: "Sit close on a step or bench and lean heads together." }
      ]),
      backlitSetup("Golden hour backlight with reflector", "Couple"),
      settings("Engagement settings", "Starting points for common engagement situations.", rows([
        ["Golden hour backlight", "f/2.8", "1/500", "200", "Expose for faces."],
        ["Open shade portraits", "f/2.8", "1/500", "200–400", "Warm white balance slightly."],
        ["Walking toward camera", "f/4", "1/500", "Auto", "Continuous autofocus."],
        ["Ring close-up", "f/4", "1/250", "400", "Stop down for more of the ring sharp."],
        ["After sunset, blue hour", "f/2", "1/200", "1600", "Add a little flash or a reflector."]
      ]), ["Two people side by side: f/2.8 or deeper so both faces are sharp.", "Keep the shutter at 1/250 or faster for movement prompts."]),
      worksheet("Engagement session plan", "Plan locations, light, and the couple's story.", ["Couple's names", "Session date", "Start time (golden hour)", "Sunset time", "Location 1", "Location 2", "Outfit 1", "Outfit 2", "+How they met and what they enjoy together", "+Must-have shots", "+Notes"]),
      checklist("Session day checklist", "Before you meet the couple.", [
        { title: "Kit", items: ["Fast portrait lens", "Reflector", "Spare batteries and cards", "Lens cloth for the ring close-up"] },
        { title: "Plan", items: ["Sunset time checked", "Locations scouted for light direction", "Permits checked where needed", "Prompts chosen"] }
      ])
    ],
    addons: [
      { name: "Couple questionnaire", subtitle: "Send before the session to plan locations and prompts.", blocks: [
        questionnaire("Engagement couple questionnaire", "Your answers help plan a session that feels like you. Please return it before your session date.", [
          "Your names, and how you'd like to be addressed", "Best contact details for each of you", "How did you meet?", "What do you love doing together?", "Places that mean something to you", "Preferred style: relaxed, romantic, playful, or classic?", "Outfits you're planning", "Will you bring pets or props?", "How will you use the photos (save-the-dates, wedding website, prints)?", "Anything you feel self-conscious about that we should know?", "Anything else we should know"
        ])
      ] },
      { name: "Prompt card deck", subtitle: "Sixteen couple prompts to cut out or keep on hand.", blocks: [
        cards("Prompt card deck", "Give one prompt at a time and keep shooting through the reaction.", [
          { title: "First impression", text: "Whisper your first impression of each other." }, { title: "Slow dance", text: "Dance with no music, slowly." },
          { title: "Count the freckles", text: "Look closely at each other's faces." }, { title: "Secret", text: "Tell your partner a secret; partner reacts." },
          { title: "Walk and bump", text: "Walk toward me and bump hips every few steps." }, { title: "Cuddle up", text: "Hug like it's cold outside." },
          { title: "Forehead touch", text: "Foreheads together, eyes closed." }, { title: "Lift", text: "Lift your partner off the ground." },
          { title: "Tickle", text: "One gentle tickle; quick reaction." }, { title: "Look back", text: "Walk away holding hands, then look back over your shoulders." },
          { title: "Favorite memory", text: "Describe your favorite trip together." }, { title: "Nose kiss", text: "Kiss on the nose." },
          { title: "Sit and lean", text: "Sit together, lean heads in." }, { title: "Run", text: "Run toward me, hand in hand." },
          { title: "Vow rehearsal", text: "Say one line you might use in your vows." }, { title: "Stillness", text: "Hold each other and breathe slowly for five seconds." }
        ], { kicker: "Add-on", cols: 3 })
      ] },
      { name: "Location scouting form", subtitle: "Record each location's light, access, and best spots.", blocks: [
        worksheet("Location scouting form", "Fill in for each location on a scouting visit.", ["Location name", "Date visited", "Address or map reference", "Parking and access", "Permit needed?", "Opening hours", "Light at session time", "Sun direction at sunset", "+Best spots and backgrounds", "+Distractions to avoid (crowds, signs, construction)", "+Backup spot for bad weather", "+Notes"], { kicker: "Add-on" })
      ] },
      { name: "Outfit planning sheet", subtitle: "Plan coordinated outfits for two looks.", blocks: [
        worksheet("Outfit planning sheet", "Coordinate colors and textures rather than matching exactly.", ["Partner 1, outfit 1", "Partner 2, outfit 1", "Partner 1, outfit 2", "Partner 2, outfit 2", "Color palette", "Shoes for walking", "+Accessories and layers", "+Notes: avoid large logos, busy patterns, and neon colors"], { kicker: "Add-on" })
      ] }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "maternity-portrait-guide",
    name: "Maternity Portrait Guide",
    subtitle: "A maternity shot list, posing notes, a window-light setup, settings, and a session planning sheet.",
    intro: [
      "Maternity sessions are usually scheduled between about 28 and 34 weeks, when the bump shows clearly and the parent-to-be is still comfortable moving. Comfort sets the pace: plan seating, breaks, water, and a warm space.",
      "Poses in this guide are gentle and can be adapted. Always check with the client what feels comfortable."
    ],
    blocks: [
      shotlist("Maternity session shot list", "Calm frames first; add partner and siblings once the client is relaxed.", [
        { title: "Solo portraits", items: ["Profile with hands framing the bump", "Three-quarter view, looking down at the bump", "Looking at the camera, relaxed smile", "Seated portrait"] },
        { title: "With partner", items: ["Partner behind, hands on bump", "Facing each other, foreheads close", "Partner kneeling, ear to the bump"] },
        { title: "Family and details", items: ["Siblings with hands on the bump", "Ultrasound image or baby shoes in hands", "Close-up of hands and bump"] }
      ], { fields: ["Client", "Weeks"] }),
      cards("Posing notes", "Small adjustments make maternity poses more flattering and comfortable.", [
        { title: "Profile reveals the bump", text: "Turn the body sideways to the camera to show the bump's shape; turn the face toward the camera or keep it in profile." },
        { title: "Hands: one above, one below", text: "One hand on top of the bump and one underneath frames it naturally. Keep fingers relaxed and slightly apart." },
        { title: "Weight on the back foot", text: "Weight back with the front knee soft creates a gentle curve and helps balance." },
        { title: "Chin forward", text: "Bring the chin slightly forward and down to define the jawline, especially when looking down." },
        { title: "Seated comfort", text: "Use a stool or chair rather than the floor; getting up from the floor can be hard later in pregnancy." },
        { title: "Breaks", text: "Offer a break every 15 minutes, with water and somewhere to sit." }
      ]),
      setup("Window light maternity portrait", "Soft side light from a large window shapes the bump in profile.", [
        el("window", "window", 46, 132, "Window", "Soft directional light.", "A large window without direct sun. Sheer curtains soften it further."),
        el("subject", "subject", 176, 136, "Client (in profile)", "Side-on to the window.", "Turn the bump toward the window so light falls along its curve."),
        el("reflector", "reflector", 262, 152, "Reflector", "Fill on the shadow side.", "Move closer for softer shadows. Remove it for a moodier look."),
        el("backdrop", "backdrop", 180, 44, "Plain backdrop or wall", "Simple background.", "A neutral wall or backdrop 1.5 m behind keeps attention on the subject."),
        camera("Shoot from the shadow side for more shape, or from the window side for flatter light.", 196)
      ], [beam("window", "subject"), beam("reflector", "subject", "bounce")], ["Turn off room lights to avoid mixed color.", "A flowing dress catches window light beautifully in profile."]),
      settings("Maternity settings", "Starting points for common maternity situations.", rows([
        ["Window light, solo", "f/2.8", "1/200", "400–800", "Raise ISO before lowering shutter."],
        ["Open shade outdoors", "f/2.8", "1/500", "200", "Warm white balance slightly."],
        ["Golden hour backlight", "f/2.8", "1/500", "200", "Expose for skin."],
        ["Studio, one softbox", "f/8", "1/160", "100", "Flash sets exposure."],
        ["Couple, two faces", "f/4", "1/250", "400", "Deeper focus for both faces."]
      ])),
      worksheet("Maternity session plan", "Plan around comfort, light, and the client's style.", ["Client name", "Partner and children joining", "Due date", "Weeks at session", "Session date and time", "Location", "Outfits and fabrics", "Comfort needs", "+Must-have shots", "+Style: airy, classic, or moody", "+Notes"]),
      checklist("Session comfort checklist", "Before the client arrives.", [
        { title: "Space", items: ["Room warm enough for lighter clothing", "Chair or stool for seated poses", "Water and snacks", "Private changing space"] },
        { title: "Kit", items: ["Reflector", "Flowing fabric or wraps if offered", "Clips to adjust clothing at the back"] }
      ])
    ],
    addons: [
      { name: "Wardrobe planning sheet", subtitle: "Plan outfits that show the bump and suit the location.", blocks: [
        worksheet("Wardrobe planning sheet", "Fitted or flowing pieces both work; avoid busy patterns and logos.", ["Outfit 1", "Outfit 2", "Outfit 3", "Color palette", "Partner's outfit", "Children's outfits", "Shoes", "Jewelry and accessories", "+Fabric notes: fitted, flowing, sheer, knit", "+Notes"], { kicker: "Add-on" })
      ] },
      { name: "Client questionnaire", subtitle: "Send before the session.", blocks: [
        questionnaire("Maternity client questionnaire", "Your answers help plan a comfortable session. Please return it a week before your session.", [
          "Your name, and your partner's name if joining", "Best contact details", "Due date", "Who will join the session (partner, children, pets)?", "Preferred location: home, studio, or outdoors", "Style you like: airy, classic, moody, or relaxed", "Outfits you're considering", "Anything you'd like to include (ultrasound, baby shoes, a name sign)?", "Any comfort or mobility needs?", "How will you use the photos?", "Anything else we should know"
        ])
      ] },
      { name: "Golden hour location worksheet", subtitle: "Plan an outdoor maternity session around golden hour.", blocks: [
        worksheet("Golden hour location worksheet", "Use a sun tool to find sunset and golden hour for the date.", ["Location", "Date", "Sunset time", "Golden hour starts", "Start the session at", "Sun direction", "Where to place the client", "Shade nearby for breaks", "+Backgrounds: fields, trees, water, paths", "+Walking distance and terrain", "+Backup plan if cloudy"], { kicker: "Add-on" })
      ] }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "concert-live-music-guide",
    name: "Concert & Live Music Guide",
    subtitle: "A live music shot list, shooting positions, low-light settings, and a venue access checklist.",
    intro: [
      "Live music changes fast and the light is often dim, colored, and unpredictable. Venues also set rules on where you can stand and for how long; many limit photographers to the first few songs.",
      "Confirm access with the venue or artist team before the show, and plan your shots around the set list."
    ],
    blocks: [
      shotlist("Live music shot list", "In rough order across a set. Get the key frames early in case access is limited.", [
        { title: "Opening songs", items: ["Lead vocalist, wide with the stage", "Lead vocalist, tight on the face", "Each band member individually", "Guitarist or soloist during a solo"] },
        { title: "Mid-set", items: ["Full band from the side or back of the room", "Crowd from the stage side (if allowed)", "Hands, instruments, and details", "Backlit silhouette with haze"] },
        { title: "Atmosphere", items: ["Crowd reaction at a big moment", "Venue exterior and signage", "Setlist on the stage floor"] }
      ], { fields: ["Artist", "Venue"] }),
      cards("Shooting positions", "Where to stand and what each position gives you.", [
        { title: "Photo pit, center", text: "Faces and expressions straight on. Busy with other photographers; work quickly and stay low so you don't block others." },
        { title: "Pit, side", text: "Profiles and instrument detail; drummer often visible from here. Good for lead lines across the stage." },
        { title: "Side of stage", text: "Only with permission. Shows the performer and crowd together." },
        { title: "Back of the room", text: "Full stage and lighting design. A longer lens isolates the performer." },
        { title: "Balcony", text: "A higher angle over the crowd. Shows scale and atmosphere." },
        { title: "Low angle", text: "From the pit floor looking up, performers look larger than life. Watch for microphone stands hiding faces." }
      ]),
      settings("Low-light concert settings", "Starting points. Stage light changes constantly; check the histogram often.", rows([
        ["Small club, dim stage", "f/1.8–f/2", "1/250", "3200–6400", "Fast prime; spot meter on faces."],
        ["Mid-size venue", "f/2.8", "1/320", "3200", "Fast zoom for flexibility."],
        ["Large stage, bright light", "f/2.8", "1/500", "1600", "Freeze jumps and hair."],
        ["Drummer and fast movement", "f/2.8", "1/500", "6400", "Raise ISO before slowing shutter."],
        ["Intentional motion blur", "f/4", "1/30", "800", "Pan with the performer."],
        ["Strong red or blue light", "", "", "", "Underexpose slightly; colored light clips easily."]
      ]), ["Flash is usually not allowed; check with the venue.", "Shoot in raw to recover mixed and colored lighting."]),
      checklist("Venue access checklist", "Confirm before the show.", [
        { title: "Access", items: ["Photo pass or guest list confirmed", "Name of the contact on the night", "Songs allowed in the pit", "Where you may stand after the pit"] },
        { title: "Rules", items: ["Flash policy", "Lens size limits", "Video policy", "Delivery requirements and deadlines"] },
        { title: "Kit", items: ["Fast lenses", "Ear protection", "Spare batteries and cards", "Small bag that fits the pit"] }
      ])
    ],
    addons: [
      { name: "Low-light pocket settings card", size: "pocket", subtitle: "Concert settings on a 4 × 6 in card.", blocks: [
        settings("Concert settings", "Starting points.", rows([
          ["Small club", "f/1.8–2", "1/250", "3200–6400", ""],
          ["Mid-size venue", "f/2.8", "1/320", "3200", ""],
          ["Big stage", "f/2.8", "1/500", "1600", ""],
          ["Drummer", "f/2.8", "1/500", "6400", ""],
          ["Motion blur", "f/4", "1/30", "800", "Pan"]
        ]), ["Spot meter on faces.", "Underexpose under red or blue light.", "Raw format for mixed light."])
      ] },
      { name: "Venue access checklist", subtitle: "Everything to confirm before shooting a show.", blocks: [
        checklist("Venue access checklist", "Confirm with the venue, promoter, or artist team.", [
          { title: "Before the day", items: ["Photo pass approved", "Contact name and phone for the night", "Arrival time and entrance", "Songs allowed in the pit", "Position after the pit", "Flash and lens rules", "Video rules", "Image delivery deadline and format", "Usage terms for the images"] },
          { title: "On the night", items: ["Pass collected", "Earplugs in", "Kit fits the pit rules", "Know your exit route from the pit"] }
        ], { kicker: "Add-on", fields: ["Artist", "Venue", "Date", "Contact"] })
      ] },
      { name: "Set-list shot planner", subtitle: "Plan key frames song by song.", blocks: [
        table("Set-list shot planner", "Ask for the set list or check recent shows to plan big moments.", ["#", "Song", "Featured", "Key moment", "Position", "Done"], Array.from({ length: 16 }, (_, i) => [String(i + 1), "", "", "", "", ""]), { kicker: "Add-on", widths: [0.05, 0.27, 0.16, 0.26, 0.16, 0.1] })
      ] }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "video-b-roll-shot-list-guide",
    name: "Video B-Roll & Shot List Guide",
    subtitle: "B-roll shot lists, camera movement reference, video settings, and a project brief for short video projects.",
    intro: [
      "B-roll is the supporting footage that shows what a story is about: the place, the hands at work, the details. Well-planned b-roll makes editing faster because you have the right variety of shots to cut between.",
      "The core habit: for every subject, film a wide, a medium, and a close-up, plus at least one shot with movement."
    ],
    blocks: [
      shotlist("B-roll shot list", "Film each subject in a sequence so the edit has options.", [
        { title: "Establishing", items: ["Wide exterior of the location", "Signage or entrance", "Wide interior with people working"] },
        { title: "Sequences (for each activity)", items: [["Wide: the whole action", "Hold each shot for at least 8–10 seconds."], "Medium: the person and what they're doing", "Close-up: hands and tools", "Extreme close-up: a detail", "Over-the-shoulder point of view"] },
        { title: "Cutaways and movement", items: ["Faces reacting or concentrating", "Slow push-in on the main subject", "Slide or pan across details", "Reveal from behind an object"] }
      ], { fields: ["Project", "Location"] }),
      cards("Camera movement reference", "Choose movements that suit the story; keep each one smooth and deliberate.", [
        { title: "Static", text: "Tripod, no movement. Lets the action carry the shot. The most useful shot type for editing." },
        { title: "Push-in", text: "Slowly move toward the subject to add emphasis. Works on a slider, gimbal, or by walking carefully." },
        { title: "Pull-out", text: "Move away to reveal context. Good for endings." },
        { title: "Pan and tilt", text: "Rotate the camera across a scene or up a subject. Keep the speed even; start and end on a composed frame." },
        { title: "Slide", text: "Lateral movement with foreground passing the lens adds depth." },
        { title: "Handheld follow", text: "Follows a person through a space. Use a wider lens and stabilization." }
      ]),
      settings("Video settings", "A common rule of thumb is a shutter speed about double the frame rate (the 180° shutter).", rows([
        ["24 or 25 fps, natural motion", "f/2.8–f/5.6", "1/50", "Base", "Use ND outdoors to keep the shutter."],
        ["30 fps", "f/2.8–f/5.6", "1/60", "Base", "Common for online video."],
        ["60 fps for slow motion", "f/2.8", "1/125", "Base–800", "Slowed to 24/30 in editing."],
        ["Bright sun", "f/4", "1/50", "Base", "ND filter, about 4–6 stops."],
        ["Indoors, low light", "f/2", "1/50", "800–3200", "Add light before raising ISO further."]
      ]), ["Lock white balance; auto white balance shifts during a shot.", "Record room tone for 30 seconds at each location for the edit."]),
      worksheet("Video project brief", "Agree the brief with the client before filming.", ["Client", "Project name", "Shoot date", "Delivery date", "Final length", "Aspect ratio and frame rate", "Where it will be shown", "Music and voiceover", "+Story or key message", "+People to film", "+Must-have shots", "+Notes"]),
      checklist("Shoot day checklist", "Before you roll.", [
        { title: "Camera", items: ["Frame rate and shutter set", "White balance locked", "Batteries charged, cards formatted", "ND filters"] },
        { title: "Sound and support", items: ["Microphone tested with headphones", "Tripod and slider or gimbal", "Room tone recorded"] }
      ])
    ],
    addons: [
      { name: "Storyboard sheets", subtitle: "Sixteen-by-nine storyboard frames for planning shots.", blocks: [storyboard("Storyboard sheets", "Sketch each shot, then note the shot type, movement, and duration.", 6, 3)] },
      { name: "Audio recording checklist", subtitle: "Clean sound checks for interviews and b-roll.", blocks: [
        checklist("Audio recording checklist", "Bad audio is harder to fix than bad video. Check every item.", [
          { title: "Before recording", items: ["Microphone batteries fresh", "Recorder or camera levels set: peaks around −12 dB", "Headphones on and monitoring", "Air conditioning, fridges, and fans off where possible", "Phones on silent"] },
          { title: "Lavalier microphones", items: ["Hidden mic away from clothing rustle", "Cable secured with tape", "Test a few sentences and listen back"] },
          { title: "Shotgun microphones", items: ["Just out of frame, pointed at the mouth", "Wind protection outdoors"] },
          { title: "After", items: ["Room tone recorded for 30 seconds", "Backup recording saved"] }
        ], { kicker: "Add-on" })
      ] },
      { name: "Interview setup diagrams", subtitle: "Two common interview lighting setups.", blocks: [
        setup("Single-camera interview", "A key light, fill, and background light, with the subject looking just off camera.", [
          el("bg", "backdrop", 180, 44, "Background", "Depth behind the subject.", "Keep the subject 2 m or more from the background."),
          el("bglight", "light", 286, 66, "Background light", "Separates subject from background.", "A small light or practical lamp on the background adds depth."),
          el("key", "softbox", 96, 120, "Key light (softbox)", "Main light on the face.", "On the side the subject is facing, 45° and slightly above eye level."),
          el("subject", "subject", 180, 140, "Interviewee", "Looking at the interviewer.", "The interviewer sits beside the camera on the key-light side."),
          el("fill", "reflector", 262, 168, "Fill reflector", "Softens shadows.", "Low fill keeps a cinematic look; more fill is flatter."),
          camera("Medium close-up at eye level. Record a backup audio track.")
        ], [beam("key", "subject"), beam("fill", "subject", "bounce"), beam("bglight", "bg")], ["Look for a gentle shadow on the far side of the face."]),
        setup("Two-camera interview", "A second camera gives a cutaway angle for edits.", [
          el("key", "softbox", 96, 120, "Key light", "Main light.", "Same placement as the single-camera setup."),
          el("subject", "subject", 180, 140, "Interviewee", "Speaks toward camera A's side.", "Keep the subject still in a fixed chair."),
          el("camA", "camera", 150, 254, "Camera A (medium)", "Main angle.", "Eye level, close to the interviewer's eyeline."),
          el("camB", "camera", 270, 214, "Camera B (close-up)", "Cutaway angle.", "Tighter framing from about 30° off. Match exposure and white balance to camera A."),
          el("fill", "reflector", 262, 136, "Fill reflector", "Softens shadows.", "Keep it out of camera B's frame.")
        ], [beam("key", "subject"), beam("fill", "subject", "bounce")], ["Clap or sync both cameras at the start of each take."])
      ] },
      { name: "Edit log template", subtitle: "Log clips and selects for a faster edit.", blocks: [
        table("Edit log", "Note good takes as you review footage.", ["Clip", "Timecode in", "Out", "Description", "Rating", "Use for"], Array.from({ length: 18 }, () => ["", "", "", "", "", ""]), { kicker: "Add-on", widths: [0.12, 0.13, 0.11, 0.36, 0.1, 0.18] })
      ] }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "newborn-baby-session-guide",
    name: "Newborn & Baby Session Guide",
    subtitle: "Newborn and baby shot lists, a session timeline, a window-light setup, safety references, and a planning sheet.",
    intro: [
      "Newborn sessions are usually scheduled in the first two weeks, when babies sleep deeply, and run at the baby's pace with time for feeding and settling. Older baby sessions are timed around milestones such as sitting up.",
      "Safety always comes before any pose. Keep a spotter's hands within reach whenever a baby is posed, never leave a baby unattended on any surface, and create complex poses as composites rather than in a single frame."
    ],
    blocks: [
      text("Newborn safety principles", "Read before every session. These apply to every pose in this guide.", [], [
        "A parent or assistant acts as spotter, with hands within reach of the baby at all times.",
        "Never leave a baby unattended on any surface, prop, or bean bag, even for a moment.",
        "Pose babies low to the floor; avoid raised props unless a spotter's hands are on the baby.",
        "Poses that would be unsafe if held (such as a baby supporting their head on their hands) are made as composites: photograph the baby with a spotter's hands supporting them, then combine frames in editing.",
        "Keep the room warm for a baby without clothes, and watch for signs of being too hot or too cold.",
        "Follow the baby's cues; stop for feeding, changing, and comfort whenever needed.",
        "Wash hands, keep props and fabrics clean, and never place anything over a baby's face or around the neck."
      ], { kicker: "Safety" }),
      shotlist("Newborn shot list", "Sleepy, wrapped frames first; family frames while the baby is calm.", [
        { title: "Wrapped and settled", items: ["Wrapped, on the back, full body", "Wrapped, close-up of face", "Side-lying, wrapped"] },
        { title: "Details", items: ["Toes and feet", "Hands and fingers", "Lips and eyelashes", "Hair and ears"] },
        { title: "Family", items: ["Baby in a parent's arms, looking at the baby", "Parents together with the baby", "Siblings with the baby (seated, supported)", "Parent's hands holding the baby's feet"] }
      ], { fields: ["Baby", "Age (days)"] }),
      setup("Window light newborn setup", "Soft side light from a window, with the baby on a low, supported surface.", [
        el("window", "window", 46, 140, "Window", "Soft directional light.", "Indirect daylight only; no direct sun on the baby. Sheer curtains if the light is strong."),
        el("baby", "subject", 170, 148, "Baby on posing surface", "Head toward the light.", "A low surface or bean bag on the floor, with the baby's head angled toward the window for soft shadows."),
        el("spotter", "subject", 228, 112, "Spotter", "Hands within reach.", "A parent or assistant beside the baby at all times, ready to support."),
        el("reflector", "reflector", 256, 178, "Reflector", "Fill on the shadow side.", "Lifts shadows under the chin and nose."),
        camera("Shoot from above the head and from the side. Keep the camera strap secure over the baby.", 196)
      ], [beam("window", "baby"), beam("reflector", "baby", "bounce")], ["Turn off overhead lights for consistent color.", "A small heater, used safely away from the baby, keeps the room warm."]),
      table("Newborn session timeline", "A typical three-hour newborn session. Times flex around the baby.", ["Time", "Activity", "Notes"], [
        ["0:00", "Arrival, settle, feed", "Parents relax; baby feeds to sleep."],
        ["0:30", "Wrapped poses", "Easiest to settle; several color wraps."],
        ["1:15", "Details", "Toes, hands, lips while baby sleeps deeply."],
        ["1:40", "Feed and change break", ""],
        ["2:00", "Family and siblings", "Siblings first while their attention lasts."],
        ["2:40", "Final wrapped frame", "Repeat a favorite set-up if time allows."],
        ["3:00", "Finish", "Explain next steps and delivery."]
      ], { kicker: "Planner", widths: [0.12, 0.38, 0.5] }),
      settings("Newborn settings", "Natural light starting points. Avoid flash pointed at the baby.", rows([
        ["Window light, wrapped baby", "f/2.8–f/4", "1/200", "400–800", "Raise ISO before lowering shutter."],
        ["Details: toes and lips", "f/4", "1/200", "800", "Deeper focus for small details."],
        ["Family in arms", "f/4", "1/250", "800", "Two or three faces in focus."],
        ["Lifestyle at home", "f/2", "1/250", "1600", "Turn off mixed room lights."]
      ])),
      worksheet("Newborn session plan", "Fill in with the parents before the session.", ["Baby's name", "Date of birth", "Parents' names", "Siblings and pets", "Session date", "Location: studio or home", "Feeding: breast, bottle, or both", "Room temperature set", "+Color palette and wraps", "+Must-have shots and keepsakes", "+Notes"])
    ],
    addons: [
      { name: "Safety and posing checklist cards", subtitle: "Safety checks to run before and during every newborn session.", blocks: [
        cards("Safety and posing checklist cards", "Keep visible during sessions.", [
          { title: "Before the session", text: "Room warm. Hands washed. Props and fabrics clean. Posing surface low and stable. Spotter briefed." },
          { title: "Every pose", text: "Spotter's hands within reach. Baby breathing comfortably. Nothing near the face or neck. Baby's weight supported." },
          { title: "Composite poses", text: "Photograph with a spotter's hands supporting the baby. Take a second frame with hands moved. Combine in editing." },
          { title: "Props", text: "Props on the floor, weighted, and padded. A spotter holds any prop with a baby in it." },
          { title: "Temperature", text: "Watch for flushed skin or cold hands. Pause and dress or cool the baby as needed." },
          { title: "Baby's cues", text: "Stop for feeding, changing, and settling. Never force a pose." }
        ], { kicker: "Add-on" })
      ] },
      { name: "Parent prep questionnaire", subtitle: "Send to parents to prepare for the session.", blocks: [
        questionnaire("Parent preparation questionnaire", "Your answers help plan a calm, safe session. Please return it before your session date.", [
          "Parents' names and best contact details", "Baby's name and date of birth (or due date)", "Will siblings or pets join?", "How is the baby fed: breast, bottle, or both?", "Does your baby have any health concerns we should know about?", "Studio or at home?", "Color palette or style you like", "Keepsakes to include (blanket, toy, ultrasound, name sign)", "Any cultural or family traditions to include?", "Must-have photos", "Anything else we should know"
        ])
      ] },
      { name: "Session timeline template", subtitle: "Plan the session's flow around feeding and settling.", blocks: [
        table("Session timeline template", "Plan the order of set-ups. Times flex with the baby.", ["Time", "Set-up", "Wraps or props", "Who is in frame", "Done"], Array.from({ length: 14 }, () => ["", "", "", "", ""]), { kicker: "Add-on", widths: [0.12, 0.3, 0.24, 0.24, 0.1] })
      ] },
      { name: "Prop and wrap planning sheet", subtitle: "Plan wraps, props, and colors for each set-up.", blocks: [
        table("Prop and wrap planning sheet", "Choose a palette, then plan each set-up.", ["Set-up", "Wrap or outfit", "Color", "Prop or surface", "Notes"], Array.from({ length: 10 }, (_, i) => [String(i + 1), "", "", "", ""]), { kicker: "Add-on", widths: [0.1, 0.25, 0.15, 0.25, 0.25] }),
        worksheet("Palette notes", "Keep each gallery to a calm, coordinated palette.", ["Main palette", "Accent color", "+Parents' clothing suggestions", "+Notes"], { kicker: "Add-on" })
      ] }
    ]
  }
];
