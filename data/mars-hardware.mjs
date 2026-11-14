// AI DISCLOSURE: compiled and summarised with AI assistance (Claude, Anthropic) from the sources listed below; checked by the team.
// Daftar benda buatan manusia di permukaan Mars (untuk tombol Mars).
// Sumber:
//  - Informasi misi NASA (NSSDC Master Catalog, halaman misi NASA/JPL)
//  - Foto orbit HiRISE (kamera NASA di Mars Reconnaissance Orbiter) yang dikutip azmth.space/mars/missions/descent-hardware
//  - T. Hotham (2026), "Junk on the Moon and Mars", Zenodo, doi:10.5281/zenodo.23872995
//    (preprint independen yang disusun dari daftar Wikipedia; dipakai untuk benda kecil dan angka ringkasan)
// Tahun ditulis tanpa tanggal persis supaya aman. Silakan tambah atau perbaiki bila perlu.
export default {
  aiAssistance: "Compiled with AI assistance (Claude, Anthropic); checked by the team",
  source: "Explorer Spirit list of human-made objects on Mars, compiled from NASA mission information, " +
          "NASA HiRISE orbital images (as listed by azmth.space) and T. Hotham (2026), Junk on the Moon and Mars, Zenodo",
  summary: "Hotham (2026) counts 27 human-made objects on Mars weighing about 10,380 kg in total. " +
           "Of 16 attempted landings on Mars, 11 succeeded; the United States succeeded in 9 of 10. " +
           "Only Curiosity and Perseverance are still working.",
  items: [
    // ---------- NASA ----------
    { object: "Viking 1 lander", agency: "NASA", mission: "Viking 1", landed: 1976, location: "Chryse Planitia",
      status: "Mission ended. Last contact in 1982",
      left_behind: "lander (about 3 m across); likely heat shield, backshell and parachute spotted from orbit but not confirmed",
      notes: "First successful NASA landing on Mars. Its site is named the Thomas Mutch Memorial Station.", hirise: "PSP_001521_2025" },
    { object: "Viking 2 lander", agency: "NASA", mission: "Viking 2", landed: 1976, location: "Utopia Planitia",
      status: "Mission ended. Last contact in 1980",
      left_behind: "lander, likely heat shield and backshell, and the shroud of its surface sampler arm",
      notes: "Its site is named the Gerald Soffen Memorial Station.", hirise: "PSP_001501_2280" },
    { object: "Mars Pathfinder lander", agency: "NASA", mission: "Mars Pathfinder", landed: 1997, location: "Ares Vallis",
      status: "Mission ended. Last contact in 1997",
      left_behind: "lander with its ramps and airbag remnants; backshell and parachute to the south; possible heat shield pieces",
      notes: "Landed by bouncing on airbags. Its site is named the Carl Sagan Memorial Station.", hirise: "PSP_001890_1995" },
    { object: "Sojourner rover", agency: "NASA", mission: "Mars Pathfinder", landed: 1997, location: "Ares Vallis",
      status: "Mission ended in 1997", left_behind: "the rover itself",
      notes: "NASA's first rover on Mars, about the size of a microwave oven." },
    { object: "Mars Polar Lander and Deep Space 2 probes", agency: "NASA", mission: "Mars Surveyor '98", landed: 1999,
      location: "Near the south pole of Mars (exact spot unknown)", status: "Contact was lost during landing in 1999",
      left_behind: "the lander and two small probes, never found", notes: "" },
    { object: "Spirit rover", agency: "NASA", mission: "Mars Exploration Rover (MER-A)", landed: 2004, location: "Gusev crater",
      status: "Mission ended. Last contact in 2010 after it got stuck in soft sand",
      left_behind: "rover; landing platform near a small crater named Sleepy Hollow; parachute; cone-shaped backshell; heat shield pieces",
      notes: "Twin of Opportunity. Landed with airbags.", hirise: "PSP_001513_1655" },
    { object: "Opportunity rover", agency: "NASA", mission: "Mars Exploration Rover (MER-B)", landed: 2004, location: "Eagle crater, Meridiani Planum",
      status: "Mission ended. Last contact in 2018 during a giant dust storm",
      left_behind: "rover; landing platform with airbag remains; parachute still attached to its backshell; heat shield crash site",
      notes: "Its landing area is named the Challenger Memorial Station. Planned for about 90 days, it worked for many years. " +
             "The rover even drove past and photographed its own heat shield.", hirise: "ESP_050177_1780" },
    { object: "Phoenix lander", agency: "NASA", mission: "Phoenix", landed: 2008, location: "Vastitas Borealis, near the north pole",
      status: "Mission ended in 2008",
      left_behind: "lander, heat shield, and backshell with parachute",
      notes: "Every polar winter a layer of carbon dioxide frost (dry ice) covers them, so they disappear from orbital photos.", hirise: "ESP_016160_2485" },
    { object: "Curiosity rover", agency: "NASA", mission: "Mars Science Laboratory", landed: 2012, location: "Gale crater",
      status: "Still working",
      left_behind: "crashed descent stage (the rocket-powered sky crane), heat shield, backshell with parachute, " +
                   "and tungsten weights: two cruise balance blocks of about 75 kg each dropped before entry, and six 25 kg blocks dropped later",
      notes: "Its parachute opened to nearly 16 m (51 ft) across. The two big tungsten blocks made craters about 80 km from the landing site.",
      hirise: "ESP_028401_1755, ESP_029245_1755" },
    { object: "InSight lander", agency: "NASA", mission: "InSight", landed: 2018, location: "Elysium Planitia",
      status: "Mission ended in 2022 when dust covered its solar panels",
      left_behind: "lander, heat shield, backshell and parachute",
      notes: "Listened for marsquakes with a seismometer.", hirise: "ESP_058005_1845" },
    { object: "Perseverance rover", agency: "NASA", mission: "Mars 2020", landed: 2021, location: "Jezero crater",
      status: "Still working",
      left_behind: "crashed descent stage (sky crane), heat shield, backshell with parachute, and the Three Forks Sample Depot " +
                   "where the rover laid sample tubes on the ground in 2022; bits of thermal blanket and netting from the landing were found later",
      notes: "Its parachute was about 21.5 m (70.5 ft) across. The Ingenuity helicopter photographed the backshell and parachute from the air in 2022.",
      hirise: "ESP_068294_1985" },
    { object: "Ingenuity helicopter", agency: "NASA", mission: "Mars 2020", landed: 2021, location: "Jezero crater",
      status: "Mission ended in 2024 after a rotor blade was damaged", left_behind: "the helicopter itself",
      notes: "The first aircraft to make a powered, controlled flight on another planet." },

    // ---------- Negara lain ----------
    { object: "Mars 2 lander and PrOP-M rover", agency: "Soviet Union", mission: "Mars 2", landed: 1971, location: "Southern hemisphere (estimated)",
      status: "Crashed in 1971", left_behind: "lander, small rover, and a Soviet pennant (a small flag)",
      notes: "The first human-made object to reach the surface of Mars." },
    { object: "Mars 3 lander", agency: "Soviet Union", mission: "Mars 3", landed: 1971, location: "Ptolemaeus crater (estimated)",
      status: "Landed in 1971 but stopped sending signals within seconds",
      left_behind: "lander and a Soviet pennant (a small flag); a possible parachute, heat shield and retrorocket were seen from orbit but never confirmed",
      notes: "The first soft landing on Mars." },
    { object: "Beagle 2 lander", agency: "United Kingdom / ESA", mission: "Mars Express", landed: 2003, location: "Isidis Planitia",
      status: "Landed in 2003 but never called home; found by NASA's HiRISE camera in 2015",
      left_behind: "lander beside its main parachute, and probably its rear cover", notes: "" },
    { object: "Schiaparelli lander", agency: "ESA", mission: "ExoMars 2016", landed: 2016, location: "Meridiani Planum",
      status: "Crashed in 2016", left_behind: "lander module, parachute with back shell, and heat shield",
      notes: "Its parachute was released too early, so the lander hit the ground at high speed." },
    { object: "Tianwen-1 lander and Zhurong rover", agency: "China", mission: "Tianwen-1", landed: 2021, location: "Southern Utopia Planitia",
      status: "Zhurong stopped working in 2022",
      left_behind: "lander, Zhurong rover, parachute with backshell, and heat shield", notes: "" },
  ],
};
