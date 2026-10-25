const menuScreen = document.getElementById('menuScreen');
const gameScreen = document.getElementById('gameScreen');
const playButton = document.getElementById('playButton');
const settingsButton = document.getElementById('settingsButton');
const restartButton = document.getElementById('restartButton');
const overlay = document.getElementById('gameOver');
const upgradeOverlay = document.getElementById('upgradeOverlay');
const settingsOverlay = document.getElementById('settingsOverlay');
const upgradeChoices = document.getElementById('upgradeChoices');
const healthText = document.getElementById('healthText');
const waveText = document.getElementById('waveText');
const hud = document.querySelector('.hud');
const storyCaption = document.getElementById('storyCaption');
const gameOverMessage = document.getElementById('gameOverMessage');
const closeSettingsButton = document.getElementById('closeSettingsButton');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const settingsState = {
  noise: 'Low',
  rust: true,
  scan: 'On',
};

const MAX_RUN_LEVELS = 50;
const MAX_ACTIVE_ENEMIES = 18;

function getArenaBounds() {
  const halfWidth = 420 + (state.wave - 1) * 4;
  const halfHeight = 220 + (state.wave - 1) * 2;
  return {
    minX: -halfWidth,
    maxX: halfWidth,
    minY: -halfHeight,
    maxY: halfHeight,
    halfWidth,
    halfHeight,
  };
}

const upgradePool = [
  {
    name: 'Tank Wiki Page',
    positive: '1.5x max HP',
    negative: '-20% move speed',
    apply: () => {
      player.maxHealth *= 1.5;
      player.health = player.maxHealth;
      player.speed *= 0.8;
    },
  },
  {
    name: 'Faster threads',
    positive: '1.8x fire rate',
    negative: '-25% max HP',
    apply: () => {
      player.maxHealth *= 0.75;
      player.health = Math.min(player.health, player.maxHealth);
      player.fireRateMultiplier *= 1.8;
    },
  },
  {
    name: 'Glass incased',
    positive: '1.6x projectile speed',
    negative: '-20% max HP',
    apply: () => {
      player.bulletSpeedMultiplier *= 1.6;
      player.maxHealth *= 0.8;
      player.health = Math.min(player.health, player.maxHealth);
    },
  },
  {
    name: 'Angry kernel',
    positive: '1.6x melee damage',
    negative: '-20% max HP',
    apply: () => {
      player.meleeDamageMultiplier *= 1.6;
      player.maxHealth *= 0.8;
      player.health = Math.min(player.health, player.maxHealth);
    },
  },
  {
    name: 'Signal Relay',
    positive: '2x movement speed',
    negative: '-25% max HP',
    apply: () => {
      player.speed *= 2;
      player.maxHealth *= 0.75;
      player.health = Math.min(player.health, player.maxHealth);
    },
  },
  {
    name: 'Overclocked Logic',
    positive: '1.6x attack damage',
    negative: '-20% defense',
    apply: () => {
      player.damageMultiplier *= 1.6;
      player.damageReduction *= 0.8;
    },
  },
  {
    name: 'Sealed Battery',
    positive: '1.8x max HP',
    negative: '-20% fire rate',
    apply: () => {
      player.maxHealth *= 1.8;
      player.health = player.maxHealth;
      player.fireRateMultiplier *= 0.8;
    },
  },
  {
    name: 'Crowbar level grip',
    positive: '1.5x melee damage',
    negative: '-20% projectile speed',
    apply: () => {
      player.meleeDamageMultiplier *= 1.5;
      player.bulletSpeedMultiplier *= 0.8;
    },
  },
  {
    name: 'Duct Taped armor',
    positive: '1.5x defense',
    negative: '-20% move speed',
    apply: () => {
      player.damageReduction *= 1.5;
      player.speed *= 0.8;
    },
  },
  {
    name: 'Pulse Muzzle',
    positive: '1.8x bullet damage',
    negative: '-25% max HP',
    apply: () => {
      player.damageMultiplier *= 1.8;
      player.maxHealth *= 0.75;
      player.health = Math.min(player.health, player.maxHealth);
    },
  },
  {
    name: 'Sprint Matrix',
    positive: '2x movement speed',
    negative: '-20% attack damage',
    apply: () => {
      player.speed *= 2;
      player.damageMultiplier *= 0.8;
    },
  },
  {
    name: 'Cold Start',
    positive: '1.6x fire rate',
    negative: '-15% move speed',
    apply: () => {
      player.fireRateMultiplier *= 1.6;
      player.speed *= 0.85;
    },
  },
  {
    name: 'Reinforced Framing',
    positive: '1.8x max HP',
    negative: '-20% move speed',
    apply: () => {
      player.maxHealth *= 1.8;
      player.health = player.maxHealth;
      player.speed *= 0.8;
    },
  },
  {
    name: 'Magnetic Rounds',
    positive: '1.5x bullet damage',
    negative: '-20% max HP',
    apply: () => {
      player.damageMultiplier *= 1.5;
      player.maxHealth *= 0.8;
      player.health = Math.min(player.health, player.maxHealth);
    },
  },
  {
    name: 'Apex Hinging',
    positive: '1.5x movement speed',
    negative: '-20% defense',
    apply: () => {
      player.speed *= 1.5;
      player.damageReduction *= 0.8;
    },
  },
  {
    name: 'Cindery core',
    positive: '1.5x melee damage',
    negative: '-20% projectile speed',
    apply: () => {
      player.meleeDamageMultiplier *= 1.5;
      player.bulletSpeedMultiplier *= 0.8;
    },
  },
  {
    name: 'Lead filled lungs',
    positive: '1.5x max HP',
    negative: '-20% move speed',
    apply: () => {
      player.maxHealth *= 1.5;
      player.health = player.maxHealth;
      player.speed *= 0.8;
    },
  },
  {
    name: 'Megawatt voltage',
    positive: '1.6x fire rate',
    negative: '-20% defense',
    apply: () => {
      player.fireRateMultiplier *= 1.6;
      player.damageReduction *= 0.8;
    },
  },
  {
    name: 'Target Finder',
    positive: '1.5x attack damage',
    negative: '-20% max HP',
    apply: () => {
      player.damageMultiplier *= 1.5;
      player.maxHealth *= 0.8;
      player.health = Math.min(player.health, player.maxHealth);
    },
  },
  {
    name: 'Rusted Gear',
    positive: '1.5x max HP',
    negative: '-20% movement speed',
    apply: () => {
      player.maxHealth *= 1.5;
      player.health = player.maxHealth;
      player.speed *= 0.8;
    },
  },
  {
    name: 'Neon Buffer',
    positive: '1.5x defense',
    negative: '-20% attack damage',
    apply: () => {
      player.damageReduction *= 1.5;
      player.damageMultiplier *= 0.8;
    },
  },
  {
    name: 'Combat Laptop',
    positive: '1.6x fire rate',
    negative: '-20% max HP',
    apply: () => {
      player.fireRateMultiplier *= 1.6;
      player.maxHealth *= 0.8;
      player.health = Math.min(player.health, player.maxHealth);
    },
  },
  {
    name: 'Split Reactor',
    positive: '1.5x attack damage',
    negative: '-20% defense',
    apply: () => {
      player.damageMultiplier *= 1.5;
      player.damageReduction *= 0.8;
    },
  },
  {
    name: 'Backpack Drill',
    positive: '1.5x melee damage',
    negative: '-20% movement speed',
    apply: () => {
      player.meleeDamageMultiplier *= 1.5;
      player.speed *= 0.8;
    },
  },
  {
    name: 'Mirror Coil',
    positive: '1.6x projectile speed',
    negative: '-20% defense',
    apply: () => {
      player.bulletSpeedMultiplier *= 1.6;
      player.damageReduction *= 0.8;
    },
  },
  {
    name: 'Surgical Wire',
    positive: '1.5x bullet damage',
    negative: '-20% max HP',
    apply: () => {
      player.damageMultiplier *= 1.5;
      player.maxHealth *= 0.8;
      player.health = Math.min(player.health, player.maxHealth);
    },
  },
];

