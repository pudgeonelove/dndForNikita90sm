const GAME_STATES = {
  MAIN_MENU: "MAIN_MENU",
  CHARACTER_SELECT: "CHARACTER_SELECT",
  STAT_ALLOC: "STAT_ALLOC",
  WORLD_MAP: "WORLD_MAP",
  ENCOUNTER: "ENCOUNTER",
  GAME_OVER: "GAME_OVER",
  VICTORY: "VICTORY",
};

const STORAGE_KEY = "veil-of-ash-campaign-state-v2";
const MAP_ROWS = 16;
const MAP_CANVAS_HEIGHT = 1780;
const INITIAL_SKILL_POINTS = 10;

const ATTRIBUTE_META = {
  damage: {
    title: "Урон",
    short: "DMG",
    text: "+0.75 к урону и +0.5 AC за очко.",
  },
  defense: {
    title: "Защита",
    short: "HP",
    text: "+1 max HP за очко.",
  },
  luck: {
    title: "Удача",
    short: "d20",
    text: "Шанс взять лучший d20 и больше шанс предметов.",
  },
  charisma: {
    title: "Харизма",
    short: "CHA",
    text: "+1 к проверкам в таверне за очко.",
  },
};

const XP_REWARDS = {
  battle: 14,
  elite: 36,
  boss: 90,
  tavern: 7,
  lore: 6,
  event: 5,
};

const ASSETS = {
  village: "assets/images/village.png",
  ruins: "assets/images/ruins.png",
  tavern: "assets/images/tavern.jfif",
  fighter: "assets/images/fighter.png",
  mage: "assets/images/mage.png",
  rogue: "assets/images/rogue.png",
};

const CAMPAIGN_LORE = {
  title: "Санктуарий Тьмы",
  premise:
    "Старый Дракон-Лич Астерон проснулся в Сердце Горы. Его пепельное дыхание сушит реки, гасит храмы и поднимает мертвых на старых дорогах.",
  opening:
    "Серое солнце висит над трактом как потухшая монета. Впереди Сердце Горы, и где-то под ним Астерон впервые за тысячу лет открывает глаза.",
};

const LORE_ENTRIES = [
  {
    title: "Падение Колокольного Монастыря",
    text: "Когда Астерон впервые умер, монахи три дня звонили в медные колокола, чтобы не дать его душе найти дорогу назад. Теперь колокола молчат, но их тени звенят в тумане.",
  },
  {
    title: "Клятва Серого Тракта",
    text: "Путники старого тракта оставляли на камнях имена тех, кто не вернулся. Если имя стереть кровью, мертвец может вспомнить дорогу домой.",
  },
  {
    title: "Три ключа под горой",
    text: "Сердце Горы открывается не силой, а тремя согласиями: стража, предателя и того, кто готов забыть свое имя.",
  },
  {
    title: "Песня Миртла",
    text: "Торговец Миртл знает куплет, который усыпляет костяных дракончиков. Он продает его только тем, кто умеет слушать между словами.",
  },
  {
    title: "Пепельная десятина",
    text: "В каждой деревне Астерон оставлял одну дверь не сожженной. За ней люди находили еду, воду и имя того, кого гора заберет следующим.",
  },
  {
    title: "Суд без свечей",
    text: "До пробуждения лича рыцари Серого Тракта судили мертвых, чтобы живые не наследовали их проклятия. Последний судья теперь сам стоит у ворот горы.",
  },
  {
    title: "Медный Ворон",
    text: "Таверна появляется там, где путники почти сдались. Никто не видел, как ее строили, но каждый слышал, как под полом царапают когти старых долгов.",
  },
  {
    title: "Черная звезда Астерона",
    text: "Свет на вершине не маяк. Это звезда, которую дракон-лич проглотил при жизни и так и не сумел переварить после смерти.",
  },
  {
    title: "Карта без севера",
    text: "Старые карты Санктуария всегда лгут о севере. Верный путь отмечен не компасом, а тем местом, где чернила становятся холодными.",
  },
];

const TAVERN_NPCS = [
  {
    name: "Хозяйка Ровена",
    role: "владелица таверны «Медный Ворон»",
    rumor: "Ровена говорит, что на вершину нельзя идти после третьего колокола: в это время сама гора делает спасбросок против живых.",
    check: "Убеждение",
    success: "Ровена дает вам теплую похлебку и карту боковой тропы. +2 HP и +8 gp.",
    fail: "Ровена улыбается, но разговор уходит в цену за комнату. Вы теряете 4 gp.",
  },
  {
    name: "Старый картограф Ним",
    role: "слепой рисовальщик дорог",
    rumor: "Ним проводит пальцем по пустому пергаменту: «Настоящая дорога видна только тем, кто уже выбрал, чем пожертвует».",
    check: "История",
    success: "Ним отмечает безопасный перевал. Угроза кампании снижается на 1.",
    fail: "Чернила расползаются в форму черепа. Следующая встреча кажется ближе.",
  },
  {
    name: "Бард Лиран",
    role: "человек с лютней и слишком честными глазами",
    rumor: "Лиран поет о рыцаре, который победил дракона не клинком, а напоминанием о его первом имени.",
    check: "Проницательность",
    success: "Вы слышите в песне имя Астерона до смерти. В журнал добавлен фрагмент лора.",
    fail: "Песня красива, но в ней слишком много вина. Ничего, кроме головной боли.",
  },
  {
    name: "Девочка-посыльная Ива",
    role: "носит письма между деревнями, которых уже нет",
    rumor: "Ива просит передать письмо человеку без лица. На конверте стоит печать Сердца Горы.",
    check: "Ловкость рук",
    success: "Вы подменяете письмо и находите внутри 14 gp.",
    fail: "Печать кусает палец. -1 HP, но Ива смеется: «Теперь оно вас запомнило».",
  },
];

const HEROES = {
  fighter: {
    title: "Воин",
    epithet: "Воин Зольного Тракта",
    backstory:
      "Рыцарь павшего бастиона. Он несет треснувший щит ордена, который пал первым, когда мертвые вышли из пепла.",
    relic: "Щит Пепла",
    relicText: "Первый урон в каждом бою снижается на 2.",
    hp: 42,
    maxHp: 42,
    ac: 16,
    gold: 42,
    portrait: "fighter",
    defaultSubclass: "champion",
  },
  mage: {
    title: "Маг",
    epithet: "Маг Синего Пламени",
    backstory:
      "Последний ученик сожженной башни. Его гримуар шепчет голосами наставников, запертых в чернилах.",
    relic: "Гримуар Углей",
    relicText: "Первый бросок d20 ниже 7 за событие можно перебросить.",
    hp: 34,
    maxHp: 34,
    ac: 12,
    gold: 36,
    portrait: "mage",
    defaultSubclass: "evoker",
  },
  rogue: {
    title: "Плут",
    epithet: "Плут Черной Монеты",
    backstory:
      "Контрабандист, который однажды украл ключ от двери, ведущей в погребальный мир. Теперь ключ хочет вернуться домой.",
    relic: "Черная Монета",
    relicText: "После события с успешным d20 получает +12 gp.",
    hp: 36,
    maxHp: 36,
    ac: 14,
    gold: 55,
    portrait: "rogue",
    defaultSubclass: "thief",
  },
};

const SUBCLASSES = {
  fighter: [
    { id: "champion", name: "Чемпион", color: "steel", text: "Криты чаще, меньше риска, сильный базовый темп." },
    { id: "battlemaster", name: "Боевой мастер", color: "gold", text: "Маневры, контроль угрозы, тактика против элиты." },
    { id: "eldritch-knight", name: "Рыцарь чар", color: "arcane", text: "Защитная магия и зачарованное оружие." },
    { id: "samurai", name: "Самурай", color: "ember", text: "Временные HP и преимущество в решающий ход." },
  ],
  mage: [
    { id: "evoker", name: "Эвокатор", color: "ember", text: "Огненные зоны и лучший массовый урон." },
    { id: "necromancer", name: "Некромант", color: "violet", text: "Похищение жизни и слуги из костей." },
    { id: "illusionist", name: "Иллюзионист", color: "jade", text: "Ложные цели, обман и отмена атак." },
    { id: "chronomancer", name: "Хронург", color: "arcane", text: "Повторы d20 и сдвиг инициативы." },
  ],
  rogue: [
    { id: "thief", name: "Вор", color: "gold", text: "Больше лута и быстрые предметы." },
    { id: "assassin", name: "Ассасин", color: "blood", text: "Сильный первый удар и казнь слабых." },
    { id: "arcane-trickster", name: "Магический ловкач", color: "arcane", text: "Фокусы, невидимая рука и контроль." },
    { id: "shadow-duelist", name: "Дуэлянт тени", color: "steel", text: "Парирование и ответные удары." },
  ],
};

const SUBCLASS_TRAITS = {
  champion: { hp: 5, ac: 1, damage: 1, attack: 1, critFloor: 19, note: "Крит на 19-20, крепче базовой линии." },
  battlemaster: { hp: 3, ac: 0.5, damage: 1.5, attack: 1, guard: 1, note: "Маневры дают постоянную стойку -1 входящего урона." },
  "eldritch-knight": { hp: 2, ac: 1.5, damage: 0.5, attack: 0, magicGuard: 2, note: "Защитная магия снижает первый урон боя еще на 2." },
  samurai: { hp: 4, ac: 0.5, damage: 2, attack: 0, burstHp: 3, note: "В начале боя получает временную стойку и +2 урона." },
  evoker: { hp: 0, ac: 0, damage: 2, attack: 1, spellSplash: 2, note: "Массовые заклинания больнее и стабильнее." },
  necromancer: { hp: 3, ac: 0, damage: 1, attack: 0, leech: 1, note: "После убийства восстанавливает 1 HP." },
  illusionist: { hp: 1, ac: 1, damage: 0, attack: 1, dodgeDie: 12, dodgeTarget: 11, note: "Иногда атака проходит сквозь иллюзию." },
  chronomancer: { hp: 0, ac: 0.5, damage: 1, attack: 1, luck: 2, note: "Лучше крутит судьбу и d20." },
  thief: { hp: -5, ac: 0.5, damage: 2, attack: 1, dodgeDie: 10, dodgeTarget: 9, lootBonus: 0.12, note: "Меньше HP, больше урона, шанс увернуться на d10." },
  assassin: { hp: -2, ac: 0, damage: 3, attack: 1, execute: 4, note: "Добивает раненых врагов особенно жестко." },
  "arcane-trickster": { hp: 0, ac: 1, damage: 1.5, attack: 1, dodgeDie: 12, dodgeTarget: 10, note: "Магические трюки повышают уклонение." },
  "shadow-duelist": { hp: 2, ac: 1.5, damage: 1, attack: 0, riposte: 2, note: "Парирование иногда возвращает 2 урона." },
};

const ITEM_DEFS = [
  { id: "cracked-steel-ring", name: "Кольцо треснувшей стали", slot: "Реликвия", text: "+2 AC.", ac: 2, rarity: "rare" },
  { id: "ash-dagger", name: "Пепельный кинжал", slot: "Оружие", text: "+2 к урону.", damage: 2, rarity: "uncommon" },
  { id: "night-coal-cloak", name: "Плащ ночного угля", slot: "Плащ", text: "+1 AC и +1 удача.", ac: 1, luck: 1, rarity: "uncommon" },
  { id: "saint-bone-charm", name: "Костяной оберег святого", slot: "Амулет", text: "+5 max HP.", hp: 5, rarity: "rare" },
  { id: "black-ink-dice", name: "Кости черных чернил", slot: "Инструмент", text: "+2 харизма, больше удачных разговоров.", charisma: 2, rarity: "uncommon" },
  { id: "ember-whetstone", name: "Точило угольного пламени", slot: "Расходник", text: "+1 атака и +1 урон.", attack: 1, damage: 1, rarity: "rare" },
];

