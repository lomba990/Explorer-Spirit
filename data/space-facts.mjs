// Fakta luar angkasa untuk rasa ingin tahu anak-anak (dipakai di semua tombol, bersama astronaut-facts.mjs).
// Sumber: halaman NASA dan ESA, Guinness World Records (rekor kecepatan), Wikipedia (Pratiwi Sudarmono, STS-61-H, Palapa),
// Telkomsat dan Online Journal of Space Communication (Palapa). Angka dibulatkan seperti di buku pelajaran.
// Cara menambah topik: salin satu blok { id, keywords, facts }, ganti isinya.
//  - keywords   : kata pemicu (Inggris dan Indonesia), huruf kecil
//  - requireAny : (opsional) topik hanya dipakai kalau salah satu kata ini juga ada di pertanyaan
//  - excludeAny : (opsional) topik tidak dipakai kalau ada salah satu kata ini
export default {
  source: "Explorer Spirit space facts, compiled from NASA and ESA pages, Guinness World Records, Wikipedia and Indonesian satellite history sources (Telkomsat, Online Journal of Space Communication)",
  topics: [
    {
      id: "firsts", image: "Yuri Gagarin Vostok 1",
      keywords: ["first", "pertama", "who was first", "siapa pertama", "gagarin", "tereshkova", "first woman", "wanita pertama", "perempuan pertama",
                 "first spacewalk", "first person", "orang pertama", "manusia pertama", "first man", "first american"],
      facts: [
        "The first human in space was Yuri Gagarin from the Soviet Union, on 12 April 1961. He circled Earth once in about 108 minutes.",
        "The first woman in space was Valentina Tereshkova from the Soviet Union, in June 1963.",
        "The first American in space was Alan Shepard, in May 1961. Ten years later he hit golf balls on the Moon during Apollo 14.",
        "The first spacewalk was made by Alexei Leonov in March 1965.",
        "The first people to walk on the Moon were Neil Armstrong and Buzz Aldrin, on Apollo 11 in July 1969.",
        "The first artificial satellite was Sputnik 1, launched by the Soviet Union in October 1957.",
      ],
    },
    {
      id: "animals", image: "animals in space history",
      keywords: ["animal", "animals", "dog", "monkey", "chimp", "chimpanzee", "cat", "fly", "flies", "laika", "hewan", "binatang", "anjing", "monyet", "kucing", "lalat", "simpanse"],
      facts: [
        "Animals flew before people did, so scientists could check that living things could survive the trip.",
        "The first animals in space were fruit flies, sent up on a rocket in 1947. They came back alive.",
        "The dog Laika was the first animal to orbit Earth, on Sputnik 2 in 1957. Sadly, there was no way to bring her back, and she is remembered as a space pioneer.",
        "In 1961 a chimpanzee named Ham flew into space for NASA and returned safely.",
        "Since then, mice, fish, spiders, frogs, worms and even tiny water bears (tardigrades) have been studied in space.",
      ],
    },
    {
      id: "weightless", image: "astronauts floating space station",
      keywords: ["float", "floating", "weightless", "weightlessness", "zero gravity", "zero-g", "microgravity", "why do astronauts float", "melayang", "mengambang",
                 "tanpa gravitasi", "gravitasi nol", "kenapa astronot melayang", "how do satellites stay", "stay up", "tidak jatuh", "orbit", "falling around"],
      facts: [
        "There is still gravity where the space station flies, about 90% as strong as on the ground! Astronauts float because the station and everyone inside are falling around Earth together.",
        "The station moves sideways so fast, about 28,000 km per hour, that as it falls, Earth's curved surface keeps curving away beneath it. That never-ending fall is called an orbit. Satellites stay up the same way.",
        "Because everything falls together, nothing presses on the floor, so astronauts, water drops and food all float.",
        "You can feel a tiny bit of this on Earth at the top of a swing or when a lift suddenly starts going down.",
      ],
    },
    {
      id: "body", image: "astronaut floating water droplet",
      keywords: ["cry", "crying", "tears", "burp", "fart", "taller", "grow", "sick", "dizzy", "smell", "nose", "hair", "sneeze", "blood", "heart",
                 "menangis", "air mata", "sendawa", "kentut", "lebih tinggi", "tinggi badan", "sakit", "pusing", "mual", "bau", "rambut", "bersin", "jantung", "tubuh", "badan"],
      facts: [
        "Astronauts can grow up to about 5 cm taller in space, because the gaps in their backbone stretch out without gravity pressing down. They shrink back on Earth.",
        "Tears don't fall in space. They stick to the eye and form a little ball of water.",
        "Burping is tricky because gas and food don't separate in the stomach, so a burp can bring up food too.",
        "In the first days many astronauts feel dizzy or sick, a bit like car sickness. It is called space adaptation sickness and usually goes away.",
        "Without gravity pulling it down, body fluid moves up to the head, so astronauts get puffy faces and a stuffy nose, like having a cold.",
        "After spacewalks, astronauts say space has a smell on their suits, something like burnt steak, hot metal or welding fumes.",
      ],
    },
    {
      id: "become_astronaut", image: "astronaut training underwater pool",
      keywords: ["become an astronaut", "be an astronaut", "how to become", "want to be", "train", "training", "school", "study",
                 "jadi astronot", "menjadi astronot", "cita-cita", "bagaimana caranya", "latihan", "sekolah", "belajar", "kuliah", "syarat"],
      facts: [
        "NASA astronauts usually first study science, technology, engineering or maths at university, and many are scientists, engineers, doctors, teachers or pilots.",
        "They must be healthy, good at working in a team, and calm when things go wrong.",
        "Training takes about two years and includes practising spacewalks underwater in a giant swimming pool, flying jets, survival training, and learning Russian.",
        "Astronauts also ride a special plane that dives up and down so everyone inside floats for about 20 seconds at a time.",
        "Each country has its own way of choosing astronauts. In Indonesia, space research is done by BRIN, the National Research and Innovation Agency.",
        "A great start for any future astronaut: be curious, love science and maths, keep your body healthy, and never stop asking questions.",
      ],
    },
    {
      id: "indonesia", image: "Palapa satellite",
      keywords: ["indonesia", "indonesian", "pratiwi", "palapa", "lapan", "brin", "astronot indonesia", "satelit indonesia", "orang indonesia",
                 "pertama indonesia", "indonesia pertama", "first indonesian", "indonesia's first", "dari indonesia"],
      facts: [
        "Indonesia's first astronaut candidate was Pratiwi Sudarmono, a scientist from Bandung. In 1985 she was chosen to fly on NASA's space shuttle mission STS-61-H in 1986, with Taufik Akbar as her backup.",
        "She would have been the first Indonesian in space and the first Asian woman in space, but the mission was cancelled after the Challenger accident in 1986. She became a professor of microbiology at the University of Indonesia.",
        "Her mission was supposed to launch an Indonesian satellite, Palapa B3. It was launched later, in 1987, on a Delta rocket.",
        "Indonesia's first satellite, Palapa A1, was launched on 8 July 1976 (9 July in Indonesian time). Indonesia became the first developing country, and the third country after the United States and Canada, to run its own national satellite communication system.",
        "The name Palapa comes from Gajah Mada's oath to unite the archipelago, because the satellite connected phone calls and TV across Indonesia's thousands of islands.",
      ],
    },
    {
      id: "family_contact", image: "astronaut video call space station",
      keywords: ["family", "call home", "phone", "talk to their family", "email", "lonely", "homesick", "ham radio",
                 "keluarga", "menelepon", "telepon", "kangen", "rindu", "kesepian", "orang tua", "video call"],
      facts: [
        "Astronauts on the space station can phone and video-call their families, and send emails, using satellite links through mission control.",
        "They usually have a private family video call about once a week, and time on weekends to rest, read, watch films and look out of the window at Earth.",
        "Since 1983, astronauts have also carried amateur (ham) radio, and they sometimes talk by radio with students at schools on Earth.",
      ],
    },
    {
      id: "rockets", image: "Saturn V launch",
      keywords: ["rocket", "rockets", "launch", "liftoff", "blast off", "fuel", "engine", "saturn v", "falcon", "sls", "how do rockets work", "booster",
                 "roket", "peluncuran", "meluncur", "bahan bakar", "mesin", "cara kerja roket"],
      facts: [
        "A rocket works by pushing hot gas down very hard, so the gas pushes the rocket up. This is Newton's third law: every action has an equal and opposite reaction. You can feel it when a balloon zooms away as air rushes out.",
        "Rockets carry their own oxygen (or another chemical) to burn their fuel, because there is no air in space.",
        "To escape Earth's gravity completely, a spacecraft must reach about 11.2 km per second, more than 40,000 km per hour.",
        "The Saturn V rocket that carried Apollo astronauts to the Moon was about 111 m tall, taller than a 30-storey building.",
        "Rockets are built in stages: when one stage runs out of fuel it drops away, so the rest is lighter. Today some boosters, like SpaceX's Falcon 9, fly back and land so they can be used again.",
      ],
    },
    {
      id: "travel_time", image: "Apollo spacecraft trip to the Moon",
      keywords: ["how long to get", "how long does it take", "how far", "distance", "trip", "journey", "travel", "drive to the moon", "walk to the moon",
                 "berapa lama ke", "berapa lama perjalanan", "berapa jauh", "jarak", "perjalanan", "naik mobil", "jalan kaki ke"],
      facts: [
        "The Moon is about 384,000 km away. The Apollo astronauts took about 3 days to get there.",
        "If you could drive a car to the Moon at 100 km per hour without stopping, it would take about 160 days.",
        "Mars is much farther, and the distance keeps changing as both planets move around the Sun. Robot spacecraft take about 7 months to get there.",
        "Light from the Sun takes about 8 minutes to reach Earth, and light from the Moon takes just over 1 second.",
        "The space station is only about 400 km up, but spacecraft usually take several hours to a day or two to catch up with it and dock.",
      ],
    },
    {
      id: "shuttle", image: "Space Shuttle launch",
      keywords: ["space shuttle", "shuttle", "pesawat ulang alik", "ulang-alik", "atlantis", "discovery", "endeavour", "orbiter"],
      facts: [
        "NASA's Space Shuttle flew from 1981 to 2011. It launched like a rocket and landed on a runway like a giant glider.",
        "There were 135 shuttle missions, flown by five orbiters: Columbia, Challenger, Discovery, Atlantis and Endeavour.",
        "The shuttles launched the Hubble Space Telescope, carried astronauts to repair it, and helped build the International Space Station.",
      ],
    },
    {
      id: "iss", image: "International Space Station orbit",
      keywords: ["iss", "international space station", "space station", "stasiun luar angkasa", "stasiun antariksa", "see the space station", "melihat stasiun"],
      facts: [
        "The International Space Station is about as big as a football field, including its huge solar panels. It was built in space piece by piece, starting in 1998.",
        "It flies about 400 km above Earth at about 28,000 km per hour, going all the way around Earth in about 90 minutes.",
        "You can see it from Indonesia without a telescope: it looks like a very bright star moving steadily across the sky, just after sunset or before sunrise.",
        "Astronauts from many countries live and do science experiments there. NASA plans to retire it around 2030 and guide it to fall safely into a remote part of the ocean.",
      ],
    },
    {
      id: "telescopes", image: "James Webb Space Telescope",
      keywords: ["telescope", "hubble", "james webb", "webb", "jwst", "teleskop"],
      facts: [
        "Space telescopes see farther and clearer than telescopes on the ground because Earth's air doesn't blur their view.",
        "The Hubble Space Telescope was launched in 1990 and orbits Earth. Astronauts repaired and upgraded it five times.",
        "The James Webb Space Telescope was launched on 25 December 2021. It sits about 1.5 million km from Earth and has a giant gold-coated mirror 6.5 m wide that sees infrared light (heat).",
        "Webb can see some of the first galaxies that formed after the universe began.",
      ],
    },
    {
      id: "farthest_fastest", image: "Voyager 1 spacecraft",
      keywords: ["farthest", "furthest", "fastest", "speed record", "voyager", "parker", "golden record", "paling jauh", "terjauh", "tercepat", "paling cepat", "rekor"],
      facts: [
        "The farthest human-made object is Voyager 1, launched in 1977. It is now more than 24 billion km away and in 2012 became the first spacecraft to reach interstellar space, the space between the stars.",
        "Voyager 1 and Voyager 2 each carry a Golden Record with sounds and pictures from Earth, in case anyone ever finds them.",
        "The fastest human-made object is NASA's Parker Solar Probe. On 24 December 2024, while swooping close to the Sun, it reached about 692,000 km per hour (Guinness World Records).",
      ],
    },
    {
      id: "moon_facts", image: "Moon surface craters",
      requireAny: ["moon", "bulan", "lunar"],
      excludeAny: ["golf", "flag", "bendera", "left", "ditinggalkan", "tertinggal", "apollo"],
      keywords: ["gravity", "gravitasi", "weigh", "jump", "lompat", "hot", "cold", "temperature", "panas", "dingin", "suhu", "air", "udara", "breathe", "bernapas",
                 "same side", "one side", "sisi", "crater", "craters", "kawah", "footprint", "footprints", "jejak", "light", "cahaya", "made of", "terbuat", "dark side", "sisi gelap"],
      facts: [
        "Gravity on the Moon is about one sixth of Earth's, so you would weigh much less and could jump about six times higher.",
        "The Moon has almost no air, so there is no wind, no rain and no sound, and astronauts needed spacesuits to breathe.",
        "Without air to hold heat, the Moon gets very hot in sunlight, about 120 °C, and very cold at night, about -130 °C.",
        "We always see the same side of the Moon, because it spins exactly once each time it goes around Earth. The far side is not always dark; it gets sunlight too.",
        "The Moon's craters were made by rocks from space crashing into it. With no wind or rain, the craters, and the astronauts' footprints, stay for a very long time.",
        "The Moon does not make its own light. It shines because it reflects sunlight.",
      ],
    },
    {
      id: "mars_facts", image: "Mars surface Olympus Mons",
      requireAny: ["mars"],
      excludeAny: ["rover", "lander", "left", "ditinggalkan", "tertinggal", "parachute", "parasut", "helicopter", "helikopter"],
      keywords: ["red", "merah", "why red", "kenapa merah", "day", "hari", "gravity", "gravitasi", "cold", "dingin", "temperature", "suhu", "volcano", "gunung",
                 "olympus", "moons", "bulan mars", "phobos", "deimos", "dust storm", "badai", "water", "air", "live", "tinggal", "breathe", "bernapas"],
      facts: [
        "Mars looks red because its dust and rocks contain iron oxide, which is basically rust.",
        "A day on Mars lasts about 24 hours and 37 minutes, almost like a day on Earth, but a year on Mars lasts about 687 Earth days.",
        "Gravity on Mars is about 38% of Earth's, so you could jump almost three times higher.",
        "Mars is very cold, about -60 °C on average, and its air is very thin and mostly carbon dioxide, so people could not breathe there.",
        "Mars has the tallest volcano in the solar system, Olympus Mons, about two and a half times as tall as Mount Everest.",
        "Mars has two small moons, Phobos and Deimos, and sometimes giant dust storms cover the whole planet.",
        "Long ago Mars had rivers and lakes of liquid water; today water is mostly frozen as ice.",
      ],
    },
    {
      id: "space_conditions", image: "Earth from space black sky",
      keywords: ["sound", "noise", "hear", "loud", "silent", "quiet", "dark", "black", "without a spacesuit", "without spacesuit", "no spacesuit", "vacuum", "how cold is space", "how hot is space",
                 "suara", "bunyi", "dengar", "sunyi", "gelap", "hitam", "tanpa pakaian", "tanpa baju", "tanpa spacesuit", "hampa", "vakum", "seberapa dingin"],
      facts: [
        "Space is silent. Sound needs air or another material to travel through, and space is almost empty (a vacuum), so explosions in films would really make no sound.",
        "The sky in space looks black even in sunlight, because there is no air to scatter the light the way our blue sky does.",
        "Things in space get very hot in sunlight and very cold in shadow, which is why spacecraft and spacesuits have special insulation.",
        "Without a spacesuit a person could not breathe and would pass out within seconds. That is why astronauts always wear a suit or stay inside the spacecraft.",
      ],
    },
    {
      id: "life_aliens", image: "Europa Clipper Jupiter moon Europa",
      keywords: ["alien", "aliens", "ufo", "life", "other planets", "extraterrestrial", "exoplanet", "exoplanets", "makhluk", "kehidupan", "makhluk luar angkasa",
                 "planet lain", "ada kehidupan", "eksoplanet", "makhluk asing"],
      facts: [
        "So far, scientists have not found any life beyond Earth, not even tiny microbes. But they are searching!",
        "Rovers like Curiosity and Perseverance look for signs that tiny life might have lived on Mars long ago, when it had water.",
        "NASA's Europa Clipper spacecraft, launched in October 2024, is travelling to Jupiter's moon Europa, which has a hidden ocean under its ice.",
        "Astronomers have found more than 6,000 planets around other stars, called exoplanets, and they study some of them for air that could hint at life.",
        "Nobody knows yet whether we are alone in the universe. Maybe someone your age will help find out!",
      ],
    },
    {
      id: "future", image: "Artemis astronauts Moon",
      keywords: ["future", "next", "will people go", "will humans", "go back", "return to the moon", "live on the moon", "live on mars", "moon base", "artemis",
                 "masa depan", "kembali ke bulan", "tinggal di bulan", "tinggal di mars", "pangkalan", "koloni"],
      excludeAny: ["artemis ii crew"],
      facts: [
        "NASA's Artemis program aims to land astronauts on the Moon again, including the first woman to walk on the Moon, and later to build a long-term base near the Moon's south pole.",
        "Artemis II flew four astronauts around the Moon in April 2026 as a test flight. The next missions are planned to land on the surface; launch dates can change.",
        "NASA's long-term goal is to send humans to Mars. A trip there and back would take years, so engineers are still working on how to keep astronauts healthy that long.",
      ],
    },
    {
      id: "records", image: "astronaut long duration mission",
      keywords: ["longest", "record", "longest time in space", "how long can", "years in space", "terlama", "paling lama", "rekor", "berapa lama bisa"],
      facts: [
        "The longest single stay in space is 437 days, by Russian cosmonaut Valeri Polyakov on the Mir space station in 1994 and 1995.",
        "NASA astronaut Scott Kelly spent about a year (340 days) on the space station in 2015 and 2016, while his identical twin brother Mark stayed on Earth, so scientists could compare how space changes the body.",
        "Most space station crews stay about six months.",
      ],
    },
    {
      id: "earth_from_space", image: "Earth from space at night city lights",
      keywords: ["great wall", "tembok besar", "see earth", "earth from space", "bumi dari luar angkasa", "lihat bumi", "melihat bumi", "what does earth look like", "city lights", "lampu kota"],
      facts: [
        "From space Earth looks like a blue marble with white swirling clouds, brown and green land, and bright blue oceans.",
        "The Great Wall of China is very long but narrow, so astronauts say it is not visible to the naked eye from the space station. That is a popular myth.",
        "At night, astronauts can see the lights of big cities glowing, and sometimes the green and red curtains of aurora near the poles.",
      ],
    },
  ],
};
