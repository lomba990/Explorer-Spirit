EXPLORER SPIRIT — STARTER KIT
=============================
Isi folder:
  index.html                     -> halaman chat, 9 bahasa, suara robot, animasi Spirit, mikrofon
  spirit.png                     -> gambar Explorer Spirit (latar transparan)
  netlify.toml                   -> pengaturan Netlify
  netlify/functions/spirit.mjs   -> "otak" chatbot: ambil data NASA + tanya Gemini
  data/catalog-moon.mjs          -> NASA Catalogue of Manmade Material on the Moon (2012), sudah jadi data
  data/mars-hardware.mjs         -> daftar benda di Mars (untuk tombol Mars)
  data/astronaut-facts.mjs       -> 13 topik astronot, Bulan, satelit dan sampah antariksa
  data/space-facts.mjs           -> 20 topik luar angkasa untuk pertanyaan anak (roket, alien, Indonesia, dll.)
  system-prompt-untuk-AI-Studio.txt -> salinan system prompt untuk diuji di AI Studio

Langkah lengkap ada di dokumen "Panduan Pemula: Explorer Spirit dengan Gemini AI Studio".
Penting: JANGAN menulis API key di file mana pun. Simpan hanya di Netlify:
  GEMINI_API_KEY  (dari Google AI Studio)
  NASA_API_KEY    (dari api.nasa.gov)
9 bahasa: English, Indonesia, Espanol, Francais, Portugues, Tionghoa, Jepang, Arab, Hindi.
  - Halaman otomatis memakai bahasa perangkat. Untuk demo, paksa satu bahasa: situsmu.netlify.app/?lang=en
  - Mau selalu mulai English? Di index.html ubah  const AUTO_LANG = true;  menjadi  false
  - Perangkat tanpa suara untuk bahasa itu: Spirit menjawab lewat tulisan saja.
Ada masalah? Buka situsmu dengan tambahan ?debug di belakang alamatnya untuk melihat pesan error.