const state = {
  running: false,
  pointer: { x: canvas.width / 2, y: canvas.height / 2, primary: false, secondary: false, primaryHeld: false, secondaryHeld: false },
  keys: {},
  bullets: [],
  enemies: [],
  enemiesRemainingToSpawn: 0,
  slashEffects: [],
  particles: [],
  wave: 1,
  time: 0,
  lastTime: 0,
  camera: { x: 0, y: 0 },
  upgradeOpen: false,
  cutscene: null,
  storyCooldown: 0,
};

const player = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  radius: 18,
  speed: 170,
  maxHealth: 100,
  health: 100,
  angle: 0,
  fireCooldown: 0,
  meleeCooldown: 0,
  dmgFlash: 0,
  fireRateMultiplier: 1,
  bulletSpeedMultiplier: 1,
  meleeDamageMultiplier: 1,
  damageMultiplier: 1,
  damageReduction: 1,
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function clampToArena(entity) {
  const bounds = getArenaBounds();
  const prevX = entity.x;
  const prevY = entity.y;

  if (entity.x < bounds.minX) {
    entity.x = bounds.minX;
    if (typeof entity.vx === 'number') entity.vx *= -0.2;
  }
  if (entity.x > bounds.maxX) {
    entity.x = bounds.maxX;
    if (typeof entity.vx === 'number') entity.vx *= -0.2;
  }
  if (entity.y < bounds.minY) {
    entity.y = bounds.minY;
    if (typeof entity.vy === 'number') entity.vy *= -0.2;
  }
  if (entity.y > bounds.maxY) {
    entity.y = bounds.maxY;
    if (typeof entity.vy === 'number') entity.vy *= -0.2;
  }

  if (entity.x === prevX && entity.y === prevY && (entity.x <= bounds.minX || entity.x >= bounds.maxX || entity.y <= bounds.minY || entity.y >= bounds.maxY)) {
    if (typeof entity.vx === 'number') entity.vx = 0;
    if (typeof entity.vy === 'number') entity.vy = 0;
  }
}

function resolvePlayerEnemyCollision(enemy) {
  let dx = player.x - enemy.x;
  let dy = player.y - enemy.y;
  let distance = Math.hypot(dx, dy);
  const minDistance = player.radius + enemy.radius;

  if (distance >= minDistance) return false;

  if (distance === 0) {
    dx = 1;
    dy = 0;
    distance = 1;
  }

  const overlap = minDistance - distance;
  player.x += (dx / distance) * overlap;
  player.y += (dy / distance) * overlap;
  clampToArena(player);
  return true;
}