const NODE_TYPES = {
  battle: { label: "Бой", icon: "⚔", kicker: "Обычная встреча" },
  event: { label: "?", icon: "?", kicker: "Текстовый квест" },
  lore: { label: "Лор", icon: "☉", kicker: "Фрагмент мира" },
  tavern: { label: "Таверна", icon: "T", kicker: "Люди и слухи" },
  camp: { label: "Костер", icon: "✚", kicker: "Короткий отдых" },
  shop: { label: "Магазин", icon: "$", kicker: "NPC-торговец" },
  elite: { label: "Элита", icon: "!", kicker: "Элитный бой" },
  boss: { label: "Босс", icon: "☠", kicker: "Сердце Горы" },
};

const ENCOUNTER_COPY = {
  battle: {
    title: "Засада на серой дороге",
    text: "Из низкого тумана выходят твари Астерона. Бросьте инициативу и держите линию.",
    rewards: ["Победа: +18 gp", "Риск: урон от врагов"],
  },
  event: {
    title: "Шепот курганных камней",
    text: "Камни предлагают не бой, а выбор: кровь за знание, золото за короткий путь, молчание за безопасность. Можно рискнуть броском d20.",
    rewards: ["Проверка d20", "Сюжетный выбор"],
  },
  lore: {
    title: "Следы старого мира",
    text: "Вы находите фрагмент истории Санктуария: надпись, песню, письмо или карту, которая объясняет, почему гора до сих пор жива.",
    rewards: ["Фрагмент лора", "Проверка Истории"],
  },
  tavern: {
    title: "Таверна «Медный Ворон»",
    text: "За окнами темнеет тракт, внутри пахнет хлебом, мокрой шерстью и дешевым элем. Люди здесь знают больше, чем хотят сказать.",
    rewards: ["Слухи", "NPC-сцена", "Проверка d20"],
  },
  camp: {
    title: "Костер под мертвой сосной",
    text: "Огонь горит синим, но дает настоящее тепло. Здесь можно восстановить HP или подготовить оружие.",
    rewards: ["Лечение 14 HP", "Безопасный узел"],
  },
  shop: {
    title: "Лавка Миртла на колесах",
    text: "Миртл улыбается слишком широко. На полках звякают зелья, броня и слухи, которые не хотят быть услышанными.",
    rewards: ["Зелье 18 gp", "Слух о боссе"],
  },
  elite: {
    title: "Рыцарь Пустой Клятвы",
    text: "Бывший защитник храма стоит поперек дороги. Победа над элитой принесет реликвию, но даже прототип требует плату кровью.",
    rewards: ["Победа: +28 gp", "+1 реликвия"],
  },
  boss: {
    title: "Астерон, Дракон-Лич",
    text: "Сердце Горы раскрывается как черный глаз. Теперь все решает настоящий бой: инициатива, навыки класса и последний бросок d20.",
    rewards: ["Финальный бой", "Победа"],
  },
};

const COMBAT_ENCOUNTERS = {
  battle: {
    intro: "Гоблин хрипло смеется, а рядом волк скребет когтями по пеплу. Бросаем инициативу.",
    rewardGold: 18,
    enemies: [
      { id: "goblin", name: "Гоблин-разведчик", hp: 14, maxHp: 14, ac: 12, attackBonus: 3, damageDie: 8, damageBonus: 1, sprite: "goblin", initiativeBonus: 2 },
      { id: "wolf", name: "Пепельный волк", hp: 16, maxHp: 16, ac: 12, attackBonus: 4, damageDie: 8, damageBonus: 1, sprite: "wolf", initiativeBonus: 2 },
    ],
  },
  elite: {
    intro: "Рыцарь Пустой Клятвы поднимает ржавый клинок. Его броня помнит молитвы, но сердце уже нет.",
    rewardGold: 28,
    rewardRelic: "Кость Пустой Клятвы",
    enemies: [
      { id: "oath-knight", name: "Рыцарь Пустой Клятвы", hp: 40, maxHp: 40, ac: 15, attackBonus: 5, damageDie: 12, damageBonus: 2, sprite: "knight", initiativeBonus: 1 },
    ],
  },
  boss: {
    intro: "Астерон раскрывает крылья в Сердце Горы. Вторая фаза начнется, когда пепельное сердце треснет.",
    rewardGold: 80,
    enemies: [
      { id: "asteron", name: "Астерон, Дракон-Лич", hp: 78, maxHp: 78, ac: 16, attackBonus: 7, damageDie: 10, damageBonus: 3, sprite: "dragon", phase: 1, initiativeBonus: 1 },
    ],
  },
};

const HERO_COMBAT = {
  fighter: {
    attackBonus: 5,
    damageDie: 8,
    damageBonus: 3,
    skillName: "Клятвенный рассекатель",
    skillText: "1d12 + 5 и стойка: следующий урон -3.",
  },
  mage: {
    attackBonus: 5,
    damageDie: 8,
    damageBonus: 2,
    skillName: "Звездный разлом",
    skillText: "1d10 + 4 по всем врагам, половина урона даже при промахе.",
  },
  rogue: {
    attackBonus: 6,
    damageDie: 6,
    damageBonus: 3,
    skillName: "Удар из тени",
    skillText: "Преимущество на d20, 2d8 + 4. Добивает раненых сильнее.",
  },
};

const state = {
  screen: GAME_STATES.MAIN_MENU,
  heroClass: "fighter",
  subclass: "champion",
  hero: null,
  attributes: { damage: 0, defense: 0, luck: 0, charisma: 0 },
  unspentPoints: INITIAL_SKILL_POINTS,
  level: 1,
  xp: 0,
  inventory: [],
  adventureStarted: false,
  map: [],
  availableNodeIds: [],
  completedNodeIds: [],
  nodeActionUses: {},
  loreJournal: [],
  activeNodeId: null,
  combat: null,
  currentRow: 0,
  seed: Date.now(),
  threat: 2,
};

let typewriterToken = 0;
let introFinished = false;
let introSlidesStarted = false;
let introBound = false;
let bootResumeScreen = GAME_STATES.MAIN_MENU;

function getMedia(id) {
  return document.querySelector(`#${id}`);
}

function tryPlayMedia(media, volume = 1) {
  if (!media) return Promise.resolve(false);
  media.volume = volume;
  const result = media.play();
  if (!result?.catch) return Promise.resolve(true);
  return result
    .then(() => true)
    .catch(() => false);
}

function stopIntroAudio() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  ["intro-music", "intro-voice"].forEach((id) => {
    const media = getMedia(id);
    if (!media) return;
    media.pause();
    media.currentTime = 0;
  });
}

function startGameMusic() {
  const music = getMedia("game-music");
  if (!music) return;
  music.loop = true;
  tryPlayMedia(music, 0.36);
}

function stopGameMusic() {
  const music = getMedia("game-music");
  if (!music) return;
  music.pause();
}

function finishIntro() {
  if (introFinished) return;
  introFinished = true;
  stopIntroAudio();
  const video = document.querySelector("#intro-video");
  if (video) video.pause();

  const intro = document.querySelector("#intro-screen");
  if (intro) {
    intro.classList.add("is-done");
    intro.classList.remove("is-playing", "is-gated");
    window.setTimeout(() => {
      intro.classList.add("hidden");
      document.body.classList.remove("is-intro-running");
      switchScreen(GAME_STATES.MAIN_MENU);
    }, 760);
  } else {
    switchScreen(GAME_STATES.MAIN_MENU);
  }
}

async function runIntroSlides() {
  if (introSlidesStarted || introFinished) return;
  introSlidesStarted = true;
  const video = document.querySelector("#intro-video");
  const photos = [...document.querySelectorAll(".intro-photo")];
  const caption = document.querySelector("#intro-caption");
  const progress = document.querySelector("#intro-progress-bar");
  const captions = [
    "The villages were green once. Then the mountain remembered fire.",
    "Ruins answer in ash, and every road asks for a name.",
    "In the tavern's warm light, rumors become maps and choices become fate.",
  ];

  if (video) video.classList.add("is-faded");
  for (let index = 0; index < photos.length; index += 1) {
    photos.forEach((photo) => photo.classList.remove("is-active", "is-leaving"));
    if (caption) caption.textContent = captions[index];
    if (progress) progress.style.width = `${62 + index * 12}%`;
    photos[index].classList.add("is-active");
    await new Promise((resolve) => window.setTimeout(resolve, 3000));
    photos[index].classList.add("is-leaving");
    await new Promise((resolve) => window.setTimeout(resolve, 620));
  }

  if (progress) progress.style.width = "100%";
  finishIntro();
}

function startIntro() {
  const intro = document.querySelector("#intro-screen");
  if (!intro) {
    switchScreen(GAME_STATES.MAIN_MENU);
    return;
  }

  document.body.classList.add("is-intro-running");
  intro.classList.remove("hidden", "is-done", "is-playing");
  intro.classList.add("is-gated");

  const video = document.querySelector("#intro-video");
  const music = getMedia("intro-music");
  const voice = getMedia("intro-voice");
  const progress = document.querySelector("#intro-progress-bar");
  const skipButton = document.querySelector("#intro-skip");
  const playButton = document.querySelector("#intro-play");

  if (progress) progress.style.width = "0%";
  if (video) {
    video.pause();
    video.currentTime = 0;
    video.classList.remove("is-faded");
  }

  if (introBound) return;
  introBound = true;
  skipButton?.addEventListener("click", finishIntro);
  playButton?.addEventListener("click", () => {
    introFinished = false;
    introSlidesStarted = false;
    intro.classList.remove("is-gated");
    intro.classList.add("is-playing");
    document.querySelectorAll(".intro-photo").forEach((photo) => photo.classList.remove("is-active", "is-leaving"));
    if (progress) progress.style.width = "0%";

    if (video) {
      video.muted = false;
      video.volume = 0.55;
      video.currentTime = 0;
      video.addEventListener("timeupdate", () => {
        if (!video.duration || !progress) return;
        progress.style.width = `${Math.min(60, (video.currentTime / video.duration) * 60)}%`;
      });
      video.addEventListener("ended", runIntroSlides, { once: true });
      video.addEventListener("error", runIntroSlides, { once: true });
      tryPlayMedia(video, 0.55).then((played) => {
        if (!played) runIntroSlides();
      });
    } else {
      runIntroSlides();
    }

    [music, voice].forEach((media) => {
      if (media) media.currentTime = 0;
    });
    tryPlayMedia(music, 0.44);
    tryPlayMedia(voice, 0.88).then((played) => {
      if (!played && "speechSynthesis" in window) {
        const spoken = new SpeechSynthesisUtterance("In the Veil of Ash, the mountain has begun to breathe again. Old roads vanish. Villages burn without fire. Beneath the Heart of the Mountain, an ancient dragon lich stirs. Listen well. Choose carefully. Roll the dice.");
        spoken.rate = 0.86;
        spoken.pitch = 0.78;
        spoken.volume = 0.8;
        window.speechSynthesis.speak(spoken);
      }
    });
  });
}

function createRng(seed) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function pick(list, rng) {
  return list[Math.floor(rng() * list.length)];
}

function getStableIndex(key, length, salt = 0) {
  let hash = state.seed + salt;
  for (let index = 0; index < key.length; index += 1) {
    hash = (hash * 31 + key.charCodeAt(index)) % 2147483647;
  }
  return Math.abs(hash) % length;
}

