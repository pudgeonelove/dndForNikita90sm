const GAME_STATES = {
  MAIN_MENU: "MAIN_MENU",
  CHARACTER_SELECT: "CHARACTER_SELECT",
  WORLD_MAP: "WORLD_MAP",
  ENCOUNTER: "ENCOUNTER",
  GAME_OVER: "GAME_OVER",
  VICTORY: "VICTORY",
};

const STORAGE_KEY = "veil-of-ash-campaign-state-v2";
const MAP_ROWS = 11;

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
    hp: 14,
    maxHp: 14,
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
    hp: 9,
    maxHp: 9,
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
    hp: 11,
    maxHp: 11,
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
    rewards: ["Лечение 6 HP", "Безопасный узел"],
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
    text: "Сердце Горы раскрывается как черный глаз. Пока боевой модуль не подключен, победа засчитывается после финального решения.",
    rewards: ["Финал кампании", "Победа"],
  },
};

const COMBAT_ENCOUNTERS = {
  battle: {
    intro: "Гоблин хрипло смеется, а рядом волк скребет когтями по пеплу. Бросаем инициативу.",
    rewardGold: 18,
    enemies: [
      { id: "goblin", name: "Гоблин-разведчик", hp: 7, maxHp: 7, ac: 13, attackBonus: 3, damageDie: 6, damageBonus: 1, sprite: "goblin", initiativeBonus: 2 },
      { id: "wolf", name: "Пепельный волк", hp: 9, maxHp: 9, ac: 12, attackBonus: 4, damageDie: 6, damageBonus: 1, sprite: "wolf", initiativeBonus: 2 },
    ],
  },
  elite: {
    intro: "Рыцарь Пустой Клятвы поднимает ржавый клинок. Его броня помнит молитвы, но сердце уже нет.",
    rewardGold: 28,
    rewardRelic: "Кость Пустой Клятвы",
    enemies: [
      { id: "oath-knight", name: "Рыцарь Пустой Клятвы", hp: 24, maxHp: 24, ac: 15, attackBonus: 5, damageDie: 8, damageBonus: 3, sprite: "knight", initiativeBonus: 1 },
    ],
  },
  boss: {
    intro: "Астерон раскрывает крылья в Сердце Горы. Вторая фаза начнется, когда пепельное сердце треснет.",
    rewardGold: 80,
    enemies: [
      { id: "asteron", name: "Астерон, Дракон-Лич", hp: 42, maxHp: 42, ac: 16, attackBonus: 6, damageDie: 10, damageBonus: 4, sprite: "dragon", phase: 1, initiativeBonus: 0 },
    ],
  },
};

const HERO_COMBAT = {
  fighter: {
    attackBonus: 5,
    damageDie: 8,
    damageBonus: 3,
    skillName: "Мощный удар",
    skillText: "1d10 + 4 по выбранной цели.",
  },
  mage: {
    attackBonus: 5,
    damageDie: 10,
    damageBonus: 2,
    skillName: "Огненная вспышка",
    skillText: "1d8 + 3 по каждому врагу.",
  },
  rogue: {
    attackBonus: 6,
    damageDie: 6,
    damageBonus: 3,
    skillName: "Скрытая атака",
    skillText: "Преимущество на d20, 2d6 + 3 урона.",
  },
};