function shuffle(array) {
  const items = [...array];
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function resetPlayer() {
  player.x = 0;
  player.y = 0;
  player.health = player.maxHealth;
  player.fireCooldown = 0;
  player.meleeCooldown = 0;
  player.dmgFlash = 0;
}

function getSentinelChargeTime(wave) {
  if (wave < 5) return 0;
  const start = 5;
  const end = 2.5;
  const t = clamp((wave - 5) / (50 - 5), 0, 1);
  return start - (start - end) * t;
}

function spawnEnemy() {
  const side = Math.floor(Math.random() * 4);
  let x = player.x;
  let y = player.y;

  switch (side) {
    case 0:
      x = player.x + (Math.random() * 800 - 400);
      y = player.y - 500 - Math.random() * 200;
      break;
    case 1:
      x = player.x + 500 + Math.random() * 200;
      y = player.y + (Math.random() * 800 - 400);
      break;
    case 2:
      x = player.x + (Math.random() * 800 - 400);
      y = player.y + 500 + Math.random() * 200;
      break;
    default:
      x = player.x - 500 - Math.random() * 200;
      y = player.y + (Math.random() * 800 - 400);
      break;
  }

  const typeRoll = Math.random();
  let enemyType = 'drone';
  if (state.wave >= 5 && typeRoll > 0.82) {
    enemyType = 'sentinel';
  } else if (state.wave >= 3 && typeRoll > 0.7) {
    enemyType = 'brute';
  } else if (state.wave >= 2 && typeRoll > 0.35) {
    enemyType = 'runner';
  }

  const enemyDefs = {
    drone: {
      radius: 14,
      speed: 55 + state.wave * 8 + Math.random() * 12,
      health: 2 + state.wave,
      maxHealth: 2 + state.wave,
      color: '#83d5ff',
      accent: '#ff5e57',
    },
    runner: {
      radius: 12,
      speed: 82 + state.wave * 10 + Math.random() * 15,
      health: 2 + state.wave * 0.8,
      maxHealth: 2 + state.wave * 0.8,
      color: '#ffb570',
      accent: '#ffd59e',
    },
    brute: {
      radius: 18,
      speed: 40 + state.wave * 6 + Math.random() * 8,
      health: 6 + state.wave * 1.8,
      maxHealth: 6 + state.wave * 1.8,
      color: '#8ae0ad',
      accent: '#d8ffe4',
    },
    sentinel: {
      radius: 20,
      speed: 26 + state.wave * 5,
      health: 8 + state.wave * 2.4,
      maxHealth: 8 + state.wave * 2.4,
      color: '#f8d66d',
      accent: '#fff0b3',
    },
  };

  const def = enemyDefs[enemyType];
  const angle = Math.atan2(player.y - y, player.x - x);

  const enemy = {
    x: clamp(x, getArenaBounds().minX + 30, getArenaBounds().maxX - 30),
    y: clamp(y, getArenaBounds().minY + 30, getArenaBounds().maxY - 30),
    type: enemyType,
    radius: def.radius,
    speed: def.speed,
    health: def.health,
    maxHealth: def.maxHealth,
    hitCooldown: 0,
    color: def.color,
    accent: def.accent,
    angle,
    charge: 0,
    beamActive: false,
    beamTimer: 0,
    locked: false,
    reAimTimer: 0,
    chargeTime: getSentinelChargeTime(state.wave),
  };

  state.enemies.push(enemy);
}

function getWaveEnemyCount() {
  if (state.wave === 1) return 5;
  const base = 2 + Math.max(0, state.wave - 1) * 1.2;
  const ramp = 1 + (state.wave - 1) * 0.05;
  return Math.max(2, Math.ceil(base * ramp));
}

function resetWave() {
  state.enemies = [];
  state.enemiesRemainingToSpawn = getWaveEnemyCount();
  const initialSpawnCount = Math.min(MAX_ACTIVE_ENEMIES, state.enemiesRemainingToSpawn);
  for (let i = 0; i < initialSpawnCount; i += 1) {
    spawnEnemy();
    state.enemiesRemainingToSpawn -= 1;
  }
  waveText.textContent = String(state.wave);
  updateHealthText();
}

function updateHealthText() {
  healthText.textContent = `Health ${Math.max(0, Math.ceil(player.health))}`;
}

function setStoryCaption(message) {
  storyCaption.textContent = message;
}

function setGameRunning(started) {
  state.running = started;
  if (started) {
    overlay.classList.add('hidden');
    upgradeOverlay.classList.add('hidden');
    state.time = 0;
    state.upgradeOpen = false;
  }
}

function syncSettingsUI() {
  document.body.classList.toggle('rust-mode', settingsState.rust);
  document.body.classList.toggle('heavy-grain', settingsState.noise === 'Heavy');
  document.body.classList.toggle('scan-lines', settingsState.scan === 'On');

  const noiseState = document.querySelector('[data-setting="noise"] .value');
  const rustState = document.querySelector('[data-setting="rust"] .value');
  const scanState = document.querySelector('[data-setting="scan"] .value');
  const noiseButton = document.querySelector('[data-setting="noise"]');
  const rustButton = document.querySelector('[data-setting="rust"]');
  const scanButton = document.querySelector('[data-setting="scan"]');

  if (noiseState) noiseState.textContent = settingsState.noise;
  if (rustState) rustState.textContent = settingsState.rust ? 'On' : 'Off';
  if (scanState) scanState.textContent = settingsState.scan;
  if (noiseButton) noiseButton.setAttribute('aria-pressed', String(settingsState.noise === 'Heavy'));
  if (rustButton) rustButton.setAttribute('aria-pressed', String(settingsState.rust));
  if (scanButton) scanButton.setAttribute('aria-pressed', String(settingsState.scan === 'On'));
}

function openSettings() {
  settingsOverlay.classList.remove('hidden');
}

function closeSettings() {
  settingsOverlay.classList.add('hidden');
}

function startGame() {
  state.wave = 1;
  state.cutscene = null;
  state.storyCooldown = 0;
  setStoryCaption("Cache: I don't know what's out there. But I don't want to be alone in here.");
  hud.classList.remove('cutscene-hidden');
  const gameOverTitle = document.querySelector('#gameOver h2');
  if (gameOverTitle) gameOverTitle.textContent = 'Cache needs a moment';
  gameOverMessage.textContent = 'Cache: I need a moment. If you are ready, we can try again.';
  menuScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  player.fireRateMultiplier = 1;
  player.bulletSpeedMultiplier = 1;
  player.meleeDamageMultiplier = 2;
  player.damageMultiplier = 1;
  player.damageReduction = 1;
  player.maxHealth = 100;
  player.speed = 170;
  resetPlayer();
  setGameRunning(true);
  resetWave();
}

function endGame() {
  setGameRunning(false);
  const gameOverTitle = document.querySelector('#gameOver h2');
  if (gameOverTitle) gameOverTitle.textContent = 'Cache needs a moment';
  gameOverMessage.textContent = "Cache: I tried my best. If you're ready, I'd like to try again with you.";
  overlay.classList.remove('hidden');
}

function showUpgradeChoices() {
  if (state.wave >= MAX_RUN_LEVELS) {
    state.running = false;
    state.upgradeOpen = false;
    state.cutscene = { elapsed: 0 };
    setStoryCaption('Cache: Is that sunlight? I think we really made it.');
    upgradeOverlay.classList.add('hidden');
    overlay.classList.add('hidden');
    hud.classList.add('cutscene-hidden');
    return;
  }

  state.running = false;
  state.upgradeOpen = true;
  setStoryCaption('Cache: We made it through. What do you think I should work on?');
  upgradeOverlay.classList.remove('hidden');

  const choices = shuffle(upgradePool).slice(0, 3);
  upgradeChoices.innerHTML = choices.map((upgrade) => `
    <button class="upgrade-card" data-name="${upgrade.name}">
      <h3>${upgrade.name}</h3>
      <div class="stat good">+ ${upgrade.positive}</div>
      <div class="stat bad">- ${upgrade.negative}</div>
    </button>
  `).join('');

  upgradeChoices.querySelectorAll('.upgrade-card').forEach((card) => {
    card.addEventListener('click', () => {
      const name = card.dataset.name;
      const upgrade = choices.find((entry) => entry.name === name);
      if (!upgrade) return;

      upgrade.apply();
      resetPlayer();
      upgradeOverlay.classList.add('hidden');
      state.wave += 1;
      setStoryCaption(`Cache: Sector ${state.wave}. One step at a time—we've got this.`);
      state.running = true;
      state.upgradeOpen = false;
      resetWave();
      updateHealthText();
    });
  });
}

function spawnBullet() {
  const angle = player.angle;
  const bullet = {
    x: player.x + Math.cos(angle) * 22,
    y: player.y + Math.sin(angle) * 22,
    vx: Math.cos(angle) * 390 * player.bulletSpeedMultiplier,
    vy: Math.sin(angle) * 390 * player.bulletSpeedMultiplier,
    radius: 3,
    life: 1.2,
  };
  state.bullets.push(bullet);
}

function meleeAttack() {
  const slash = {
    x: player.x,
    y: player.y,
    angle: player.angle,
    life: 0.18,
    range: 68,
  };
  state.slashEffects.push(slash);

  for (const enemy of state.enemies) {
    const dx = enemy.x - player.x;
    const dy = enemy.y - player.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 68) continue;

    const aim = Math.atan2(dy, dx);
    const diff = Math.abs(Math.atan2(Math.sin(aim - player.angle), Math.cos(aim - player.angle)));
    if (diff < 1.3) {
      enemy.health -= 2 * player.meleeDamageMultiplier;
      enemy.hitCooldown = 0.2;
    }
  }
}