function getAllNodes() {
  return state.map.flat();
}

function getNode(nodeId) {
  return getAllNodes().find((node) => node.id === nodeId);
}

function isCombatNode(type) {
  return type === "battle" || type === "elite" || type === "boss";
}

function getNodeActions(nodeId = state.activeNodeId) {
  if (!nodeId) return {};
  if (!state.nodeActionUses) state.nodeActionUses = {};
  if (!state.nodeActionUses[nodeId]) state.nodeActionUses[nodeId] = {};
  return state.nodeActionUses[nodeId];
}

function getSubclassName(id = state.subclass) {
  return Object.values(SUBCLASSES).flat().find((subclass) => subclass.id === id)?.name || "Без подкласса";
}

function getSubclassTrait(id = state.subclass) {
  return SUBCLASS_TRAITS[id] || {};
}

function getXpToNext(level = state.level || 1) {
  return Math.round(30 + level * 18 + Math.pow(level, 1.42) * 12);
}

function ensureProgressionState() {
  state.attributes = {
    damage: Number(state.attributes?.damage || 0),
    defense: Number(state.attributes?.defense || 0),
    luck: Number(state.attributes?.luck || 0),
    charisma: Number(state.attributes?.charisma || 0),
  };
  if (typeof state.unspentPoints !== "number") state.unspentPoints = INITIAL_SKILL_POINTS;
  if (typeof state.level !== "number") state.level = 1;
  if (typeof state.xp !== "number") state.xp = 0;
  if (!Array.isArray(state.inventory)) state.inventory = [];
  if (typeof state.adventureStarted !== "boolean") {
    state.adventureStarted = Boolean(state.currentRow > 0 || state.completedNodeIds?.length || state.screen === GAME_STATES.WORLD_MAP || state.screen === GAME_STATES.ENCOUNTER);
  }
}

function resetBuildPoints() {
  state.attributes = { damage: 0, defense: 0, luck: 0, charisma: 0 };
  state.unspentPoints = INITIAL_SKILL_POINTS;
  state.level = 1;
  state.xp = 0;
  state.inventory = [];
  state.adventureStarted = false;
}

function getItemStats() {
  return (state.inventory || []).reduce(
    (stats, itemId) => {
      const item = ITEM_DEFS.find((candidate) => candidate.id === itemId);
      if (!item) return stats;
      stats.hp += item.hp || 0;
      stats.ac += item.ac || 0;
      stats.damage += item.damage || 0;
      stats.attack += item.attack || 0;
      stats.luck += item.luck || 0;
      stats.charisma += item.charisma || 0;
      return stats;
    },
    { hp: 0, ac: 0, damage: 0, attack: 0, luck: 0, charisma: 0 },
  );
}

function getEffectiveStats() {
  ensureProgressionState();
  const base = HEROES[state.heroClass];
  const trait = getSubclassTrait();
  const items = getItemStats();
  const attributes = state.attributes;
  const maxHp = Math.max(1, Math.round(base.maxHp + (trait.hp || 0) + attributes.defense + items.hp));
  const ac = Math.round((base.ac + (trait.ac || 0) + attributes.damage * 0.5 + items.ac) * 2) / 2;
  const combat = HERO_COMBAT[state.heroClass];
  return {
    maxHp,
    ac,
    attackBonus: Math.round(combat.attackBonus + (trait.attack || 0) + (items.attack || 0)),
    damageDie: combat.damageDie,
    damageBonus: Math.round(combat.damageBonus + (trait.damage || 0) + attributes.damage * 0.75 + (items.damage || 0)),
    luck: attributes.luck + (trait.luck || 0) + (items.luck || 0),
    charisma: attributes.charisma + (trait.charisma || 0) + (items.charisma || 0),
    dodgeDie: trait.dodgeDie || 0,
    dodgeTarget: trait.dodgeTarget || 0,
    critFloor: trait.critFloor || 20,
    lootBonus: trait.lootBonus || 0,
    guard: trait.guard || 0,
    magicGuard: trait.magicGuard || 0,
    leech: trait.leech || 0,
    execute: trait.execute || 0,
    riposte: trait.riposte || 0,
    spellSplash: trait.spellSplash || 0,
  };
}

function syncHeroStats(keepHpRatio = true) {
  if (!state.hero) return;
  const effective = getEffectiveStats();
  const previousMax = state.hero.maxHp || effective.maxHp;
  const ratio = keepHpRatio ? state.hero.hp / previousMax : 1;
  state.hero.maxHp = effective.maxHp;
  state.hero.ac = effective.ac;
  state.hero.hp = Math.max(1, Math.min(effective.maxHp, Math.round(effective.maxHp * ratio)));
}

function rollHeroD20() {
  const effective = getEffectiveStats();
  const first = rollDie(20);
  const luckChance = Math.min(0.42, effective.luck * 0.045);
  if (effective.luck > 0 && Math.random() < luckChance) {
    const second = rollDie(20);
    return { value: Math.max(first, second), rolls: [first, second], lucky: true };
  }
  return { value: first, rolls: [first], lucky: false };
}

function addXp(source, customAmount) {
  ensureProgressionState();
  const amount = customAmount ?? XP_REWARDS[source] ?? 0;
  if (!amount) return { amount: 0, leveled: 0 };
  state.xp += amount;
  let leveled = 0;
  while (state.xp >= getXpToNext(state.level)) {
    state.xp -= getXpToNext(state.level);
    state.level += 1;
    state.unspentPoints += 2;
    leveled += 1;
  }
  return { amount, leveled };
}

function maybeGrantItem(source = "battle") {
  const effective = getEffectiveStats();
  const baseChance = source === "elite" ? 0.55 : source === "boss" ? 1 : 0.24;
  const chance = Math.min(0.85, baseChance + effective.luck * 0.035 + (effective.lootBonus || 0));
  if (Math.random() > chance) return null;
  const available = ITEM_DEFS.filter((item) => !state.inventory.includes(item.id));
  if (!available.length) return null;
  const item = available[Math.floor(Math.random() * available.length)];
  state.inventory.push(item.id);
  syncHeroStats(true);
  return item;
}

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function rollDamage(die, bonus = 0, diceCount = 1) {
  const rolls = Array.from({ length: diceCount }, () => rollDie(die));
  return {
    rolls,
    total: rolls.reduce((sum, value) => sum + value, 0) + bonus,
  };
}

function createHero(options = {}) {
  const base = HEROES[state.heroClass];
  ensureProgressionState();
  if (options.resetBuild) resetBuildPoints();
  state.subclass = state.subclass || base.defaultSubclass;
  const effective = getEffectiveStats();
  const previousHpRatio = state.hero && !options.fullHeal ? state.hero.hp / Math.max(1, state.hero.maxHp) : 1;
  state.hero = {
    classId: state.heroClass,
    title: base.title,
    name: `${base.title} - ${getSubclassName(state.subclass)}`,
    hp: Math.max(1, Math.round(effective.maxHp * previousHpRatio)),
    maxHp: effective.maxHp,
    ac: effective.ac,
    gold: base.gold,
    relics: [base.relic],
    potions: 2,
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || !saved.map || !saved.heroClass) return false;
    Object.assign(state, saved);
    return true;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return false;
  }
}

function switchScreen(screenId) {
  const nextScreen = document.querySelector(`[data-screen="${screenId}"]`);
  if (!nextScreen) return;

  document.querySelector("#app").dataset.state = screenId;
  state.screen = screenId;

  if ([GAME_STATES.CHARACTER_SELECT, GAME_STATES.STAT_ALLOC, GAME_STATES.WORLD_MAP, GAME_STATES.ENCOUNTER].includes(screenId)) {
    startGameMusic();
  }
  if ([GAME_STATES.MAIN_MENU, GAME_STATES.GAME_OVER, GAME_STATES.VICTORY].includes(screenId)) {
    stopGameMusic();
  }

  document.querySelectorAll(".screen[data-screen]").forEach((screen) => {
    if (screen === nextScreen) return;
    screen.classList.add("hidden");
    screen.classList.remove("is-active", "is-exiting");
  });

  nextScreen.classList.remove("hidden", "is-exiting");
  void nextScreen.offsetWidth;
  nextScreen.classList.add("is-active");
  if (screenId === GAME_STATES.WORLD_MAP) {
    window.setTimeout(focusCurrentMapStep, 140);
  }
  saveState();
}

window.switchScreen = switchScreen;

function setDmText(text) {
  const dmText = document.querySelector("#dm-text");
  if (!dmText) return;

  typewriterToken += 1;
  const token = typewriterToken;
  dmText.textContent = "";

  let cursor = 0;
  const tick = () => {
    if (token !== typewriterToken) return;
    dmText.textContent = text.slice(0, cursor);
    cursor += 1;
    if (cursor <= text.length) {
      window.setTimeout(tick, 14);
    }
  };
  tick();
}

function generateMap(seed = Date.now()) {
  const rng = createRng(seed);
  const map = [];
  const topMargin = 110;
  const bottomMargin = MAP_CANVAS_HEIGHT - 115;

  for (let row = 0; row < MAP_ROWS; row += 1) {
    const isBoss = row === MAP_ROWS - 1;
    const count = isBoss ? 1 : 2 + Math.floor(rng() * 3);
    const y = bottomMargin - row * ((bottomMargin - topMargin) / (MAP_ROWS - 1));
    const nodes = [];

    for (let col = 0; col < count; col += 1) {
      const spread = 760 / Math.max(count - 1, 1);
      const jitter = isBoss ? 0 : (rng() - 0.5) * 58;
      const x = isBoss ? 500 : 120 + col * spread + jitter;
      let type = "battle";

      if (isBoss) type = "boss";
      else if (row === 0) type = pick(["event", "tavern", "battle", "lore"], rng);
      else if (row === MAP_ROWS - 2) type = pick(["camp", "tavern", "shop", "lore", "elite"], rng);
      else if (row % 5 === 0) type = pick(["tavern", "camp", "shop", "lore", "elite"], rng);
      else type = pick(["event", "event", "tavern", "tavern", "lore", "lore", "camp", "shop", "battle", "battle", "elite"], rng);

      nodes.push({
        id: `r${row}c${col}`,
        row,
        col,
        x: Math.round(Math.max(75, Math.min(925, x))),
        y: Math.round(y),
        type,
        nextIds: [],
      });
    }

    map.push(nodes);
  }

  for (let row = 0; row < MAP_ROWS - 1; row += 1) {
    const current = map[row];
    const next = map[row + 1];

    current.forEach((node) => {
      const nearest = [...next]
        .sort((a, b) => Math.abs(a.x - node.x) - Math.abs(b.x - node.x))
        .slice(0, 1 + Math.floor(rng() * Math.min(3, next.length)));
      node.nextIds = [...new Set(nearest.map((target) => target.id))];
    });

    next.forEach((target) => {
      const hasIncoming = current.some((node) => node.nextIds.includes(target.id));
      if (!hasIncoming) {
        const source = [...current].sort((a, b) => Math.abs(a.x - target.x) - Math.abs(b.x - target.x))[0];
        source.nextIds.push(target.id);
      }
    });
  }

  return map;
}

function resetRun(keepHero = false) {
  state.seed = Date.now();
  state.map = generateMap(state.seed);
  state.availableNodeIds = state.map[0].map((node) => node.id);
  state.completedNodeIds = [];
  state.nodeActionUses = {};
  state.loreJournal = [];
  state.activeNodeId = null;
  state.combat = null;
  state.currentRow = 0;
  state.threat = 2;
  state.adventureStarted = false;
  if (!keepHero || !state.hero) createHero();
  saveState();
  renderAll();
  window.setTimeout(focusCurrentMapStep, 120);
}

