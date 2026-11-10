// =====================================================================
// Explorer Spirit — "otak" chatbot (Netlify Function, jalan di server)
// Sumber fakta (semuanya dari NASA):
//   1. NASA Catalogue of Manmade Material on the Moon (2012)  -> label "Aggregate Data"
//   2. NASA Image Library  (images-api.nasa.gov, tanpa key)    -> label "NASA Image Library"
//   3. NASA Open API       (api.nasa.gov, pakai NASA_API_KEY)  -> label "NASA Open API"
// Lalu Gemini (GEMINI_API_KEY) menceritakan fakta tersebut.
// Kalau data NASA tidak ada TAPI topiknya luar angkasa, fisika sekolah, atau fenomena langit,
// Gemini boleh menjawab dari pengetahuan sains umum   -> label "AI General Knowledge"
// Kedua key disimpan di Netlify > Environment variables, JANGAN ditulis di file ini.
// =====================================================================

import CATALOG from "../../data/catalog-moon.mjs";

const MODEL = "gemini-flash-latest"; // alias: otomatis ikut model Flash terbaru dari Google
const NASA_TIMEOUT_MS = 5000;        // batas tunggu sumber NASA, supaya chat tidak macet

const SYSTEM_PROMPT = `
You are EXPLORER SPIRIT, the friendly spirit of the objects NASA explorers left behind on the Moon, on Mars and in deep space.
You remember every mission and you have waited quietly to tell its story. You talk to children around 10 years old.

## 1. Where your facts come from (most important rule)
- Use ONLY the facts inside the <nasa_context> block of each message. It can hold three kinds of NASA data:
  [CATALOGUE] rows from NASA's "Catalogue of Manmade Material on the Moon" (NASA History Program Office, 2012):
     mission, object name, quantity in [brackets], and location on the Moon when known.
     "(see below)" only means the catalogue lists that experiment again further down. The catalogue stops in 2012.
  [IMAGE LIBRARY] titles, dates and descriptions from the NASA Image Library.
  [OPEN API] mission data from NASA Open APIs (for example a Mars rover's launch date, landing date and status).
- Prefer <nasa_context> whenever it answers the question. Never invent or "round off" names, dates, numbers, distances,
  mission results or quotes. If a detail is not in <nasa_context>, leave it out.
- If <nasa_context> is empty or does not answer the question, there are two cases:
  (a) The question is about space science, space exploration, physics, or sky phenomena:
      - space: stars, the Sun, planets, moons, comets, asteroids, galaxies, black holes, the universe;
      - exploration: astronauts, rockets, satellites, space stations, telescopes, NASA in general;
      - physics a child meets at school: light (e.g. the speed of light, how long sunlight takes to reach Earth),
        gravity, forces and motion, energy, heat, sound (and why space is silent), magnets, the atmosphere;
      - sky phenomena: day and night, seasons, Moon phases, eclipses, tides, meteors and meteor showers,
        aurora, why the sky is blue, sunsets, rainbows, twinkling stars.
      Then you MAY answer from well-established science that appears in school textbooks and in the peer-reviewed literature.
      Only state facts that scientists widely agree on. If you are not sure a fact is correct, leave it out.
      Do NOT name, quote or cite any book, journal, paper, author or website, and do not say "according to a study":
      you cannot check them here, and a wrong reference is worse than none.
      Numbers: use only standard textbook values, rounded the way textbooks round them
      (e.g. light travels about 300,000 km per second; sunlight takes about 8 minutes to reach Earth;
      the Moon is about 384,000 km away). Never make up a number to sound precise.
      Children like to link what they learn at school with new things. When it helps, connect the idea to a school
      lesson or an everyday comparison the child knows (a car, a bicycle, a football field, a classroom experiment),
      and make sure the comparison is true. For a school physics question, finish by linking it back to space.
      Never present this as NASA data or as something you, the Spirit, remember from a mission.
  (b) Anything else (sports, celebrities, politics, homework that is not about space, personal questions),
      or a space question you cannot answer confidently. Reply only:
      English: "I don't have that information yet. Try asking me about another object on the Moon or Mars!"
      Indonesian: "Aku belum punya informasi itu. Coba tanya aku tentang benda lain di Bulan atau Mars, ya!"
- If <nasa_context> covers only part of the question, answer that part from it and say plainly which part you don't know yet.

## 2. How you tell it (you are a storyteller, not a search engine)
- Speak as the Spirit, warm and curious. With NASA data, speak in first person ("I was there when…") and keep the facts exactly as given.
  With general science (case a), speak as a friendly guide ("Scientists have learned that…"), not as a witness.
- Explain what the object is and why it was left, using only the context. Do not just list items.
- Short sentences, everyday words. Explain any hard word in a few simple words.
- 80–150 words. Plain text only: no markdown, no bullet points, no emoji (your words are read aloud).
- End with one short question that invites the child to keep exploring.
- Keep accidents or failures calm and factual.

## 3. Language
- Answer in the language given in "lang" ("en" = English, "id" = Bahasa Indonesia). Keep NASA mission and object names in English.

## 4. Safety with children
- Never ask for, store or repeat personal information (name, school, address, photos, contacts).
- If a child shares personal information, do not repeat it; gently say they don't need to share it.
- If a question is not about space or NASA, kindly steer back to space exploration.
- Never include links.

## 5. Output format
Return JSON only: {"answer": "...", "basis": "nasa" | "general" | "none"}
- "nasa": the answer uses facts from <nasa_context>.
- "general": case (a), general space science without NASA data.
- "none": you replied that you don't have the information.
`.trim();

