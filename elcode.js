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
const closeSettingsButton = document.getElementById('closeSettingsButton');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const settingsState = {
  noise: 'Low',
  rust: true,
  scan: 'On',
};

const ARENA_HALF_WIDTH = 420;
const ARENA_HALF_HEIGHT = 220;
const ARENA_MIN_X = -ARENA_HALF_WIDTH;
const ARENA_MAX_X = ARENA_HALF_WIDTH;
const ARENA_MIN_Y = -ARENA_HALF_HEIGHT;
const ARENA_MAX_Y = ARENA_HALF_HEIGHT;

const MAX_RUN_LEVELS = 50;

const upgradePool = [
  {
    name: 'Tank Wiki Page',
    positive: '1.05x HP',
    negative: '-0.05x move speed',
    apply: () => {
      player.maxHealth *= 1.05;
      player.health = player.maxHealth;
      player.speed *= 0.95;
    },
  },
  {
    name: 'Faster threads',
    positive: '+0.10x fire rate',
    negative: '-0.08x max HP',
    apply: () => {
      player.maxHealth *= 0.92;
      player.health = Math.min(player.health, player.maxHealth);
      player.fireRateMultiplier = (player.fireRateMultiplier) * 1.1;
    },
  },
  {
    name: 'Glass incased',
    positive: '+0.20x projectile speed',
    negative: '-0.10x shield',
    apply: () => {
      player.bulletSpeedMultiplier = (player.bulletSpeedMultiplier)* 1.2;
      player.maxHealth *= 0.9;
      player.health = Math.min(player.health, player.maxHealth);
    },
  },
  {
    name: 'Angry kernel',
    positive: '+0.20x melee damage',
    negative: '-0.12x max HP',
    apply: () => {
      player.meleeDamageMultiplier = (player.meleeDamageMultiplier) * 1.2;
      player.maxHealth *= 0.88;
      player.health = Math.min(player.health, player.maxHealth);
    },
  },
  {
    name: 'Signal Relay',
    positive: '+0.15x movement speed',
    negative: '-0.05x healing',
    apply: () => {
      player.speed *= 1.15;
      player.healPenalty = true;
    },
  },
  {
    name: 'Overclocked Logic',
    positive: '+0.15x attack damage',
    negative: '-0.09x defense',
    apply: () => {
      player.damageMultiplier = (player.damageMultiplier || 1) * 1.15;
      player.damageReduction = (player.damageReduction || 1) * 0.91;
    },
  },
  {
    name: 'Sealed Battery',
    positive: '+0.12x max HP',
    negative: '-0.10x fire rate',
    apply: () => {
      player.maxHealth *= 1.12;
      player.health = player.maxHealth;
      player.fireRateMultiplier *= 0.9;
    },
  },
  {
    name: 'Crowbar level grip',
    positive: '+0.25x melee range',
    negative: '-0.06x projectile speed',
    apply: () => {
      player.meleeDamageMultiplier *= 1.25;
      player.bulletSpeedMultiplier *= 0.94;
    },
  },
  {
    name: 'Duct Taped armor',
    positive: '+0.08x defense',
    negative: '-0.05x dodge',
    apply: () => {
      player.damageReduction *= 1.08;
      player.speed *= 0.95;
    },
  },
  {
    name: 'Pulse Muzzle',
    positive: '+0.18x bullet damage',
    negative: '-0.08x max HP',
    apply: () => {
      player.damageMultiplier *= 1.18;
      player.maxHealth *= 0.92;
      player.health = Math.min(player.health, player.maxHealth);
    },
  },
  {
    name: 'Sprint Matrix',
    positive: '+0.20x movement speed',
    negative: '-0.08x attack damage',
    apply: () => {
      player.speed *= 1.2;
      player.damageMultiplier *= 0.92;
    },
  },
  {
    name: 'Cold Start',
    positive: '+0.15x fire rate',
    negative: '-0.04x move speed',
    apply: () => {
      player.fireRateMultiplier *= 1.15;
      player.speed *= 0.96;
    },
  },
  {
    name: 'Reinforced Framing',
    positive: '+0.18x HP',
    negative: '-0.06x healing',
    apply: () => {
      player.maxHealth *= 1.18;
      player.health = player.maxHealth;
      player.healPenalty = true;
    },
  },
  {
    name: 'Magnetic Rounds',
    positive: '+0.12x projectile accuracy',
    negative: '-0.10x max HP',
    apply: () => {
      player.damageMultiplier *= 1.12;
      player.maxHealth *= 0.9;
      player.health = Math.min(player.health, player.maxHealth);
    },
  },
  {
    name: 'Apex Hinging',
    positive: '+0.10x mobility',
    negative: '-0.04x defense',
    apply: () => {
      player.speed *= 1.1;
      player.damageReduction *= 0.96;
    },
  },
  {
    name: 'Cindery core',
    positive: '+0.15x melee damage',
    negative: '-0.12x projectile speed',
    apply: () => {
      player.meleeDamageMultiplier *= 1.15;
      player.bulletSpeedMultiplier *= 0.88;
    },
  },
  {
    name: 'Lead filled lungs',
    positive: '+0.10x body mass',
    negative: '-0.07x move speed',
    apply: () => {
      player.maxHealth *= 1.1;
      player.health = player.maxHealth;
      player.speed *= 0.93;
    },
  },
  {
    name: 'Megawatt voltage',
    positive: '+0.18x attack speed',
    negative: '-0.09x defense',
    apply: () => {
      player.fireRateMultiplier *= 1.18;
      player.damageReduction *= 0.91;
    },
  },
  {
    name: 'Target Finder',
    positive: '+0.20x critical hit chance',
    negative: '-0.05x healing',
    apply: () => {
      player.damageMultiplier *= 1.2;
      player.healPenalty = true;
    },
  },
  {
    name: 'Rusted Gear',
    positive: '+0.07x HP',
    negative: '-0.08x movement',
    apply: () => {
      player.maxHealth *= 1.07;
      player.health = player.maxHealth;
      player.speed *= 0.92;
    },
  },
  {
    name: 'Neon Buffer',
    positive: '+0.10x shield',
    negative: '-0.05x attack damage',
    apply: () => {
      player.damageReduction *= 1.1;
      player.damageMultiplier *= 0.95;
    },
  },
  {
    name: 'Combat Laptop',
    positive: '+0.16x fire rate',
    negative: '-0.07x max HP',
    apply: () => {
      player.fireRateMultiplier *= 1.16;
      player.maxHealth *= 0.93;
      player.health = Math.min(player.health, player.maxHealth);
    },
  },
  {
    name: 'Split Reactor',
    positive: '+0.14x damage',
    negative: '-0.10x defense',
    apply: () => {
      player.damageMultiplier *= 1.14;
      player.damageReduction *= 0.9;
    },
  },
  {
    name: 'Backpack Drill',
    positive: '+0.10x melee damage',
    negative: '-0.09x movement',
    apply: () => {
      player.meleeDamageMultiplier *= 1.1;
      player.speed *= 0.91;
    },
  },
  {
    name: 'Mirror Coil',
    positive: '+0.18x projectile speed',
    negative: '-0.08x defense',
    apply: () => {
      player.bulletSpeedMultiplier *= 1.18;
      player.damageReduction *= 0.92;
    },
  },
  {
    name: 'Surgical Wire',
    positive: '+0.12x precision',
    negative: '-0.06x max HP',
    apply: () => {
      player.damageMultiplier *= 1.12;
      player.maxHealth *= 0.94;
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
  slashEffects: [],
  particles: [],
  wave: 1,
  time: 0,
  lastTime: 0,
  camera: { x: 0, y: 0 },
  upgradeOpen: false,
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

const looseBits = {
  panel: 'rusted',
  sparks: ['left', 'right', 'center'],
  noiseLevel: 7,
  weird: { things: 'everywhere', status: 'not tidy' },
};

const randomHelper = (() => {
  let tick = 0;
  return function maybeDoStuff() {
    tick += 1;
    return tick % 2 === 0 ? 'hiss' : 'click';
  };
})();

function clamp ( value, min, max ) {
  return Math.min(max, Math.max(min, value));
}

function clampToArena(entity) {
  const prevX = entity.x;
  const prevY = entity.y;

  if (entity.x < ARENA_MIN_X) {
    entity.x = ARENA_MIN_X;
    if (typeof entity.vx === 'number') entity.vx *= -0.2;
  }
  if (entity.x > ARENA_MAX_X) {
    entity.x = ARENA_MAX_X;
    if (typeof entity.vx === 'number') entity.vx *= -0.2;
  }
  if (entity.y < ARENA_MIN_Y) {
    entity.y = ARENA_MIN_Y;
    if (typeof entity.vy === 'number') entity.vy *= -0.2;
  }
  if (entity.y > ARENA_MAX_Y) {
    entity.y = ARENA_MAX_Y;
    if (typeof entity.vy === 'number') entity.vy *= -0.2;
  }

  if (entity.x === prevX && entity.y === prevY && (entity.x <= ARENA_MIN_X || entity.x >= ARENA_MAX_X || entity.y <= ARENA_MIN_Y || entity.y >= ARENA_MAX_Y)) {
    if (typeof entity.vx === 'number') entity.vx = 0;
    if (typeof entity.vy === 'number') entity.vy = 0;
  }
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
    x: clamp(x, ARENA_MIN_X + 30, ARENA_MAX_X - 30),
    y: clamp(y, ARENA_MIN_Y + 30, ARENA_MAX_Y - 30),
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
  const ramp = Math.pow(1.05, state.wave - 1);
  return Math.max(2, Math.ceil(base * ramp));
}

function resetWave() {
  state.enemies = [];
  const count = getWaveEnemyCount();
  for (let i = 0; i < count; i += 1) {
    spawnEnemy();
  }
  waveText.textContent = String(state.wave);
  healthText.textContent = `Health ${Math.max(0, Math.ceil(player.health))}`;
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

  const noiseState = document.querySelector('[data-setting="noise"] .value');
  const rustState = document.querySelector('[data-setting="rust"] .value');
  const scanState = document.querySelector('[data-setting="scan"] .value');

  if (noiseState) noiseState.textContent = settingsState.noise;
  if (rustState) rustState.textContent = settingsState.rust ? 'On' : 'Off';
  if (scanState) scanState.textContent = settingsState.scan;
}

function openSettings() {
  settingsOverlay.classList.remove('hidden');
}

function closeSettings() {
  settingsOverlay.classList.add('hidden');
}

function startGame() {
  state.wave = 1;
  const gameOverTitle = document.querySelector('#gameOver h2');
  if (gameOverTitle) gameOverTitle.textContent = 'System Down';
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
  if (gameOverTitle) gameOverTitle.textContent = 'System Down';
  overlay.classList.remove('hidden');
}

function showUpgradeChoices() {
  if (state.wave >= MAX_RUN_LEVELS) {
    const gameOverTitle = document.querySelector('#gameOver h2');
    if (gameOverTitle) gameOverTitle.textContent = 'Run Cleared';
    state.running = false;
    state.upgradeOpen = false;
    upgradeOverlay.classList.add('hidden');
    overlay.classList.remove('hidden');
    return;
  }

  state.running = false;
  state.upgradeOpen = true;
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
      state.running = true;
      state.upgradeOpen = false;
      resetWave();
      healthText.textContent = `Health ${Math.max(0, Math.ceil(player.health))}`;
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
        enemy.health -= 1 * player.damageMultiplier;
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

    if (dist < enemy.radius + player.radius + 2 && enemy.hitCooldown <= 0 && enemy.type !== 'sentinel') {
      const damageTaken = 8 / player.damageReduction;
      player.health -= damageTaken;
      player.dmgFlash = 1;
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
      if (state.enemies.length === 0) {
        showUpgradeChoices();
        break;
      }
    }
  }

  healthText.textContent = `Health ${Math.max(0, Math.ceil(player.health))}`;
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
  const x = canvas.width / 2 - ARENA_HALF_WIDTH - 6.7;
  const y = canvas.height / 2 - ARENA_HALF_HEIGHT - 6.7;
  const w = ARENA_HALF_WIDTH * 2 + 12;
  const h = ARENA_HALF_HEIGHT * 2 + 12;

  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 6;
  ctx.strokeRect(x, y, w, h);

  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
}

function drawPlayer() {
  const x = player.x - state.camera.x + canvas.width / 2;
  const y = player.y - state.camera.y + canvas.height / 2;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(player.angle);

  ctx.fillStyle = player.dmgFlash > 0 ? '#ff9b8f' : '#b8b7b1';
  ctx.fillRect(-14, -18, 28, 28);

  ctx.fillStyle = '#1d1c1d';
  ctx.fillRect(-8, -10, 16, 10);

  ctx.fillStyle = '#edfdff';
  ctx.fillRect(-4, -8, 8, 4);

  ctx.fillStyle = '#3d3d3d';
  ctx.fillRect(-18, 12, 8, 14);
  ctx.fillRect(10, 12, 8, 14);

  ctx.fillStyle = '#ff6d6d';
  ctx.fillRect(-4, 10, 8, 8);

  ctx.fillStyle = '#8d8d8d';
  ctx.fillRect(12, -16, 12, 6);
  ctx.fillStyle = '#b4b4b0';
  ctx.fillRect(18, -13, 18, 3);

  ctx.restore();
}

function drawEnemy(enemy) {
  const x = enemy.x - state.camera.x + canvas.width / 2;
  const y = enemy.y - state.camera.y + canvas.height / 2;

  ctx.save();
  ctx.translate(x, y);

  if (enemy.type === 'sentinel') {
    ctx.rotate(enemy.angle);

    if (enemy.beamActive) {
      ctx.shadowColor = '#ff3d3d';
      ctx.shadowBlur = 18;
    }

    ctx.fillStyle = enemy.beamActive ? '#ff8a6b' : enemy.color || '#f8d66d';
    ctx.fillRect(-14, -14, 28, 28);
    ctx.fillStyle = '#111';
    ctx.fillRect(-6, -6, 12, 12);
    ctx.fillStyle = enemy.accent || '#fff0b3';
    ctx.fillRect(8, -3, 20, 6);

    ctx.shadowBlur = 0;
    ctx.strokeStyle = enemy.beamActive ? '#ff5d4d' : 'rgba(255, 122, 89, 0.35)';
    ctx.lineWidth = enemy.beamActive ? 5 : 2;
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(12 + 260, 0);
    ctx.stroke();
  } else {
    ctx.fillStyle = enemy.color || '#83d5ff';
    if (enemy.type === 'brute') {
      ctx.fillRect(-16, -16, 32, 32);
      ctx.fillStyle = '#111';
      ctx.fillRect(-8, -8, 16, 8);
      ctx.fillStyle = enemy.accent || '#d8ffe4';
      ctx.fillRect(-18, 18, 36, 5);
    } else if (enemy.type === 'runner') {
      ctx.fillRect(-10, -12, 20, 24);
      ctx.fillStyle = '#111';
      ctx.fillRect(-6, -6, 12, 6);
      ctx.fillStyle = enemy.accent || '#ffd59e';
      ctx.fillRect(-12, 14, 24, 5);
    } else {
      ctx.fillRect(-10, -12, 20, 24);
      ctx.fillStyle = '#111';
      ctx.fillRect(-6, -6, 12, 6);
      ctx.fillStyle = enemy.accent || '#ff5e57';
      ctx.fillRect(-12, 14, 24, 5);
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

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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