function renderHeroSelection() {
  const hero = HEROES[state.heroClass];
  const effective = getEffectiveStats();
  const trait = getSubclassTrait();
  const characterScreen = document.querySelector("#screen-character-select");
  if (characterScreen) characterScreen.dataset.hero = state.heroClass;
  document.querySelector("#hero-class-title").textContent = hero.epithet;
  document.querySelector("#hero-class-copy").textContent = `${hero.backstory} Стартовая реликвия: ${hero.relic} — ${hero.relicText} ${trait.note || ""}`;
  document.querySelector("#stat-hp").textContent = effective.maxHp;
  document.querySelector("#stat-ac").textContent = effective.ac;
  document.querySelector("#stat-gold").textContent = hero.gold;
  document.querySelector("#stat-relic").textContent = hero.relic;
  document.querySelector("#selected-subclass").textContent = getSubclassName();
  renderClassParticles(state.heroClass);

  document.querySelectorAll(".class-card").forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.class === state.heroClass);
  });

  document.querySelectorAll("[data-portrait]").forEach((portrait) => {
    portrait.classList.toggle("is-active", portrait.dataset.portrait === hero.portrait);
  });

  const subclassGrid = document.querySelector("#subclass-grid");
  subclassGrid.innerHTML = SUBCLASSES[state.heroClass]
    .map(
      (subclass) => `
        <article class="subclass-card ${subclass.id === state.subclass ? "is-active" : ""}">
          <span class="subclass-icon subclass-icon--${subclass.color}"></span>
          <h3>${subclass.name}</h3>
          <p>${subclass.text}</p>
          <button type="button" data-subclass="${subclass.id}" aria-label="Выбрать ${subclass.name}"></button>
        </article>
      `,
    )
    .join("");
}

function renderClassParticles(heroClass = state.heroClass) {
  const portrait = document.querySelector(".hero-portrait");
  if (!portrait) return;
  let layer = portrait.querySelector(".class-particles");
  if (!layer) {
    layer = document.createElement("div");
    layer.className = "class-particles";
    portrait.appendChild(layer);
  }
  layer.className = `class-particles class-particles--${heroClass}`;
  layer.innerHTML = Array.from({ length: heroClass === "mage" ? 16 : 28 }, (_, index) => {
    const x = (index * 37 + 13) % 100;
    const y = (index * 19 + 11) % 100;
    const drift = ((index % 7) - 3) * 18;
    const delay = -((index * 0.41) % 8).toFixed(2);
    const size = 3 + (index % 5);
    return `<span style="--x:${x}%;--y:${y}%;--drift:${drift}px;--delay:${delay}s;--size:${size}px"></span>`;
  }).join("");
}

function renderHud() {
  if (!state.hero) return;
  syncHeroStats(true);
  const hpPercent = Math.max(0, Math.round((state.hero.hp / state.hero.maxHp) * 100));
  document.querySelector("#hero-name").textContent = state.hero.name;
  document.querySelector("#hero-hp-text").textContent = `${state.hero.hp} / ${state.hero.maxHp}`;
  document.querySelector("#hero-hp-meter").style.width = `${hpPercent}%`;
  document.querySelector("#hero-gold").textContent = `${state.hero.gold} gp`;
  document.querySelector("#hero-relics").textContent = `Реликвии: ${state.hero.relics.join(", ")}`;
  const floor = document.querySelector("#hud-floor");
  const threat = document.querySelector("#hud-threat");
  if (floor) floor.textContent = `Путь ${Math.min(state.currentRow, MAP_ROWS - 1)}/${MAP_ROWS - 1}`;
  if (threat) threat.textContent = `Угроза ${state.threat}`;
}

function renderStatAllocation() {
  ensureProgressionState();
  const grid = document.querySelector("#stat-build-grid");
  if (!grid) return;
  const effective = getEffectiveStats();
  const isMidRun = state.adventureStarted;
  const title = document.querySelector("#stat-alloc-title");
  const copy = document.querySelector(".stat-alloc-copy");
  const primary = document.querySelector('[data-action="start-adventure"]');
  const secondary = document.querySelector('[data-action="back-to-hero"]');
  if (title) title.textContent = isMidRun ? "Усилить героя перед следующей дорогой" : "Распределите очки навыка";
  if (copy) {
    copy.textContent = isMidRun
      ? "Вложите очки, полученные за уровень. Урон усиливает атаки и дает +0.5 AC за очко, защита дает +1 HP, удача помогает d20 и луту, харизма открывает людей в тавернах."
      : "У вас есть 10 начальных очков. Урон усиливает атаки и дает +0.5 AC за очко, защита дает +1 HP, удача помогает d20 и луту, харизма открывает людей в тавернах.";
  }
  if (primary) primary.textContent = isMidRun ? "Вернуться к карте" : "Начать путь";
  if (secondary) secondary.textContent = isMidRun ? "Закрыть" : "Вернуться к герою";
  document.querySelector("#build-points").textContent = state.unspentPoints;
  document.querySelector("#build-level").textContent = state.level;
  document.querySelector("#build-xp").textContent = `${state.xp}/${getXpToNext()}`;
  grid.innerHTML = Object.entries(ATTRIBUTE_META)
    .map(([key, meta]) => `
      <article class="stat-build-card">
        <div>
          <span>${meta.short}</span>
          <strong>${meta.title}</strong>
          <p>${meta.text}</p>
        </div>
        <div class="stat-stepper">
          <button type="button" data-stat-action="dec" data-attribute="${key}" aria-label="Уменьшить ${meta.title}">-</button>
          <b>${state.attributes[key]}</b>
          <button type="button" data-stat-action="inc" data-attribute="${key}" aria-label="Увеличить ${meta.title}">+</button>
        </div>
      </article>
    `)
    .join("");
  document.querySelector("#stat-preview").innerHTML = `
    <span>HP <b>${effective.maxHp}</b></span>
    <span>AC <b>${effective.ac}</b></span>
    <span>Атака <b>+${effective.attackBonus}</b></span>
    <span>Урон <b>+${effective.damageBonus}</b></span>
    <span>Удача <b>${effective.luck}</b></span>
    <span>Харизма <b>${effective.charisma}</b></span>
  `;
}

function renderSidebar() {
  const journal = document.querySelector("#journal-list");
  const inventory = document.querySelector("#inventory-body");
  const progress = document.querySelector("#progress-body");
  if (!journal || !inventory || !progress) return;

  const portrait = ASSETS[state.heroClass] || ASSETS.fighter;
  const items = state.inventory || [];
  journal.innerHTML = state.loreJournal?.length
    ? state.loreJournal
        .slice(-6)
        .reverse()
        .map((entry) => `<article class="journal-entry"><span></span><p>${entry}</p></article>`)
        .join("")
    : `<article class="journal-empty">Лор еще не открыт. Таверны, руины и события будут заполнять этот журнал.</article>`;

  inventory.innerHTML = `
    <div class="inventory-hero">
      <img src="${portrait}" alt="${state.hero?.title || "Герой"}">
      <div>
        <strong>${state.hero?.name || getSubclassName()}</strong>
        <span>Зелья: ${state.hero?.potions ?? 0}</span>
      </div>
    </div>
    <div class="inventory-items">
      ${items.length
        ? items.map((itemId) => {
            const item = ITEM_DEFS.find((candidate) => candidate.id === itemId);
            return item ? `<article class="inventory-item"><b>${item.name}</b><span>${item.slot}: ${item.text}</span></article>` : "";
          }).join("")
        : `<article class="inventory-item inventory-item--empty"><b>Пустые ремни</b><span>Предметы падают после боев. Удача повышает шанс.</span></article>`}
    </div>
  `;

  const xpToNext = getXpToNext();
  const xpPercent = Math.min(100, Math.round((state.xp / xpToNext) * 100));
  document.querySelector("#progress-title").textContent = `Уровень ${state.level}`;
  progress.innerHTML = `
    <div class="xp-bar"><span style="width:${xpPercent}%"></span></div>
    <p>${state.xp}/${xpToNext} XP · свободно очков: <b>${state.unspentPoints}</b></p>
    <div class="mini-stat-grid">
      ${Object.entries(ATTRIBUTE_META).map(([key, meta]) => `<span>${meta.title}: <b>${state.attributes[key]}</b></span>`).join("")}
    </div>
    ${state.unspentPoints > 0 ? '<button class="button button--primary" type="button" data-action="open-levelup">Прокачать</button>' : ""}
  `;
}

