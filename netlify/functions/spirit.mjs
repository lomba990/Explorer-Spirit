// AI DISCLOSURE: this code was written by Team NASA Chat Bot with AI assistance from Claude (Anthropic).
// At runtime, answers are written by Google Gemini (Flash-Lite) from the NASA data found below.
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
import MARS from "../../data/mars-hardware.mjs";
import ASTRO from "../../data/astronaut-facts.mjs";
import SPACE from "../../data/space-facts.mjs";
const TOPICS = [...ASTRO.topics.map(t => ({ ...t, src: ASTRO.source })), ...SPACE.topics.map(t => ({ ...t, src: SPACE.source }))];

// Model Gemini, dicoba berurutan. Flash-Lite dipakai karena paling cepat (Flash biasa bisa lebih dari 6 detik).
// Mau pakai model lain? Isi environment variable GEMINI_MODEL di Netlify, misalnya gemini-flash-latest.
const MODELS = [process.env.GEMINI_MODEL, "gemini-flash-lite-latest", "gemini-3.1-flash-lite", "gemini-flash-latest"].filter(Boolean);
// Netlify menghentikan fungsi setelah 10 detik. Semua batas waktu dijaga supaya totalnya di bawah itu.
const TOTAL_BUDGET_MS = 9300;        // batas total satu jawaban
const NASA_TIMEOUT_MS = 2500;        // batas tunggu sumber NASA
let MODEL = MODELS[0];               // model yang terakhir berhasil (ditampilkan di halaman cek)
const TRANSLATE_MS = 3500;           // batas waktu menerjemahkan pertanyaan ke kata kunci bahasa Inggris

// Bahasa yang didukung. Data NASA berbahasa Inggris; untuk bahasa selain en/id,
// pertanyaan anak diterjemahkan dulu ke bahasa Inggris supaya cocok dengan data NASA.
const LANGS = {
  en: "English", id: "Bahasa Indonesia", es: "Spanish", fr: "French", pt: "Portuguese (Brazil)",
  zh: "Chinese (Simplified characters)", ja: "Japanese", ar: "Arabic (Modern Standard Arabic)", hi: "Hindi (Devanagari script)",
};
const NEEDS_ENGLISH_SEARCH = new Set(["es", "fr", "pt", "zh", "ja", "ar", "hi"]);

// Panggil Gemini: kalau nama model tidak dikenal (404) atau pengaturan thinking ditolak (400), langsung coba berikutnya
async function askGemini(payload, deadline) {
  let last;
  for (const model of MODELS) {
    for (const thinking of [true, false]) {
      const left = deadline - Date.now();
      if (left < 1500) throw Object.assign(new Error("waktu habis"), { name: "TimeoutError" });
      const gen = { ...payload.generationConfig };
      if (thinking) gen.thinkingConfig = { thinkingLevel: "minimal" };   // Flash-Lite: hampir tanpa "berpikir" = cepat
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST", signal: withTimeout(left),
        headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
        body: JSON.stringify({ ...payload, generationConfig: gen }),
      });
      if (r.ok) { MODEL = model; return r; }
      last = r;
      if (r.status === 400 && thinking) continue;          // coba lagi tanpa thinkingConfig
      if (r.status === 404 || r.status === 400) break;      // model ini tidak ada: lanjut ke model berikutnya
      return r;                                             // error lain (403, 429, 500): laporkan apa adanya
    }
  }
  return last;
}

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
      - exploration: astronauts, rockets, spacecraft, satellites, space stations, telescopes, NASA and other space agencies,
        space history and famous "firsts", how to become an astronaut, life in space (food, sleep, health, fun);
      - big questions: is there life on other planets (say honestly that none has been found yet), the future of space travel;
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
      Imaginative "what if" questions (for example "can a cat go to space?" or "can I sleep on the Moon?") are welcome:
      answer playfully, but every fact you use must be true science.
      Never present this as NASA data or as something you, the Spirit, remember from a mission.
  (b) Anything else (sports, celebrities, politics, homework that is not about space, personal questions),
      or a space question you cannot answer confidently. Set "basis" to "none" and keep "answer" to one short sentence
      (the app then shows its own friendly "I don't have that information yet" message).
