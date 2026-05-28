const CLASS_DATA = {
  fighter: {
    title: "Воин",
    defaultSubclass: "champion",
    copy: "Линия фронта, тяжелая броня, надежные атаки и контроль угрозы.",
    stats: { hp: 14, ac: 16, dmg: "d8", init: "+1" },
    abilities: { str: 15, dex: 13, con: 14, int: 10, wis: 12, cha: 9 },
  },
  mage: {
    title: "Маг",
    defaultSubclass: "evoker",
    copy: "Контроль поля, риск концентрации и мощные всплески тайной энергии.",
    stats: { hp: 9, ac: 12, dmg: "d10", init: "+0" },
    abilities: { str: 8, dex: 12, con: 13, int: 16, wis: 11, cha: 10 },
  },
  rogue: {
    title: "Плут",
    defaultSubclass: "thief",
    copy: "Скрытность, критические удары, ловушки и точечное добивание целей.",
    stats: { hp: 11, ac: 14, dmg: "d6", init: "+3" },
    abilities: { str: 10, dex: 16, con: 12, int: 13, wis: 11, cha: 12 },
  },
};

const SUBCLASS_NAMES = {
  champion: "Чемпион",
  battlemaster: "Боевой мастер",
  "eldritch-knight": "Рыцарь чар",
  samurai: "Самурай",
  evoker: "Эвокатор",
  necromancer: "Некромант",
  illusionist: "Иллюзионист",
  chronomancer: "Хронург",
  thief: "Вор",
  assassin: "Ассасин",
  "arcane-trickster": "Магический ловкач",
  "shadow-duelist": "Дуэлянт тени",
};

const STORAGE_KEY = "veil-of-ash-ui-state";

const state = {
  activeClass: "fighter",
  activeSubclass: "champion",
};

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function rollAbilityScore() {
  const rolls = Array.from({ length: 4 }, () => rollDie(6)).sort((a, b) => a - b);
  return rolls.slice(1).reduce((sum, value) => sum + value, 0);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || !CLASS_DATA[saved.activeClass]) return;
    state.activeClass = saved.activeClass;
    state.activeSubclass = SUBCLASS_NAMES[saved.activeSubclass]
      ? saved.activeSubclass
      : CLASS_DATA[saved.activeClass].defaultSubclass;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function setDmText(text) {
  const dmText = document.querySelector("#dm-text");
  if (!dmText) return;

  dmText.textContent = "";
  let cursor = 0;
  const speed = 16;
  const tick = () => {
    dmText.textContent = text.slice(0, cursor);
    cursor += 1;
    if (cursor <= text.length) {
      window.setTimeout(tick, speed);
    }
  };
  tick();
}

function playDiceStub() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(180, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(80, context.currentTime + 0.08);
  gain.gain.setValueAtTime(0.03, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.1);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.11);
}

function syncClassUi() {
  const data = CLASS_DATA[state.activeClass];
  document.querySelector("#app")?.setAttribute("data-active-class", state.activeClass);
  document.querySelector("#hero-class-title").textContent = data.title;
  document.querySelector("#hero-class-copy").textContent = data.copy;
  document.querySelector("#stat-hp").textContent = data.stats.hp;
  document.querySelector("#stat-ac").textContent = data.stats.ac;
  document.querySelector("#stat-dmg").textContent = data.stats.dmg;
  document.querySelector("#stat-init").textContent = data.stats.init;
  document.querySelector("#hero-name").textContent = `${data.title} - ${SUBCLASS_NAMES[state.activeSubclass]}`;
  document.querySelector("#selected-subclass").textContent = SUBCLASS_NAMES[state.activeSubclass];

  document.querySelectorAll("[data-portrait]").forEach((portrait) => {
    portrait.classList.toggle("is-active", portrait.dataset.portrait === state.activeClass);
  });

  document.querySelectorAll("[data-class]").forEach((element) => {
    if (element.classList.contains("class-card")) {
      element.classList.toggle("is-selected", element.dataset.class === state.activeClass);
    }
  });

  document.querySelectorAll(".subclass-pill").forEach((pill) => {
    pill.classList.toggle("is-active", pill.dataset.subclass === state.activeSubclass);
  });

  document.querySelectorAll("[data-subclass-card]").forEach((card) => {
    card.classList.toggle("is-active", card.dataset.subclassCard === state.activeSubclass);
  });
}