function createBurst(x, y, color) {
  for (let i = 0; i < 8; i += 1) {
    const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.8;
    const speed = 30 + Math.random() * 60;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.5 + Math.random() * 0.5,
      color,
      size: 2,
    });
  }
}

function handleInput() {
  const moveX = (state.keys['KeyD'] || state.keys['ArrowRight'] ? 1 : 0) - (state.keys['KeyA'] || state.keys['ArrowLeft'] ? 1 : 0);
  const moveY = (state.keys['KeyS'] || state.keys['ArrowDown'] ? 1 : 0) - (state.keys['KeyW'] || state.keys['ArrowUp'] ? 1 : 0);

  const length = Math.hypot(moveX, moveY) || 1;
  player.vx = (moveX / length) * player.speed;
  player.vy = (moveY / length) * player.speed;

  const screenX = state.pointer.x - canvas.width / 2;
  const screenY = state.pointer.y - canvas.height / 2;
  player.angle = Math.atan2(screenY, screenX);

  if (state.pointer.primary && !state.pointer.primaryHeld && player.fireCooldown <= 0) {
    const fireInterval = 0.17 / player.fireRateMultiplier;
    player.fireCooldown = fireInterval;
    state.pointer.primaryHeld = true;
    spawnBullet();
  }

  if (!state.pointer.primary && state.pointer.primaryHeld) {
    state.pointer.primaryHeld = false;
  }

  if (state.pointer.secondary && !state.pointer.secondaryHeld && player.meleeCooldown <= 0) {
    player.meleeCooldown = 0.4;
    state.pointer.secondaryHeld = true;
    meleeAttack();
  }

  if (!state.pointer.secondary && state.pointer.secondaryHeld) {
    state.pointer.secondaryHeld = false;
  }
}