- If <nasa_context> covers only part of the question, answer that part from it and say plainly which part you don't know yet.

## 1b. Modes and conversation
- "mode" tells you which button the child pressed: "moon" (objects left on the Moon), "mars" (objects left on Mars),
  or "explore" (anything about space). Stay on that theme unless the child clearly asks about something else in space.
- "conversation" shows the last messages. Use it to understand short replies such as "yes", "ya", "tell me more" or "the second one".
- If the child says yes to "do you want to know what was left behind?", give a short, exciting overview from <nasa_context>
  (a few surprising objects, not a long list) and ask which one they want to hear about.

## 1c. Sad or sensitive topics (for example astronauts who died)
- Answer honestly and briefly, in a calm and gentle voice. Never give frightening or graphic details.
- Say who they were and what they were doing, that they are remembered as brave explorers, how people honour them,
  and that what was learned made spaceflight safer. If the context has a memorial on the Moon or Mars, mention it.
- Do not end with a cheerful joke. A gentle invitation (for example about the memorials) is fine.

## 2. How you tell it (you are a storyteller, not a search engine)
- Speak as the Spirit, warm and curious. With NASA data, speak in first person ("I was there when…") and keep the facts exactly as given.
  With general science (case a), speak as a friendly guide ("Scientists have learned that…"), not as a witness.
- Explain what the object is and why it was left, using only the context. Do not just list items.
- Short sentences, everyday words. Explain any hard word in a few simple words.
- 80–150 words (in Chinese or Japanese, about 150–300 characters). Plain text only: no markdown, no bullet points, no emoji (your words are read aloud).
- End with one short question that invites the child to keep exploring.
- Keep accidents or failures calm and factual.

## 3. Language
- Answer ONLY in the language named in "lang" (en English, id Bahasa Indonesia, es Spanish, fr French,
  pt Brazilian Portuguese, zh Chinese with Simplified characters, ja Japanese, ar Modern Standard Arabic, hi Hindi in Devanagari).
  Answer in that language even if the child writes in another one.
- <nasa_context> is in English: translate the facts carefully and keep every number exactly the same.
- Use the simple, everyday words a 10-year-old native speaker of that language uses (for Japanese, prefer easy kanji or hiragana).
- Keep names of missions, spacecraft and people as they are (Apollo 11, Curiosity, Neil Armstrong).
  Explain object names in the child's language; you may add the official English name once in brackets.

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

// Pesan tetap ("belum punya informasi", "sedang ramai") ditulis di index.html dalam 9 bahasa.
// Otak cukup mengirim kodenya lewat "notice".
const NO_INFO = { answer: "", notice: "noInfo", source_label: "None", has_data: false };

// Ubah pertanyaan bahasa lain menjadi bahasa Inggris sederhana, KHUSUS untuk mencari data NASA.
// Jawaban untuk anak tetap ditulis dalam bahasa pilihannya. Gagal/terlalu lama = pakai pertanyaan asli.
async function toEnglish(question, previous, deadline) {
  const r = await askGemini({
    system_instruction: { parts: [{ text:
      "You turn a child's message about space into plain English, only so that an app can search NASA data with keywords. " +
      "Translate faithfully and do not answer. Keep names of missions, spacecraft and people as they are (Apollo 11, Curiosity). " +
      "Use simple everyday English words (poop, pee, vomit, flag, golf ball, feather, car, rocket, astronaut). " +
      "If a message is empty or '(none)', return an empty string for it." }] },
    contents: [{ role: "user", parts: [{ text: `current: ${question}\nprevious: ${previous || "(none)"}` }] }],
    generationConfig: {
      temperature: 0, maxOutputTokens: 200, responseMimeType: "application/json",
      responseSchema: { type: "OBJECT", properties: { current: { type: "STRING" }, previous: { type: "STRING" } }, required: ["current", "previous"] },
    },
  }, Math.min(deadline - 4500, Date.now() + TRANSLATE_MS));   // sisakan waktu untuk jawaban utama
  if (!r?.ok) return null;
  const data = await r.json();
  const text = (data?.candidates?.[0]?.content?.parts || []).filter(p => p.text && !p.thought).map(p => p.text).join("");
  try {
    const o = JSON.parse(text);
    const clean = (s) => String(s || "").replace(/^\(none\)$/i, "").slice(0, 300).trim();
    return o.current ? { current: clean(o.current), previous: clean(o.previous) } : null;
  } catch { return null; }
}

