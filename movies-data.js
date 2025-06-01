// movies-data.js (файл будет в корне проекта)

const allMoviesData = [
  {
    id: "a-quiet-place",
    titleKey: "movie.a-quiet-place.title", 
    year: 2018,
    rating: "7.5",
    posterUrl: "/static/assets/images/posters/a-quiet-place.jpg", 
    bannerUrl: "/static/assets/images/banner/a-quiet-place.jpg", 
    genreKeys: ["genre.horror", "genre.scifi", "genre.thriller"],
    descriptionKey: "movie.a-quiet-place.description", 
    directorKey: "director.johnkrasinski", 
    actorsKeys: ["actor.emilyblunt", "actor.johnkrasinski", "actor.millicentsimmonds"], 
    trailerUrl: "https://www.youtube.com/embed/WR7cc5t7tv8" 
  },
  {
    id: "avatar-2009",
    titleKey: "movie.avatar-2009.title", // Название фильма: Avatar
    year: 2009,
    rating: "7.9",
    posterUrl: "/static/assets/images/posters/avatar_2009.jpg", // ЗАМЕНИ
    bannerUrl: "/static/assets/images/banner/avatar-2009.jpg", // ЗАМЕНИ
    genreKeys: ["genre.action", "genre.adventure", "genre.scifi"],
    descriptionKey: "movie.avatar-2009.description",
    directorKey: "director.jamescameron",
    actorsKeys: ["actor.samworthington", "actor.zoesaldana", "actor.sigourneyweaver"],
    trailerUrl: "https://www.youtube.com/embed/5PSNL1qE6VY"
  },
  {
    id: "avengers-endgame",
    titleKey: "movie.avengers-endgame.title", // Название фильма: Avengers: Endgame
    year: 2019,
    rating: "8.4",
    posterUrl: "/static/assets/images/posters/avengers-endgame.jpg", // ЗАМЕНИ
    bannerUrl: "/static/assets/images/banner/avengers-endgame.jpg", // ЗАМЕНИ
    genreKeys: ["genre.action", "genre.adventure", "genre.scifi"],
    descriptionKey: "movie.avengers-endgame.description",
    directorKey: "director.russobrothers",
    actorsKeys: ["actor.robertdowneyjr", "actor.chrisevans", "actor.markruffalo"],
    trailerUrl: "https://www.youtube.com/embed/TcMBFSGVi1c"
  },
  {
    id: "avengers-infinity-war",
    titleKey: "movie.avengers-infinity-war.title", // Название фильма: Avengers: Infinity War
    year: 2018,
    rating: "8.4",
    posterUrl: "/static/assets/images/posters/avengers-infinity-war.jpg", // ЗАМЕНИ
    bannerUrl: "/static/assets/images/banner/avengers-infinity-war.jpg", // ЗАМЕНИ
    genreKeys: ["genre.action", "genre.adventure", "genre.scifi"],
    descriptionKey: "movie.avengers-infinity-war.description",
    directorKey: "director.russobrothers",
    actorsKeys: ["actor.robertdowneyjr", "actor.chrishemsworth", "actor.joshbrolin"],
    trailerUrl: "https://www.youtube.com/embed/6ZfuNTqbHE8"
  },
  {
    id: "black-swan",
    titleKey: "movie.black-swan.title", // Название фильма: Black Swan
    year: 2010,
    rating: "8.0",
    posterUrl: "/static/assets/images/posters/black-swan.jpg", // ЗАМЕНИ
    bannerUrl: "/static/assets/images/banner/black-swan.jpg", // ЗАМЕНИ
    genreKeys: ["genre.drama", "genre.thriller"],
    descriptionKey: "movie.black-swan.description",
    directorKey: "director.darrenaronofsky",
    actorsKeys: ["actor.natalieportman", "actor.milakunis", "actor.vincentcassel"],
    trailerUrl: "https://www.youtube.com/embed/5jaI1XOB-bs"
  },
  {
    id: "borat",
    titleKey: "movie.borat.title", // Название фильма: Borat
    year: 2006,
    rating: "7.3",
    posterUrl: "/static/assets/images/posters/borat.jpg", // ЗАМЕНИ
    bannerUrl: "/static/assets/images/banner/borat.jpg", // ЗАМЕНИ
    genreKeys: ["genre.comedy"],
    descriptionKey: "movie.borat.description",
    directorKey: "director.larrycharles",
    actorsKeys: ["actor.sachabaroncohen", "actor.kenavitian"],
    trailerUrl: "https://www.youtube.com/embed/dL6_G1z6ymw" // Примечание: это может быть трейлер второй части, уточни
  },
  {
    id: "cap-civil-war",
    titleKey: "movie.cap-civil-war.title", // Название фильма: Captain America: Civil War
    year: 2016,
    rating: "7.8",
    posterUrl: "/static/assets/images/posters/cap-civil-war.jpg", // ЗАМЕНИ
    bannerUrl: "/static/assets/images/banner/cap-civil-war.jpg", // ЗАМЕНИ
    genreKeys: ["genre.action", "genre.adventure", "genre.scifi"],
    descriptionKey: "movie.cap-civil-war.description",
    directorKey: "director.russobrothers",
    actorsKeys: ["actor.chrisevans", "actor.robertdowneyjr", "actor.scarlettjohansson"],
    trailerUrl: "https://www.youtube.com/embed/dKrVegVI0Us"
  },
  {
    id: "cars",
    titleKey: "movie.cars.title", // Название фильма: Cars
    year: 2006,
    rating: "7.2",
    posterUrl: "/static/assets/images/posters/cars.jpg", // ЗАМЕНИ
    bannerUrl: "/static/assets/images/banner/cars.jpg", // ЗАМЕНИ
    genreKeys: ["genre.animation", "genre.comedy", "genre.family"],
    descriptionKey: "movie.cars.description",
    directorKey: "director.johnlasseter", // John Lasseter, Joe Ranft
    actorsKeys: ["actor.owenwilson", "actor.bonniehunt", "actor.paullnewman"],
    trailerUrl: "https://www.youtube.com/embed/W_H7_tDHFE8"
  },
  {
    id: "conclave", // Из твоего списка для Trending Now
    titleKey: "movie.conclave.title",
    year: 2024,
    rating: "7.8", // Ты ставил
    posterUrl: "/static/assets/images/posters/conclave.jpg", // ЗАМЕНИ
    bannerUrl: "/static/assets/images/banner/conclave.jpg", // ЗАМЕНИ
    genreKeys: ["genre.thriller", "genre.drama"],
    descriptionKey: "movie.conclave.description",
    directorKey: "director.edwardberger",
    actorsKeys: ["actor.ralphfiennes", "actor.stanleytucci", "actor.johnlithgow"],
    trailerUrl: "https://www.youtube.com/embed/JX9jasdi3ic"
  },
  {
    id: "deadpool-and-wolverine",
    titleKey: "movie.deadpool-and-wolverine.title", // Название фильма: Deadpool & Wolverine
    year: 2024,
    rating: "8.5", // Ожидаемый
    posterUrl: "/static/assets/images/posters/deadpool-and-wolverine.jpg", // ЗАМЕНИ
    bannerUrl: "/static/assets/images/banner/deadpool-and-wolverine.jpg", // ЗАМЕНИ
    genreKeys: ["genre.action", "genre.comedy", "genre.scifi"],
    descriptionKey: "movie.deadpool-and-wolverine.description",
    directorKey: "director.shawnlevy",
    actorsKeys: ["actor.ryanreynolds", "actor.hughjackman", "actor.morenabaccarin"],
    trailerUrl: "https://www.youtube.com/embed/73_1biulkYk"
  },
  {
    id: "doctor-strange-in-the-multiverse-of-madness",
    titleKey: "movie.doctor-strange-in-the-multiverse-of-madness.title",
    year: 2022,
    rating: "7.0",
    posterUrl: "/static/assets/images/posters/doctor-strange-in-the-multiverse-of-madness.jpg",
    bannerUrl: "/static/assets/images/banner/doctor-strange-in-the-multiverse-of-madness.jpg",
    genreKeys: ["genre.action", "genre.adventure", "genre.fantasy"],
    descriptionKey: "movie.doctor-strange-in-the-multiverse-of-madness.description",
    directorKey: "director.samraimi",
    actorsKeys: ["actor.benedictcumberbatch", "actor.elizabetholsen", "actor.chiwetelejiofor"],
    trailerUrl: "https://www.youtube.com/embed/aWzlQ2N6qqg"
  },
  {
    id: "dumb-and-dumber",
    titleKey: "movie.dumb-and-dumber.title",
    year: 1994,
    rating: "7.3",
    posterUrl: "/static/assets/images/posters/dumb-and-dumber.jpg",
    bannerUrl: "/static/assets/images/banner/dumb-and-dumber.jpg",
    genreKeys: ["genre.comedy"],
    descriptionKey: "movie.dumb-and-dumber.description",
    directorKey: "director.peterfarrelly",
    actorsKeys: ["actor.jimcarrey", "actor.jeffdaniels", "actor.laurenholly"],
    trailerUrl: "https://www.youtube.com/embed/dmNddThxi4c"
  },
  {
    id: "dune",
    titleKey: "movie.dune.title",
    year: 2021,
    rating: "8.1",
    posterUrl: "/static/assets/images/posters/dune.jpg",
    bannerUrl: "/static/assets/images/banner/dune.jpg",
    genreKeys: ["genre.action", "genre.adventure", "genre.scifi"],
    descriptionKey: "movie.dune.description",
    directorKey: "director.denisvilleneuve",
    actorsKeys: ["actor.timotheechalamet", "actor.rebeccaferguson", "actor.oscarisaac"],
    trailerUrl: "https://www.youtube.com/embed/n9xhJrPXop4"
  },
  {
    id: "eyes-wide-shut",
    titleKey: "movie.eyes-wide-shut.title",
    year: 1999,
    rating: "7.5",
    posterUrl: "/static/assets/images/posters/eyes-wide-shut.jpg",
    bannerUrl: "/static/assets/images/banner/eyes-wide-shut.jpg",
    genreKeys: ["genre.drama", "genre.thriller"],
    descriptionKey: "movie.eyes-wide-shut.description",
    directorKey: "director.stanleykubrick",
    actorsKeys: ["actor.tomcruise", "actor.nicolekidman"],
    trailerUrl: "https://www.youtube.com/embed/xgVo96JaqeM"
  },
  {
    id: "fight-club",
    titleKey: "movie.fight-club.title",
    year: 1999,
    rating: "8.8",
    posterUrl: "/static/assets/images/posters/fight-club.jpg",
    bannerUrl: "/static/assets/images/banner/fight-club.jpg",
    genreKeys: ["genre.drama", "genre.thriller"],
    descriptionKey: "movie.fight-club.description",
    directorKey: "director.davidfincher",
    actorsKeys: ["actor.edwardnorton", "actor.bradpitt", "actor.helena-bonham-carter"],
    trailerUrl: "https://www.youtube.com/embed/qtRKdVHc-cE"
  },
  {
    id: "final-destination",
    titleKey: "movie.final-destination.title",
    year: 2000,
    rating: "6.7",
    posterUrl: "/static/assets/images/posters/final-destination.jpg",
    bannerUrl: "/static/assets/images/banner/final-destination.jpg",
    genreKeys: ["genre.horror", "genre.thriller"],
    descriptionKey: "movie.final-destination.description",
    directorKey: "director.jameswong",
    actorsKeys: ["actor.devonsawa", "actor.alilarter", "actor.kerrsmith"],
    trailerUrl: "https://www.youtube.com/embed/UWMzKXsY9A4"
  },
  {
    id: "finding-nemo",
    titleKey: "movie.finding-nemo.title",
    year: 2003,
    rating: "8.2",
    posterUrl: "/static/assets/images/posters/finding-nemo.jpg",
    bannerUrl: "/static/assets/images/banner/finding-nemo.jpg",
    genreKeys: ["genre.animation", "genre.adventure", "genre.family"],
    descriptionKey: "movie.finding-nemo.description",
    directorKey: "director.andrewstanton",
    actorsKeys: ["actor.albertbrooks", "actor.ellendegeneres", "actor.alexandergould"],
    trailerUrl: "https://www.youtube.com/embed/SPHfeNgogVs"
  },
  {
    id: "forrest-gump",
    titleKey: "movie.forrest-gump.title",
    year: 1994,
    rating: "8.8",
    posterUrl: "/static/assets/images/posters/forrest-gump.jpg",
    bannerUrl: "/static/assets/images/banner/forrest-gump.jpg",
    genreKeys: ["genre.drama", "genre.family"],
    descriptionKey: "movie.forrest-gump.description",
    directorKey: "director.robertzemeckis",
    actorsKeys: ["actor.tomhanks", "actor.sallyfield", "actor.garysinise"],
    trailerUrl: "https://www.youtube.com/embed/bLvqoHBptjg"
  },
  {
    id: "despicable-me", 
    titleKey: "movie.despicable-me.title",
    year: 2010, 
    rating: "7.6", 
    posterUrl: "/static/assets/images/posters/despicable-me.jpg", 
    bannerUrl: "/static/assets/images/banner/despicable-me.jpg", 
    genreKeys: ["genre.animation", "genre.comedy", "genre.family"],
    descriptionKey: "movie.despicable-me.description", 
    directorKey: "director.pierrecoffin_chrisrenaud", 
    actorsKeys: ["actor.stevecarell", "actor.jasonsegel", "actor.russellbrand"], 
    trailerUrl: "https://www.youtube.com/embed/zzCZ1W_CUoI?si=gCTUP5KGZq9lpKuh" 
  },
  {
    id: "get-out",
    titleKey: "movie.get-out.title",
    year: 2017,
    rating: "7.7",
    posterUrl: "/static/assets/images/posters/get-out.jpg",
    bannerUrl: "/static/assets/images/banner/get-out.jpg",
    genreKeys: ["genre.horror", "genre.thriller"],
    descriptionKey: "movie.get-out.description",
    directorKey: "director.jordanpeele",
    actorsKeys: ["actor.danielkaluuya", "actor.allisonwilliams", "actor.catherinekeener"],
    trailerUrl: "https://www.youtube.com/embed/DzfpyUB60YY"
  },
  {
    id: "guardians-of-the-galaxy",
    titleKey: "movie.guardians-of-the-galaxy.title",
    year: 2014,
    rating: "8.0",
    posterUrl: "/static/assets/images/posters/guardians-of-the-galaxy.jpg",
    bannerUrl: "/static/assets/images/banner/guardians-of-the-galaxy.jpg",
    genreKeys: ["genre.action", "genre.adventure", "genre.scifi"],
    descriptionKey: "movie.guardians-of-the-galaxy.description",
    directorKey: "director.jamesgunn",
    actorsKeys: ["actor.chrispratt", "actor.zoesaldana", "actor.davebautista"],
    trailerUrl: "https://www.youtube.com/embed/d96cjJhvlMA"
  },
  {
    id: "halloween-1978",
    titleKey: "movie.halloween-1978.title",
    year: 1978,
    rating: "7.7",
    posterUrl: "/static/assets/images/posters/halloween-1978.jpg",
    bannerUrl: "/static/assets/images/banner/halloween-1978.jpg",
    genreKeys: ["genre.horror", "genre.thriller"],
    descriptionKey: "movie.halloween-1978.description",
    directorKey: "director.johncarpenter",
    actorsKeys: ["actor.donaldpleasence", "actor.jamieleecurtis", "actor.pjsoles"],
    trailerUrl: "https://www.youtube.com/embed/oVgtguYmNBg"
  },
  {
    id: "the-hangover",
    titleKey: "movie.the-hangover.title",
    year: 2009,
    rating: "7.7",
    posterUrl: "/static/assets/images/posters/hangover.jpg",
    bannerUrl: "/static/assets/images/banner/hangover.jpg",
    genreKeys: ["genre.comedy"],
    descriptionKey: "movie.the-hangover.description",
    directorKey: "director.todphillips",
    actorsKeys: ["actor.bradleycooper", "actor.edhelms", "actor.zachgalifianakis"],
    trailerUrl: "https://www.youtube.com/embed/tlize92ffnY"
  },
  {
    id: "harry-potter-and-the-sorcerers-stone",
    titleKey: "movie.harry-potter-and-the-sorcerers-stone.title",
    year: 2001,
    rating: "7.6",
    posterUrl: "/static/assets/images/posters/harry-potter-and-the-sorcerers-stone.jpg",
    bannerUrl: "/static/assets/images/banner/harry-potter-and-the-sorcerers-stone.jpg",
    genreKeys: ["genre.adventure", "genre.fantasy"],
    descriptionKey: "movie.harry-potter-and-the-sorcerers-stone.description",
    directorKey: "director.chriscolumbus",
    actorsKeys: ["actor.danielradcliffe", "actor.emmawatson", "actor.rupertgrint"],
    trailerUrl: "https://www.youtube.com/embed/VyHV0BRtdxo"
  },
  {
    id: "home-alone",
    titleKey: "movie.home-alone.title",
    year: 1990,
    rating: "7.7",
    posterUrl: "/static/assets/images/posters/home-alone.jpg",
    bannerUrl: "/static/assets/images/banner/home-alone.jpg",
    genreKeys: ["genre.comedy", "genre.family"],
    descriptionKey: "movie.home-alone.description",
    directorKey: "director.chriscolumbus",
    actorsKeys: ["actor.macauleyculkin", "actor.joePesci", "actor.danielstern"],
    trailerUrl: "https://www.youtube.com/embed/jEDaVHmw7r4"
  },
  {
    id: "how-to-train-your-dragon",
    titleKey: "movie.how-to-train-your-dragon.title",
    year: 2010,
    rating: "8.1",
    posterUrl: "/static/assets/images/posters/how-to-train-your-dragon.jpg",
    bannerUrl: "/static/assets/images/banner/how-to-train-your-dragon.jpg",
    genreKeys: ["genre.animation", "genre.family", "genre.adventure"],
    descriptionKey: "movie.how-to-train-your-dragon.description",
    directorKey: "director.deanDeblois",
    actorsKeys: ["actor.jaybaruchel", "actor.gerardbutler", "actor.americaferrera"],
    trailerUrl: "https://www.youtube.com/embed/oKiYuIsPxYk"
  },
  {
    id: "ice-age",
    titleKey: "movie.ice-age.title",
    year: 2002,
    rating: "7.5",
    posterUrl: "/static/assets/images/posters/ice-age.jpg",
    bannerUrl: "/static/assets/images/banner/ice-age.jpg",
    genreKeys: ["genre.animation", "genre.comedy", "genre.family"],
    descriptionKey: "movie.ice-age.description",
    directorKey: "director.chriswedge",
    actorsKeys: ["actor.rayromano", "actor.johnleguizamo", "actor.denisleary"],
    trailerUrl: "https://www.youtube.com/embed/i4noiCRJRoE"
  },
  {
    id: "inception",
    titleKey: "movie.inception.title",
    year: 2010,
    rating: "8.8",
    posterUrl: "/static/assets/images/posters/inception.jpg",
    bannerUrl: "/static/assets/images/banner/inception.jpg",
    genreKeys: ["genre.action", "genre.sci-fi", "genre.thriller"],
    descriptionKey: "movie.inception.description",
    directorKey: "director.christophernolan",
    actorsKeys: ["actor.leonardodicaprio", "actor.josephgordonlevitt", "actor.ellenpage"],
    trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0"
  },
  {
    id: "iron-man",
    titleKey: "movie.iron-man.title",
    year: 2008,
    rating: "7.9",
    posterUrl: "/static/assets/images/posters/iron-man.jpg",
    bannerUrl: "/static/assets/images/banner/iron-man.jpg",
    genreKeys: ["genre.action", "genre.adventure", "genre.sci-fi"],
    descriptionKey: "movie.iron-man.description",
    directorKey: "director.jonfavreau",
    actorsKeys: ["actor.robertdowneyjr", "actor.gwynethpaltrow", "actor.jeffbridges"],
    trailerUrl: "https://www.youtube.com/embed/8ugaeA-nMTc"
  },
  {
    id: "it-2017",
    titleKey: "movie.it-2017.title",
    year: 2017,
    rating: "7.3",
    posterUrl: "/static/assets/images/posters/It-2017.jpg",
    bannerUrl: "/static/assets/images/banner/It-2017.jpg",
    genreKeys: ["genre.horror", "genre.drama"],
    descriptionKey: "movie.it-2017.description",
    directorKey: "director.andymuschietti",
    actorsKeys: ["actor.billskarsgard", "actor.finnwolfhard", "actor.sophialillis"],
    trailerUrl: "https://www.youtube.com/embed/FnCdOQsX5kc"
  },
  {
    id: "jurassic-park",
    titleKey: "movie.jurassic-park.title",
    year: 1993,
    rating: "8.2",
    posterUrl: "/static/assets/images/posters/jurassic-park.jpg",
    bannerUrl: "/static/assets/images/banner/jurassic-park.jpg",
    genreKeys: ["genre.action", "genre.adventure", "genre.sci-fi"],
    descriptionKey: "movie.jurassic-park.description",
    directorKey: "director.stevenspielberg",
    actorsKeys: ["actor.samneill", "actor.lauradern", "actor.jeffgoldblum"],
    trailerUrl: "https://www.youtube.com/embed/QWBKEmWWL38"
  },

  {
    id: "kung-fu-panda",
    titleKey: "movie.kung-fu-panda.title",
    year: 2008,
    rating: "7.6",
    posterUrl: "/static/assets/images/posters/kung-fu-panda.jpg",
    bannerUrl: "/static/assets/images/banner/kung-fu-panda.jpg",
    genreKeys: ["genre.animation", "genre.action", "genre.comedy"],
    descriptionKey: "movie.kung-fu-panda.description",
    directorKey: "director.markosborne",
    actorsKeys: ["actor.jackblack", "actor.dustinhoffman", "actor.angelinajolie"],
    trailerUrl: "https://www.youtube.com/embed/NRc-ze7Wrxw"
  },
  {
    id: "lilo-and-stitch",
    titleKey: "movie.lilo-and-stitch.title",
    year: 2002,
    rating: "7.3",
    posterUrl: "/static/assets/images/posters/lilo-&-stitch.jpg",
    bannerUrl: "/static/assets/images/banner/lilo-&-stitch.jpg",
    genreKeys: ["genre.animation", "genre.family", "genre.scifi"],
    descriptionKey: "movie.lilo-and-stitch.description",
    directorKey: "director.chrissanders",
    actorsKeys: ["actor.daveighchase", "actor.chrissanders", "actor.tiaCarrere"],
    trailerUrl: "https://www.youtube.com/embed/9OAC55UWAQs"
  },
  {
    id: "mad-max-fury-road",
    titleKey: "movie.mad-max-fury-road.title",
    year: 2015,
    rating: "8.1",
    posterUrl: "/static/assets/images/posters/mad-max-fury-road.jpg",
    bannerUrl: "/static/assets/images/banner/mad-max-fury-road.jpg",
    genreKeys: ["genre.action", "genre.adventure", "genre.scifi"],
    descriptionKey: "movie.mad-max-fury-road.description",
    directorKey: "director.georgemiller",
    actorsKeys: ["actor.tomhardy", "actor.charlizetheron", "actor.nicholashoult"],
    trailerUrl: "https://www.youtube.com/embed/hEJnMQG9ev8"
  },
  {
    id: "minecraft",
    titleKey: "movie.minecraft.title",
    year: 2025,
    rating: "7.7",
    posterUrl: "/static/assets/images/posters/minecraft.jpg",
    bannerUrl: "/static/assets/images/banner/minecraft.jpg",
    genreKeys: ["genre.adventure", "genre.fantasy"],
    descriptionKey: "movie.minecraft.description",
    directorKey: "director.jaredhess",
    actorsKeys: ["actor.jasoneMomoa","actor.jasoneMomoa" ],
    trailerUrl: "https://www.youtube.com/embed/wJO_vIDZn-I"
  },
  {
    id: "nosferatu",
    titleKey: "movie.nosferatu.title",
    year: 2024,
    rating: "7.9",
    posterUrl: "/static/assets/images/posters/nosferatu.jpg",
    bannerUrl: "/static/assets/images/banner/nosferatu.jpg",
    genreKeys: ["genre.horror", "genre.drama"],
    descriptionKey: "movie.nosferatu.description",
    directorKey: "director.fwmurnau",
    actorsKeys: ["actor.maxschreck", "actor.gustavvangenheim"],
    trailerUrl: "https://www.youtube.com/embed/nulvWqYUM8k"
  },
  {
    id: "paddington",
    titleKey: "movie.paddington.title",
    year: 2014,
    rating: "7.6",
    posterUrl: "/static/assets/images/posters/paddington.jpg",
    bannerUrl: "/static/assets/images/banner/paddington.jpg",
    genreKeys: ["genre.comedy", "genre.family"],
    descriptionKey: "movie.paddington.description",
    directorKey: "director.paulking",
    actorsKeys: ["actor.benwhishaw", "actor.hughbonneville", "actor.sallyhawkins"],
    trailerUrl: "https://www.youtube.com/embed/W5tUEw4Nq4E"
  },
  {
    id: "parasite",
    titleKey: "movie.parasite.title",
    year: 2019,
    rating: "8.5",
    posterUrl: "/static/assets/images/posters/parasite.jpg",
    bannerUrl: "/static/assets/images/banner/parasite.jpg",
    genreKeys: ["genre.drama", "genre.thriller"],
    descriptionKey: "movie.parasite.description",
    directorKey: "director.bongjoonho",
    actorsKeys: ["actor.songkangho", "actor.chooyeojung", "actor.parksoodam"],
    trailerUrl: "https://www.youtube.com/embed/5xH0HfJHsaY"
  },
  {
    id: "pirates-of-the-caribbean",
    titleKey: "movie.pirates-of-the-caribbean.title",
    year: 2003,
    rating: "8.1",
    posterUrl: "/static/assets/images/posters/pirates-of-the-caribbean.jpg",
    bannerUrl: "/static/assets/images/banner/pirates-of-the-caribbean.jpg",
    genreKeys: ["genre.action", "genre.adventure", "genre.fantasy"],
    descriptionKey: "movie.pirates-of-the-caribbean.description",
    directorKey: "director.goreverbinski",
    actorsKeys: ["actor.johnnydepp", "actor.orlandobloom", "actor.keiraknightley"],
    trailerUrl: "https://www.youtube.com/embed/naQr0uTrH_s"
  },
  {
    id: "prisoners",
    titleKey: "movie.prisoners.title",
    year: 2013,
    rating: "8.1",
    posterUrl: "/static/assets/images/posters/prisoners.jpg",
    bannerUrl: "/static/assets/images/banner/prisoners.jpg",
    genreKeys: ["genre.crime", "genre.drama", "genre.thriller"],
    descriptionKey: "movie.prisoners.description",
    directorKey: "director.denisvilleneuve",
    actorsKeys: ["actor.hughjackman", "actor.jakegyllenhaal", "actor.pauldano"],
    trailerUrl: "https://www.youtube.com/embed/bpXfcTF6iVk"
  },
  {
    id: "scary-movie-3",
    titleKey: "movie.scary-movie-3.title",
    year: 2003,
    rating: "5.5",
    posterUrl: "/static/assets/images/posters/scary-movie3.jpg",
    bannerUrl: "/static/assets/images/banner/scary-movie3.jpg",
    genreKeys: ["genre.comedy"],
    descriptionKey: "movie.scary-movie-3.description",
    directorKey: "director.davidzucker",
    actorsKeys: ["actor.annafarisp", "actor.charliesheen", "actor.reginahall"],
    trailerUrl: "https://www.youtube.com/embed/O21wD8Tzr2k"
  },
  {
    id: "se7en",
    titleKey: "movie.se7en.title",
    year: 1995,
    rating: "8.6",
    posterUrl: "/static/assets/images/posters/se7en.jpg",
    bannerUrl: "/static/assets/images/banner/se7en.jpg",
    genreKeys: ["genre.thriller", "genre.drama"],
    descriptionKey: "movie.se7en.description",
    directorKey: "director.davidfincher",
    actorsKeys: ["actor.bradpitt", "actor.morganfreeman", "actor.kevinspacey"],
    trailerUrl: "https://www.youtube.com/embed/KPOuJGkpblk"
  },
  {
    id: "ratatouille",
    titleKey: "movie.ratatouille.title",
    year: 2007,
    rating: "8.1",
    posterUrl: "/static/assets/images/posters/ratatouille.jpg",
    bannerUrl: "/static/assets/images/banner/ratatouille.jpg",
    genreKeys: ["genre.animation", "genre.comedy", "genre.family"],
    descriptionKey: "movie.ratatouille.description",
    directorKey: "director.bird",
    actorsKeys: ["actor.pattonoswalt", "actor.louromano", "actor.ianholm"],
    trailerUrl: "https://www.youtube.com/embed/NgsQ8mVkN8w"
  },
  {
    id: "shazam-2019",
    titleKey: "movie.shazam.title",
    year: 2019,
    rating: "7.0",
    posterUrl: "/static/assets/images/posters/shazam-2019.jpg",
    bannerUrl: "/static/assets/images/banner/shazam-2019.jpg",
    genreKeys: ["genre.adventure", "genre.comedy", "genre.fantasy"],
    descriptionKey: "movie.shazam.description",
    directorKey: "director.davidfsandberg",
    actorsKeys: ["actor.zacharylevi", "actor.markstrong", "actor.asherangel"],
    trailerUrl: "https://www.youtube.com/embed/go6GEIrcvFY"
  },
  {
    id: "sinners",
    titleKey: "movie.sinners.title",
    year: 2020,
    rating: "6.1",
    posterUrl: "/static/assets/images/posters/sinners.jpg",
    bannerUrl: "/static/assets/images/banner/sinners.jpg",
    genreKeys: ["genre.drama", "genre.thriller"],
    descriptionKey: "movie.sinners.description",
    directorKey: "director.daviddelgado",
    actorsKeys: ["actor.michaelbeasley", "actor.katelanddeen", "actor.carlbailey"],
    trailerUrl: "https://www.youtube.com/embed/bKGxHflevuk"
  },
  {
    id: "spider-man-no-way-home",
    titleKey: "movie.spidermannowayhome.title",
    year: 2021,
    rating: "8.2",
    posterUrl: "/static/assets/images/posters/spider-man-no-way-home.jpg",
    bannerUrl: "/static/assets/images/banner/spider-man-no-way-home.jpg",
    genreKeys: ["genre.action", "genre.adventure", "genre.scifi"],
    descriptionKey: "movie.spidermannowayhome.description",
    directorKey: "director.jonwatts",
    actorsKeys: ["actor.tomholland", "actor.zendaya", "actor.benedictcumberbatch"],
    trailerUrl: "https://www.youtube.com/embed/JfVOs4VSpmA"
  },
  {
    id: "star-wars-a-new-hope",
    titleKey: "movie.starwarsanewhope.title",
    year: 1977,
    rating: "8.6",
    posterUrl: "/static/assets/images/posters/star-wars-a-new-hope.jpg",
    bannerUrl: "/static/assets/images/banner/star-wars-a-new-hope.jpg",
    genreKeys: ["genre.adventure", "genre.scifi", "genre.fantasy"],
    descriptionKey: "movie.starwarsanewhope.description",
    directorKey: "director.georgelucas",
    actorsKeys: ["actor.markhamill", "actor.harrisonford", "actor.carriefisher"],
    trailerUrl: "https://www.youtube.com/embed/vZ734NWnAHA"
  },
  {
    id: "superbad",
    titleKey: "movie.superbad.title",
    year: 2007,
    rating: "7.6",
    posterUrl: "/static/assets/images/posters/superbad.jpg",
    bannerUrl: "/static/assets/images/banner/superbad.jpg",
    genreKeys: ["genre.comedy"],
    descriptionKey: "movie.superbad.description",
    directorKey: "director.gregmottola",
    actorsKeys: ["actor.jonahhill", "actor.michaelcera", "actor.christophermintzplasse"],
    trailerUrl: "https://www.youtube.com/embed/LvKvus3vCEY"
  },
  {
    id: "the-chronicles-of-narnia-the-lion",
    titleKey: "movie.narnia.title",
    year: 2005,
    rating: "6.9",
    posterUrl: "/static/assets/images/posters/the-chronicles-of-narnia-the-lion.jpg",
    bannerUrl: "/static/assets/images/banner/the-chronicles-of-narnia-the-lion.jpg",
    genreKeys: ["genre.adventure", "genre.family", "genre.fantasy"],
    descriptionKey: "movie.narnia.description",
    directorKey: "director.andrewadamson",
    actorsKeys: ["actor.georgiehenley", "actor.skandarkeynes", "actor.williammoseley"],
    trailerUrl: "https://www.youtube.com/embed/usEkWtuNn-w"
  },
  {
    id: "the-exorcist",
    titleKey: "movie.exorcist.title",
    year: 1973,
    rating: "8.1",
    posterUrl: "/static/assets/images/posters/the-exorcist.jpg",
    bannerUrl: "/static/assets/images/banner/the-exorcist.jpg",
    genreKeys: ["genre.horror"],
    descriptionKey: "movie.exorcist.description",
    directorKey: "director.williampfriedkin",
    actorsKeys: ["actor.ellinaburstyn", "actor.maxvonsydow", "actor.lindablair"],
    trailerUrl: "https://www.youtube.com/embed/BU2eYAO31Cc"
  },
  {
    id: "the-godfather",
    titleKey: "movie.godfather.title",
    year: 1972,
    rating: "9.2",
    posterUrl: "/static/assets/images/posters/the-godfather.jpg",
    bannerUrl: "/static/assets/images/banner/the-godfather.jpg",
    genreKeys: ["genre.drama", "genre.thriller"],
    descriptionKey: "movie.godfather.description",
    directorKey: "director.francisfordcoppola",
    actorsKeys: ["actor.marionbrando", "actor.alpacino", "actor.jamescaan"],
    trailerUrl: "https://www.youtube.com/embed/UaVTIH8mujA"
  },
  {
    id: "the-incredibles",
    titleKey: "movie.incredibles.title",
    year: 2004,
    rating: "8.0",
    posterUrl: "/static/assets/images/posters/the-incredibles.jpg",
    bannerUrl: "/static/assets/images/banner/the-incredibles.jpg",
    genreKeys: ["genre.animation", "genre.family", "genre.adventure"],
    descriptionKey: "movie.incredibles.description",
    directorKey: "director.bird",
    actorsKeys: ["actor.craigtnelson", "actor.hollyhunter", "actor.samljackson"],
    trailerUrl: "https://www.youtube.com/embed/-UaGUdNJdRQ"
  },
  {
    id: "the-lion-king",
    titleKey: "movie.lionking.title",
    year: 1994,
    rating: "8.5",
    posterUrl: "/static/assets/images/posters/the-lion-king-1994.jpg",
    bannerUrl: "/static/assets/images/banner/the-lion-king-1994.jpg",
    genreKeys: ["genre.animation", "genre.drama", "genre.adventure"],
    descriptionKey: "movie.lionking.description",
    directorKey: "director.allersminkoff",
    actorsKeys: ["actor.matthewbroderick", "actor.jeremyirons", "actor.jamesearljones"],
    trailerUrl: "https://www.youtube.com/embed/eHcZlPpNt0Q"
  },
  {
    id: "the-mask",
    titleKey: "movie.mask.title",
    year: 1994,
    rating: "6.9",
    posterUrl: "/static/assets/images/posters/the-mask.jpg",
    bannerUrl: "/static/assets/images/banner/the-mask.jpg",
    genreKeys: ["genre.comedy", "genre.fantasy", "genre.action"],
    descriptionKey: "movie.mask.description",
    directorKey: "director.russell",
    actorsKeys: ["actor.jimcarrey", "actor.camerondiaz", "actor.petergreen"],
    trailerUrl: "https://www.youtube.com/embed/Ic7rUX6pcmA"
  },
  {
    id: "the-matrix",
    titleKey: "movie.matrix.title",
    year: 1999,
    rating: "8.7",
    posterUrl: "/static/assets/images/posters/the-matrix.jpg",
    bannerUrl: "/static/assets/images/banner/the-matrix.jpg",
    genreKeys: ["genre.scifi", "genre.action"],
    descriptionKey: "movie.matrix.description",
    directorKey: "director.wachowskis",
    actorsKeys: ["actor.keanureeves", "actor.laurencefishburne", "actor.carrieannemoss"],
    trailerUrl: "https://www.youtube.com/embed/vKQi3bBA1y8"
  },
  {
    id: "the-shawshank-redemption",
    titleKey: "movie.shawshank.title",
    year: 1994,
    rating: "9.3",
    posterUrl: "/static/assets/images/posters/the-shawshank-redemption.jpg",
    bannerUrl: "/static/assets/images/banner/the-shawshank-redemption.jpg",
    genreKeys: ["genre.drama", "genre.crime"],
    descriptionKey: "movie.shawshank.description",
    directorKey: "director.darabont",
    actorsKeys: ["actor.timrobbins", "actor.morganfreeman", "actor.bobjgunton"],
    trailerUrl: "https://www.youtube.com/embed/PLl99DlL6b4"
  },
  {
    id: "the-silence-of-the-lambs",
    titleKey: "movie.silence.title",
    year: 1991,
    rating: "8.6",
    posterUrl: "/static/assets/images/posters/the-silence-of-the-lambs.jpg",
    bannerUrl: "/static/assets/images/banner/the-silence-of-the-lambs.jpg",
    genreKeys: ["genre.thriller", "genre.crime", "genre.drama"],
    descriptionKey: "movie.silence.description",
    directorKey: "director.demme",
    actorsKeys: ["actor.jodiefoster", "actor.anthonyhopkins", "actor.tedlevine"],
    trailerUrl: "https://www.youtube.com/embed/6iB21hsprAQ"
  },
  {
    id: "the-social-network",
    titleKey: "movie.social.title",
    year: 2010,
    rating: "7.7",
    posterUrl: "/static/assets/images/posters/the-social-network.jpg",
    bannerUrl: "/static/assets/images/banner/the-social-network.jpg",
    genreKeys: ["genre.biography", "genre.drama"],
    descriptionKey: "movie.social.description",
    directorKey: "director.fincher",
    actorsKeys: ["actor.jesseeisenberg", "actor.andrewgarfield", "actor.justintimberlake"],
    trailerUrl: "https://www.youtube.com/embed/lB95KLmpLR4"
  },
  {
    id: "the-wolf-of-wall-street",
    titleKey: "movie.wolf.title",
    year: 2013,
    rating: "8.2",
    posterUrl: "/static/assets/images/posters/the-wolf-of-wall-street.jpg",
    bannerUrl: "/static/assets/images/banner/the-wolf-of-wall-street.jpg",
    genreKeys: ["genre.comedy", "genre.crime", "genre.drama"],
    descriptionKey: "movie.wolf.description",
    directorKey: "director.scorsese",
    actorsKeys: ["actor.leonardodicaprio", "actor.jonahhill", "actor.margotrobbie"],
    trailerUrl: "https://www.youtube.com/embed/iszwuX1AK6A"
  },
  {
    id: "thunderbolts",
    titleKey: "movie.thunderbolts.title",
    year: 2025,
    rating: "7.9",
    posterUrl: "/static/assets/images/posters/thunderbolts.jpg",
    bannerUrl: "/static/assets/images/banner/thunderbolts.jpg",
    genreKeys: ["genre.action", "genre.adventure", "genre.scifi"],
    descriptionKey: "movie.thunderbolts.description",
    directorKey: "director.jake", 
    actorsKeys: ["actor.sebastianstan", "actor.wyattrussell", "actor.florencepugh"],
    trailerUrl: "https://www.youtube.com/embed/-sAOWhvheK8"
  },
  {
    id: "titanic",
    titleKey: "movie.titanic.title",
    year: 1997,
    rating: "7.9",
    posterUrl: "/static/assets/images/posters/titanic.jpg",
    bannerUrl: "/static/assets/images/banner/titanic.jpg",
    genreKeys: ["genre.romance", "genre.drama"],
    descriptionKey: "movie.titanic.description",
    directorKey: "director.cameron",
    actorsKeys: ["actor.leonardodicaprio", "actor.katewinslet", "actor.billyzane"],
    trailerUrl: "https://www.youtube.com/embed/kVrqfYjkTdQ"
  },
  {
    id: "toy-story",
    titleKey: "movie.toystory.title",
    year: 1995,
    rating: "8.3",
    posterUrl: "/static/assets/images/posters/toy-story.jpg",
    bannerUrl: "/static/assets/images/banner/toy-story.jpg",
    genreKeys: ["genre.animation", "genre.family", "genre.comedy"],
    descriptionKey: "movie.toystory.description",
    directorKey: "director.lasseter",
    actorsKeys: ["actor.tomhanks", "actor.timallen", "actor.donrickles"],
    trailerUrl: "https://www.youtube.com/embed/CxwTLktovTU"
  },
  {
    id: "up",
    titleKey: "movie.up.title",
    year: 2009,
    rating: "8.2",
    posterUrl: "/static/assets/images/posters/up.jpg",
    bannerUrl: "/static/assets/images/banner/up.jpg",
    genreKeys: ["genre.animation", "genre.adventure", "genre.family"],
    descriptionKey: "movie.up.description",
    directorKey: "director.docter",
    actorsKeys: ["actor.edasner", "actor.christopherplummer", "actor.jordanngai"],
    trailerUrl: "https://www.youtube.com/embed/HWEW_qTLSEE"
  },
  {
    id: "wicked",
    titleKey: "movie.wicked.title",
    year: 2024,
    rating: "5.9",
    posterUrl: "/static/assets/images/posters/wicked.jpg",
    bannerUrl: "/static/assets/images/banner/wicked.jpg",
    genreKeys: ["genre.fantasy", "genre.musical", "genre.adventure"],
    descriptionKey: "movie.wicked.description",
    directorKey: "director.chu",
    actorsKeys: ["actor.cynthiarivo", "actor.arianagrande", "actor.jonathanbailey"],
    trailerUrl: "https://www.youtube.com/embed/6COmYeLsz4c"
  },
  {
    id: "zootopia",
    titleKey: "movie.zootopia.title",
    year: 2016,
    rating: "8.0",
    posterUrl: "/static/assets/images/posters/zootopia.jpg",
    bannerUrl: "/static/assets/images/banner/zootopia.jpg",
    genreKeys: ["genre.animation", "genre.comedy", "genre.crime"],
    descriptionKey: "movie.zootopia.description",
    directorKey: "director.howardmoore",
    actorsKeys: ["actor.ginnifergoodwin", "actor.jasonbateman", "actor.idriselba"],
    trailerUrl: "https://www.youtube.com/embed/jWM0ct-OLsM"
  }
  
  
];

const trendingNowMovieIds = ['thunderbolts', 'conclave', 'cap-civil-war', 'minecraft', 'nosferatu']; // Пример для Trending
const holidayMoodMovieIds = ['titanic','deadpool-and-wolverine','superbad','scary-movie-3','eyes-wide-shut' ]; 
const recommendedMovieIds = ['up' ,'avengers-endgame','a-quiet-place','home-alone','pirates-of-the-caribbean' ];   