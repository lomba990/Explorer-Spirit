EXPLORER SPIRIT — STARTER KIT
=============================
Isi folder:
  index.html                     -> halaman chat, suara robot, animasi Spirit, mikrofon
  spirit.png                     -> gambar Explorer Spirit (latar transparan)
  netlify.toml                   -> pengaturan Netlify
  netlify/functions/spirit.mjs   -> "otak" chatbot: ambil data NASA + tanya Gemini
  data/catalog-moon.mjs          -> NASA Catalogue of Manmade Material on the Moon (2012), sudah jadi data
  system-prompt-untuk-AI-Studio.txt -> salinan system prompt untuk diuji di AI Studio

Langkah lengkap ada di dokumen "Panduan Pemula: Explorer Spirit dengan Gemini AI Studio".
Penting: JANGAN menulis API key di file mana pun. Simpan hanya di Netlify:
  GEMINI_API_KEY  (dari Google AI Studio)
  NASA_API_KEY    (dari api.nasa.gov)
Ada masalah? Buka situsmu dengan tambahan ?debug di belakang alamatnya untuk melihat pesan error.