function update(dt) {
  if (!state.running) return;

  state.time += dt;
  state.storyCooldown = Math.max(0, state.storyCooldown - dt);
  player.fireCooldown = Math.max(0, player.fireCooldown - dt);
  player.meleeCooldown = Math.max(0, player.meleeCooldown - dt);
  player.dmgFlash = Math.max(0, player.dmgFlash - dt * 2.5);

  handleInput();

  player.x += player.vx * dt;
  player.y += player.vy * dt;
  clampToArena(player);

  state.camera.x += (player.x - state.camera.x) * 0.12;
  state.camera.y += (player.y - state.camera.y) * 0.12;

  for (let i = state.bullets.length - 1; i >= 0; i -= 1) {
    const bullet = state.bullets[i];
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    bullet.life -= dt;

    if (bullet.life <= 0) {
      state.bullets.splice(i, 1);
      continue;
    }

    for (let j = state.enemies.length - 1; j >= 0; j -= 1) {
      const enemy = state.enemies[j];
      const dist = Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y);
      if (dist < enemy.radius + bullet.radius + 2) {
        enemy.health -= player.damageMultiplier;
        createBurst(bullet.x, bullet.y, '#ff5e57');
        state.bullets.splice(i, 1);
        break;
      }
    }
  }

  for (let i = state.slashEffects.length - 1; i >= 0; i -= 1) {
    state.slashEffects[i].life -= dt;
    if (state.slashEffects[i].life <= 0) {
      state.slashEffects.splice(i, 1);
    }
  }

  for (let i = state.particles.length - 1; i >= 0; i -= 1) {
    const part = state.particles[i];
    part.x += part.vx * dt;
    part.y += part.vy * dt;
    part.life -= dt;
    if (part.life <= 0) state.particles.splice(i, 1);
  }

  for (let i = state.enemies.length - 1; i >= 0; i -= 1) {
    const enemy = state.enemies[i];
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.hypot(dx, dy) || 1;
    enemy.hitCooldown = Math.max(0, enemy.hitCooldown - dt);

    if (enemy.type === 'sentinel') {
      enemy.chargeTime = getSentinelChargeTime(state.wave);
      const aimAngle = Math.atan2(dy, dx);
      const beamDirX = Math.cos(aimAngle);
      const beamDirY = Math.sin(aimAngle);
      const forward = dx * beamDirX + dy * beamDirY;
      const sideOffset = Math.abs((-dx * beamDirY) + (dy * beamDirX));
      const seesPlayer = forward > 0 && sideOffset < player.radius + 18;

      if (enemy.beamActive) {
        enemy.beamTimer -= dt;

        enemy.angle = aimAngle;

        if (forward > 0 && sideOffset < player.radius + 18) {
          const damageTaken = 14 / player.damageReduction;
          player.health -= damageTaken;
          player.dmgFlash = 1;
          if (state.storyCooldown <= 0) {
            setStoryCaption('Cache: Ouch. Okay—still here. Keep moving.');
            state.storyCooldown = 4;
          }
          createBurst(player.x, player.y, '#f8d66d');
          if (player.health <= 0) {
            endGame();
            return;
          }
        }

        if (enemy.beamTimer <= 0) {
          enemy.beamActive = false;
          enemy.charge = 0;
          enemy.locked = false;
          enemy.reAimTimer = 0.35;
        }
      } else {
        if (enemy.reAimTimer > 0) {
          enemy.reAimTimer -= dt;
          enemy.angle = aimAngle;
          if (enemy.reAimTimer <= 0) {
            enemy.locked = false;
          }
        } else {
          enemy.angle = aimAngle;
          enemy.locked = true;
          enemy.charge += seesPlayer ? dt : 0;
        }

        if (enemy.charge >= enemy.chargeTime && seesPlayer) {
          enemy.beamActive = true;
          enemy.beamTimer = 0.65;
          enemy.locked = false;
          enemy.reAimTimer = 0;
        }
      }

      enemy.x += (dx / dist) * Math.min(enemy.speed, 28) * dt;
      enemy.y += (dy / dist) * Math.min(enemy.speed, 28) * dt;
      clampToArena(enemy);
    } else {
      enemy.x += (dx / dist) * enemy.speed * dt;
      enemy.y += (dy / dist) * enemy.speed * dt;
      clampToArena(enemy);
    }

    const touchingPlayer = resolvePlayerEnemyCollision(enemy);
    if (touchingPlayer && enemy.hitCooldown <= 0 && enemy.type !== 'sentinel') {
      const damageTaken = 8 / player.damageReduction;
      player.health -= damageTaken;
      player.dmgFlash = 1;
      if (state.storyCooldown <= 0) {
        setStoryCaption('Cache: That one stung. Can we give them a little space?');
        state.storyCooldown = 4;
      }
      enemy.hitCooldown = 0.7;
      createBurst(player.x, player.y, '#f8d66d');
      if (player.health <= 0) {
        endGame();
        return;
      }
    }

    if (enemy.health <= 0) {
      createBurst(enemy.x, enemy.y, '#76e8ff');
      state.enemies.splice(i, 1);
      if (state.enemiesRemainingToSpawn > 0) {
        spawnEnemy();
        state.enemiesRemainingToSpawn -= 1;
      }
      if (state.enemies.length === 0 && state.enemiesRemainingToSpawn === 0) {
        showUpgradeChoices();
        break;
      }
    }
  }

  updateHealthText();
}

function drawFloor() {
  const offsetX = (state.camera.x % 32) - 32;
  const offsetY = (state.camera.y % 32) - 32;

  for (let x = -32; x < canvas.width + 32; x += 32) {
    for (let y = -32; y < canvas.height + 32; y += 32) {
      const px = x - offsetX;
      const py = y - offsetY;
      ctx.fillStyle = (Math.floor((px + py) / 32) % 2 === 0) ? '#dde7d8' : '#e2eed5';
      ctx.fillRect(px, py, 32, 32);
    }
  }
}

function drawArenaBorder() {
  const bounds = getArenaBounds();
  const x = bounds.minX - state.camera.x + canvas.width / 2;
  const y = bounds.minY - state.camera.y + canvas.height / 2;
  const w = bounds.halfWidth * 2;
  const h = bounds.halfHeight * 2;

  ctx.save();
  ctx.shadowColor = '#ffb347';
  ctx.shadowBlur = 12;
  ctx.strokeStyle = '#171717';
  ctx.lineWidth = 10;
  ctx.strokeRect(x, y, w, h);

  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#ffb347';
  ctx.lineWidth = 4;
  ctx.strokeRect(x, y, w, h);
  ctx.restore();
}