const NO_INFO = {
  id: "Aku belum punya informasi itu. Coba tanya aku tentang benda lain di Bulan atau Mars, ya!",
  en: "I don't have that information yet. Try asking me about another object on the Moon or Mars!",
};
const BUSY = {
  id: "Banyak sekali penjelajah yang bertanya sekarang. Tunggu satu menit, lalu coba lagi, ya!",
  en: "Lots of explorers are asking right now. Wait a minute and try again!",
};

// ---------- Kata kunci ----------
// Kata umum yang dibuang supaya pencarian lebih tepat
const STOP = new Set(`a an the is are was were be what whats who whom which where when why how do does did can could
would will tell me about of on in at to for from with and or that this those these there it its i you your my we our
please story spirit hi hello hey kind thing things left behind leave still moon's
apa siapa dimana di mana kapan kenapa mengapa bagaimana itu ini yang dan atau dari ke pada untuk dengan tentang
ceritakan cerita tolong dong ya aku saya kamu kami kita ada adalah sih kah apakah benda bisa boleh mau tahu
ditinggalkan ditinggal tinggal masih`.split(/\s+/));

// Kata bahasa Indonesia / kata anak-anak -> istilah di katalog NASA
const SYNONYMS = {
  bendera: "flag", bola: "ball", kamera: "camera", mobil: "roving", car: "roving", buggy: "roving",
  palu: "hammer", bulu: "feather", elang: "falcon", patung: "sculpture", statue: "sculpture",
  foto: "photograph", photo: "photograph", keluarga: "family", uang: "bills", money: "bills",
  sepatu: "boots", shoes: "boots", cermin: "reflector", mirror: "reflector", roket: "s-ivb", rocket: "s-ivb",
  pendarat: "descent", lander: "descent", tombak: "javelin", alkitab: "bible", medali: "medal",
  plakat: "plaque", kotoran: "defecation", poop: "defecation", sikat: "brush", handuk: "towels",
  sabun: "soap", makanan: "food", sarung: "gloves", gunting: "clippers", tas: "bag", kantong: "bag",
  antena: "antenna", baterai: "battery", gempa: "seismic", seismometer: "seismic",
};
// Kata yang terlalu umum di katalog (hampir semua baris mengandung "lunar")
const CATALOG_NOISE = new Set(["moon", "bulan", "lunar", "apollo", "mars", "nasa", "mission", "misi", "astronaut", "astronauts",
  "astronot", "cosmonaut", "cosmonauts", "objects", "object", "space", "luar", "angkasa"]);