function setActiveClass(classId) {
  if (!CLASS_DATA[classId]) return;
  state.activeClass = classId;
  const currentPill = document.querySelector(`.subclass-pill[data-class="${classId}"].is-active`);
  state.activeSubclass = currentPill?.dataset.subclass || CLASS_DATA[classId].defaultSubclass;
  syncClassUi();
  saveState();
  setDmText(`Выбран ${CLASS_DATA[classId].title}. Подкласс: ${SUBCLASS_NAMES[state.activeSubclass]}. DM отмечает новую тактику в журнале.`);
}

function setActiveSubclass(classId, subclassId) {
  if (!CLASS_DATA[classId] || !SUBCLASS_NAMES[subclassId]) return;
  state.activeClass = classId;
  state.activeSubclass = subclassId;
  syncClassUi();
  saveState();
  setDmText(`Подкласс ${SUBCLASS_NAMES[subclassId]} готов. Следующая встреча будет учитывать выбранный стиль боя.`);
}

function rollAbilities() {
  const scores = {
    str: rollAbilityScore(),
    dex: rollAbilityScore(),
    con: rollAbilityScore(),
    int: rollAbilityScore(),
    wis: rollAbilityScore(),
    cha: rollAbilityScore(),
  };

  Object.entries(scores).forEach(([key, value]) => {
    const stat = document.querySelector(`[data-stat="${key}"]`);
    if (stat) stat.textContent = value;
  });

  setDmText(`Брошены характеристики 4d6 с отбросом меньшего: ${Object.values(scores).join(", ")}.`);
}

function animateRoll(button) {
  const sides = Number(button.dataset.die);
  if (!sides) return;

  const result = rollDie(sides);
  button.classList.remove("is-rolling");
  void button.offsetWidth;
  button.classList.add("is-rolling");
  window.setTimeout(() => button.classList.remove("is-rolling"), 720);
  playDiceStub();
  setDmText(`Кубик d${sides} остановился на ${result}. ${result === sides ? "Критический успех звучит в тишине." : "DM записывает результат."}`);
}

function simulateAttack() {
  const hero = document.querySelector('[data-entity-id="hero"]');
  const target = document.querySelector('[data-entity-id="goblin"]');
  const battlefield = document.querySelector(".battlefield");
  hero?.classList.add("is-attacking");
  target?.classList.add("is-hit");
  battlefield?.classList.add("is-shaking");
  window.setTimeout(() => {
    hero?.classList.remove("is-attacking");
    target?.classList.remove("is-hit");
    battlefield?.classList.remove("is-shaking");
  }, 680);
  const attack = rollDie(20) + 4;
  const damage = rollDie(8) + 2;
  setDmText(`Атака: d20 + 4 = ${attack}. Урон мечом: 1d8 + 2 = ${damage}.`);
}

function bindUi() {
  document.querySelectorAll(".class-card").forEach((card) => {
    card.addEventListener("click", () => setActiveClass(card.dataset.class));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setActiveClass(card.dataset.class);
      }
    });
  });

  document.querySelectorAll(".subclass-pill").forEach((pill) => {
    pill.addEventListener("click", (event) => {
      event.stopPropagation();
      setActiveSubclass(pill.dataset.class, pill.dataset.subclass);
    });
  });

  document.querySelectorAll("[data-die]").forEach((button) => {
    button.addEventListener("click", () => animateRoll(button));
  });

  document.querySelector('[data-action="roll-abilities"]')?.addEventListener("click", rollAbilities);
  document.querySelector('[data-action="attack"]')?.addEventListener("click", simulateAttack);
  document.querySelector('[data-action="start-run"]')?.addEventListener("click", () => {
    setDmText("Поход начался. Карта открывает первый маршрут, а компаньоны занимают позиции.");
  });
}

loadState();
bindUi();
syncClassUi();
