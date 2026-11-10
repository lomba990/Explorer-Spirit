// Daftar perangkat NASA yang ada di permukaan Mars (untuk tombol Mars).
// Disusun dari informasi misi NASA (NASA NSSDC Master Catalog dan halaman misi NASA).
// Tahun ditulis tanpa tanggal persis supaya aman. Silakan tambah atau perbaiki bila perlu.
export default {
  source: "Explorer Spirit list of NASA hardware on Mars, compiled from NASA mission information (NSSDC Master Catalog, NASA mission pages)",
  items: [
    { object: "Viking 1 lander", mission: "Viking 1", type: "lander", landed: 1976, location: "Chryse Planitia",
      status: "Mission ended. Last contact in 1982", notes: "First successful NASA landing on Mars. Its site is named the Thomas Mutch Memorial Station." },
    { object: "Viking 2 lander", mission: "Viking 2", type: "lander", landed: 1976, location: "Utopia Planitia",
      status: "Mission ended. Last contact in 1980", notes: "Its site is named the Gerald Soffen Memorial Station." },
    { object: "Mars Pathfinder lander", mission: "Mars Pathfinder", type: "lander", landed: 1997, location: "Ares Vallis",
      status: "Mission ended. Last contact in 1997", notes: "Landed using airbags that bounced on the ground. Its site is named the Carl Sagan Memorial Station." },
    { object: "Sojourner rover", mission: "Mars Pathfinder", type: "rover", landed: 1997, location: "Ares Vallis",
      status: "Mission ended in 1997", notes: "NASA's first rover on Mars, about the size of a microwave oven." },
    { object: "Mars Polar Lander and Deep Space 2 probes", mission: "Mars Surveyor '98", type: "lander and probes", landed: 1999,
      location: "Near the south pole of Mars (exact spot unknown)", status: "Contact was lost during landing in 1999", notes: "" },
    { object: "Spirit rover", mission: "Mars Exploration Rover (MER-A)", type: "rover", landed: 2004, location: "Gusev crater",
      status: "Mission ended. Last contact in 2010 after it got stuck in soft sand", notes: "Twin of Opportunity. Landed with airbags." },
    { object: "Opportunity rover", mission: "Mars Exploration Rover (MER-B)", type: "rover", landed: 2004, location: "Meridiani Planum",
      status: "Mission ended. Last contact in 2018 during a giant dust storm", notes: "Its landing area is named the Challenger Memorial Station. Planned for about 90 days, it worked for many years." },
    { object: "Phoenix lander", mission: "Phoenix", type: "lander", landed: 2008, location: "Vastitas Borealis, near the north pole",
      status: "Mission ended in 2008", notes: "Its heat shield also lies on the surface nearby." },
    { object: "Curiosity rover", mission: "Mars Science Laboratory", type: "rover", landed: 2012, location: "Gale crater",
      status: "Still working", notes: "Lowered to the ground by a rocket-powered sky crane. The sky crane, heat shield, back shell and parachute were left on Mars." },
    { object: "InSight lander", mission: "InSight", type: "lander", landed: 2018, location: "Elysium Planitia",
      status: "Mission ended in 2022 when dust covered its solar panels", notes: "Listened for marsquakes with a seismometer." },
    { object: "Perseverance rover", mission: "Mars 2020", type: "rover", landed: 2021, location: "Jezero crater",
      status: "Still working", notes: "Collects rock samples in tubes and left some of those tubes on the ground. Its sky crane, heat shield, back shell and parachute were left on Mars." },
    { object: "Ingenuity helicopter", mission: "Mars 2020", type: "helicopter", landed: 2021, location: "Jezero crater",
      status: "Mission ended in 2024 after a rotor blade was damaged", notes: "The first aircraft to make a powered, controlled flight on another planet." },
  ],
};