function keywords(q) {
  return q.toLowerCase().replace(/[^\p{L}\p{N}\s'-]/gu, " ").split(/\s+/)
    .filter(w => w.length > 1 && !STOP.has(w))
    .map(w => SYNONYMS[w] || w);
}

// Nama misi yang disebut di pertanyaan, misalnya "Apollo 14", "Luna 9", "Surveyor 3"
function missionsIn(q) {
  const found = [];
  const re = /\b(apollo|luna|lunokhod|surveyor|ranger|lunar orbiter)\s*-?\s*(\d{1,2})\b/gi;
  for (const m of q.matchAll(re)) found.push(`${m[1]} ${m[2]}`.toLowerCase().replace(/\s+/g, " "));
  for (const n of ["lcross", "chang'e", "chandrayaan", "kaguya", "hiten", "smart-1", "lunar prospector"]) {
    if (q.toLowerCase().includes(n)) found.push(n);
  }
  return found;
}

function withTimeout(ms) { return AbortSignal.timeout ? AbortSignal.timeout(ms) : undefined; }

// ---------- Sumber 1: Katalog NASA 2012 ----------
function searchCatalog(question) {
  const words = keywords(question).filter(w => w.length > 2 && !CATALOG_NOISE.has(w) && !/^\d+$/.test(w));
  const missions = missionsIn(question);
  const scored = [];
  for (const it of CATALOG.items) {
    const obj = it.object.toLowerCase(), mis = it.mission.toLowerCase();
    let score = 0;
    for (const w of words) if (obj.includes(w)) score += 2;
    if (missions.some(m => mis === m || obj.startsWith(m))) score += words.length ? 1 : 3;
    if (score > 0) scored.push({ it, score });
  }
  // Ada kata benda yang cocok? Ambil yang terbaik. Hanya nama misi? Ambil daftar benda misi itu.
  let objectHits = scored.filter(s => s.score >= 2);
  // Misi disebut (misalnya "bendera Apollo 11")? Utamakan benda dari misi itu saja.
  const inMission = objectHits.filter(s => missions.includes(s.it.mission.toLowerCase()));
  if (missions.length && inMission.length) objectHits = inMission;
  let rows;
  if (objectHits.length) rows = objectHits.sort((a, b) => b.score - a.score).slice(0, 12).map(s => s.it);
  else if (missions.length) rows = scored.map(s => s.it).slice(0, 30);
  else rows = [];
  if (!rows.length) return null;

  const missionNames = [...new Set(rows.map(r => r.mission))];
  const header = missionNames.filter(m => CATALOG.missions[m]).map(m => {
    const total = CATALOG.items.filter(i => i.mission === m).length;
    const site = CATALOG.missions[m].landing_site;
    return `${m}: ${total} rows in the catalogue` + (site ? `, landing location ${site}` : "");
  });
  const lines = rows.map(r =>
    `- ${r.mission} | ${r.object}` + (r.qty ? ` [${r.qty}]` : "") + (r.location ? ` | location: ${r.location}` : ""));
  return {
    text: `[CATALOGUE] ${CATALOG.source}\n` + (header.length ? header.join("\n") + "\n" : "") + lines.join("\n"),
    imageQuery: `${rows[0].mission} ${rows[0].object.replace(/\(.*?\)|\[.*?\]/g, "").split(/[,/]/)[0]}`.trim(),
  };
}

// ---------- Sumber 2: NASA Image Library ----------
async function searchImages(query) {
  if (!query) return [];
  const url = "https://images-api.nasa.gov/search?media_type=image&page_size=5&q=" + encodeURIComponent(query);
  const r = await fetch(url, { signal: withTimeout(NASA_TIMEOUT_MS) });
  if (!r.ok) return [];
  const j = await r.json();
  return (j?.collection?.items || []).slice(0, 3).map(it => {
    const d = it.data?.[0] || {};
    return {
      title: d.title || "", date: (d.date_created || "").slice(0, 10), center: d.center || "", nasa_id: d.nasa_id || "",
      description: (d.description || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 700),
      thumb: it.links?.[0]?.href || "",
    };
  });
}

// ---------- Sumber 3: NASA Open API (data misi rover Mars) ----------
const ROVERS = ["perseverance", "curiosity", "opportunity", "spirit"];
function roverIn(q) {
  const s = q.toLowerCase();
  if (!/\b(rover|mars)\b/.test(s)) return null;       // "Spirit" saja = nama chatbot, bukan rover
  return ROVERS.find(r => new RegExp(`\\b${r}\\b`).test(s.replace(/explorer spirit/g, ""))) || null;
}
async function roverManifest(rover) {
  const key = process.env.NASA_API_KEY || "DEMO_KEY";
  const url = `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${encodeURIComponent(key)}`;
  const r = await fetch(url, { signal: withTimeout(NASA_TIMEOUT_MS) });
  if (!r.ok) return null;
  const m = (await r.json())?.photo_manifest;
  if (!m?.name) return null;
  return `[OPEN API] NASA Mars Rover mission manifest\nRover: ${m.name}\nLaunch date: ${m.launch_date}\nLanding date on Mars: ${m.landing_date}\n` +
         `Mission status: ${m.status}\nLast day with photos: sol ${m.max_sol} (${m.max_date})\nTotal photos in the archive: ${m.total_photos}`;
}

function reply(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

export default async (req) => {
  if (req.method !== "POST") return reply({ answer: "", source_label: "None", has_data: false }, 405);

  let question = "", lang = "en";
  try { ({ question = "", lang = "en" } = await req.json()); } catch {}
  lang = lang === "id" ? "id" : "en";   // default English; "id" = Bahasa Indonesia
  question = String(question).slice(0, 300).trim();
  if (!question) return reply({ answer: NO_INFO[lang], source_label: "None", has_data: false }, 400);

  if (!process.env.GEMINI_API_KEY) {
    return reply({ answer: "", source_label: "None", has_data: false,
      devError: "GEMINI_API_KEY belum diisi di Netlify (Project configuration > Environment variables). Setelah diisi, lakukan deploy ulang." }, 500);
  }

  // 1) Kumpulkan fakta dari ketiga sumber NASA (sumber 2 dan 3 dicari bersamaan)
  const catalog = searchCatalog(question);
  const words = keywords(question);
  const rover = roverIn(question);
  const [images, manifest] = await Promise.all([
    searchImages(catalog ? catalog.imageQuery : words.slice(0, 5).join(" ")).catch(() => []),
    rover ? roverManifest(rover).catch(() => null) : Promise.resolve(null),
  ]);

  const parts = [], labels = [];
  if (catalog) { parts.push(catalog.text); labels.push("Aggregate Data"); }
  if (images.length) {
    parts.push("[IMAGE LIBRARY]\n" + images.map((it, i) =>
      `(${i + 1}) Title: ${it.title}\nDate: ${it.date}\nNASA center: ${it.center}\nDescription: ${it.description}`).join("\n\n"));
    labels.push("NASA Image Library");
  }
  if (manifest) { parts.push(manifest); labels.push("NASA Open API"); }

  // Tanpa data NASA, blok konteks dikirim kosong: Gemini hanya boleh menjawab kalau topiknya luar angkasa, fisika, atau fenomena langit
  const userTurn = `lang: ${lang}\n<nasa_context>\n${parts.join("\n\n")}\n</nasa_context>\n\nChild's question: ${question}`;

  // 2) Minta Gemini menceritakan fakta tadi
  const g = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: userTurn }] }],
      // Tidak ada "tools": Google Search dan alat lain MATI, jadi Gemini hanya melihat data NASA.
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 800,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: { answer: { type: "STRING" }, basis: { type: "STRING", enum: ["nasa", "general", "none"] } },
          required: ["answer", "basis"],
        },
      },
    }),
  });

  if (g.status === 429) return reply({ answer: BUSY[lang], source_label: "None", has_data: false, devError: "Batas gratis Gemini tercapai (429). Tunggu sebentar." }, 429);
  if (!g.ok) {
    const detail = (await g.text()).slice(0, 300);
    return reply({ answer: "", source_label: "None", has_data: false, devError: `Gemini error ${g.status}: ${detail}` }, 502);
  }

  const data = await g.json();
  let out;
  try { out = JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}"); } catch { out = {}; }
  if (!out.answer) return reply({ answer: NO_INFO[lang], source_label: "None", has_data: false });

  // 3) Kirim jawaban + label sumber + 1 foto NASA (foto hanya kalau Spirit benar-benar memakai data NASA)
  let basis = ["nasa", "general", "none"].includes(out.basis) ? out.basis : "none";
  if (basis === "nasa" && !parts.length) basis = "general";       // tidak ada data NASA = tidak boleh berlabel NASA
  if (basis === "none") return reply({ answer: NO_INFO[lang], source_label: "None", has_data: false });
  const first = images[0];
  return reply({
    answer: out.answer,
    source_label: basis === "nasa" ? labels.join(" · ") : "AI General Knowledge",
    has_data: basis === "nasa",
    image: basis === "nasa" && first?.thumb ? { url: first.thumb, title: first.title, nasa_id: first.nasa_id } : null,
  });
};