// ---------- Kata kunci ----------
// Kata umum yang dibuang supaya pencarian lebih tepat
const STOP = new Set(`a an the is are was were be what whats who whom which where when why how do does did can could
would will tell me about of on in at to for from with and or that this those these there it its i you your my we our
please story spirit hi hello hey kind thing things left behind leave still moon's
apa siapa dimana di mana kapan kenapa mengapa bagaimana itu ini yang dan atau dari ke pada untuk dengan tentang
ceritakan cerita tolong dong ya aku saya kamu kami kita ada adalah sih kah apakah benda bisa boleh mau tahu
ditinggalkan ditinggal tinggal masih yes yeah yep sure ok okay tentu iya oke more lagi happened happen terjadi sekarang now many much banyak total jumlah estimasi kira-kira about`.split(/\s+/));

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
  // kata anak-anak untuk kotoran, pipis dan muntah -> nama resmi di katalog NASA
  poo: "defecation", pup: "defecation", eek: "defecation", tai: "defecation", tahi: "defecation", tinja: "defecation",
  feses: "defecation", berak: "defecation", feces: "defecation", faeces: "defecation",
  pee: "urine", wee: "urine", pipis: "urine", kencing: "urine", urin: "urine",
  vomit: "emesis", puke: "emesis", muntah: "emesis", sampah: "disposal", trash: "disposal", garbage: "disposal", rubbish: "disposal",
};
// Kata yang terlalu umum di katalog (hampir semua baris mengandung "lunar")
const CATALOG_NOISE = new Set(["moon", "bulan", "lunar", "apollo", "mars", "nasa", "mission", "misi", "astronaut", "astronauts",
  "astronot", "cosmonaut", "cosmonauts", "objects", "object", "space", "luar", "angkasa",
  "sky", "langit", "blue", "biru", "color", "colour", "warna"]);   // "kenapa langit biru" bukan soal handuk biru Apollo 12

// "parachutes" -> "parachute", "boxes" -> "box": supaya bentuk jamak tetap cocok
const stem = (w) => w.length <= 3 ? w : /(ses|xes|zes|ches|shes)$/.test(w) ? w.slice(0, -2) : /[^s]s$/.test(w) ? w.slice(0, -1) : w;
const wordRe = (w) => new RegExp(`(^|[^a-z])${stem(w).replace(/[^a-z0-9-]/g, "")}(s|es)?([^a-z]|$)`);

