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
  camp: { label: "Костер", icon: "✚", kicker: "Короткий отдых" },
  shop: { label: "Магазин", icon: "$", kicker: "NPC-торговец" },
  elite: { label: "Элита", icon: "!", kicker: "Элитный бой" },
  boss: { label: "Босс", icon: "☠", kicker: "Сердце Горы" },
};

const ENCOUNTER_COPY = {
  battle: {
    title: "Засада на серой дороге",
    text: "Из низкого тумана выходят твари Астерона. Боевая система появится следующим этапом, а сейчас DM фиксирует встречу как пройденную.",
    rewards: ["+18 gp", "Потеря 2 HP"],
  },
  event: {
    title: "Шепот курганных камней",
    text: "Камни предлагают сделку: кровь за знание, золото за короткий путь, молчание за безопасность. Можно рискнуть броском d20.",
    rewards: ["Проверка d20", "Возможная реликвия"],
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
    rewards: ["+1 реликвия", "Потеря 4 HP"],
  },
  boss: {
    title: "Астерон, Дракон-Лич",
    text: "Сердце Горы раскрывается как черный глаз. Пока боевой модуль не подключен, победа засчитывается после финального решения.",
    rewards: ["Финал кампании", "Победа"],
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
  activeNodeId: null,
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

function getAllNodes() {
  return state.map.flat();
}

function getNode(nodeId) {
  return getAllNodes().find((node) => node.id === nodeId);
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
      else if (row === 0) type = pick(["battle", "event", "battle"], rng);
      else if (row === MAP_ROWS - 2) type = pick(["elite", "camp", "shop"], rng);
      else type = pick(["battle", "battle", "event", "camp", "shop", "elite"], rng);

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
  state.activeNodeId = null;
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

function openNode(nodeId) {
  const node = getNode(nodeId);
  if (!node || !state.availableNodeIds.includes(nodeId)) return;
  state.activeNodeId = nodeId;
  saveState();
  renderEncounter(node);
  switchScreen(GAME_STATES.ENCOUNTER);
}

function completeActiveNode() {
  const node = getNode(state.activeNodeId);
  if (!node || state.completedNodeIds.includes(node.id)) return;

  if (node.type === "battle") {
    state.hero.hp = Math.max(1, state.hero.hp - 2);
    state.hero.gold += 18;
  }
  if (node.type === "elite") {
    state.hero.hp = Math.max(1, state.hero.hp - 4);
    state.hero.gold += 28;
    state.hero.relics.push("Кость Пустой Клятвы");
    state.threat += 1;
  }
  if (node.type === "boss") {
    state.completedNodeIds.push(node.id);
    saveState();
    renderAll();
    switchScreen(GAME_STATES.VICTORY);
    return;
  }

  state.completedNodeIds.push(node.id);
  state.availableNodeIds = node.nextIds;
  state.currentRow = Math.min(MAP_ROWS - 1, node.row + 1);
  state.activeNodeId = null;

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
      <span class="reward-chip">Вдохновение: D&D и Slay the Spire</span>
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
    if (action === "complete-node") completeActiveNode();
    if (action === "event-roll") handleEventRoll();
    if (action === "camp-heal") handleCampHeal();
    if (action === "buy-potion") handleBuyPotion();
    if (action === "main-menu-return") switchScreen(GAME_STATES.MAIN_MENU);
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
  }
  bindUi();
  renderAll();
  if (state.screen === GAME_STATES.ENCOUNTER && state.activeNodeId) {
    renderEncounter(getNode(state.activeNodeId));
  }
  switchScreen(state.screen || GAME_STATES.MAIN_MENU);
}

boot();