function renderMap() {
  const lines = document.querySelector("#map-lines");
  const nodesLayer = document.querySelector("#map-nodes");
  const canvas = document.querySelector("#map-scroll-canvas");
  if (canvas) canvas.style.height = `${MAP_CANVAS_HEIGHT}px`;
  lines.setAttribute("viewBox", `0 0 1000 ${MAP_CANVAS_HEIGHT}`);
  lines.innerHTML = "";
  nodesLayer.innerHTML = "";

  nodesLayer.insertAdjacentHTML(
    "beforeend",
    `
      <div class="map-region map-region--north">Frost Crown</div>
      <div class="map-region map-region--west">Blackwood</div>
      <div class="map-region map-region--south">Ashen Road</div>
      <div class="map-river map-river--one"></div>
      <div class="map-river map-river--two"></div>
      <div class="map-compass" aria-hidden="true"><span>N</span></div>
      <div class="map-landmark map-landmark--mountain" style="left: 50%; top: 6%;">
        <span></span><strong>Сердце Горы</strong>
      </div>
      <div class="map-landmark map-landmark--forest" style="left: 18%; top: 34%;">
        <span></span><strong>Черный Бор</strong>
      </div>
      <div class="map-landmark map-landmark--town" style="left: 76%; top: 58%;">
        <span></span><strong>Медный Ворон</strong>
      </div>
      <div class="map-landmark map-landmark--ruins" style="left: 26%; top: 78%;">
        <span></span><strong>Старые Руины</strong>
      </div>
    `,
  );

  getAllNodes().forEach((node) => {
    node.nextIds.forEach((nextId) => {
      const next = getNode(nextId);
      if (!next) return;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const midY = (node.y + next.y) / 2;
      path.setAttribute("d", `M ${node.x} ${node.y} C ${node.x} ${midY}, ${next.x} ${midY}, ${next.x} ${next.y}`);
      lines.appendChild(path);
    });
  });

  getAllNodes().forEach((node) => {
    const meta = NODE_TYPES[node.type];
    const isAvailable = state.availableNodeIds.includes(node.id);
    const isCompleted = state.completedNodeIds.includes(node.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = [
      "map-node",
      `map-node--${node.type}`,
      isAvailable ? "is-available" : "is-locked",
      isCompleted ? "is-completed" : "",
    ]
      .filter(Boolean)
      .join(" ");
    button.style.left = `${node.x / 10}%`;
    button.style.top = `${(node.y / MAP_CANVAS_HEIGHT) * 100}%`;
    button.dataset.nodeId = node.id;
    button.disabled = !isAvailable || isCompleted;
    button.innerHTML = `<span class="map-node__icon">${meta.icon}</span><span class="map-node__label">${meta.label}</span>`;
    nodesLayer.appendChild(button);
  });
}

function focusCurrentMapStep() {
  const stage = document.querySelector("#map-stage");
  if (!stage || !state.map.length) return;

  const preferredIds = state.availableNodeIds?.length
    ? state.availableNodeIds
    : state.completedNodeIds?.slice(-1);
  const target = preferredIds
    ?.map((id) => getNode(id))
    .filter(Boolean)
    .sort((a, b) => a.y - b.y)[0];
  if (!target) return;

  const maxScroll = Math.max(0, MAP_CANVAS_HEIGHT - stage.clientHeight);
  const top = Math.max(0, Math.min(maxScroll, target.y - stage.clientHeight * 0.56));
  stage.scrollTo({ top, behavior: "smooth" });
}

function renderEncounterArt(type) {
  if (type === "tavern") {
    document.querySelector("#encounter-art").innerHTML = `
      <div class="scene-art scene-art--tavern">
        <div class="scene-art__shade"></div>
        <div class="scene-art__caption">
          <strong>Медный Ворон</strong>
          <span>тепло, слухи и опасные обещания</span>
        </div>
      </div>
    `;
    return;
  }

  if (type === "lore" || type === "event") {
    const image = type === "lore" ? ASSETS.ruins : ASSETS.village;
    document.querySelector("#encounter-art").innerHTML = `
      <div class="scene-art" style="--scene-image: url('${image}')">
        <div class="scene-art__shade"></div>
        <div class="scene-art__caption">
          <strong>${type === "lore" ? "Старые Руины" : "Пепельная дорога"}</strong>
          <span>${type === "lore" ? "надписи старого мира ждут броска Истории" : "мир отвечает на выборы, а не только на клинки"}</span>
        </div>
      </div>
    `;
    return;
  }

  const colors = {
    battle: ["#9eabb9", "#d9a85b"],
    event: ["#73d2e4", "#9c83e6"],
    lore: ["#4f8b7a", "#d9a85b"],
    tavern: ["#d88c4a", "#74c58c"],
    camp: ["#74c58c", "#f3cf7e"],
    shop: ["#d9a85b", "#73d2e4"],
    elite: ["#e07b45", "#c75d5d"],
    boss: ["#c75d5d", "#9c83e6"],
  };
  const [primary, secondary] = colors[type] || colors.event;
  document.querySelector("#encounter-art").innerHTML = `
    <svg viewBox="0 0 520 620" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="encounterGlow" cx="50%" cy="35%" r="58%">
          <stop offset="0" stop-color="${primary}" stop-opacity="0.42"/>
          <stop offset="1" stop-color="#0b1017" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="520" height="620" fill="#0b1017"/>
      <rect width="520" height="620" fill="url(#encounterGlow)"/>
      <path d="M0 458c75-72 148-87 238-43 86 41 143 35 221-31 30-25 50-39 61-43v279H0V458Z" fill="#141b25"/>
      <path d="M260 110 356 430H164L260 110Z" fill="#202a38"/>
      <path d="M260 152v250M188 270h144" stroke="${secondary}" stroke-width="12" stroke-linecap="round"/>
      <circle cx="260" cy="270" r="94" fill="none" stroke="${primary}" stroke-width="6" opacity="0.38"/>
    </svg>
  `;
}

function renderEncounter(node) {
  const copy = ENCOUNTER_COPY[node.type];
  document.querySelector("#encounter-kicker").textContent = NODE_TYPES[node.type].kicker;
  document.querySelector("#encounter-title").textContent = copy.title;
  document.querySelector("#encounter-rewards").innerHTML = copy.rewards
    .map((reward) => `<span class="reward-chip">${reward}</span>`)
    .join("");

  if (isCombatNode(node.type)) {
    ensureCombat(node);
    renderCombat(node);
    return;
  }

  state.combat = null;
  renderEncounterArt(node.type);
  setDmText(copy.text);
  renderEncounterActions(node);
}

function renderEncounterActions(node) {
  const actions = document.querySelector("#encounter-actions");
  const used = getNodeActions(node.id);

  if (node.type === "event") {
    actions.innerHTML = `
      ${used.eventRoll ? '<span class="reward-chip">Проверка d20 уже сделана</span>' : '<button class="button button--primary" type="button" data-action="event-roll">Бросить d20</button>'}
      <button class="button" type="button" data-action="complete-node">Пройти осторожно</button>
    `;
  } else if (node.type === "tavern") {
    const npc = TAVERN_NPCS[getStableIndex(node.id, TAVERN_NPCS.length, 17)];
    actions.innerHTML = `
      <span class="reward-chip">${npc.name}, ${npc.role}</span>
      ${used.tavernRumor ? '<span class="reward-chip">Слух уже услышан</span>' : '<button class="button button--primary" type="button" data-action="tavern-rumor">Слушать зал</button>'}
      ${used.tavernTalk ? '<span class="reward-chip">Разговор завершен</span>' : `<button class="button" type="button" data-action="tavern-talk">Говорить с NPC (${npc.check})</button>`}
      <button class="button button--ghost" type="button" data-action="complete-node">Покинуть таверну</button>
    `;
  } else if (node.type === "lore") {
    const lore = LORE_ENTRIES[getStableIndex(node.id, LORE_ENTRIES.length, 31)];
    actions.innerHTML = `
      <span class="reward-chip">${lore.title}</span>
      ${used.loreStudy ? '<span class="reward-chip">Фрагмент записан</span>' : '<button class="button button--primary" type="button" data-action="lore-study">Изучить надпись</button>'}
      <button class="button button--ghost" type="button" data-action="complete-node">Продолжить путь</button>
    `;
  } else if (node.type === "camp") {
    actions.innerHTML = `
      ${used.campHeal ? '<span class="reward-chip">Лечение у костра использовано</span>' : '<button class="button button--primary" type="button" data-action="camp-heal">Лечиться</button>'}
      <button class="button" type="button" data-action="complete-node">Уйти дальше</button>
    `;
  } else if (node.type === "shop") {
    actions.innerHTML = `
      ${used.buyPotion ? '<span class="reward-chip">Зелье куплено</span>' : '<button class="button button--primary" type="button" data-action="buy-potion">Купить зелье -18 gp</button>'}
      <button class="button" type="button" data-action="complete-node">Покинуть лавку</button>
    `;
  } else {
    actions.innerHTML = `<button class="button button--primary" type="button" data-action="complete-node">Завершить встречу</button>`;
  }
}

function ensureCombat(node) {
  if (state.combat && state.combat.nodeId === node.id && !state.combat.claimed) return;

  const template = COMBAT_ENCOUNTERS[node.type];
  const effective = getEffectiveStats();
  const heroInitiative = rollHeroD20().value + 2 + Math.floor(effective.luck / 3);
  const enemyInitiative = Math.max(...template.enemies.map((enemy) => rollDie(20) + (enemy.initiativeBonus || 0)));
  const playerStarts = heroInitiative >= enemyInitiative;
  state.combat = {
    nodeId: node.id,
    type: node.type,
    turn: playerStarts ? "player" : "enemy",
    round: 1,
    initiative: { hero: heroInitiative, enemies: enemyInitiative },
    selectedEnemyId: template.enemies[0].id,
    enemies: template.enemies.map((enemy) => ({ ...enemy })),
    log: [`${template.intro} Герой ${heroInitiative}, враги ${enemyInitiative}. ${playerStarts ? "Вы ходите первым." : "Враги срываются с места первыми."}`],
    lastRoll: null,
    floating: null,
    victory: false,
    claimed: false,
    relicShieldUsed: false,
    guard: effective.guard + (state.subclass === "samurai" ? 3 : 0),
    magicGuardUsed: false,
  };
  saveState();
}

function getLivingEnemies() {
  return state.combat?.enemies.filter((enemy) => enemy.hp > 0) || [];
}

function getSelectedEnemy() {
  const living = getLivingEnemies();
  if (!living.length) return null;
  const selected = living.find((enemy) => enemy.id === state.combat.selectedEnemyId);
  return selected || living[0];
}

function getEnemySprite(enemy) {
  const opacity = enemy.hp <= 0 ? "0.46" : "1";
  if (enemy.sprite === "wolf") {
    return `
      <svg viewBox="0 0 240 240" aria-hidden="true" style="opacity:${opacity}">
        <ellipse cx="122" cy="211" rx="74" ry="18" fill="rgba(0,0,0,.38)"/>
        <path d="M46 166c10-43 39-69 83-76l34-34-2 45c22 10 34 31 36 64l-42-11-26 36-28-31-55 7Z" fill="#5d6572" stroke="#222a34" stroke-width="7" stroke-linejoin="round"/>
        <path d="M83 101 61 53l55 31 47-31-19 51" fill="#303744" stroke="#1b212b" stroke-width="6" stroke-linejoin="round"/>
        <path d="M84 119c18 12 57 12 77 0" stroke="#8893a1" stroke-width="7" stroke-linecap="round"/>
        <path d="M132 115h18M95 115h16" stroke="#f7d878" stroke-width="7" stroke-linecap="round"/>
        <path d="M126 132l13 17 12-15" fill="none" stroke="#1b212b" stroke-width="5" stroke-linecap="round"/>
        <path d="M160 159c20-7 34-2 42 13" fill="none" stroke="#d8c18a" stroke-width="10" stroke-linecap="round"/>
        <path d="M52 166c22 9 47 7 75-8" fill="none" stroke="#3b4350" stroke-width="9" stroke-linecap="round"/>
      </svg>
    `;
  }
  if (enemy.sprite === "knight") {
    return `
      <svg viewBox="0 0 240 240" aria-hidden="true" style="opacity:${opacity}">
        <ellipse cx="122" cy="214" rx="70" ry="19" fill="rgba(0,0,0,.42)"/>
        <path d="M64 213c7-78 27-119 59-119s52 41 59 119H64Z" fill="#252b35"/>
        <path d="M78 133c10-48 80-48 90 0l-21 55H99l-21-55Z" fill="#8d99a8" stroke="#2b333e" stroke-width="7" stroke-linejoin="round"/>
        <path d="M80 115 123 43l43 72-19 30H99l-19-30Z" fill="#c4ccd6" stroke="#323b48" stroke-width="7" stroke-linejoin="round"/>
        <path d="M100 116h48M123 63v86" stroke="#f0cf84" stroke-width="8" stroke-linecap="round"/>
        <path d="M178 211 72 87" stroke="#d9c28e" stroke-width="13" stroke-linecap="round"/>
        <path d="M157 70h49v49" fill="none" stroke="#f1dca7" stroke-width="9" stroke-linecap="round"/>
        <path d="M93 161c20 12 40 12 60 0" fill="none" stroke="#5f6876" stroke-width="7" stroke-linecap="round"/>
      </svg>
    `;
  }
  if (enemy.sprite === "dragon") {
    return `
      <svg viewBox="0 0 260 260" aria-hidden="true" style="opacity:${opacity}">
        <ellipse cx="130" cy="226" rx="92" ry="22" fill="rgba(0,0,0,.5)"/>
        <path d="M37 163 10 70l69 42 51-86 51 86 69-42-27 93-40-21-16 66H93l-16-66-40 21Z" fill="#3a3142" stroke="#191521" stroke-width="8" stroke-linejoin="round"/>
        <path d="M83 101c19-52 75-52 94 0l-22 58h-50l-22-58Z" fill="#695b72" stroke="#201b27" stroke-width="8"/>
        <path d="M96 95 130 34l34 61-15 49h-38L96 95Z" fill="#b9c1ca" stroke="#252a35" stroke-width="7" stroke-linejoin="round"/>
        <path d="M105 111h18M137 111h18" stroke="#ffe08e" stroke-width="8" stroke-linecap="round"/>
        <path d="M130 139v48M104 163h52" stroke="#ffb347" stroke-width="10" stroke-linecap="round" filter="drop-shadow(0 0 10px rgba(255,143,48,.8))"/>
        <path d="M61 181c35 12 81 12 138 0" fill="none" stroke="#221c2d" stroke-width="8" stroke-linecap="round"/>
        <path d="M54 79 25 39M206 79l29-40" stroke="#d8c18a" stroke-width="7" stroke-linecap="round"/>
      </svg>
    `;
  }
  return `
    <svg viewBox="0 0 240 240" aria-hidden="true" style="opacity:${opacity}">
      <ellipse cx="121" cy="214" rx="68" ry="18" fill="rgba(0,0,0,.38)"/>
      <path d="M70 211c5-65 24-101 55-101s50 36 55 101H70Z" fill="#4f6d52" stroke="#233126" stroke-width="7"/>
      <path d="M62 112 30 82l52 7c19-38 69-38 88 0l52-7-32 30-17 54H79l-17-54Z" fill="#73a273" stroke="#273d2b" stroke-width="8" stroke-linejoin="round"/>
      <path d="M84 119h25M138 119h25" stroke="#f6d879" stroke-width="8" stroke-linecap="round"/>
      <path d="M118 133c11 8 21 8 32 0" fill="none" stroke="#243226" stroke-width="5" stroke-linecap="round"/>
      <path d="M77 160c29 11 67 11 105 0" fill="none" stroke="#2f5235" stroke-width="8" stroke-linecap="round"/>
      <path d="M59 196 174 71" stroke="#e6c991" stroke-width="13" stroke-linecap="round"/>
      <path d="M151 62h44v44" fill="none" stroke="#f4dda7" stroke-width="9" stroke-linecap="round"/>
      <path d="M95 92c16-13 43-13 59 0" fill="none" stroke="#a8cf93" stroke-width="6" stroke-linecap="round"/>
    </svg>
  `;
}

function getHeroSprite() {
  if (state.heroClass === "mage") {
    return `<svg viewBox="0 0 160 160"><circle class="sprite-shadow" cx="80" cy="139" r="34"/><path class="sprite-cloak" d="M48 136c5-43 16-66 32-66s27 23 32 66H48Z"/><path class="sprite-helm" d="M51 75 80 28l29 47-15 30H66L51 75Z"/><circle cx="80" cy="77" r="13" fill="#d9f7ff"/><path class="sprite-glow" d="M50 123c21-21 39-21 60 0M80 95v40"/></svg>`;
  }
  if (state.heroClass === "rogue") {
    return `<svg viewBox="0 0 160 160"><circle class="sprite-shadow" cx="80" cy="139" r="34"/><path class="sprite-cloak" d="M43 136c8-48 20-72 37-72s29 24 37 72H43Z"/><path class="sprite-fur-dark" d="M49 76c20-36 42-36 62 0l-18 34H67L49 76Z"/><path class="sprite-weapon" d="M42 124 116 50"/><path class="sprite-metal" d="M96 43h24v24"/></svg>`;
  }
  return `<svg viewBox="0 0 160 160"><circle class="sprite-shadow" cx="80" cy="139" r="36"/><path class="sprite-cloak" d="M45 136c5-47 18-72 35-72s30 25 35 72H45Z"/><path class="sprite-armor" d="M52 82c4-30 52-30 56 0l-13 34H65L52 82Z"/><path class="sprite-helm" d="M54 72 80 35l26 37-12 18H66L54 72Z"/><path class="sprite-metal" d="M80 43v61M64 71h32"/><path class="sprite-weapon" d="M38 127 116 49"/></svg>`;
}

function renderUnitCard(entity, options = {}) {
  const hpPercent = Math.max(0, Math.round((entity.hp / entity.maxHp) * 100));
  const isDead = entity.hp <= 0;
  const isSelected = options.selected ? "is-selected" : "";
  const isTarget = state.combat?.floating?.targetId === entity.id ? "is-hit" : "";
  const floating = state.combat?.floating?.targetId === entity.id
    ? `<span class="combat-float">${state.combat.floating.text}</span>`
    : "";
  return `
    <article class="combat-unit ${options.kind || ""} ${isSelected} ${isDead ? "is-dead" : ""} ${isTarget}" data-combat-id="${entity.id}">
      <div class="combat-sprite">${options.sprite}</div>
      ${floating}
      <div class="combat-plate">
        <strong>${entity.name}</strong>
        <span>HP ${entity.hp}/${entity.maxHp} - AC ${entity.ac}</span>
        <div class="meter"><span style="width:${hpPercent}%"></span></div>
      </div>
    </article>
  `;
}

function renderCombat(node) {
  const combat = state.combat;
  const profile = HERO_COMBAT[state.heroClass];
  const effective = getEffectiveStats();
  const selected = getSelectedEnemy();
  if (selected) combat.selectedEnemyId = selected.id;

  document.querySelector("#encounter-kicker").textContent = NODE_TYPES[node.type].kicker;
  document.querySelector("#encounter-title").textContent = ENCOUNTER_COPY[node.type].title;
  document.querySelector("#encounter-art").innerHTML = `
    <div class="first-person-combat ${combat.floating?.targetId === selected?.id ? "is-striking" : ""}">
      <div class="combat-die ${combat.lastRoll ? "is-rolling" : ""}">
        <span>${combat.lastRoll?.die || "d20"}</span>
        <strong>${combat.lastRoll?.value || "?"}</strong>
      </div>
      <div class="combat-skyline" aria-hidden="true"></div>
      ${selected ? `
        <article class="first-person-enemy ${combat.floating?.targetId === selected.id ? "is-hit" : ""}" data-combat-id="${selected.id}">
          ${combat.floating?.targetId === selected.id ? `<span class="combat-float">${combat.floating.text}</span>` : ""}
          <div class="first-person-enemy__sprite">${getEnemySprite(selected)}</div>
          <div class="first-person-enemy__name">
            <strong>${selected.name}</strong>
            <span>AC ${selected.ac} · HP ${selected.hp}/${selected.maxHp}</span>
          </div>
        </article>
      ` : ""}
      <div class="target-strip">
        ${combat.enemies
          .map((enemy) => {
            const hpPercent = Math.max(0, Math.round((enemy.hp / enemy.maxHp) * 100));
            return `
              <button class="target-chip ${enemy.id === combat.selectedEnemyId ? "is-selected" : ""}" type="button" data-combat-id="${enemy.id}" ${enemy.hp <= 0 ? "disabled" : ""}>
                <span>${enemy.name}</span>
                <i><b style="width:${hpPercent}%"></b></i>
              </button>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
  document.querySelector("#encounter-rewards").innerHTML = `
    <div class="combat-shell combat-shell--first-person">
      <div class="combat-status">
        <span class="reward-chip">Раунд ${combat.round}</span>
        <span class="reward-chip">Ход: ${combat.turn === "player" ? "герой" : "враги"}</span>
        <span class="reward-chip">Инициатива: ${combat.initiative?.hero ?? "?"} / ${combat.initiative?.enemies ?? "?"}</span>
      </div>
      <div class="combat-info-grid">
        <article class="combat-info-card">
          <span>Ваш класс</span>
          <strong>${state.hero.name}</strong>
          <p>HP ${state.hero.hp}/${state.hero.maxHp} · AC ${state.hero.ac} · Зелья ${state.hero.potions} · Удача ${effective.luck}</p>
        </article>
        <article class="combat-info-card combat-info-card--enemy">
          <span>Цель</span>
          <strong>${selected?.name || "Нет цели"}</strong>
          <p>${selected ? `HP ${selected.hp}/${selected.maxHp} · AC ${selected.ac} · Урон до d${selected.damageDie}` : "Все враги повержены"}</p>
        </article>
        <article class="combat-info-card">
          <span>Навык</span>
          <strong>${profile.skillName}</strong>
          <p>${profile.skillText} ${getSubclassTrait().note || ""}</p>
        </article>
      </div>
      <div class="combat-log">
        ${combat.log.slice(-5).map((entry) => `<p>${entry}</p>`).join("")}
      </div>
    </div>
  `;

  renderCombatActions();
  setDmText(combat.log[combat.log.length - 1] || COMBAT_ENCOUNTERS[node.type].intro);
}

function renderCombatActions() {
  const actions = document.querySelector("#encounter-actions");
  const combat = state.combat;
  const profile = HERO_COMBAT[state.heroClass];
  if (combat.victory) {
    actions.innerHTML = `<button class="button button--primary" type="button" data-action="claim-combat-reward">Забрать награду</button>`;
    return;
  }
  if (combat.turn !== "player") {
    actions.innerHTML = `<span class="reward-chip">Враги совершают ход...</span>`;
    return;
  }

  const canFlee = combat.type === "battle";
  actions.innerHTML = `
    <button class="button button--primary" type="button" data-action="combat-attack">Атака</button>
    <button class="button" type="button" data-action="combat-skill">${profile.skillName}</button>
    <button class="button" type="button" data-action="combat-potion">Зелье (${state.hero.potions})</button>
    ${canFlee ? '<button class="button button--danger" type="button" data-action="combat-flee">Сбежать (-3 HP)</button>' : '<span class="reward-chip reward-chip--locked">Побег невозможен</span>'}
  `;
}

function chooseTarget(enemyId) {
  const enemy = state.combat?.enemies.find((candidate) => candidate.id === enemyId && candidate.hp > 0);
  if (!enemy) return;
  state.combat.selectedEnemyId = enemyId;
  renderCombat(getNode(state.activeNodeId));
  saveState();
}

function pushCombatLog(text) {
  state.combat.log.push(text);
  if (state.combat.log.length > 20) state.combat.log.shift();
}

function setCombatFloating(targetId, text) {
  state.combat.floating = { targetId, text };
}

function checkCombatVictory() {
  if (getLivingEnemies().length > 0) return false;
  state.combat.victory = true;
  state.combat.turn = "player";
  pushCombatLog("Враги повержены. DM отмечает победу и готовит награду.");
  renderCombat(getNode(state.activeNodeId));
  saveState();
  return true;
}

function playerAttack({ skill = false } = {}) {
  if (!state.combat || state.combat.turn !== "player" || state.combat.victory) return;
  const target = getSelectedEnemy();
  if (!target) return;
  const effective = getEffectiveStats();
  const rollResult = skill && state.heroClass === "rogue"
    ? (() => {
        const first = rollHeroD20();
        const second = rollDie(20);
        return { value: Math.max(first.value, second), rolls: [...first.rolls, second], lucky: true };
      })()
    : rollHeroD20();
  const roll = rollResult.rolls[0];
  const attackRoll = rollResult.value;
  const total = attackRoll + effective.attackBonus;
  const hit = attackRoll === 20 || total >= target.ac;
  state.combat.lastRoll = { die: rollResult.rolls.length > 1 ? "2d20" : "d20", value: attackRoll };

  if (!hit) {
    setCombatFloating(target.id, "MISS");
    pushCombatLog(`Бросок атаки против AC ${target.ac}: d20 ${rollResult.rolls.join(", ")} + ${effective.attackBonus} = ${total}. ${target.name} уклоняется.`);
    renderCombat(getNode(state.activeNodeId));
    queueEnemyTurn();
    return;
  }

  const crit = attackRoll >= effective.critFloor;
  let damage;
  let label = "атака";

  if (skill && state.heroClass === "fighter") {
    damage = rollDamage(12, 5 + effective.damageBonus, crit ? 2 : 1);
    state.combat.guard = 3;
    label = "Клятвенный рассекатель";
  } else if (skill && state.heroClass === "rogue") {
    damage = rollDamage(8, 4 + effective.damageBonus, crit ? 4 : 2);
    if (target.hp <= Math.ceil(target.maxHp / 2)) damage.total += 5 + (effective.execute || 0);
    label = "Удар из тени";
  } else {
    damage = rollDamage(effective.damageDie, effective.damageBonus, crit ? 2 : 1);
  }

  target.hp = Math.max(0, target.hp - damage.total);
  setCombatFloating(target.id, `-${damage.total}`);
  pushCombatLog(`${label}: d20 ${rollResult.rolls.join(", ")} + ${effective.attackBonus} против AC ${target.ac}. Попадание. Урон ${damage.rolls.join("+")} + бонус = ${damage.total}${crit ? " (крит)" : ""}.`);
  if (target.hp <= 0) {
    pushCombatLog(`${target.name} падает в пепел.`);
    if (effective.leech) {
      state.hero.hp = Math.min(state.hero.maxHp, state.hero.hp + effective.leech);
      pushCombatLog(`Некротическая жилка возвращает ${effective.leech} HP.`);
    }
  }

  renderCombat(getNode(state.activeNodeId));
  if (!checkCombatVictory()) queueEnemyTurn();
}

function playerSkill() {
  if (!state.combat || state.combat.turn !== "player" || state.combat.victory) return;
  const effective = getEffectiveStats();

  if (state.heroClass !== "mage") {
    playerAttack({ skill: true });
    return;
  }

  const rolls = [];
  let anyHit = false;
  getLivingEnemies().forEach((enemy) => {
    const rollResult = rollHeroD20();
    const roll = rollResult.value;
    const total = roll + effective.attackBonus;
    rolls.push(roll);
    if (roll === 20 || total >= enemy.ac) {
      const damage = rollDamage(10, 4 + effective.damageBonus + (effective.spellSplash || 0), roll === 20 ? 2 : 1);
      const finalDamage = damage.total;
      enemy.hp = Math.max(0, enemy.hp - finalDamage);
      anyHit = true;
      setCombatFloating(enemy.id, `-${finalDamage}`);
      pushCombatLog(`Звездный разлом попадает в ${enemy.name}: ${finalDamage} урона.`);
    } else {
      const damage = Math.ceil((rollDie(10) + 4 + effective.damageBonus) / 2);
      enemy.hp = Math.max(0, enemy.hp - damage);
      setCombatFloating(enemy.id, `-${damage}`);
      pushCombatLog(`Звездный разлом цепляет ${enemy.name} краем вспышки: ${damage} урона.`);
    }
  });
  state.combat.lastRoll = { die: "d20", value: Math.max(...rolls) };
  if (!anyHit) pushCombatLog(`Даже промахи оставляют ожоги: броски ${rolls.join(", ")} дают половину урона.`);
  renderCombat(getNode(state.activeNodeId));
  if (!checkCombatVictory()) queueEnemyTurn();
}

function usePotion() {
  if (!state.combat || state.combat.turn !== "player" || state.combat.victory) return;
  if (state.hero.potions <= 0) {
    pushCombatLog("Зелий больше нет.");
    renderCombat(getNode(state.activeNodeId));
    return;
  }
  const heal = rollDamage(8, 4, 2);
  state.hero.potions -= 1;
  state.hero.hp = Math.min(state.hero.maxHp, state.hero.hp + heal.total);
  setCombatFloating("hero", `+${heal.total}`);
  pushCombatLog(`Зелье лечения восстанавливает ${heal.rolls.join("+")} + 4 = ${heal.total} HP.`);
  renderHud();
  renderCombat(getNode(state.activeNodeId));
  queueEnemyTurn();
}

function fleeCombat() {
  if (!state.combat || state.combat.victory) return;
  if (state.combat.type !== "battle") {
    pushCombatLog("Из этого боя нельзя сбежать: клятва элиты и взгляд Астерона держат вас на месте.");
    renderCombat(getNode(state.activeNodeId));
    return;
  }
  const node = getNode(state.activeNodeId);
  if (!node) return;

  state.hero.hp = Math.max(0, state.hero.hp - 3);
  state.combat.claimed = true;
  pushCombatLog("Вы бросаете дымовую склянку и отступаете. -3 HP, награды нет.");
  renderHud();

  if (state.hero.hp <= 0) {
    saveState();
    switchScreen(GAME_STATES.GAME_OVER);
    return;
  }

  advanceAfterNode(node);
  state.combat = null;
  renderAll();
  saveState();
  switchScreen(GAME_STATES.WORLD_MAP);
  setDmText("Побег сохраняет жизнь, но дорога запоминает нерешенные угрозы. Награды за бой нет.");
}

function queueEnemyTurn() {
  if (!state.combat || state.combat.victory) return;
  state.combat.turn = "enemy";
  saveState();
  renderCombat(getNode(state.activeNodeId));
  window.setTimeout(enemyTurn, 640);
}

function enemyTurn() {
  if (!state.combat || state.combat.victory) return;
  const effective = getEffectiveStats();

  getLivingEnemies().forEach((enemy) => {
    const roll = rollDie(20);
    const total = roll + enemy.attackBonus;
    if (roll === 20 || total >= state.hero.ac) {
      if (effective.dodgeDie && rollDie(effective.dodgeDie) >= effective.dodgeTarget) {
        pushCombatLog(`${state.hero.name} исчезает в рывке: проверка уклонения d${effective.dodgeDie} успешна.`);
        return;
      }
      const damage = rollDamage(enemy.damageDie, enemy.damageBonus, roll === 20 ? 2 : 1);
      let finalDamage = damage.total;
      if (state.heroClass === "fighter" && !state.combat.relicShieldUsed) {
        finalDamage = Math.max(0, finalDamage - 2);
        state.combat.relicShieldUsed = true;
      }
      if (effective.magicGuard && !state.combat.magicGuardUsed) {
        finalDamage = Math.max(0, finalDamage - effective.magicGuard);
        state.combat.magicGuardUsed = true;
      }
      if (state.combat.guard) {
        finalDamage = Math.max(0, finalDamage - state.combat.guard);
        state.combat.guard = 0;
      }
      state.hero.hp = Math.max(0, state.hero.hp - finalDamage);
      setCombatFloating("hero", `-${finalDamage}`);
      pushCombatLog(`${enemy.name} атакует против AC ${state.hero.ac}: d20 ${roll} + ${enemy.attackBonus} = ${total}. Урон ${finalDamage}.`);
      if (effective.riposte && finalDamage <= 2) {
        enemy.hp = Math.max(0, enemy.hp - effective.riposte);
        pushCombatLog(`Парирование возвращает ${effective.riposte} урона.`);
      }
    } else {
      pushCombatLog(`${enemy.name} атакует против AC ${state.hero.ac}: d20 ${roll} + ${enemy.attackBonus} = ${total}. Промах.`);
    }
  });

  if (state.combat.type === "boss") {
    const boss = state.combat.enemies[0];
    if (boss && boss.phase === 1 && boss.hp > 0 && boss.hp <= Math.floor(boss.maxHp / 2)) {
      boss.phase = 2;
      boss.attackBonus += 2;
      boss.damageBonus += 3;
      pushCombatLog("Фаза II: Астерон раскрывает пепельное сердце. Теперь каждый удар несет черный огонь.");
    }
  }

  if (getLivingEnemies().length === 0) {
    checkCombatVictory();
    return;
  }

  renderHud();
  if (state.hero.hp <= 0) {
    saveState();
    switchScreen(GAME_STATES.GAME_OVER);
    return;
  }

  state.combat.turn = "player";
  state.combat.round += 1;
  renderCombat(getNode(state.activeNodeId));
  saveState();
}

function claimCombatReward() {
  const node = getNode(state.activeNodeId);
  if (!node || !state.combat?.victory || state.combat.claimed) return;
  const encounter = COMBAT_ENCOUNTERS[node.type];
  state.combat.claimed = true;
  state.hero.gold += encounter.rewardGold || 0;
  const xp = addXp(node.type);
  const item = maybeGrantItem(node.type);
  if (encounter.rewardRelic && !state.hero.relics.includes(encounter.rewardRelic)) {
    state.hero.relics.push(encounter.rewardRelic);
  }
  if (xp.amount) {
    pushCombatLog(`Получено ${xp.amount} XP${xp.leveled ? `. Новый уровень: ${state.level}, +${xp.leveled * 2} очка характеристик.` : "."}`);
  }
  if (item) {
    pushCombatLog(`Найден предмет: ${item.name}. ${item.text}`);
  }
  if (node.type === "boss") {
    state.completedNodeIds.push(node.id);
    state.activeNodeId = null;
    state.combat = null;
    renderHud();
    saveState();
    switchScreen(GAME_STATES.VICTORY);
    return;
  }
  advanceAfterNode(node);
  state.combat = null;
  renderAll();
  saveState();
  switchScreen(GAME_STATES.WORLD_MAP);
}

function openNode(nodeId) {
  const node = getNode(nodeId);
  if (!node || !state.availableNodeIds.includes(nodeId)) return;
  state.activeNodeId = nodeId;
  saveState();
  renderEncounter(node);
  switchScreen(GAME_STATES.ENCOUNTER);
  if (state.combat?.nodeId === node.id && state.combat.turn === "enemy" && !state.combat.victory) {
    window.setTimeout(enemyTurn, 780);
  }
}

function advanceAfterNode(node) {
  if (!state.completedNodeIds.includes(node.id)) {
    state.completedNodeIds.push(node.id);
  }
  state.availableNodeIds = node.nextIds;
  state.currentRow = Math.min(MAP_ROWS - 1, node.row + 1);
  state.activeNodeId = null;
}

function completeActiveNode() {
  const node = getNode(state.activeNodeId);
  if (!node || state.completedNodeIds.includes(node.id)) return;
  if (isCombatNode(node.type)) return;

  advanceAfterNode(node);

  if (state.hero.hp <= 0) {
    switchScreen(GAME_STATES.GAME_OVER);
  } else {
    renderAll();
    switchScreen(GAME_STATES.WORLD_MAP);
  }
  saveState();
}

function handleEventRoll() {
  const node = getNode(state.activeNodeId);
  const used = getNodeActions();
  if (used.eventRoll) return;

  const rollResult = rollHeroD20();
  const roll = rollResult.value;
  const hero = HEROES[state.heroClass];
  used.eventRoll = true;
  const xp = addXp("event");

  if (roll >= 13) {
    const reward = state.heroClass === "rogue" ? 24 : 12;
    state.hero.gold += reward;
    setDmText(`d20 = ${roll}${rollResult.lucky ? " (удача)" : ""}. Камни раскрывают тайник. Вы получаете ${reward} gp, ${xp.amount} XP и избегаете проклятия.`);
  } else {
    state.hero.hp = Math.max(1, state.hero.hp - 2);
    setDmText(`d20 = ${roll}${rollResult.lucky ? " (удача)" : ""}. ${hero.relic} дрожит, но курган забирает кровь: -2 HP. Вы все равно получаете ${xp.amount} XP.`);
  }

  renderHud();
  renderSidebar();
  if (node) renderEncounterActions(node);
  saveState();
}

function handleCampHeal() {
  const node = getNode(state.activeNodeId);
  const used = getNodeActions();
  if (used.campHeal) return;

  used.campHeal = true;
  state.hero.hp = Math.min(state.hero.maxHp, state.hero.hp + 14);
  setDmText("Огонь вспыхивает синим. Отряд восстанавливает 14 HP и слышит вдали крылья Астерона.");
  renderHud();
  renderSidebar();
  if (node) renderEncounterActions(node);
  saveState();
}

function handleTavernRumor() {
  const node = getNode(state.activeNodeId);
  const used = getNodeActions();
  if (!node || used.tavernRumor) return;

  const npc = TAVERN_NPCS[getStableIndex(node.id, TAVERN_NPCS.length, 17)];
  used.tavernRumor = true;
  state.loreJournal = state.loreJournal || [];
  state.loreJournal.push(`Таверна: ${npc.rumor}`);
  setDmText(`${npc.name} понижает голос. ${npc.rumor}`);
  renderSidebar();
  renderEncounterActions(node);
  saveState();
}

function handleTavernTalk() {
  const node = getNode(state.activeNodeId);
  const used = getNodeActions();
  if (!node || used.tavernTalk) return;

  const npc = TAVERN_NPCS[getStableIndex(node.id, TAVERN_NPCS.length, 17)];
  const rollResult = rollHeroD20();
  const effective = getEffectiveStats();
  const roll = rollResult.value + Math.floor(effective.charisma / 2);
  used.tavernTalk = true;
  const xp = addXp("tavern");

  if (roll >= 12) {
    if (npc.name.includes("Ровена")) {
      state.hero.hp = Math.min(state.hero.maxHp, state.hero.hp + 2);
      state.hero.gold += 8;
    } else if (npc.name.includes("Ним")) {
      state.threat = Math.max(1, state.threat - 1);
    } else if (npc.name.includes("Лиран")) {
      const lore = LORE_ENTRIES[getStableIndex(node.id, LORE_ENTRIES.length, 51)];
      state.loreJournal = state.loreJournal || [];
      state.loreJournal.push(`${lore.title}: ${lore.text}`);
    } else {
      state.hero.gold += 14;
    }
    setDmText(`${npc.check}: d20 = ${rollResult.value}${rollResult.lucky ? " (удача)" : ""} + харизма ${Math.floor(effective.charisma / 2)} = ${roll}. Успех. ${npc.success} +${xp.amount} XP.`);
  } else {
    if (npc.name.includes("Ровена")) state.hero.gold = Math.max(0, state.hero.gold - 4);
    if (npc.name.includes("Ива")) state.hero.hp = Math.max(1, state.hero.hp - 1);
    setDmText(`${npc.check}: d20 = ${rollResult.value}${rollResult.lucky ? " (удача)" : ""} + харизма ${Math.floor(effective.charisma / 2)} = ${roll}. Провал. ${npc.fail} +${xp.amount} XP.`);
  }

  renderHud();
  renderSidebar();
  renderEncounterActions(node);
  saveState();
}

function handleLoreStudy() {
  const node = getNode(state.activeNodeId);
  const used = getNodeActions();
  if (!node || used.loreStudy) return;

  const lore = LORE_ENTRIES[getStableIndex(node.id, LORE_ENTRIES.length, 31)];
  const rollResult = rollHeroD20();
  const roll = rollResult.value;
  used.loreStudy = true;
  const xp = addXp("lore");
  state.loreJournal = state.loreJournal || [];
  state.loreJournal.push(`${lore.title}: ${lore.text}`);
  if (roll >= 14) {
    state.threat = Math.max(1, state.threat - 1);
    setDmText(`История: d20 = ${roll}${rollResult.lucky ? " (удача)" : ""}. ${lore.text} Вы понимаете, как обойти один знак Астерона. Угроза -1. +${xp.amount} XP.`);
  } else {
    setDmText(`История: d20 = ${roll}${rollResult.lucky ? " (удача)" : ""}. ${lore.text} Смысл ясен не полностью, но запись остается в журнале. +${xp.amount} XP.`);
  }

  renderHud();
  renderSidebar();
  renderEncounterActions(node);
  saveState();
}

function handleBuyPotion() {
  const node = getNode(state.activeNodeId);
  const used = getNodeActions();
  if (used.buyPotion) return;

  if (state.hero.gold < 18) {
    setDmText("Миртл качает головой: без золота даже слухи становятся молчаливыми.");
    return;
  }
  used.buyPotion = true;
  state.hero.gold -= 18;
  state.hero.potions += 1;
  setDmText(`Вы покупаете зелье. Теперь зелий: ${state.hero.potions}. Миртл шепчет: "На вершине бейте не сердце, а тень под ним."`);
  renderHud();
  renderSidebar();
  if (node) renderEncounterActions(node);
  saveState();
}

function renderAll() {
  renderHeroSelection();
  renderStatAllocation();
  renderHud();
  renderMap();
  renderSidebar();
}

function bindUi() {
  document.querySelectorAll('[data-action="new-game"]').forEach((button) => {
    button.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      stopIntroAudio();
      state.heroClass = "fighter";
      state.subclass = HEROES.fighter.defaultSubclass;
      resetBuildPoints();
      resetRun(false);
      switchScreen(GAME_STATES.CHARACTER_SELECT);
      setDmText(CAMPAIGN_LORE.opening);
    });
  });

  document.querySelector('[data-action="continue-game"]')?.addEventListener("click", () => {
    if (!state.hero) createHero();
    if (!state.map.length) resetRun(true);
    renderAll();
    const resumeScreen = bootResumeScreen && bootResumeScreen !== GAME_STATES.MAIN_MENU
      ? bootResumeScreen
      : GAME_STATES.WORLD_MAP;
    if (resumeScreen === GAME_STATES.ENCOUNTER && state.activeNodeId) {
      renderEncounter(getNode(state.activeNodeId));
    }
    switchScreen(resumeScreen);
  });

  document.querySelector('[data-action="credits"]')?.addEventListener("click", () => {
    document.querySelector("#encounter-kicker").textContent = "Титры";
    document.querySelector("#encounter-title").textContent = "Veil of Ash";
    document.querySelector("#encounter-rewards").innerHTML = `
      <span class="reward-chip">Frontend: HTML/CSS/Vanilla JS</span>
      <span class="reward-chip">Ассеты: inline SVG</span>
      <span class="reward-chip">Вдохновение: настольные кампании D&D</span>
    `;
    renderEncounterArt("event");
    document.querySelector("#encounter-actions").innerHTML = `<button class="button button--primary" type="button" data-action="main-menu-return">Назад в меню</button>`;
    setDmText("Создано как статическая GitHub Pages игра без бэкенда и внешних картинок.");
    switchScreen(GAME_STATES.ENCOUNTER);
  });

  document.querySelector(".class-grid")?.addEventListener("click", (event) => {
    const card = event.target.closest(".class-card");
    if (!card) return;
    state.heroClass = card.dataset.class;
    state.subclass = HEROES[state.heroClass].defaultSubclass;
    resetBuildPoints();
    createHero({ fullHeal: true });
    renderAll();
    saveState();
  });

  document.querySelector("#subclass-grid")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-subclass]");
    if (!button) return;
    state.subclass = button.dataset.subclass;
    createHero({ fullHeal: true });
    renderAll();
    saveState();
  });

  document.querySelector('[data-action="confirm-hero"]')?.addEventListener("click", () => {
    createHero({ fullHeal: true });
    renderAll();
    switchScreen(GAME_STATES.STAT_ALLOC);
    setDmText(`${HEROES[state.heroClass].epithet} делает последний вдох перед дорогой. Распределите 10 очков навыка.`);
  });

  document.querySelector("#screen-stat-alloc")?.addEventListener("click", (event) => {
    const statButton = event.target.closest("[data-stat-action]");
    if (statButton) {
      const key = statButton.dataset.attribute;
      const action = statButton.dataset.statAction;
      if (action === "inc" && state.unspentPoints > 0) {
        state.attributes[key] += 1;
        state.unspentPoints -= 1;
      }
      if (action === "dec" && state.attributes[key] > 0) {
        state.attributes[key] -= 1;
        state.unspentPoints += 1;
      }
      syncHeroStats(true);
      renderAll();
      saveState();
      return;
    }

    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "start-adventure") {
      const firstStart = !state.adventureStarted;
      if (firstStart) {
        createHero({ fullHeal: true });
        resetRun(true);
        state.adventureStarted = true;
      } else {
        syncHeroStats(true);
      }
      renderAll();
      switchScreen(GAME_STATES.WORLD_MAP);
      setDmText(state.currentRow === 0
        ? `${CAMPAIGN_LORE.opening} ${HEROES[state.heroClass].epithet} выходит на нижнюю тропу.`
        : "Герой затягивает ремни, перекладывает добычу и возвращается к карте.");
    }
    if (action === "back-to-hero") {
      switchScreen(state.adventureStarted ? GAME_STATES.WORLD_MAP : GAME_STATES.CHARACTER_SELECT);
    }
  });

  document.querySelector("#map-nodes")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-node-id]");
    if (button) openNode(button.dataset.nodeId);
  });

  document.querySelector('[data-action="back-to-map"]')?.addEventListener("click", () => {
    renderAll();
    switchScreen(GAME_STATES.WORLD_MAP);
  });

  document.querySelector("#screen-encounter")?.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    const targetCard = event.target.closest("[data-combat-id]");
    if (targetCard && targetCard.dataset.combatId !== "hero") {
      chooseTarget(targetCard.dataset.combatId);
    }
    if (action === "complete-node") completeActiveNode();
    if (action === "event-roll") handleEventRoll();
    if (action === "tavern-rumor") handleTavernRumor();
    if (action === "tavern-talk") handleTavernTalk();
    if (action === "lore-study") handleLoreStudy();
    if (action === "camp-heal") handleCampHeal();
    if (action === "buy-potion") handleBuyPotion();
    if (action === "main-menu-return") switchScreen(GAME_STATES.MAIN_MENU);
    if (action === "combat-attack") playerAttack();
    if (action === "combat-skill") playerSkill();
    if (action === "combat-potion") usePotion();
    if (action === "combat-flee") fleeCombat();
    if (action === "combat-end-turn") queueEnemyTurn();
    if (action === "claim-combat-reward") claimCombatReward();
  });

  document.querySelector("#screen-world-map")?.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "open-levelup") {
      renderStatAllocation();
      switchScreen(GAME_STATES.STAT_ALLOC);
    }
  });
}