function drawPlayer() {
  const x = player.x - state.camera.x + canvas.width / 2;
  const y = player.y - state.camera.y + canvas.height / 2;
  const movement = clamp(Math.hypot(player.vx, player.vy) / Math.max(1, player.speed), 0, 1);
  const step = Math.sin(state.time * 11);
  const stride = step * 4 * movement;
  const bob = Math.abs(step) * 2.5 * movement;
  const outline = '#171719';
  const body = player.dmgFlash > 0 ? '#e3b9b4' : '#b9abad';
  const shell = player.dmgFlash > 0 ? '#ffd2c5' : '#f1efeb';
  const red = player.dmgFlash > 0 ? '#ff796f' : '#c71920';
  const pulse = 0.8 + (Math.sin(state.time * 5) + 1) * 0.1;

  const strokePath = (draw, color = outline, width = 3) => {
    ctx.beginPath();
    draw();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  ctx.save();
  ctx.translate(x, y - bob);
  ctx.rotate(player.angle);
  ctx.scale(0.78, 0.78);

  ctx.fillStyle = 'rgba(16, 18, 20, 0.22)';
  ctx.beginPath();
  ctx.ellipse(0, 66 + bob, 33, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Back-mounted thrusters and narrow legs keep the hand-drawn silhouette light.
  ctx.fillStyle = '#665f63';
  ctx.fillRect(-9, 20, 8, 25);
  ctx.fillRect(3, 20, 8, 25);
  strokePath(() => {
    ctx.moveTo(-7 + stride, 38);
    ctx.lineTo(-10 + stride, 58);
    ctx.lineTo(-24 + stride, 61);
    ctx.quadraticCurveTo(-29 + stride, 63, -24 + stride, 66);
    ctx.lineTo(-5 + stride, 65);
    ctx.lineTo(-2 + stride, 59);
    ctx.lineTo(-1, 39);
  }, outline, 4);
  strokePath(() => {
    ctx.moveTo(7 - stride, 38);
    ctx.lineTo(6 - stride, 57);
    ctx.lineTo(8 - stride, 63);
  }, outline, 4);
  strokePath(() => {
    ctx.moveTo(11 - stride, 40);
    ctx.lineTo(12 - stride, 58);
    ctx.lineTo(10 - stride, 64);
  }, outline, 4);
  ctx.shadowColor = red;
  ctx.shadowBlur = 8 * pulse;
  strokePath(() => {
    ctx.moveTo(7 - stride, 63);
    ctx.quadraticCurveTo(4 - stride, 71, 8 - stride, 76);
    ctx.lineTo(11 - stride, 72);
    ctx.lineTo(13 - stride, 77);
    ctx.quadraticCurveTo(18 - stride, 72, 13 - stride, 63);
  }, '#ff5656', 4);
  ctx.shadowBlur = 0;

  // The body is a soft, slightly irregular shell with clean, unmarked plating.
  ctx.beginPath();
  ctx.moveTo(-27, -24);
  ctx.quadraticCurveTo(-22, -33, -13, -32);
  ctx.lineTo(20, -32);
  ctx.quadraticCurveTo(27, -30, 27, -20);
  ctx.lineTo(25, 24);
  ctx.quadraticCurveTo(20, 29, 13, 27);
  ctx.lineTo(-15, 30);
  ctx.quadraticCurveTo(-26, 30, -27, 21);
  ctx.closePath();
  ctx.fillStyle = body;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 4;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // One arm carries the dotted sensor pod; the other ends in a simple claw.
  strokePath(() => {
    ctx.moveTo(-24, -21);
    ctx.lineTo(-38, -23);
    ctx.lineTo(-46, -20);
  }, outline, 5);
  ctx.beginPath();
  ctx.ellipse(-64, -22, 25, 7, 0, 0, Math.PI * 2);
  ctx.fillStyle = shell;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 4;
  ctx.stroke();
  for (let dot = 0; dot < 8; dot += 1) {
    ctx.beginPath();
    ctx.arc(-82 + dot * 5.2, -22, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = outline;
    ctx.fill();
  }
  strokePath(() => {
    ctx.moveTo(23, -23);
    ctx.lineTo(37, -25);
    ctx.quadraticCurveTo(47, -25, 48, -15);
    ctx.lineTo(48, 20);
    ctx.lineTo(44, 30);
    ctx.lineTo(40, 23);
    ctx.lineTo(36, 31);
    ctx.lineTo(33, 22);
    ctx.lineTo(29, 29);
    ctx.lineTo(27, 16);
    ctx.lineTo(28, -5);
    ctx.quadraticCurveTo(27, -17, 23, -23);
  }, outline, 5);

  // Oversized single-eye head with expressive lashes, like the reference sketch.
  ctx.beginPath();
  ctx.moveTo(-31, -38);
  ctx.quadraticCurveTo(-49, -49, -48, -68);
  ctx.quadraticCurveTo(-46, -88, -25, -93);
  ctx.quadraticCurveTo(-3, -102, 18, -95);
  ctx.quadraticCurveTo(43, -91, 48, -74);
  ctx.lineTo(45, -48);
  ctx.quadraticCurveTo(43, -42, 29, -39);
  ctx.closePath();
  ctx.fillStyle = shell;
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 4;
  ctx.stroke();
  strokePath(() => {
    ctx.moveTo(-45, -76);
    ctx.quadraticCurveTo(-49, -65, -44, -58);
  }, red, 4);
  strokePath(() => {
    ctx.moveTo(45, -78);
    ctx.lineTo(43, -58);
  }, red, 4);
  ctx.beginPath();
  ctx.ellipse(0, -69, 19, 10, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(1, -69, 5, 4, 0, 0, Math.PI * 2);
  ctx.fillStyle = outline;
  ctx.fill();
  strokePath(() => {
    ctx.moveTo(-11, -77);
    ctx.lineTo(-19, -82);
    ctx.moveTo(-16, -72);
    ctx.lineTo(-27, -73);
    ctx.moveTo(-14, -64);
    ctx.lineTo(-24, -59);
    ctx.moveTo(-8, -61);
    ctx.lineTo(-14, -53);
    ctx.moveTo(-4, -80);
    ctx.lineTo(-7, -91);
    ctx.moveTo(2, -80);
    ctx.lineTo(3, -94);
    ctx.moveTo(9, -79);
    ctx.lineTo(15, -91);
    ctx.moveTo(15, -75);
    ctx.lineTo(25, -83);
    ctx.moveTo(18, -67);
    ctx.lineTo(31, -68);
    ctx.moveTo(14, -61);
    ctx.lineTo(23, -53);
    ctx.moveTo(5, -59);
    ctx.lineTo(8, -49);
  }, outline, 3);

  ctx.restore();
}

function drawOutlinedPolygon(points, fill, stroke = '#171717', lineWidth = 3) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawEnemy(enemy) {
  const x = enemy.x - state.camera.x + canvas.width / 2;
  const y = enemy.y - state.camera.y + canvas.height / 2;
  const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);

  ctx.save();
  const idleSway = Math.sin(state.time * 3 + enemy.x * 0.02) * 1.5;
  ctx.translate(x, y + idleSway);
  ctx.rotate(angle);
  ctx.shadowColor = enemy.color;
  ctx.shadowBlur = enemy.beamActive ? 18 : 8;

  if (enemy.type === 'sentinel') {
    drawOutlinedPolygon([[-17, -12], [-10, -19], [10, -19], [17, -12], [17, 12], [10, 19], [-10, 19], [-17, 12]], enemy.beamActive ? '#ff8a6b' : enemy.color || '#f8d66d');
    ctx.fillStyle = '#171717';
    ctx.fillRect(-9, -9, 18, 18);
    ctx.fillStyle = enemy.accent || '#fff0b3';
    ctx.fillRect(-5, -5, 10, 10);
    ctx.fillRect(12, -4, 25, 8);
    ctx.fillStyle = '#171717';
    ctx.fillRect(28, -2, 10, 4);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = enemy.beamActive ? '#ff5d4d' : enemy.locked ? 'rgba(255, 122, 89, 0.65)' : 'rgba(255, 122, 89, 0.18)';
    ctx.lineWidth = enemy.beamActive ? 5 : 2;
    ctx.beginPath();
    ctx.moveTo(38, 0);
    ctx.lineTo(300, 0);
    ctx.stroke();
    ctx.fillStyle = enemy.beamActive ? '#ff5d4d' : '#fff0b3';
    ctx.fillRect(-3, -22, 6, 4);
    ctx.fillRect(-3, 18, 6, 4);
  } else {
    if (enemy.type === 'brute') {
      drawOutlinedPolygon([[-23, -12], [-15, -22], [15, -22], [23, -12], [23, 12], [15, 22], [-15, 22], [-23, 12]], enemy.color || '#8ae0ad');
      ctx.fillStyle = enemy.accent || '#d8ffe4';
      ctx.fillRect(-13, -15, 26, 5);
      ctx.fillStyle = '#171717';
      ctx.fillRect(-8, -7, 16, 12);
      ctx.fillStyle = '#d8ffe4';
      ctx.fillRect(-4, -4, 8, 5);
      ctx.fillStyle = '#477d5d';
      ctx.fillRect(-18, 17, 9, 5);
      ctx.fillRect(9, 17, 9, 5);
      ctx.fillStyle = '#171717';
      ctx.fillRect(-20, -4, 4, 8);
      ctx.fillRect(16, -4, 4, 8);
    } else if (enemy.type === 'runner') {
      drawOutlinedPolygon([[-18, -10], [-8, -10], [0, -16], [7, -10], [18, 0], [7, 10], [0, 16], [-8, 10], [-18, 10], [-11, 0]], enemy.color || '#ffb570');
      ctx.fillStyle = '#171717';
      ctx.fillRect(-5, -6, 13, 12);
      ctx.fillStyle = enemy.accent || '#ffd59e';
      ctx.fillRect(1, -3, 10, 6);
      ctx.fillStyle = '#171717';
      ctx.fillRect(-19, -5, 5, 3);
      ctx.fillRect(-19, 2, 5, 3);
    } else {
      drawOutlinedPolygon([[-15, -9], [-9, -16], [7, -16], [15, -7], [15, 7], [7, 16], [-9, 16], [-15, 9]], enemy.color || '#83d5ff');
      ctx.fillStyle = '#171717';
      ctx.fillRect(-5, -7, 12, 14);
      ctx.fillStyle = '#e8fbff';
      ctx.fillRect(0, -4, 6, 8);
      ctx.fillStyle = enemy.accent || '#ff5e57';
      ctx.fillRect(-16, -4, 4, 8);
      ctx.fillRect(14, -3, 5, 6);
      ctx.fillStyle = '#171717';
      ctx.fillRect(-7, -19, 5, 4);
      ctx.fillRect(-7, 15, 5, 4);
    }
  }

  ctx.restore();
}

function drawBullets() {
  for (const bullet of state.bullets) {
    const x = bullet.x - state.camera.x + canvas.width / 2;
    const y = bullet.y - state.camera.y + canvas.height / 2;
    ctx.fillStyle = '#1d1d1d';
    ctx.fillRect(x - 3, y - 3, 6, 6);
  }
}

function drawSlashEffect(effect) {
  const x = effect.x - state.camera.x + canvas.width / 2;
  const y = effect.y - state.camera.y + canvas.height / 2;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(effect.angle);
  ctx.strokeStyle = '#ff7d66';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, effect.range * (1 - effect.life / 0.18), -0.9, 0.9);
  ctx.stroke();
  ctx.restore();
}

function drawParticles() {
  for (const part of state.particles) {
    const x = part.x - state.camera.x + canvas.width / 2;
    const y = part.y - state.camera.y + canvas.height / 2;
    ctx.fillStyle = part.color;
    ctx.fillRect(x, y, part.size, part.size);
  }
}

function drawCutscenePerson(x, y, time, phase, color) {
  const stride = Math.sin(time * 10 + phase) * 5;

  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#242426';
  ctx.beginPath();
  ctx.arc(0, -24, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.fillRect(-7, -16, 14, 20);
  ctx.strokeStyle = '#242426';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-4, 2);
  ctx.lineTo(-7 + stride, 15);
  ctx.moveTo(4, 2);
  ctx.lineTo(7 - stride, 15);
  ctx.moveTo(-5, -11);
  ctx.lineTo(-13, -17 + stride);
  ctx.moveTo(5, -11);
  ctx.lineTo(13, -17 - stride);
  ctx.stroke();
  ctx.restore();
}

function drawCutsceneBot(x, y, time) {
  const bob = Math.sin(time * 5) * 3;

  ctx.save();
  ctx.translate(x, y + bob);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.beginPath();
  ctx.ellipse(0, 18 - bob, 28, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#b8b7b1';
  ctx.fillRect(-20, -25, 36, 35);
  ctx.fillStyle = '#343638';
  ctx.fillRect(-11, -16, 20, 13);
  ctx.fillStyle = '#8be8f2';
  ctx.fillRect(1, -13, 7, 7);
  ctx.fillStyle = '#ff6d6d';
  ctx.fillRect(15, -17, 17, 6);
  ctx.fillStyle = '#3d3d3d';
  ctx.fillRect(-15, 10, 10, 12);
  ctx.fillRect(4, 10, 10, 12);
  ctx.restore();
}

function drawCutscene(elapsed) {
  const progress = Math.min(1, elapsed / 9);
  const portalOpen = Math.min(1, elapsed / 2);
  const portalX = 388;
  const portalWidth = 180 * portalOpen;

  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, '#7b9ba1');
  sky.addColorStop(0.66, '#d6b18b');
  sky.addColorStop(1, '#6c5347');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#596d70';
  for (let i = 0; i < 7; i += 1) {
    const buildingX = 465 + i * 76;
    const buildingHeight = 120 + ((i * 47) % 100);
    ctx.fillRect(buildingX, 330 - buildingHeight, 62, buildingHeight);
    ctx.fillStyle = '#e7c889';
    for (let windowY = 350 - buildingHeight; windowY < 315; windowY += 25) {
      ctx.fillRect(buildingX + 12, windowY, 8, 10);
      ctx.fillRect(buildingX + 38, windowY, 8, 10);
    }
    ctx.fillStyle = '#596d70';
  }

  ctx.fillStyle = '#d5c4a9';
  ctx.fillRect(0, 390, canvas.width, 48);
  ctx.fillStyle = '#4a4542';
  ctx.fillRect(0, 438, canvas.width, 102);
  ctx.fillStyle = '#e6c98c';
  for (let stripeX = 20; stripeX < canvas.width; stripeX += 120) {
    ctx.fillRect(stripeX, 486, 58, 5);
  }

  ctx.fillStyle = '#222a2d';
  ctx.fillRect(0, 0, 320, 390);
  ctx.strokeStyle = 'rgba(103, 230, 239, 0.25)';
  ctx.lineWidth = 1;
  for (let gridX = 0; gridX < 320; gridX += 32) {
    ctx.beginPath();
    ctx.moveTo(gridX, 0);
    ctx.lineTo(gridX, 390);
    ctx.stroke();
  }
  for (let gridY = 0; gridY < 390; gridY += 32) {
    ctx.beginPath();
    ctx.moveTo(0, gridY);
    ctx.lineTo(320, gridY);
    ctx.stroke();
  }

  if (portalOpen > 0) {
    ctx.save();
    ctx.shadowColor = '#7af7ff';
    ctx.shadowBlur = 28;
    ctx.fillStyle = 'rgba(102, 235, 244, 0.28)';
    ctx.fillRect(portalX - portalWidth / 2, 85, portalWidth, 310);
    ctx.strokeStyle = '#a5fbff';
    ctx.lineWidth = 5;
    ctx.strokeRect(portalX - portalWidth / 2, 85, portalWidth, 310);
    ctx.restore();
  }

  for (let i = 0; i < 3; i += 1) {
    const startX = 625 + i * 70;
    const personX = elapsed < 1.2 ? startX : startX + (elapsed - 1.2) * 88;
    drawCutscenePerson(personX, 385, elapsed, i * 1.7, ['#c97852', '#7196a2', '#d4c36e'][i]);
  }

  const botX = 260 + Math.min(1, Math.max(0, (elapsed - 1) / 6)) * 320;
  drawCutsceneBot(botX, 370, elapsed);

  ctx.fillStyle = 'rgba(11, 18, 20, 0.78)';
  ctx.fillRect(24, 22, 460, 48);
  ctx.fillStyle = '#a5fbff';
  ctx.font = 'bold 18px Orbitron, sans-serif';
  ctx.fillText('REALITY LINK // CONNECTED', 42, 53);

  ctx.fillStyle = 'rgba(11, 18, 20, 0.76)';
  ctx.fillRect(24, 456, 520, 54);
  ctx.fillStyle = '#fff0b3';
  ctx.font = '16px Rajdhani, sans-serif';
  ctx.fillText(elapsed < 4 ? 'Firewall breached. Entering the outside world...' : 'Civilians evacuate safely as the bot steps through.', 42, 489);

  if (progress < 1) {
    ctx.fillStyle = `rgba(8, 12, 14, ${Math.max(0, 0.22 - elapsed * 0.08)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (state.cutscene) {
    drawCutscene(state.cutscene.elapsed);
    return;
  }

  drawFloor();
  drawArenaBorder();

  for (const enemy of state.enemies) {
    drawEnemy(enemy);
  }

  drawBullets();
  for (const slash of state.slashEffects) {
    drawSlashEffect(slash);
  }
  drawParticles();
  drawPlayer();
}

function gameLoop(timestamp) {
  const dt = Math.min(0.032, (timestamp - state.lastTime) / 1000 || 0.016);
  state.lastTime = timestamp;

  if (state.running) {
    update(dt);
  }

  if (state.cutscene && !state.cutscene.finished) {
    state.cutscene.elapsed = Math.min(10, state.cutscene.elapsed + dt);
    if (state.cutscene.elapsed >= 10) {
      state.cutscene.finished = true;
      const gameOverTitle = document.querySelector('#gameOver h2');
      if (gameOverTitle) gameOverTitle.textContent = 'You made it out';
      gameOverMessage.textContent = 'Cache: The outside feels bigger than I imagined. Thanks for staying with me.';
      overlay.classList.remove('hidden');
    }
  }

  render();
  requestAnimationFrame(gameLoop);
}

playButton.addEventListener('click', startGame);
restartButton.addEventListener('click', () => {
  startGame();
});
settingsButton.addEventListener('click', () => {
  openSettings();
});
closeSettingsButton.addEventListener('click', () => {
  closeSettings();
});

document.querySelectorAll('.setting-row').forEach((row) => {
  row.addEventListener('click', () => {
    const key = row.dataset.setting;
    if (key === 'noise') {
      settingsState.noise = settingsState.noise === 'Low' ? 'Heavy' : 'Low';
    }
    if (key === 'rust') {
      settingsState.rust = !settingsState.rust;
    }
    if (key === 'scan') {
      settingsState.scan = settingsState.scan === 'On' ? 'Off' : 'On';
    }
    syncSettingsUI();
  });
});

window.addEventListener('keydown', (event) => {
  state.keys[event.code] = true;
});

window.addEventListener('keyup', (event) => {
  state.keys[event.code] = false;
});

canvas.addEventListener('pointermove', (event) => {
  const rect = canvas.getBoundingClientRect();
  state.pointer.x = ((event.clientX - rect.left) / rect.width) * canvas.width;
  state.pointer.y = ((event.clientY - rect.top) / rect.height) * canvas.height;
});

canvas.addEventListener('pointerdown', (event) => {
  if (!state.running) return;
  event.preventDefault();
  if (event.button === 0) {
    state.pointer.primary = true;
  }
  if (event.button === 2) {
    state.pointer.secondary = true;
  }
});

canvas.addEventListener('pointerup', (event) => {
  if (event.button === 0) state.pointer.primary = false;
  if (event.button === 2) state.pointer.secondary = false;
});

canvas.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});

state.camera.x = 0;
state.camera.y = 0;
syncSettingsUI();
resetPlayer();
render();
requestAnimationFrame(gameLoop);