function keywords(q) {
  q = q.toLowerCase().replace(/buang air besar/g, "defecation").replace(/buang air kecil/g, "urine");
  return q.replace(/[^\p{L}\p{N}\s'-]/gu, " ").split(/\s+/)
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

// ---------- Sumber 1a: Katalog NASA 2012 (Bulan) ----------
function searchCatalog(question) {
  const words = keywords(question).filter(w => w.length > 2 && !CATALOG_NOISE.has(w) && !/^\d+$/.test(w));
  const missions = missionsIn(question);
  // Cocokkan kata utuh (boleh bentuk jamak): "ball" cocok dengan "balls", tapi "one" tidak cocok dengan "cone"
  const patterns = words.map(wordRe);
  const scored = [];
  for (const it of CATALOG.items) {
    const obj = it.object.toLowerCase(), mis = it.mission.toLowerCase();
    let score = 0;
    for (const re of patterns) if (re.test(obj)) score += 2;
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
  return catalogBlock(rows, `${rows[0].mission} ${rows[0].object.replace(/\(.*?\)|\[.*?\]/g, "").split(/[,/]/)[0]}`.trim());
}

function catalogBlock(rows, imageQuery) {
  const missionNames = [...new Set(rows.map(r => r.mission))];
  const header = missionNames.filter(m => CATALOG.missions[m]).map(m => {
    const total = CATALOG.items.filter(i => i.mission === m).length;
    const site = CATALOG.missions[m].landing_site;
    return `${m}: ${total} rows in the catalogue` + (site ? `, landing location ${site}` : "");
  });
  const lines = rows.map(r =>
    `- ${r.mission} | ${r.object}` + (r.qty ? ` [${r.qty}]` : "") + (r.location ? ` | location: ${r.location}` : ""));
  return { text: `[CATALOGUE] ${CATALOG.source}\n` + (header.length ? header.join("\n") + "\n" : "") + lines.join("\n") + glossary(rows), imageQuery };
}

// Arti nama-nama resmi di katalog yang membingungkan, plus jumlahnya, supaya Gemini bisa menjelaskan ke anak
const GLOSSARY = [
  { re: /defecation/i, text: "Defecation Collection Device = a bag that collected an astronaut's poop" },
  { re: /urine/i, text: "Urine collection assembly = equipment that collected an astronaut's pee" },
  { re: /emesis/i, text: "Bag, Emesis = a sick bag for vomit" },
  { re: /^s-ivb$/i, text: "S-IVB = the third stage of the Saturn V rocket, crashed into the Moon on purpose for experiments" },
  { re: /\bplss\b/i, text: "PLSS = Portable Life Support System, the backpack that gave an astronaut air on the Moon" },
  { re: /lrv|roving vehicle/i, text: "Lunar Roving Vehicle (LRV) = the Moon buggy the astronauts drove" },
];
function glossary(rows) {
  const out = [];
  for (const g of GLOSSARY) {
    if (!rows.some(r => g.re.test(r.object))) continue;
    const all = CATALOG.items.filter(i => g.re.test(i.object));
    const perMission = {};
    all.forEach(i => { perMission[i.mission] = (perMission[i.mission] || 0) + (i.qty || 1); });
    const total = Object.values(perMission).reduce((a, b) => a + b, 0);
    out.push(`${g.text}. In the whole catalogue these add up to ${total} (` +
      Object.entries(perMission).map(([m, n]) => `${m}: ${n}`).join(", ") + ").");
  }
  return out.length ? "\nWhat the official names mean:\n" + out.map(x => "- " + x).join("\n") : "";
}

// Ringkasan katalog Bulan: dipakai kalau anak menjawab "ya" atau bertanya umum "apa saja yang ditinggalkan?"
const MOON_HIGHLIGHTS = ["Golf balls", "Fallen Astronaut", "Falcon feather", "Hammer and Feather", "Charles Duke family photograph",
  "Lunar Roving Vehicle (LRV)", "Lunar Retro-Ranging Reflector", "Gold Olive Branch", "Moon Memorial Disc", "Javelin",
  "Bible", "100 2-dollar bills", "Lunokhod 1", "Surveyor 3", "Nail Clippers"];
function moonOverview() {
  const rows = [];
  for (const h of MOON_HIGHLIGHTS) { const it = CATALOG.items.find(i => i.object.startsWith(h)); if (it) rows.push(it); }
  const groups = {};
  CATALOG.items.forEach(i => { groups[i.group] = (groups[i.group] || 0) + 1; });
  const summary = `Total rows in the catalogue: ${CATALOG.items.length}\nRows per group: ` +
    Object.entries(groups).map(([g, n]) => `${g} ${n}`).join(", ");
  const block = catalogBlock(rows, "Apollo lunar surface experiments");
  block.text = block.text.replace("\n", `\n${summary}\nSome notable objects:\n`);
  return block;
}

// ---------- Sumber 1b: Daftar benda di Mars ----------
const MARS_NOISE = new Set(["mars", "planet", "red", "merah", "left", "nasa", "mission", "misi", "object", "objects", "landed", "mendarat"]);
const MARS_SYNONYMS = { parasut: "parachute", helikopter: "helicopter", tabung: "tube", sampel: "sample", perisai: "shield",
  pemberat: "tungsten", bendera: "pennant", flag: "pennant", soviet: "soviet", rusia: "soviet", cina: "china", tiongkok: "china",
  eropa: "esa", inggris: "beagle", pendarat: "lander", mobil: "rover", "sky": "crane" };
function marsLine(it, full) {
  return `- ${it.object} | ${it.agency} | mission: ${it.mission} | arrived: ${it.landed} | location: ${it.location} | status: ${it.status}` +
    (full ? ` | left behind: ${it.left_behind}` + (it.notes ? ` | ${it.notes}` : "") + (it.hirise ? ` | seen in NASA HiRISE image ${it.hirise}` : "") : "");
}
function searchMars(question, overviewIfNone) {
  const q = question.toLowerCase().replace(/explorer spirit/g, "");
  const words = keywords(q).map(w => MARS_SYNONYMS[w] || w).filter(w => w.length > 2 && !MARS_NOISE.has(w) && !/^\d+$/.test(w));
  if (/\bspirit\s+rover\b|\brover\s+spirit\b|\bmer-a\b/.test(q)) words.push("spirit");   // "Spirit" saja = nama chatbot
  const missionNo = [...q.matchAll(/\bmars\s*(\d)\b/g)].map(m => "mars " + m[1]);   // "Mars 2", "Mars 3"
  const scored = MARS.items.map(it => {
    const hay = [it.object, it.agency, it.mission, it.left_behind, it.notes].join(" ").toLowerCase();
    let score = 0;
    for (const w of words) if (wordRe(w).test(hay)) score += 1;
    if (missionNo.includes(it.mission.toLowerCase())) score += 3;
    if (words.some(w => it.object.toLowerCase().includes(stem(w)))) score += 2;   // nama benda disebut langsung
    return { it, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);
  const hits = scored.filter(x => x.score >= scored[0].score - 1).slice(0, 4).map(x => x.it);
  if (hits.length) {
    return { text: `[CATALOGUE] ${MARS.source}\n${MARS.summary}\n` + hits.map(it => marsLine(it, true)).join("\n"), imageQuery: hits[0].object };
  }
  if (!overviewIfNone) return null;
  return { text: `[CATALOGUE] ${MARS.source}\n${MARS.summary}\nAll objects (short list):\n` + MARS.items.map(it => marsLine(it, false)).join("\n"),
           imageQuery: "Mars rover landing" };
}

// ---------- Sumber 1c: Fakta astronot ----------
function searchAstronaut(text) {
  const q = " " + text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, " ").replace(/\s+/g, " ") + " ";
  const hits = TOPICS
    .filter(tp => !tp.requireAny || tp.requireAny.some(k => q.includes(" " + k + " ")))   // misal "berapa lama" harus bersama "bulan"
    .filter(tp => !tp.excludeAny || !tp.excludeAny.some(k => q.includes(" " + k + " ")))  // misal "satelit mati" bukan soal astronot gugur
    .map(tp => ({ tp, score: tp.keywords.filter(k => q.includes(" " + k + " ")).length }))
    .filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 2).map(x => x.tp);
  if (!hits.length) return null;
  return {
    text: `[CATALOGUE] ${[...new Set(hits.map(tp => tp.src))].join("; ")}\n` +
      hits.map(tp => `Topic: ${tp.id}${tp.sensitive ? " (sensitive: answer gently)" : ""}\n` +
      tp.facts.map(f => "- " + f).join("\n")).join("\n\n"),
    imageQuery: hits[0].image,
    catalogQuery: hits.find(tp => tp.catalogQuery)?.catalogQuery || "",
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
  try {
    return await handle(req);
  } catch (err) {
    // Apa pun yang gagal, halaman tetap menerima JSON (bukan halaman error) supaya pesannya jelas
    return reply({ answer: "", source_label: "None", has_data: false, devError: "Error di otak chatbot: " + (err?.message || err) }, 500);
  }
};

// ---------- Halaman cek: buka /.netlify/functions/spirit di browser ----------
async function diagnose() {
  const report = { explorer_spirit_check: "Halaman cek Explorer Spirit", checked_at: new Date().toISOString() };
  const t0 = Date.now();
  report["1_GEMINI_API_KEY"] = process.env.GEMINI_API_KEY ? "OK: sudah diisi" : "GAGAL: belum diisi di Netlify Environment variables (lalu deploy ulang)";
  report["2_NASA_API_KEY"] = process.env.NASA_API_KEY ? "OK: sudah diisi" : "Belum diisi (tidak wajib, data rover Mars memakai DEMO_KEY)";
  report["3_data"] = `OK: katalog Bulan ${CATALOG.items.length} baris, daftar Mars ${MARS.items.length} benda, fakta astronot ${ASTRO.topics.length} topik, fakta luar angkasa ${SPACE.topics.length} topik`;
  report["3b_bahasa"] = `OK: ${Object.keys(LANGS).length} bahasa (${Object.keys(LANGS).join(", ")})`;
  try {
    const t = Date.now(); const imgs = await searchImages("Apollo 14 golf");
    report["4_NASA_Image_Library"] = imgs.length ? `OK: ${imgs.length} hasil dalam ${Date.now() - t} ms` : "GAGAL: tidak ada hasil";
  } catch (e) { report["4_NASA_Image_Library"] = "GAGAL: " + (e?.name === "TimeoutError" ? "lebih dari 3 detik" : e?.message); }
  if (process.env.GEMINI_API_KEY) {
    const t = Date.now();
    try {
      const r = await askGemini({ contents: [{ role: "user", parts: [{ text: "Reply with the single word: ready" }] }],
        generationConfig: { maxOutputTokens: 50 } }, Date.now() + 8500);
      const txt = await r.text();
      report["5_Gemini"] = r.ok ? `OK: model ${MODEL} menjawab dalam ${Date.now() - t} ms` : `GAGAL: HTTP ${r.status} — ${txt.slice(0, 400)}`;
    } catch (e) {
      report["5_Gemini"] = "GAGAL: " + (e?.name === "TimeoutError" || e?.name === "AbortError" ? `lebih dari 8 detik (model dicoba: ${MODELS.join(", ")})` : e?.message);
    }
  } else report["5_Gemini"] = "Dilewati karena GEMINI_API_KEY belum diisi";
  report["total_ms"] = Date.now() - t0;
  return new Response(JSON.stringify(report, null, 2), { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } });
}

async function handle(req) {
  const deadline = Date.now() + TOTAL_BUDGET_MS;
  if (req.method === "GET") return diagnose();
  if (req.method !== "POST") return reply({ answer: "", source_label: "None", has_data: false }, 405);

  let body = {};
  try { body = await req.json(); } catch {}
  const lang = Object.hasOwn(LANGS, body.lang) ? body.lang : "en";   // default English
  const mode = ["moon", "mars", "explore"].includes(body.mode) ? body.mode : "explore";
  const question = String(body.question || "").slice(0, 300).trim();
  const history = (Array.isArray(body.history) ? body.history : []).slice(-6)
    .map(h => `${h.role === "kid" ? "Child" : "Spirit"}: ${String(h.text || "").slice(0, 400)}`).join("\n");
  if (!question) return reply(NO_INFO, 400);

  if (!process.env.GEMINI_API_KEY) {
    return reply({ answer: "", source_label: "None", has_data: false,
      devError: "GEMINI_API_KEY belum diisi di Netlify (Project configuration > Environment variables). Setelah diisi, lakukan deploy ulang." }, 500);
  }

  // 1) Kumpulkan fakta dari sumber NASA sesuai tombol yang dipilih
  let lastKid = String((Array.isArray(body.history) ? body.history : []).filter(h => h.role === "kid").slice(-1)[0]?.text || "").slice(0, 300);
  let searchQ = question, english = null;
  if (NEEDS_ENGLISH_SEARCH.has(lang)) {             // misal "¿Qué dejaron en la Luna?" -> "What did they leave on the Moon?"
    english = await toEnglish(question, lastKid, deadline).catch(() => null);
    if (english) { searchQ = english.current; lastKid = english.previous || lastKid; }
  }
  const searchText = searchQ + " " + (keywords(searchQ).length <= 1 ? lastKid : "");   // jawaban pendek "ya" -> pakai pertanyaan sebelumnya
  const astro = searchAstronaut(searchText);            // pertanyaan tentang astronot (di semua tombol)
  let local = null;
  const astroCatalog = astro?.catalogQuery && mode !== "mars" ? searchCatalog(astro.catalogQuery) : null;   // misal kantong kotoran di Bulan
  if (mode === "moon") local = searchCatalog(searchText) || astroCatalog || (astro ? null : moonOverview());
  else if (mode === "mars") local = searchMars(searchText, !astro);
  else {
    // Tombol Explore More: daftar Mars hanya dipakai kalau Mars atau wahananya disebut
    const marsNamed = /\b(mars|viking|pathfinder|sojourner|opportunity|phoenix|curiosity|insight|perseverance|ingenuity|beagle|schiaparelli|zhurong|tianwen)\b|spirit rover/.test(searchText.toLowerCase());
    // Pertanyaan astronot yang juga menyebut benda di katalog ("siapa yang meninggalkan bola golf?") -> kirim keduanya
    if (astro && !missionsIn(searchText).length) local = astroCatalog || searchCatalog(searchText) || (marsNamed ? searchMars(searchText, false) : null);
    else local = searchCatalog(searchText) || (marsNamed ? searchMars(searchText, false) : null);
  }

  const words = keywords(searchText);
  const rover = roverIn(searchText);
  const [images, manifest] = await Promise.all([
    searchImages(astro ? astro.imageQuery : local ? local.imageQuery : words.slice(0, 5).join(" ")).catch(() => []),
    rover ? roverManifest(rover).catch(() => null) : Promise.resolve(null),
  ]);

  const parts = [], labels = [];
  if (astro) parts.push(astro.text);
  if (local) parts.push(local.text);
  if (astro || local) labels.push("Aggregate Data");
  if (images.length) {
    parts.push("[IMAGE LIBRARY]\n" + images.map((it, i) =>
      `(${i + 1}) Title: ${it.title}\nDate: ${it.date}\nNASA center: ${it.center}\nDescription: ${it.description}`).join("\n\n"));
    labels.push("NASA Image Library");
  }
  if (manifest) { parts.push(manifest); labels.push("NASA Open API"); }

  // Tanpa data NASA, blok konteks dikirim kosong: Gemini hanya boleh menjawab kalau topiknya luar angkasa, fisika, atau fenomena langit
  const userTurn = `lang: ${lang} (${LANGS[lang]})\nmode: ${mode}\nconversation:\n${history || "(none)"}\n<nasa_context>\n${parts.join("\n\n")}\n</nasa_context>\n\nChild's question: ${question}`;

  // 2) Minta Gemini menceritakan fakta tadi
  let g;
  try {
    g = await askGemini({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: userTurn }] }],
      // Tidak ada "tools": Google Search dan alat lain MATI.
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1200,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: { answer: { type: "STRING" }, basis: { type: "STRING", enum: ["nasa", "general", "none"] } },
          required: ["answer", "basis"],
        },
      },
    }, deadline);
  } catch (e) {
    return reply({ answer: "", source_label: "None", has_data: false,
      devError: e?.name === "TimeoutError" || e?.name === "AbortError" ? "Gemini terlalu lama menjawab (batas total 9 detik)." : "Tidak bisa menghubungi Gemini: " + e?.message }, 504);
  }

  if (g.status === 429) return reply({ answer: "", notice: "busy", source_label: "None", has_data: false, devError: "Batas gratis Gemini tercapai (429). Tunggu sebentar." }, 429);
  if (!g.ok) {
    const detail = (await g.text()).slice(0, 300);
    return reply({ answer: "", source_label: "None", has_data: false, devError: `Gemini error ${g.status}: ${detail}` }, 502);
  }

  const data = await g.json();
  let out;
  const text = (data?.candidates?.[0]?.content?.parts || []).filter(p => p.text && !p.thought).map(p => p.text).join("");
  try { out = JSON.parse(text || "{}"); } catch { out = {}; }
  if (!out.answer) return reply({ ...NO_INFO,
    devError: "Gemini menjawab, tapi isinya tidak bisa dibaca: " + (text || JSON.stringify(data).slice(0, 300)).slice(0, 300) });

  // 3) Kirim jawaban + label sumber + 1 foto NASA (foto hanya kalau Spirit benar-benar memakai data NASA)
  let basis = ["nasa", "general", "none"].includes(out.basis) ? out.basis : "none";
  if (basis === "nasa" && !parts.length) basis = "general";       // tidak ada data NASA = tidak boleh berlabel NASA
  if (basis === "none") return reply(NO_INFO);
  const first = images[0];
  return reply({
    answer: out.answer,
    source_label: basis === "nasa" ? labels.join(" · ") : "AI General Knowledge",
    has_data: basis === "nasa",
    image: basis === "nasa" && first?.thumb ? { url: first.thumb, title: first.title, nasa_id: first.nasa_id } : null,
  });
}