function boot() {
  const loaded = loadState();
  bootResumeScreen = state.screen || GAME_STATES.MAIN_MENU;
  ensureProgressionState();
  if (!loaded || !state.map.length || state.map.length !== MAP_ROWS) {
    state.map = generateMap(state.seed);
    state.availableNodeIds = state.map[0].map((node) => node.id);
    state.completedNodeIds = [];
    state.currentRow = 0;
  }
  if (state.hero) {
    state.heroClass = state.hero.classId || state.heroClass;
    const base = HEROES[state.heroClass];
    if (base && (!state.hero.maxHp || state.hero.maxHp < base.maxHp)) {
      const hpRatio = state.hero.maxHp ? state.hero.hp / state.hero.maxHp : 1;
      state.hero.maxHp = base.maxHp;
      state.hero.hp = Math.max(1, Math.min(base.maxHp, Math.round(base.maxHp * hpRatio)));
      state.hero.ac = base.ac;
    }
    if (typeof state.hero.potions !== "number") state.hero.potions = 2;
    if (!Array.isArray(state.hero.relics)) state.hero.relics = [HEROES[state.heroClass].relic];
  }
  if (!state.nodeActionUses) state.nodeActionUses = {};
  if (!Array.isArray(state.loreJournal)) state.loreJournal = [];
  if (!Array.isArray(state.inventory)) state.inventory = [];
  if (state.combat?.turn === "enemy") state.combat.turn = "player";
  bindUi();
  renderAll();
  if (bootResumeScreen === GAME_STATES.ENCOUNTER && state.activeNodeId) {
    renderEncounter(getNode(state.activeNodeId));
  }
  switchScreen(GAME_STATES.MAIN_MENU);
  startIntro();
}

boot();
