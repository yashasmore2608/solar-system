export interface PlanetData {
  id: string;
  name: string;
  classification: string; 
  description: string;
  interestingFact: string;
  specialFeature: { title: string; description: string };
  telemetry: {
    distanceFromSun: string;
    diameter: string;
    gravity: string;
    temperature: string;
    lengthOfDay: string;
    orbitalPeriod: string;
  };
  environment?: {
    atmosphereDetails: string;
    surfaceConditions: string;
    coreComposition: string;
  };
  missions?: {
    notableMissions: string[];
    futureProspects: string;
  };
  sandboxRadius: number;
  sandboxScale: number;
  orbitalInclination: number;
  themeColor: string;
  
  // Internal 3D Rendering Props
  color: string;
  atmosphereColor?: string;
  hasRings?: boolean;
  textureUrl?: string;
  cloudMapUrl?: string;
  ringMapUrl?: string;
  moons?: {
    name: string;
    localRadius: number;
    speed: number;
    size: number;
    color: string;
    startingPhase: number;
  }[];
}

export const PLANETS: PlanetData[] = [
  {
    id: "sun",
    name: "THE SUN",
    classification: "YELLOW DWARF STAR",
    description: "The heart of our solar system. A nearly perfect sphere of hot plasma that drives weather, ocean currents, seasons, and makes life possible on Earth.",
    interestingFact: "The Sun accounts for 99.86% of the mass in the entire solar system.",
    specialFeature: { title: "Solar Flares", description: "Sudden flashes of increased brightness, often followed by a coronal mass ejection." },
    telemetry: {
      distanceFromSun: "0 km",
      diameter: "1,392,700 km",
      gravity: "274 m/s²",
      temperature: "5,500 °C",
      lengthOfDay: "27 days",
      orbitalPeriod: "230M years",
    },
    sandboxRadius: 0,
    sandboxScale: 4.0,
    orbitalInclination: 0.0,
    themeColor: "#FDB813",
    color: "#ffcc00",
    textureUrl: "/textures/2k_sun.jpg",
    environment: {
      atmosphereDetails: "The photosphere, chromosphere, and corona make up the solar atmosphere, consisting entirely of super-heated plasma.",
      surfaceConditions: "No solid surface. The visible 'surface' is the photosphere, bubbling with plasma and solar flares at 5,500 °C.",
      coreComposition: "A dense, incredibly hot core (15 million °C) where nuclear fusion converts hydrogen into helium."
    },
    missions: {
      notableMissions: ["Parker Solar Probe", "SOHO", "Solar Dynamics Observatory"],
      futureProspects: "Continued study of the corona and solar wind to better predict space weather events."
    }
  },
  {
    id: "mercury",
    name: "MERCURY",
    classification: "TERRESTRIAL PLANET",
    description: "The smallest and fastest planet, zipping around the Sun in only 88 Earth days. Its surface is heavily cratered and completely devoid of an atmosphere.",
    interestingFact: "Despite being closest to the Sun, Mercury is not the hottest planet—Venus takes that title.",
    specialFeature: { title: "Extreme Temperatures", description: "Lacking an atmosphere, its surface fluctuates drastically from 430°C to -180°C." },
    telemetry: {
      distanceFromSun: "57.9 Million km",
      diameter: "4,880 km",
      gravity: "3.7 m/s²",
      temperature: "167 °C (avg)",
      lengthOfDay: "1,408 hours",
      orbitalPeriod: "88 days",
    },
    sandboxRadius: 8,
    sandboxScale: 0.4,
    orbitalInclination: 0.35,
    themeColor: "#B0B5B9",
    color: "#888888",
    textureUrl: "/textures/2k_mercury.jpg",
    environment: {
      atmosphereDetails: "Virtually nonexistent. It has a tenuous exosphere containing hydrogen, helium, oxygen, sodium, calcium, and potassium.",
      surfaceConditions: "Extremely heavily cratered, similar to Earth's moon. Experiences massive temperature swings due to lack of atmosphere.",
      coreComposition: "A massive metallic core that makes up about 85% of the planet's radius, consisting mostly of iron."
    },
    missions: {
      notableMissions: ["Mariner 10", "MESSENGER", "BepiColombo"],
      futureProspects: "BepiColombo will arrive in 2025 to study its magnetic field, exosphere, and internal structure."
    }
  },
  {
    id: "venus",
    name: "VENUS",
    classification: "TERRESTRIAL PLANET",
    description: "Often called Earth's twin in size, but a toxic greenhouse effect makes it the hottest planet in our solar system, with thick clouds of sulfuric acid.",
    interestingFact: "A day on Venus is longer than its year, and it spins backward compared to most other planets.",
    specialFeature: { title: "Retrograde Rotation", description: "Spins slowly in the opposite direction of most planets, making the Sun rise in the west." },
    telemetry: {
      distanceFromSun: "108.2 Million km",
      diameter: "12,104 km",
      gravity: "8.87 m/s²",
      temperature: "464 °C",
      lengthOfDay: "5,832 hours",
      orbitalPeriod: "225 days",
    },
    sandboxRadius: 12,
    sandboxScale: 0.6,
    orbitalInclination: -0.25,
    themeColor: "#E2A961",
    color: "#e6c280",
    textureUrl: "/textures/2k_venus_surface.jpg",
    cloudMapUrl: "/textures/2k_venus_atmosphere.jpg",
    environment: {
      atmosphereDetails: "Extremely thick and toxic, mostly carbon dioxide with clouds of sulfuric acid. Atmospheric pressure is 92 times that of Earth.",
      surfaceConditions: "A harsh, barren landscape of volcanic plains and mountains, hot enough to melt lead.",
      coreComposition: "Likely a partially liquid iron and nickel core, surrounded by a rocky mantle."
    },
    missions: {
      notableMissions: ["Venera Program", "Magellan", "Akatsuki", "Parker Solar Probe (Flybys)"],
      futureProspects: "Upcoming NASA VERITAS and DAVINCI missions will map the surface and analyze the atmosphere."
    }
  },
  {
    id: "earth",
    name: "EARTH",
    classification: "TERRESTRIAL PLANET",
    description: "The only world we know that calls us home. An oasis of life suspended in the vast cosmic dark, characterized by its vast liquid water oceans.",
    interestingFact: "Earth is the only planet not named after a god; its name comes from the Old English and Germanic words for 'the ground'.",
    specialFeature: { title: "Active Hydrosphere", description: "The only planet known to harbor liquid water on its surface, sustaining millions of species." },
    telemetry: {
      distanceFromSun: "149.6 Million km",
      diameter: "12,742 km",
      gravity: "9.8 m/s²",
      temperature: "15 °C",
      lengthOfDay: "24 hours",
      orbitalPeriod: "365.2 days",
    },
    sandboxRadius: 16,
    sandboxScale: 0.7,
    orbitalInclination: 0.20,
    themeColor: "#4FA4FF",
    color: "#2b82c9",
    textureUrl: "/textures/2k_earth_daymap.jpg",
    cloudMapUrl: "/textures/2k_earth_clouds.jpg",
    moons: [{
      name: "Luna",
      localRadius: 1.2,
      speed: 1.5,
      size: 0.15,
      color: "#aaaaaa",
      startingPhase: 0
    }],
    environment: {
      atmosphereDetails: "78% Nitrogen, 21% Oxygen, 1% Argon and trace gases. Creates a protective blanket against radiation and regulates temperature.",
      surfaceConditions: "71% covered in liquid water. Highly active geology and weather systems.",
      coreComposition: "Solid inner core of iron and nickel, surrounded by a liquid outer core that generates the magnetosphere."
    },
    missions: {
      notableMissions: ["Apollo Program", "International Space Station", "Hubble Space Telescope", "Artemis"],
      futureProspects: "Establishing a sustainable lunar presence and expanding commercial low-earth orbit operations."
    }
  },
  {
    id: "mars",
    name: "MARS",
    classification: "TERRESTRIAL PLANET",
    description: "A dusty, cold, desert world with a very thin atmosphere. It is a dynamic planet with seasons, polar ice caps, canyons, and extinct volcanoes.",
    interestingFact: "Mars has the largest dust storms in the solar system, which can last for months and cover the entire planet.",
    specialFeature: { title: "Olympus Mons", description: "The largest volcano in the solar system, spanning the size of the state of Arizona." },
    telemetry: {
      distanceFromSun: "227.9 Million km",
      diameter: "6,779 km",
      gravity: "3.7 m/s²",
      temperature: "-65 °C",
      lengthOfDay: "24.6 hours",
      orbitalPeriod: "687 days",
    },
    sandboxRadius: 20,
    sandboxScale: 0.5,
    orbitalInclination: -0.30,
    themeColor: "#E55F40",
    color: "#c1440e",
    textureUrl: "/textures/2k_mars.jpg",
    moons: [
      { name: "Phobos", localRadius: 0.8, speed: 2.2, size: 0.05, color: "#888888", startingPhase: 0 },
      { name: "Deimos", localRadius: 1.1, speed: 1.8, size: 0.05, color: "#999999", startingPhase: Math.PI }
    ],
    environment: {
      atmosphereDetails: "Extremely thin atmosphere, roughly 100 times less dense than Earth's. Composed of 95% Carbon Dioxide.",
      surfaceConditions: "Cold, desert-like conditions with frequent global dust storms. Rust-colored regolith rich in iron oxide.",
      coreComposition: "Dense metallic core composed of iron, nickel, and sulfur, surrounded by a silicate mantle."
    },
    missions: {
      notableMissions: ["Viking 1 & 2", "Curiosity Rover", "Perseverance Rover", "Ingenuity Helicopter"],
      futureProspects: "Crewed missions and potential long-term human colonization in the 2030s."
    }
  },
  {
    id: "jupiter",
    name: "JUPITER",
    classification: "GAS GIANT",
    description: "More than twice as massive as all the other planets combined. The giant planet's Great Red Spot is a centuries-old storm bigger than Earth.",
    interestingFact: "Jupiter's Great Red Spot is a gigantic storm that has been raging for over 300 years and is large enough to swallow Earth whole.",
    specialFeature: { title: "Great Red Spot", description: "A persistent anticyclonic storm that has been raging for at least 400 years." },
    telemetry: {
      distanceFromSun: "778.6 Million km",
      diameter: "139,820 km",
      gravity: "23.1 m/s²",
      temperature: "-110 °C",
      lengthOfDay: "9.9 hours",
      orbitalPeriod: "11.9 years",
    },
    sandboxRadius: 35,
    sandboxScale: 1.8,
    orbitalInclination: 0.15,
    themeColor: "#C49272",
    color: "#d39c7e",
    textureUrl: "/textures/2k_jupiter.jpg",
    moons: [
      { name: "Io", localRadius: 2.5, speed: 2.0, size: 0.12, color: "#d9d06b", startingPhase: 0 },
      { name: "Europa", localRadius: 3.1, speed: 1.6, size: 0.10, color: "#cfd2d4", startingPhase: Math.PI / 2 },
      { name: "Ganymede", localRadius: 3.8, speed: 1.2, size: 0.18, color: "#8c8173", startingPhase: Math.PI },
      { name: "Callisto", localRadius: 4.5, speed: 0.8, size: 0.16, color: "#54534f", startingPhase: Math.PI * 1.5 }
    ],
    environment: {
      atmosphereDetails: "Deep atmosphere composed mainly of Hydrogen and Helium, featuring extreme high-velocity winds and complex weather bands.",
      surfaceConditions: "No true solid surface. The atmosphere gradually transitions into a super-heated liquid metallic state.",
      coreComposition: "Believed to have a dense core of rock and ice, though its exact nature remains a mystery."
    },
    missions: {
      notableMissions: ["Voyager 1 & 2", "Galileo", "Juno", "Europa Clipper (Planned)"],
      futureProspects: "Detailed mapping of Galilean moons, particularly Europa, to search for subsurface oceans and signs of life."
    }
  },
  {
    id: "saturn",
    name: "SATURN",
    classification: "GAS GIANT",
    description: "Adorned with a dazzling, complex system of icy rings, Saturn is unique in our solar system. The other giant planets have rings, but none are as spectacular.",
    interestingFact: "Saturn is the only planet in the solar system that is less dense than water; if you had a large enough bathtub, it would float.",
    specialFeature: { title: "Ring System", description: "Made of billions of chunks of ice and rock, spanning up to 282,000 km in width." },
    telemetry: {
      distanceFromSun: "1.43 Billion km",
      diameter: "116,460 km",
      gravity: "9.0 m/s²",
      temperature: "-140 °C",
      lengthOfDay: "10.7 hours",
      orbitalPeriod: "29.5 years",
    },
    sandboxRadius: 50,
    sandboxScale: 1.5,
    orbitalInclination: -0.20,
    themeColor: "#DDB880",
    color: "#ead6b8",
    hasRings: true,
    textureUrl: "/textures/2k_saturn.jpg",
    ringMapUrl: "/textures/2k_saturn_ring_alpha.png",
    environment: {
      atmosphereDetails: "Mainly hydrogen and helium, featuring bands of fast-moving winds and massive storms, though visually subtler than Jupiter.",
      surfaceConditions: "No solid surface. The gas smoothly transitions into a liquid metallic state at extreme depths.",
      coreComposition: "Believed to have a dense core of rock and ice, though less massive than Jupiter's core."
    },
    missions: {
      notableMissions: ["Pioneer 11", "Voyager 1 & 2", "Cassini-Huygens"],
      futureProspects: "Dragonfly mission to Saturn's moon Titan will explore its prebiotic chemistry and habitability."
    },
    moons: [
      { name: "Titan", localRadius: 3.5, speed: 1.0, size: 0.18, color: "#d69a47", startingPhase: 0 }
    ]
  },
  {
    id: "uranus",
    name: "URANUS",
    classification: "ICE GIANT",
    description: "Rotates at a nearly 90-degree angle from the plane of its orbit. This unique tilt makes Uranus appear to spin on its side.",
    interestingFact: "Uranus is the coldest planetary atmosphere in the solar system, dipping to -224°C, despite not being the furthest planet.",
    specialFeature: { title: "Extreme Axial Tilt", description: "Its 97.77° tilt causes seasons that last for 21 Earth years each." },
    telemetry: {
      distanceFromSun: "2.87 Billion km",
      diameter: "50,724 km",
      gravity: "8.7 m/s²",
      temperature: "-195 °C",
      lengthOfDay: "17.2 hours",
      orbitalPeriod: "84 years",
    },
    sandboxRadius: 65,
    sandboxScale: 1.0,
    orbitalInclination: 0.40,
    themeColor: "#A2E0DF",
    color: "#d1e7e7",
    hasRings: true,
    textureUrl: "/textures/2k_uranus.jpg",
    environment: {
      atmosphereDetails: "Hydrogen, helium, and methane. The methane absorbs red light, giving the planet its signature pale blue color.",
      surfaceConditions: "No solid surface. It is composed primarily of a dense fluid of 'icy' materials—water, methane, and ammonia.",
      coreComposition: "A small rocky core at the center, surrounded by an icy mantle."
    },
    missions: {
      notableMissions: ["Voyager 2"],
      futureProspects: "High priority for a future dedicated orbiter and probe to study its extreme tilt and magnetic field."
    }
  },
  {
    id: "neptune",
    name: "NEPTUNE",
    classification: "ICE GIANT",
    description: "Dark, cold, and whipped by supersonic winds. It was the first planet located through mathematical calculations, rather than by telescope.",
    interestingFact: "Neptune takes 165 Earth years to orbit the Sun, meaning it only completed its first full orbit since discovery in 2011.",
    specialFeature: { title: "Supersonic Winds", description: "Winds can reach up to 2,000 km/h, the fastest recorded in the solar system." },
    telemetry: {
      distanceFromSun: "4.5 Billion km",
      diameter: "49,244 km",
      gravity: "11.0 m/s²",
      temperature: "-200 °C",
      lengthOfDay: "16.1 hours",
      orbitalPeriod: "165 years",
    },
    sandboxRadius: 80,
    sandboxScale: 0.9,
    orbitalInclination: -0.15,
    themeColor: "#274687",
    color: "#5b5ddf",
    textureUrl: "/textures/2k_neptune.jpg",
    environment: {
      atmosphereDetails: "Hydrogen, helium, and methane, but with active and visible weather patterns, including the Great Dark Spot.",
      surfaceConditions: "No solid surface. A slushy fluid mantle overlies a small rocky core.",
      coreComposition: "An Earth-sized core composed of iron, nickel, and silicates."
    },
    missions: {
      notableMissions: ["Voyager 2"],
      futureProspects: "Concepts for a Uranus/Neptune flagship mission are actively being evaluated by NASA."
    }
  },
  {
    id: "pluto",
    name: "PLUTO",
    classification: "DWARF PLANET",
    description: "A complex and mysterious world with mountains, valleys, plains, and craters. Discovering it forever changed our understanding of the outer solar system.",
    interestingFact: "Pluto was reclassified from a planet to a dwarf planet in 2006 because it hasn't cleared its neighboring region of other objects.",
    specialFeature: { title: "Tombaugh Regio", description: "A highly reflective, heart-shaped region made mostly of nitrogen ice." },
    telemetry: {
      distanceFromSun: "5.9 Billion km",
      diameter: "2,376 km",
      gravity: "0.62 m/s²",
      temperature: "-225 °C",
      lengthOfDay: "153 hours",
      orbitalPeriod: "248 years",
    },
    sandboxRadius: 95,
    sandboxScale: 0.2,
    orbitalInclination: 0.80,
    themeColor: "#C1B8B3",
    color: "#dddddd",
    textureUrl: "/textures/Pluto_in_True_Color_-_High-Res.jpg",
    environment: {
      atmosphereDetails: "A thin, transient exosphere of nitrogen, methane, and carbon monoxide that freezes out as Pluto moves away from the Sun.",
      surfaceConditions: "A diverse terrain of mountains made of water ice and vast plains of frozen nitrogen.",
      coreComposition: "A rocky core surrounded by a mantle of water ice, with a potential subsurface ocean."
    },
    missions: {
      notableMissions: ["New Horizons"],
      futureProspects: "Proposed orbiter missions to study seasonal changes and its moon system."
    }
  }
];
