/* Portrait Session Guide — content for the Novaris Field Kit. */
export default {
  slug: "portrait-session-guide",
  name: "Portrait Session Guide",
  tabs: ["shotlists", "lighting", "poses", "settings", "planning"],

  shotlists: [
    {
      id: "headshot",
      title: "Headshot session",
      description: "Individual business or profile headshots, in shooting order.",
      sections: [
        { title: "Set up", items: [
          { text: "Test frame on a stand-in or your hand for light and exposure" },
          { text: "Confirm crop and background with the client before starting" }
        ] },
        { title: "Core frames", items: [
          { text: "Straight on, chin slightly forward and down", note: "Ask them to push the forehead toward the lens a little." },
          { text: "Three-quarter turn to camera left" },
          { text: "Three-quarter turn to camera right" },
          { text: "Tight crop: top of forehead to chin" },
          { text: "Relaxed, natural smile" },
          { text: "Neutral, serious expression" }
        ] },
        { title: "Variations", items: [
          { text: "Glasses on and off (if worn)", note: "Tilt the frames slightly down to avoid reflections." },
          { text: "Wardrobe change: repeat the core frames" },
          { text: "Half-length frame for website or bio pages" },
          { text: "Environmental frame in the workspace" }
        ] },
        { title: "Wrap up", items: [
          { text: "Review favorites with the client on screen" },
          { text: "Note chosen frames and delivery format" }
        ] }
      ]
    },
    {
      id: "family",
      title: "Family session",
      description: "Families with children, organized so energy is used on the important frames first.",
      sections: [
        { title: "Warm up", items: [
          { text: "Candid frames while everyone settles", note: "Let children explore; it buys cooperation later." },
          { text: "Wide frame of the location with the family small in it" }
        ] },
        { title: "Full group first", items: [
          { text: "Full group, everyone looking at camera" },
          { text: "Full group interacting: tickles, whispers, a shared joke" },
          { text: "Full group seated or at ground level" },
          { text: "Walking toward camera together" }
        ] },
        { title: "Combinations", items: [
          { text: "Parents together" },
          { text: "Each parent with each child" },
          { text: "Siblings together" },
          { text: "Grandparents with grandchildren (if present)" }
        ] },
        { title: "Individuals and details", items: [
          { text: "Each child alone" },
          { text: "Hands together and small details" },
          { text: "Final full group as a safety frame" }
        ] }
      ]
    },
    {
      id: "couples",
      title: "Couples session",
      description: "Engagement, anniversary, or couples portraits, moving from easy to more personal frames.",
      sections: [
        { title: "Easy start", items: [
          { text: "Walking together, wide" },
          { text: "Side by side, natural smiles to camera" },
          { text: "Candid laughter (use a prompt)", note: "For example: whisper your first impression of each other." }
        ] },
        { title: "Closer", items: [
          { text: "Facing each other, foreheads close" },
          { text: "Back-to-chest embrace" },
          { text: "Seated together" },
          { text: "Over-the-shoulder looks to camera" }
        ] },
        { title: "Details and solos", items: [
          { text: "Close-up of hands (and ring, if any)" },
          { text: "Each person on their own" },
          { text: "Wide scene with the couple small in the frame" }
        ] }
      ]
    }
  ],

  lighting: [
    {
      id: "window",
      title: "Window light at 45°",
      summary: "Soft, directional daylight from a single window with a reflector for fill.",
      elements: [
        { id: "window", type: "window", x: 46, y: 130, label: "Window", role: "Main light source: soft, directional daylight.", notes: "Place the subject about 1–2 m from the window. Closer means softer, brighter light that falls off faster across the face. Avoid direct sun on the subject; a sheer curtain or a window facing away from the sun gives the most even light." },
        { id: "subject", type: "subject", x: 176, y: 138, label: "Subject", role: "Faces roughly 45° toward the window.", notes: "Turn the face slowly toward the window until a catchlight appears in both eyes. Turning further toward the window flattens the light; turning away adds shadow to the far cheek." },
        { id: "reflector", type: "reflector", x: 262, y: 150, rot: 100, label: "Reflector (white)", role: "Fill: bounces window light into the shadow side.", notes: "Start about 1 m from the subject on the side away from the window, angled to catch the window light. Move it closer to lift shadows, or remove it for more contrast." },
        { id: "camera", type: "camera", x: 196, y: 262, label: "Camera", role: "Between the window axis and the reflector.", notes: "Shooting from slightly toward the shadow side gives more shape; from the window side gives flatter light. Keep the lens at eye level or a little above." }
      ],
      beams: [{ from: "window", to: "subject" }, { from: "reflector", to: "subject", kind: "bounce" }],
      tips: ["Turn off overhead room lights to avoid mixed color.", "Expose for the highlight side of the face."]
    },
    {
      id: "open-shade",
      title: "Open shade",
      summary: "The subject at the edge of shade, lit by the open sky in front of them.",
      elements: [
        { id: "shade", type: "shade", x: 180, y: 92, label: "Shade", role: "Blocks harsh direct sunlight.", notes: "Place the subject just inside the edge of the shade, facing out toward open sky. Too deep in the shade and the light turns flat and dull." },
        { id: "background", type: "backdrop", x: 180, y: 44, label: "Background (in shade)", role: "Keeps background brightness close to the subject's.", notes: "A background that is also in shade avoids blown highlights behind the subject. A sunlit background one or two stops brighter can work for an airy look; expose for skin." },
        { id: "subject", type: "subject", x: 180, y: 140, label: "Subject", role: "Faces out toward the open sky.", notes: "Look for catchlights. If you can't see them, move the subject toward the shade edge or turn them toward the brightest part of the sky." },
        { id: "sky", type: "sky", x: 300, y: 236, label: "Open sky", role: "A very large, soft light source in front of the subject.", notes: "The brightest part of the sky sets the light direction. A bright wall or pavement in front of the subject adds more fill; colored surfaces add a color cast." },
        { id: "camera", type: "camera", x: 168, y: 262, label: "Camera", role: "In the open, facing into the shade.", notes: "Stand in the light looking in. Watch for bright patches of sun on the background, which draw the eye." }
      ],
      beams: [{ from: "sky", to: "subject" }],
      tips: ["Set white balance for shade, or warm it slightly; open shade is cool.", "Avoid dappled light falling across faces."]
    },
    {
      id: "backlight",
      title: "Backlight with reflector",
      summary: "Low sun behind the subject for rim light, with a reflector lifting the face.",
      elements: [
        { id: "sun", type: "sun", x: 228, y: 34, label: "Sun (behind subject)", role: "Rim light on hair and shoulders.", notes: "Keep the sun behind and slightly to one side of the subject, ideally low in the sky. Use a lens hood or shade the lens with a hand or card outside the frame to control flare." },
        { id: "subject", type: "subject", x: 180, y: 134, label: "Subject", role: "Back or three-quarter back to the sun.", notes: "A slight turn so the sun hits one side of the hair gives a stronger edge than a sun directly behind the head." },
        { id: "reflector", type: "reflector", x: 104, y: 204, rot: 40, label: "Reflector (front)", role: "Fill: bounces sunlight back onto the face.", notes: "Hold it low and in front of the subject, angled to catch the sun. White gives a natural fill; a warmer surface adds warmth. Too close and bright makes people squint." },
        { id: "camera", type: "camera", x: 196, y: 262, label: "Camera", role: "Facing the subject and, roughly, the sun.", notes: "Expose for the face, not the background. Expect the sky behind to be one or more stops brighter than the face." }
      ],
      beams: [{ from: "sun", to: "subject" }, { from: "reflector", to: "subject", kind: "bounce" }],
      tips: ["Use the sunrise and sunset planner in the Landscape & Travel Field Guide, or any sun tool, to time low sun.", "Spot or center-weighted metering on the face helps avoid underexposure."]
    },
    {
      id: "one-light",
      title: "One light: softbox at 45°",
      summary: "A single key light with a reflector, the classic loop-light setup.",
      elements: [
        { id: "backdrop", type: "backdrop", x: 180, y: 40, label: "Backdrop", role: "Plain background behind the subject.", notes: "Leave 1.5–2 m between subject and backdrop. Moving the subject away from the backdrop darkens it, because less key light reaches it." },
        { id: "key", type: "softbox", x: 96, y: 118, rot: 50, label: "Key light (softbox)", role: "Sets the direction and shape of the shadows.", notes: "Start 45° to one side of the camera axis and 30–45° above eye level, 1–1.5 m from the subject. Adjust height until the nose shadow points down toward the corner of the mouth. A bigger or closer modifier gives softer light." },
        { id: "subject", type: "subject", x: 180, y: 140, label: "Subject", role: "Faces between the key light and the camera.", notes: "Turning the face toward the key gives broad, even light; turning away gives more shadow (short lighting), which slims the face." },
        { id: "reflector", type: "reflector", x: 264, y: 156, rot: 100, label: "Reflector", role: "Fill on the shadow side.", notes: "Optional. Close for gentle shadows, further away or removed for drama." },
        { id: "camera", type: "camera", x: 180, y: 262, label: "Camera", role: "Straight in front of the subject.", notes: "Use your flash sync speed or slower; the flash sets the exposure, so the shutter controls only ambient light." }
      ],
      beams: [{ from: "key", to: "subject" }, { from: "reflector", to: "subject", kind: "bounce" }],
      tips: ["Set aperture for depth of field, then set flash power to expose correctly at that aperture.", "Check for a catchlight in both eyes."]
    },
    {
      id: "two-light-fill",
      title: "Two lights: key and fill",
      summary: "A key light for shape and a softer fill near the camera to control contrast.",
      elements: [
        { id: "backdrop", type: "backdrop", x: 180, y: 40, label: "Backdrop", role: "Background behind the subject.", notes: "Keep distance from the subject so the fill doesn't light the backdrop evenly." },
        { id: "key", type: "softbox", x: 96, y: 118, rot: 50, label: "Key light (softbox)", role: "Main light: direction and shadow shape.", notes: "45° from camera, above eye level, 1–1.5 m away. Set this first, with the fill off." },
        { id: "fill", type: "umbrella", x: 248, y: 226, rot: -30, label: "Fill light (umbrella)", role: "Opens up the shadows the key creates.", notes: "Place it close to the camera axis on the opposite side. Start one to two stops below the key: one stop gives open, gentle shadows; two stops keeps more shape." },
        { id: "subject", type: "subject", x: 180, y: 140, label: "Subject", role: "Faces the camera or turns slightly toward the key.", notes: "Check the shadow side after adding fill; it should still read as shadow." },
        { id: "camera", type: "camera", x: 180, y: 262, label: "Camera", role: "In front of the subject.", notes: "Meter or test with key alone, then add fill and compare." }
      ],
      beams: [{ from: "key", to: "subject" }, { from: "fill", to: "subject" }],
      tips: ["Turn one light on at a time to see what each does.", "A fill that is too strong creates double shadows."]
    },
    {
      id: "two-light-rim",
      title: "Two lights: key and rim",
      summary: "A key in front and a rim light behind for separation from a dark background.",
      elements: [
        { id: "backdrop", type: "backdrop", x: 180, y: 40, label: "Dark backdrop", role: "Lets the rim light stand out.", notes: "A dark background shows edge light most clearly. Keep spill off it." },
        { id: "rim", type: "strip", x: 270, y: 70, rot: -130, label: "Rim light (strip box)", role: "Separates the subject from the background.", notes: "Behind the subject on the side opposite the key, 1–1.5 m away, aimed at the edge of the hair and shoulder. Use a grid or flag so it doesn't shine into the lens. Start near the key's power and adjust until the edge is visible but not glowing." },
        { id: "key", type: "softbox", x: 96, y: 128, rot: 50, label: "Key light (softbox)", role: "Main light on the face.", notes: "45° from camera on the side opposite the rim. Feather it toward the camera to keep it off the backdrop." },
        { id: "subject", type: "subject", x: 180, y: 140, label: "Subject", role: "Between key and rim.", notes: "A slight turn away from the rim light shows a cleaner edge along the jaw and shoulder." },
        { id: "flag", type: "flag", x: 232, y: 178, rot: 90, label: "Flag", role: "Blocks rim light from reaching the lens.", notes: "If you see haze or flare, move the flag between the rim light and the camera." },
        { id: "camera", type: "camera", x: 180, y: 262, label: "Camera", role: "In front of the subject.", notes: "Use a lens hood. Check edges at full magnification." }
      ],
      beams: [{ from: "key", to: "subject" }, { from: "rim", to: "subject" }],
      tips: ["Rim lights work best slightly behind the subject, not directly behind.", "Add a reflector in front if the key side feels too contrasty."]
    }
  ],

  poses: [
    { id: "weight-shift", title: "Weight on the back foot", camera: "chest",
      figures: [{ x: 160, accent: true, lean: -3, turn: 0.35, arms: [[12, 10], [8, 18]], legs: [[4, 0], [-12, 8]] }],
      notes: ["Body angled 30–45° from the camera.", "Weight on the back foot, front knee soft.", "Front shoulder slightly lower than the back one.", "Arms away from the body so the waist shows."] },
    { id: "three-quarter", title: "Three-quarter headshot turn", camera: "eye", crop: "head",
      figures: [{ x: 180, accent: true, lean: 0, turn: 0.6, headTilt: 6, arms: [[6, 0], [6, 0]], legs: [[3, 0], [3, 0]] }],
      notes: ["Shoulders turned away, face back toward the lens.", "Chin forward and slightly down to define the jaw.", "Eyes toward the lens or just past it.", "Camera at eye level or a touch above."] },
    { id: "hands-pockets", title: "Thumbs in pockets", camera: "chest",
      figures: [{ x: 180, accent: true, lean: 0, turn: 0.2, arms: [[24, 120], [24, 120]], legs: [[7, 0], [-7, 0]] }],
      notes: ["Thumbs hooked into pockets, fingers relaxed outside.", "Elbows away from the body.", "Feet shoulder-width, weight even.", "Good for people unsure what to do with their hands."] },
    { id: "arms-crossed", title: "Relaxed crossed arms", camera: "chest",
      figures: [{ x: 180, accent: true, lean: 2, turn: 0.3, arms: [[16, 132], [16, 132]], legs: [[5, 0], [-9, 6]] }],
      notes: ["Arms folded loosely, hands visible on the upper arms.", "Lean the upper body slightly toward the camera.", "Keep shoulders down and relaxed.", "Works for confident business portraits."] },
    { id: "wall-lean", title: "Leaning on a wall", camera: "chest", prop: "wall-left",
      figures: [{ x: 172, accent: true, lean: -9, turn: 0.4, arms: [[36, 70], [10, 20]], legs: [[-6, 0], [16, 6]] }],
      notes: ["Shoulder against the wall, hips away from it.", "Cross the ankles or bend the outside knee.", "Hand nearest the wall rests on the wall or hangs loose.", "Keeps the pose relaxed for longer sessions."] },
    { id: "seated-lean", title: "Seated forward lean", camera: "eye", prop: "stool",
      figures: [{ x: 180, accent: true, seated: true, lean: 10, turn: 0.15, arms: [[24, 128], [24, 128]], legs: [[34, 70], [34, 70]] }],
      notes: ["Sit toward the front edge of the seat.", "Lean forward from the hips, forearms on the thighs.", "Hands loosely together.", "Brings the face toward the lens for an engaged look."] },
    { id: "stool-foot", title: "Stool with one foot raised", camera: "chest", prop: "stool",
      figures: [{ x: 180, accent: true, seated: true, lean: -2, turn: 0.35, arms: [[18, 60], [10, 30]], legs: [[40, 40], [14, 0]] }],
      notes: ["Perch on a tall stool rather than sitting deeply.", "One foot on the rung, the other on the floor.", "Hand rests on the raised knee.", "Angles the body without effort."] },
    { id: "couple-side", title: "Couple side by side", camera: "chest",
      figures: [
        { x: 150, accent: true, lean: 4, turn: 0.35, arms: [[10, 10], [14, 40]], legs: [[5, 0], [-8, 6]] },
        { x: 212, scale: 0.95, lean: -4, turn: 0.35, arms: [[14, 40], [10, 10]], legs: [[8, 6], [-5, 0]] }
      ],
      notes: ["Inside shoulders overlap slightly.", "Heads close, tilted gently toward each other.", "Inside arms around each other's waist or hands linked.", "Keep a little light between the bodies for shape."] },
    { id: "couple-facing", title: "Couple facing each other", camera: "chest",
      figures: [
        { x: 156, accent: true, lean: 6, turn: 0.75, headTilt: 8, arms: [[20, 70], [20, 70]], legs: [[4, 0], [-6, 4]] },
        { x: 204, scale: 0.95, lean: -6, turn: 0.75, headTilt: -8, arms: [[20, 70], [20, 70]], legs: [[6, 4], [-4, 0]] }
      ],
      notes: ["Turn toward each other, hands joined between them.", "Foreheads or noses close, eyes closed or looking down.", "Shoot from the side for a profile view of both.", "Prompt them to talk quietly; it relaxes faces."] },
    { id: "couple-walk", title: "Couple walking", camera: "waist",
      figures: [
        { x: 150, accent: true, lean: 3, turn: 0.2, arms: [[18, 10], [22, 10]], legs: [[16, 6], [-18, 14]] },
        { x: 210, scale: 0.95, lean: -3, turn: 0.2, arms: [[22, 10], [18, 10]], legs: [[-16, 14], [18, 6]] }
      ],
      notes: ["Holding hands, walking slowly toward the camera.", "Ask them to look at each other, then at the ground, then at you.", "Short steps keep the walk natural.", "Use continuous shooting and pick the frame with good leg positions."] },
    { id: "family-tiered", title: "Family standing, tiered", camera: "chest",
      figures: [
        { x: 140, scale: 1, lean: 2, turn: 0.2, arms: [[14, 40], [10, 10]], legs: [[5, 0], [-5, 0]] },
        { x: 218, scale: 0.97, lean: -2, turn: 0.2, arms: [[10, 10], [14, 40]], legs: [[5, 0], [-5, 0]] },
        { x: 156, scale: 0.62, accent: true, lean: 0, turn: 0.1, arms: [[10, 10], [10, 10]], legs: [[5, 0], [-5, 0]] },
        { x: 204, scale: 0.5, accent: true, lean: 0, turn: 0.1, arms: [[10, 10], [10, 10]], legs: [[5, 0], [-5, 0]] }
      ],
      notes: ["Tallest at the back, children in front.", "Stagger heads so no two are at exactly the same height.", "Hands on shoulders connect the rows.", "Bodies angled toward the center of the group."] },
    { id: "family-ground", title: "Family seated on the ground", camera: "eye", prop: "ground",
      figures: [
        { x: 140, scale: 1, seated: true, lean: 6, turn: 0.3, arms: [[20, 40], [14, 20]], legs: [[60, 90], [60, 90]] },
        { x: 220, scale: 0.97, seated: true, lean: -6, turn: 0.3, arms: [[14, 20], [20, 40]], legs: [[60, 90], [60, 90]] },
        { x: 180, scale: 0.55, accent: true, lean: 0, turn: 0.1, arms: [[14, 20], [14, 20]], legs: [[5, 0], [-5, 0]] }
      ],
      notes: ["Adults seated, a child standing or sitting in front.", "Camera low, at the seated eye level.", "Keeps small children at the same height as adults.", "A blanket defines the space and keeps everyone close."] }
  ],

  settings: {
    tables: [
      { title: "Portrait starting points", rows: [
        { situation: "Window light headshot", aperture: "f/2.8", shutter: "1/200", iso: "400", notes: "Raise ISO before dropping below 1/125 handheld." },
        { situation: "Open shade, one person", aperture: "f/2.8", shutter: "1/500", iso: "200", notes: "Warm the white balance slightly." },
        { situation: "Open shade, group of 3–5", aperture: "f/5.6", shutter: "1/250", iso: "400", notes: "Keep everyone on a similar plane." },
        { situation: "Backlit with reflector", aperture: "f/2.8", shutter: "1/500", iso: "200", notes: "Expose for the face; the sky will be brighter." },
        { situation: "One softbox, studio", aperture: "f/8", shutter: "1/160", iso: "100", notes: "Shutter at or below flash sync; flash sets exposure." },
        { situation: "Two lights, studio", aperture: "f/8", shutter: "1/160", iso: "100", notes: "Fill 1–2 stops below key." },
        { situation: "Indoors, low natural light", aperture: "f/2", shutter: "1/160", iso: "1600", notes: "Watch depth of field on close-ups." }
      ] }
    ],
    rules: [
      "Handheld people shots: keep the shutter at about 1/(2 × focal length) or faster.",
      "Group depth of field: about f/5.6 for two rows at 4–5 m on a full-frame camera.",
      "Settings are starting points. Adjust for your light, lens, and subject."
    ],
    nd: false
  },

  planning: [
    { id: "session-plan", kind: "worksheet", title: "Client session planning sheet",
      description: "Record the details of each session before the day.",
      sections: [
        { title: "Session", fields: [
          { id: "client", label: "Client name" }, { id: "type", label: "Session type" },
          { id: "date", label: "Date", type: "date" }, { id: "time", label: "Start time", type: "time" },
          { id: "location", label: "Location" }, { id: "backup", label: "Backup location (weather)" }
        ] },
        { title: "People and style", fields: [
          { id: "people", label: "People in the session (names, ages)", type: "textarea" },
          { id: "wardrobe", label: "Wardrobe and colors", type: "textarea" },
          { id: "musthave", label: "Must-have shots and combinations", type: "textarea" }
        ] },
        { title: "Light and logistics", fields: [
          { id: "light", label: "Light at the location and time of day", type: "textarea" },
          { id: "gear", label: "Gear to bring", type: "textarea" },
          { id: "notes", label: "Notes", type: "textarea" }
        ] }
      ] },
    { id: "client-questionnaire", kind: "questionnaire", title: "Client questionnaire",
      description: "Customize the questions, add your business name, and export a PDF to send to your clients.",
      intro: "Thank you for booking a portrait session. Your answers help us plan a session that suits you. Please return this questionnaire before your session date.",
      questions: [
        "Names of everyone being photographed (and ages of any children)",
        "Best email address and phone number for the day of the session",
        "What is the session for? (for example a profile photo, family record, gift, or announcement)",
        "Where will you use the photos? (prints and sizes, website, social profiles)",
        "Preferred location or setting (indoors, outdoors, studio, at home)",
        "Dates and times that work for you",
        "Wardrobe plans and colors you are considering",
        "Must-have photos or combinations of people",
        "Anything to avoid (angles, topics, sensitivities)",
        "Pets or props joining the session",
        "Accessibility needs, or anything that will help everyone feel comfortable",
        "Anything else we should know"
      ] }
  ],

  previews: [
    { view: "shotlists", item: "family" },
    { view: "lighting", item: "one-light" },
    { view: "poses", item: "couple-side" }
  ]
};