const state = {
  screen: GAME_STATES.MAIN_MENU,
  heroClass: "fighter",
  subclass: "champion",
  hero: null,
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

function createHero() {
  const base = HEROES[state.heroClass];
  state.subclass = state.subclass || base.defaultSubclass;
  state.hero = {
    classId: state.heroClass,
    title: base.title,
    name: `${base.title} - ${getSubclassName(state.subclass)}`,
    hp: base.hp,
    maxHp: base.maxHp,
    ac: base.ac,
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

  document.querySelectorAll("[data-nav-screen]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.navScreen === screenId);
  });

  const currentScreen = document.querySelector(".screen.is-active:not(.hidden)");
  if (currentScreen && currentScreen !== nextScreen) {
    currentScreen.classList.add("is-exiting");
    window.setTimeout(() => {
      currentScreen.classList.add("hidden");
      currentScreen.classList.remove("is-active", "is-exiting");
    }, 170);
  }

  nextScreen.classList.remove("hidden", "is-exiting");
  void nextScreen.offsetWidth;
  nextScreen.classList.add("is-active");
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

  for (let row = 0; row < MAP_ROWS; row += 1) {
    const isBoss = row === MAP_ROWS - 1;
    const count = isBoss ? 1 : 2 + Math.floor(rng() * 3);
    const y = 1040 - row * (960 / (MAP_ROWS - 1));
    const nodes = [];

    for (let col = 0; col < count; col += 1) {
      const spread = 760 / Math.max(count - 1, 1);
      const jitter = isBoss ? 0 : (rng() - 0.5) * 58;
      const x = isBoss ? 500 : 120 + col * spread + jitter;
      let type = "battle";

      if (isBoss) type = "boss";
      else if (row === 0) type = pick(["event", "tavern", "battle", "lore"], rng);
      else if (row === MAP_ROWS - 2) type = pick(["camp", "tavern", "shop", "lore", "elite"], rng);
      else type = pick(["event", "event", "tavern", "tavern", "lore", "camp", "shop", "battle", "elite"], rng);

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
  if (!keepHero || !state.hero) createHero();
  saveState();
  renderAll();
}

function renderHeroSelection() {
  const hero = HEROES[state.heroClass];
  document.querySelector("#hero-class-title").textContent = hero.epithet;
  document.querySelector("#hero-class-copy").textContent = `${hero.backstory} Стартовая реликвия: ${hero.relic} — ${hero.relicText}`;
  document.querySelector("#stat-hp").textContent = hero.hp;
  document.querySelector("#stat-ac").textContent = hero.ac;
  document.querySelector("#stat-gold").textContent = hero.gold;
  document.querySelector("#stat-relic").textContent = hero.relic;
  document.querySelector("#selected-subclass").textContent = getSubclassName();

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

function renderHud() {
  if (!state.hero) return;
  const hpPercent = Math.max(0, Math.round((state.hero.hp / state.hero.maxHp) * 100));
  document.querySelector("#hero-name").textContent = state.hero.name;
  document.querySelector("#hero-hp-text").textContent = `${state.hero.hp} / ${state.hero.maxHp}`;
  document.querySelector("#hero-hp-meter").style.width = `${hpPercent}%`;
  document.querySelector("#hero-gold").textContent = `${state.hero.gold} gp`;
  document.querySelector("#hero-relics").textContent = `Реликвии: ${state.hero.relics.join(", ")}`;
  document.querySelector("#hud-floor").textContent = `Путь ${Math.min(state.currentRow, MAP_ROWS - 1)}/${MAP_ROWS - 1}`;
  document.querySelector("#hud-threat").textContent = `Угроза ${state.threat}`;
}

function renderMap() {
  const lines = document.querySelector("#map-lines");
  const nodesLayer = document.querySelector("#map-nodes");
  lines.innerHTML = "";
  nodesLayer.innerHTML = "";

  nodesLayer.insertAdjacentHTML(
    "beforeend",
    `
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
    button.style.top = `${node.y / 11.2}%`;
    button.dataset.nodeId = node.id;
    button.disabled = !isAvailable || isCompleted;
    button.innerHTML = `<span class="map-node__icon">${meta.icon}</span><span class="map-node__label">${meta.label}</span>`;
    nodesLayer.appendChild(button);
  });
}

function renderEncounterArt(type) {
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
  const heroInitiative = rollDie(20) + 2;
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
  const stroke = enemy.hp <= 0 ? "#5f6876" : "#f3cf7e";
  if (enemy.sprite === "wolf") {
    return `<svg viewBox="0 0 160 160"><circle class="sprite-shadow" cx="80" cy="139" r="35"/><path class="sprite-fur" d="M35 117c12-29 33-45 63-35l22-19-2 31c8 7 11 16 11 26H35Z"/><path class="sprite-fur-dark" d="M67 82 54 56l30 18 30-18-13 29"/><path class="sprite-eye" d="M93 93h9"/><path class="sprite-metal" d="M112 105h14"/></svg>`;
  }
  if (enemy.sprite === "knight") {
    return `<svg viewBox="0 0 160 160"><circle class="sprite-shadow" cx="80" cy="139" r="36"/><path class="sprite-cloak" d="M45 136c5-49 18-73 35-73s30 24 35 73H45Z"/><path class="sprite-armor" d="M53 83c6-31 48-31 54 0l-14 36H67L53 83Z"/><path class="sprite-helm" d="M55 72 80 31l25 41-11 19H66L55 72Z"/><path class="sprite-weapon" d="M119 127 47 55" stroke="${stroke}"/></svg>`;
  }
  if (enemy.sprite === "dragon") {
    return `<svg viewBox="0 0 160 160"><circle class="sprite-shadow" cx="80" cy="139" r="42"/><path class="sprite-fur-dark" d="M30 120c10-42 28-67 50-75 22 8 40 33 50 75H30Z"/><path class="sprite-skin" d="M43 76 22 45l39 15 19-34 19 34 39-15-21 31-14 44H57L43 76Z"/><path class="sprite-eye" d="M61 79h12M87 79h12"/><path class="sprite-glow" d="M80 102v29M62 115h36"/></svg>`;
  }
  return `<svg viewBox="0 0 160 160"><circle class="sprite-shadow" cx="80" cy="139" r="32"/><path class="sprite-skin" d="M48 132c4-35 16-56 32-56s28 21 32 56H48Z"/><path class="sprite-skin" d="M45 74 30 59l25 3c12-23 38-23 50 0l25-3-15 15-10 31H55L45 74Z"/><path class="sprite-eye" d="M62 77h10M88 77h10"/><path class="sprite-weapon" d="M38 122 104 56"/></svg>`;
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
  const selected = getSelectedEnemy();
  if (selected) combat.selectedEnemyId = selected.id;

  document.querySelector("#encounter-kicker").textContent = NODE_TYPES[node.type].kicker;
  document.querySelector("#encounter-title").textContent = ENCOUNTER_COPY[node.type].title;
  document.querySelector("#encounter-art").innerHTML = `
    <div class="combat-backdrop">
      <div class="combat-die ${combat.lastRoll ? "is-rolling" : ""}">
        <span>${combat.lastRoll?.die || "d20"}</span>
        <strong>${combat.lastRoll?.value || "?"}</strong>
      </div>
      <div class="combat-backdrop__sigil"></div>
    </div>
  `;
  document.querySelector("#encounter-rewards").innerHTML = `
    <div class="combat-shell">
      <div class="combat-status">
        <span class="reward-chip">Раунд ${combat.round}</span>
        <span class="reward-chip">Ход: ${combat.turn === "player" ? "герой" : "враги"}</span>
        <span class="reward-chip">Инициатива: ${combat.initiative?.hero ?? "?"} / ${combat.initiative?.enemies ?? "?"}</span>
        <span class="reward-chip">${profile.skillName}: ${profile.skillText}</span>
      </div>
      <div class="combat-board">
        <div class="combat-party">
          ${renderUnitCard(
            { id: "hero", name: state.hero.name, hp: state.hero.hp, maxHp: state.hero.maxHp, ac: state.hero.ac },
            { kind: "combat-unit--hero", sprite: getHeroSprite() },
          )}
        </div>
        <div class="enemy-window" aria-label="Окно врагов">
          <div class="enemy-window__header">
            <strong>Враги</strong>
            <span>${getLivingEnemies().length}/${combat.enemies.length} активны</span>
          </div>
          <div class="combat-enemies">
            ${combat.enemies
              .map((enemy) =>
                renderUnitCard(enemy, {
                  kind: "combat-unit--enemy",
                  selected: enemy.id === combat.selectedEnemyId,
                  sprite: getEnemySprite(enemy),
                }),
              )
              .join("")}
          </div>
        </div>
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

  actions.innerHTML = `
    <button class="button button--primary" type="button" data-action="combat-attack">Атака</button>
    <button class="button" type="button" data-action="combat-skill">${profile.skillName}</button>
    <button class="button" type="button" data-action="combat-potion">Зелье (${state.hero.potions})</button>
    <button class="button button--danger" type="button" data-action="combat-end-turn">Конец хода</button>
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
  const profile = HERO_COMBAT[state.heroClass];
  const roll = rollDie(20);
  const total = roll + profile.attackBonus;
  const hit = roll === 20 || total >= target.ac;
  state.combat.lastRoll = { die: "d20", value: roll };

  if (!hit) {
    setCombatFloating(target.id, "MISS");
    pushCombatLog(`Бросок атаки против AC ${target.ac}: d20 ${roll} + ${profile.attackBonus} = ${total}. ${target.name} уклоняется.`);
    renderCombat(getNode(state.activeNodeId));
    queueEnemyTurn();
    return;
  }

  const crit = roll === 20;
  let damage;
  let label = "атака";

  if (skill && state.heroClass === "fighter") {
    damage = rollDamage(10, 4, crit ? 2 : 1);
    label = "Мощный удар";
  } else if (skill && state.heroClass === "rogue") {
    const secondRoll = rollDie(20);
    const bestRoll = Math.max(roll, secondRoll);
    state.combat.lastRoll = { die: "2d20", value: bestRoll };
    damage = rollDamage(6, 3, bestRoll === 20 ? 4 : 2);
    label = "Скрытая атака";
  } else {
    damage = rollDamage(profile.damageDie, profile.damageBonus, crit ? 2 : 1);
  }

  target.hp = Math.max(0, target.hp - damage.total);
  setCombatFloating(target.id, `-${damage.total}`);
  pushCombatLog(`${label}: d20 ${roll} + ${profile.attackBonus} против AC ${target.ac}. Попадание. Урон ${damage.rolls.join("+")} + бонус = ${damage.total}${crit ? " (крит)" : ""}.`);
  if (target.hp <= 0) pushCombatLog(`${target.name} падает в пепел.`);

  renderCombat(getNode(state.activeNodeId));
  if (!checkCombatVictory()) queueEnemyTurn();
}

function playerSkill() {
  if (!state.combat || state.combat.turn !== "player" || state.combat.victory) return;
  const profile = HERO_COMBAT[state.heroClass];

  if (state.heroClass !== "mage") {
    playerAttack({ skill: true });
    return;
  }

  const rolls = [];
  let anyHit = false;
  getLivingEnemies().forEach((enemy) => {
    const roll = rollDie(20);
    const total = roll + profile.attackBonus;
    rolls.push(roll);
    if (roll === 20 || total >= enemy.ac) {
      const damage = rollDamage(8, 3, roll === 20 ? 2 : 1);
      enemy.hp = Math.max(0, enemy.hp - damage.total);
      anyHit = true;
      setCombatFloating(enemy.id, `-${damage.total}`);
      pushCombatLog(`Огненная вспышка задевает ${enemy.name}: ${damage.total} урона.`);
    }
  });
  state.combat.lastRoll = { die: "d20", value: Math.max(...rolls) };
  if (!anyHit) pushCombatLog(`Огненная вспышка срывается: броски ${rolls.join(", ")} не пробили защиту.`);
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
  const heal = rollDamage(4, 2, 2);
  state.hero.potions -= 1;
  state.hero.hp = Math.min(state.hero.maxHp, state.hero.hp + heal.total);
  setCombatFloating("hero", `+${heal.total}`);
  pushCombatLog(`Зелье лечения восстанавливает ${heal.rolls.join("+")} + 2 = ${heal.total} HP.`);
  renderHud();
  renderCombat(getNode(state.activeNodeId));
  queueEnemyTurn();
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

  getLivingEnemies().forEach((enemy) => {
    const roll = rollDie(20);
    const total = roll + enemy.attackBonus;
    if (roll === 20 || total >= state.hero.ac) {
      const damage = rollDamage(enemy.damageDie, enemy.damageBonus, roll === 20 ? 2 : 1);
      let finalDamage = damage.total;
      if (state.heroClass === "fighter" && !state.combat.relicShieldUsed) {
        finalDamage = Math.max(0, finalDamage - 2);
        state.combat.relicShieldUsed = true;
      }
      state.hero.hp = Math.max(0, state.hero.hp - finalDamage);
      setCombatFloating("hero", `-${finalDamage}`);
      pushCombatLog(`${enemy.name} атакует против AC ${state.hero.ac}: d20 ${roll} + ${enemy.attackBonus} = ${total}. Урон ${finalDamage}.`);
    } else {
      pushCombatLog(`${enemy.name} атакует против AC ${state.hero.ac}: d20 ${roll} + ${enemy.attackBonus} = ${total}. Промах.`);
    }
  });

  if (state.combat.type === "boss") {
    const boss = state.combat.enemies[0];
    if (boss && boss.phase === 1 && boss.hp > 0 && boss.hp <= Math.floor(boss.maxHp / 2)) {
      boss.phase = 2;
      boss.attackBonus += 2;
      boss.damageBonus += 2;
      pushCombatLog("Фаза II: Астерон раскалывает грудную клетку, и пепельное сердце начинает биться.");
    }
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
  if (encounter.rewardRelic && !state.hero.relics.includes(encounter.rewardRelic)) {
    state.hero.relics.push(encounter.rewardRelic);
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

  const roll = Math.floor(Math.random() * 20) + 1;
  const hero = HEROES[state.heroClass];
  used.eventRoll = true;

  if (roll >= 13) {
    const reward = state.heroClass === "rogue" ? 24 : 12;
    state.hero.gold += reward;
    setDmText(`d20 = ${roll}. Камни раскрывают тайник. Вы получаете ${reward} gp и избегаете проклятия.`);
  } else {
    state.hero.hp = Math.max(1, state.hero.hp - 2);
    setDmText(`d20 = ${roll}. ${hero.relic} дрожит, но курган забирает кровь: -2 HP.`);
  }

  renderHud();
  if (node) renderEncounterActions(node);
  saveState();
}

function handleCampHeal() {
  const node = getNode(state.activeNodeId);
  const used = getNodeActions();
  if (used.campHeal) return;

  used.campHeal = true;
  state.hero.hp = Math.min(state.hero.maxHp, state.hero.hp + 6);
  setDmText("Огонь вспыхивает синим. Отряд восстанавливает 6 HP и слышит вдали крылья Астерона.");
  renderHud();
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
  renderEncounterActions(node);
  saveState();
}

function handleTavernTalk() {
  const node = getNode(state.activeNodeId);
  const used = getNodeActions();
  if (!node || used.tavernTalk) return;

  const npc = TAVERN_NPCS[getStableIndex(node.id, TAVERN_NPCS.length, 17)];
  const roll = rollDie(20);
  used.tavernTalk = true;

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
    setDmText(`${npc.check}: d20 = ${roll}. Успех. ${npc.success}`);
  } else {
    if (npc.name.includes("Ровена")) state.hero.gold = Math.max(0, state.hero.gold - 4);
    if (npc.name.includes("Ива")) state.hero.hp = Math.max(1, state.hero.hp - 1);
    setDmText(`${npc.check}: d20 = ${roll}. Провал. ${npc.fail}`);
  }

  renderHud();
  renderEncounterActions(node);
  saveState();
}

function handleLoreStudy() {
  const node = getNode(state.activeNodeId);
  const used = getNodeActions();
  if (!node || used.loreStudy) return;

  const lore = LORE_ENTRIES[getStableIndex(node.id, LORE_ENTRIES.length, 31)];
  const roll = rollDie(20);
  used.loreStudy = true;
  state.loreJournal = state.loreJournal || [];
  state.loreJournal.push(`${lore.title}: ${lore.text}`);
  if (roll >= 14) {
    state.threat = Math.max(1, state.threat - 1);
    setDmText(`История: d20 = ${roll}. ${lore.text} Вы понимаете, как обойти один знак Астерона. Угроза -1.`);
  } else {
    setDmText(`История: d20 = ${roll}. ${lore.text} Смысл ясен не полностью, но запись остается в журнале.`);
  }

  renderHud();
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
  if (node) renderEncounterActions(node);
  saveState();
}

function renderAll() {
  renderHeroSelection();
  renderHud();
  renderMap();
}

function bindUi() {
  document.querySelectorAll("[data-nav-screen]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.navScreen === GAME_STATES.WORLD_MAP && !state.hero) createHero();
      switchScreen(button.dataset.navScreen);
      renderAll();
    });
  });

  document.querySelector('[data-action="main-menu"]')?.addEventListener("click", (event) => {
    event.preventDefault();
    switchScreen(GAME_STATES.MAIN_MENU);
  });

  document.querySelectorAll('[data-action="new-game"]').forEach((button) => {
    button.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      state.heroClass = "fighter";
      state.subclass = HEROES.fighter.defaultSubclass;
      resetRun(false);
      switchScreen(GAME_STATES.CHARACTER_SELECT);
      setDmText(CAMPAIGN_LORE.opening);
    });
  });

  document.querySelector('[data-action="continue-game"]')?.addEventListener("click", () => {
    if (!state.hero) createHero();
    if (!state.map.length) resetRun(true);
    renderAll();
    switchScreen(state.screen === GAME_STATES.MAIN_MENU ? GAME_STATES.WORLD_MAP : state.screen);
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
    createHero();
    renderAll();
    saveState();
  });

  document.querySelector("#subclass-grid")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-subclass]");
    if (!button) return;
    state.subclass = button.dataset.subclass;
    createHero();
    renderAll();
    saveState();
  });

  document.querySelector('[data-action="confirm-hero"]')?.addEventListener("click", () => {
    createHero();
    resetRun(true);
    renderAll();
    switchScreen(GAME_STATES.WORLD_MAP);
    setDmText(`${CAMPAIGN_LORE.opening} ${HEROES[state.heroClass].epithet} выходит на нижнюю тропу.`);
  });

  document.querySelector('[data-action="reset-run"]')?.addEventListener("click", () => {
    resetRun(true);
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
    if (action === "combat-end-turn") queueEnemyTurn();
    if (action === "claim-combat-reward") claimCombatReward();
  });
}

function boot() {
  const loaded = loadState();
  if (!loaded || !state.map.length) {
    state.map = generateMap(state.seed);
    state.availableNodeIds = state.map[0].map((node) => node.id);
  }
  if (state.hero) {
    state.heroClass = state.hero.classId || state.heroClass;
    if (typeof state.hero.potions !== "number") state.hero.potions = 2;
    if (!Array.isArray(state.hero.relics)) state.hero.relics = [HEROES[state.heroClass].relic];
  }
  if (!state.nodeActionUses) state.nodeActionUses = {};
  if (!Array.isArray(state.loreJournal)) state.loreJournal = [];
  if (state.combat?.turn === "enemy") state.combat.turn = "player";
  bindUi();
  renderAll();
  if (state.screen === GAME_STATES.ENCOUNTER && state.activeNodeId) {
    renderEncounter(getNode(state.activeNodeId));
  }
  switchScreen(state.screen || GAME_STATES.MAIN_MENU);
}

boot();
