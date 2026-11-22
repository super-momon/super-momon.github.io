export interface Point {
  x: number;
  y: number;
}

export type TurretUpgrade = "fireRate" | "damage";
export type ResearchCacheReward = "research" | "upgrade";
export type MutationKind = "rapidSpread" | "armored" | "nutrientSeek";
export type ThreatStage = "Seedling" | "Spreading" | "Hyperplasia" | "Invasion" | "Crisis";

export type NutrientState = "available" | "destroyed" | "consumed";

export interface ColonyCell extends Point {
  id: number;
  radius: number;
  health: number;
  maxHealth: number;
  bornAt: number;
}

export interface NutrientNode extends Point {
  id: number;
  radius: number;
  biomass: number;
  health: number;
  maxHealth: number;
  state: NutrientState;
}

export interface ResearchCache extends Point {
  id: number;
  radius: number;
  health: number;
  maxHealth: number;
  rewardResearch: number;
  rewardScale: number;
  rewardType: ResearchCacheReward;
  selectedReward: ResearchCacheReward;
}

export interface ResearchRewardPopup extends Point {
  amount: number;
  bornAt: number;
}

export interface Projectile extends Point {
  targetId: number;
  targetType: "cell" | "node" | "cache";
  damage: number;
}

export interface Simulation {
  turret: Point;
  turretHealth: number;
  turretWallHealth: number;
  origin: Point;
  aimAngle: number;
  damage: number;
  cells: ColonyCell[];
  totalDurabilityAdded: number;
  nodes: NutrientNode[];
  researchCache: ResearchCache | null;
  nextCacheAt: number;
  nextCacheId: number;
  projectiles: Projectile[];
  elapsed: number;
  vitality: number;
  vitalityIntegral: number;
  territoryRatio: number;
  territorySampleTimer: number;
  biomass: number;
  research: number;
  researchRewardPopups: ResearchRewardPopup[];
  nextResearchRewardAt: number;
  cellsDestroyed: number;
  nodesDestroyed: number;
  nodesConsumed: number;
  cachesDestroyed: number;
  cacheUpgradesGranted: number;
  organismGrowthLevel: number;
  mutationActive: boolean;
  mutationKind: MutationKind | null;
  mutationRemaining: number;
  mutationCycleAt: number;
  openingGraceRemaining: number;
  threatStage: ThreatStage;
  growthAccumulator: number;
  organismGenerationStarted: boolean;
  fireCooldown: number;
  priorityNodeId: number | null;
  priorityCacheId: number | null;
  priorityArea: Point | null;
  priorityAreaNodeId: number | null;
  currentCellTargetId: number | null;
  fireRateLevel: number;
  damageLevel: number;
  nextEntityId: number;
  randomSeed: number;
}

export interface TurretStats {
  damage: number;
  fireInterval: number;
  shotsPerSecond: number;
  fireRateLevel: number;
  damageLevel: number;
  nextFireInterval: number;
  nextDamage: number;
  nextFireRateCost: number;
  nextDamageCost: number;
}

export interface ScoreBreakdown {
  survival: number;
  habitat: number;
  suppression: number;
  total: number;
}

export const GAME_RULES = {
  habitatDurability: 1_000,
  organism: {
    cellRadius: 0.004,
    cellDurability: 10,
    armoredCellDurability: 15,
    baseGrowthInterval: 1.2,
    maxGrowthBoost: 2.25,
    mutationBiomassThreshold: 18,
    mutationGrowthBonus: 0.25,
    biomassBasePerSecond: 0.06,
    biomassInfectionPerSecond: 0.45,
    infectionGrowthMultiplier: 1.2,
    maxInfectionGrowthBonus: 0.9,
    biomassGrowthDivisor: 35,
    maxBiomassGrowthBonus: 0.9,
    nutrientGrowthPerConsumedNode: 0.18,
    maxNutrientGrowthBonus: 1.2,
    damageFractionPerSecond: 0.01,
    damageBonusPerConsumedNode: 0.18,
    maxDamageBonus: 1.2,
    contactRadius: 0.016,
    growthTowardNodeChance: 0.35,
    growthTowardTurretWithNodesChance: 0.2,
    growthTowardTurretWithoutNodesChance: 0.3,
    growthTargetWanderRadians: 2.8,
  },
  turret: {
    baseDamage: 0.1,
    baseFireInterval: 0.35,
    projectileSpeed: 0.72,
    targetAreaRadius: 0.075,
    fireRateMultiplier: 0.87,
    damageMultiplier: 1.28,
    upgradeScalingExponent: 0.8,
    fireRateBaseCost: 10,
    damageBaseCost: 16,
    fireRateCostMultiplier: 1.35,
    damageCostMultiplier: 1.45,
  },
  turretWall: {
    durability: 250,
    contactRadius: 0.045,
    repairResearchPerDurability: 0.1,
    emergencyStabilizeCost: 50,
    emergencyStabilizeAmount: 50,
  },
  nutrientNode: {
    count: 5,
    radius: 0.009,
    biomass: 8,
    durability: 400,
    consumptionRate: 40,
    contactBonusPerExtraCell: 0.25,
    maxExtraContacts: 4,
  },
  researchCache: {
    radius: 0.012,
    minDurability: 10,
    maxDurability: 50,
    minResearchReward: 20,
    maxResearchReward: 100,
    rewardScalePerMinute: 1,
    upgradeRewardChance: 0.5,
    firstDelayMin: 12,
    firstDelayRange: 8,
    nextDelayMin: 24,
    nextDelayRange: 16,
  },
  research: {
    perCell: 2,
    perDestroyedNode: 12,
    perSecond: 0.15,
    perActiveNutrientNodePerSecond: 0.75,
  },
  scoring: {
    survivalPerSecond: 2,
    vitalityMultiplier: 100,
    suppressionPerCell: 6,
    suppressionPerNode: 18,
  },
} as const;

const BASE_CELL_RADIUS = GAME_RULES.organism.cellRadius;
const NODE_RADIUS = GAME_RULES.nutrientNode.radius;
const BASE_GROWTH_INTERVAL = GAME_RULES.organism.baseGrowthInterval;
const MUTATION_BIOMASS_THRESHOLD = GAME_RULES.organism.mutationBiomassThreshold;
const BASE_FIRE_INTERVAL = GAME_RULES.turret.baseFireInterval;
export const START_TURRET_DAMAGE = GAME_RULES.turret.baseDamage;
export const TARGET_AREA_RADIUS = GAME_RULES.turret.targetAreaRadius;
const PROJECTILE_SPEED = GAME_RULES.turret.projectileSpeed;
const FIRE_RATE_MULTIPLIER = GAME_RULES.turret.fireRateMultiplier;
const DAMAGE_MULTIPLIER = GAME_RULES.turret.damageMultiplier;
const FIRE_RATE_BASE_COST = GAME_RULES.turret.fireRateBaseCost;
const DAMAGE_BASE_COST = GAME_RULES.turret.damageBaseCost;
const FIRE_RATE_COST_MULTIPLIER = GAME_RULES.turret.fireRateCostMultiplier;
const DAMAGE_COST_MULTIPLIER = GAME_RULES.turret.damageCostMultiplier;
const UPGRADE_SCALING_EXPONENT = GAME_RULES.turret.upgradeScalingExponent;
const RESEARCH_PER_CELL = GAME_RULES.research.perCell;
const RESEARCH_PER_NODE = GAME_RULES.research.perDestroyedNode;
const RESEARCH_PER_SECOND = GAME_RULES.research.perSecond;
const NODE_CONSUMPTION_RATE = GAME_RULES.nutrientNode.consumptionRate;
const CACHE_RADIUS = GAME_RULES.researchCache.radius;
export const RESEARCH_REWARD_POPUP_LIFETIME = 0.9;

export function getResearchCacheRewardScale(elapsedSeconds: number): number {
  const elapsedMinutes = Math.max(0, elapsedSeconds) / 60;
  return 1
    + elapsedMinutes
      * GAME_RULES.researchCache.rewardScalePerMinute;
}

export function createSimulation(
  turret: Point,
  width = 1000,
  height = 600,
): Simulation {
  const origin = randomOrigin();
  return {
    turret,
    turretHealth: GAME_RULES.habitatDurability,
    turretWallHealth: GAME_RULES.turretWall.durability,
    origin,
    aimAngle: Math.atan2((origin.y - turret.y) * height, (origin.x - turret.x) * width),
    damage: START_TURRET_DAMAGE,
    cells: [
      {
        id: 1,
        ...origin,
        radius: BASE_CELL_RADIUS,
        health: GAME_RULES.organism.cellDurability,
        maxHealth: GAME_RULES.organism.cellDurability,
        bornAt: 0,
      },
    ],
    totalDurabilityAdded: 1,
    nodes: createNutrientNodes(origin, turret, width, height),
    researchCache: null,
    nextCacheAt: GAME_RULES.researchCache.firstDelayMin
      + Math.random() * GAME_RULES.researchCache.firstDelayRange,
    nextCacheId: 1001,
    projectiles: [],
    elapsed: 0,
    vitality: 1,
    vitalityIntegral: 0,
    territoryRatio: 0,
    territorySampleTimer: 0,
    biomass: 0,
    research: 0,
    researchRewardPopups: [],
    nextResearchRewardAt: 1,
    cellsDestroyed: 0,
    nodesDestroyed: 0,
    nodesConsumed: 0,
    cachesDestroyed: 0,
    cacheUpgradesGranted: 0,
    organismGrowthLevel: 0,
    mutationActive: false,
    mutationKind: null,
    mutationRemaining: 0,
    mutationCycleAt: GAME_RULES.organism.mutationBiomassThreshold,
    openingGraceRemaining: 8,
    threatStage: "Seedling",
    growthAccumulator: 0,
    organismGenerationStarted: false,
    fireCooldown: 0.3,
    priorityNodeId: null,
    priorityCacheId: null,
    priorityArea: null,
    priorityAreaNodeId: null,
    currentCellTargetId: null,
    fireRateLevel: 0,
    damageLevel: 0,
    nextEntityId: 2,
    randomSeed: Math.floor(Math.random() * 4_294_967_296),
  };
}

export function getTurretStats(simulation: Simulation): TurretStats {
  const fireInterval = getFireInterval(simulation.fireRateLevel);

  return {
    damage: simulation.damage,
    fireInterval,
    shotsPerSecond: 1 / fireInterval,
    fireRateLevel: simulation.fireRateLevel,
    damageLevel: simulation.damageLevel,
    nextFireInterval: getFireInterval(simulation.fireRateLevel + 1),
    nextDamage: getDamageAmount(simulation.damageLevel + 1),
    nextFireRateCost: getUpgradeCost(simulation, "fireRate"),
    nextDamageCost: getUpgradeCost(simulation, "damage"),
  };
}

function getFireInterval(level: number): number {
  const fireRateGrowth = 1 / FIRE_RATE_MULTIPLIER - 1;
  return BASE_FIRE_INTERVAL / (1 + fireRateGrowth * level ** UPGRADE_SCALING_EXPONENT);
}

function getDamageAmount(level: number): number {
  const damageGrowth = DAMAGE_MULTIPLIER - 1;
  return START_TURRET_DAMAGE * (1 + damageGrowth * level ** UPGRADE_SCALING_EXPONENT);
}

export function getUpgradeCost(
  simulation: Simulation,
  feature: TurretUpgrade,
): number {
  const level = feature === "fireRate" ? simulation.fireRateLevel : simulation.damageLevel;
  const baseCost = feature === "fireRate" ? FIRE_RATE_BASE_COST : DAMAGE_BASE_COST;
  const costMultiplier = feature === "fireRate"
    ? FIRE_RATE_COST_MULTIPLIER
    : DAMAGE_COST_MULTIPLIER;
  return Math.min(
    Number.MAX_SAFE_INTEGER,
    Math.ceil(baseCost * costMultiplier ** level),
  );
}

export function getNextUpgradeCost(simulation: Simulation): number {
  const costs = [
    getUpgradeCost(simulation, "fireRate"),
    getUpgradeCost(simulation, "damage"),
  ];
  return Math.min(...costs);
}

export function getAvailableTurretUpgrades(): TurretUpgrade[] {
  return ["fireRate", "damage"];
}

export function purchaseTurretUpgrade(
  simulation: Simulation,
  feature: TurretUpgrade,
): boolean {
  const cost = getUpgradeCost(simulation, feature);
  if (simulation.research < cost) return false;

  simulation.research -= cost;
  return grantTurretUpgrade(simulation, feature);
}

function grantTurretUpgrade(
  simulation: Simulation,
  feature: TurretUpgrade,
): boolean {
  if (feature === "fireRate") {
    simulation.fireRateLevel += 1;
    simulation.fireCooldown = Math.min(
      simulation.fireCooldown,
      getFireInterval(simulation.fireRateLevel),
    );
    return true;
  }

  simulation.damageLevel += 1;
  simulation.damage = getDamageAmount(simulation.damageLevel);
  return true;
}

export function distanceInPixels(
  first: Point,
  second: Point,
  width: number,
  height: number,
): number {
  return Math.hypot((first.x - second.x) * width, (first.y - second.y) * height);
}

export function getArenaInfection(
  simulation: Simulation,
  width: number,
  height: number,
): number {
  if (simulation.cells.length === 0 || width <= 0 || height <= 0) return 0;

  const minDimension = Math.min(width, height);
  const cellArea = simulation.cells.reduce((total, cell) => {
    const side = cell.radius * minDimension * 2;
    return total + side * side;
  }, 0);
  return Math.min(1, cellArea / (width * height));
}

export function getAverageVitality(simulation: Simulation): number {
  if (simulation.elapsed <= 0) return simulation.vitality;
  return simulation.vitalityIntegral / simulation.elapsed;
}

export function getOrganismIntegrity(simulation: Simulation): number {
  if (simulation.totalDurabilityAdded <= 0) return 0;
  const remainingDurability = simulation.cells.reduce(
    (total, cell) => total + Math.max(0, cell.health),
    0,
  );
  return Math.min(1, remainingDurability / simulation.totalDurabilityAdded);
}

export function getOrganismDamageFraction(simulation: Simulation): number {
  const consumedNodeBonus = Math.min(
    simulation.organismGrowthLevel * GAME_RULES.organism.damageBonusPerConsumedNode,
    GAME_RULES.organism.maxDamageBonus,
  );
  return GAME_RULES.organism.damageFractionPerSecond * (1 + consumedNodeBonus);
}

export function getTurretWallRepairCost(simulation: Simulation): number | null {
  const missingDurability = GAME_RULES.turretWall.durability - simulation.turretWallHealth;
  if (missingDurability <= 0) return null;
  return Math.max(
    1,
    Math.ceil(missingDurability * GAME_RULES.turretWall.repairResearchPerDurability),
  );
}

export function repairTurretWall(simulation: Simulation): boolean {
  const cost = getTurretWallRepairCost(simulation);
  if (cost === null || simulation.research < cost) return false;

  simulation.research -= cost;
  simulation.turretWallHealth = GAME_RULES.turretWall.durability;
  return true;
}

export function stabilizeTurretWall(simulation: Simulation): boolean {
  const { emergencyStabilizeCost, emergencyStabilizeAmount } = GAME_RULES.turretWall;
  if (
    simulation.research < emergencyStabilizeCost
    || simulation.turretWallHealth >= GAME_RULES.turretWall.durability
  ) {
    return false;
  }

  simulation.research -= emergencyStabilizeCost;
  simulation.turretWallHealth = Math.min(
    GAME_RULES.turretWall.durability,
    simulation.turretWallHealth + emergencyStabilizeAmount,
  );
  return true;
}

export function setResearchCacheReward(
  simulation: Simulation,
  reward: ResearchCacheReward,
): void {
  if (simulation.researchCache) {
    simulation.researchCache.selectedReward = reward;
  }
}

export function getThreatStage(simulation: Simulation): ThreatStage {
  const wallCritical = simulation.turretWallHealth
    / GAME_RULES.turretWall.durability <= 0.25;

  if (
    wallCritical
    || simulation.cells.length >= 25
    || simulation.elapsed >= 180
  ) {
    return "Crisis";
  }
  if (
    simulation.nodesConsumed > 0
    || isTurretWallUnderAttack(simulation, 1000, 600)
  ) {
    return "Invasion";
  }
  if (
    simulation.mutationActive
    || simulation.biomass >= MUTATION_BIOMASS_THRESHOLD
    || simulation.elapsed >= 75
  ) {
    return "Hyperplasia";
  }
  if (simulation.elapsed >= 30) return "Spreading";
  return "Seedling";
}

export function isTurretWallUnderAttack(
  simulation: Simulation,
  width: number,
  height: number,
): boolean {
  const wallRadius = GAME_RULES.turretWall.contactRadius * Math.min(width, height);
  return simulation.cells.some(
    (cell) => distanceInPixels(cell, simulation.turret, width, height)
      <= wallRadius + cell.radius * Math.min(width, height),
  );
}

export function isTurretUnderAttack(
  simulation: Simulation,
  width: number,
  height: number,
): boolean {
  const contactRadius = GAME_RULES.organism.contactRadius * Math.min(width, height);
  return simulation.cells.some(
    (cell) => distanceInPixels(cell, simulation.turret, width, height)
      <= contactRadius + cell.radius * Math.min(width, height),
  );
}

export function getTurretDamageAmount(
  componentDurability: number,
  damageFraction: number,
): number {
  return componentDurability * damageFraction;
}

export function getScoreBreakdown(simulation: Simulation): ScoreBreakdown {
  const survival = Math.floor(simulation.elapsed * GAME_RULES.scoring.survivalPerSecond);
  const habitat = Math.floor(
    getAverageVitality(simulation) * GAME_RULES.scoring.vitalityMultiplier,
  );
  const suppression = simulation.cellsDestroyed * GAME_RULES.scoring.suppressionPerCell
    + simulation.nodesDestroyed * GAME_RULES.scoring.suppressionPerNode;

  return {
    survival,
    habitat,
    suppression,
    total: survival + habitat + suppression,
  };
}

export function getNodeAtPoint(
  simulation: Simulation,
  point: Point,
  width: number,
  height: number,
): NutrientNode | undefined {
  return simulation.nodes.find((node) => {
    if (node.state !== "available") return false;
    const hitRadius = (node.radius + 0.018) * Math.min(width, height);
    return distanceInPixels(node, point, width, height) <= hitRadius;
  });
}

export function getCellAtPoint(
  simulation: Simulation,
  point: Point,
  width: number,
  height: number,
): ColonyCell | undefined {
  const minDimension = Math.min(width, height);
  return simulation.cells
    .map((cell) => ({
      cell,
      distance: distanceInPixels(cell, point, width, height),
    }))
    .filter(({ cell, distance }) => distance <= (cell.radius * minDimension + 12))
    .sort((first, second) => first.distance - second.distance)[0]?.cell;
}

export function getNearestCellToPoint(
  simulation: Simulation,
  point: Point,
  width: number,
  height: number,
): ColonyCell | undefined {
  return simulation.cells
    .map((cell) => ({
      cell,
      distance: distanceInPixels(cell, point, width, height),
    }))
    .sort((first, second) => first.distance - second.distance)[0]?.cell;
}

export function getResearchCacheAtPoint(
  simulation: Simulation,
  point: Point,
  width: number,
  height: number,
): ResearchCache | undefined {
  const cache = simulation.researchCache;
  if (!cache) return undefined;
  const hitRadius = (cache.radius + 0.02) * Math.min(width, height);
  return distanceInPixels(cache, point, width, height) <= hitRadius ? cache : undefined;
}

export function setPriorityNode(simulation: Simulation, nodeId: number | null): void {
  simulation.priorityNodeId = nodeId;
  simulation.priorityCacheId = null;
}

export function setPriorityCache(simulation: Simulation, cacheId: number | null): void {
  simulation.priorityCacheId = cacheId;
  simulation.priorityNodeId = null;
}

export function setPriorityArea(
  simulation: Simulation,
  area: Point | null,
  sourceNodeId: number | null = null,
): void {
  simulation.priorityArea = area;
  simulation.priorityAreaNodeId = area ? sourceNodeId : null;
  simulation.priorityNodeId = null;
  simulation.priorityCacheId = null;
  simulation.currentCellTargetId = null;
  simulation.projectiles = simulation.projectiles.filter(
    (projectile) => projectile.targetType !== "node",
  );
}

export function getPartsInTargetArea(
  simulation: Simulation,
  width: number,
  height: number,
): number {
  const area = simulation.priorityArea;
  if (!area) return 0;
  const radius = TARGET_AREA_RADIUS * Math.min(width, height);
  return simulation.cells.filter(
    (cell) => isWithinTargetArea(cell, area, radius, width, height),
  ).length;
}

export function getTargetAreaCell(
  simulation: Simulation,
  area: Point,
  width: number,
  height: number,
): ColonyCell | undefined {
  const radius = TARGET_AREA_RADIUS * Math.min(width, height);
  return simulation.cells
    .map((cell) => ({
      cell,
      turretDistance: distanceInPixels(cell, simulation.turret, width, height),
    }))
    .filter(({ cell }) =>
      isWithinTargetArea(cell, area, radius, width, height)
      && getCommittedProjectileDamage(simulation, "cell", cell.id) < cell.health
    )
    .sort((first, second) => first.turretDistance - second.turretDistance)[0]?.cell;
}

function isWithinTargetArea(
  cell: Point,
  area: Point,
  radius: number,
  width: number,
  height: number,
): boolean {
  return Math.abs(cell.x - area.x) * width <= radius
    && Math.abs(cell.y - area.y) * height <= radius;
}

export function advanceSimulation(
  simulation: Simulation,
  deltaSeconds: number,
  width: number,
  height: number,
): void {
  const delta = Math.min(Math.max(deltaSeconds, 0), 0.05);
  if (delta === 0 || simulation.vitality <= 0) return;

  const previousVitality = simulation.vitality;
  simulation.elapsed += delta;
  simulation.openingGraceRemaining = Math.max(0, simulation.openingGraceRemaining - delta);
  const activeNutrientNodes = simulation.nodes.filter(
    (node) => node.state === "available",
  );
  simulation.research += (
    RESEARCH_PER_SECOND
      + activeNutrientNodes.length * GAME_RULES.research.perActiveNutrientNodePerSecond
  ) * delta;
  simulation.researchRewardPopups = simulation.researchRewardPopups.filter(
    (popup) => simulation.elapsed - popup.bornAt < RESEARCH_REWARD_POPUP_LIFETIME,
  );
  while (simulation.elapsed >= simulation.nextResearchRewardAt) {
    activeNutrientNodes.forEach((node) => {
      simulation.researchRewardPopups.push({
        x: node.x,
        y: node.y,
        amount: GAME_RULES.research.perActiveNutrientNodePerSecond,
        bornAt: simulation.elapsed,
      });
    });
    simulation.nextResearchRewardAt += 1;
  }

  if (!simulation.researchCache && simulation.elapsed >= simulation.nextCacheAt) {
    simulation.researchCache = createResearchCache(simulation, width, height);
    simulation.nextCacheAt = Number.POSITIVE_INFINITY;
  }

  simulation.territorySampleTimer += delta;
  if (simulation.territorySampleTimer >= 0.2 || simulation.elapsed <= delta) {
    simulation.territoryRatio = getArenaInfection(simulation, width, height);
    simulation.territorySampleTimer = 0;
  }
  const infection = simulation.territoryRatio;
  simulation.biomass += delta * (
    GAME_RULES.organism.biomassBasePerSecond
      + infection * GAME_RULES.organism.biomassInfectionPerSecond
  );

  if (simulation.openingGraceRemaining <= 0) {
    consumeReachableNodes(simulation, delta, width, height);
  }

  if (simulation.mutationActive) {
    simulation.mutationRemaining = Math.max(0, simulation.mutationRemaining - delta);
    if (simulation.mutationRemaining <= 0) {
      simulation.mutationActive = false;
      simulation.mutationKind = null;
      simulation.mutationCycleAt = simulation.elapsed + 12;
    }
  } else if (
    simulation.elapsed >= simulation.mutationCycleAt
    && simulation.biomass >= MUTATION_BIOMASS_THRESHOLD
  ) {
    const kinds: MutationKind[] = ["rapidSpread", "armored", "nutrientSeek"];
    simulation.mutationKind = kinds[
      Math.floor(simulation.elapsed / 30) % kinds.length
    ];
    simulation.mutationActive = true;
    simulation.mutationRemaining = 18;
  }

  const areaBoost = Math.min(
    infection * GAME_RULES.organism.infectionGrowthMultiplier,
    GAME_RULES.organism.maxInfectionGrowthBonus,
  );
  const biomassBoost = Math.min(
    simulation.biomass / GAME_RULES.organism.biomassGrowthDivisor,
    GAME_RULES.organism.maxBiomassGrowthBonus,
  );
  const mutationBoost = simulation.mutationActive
    ? simulation.mutationKind === "nutrientSeek"
      ? GAME_RULES.organism.mutationGrowthBonus + 0.12
      : GAME_RULES.organism.mutationGrowthBonus
    : 0;
  const nutrientBoost = Math.min(
    simulation.organismGrowthLevel * GAME_RULES.organism.nutrientGrowthPerConsumedNode,
    GAME_RULES.organism.maxNutrientGrowthBonus,
  );
  const growthBoost = Math.min(
    1 + areaBoost + biomassBoost + mutationBoost + nutrientBoost,
    GAME_RULES.organism.maxGrowthBoost,
  );
  const growthInterval = BASE_GROWTH_INTERVAL / growthBoost;

  simulation.growthAccumulator += delta;
  while (
    simulation.cells.length > 0
    && simulation.growthAccumulator >= growthInterval
  ) {
    simulation.growthAccumulator -= growthInterval;
    if (!spawnColonyCell(simulation, width, height)) break;
    simulation.organismGenerationStarted = true;
  }

  simulation.fireCooldown -= delta;
  if (simulation.fireCooldown <= 0) {
    const target = chooseTarget(simulation, width, height);
    if (target) {
      const targetPoint = target.type === "cell"
        ? simulation.cells.find((cell) => cell.id === target.id)
        : target.type === "node"
          ? simulation.nodes.find((node) => node.id === target.id && node.state === "available")
          : simulation.researchCache?.id === target.id
            ? simulation.researchCache
            : undefined;
      if (targetPoint) {
        simulation.aimAngle = Math.atan2(
          (targetPoint.y - simulation.turret.y) * height,
          (targetPoint.x - simulation.turret.x) * width,
        );
      }
      simulation.projectiles.push({
        x: simulation.turret.x,
        y: simulation.turret.y,
        targetId: target.id,
        targetType: target.type,
        damage: simulation.damage,
      });
      simulation.fireCooldown = getFireInterval(simulation.fireRateLevel);
    } else {
      simulation.fireCooldown = 0.16;
    }
  }

  advanceProjectiles(simulation, delta, width, height);

  if (simulation.openingGraceRemaining <= 0) {
    const damagePerSecond = GAME_RULES.habitatDurability
      * getOrganismDamageFraction(simulation);
    if (
      simulation.turretWallHealth > 0
      && isTurretWallUnderAttack(simulation, width, height)
    ) {
      simulation.turretWallHealth = Math.max(
        0,
        simulation.turretWallHealth - damagePerSecond * delta,
      );
    } else if (isTurretUnderAttack(simulation, width, height)) {
      simulation.turretHealth = Math.max(
        0,
        simulation.turretHealth - damagePerSecond * delta,
      );
    }
  }
  simulation.vitality = simulation.turretHealth / GAME_RULES.habitatDurability;
  simulation.vitalityIntegral += (previousVitality + simulation.vitality) * 0.5 * delta;
}

function chooseTarget(
  simulation: Simulation,
  width: number,
  height: number,
): { id: number; type: "cell" | "node" | "cache" } | null {
  if (simulation.researchCache?.id === simulation.priorityCacheId) {
    const committedDamage = getCommittedProjectileDamage(
      simulation,
      "cache",
      simulation.researchCache.id,
    );
    if (committedDamage < simulation.researchCache.health) {
      return { id: simulation.researchCache.id, type: "cache" };
    }
    simulation.priorityCacheId = null;
  }

  const priorityNode = simulation.nodes.find(
    (node) => node.id === simulation.priorityNodeId && node.state === "available",
  );

  if (priorityNode) {
    const committedDamage = getCommittedProjectileDamage(
      simulation,
      "node",
      priorityNode.id,
    );
    if (committedDamage < priorityNode.health) {
      return { id: priorityNode.id, type: "node" };
    }
    simulation.priorityNodeId = null;
  }
  const priorityArea = simulation.priorityArea;
  const currentCellTarget = simulation.cells.find(
    (cell) => cell.id === simulation.currentCellTargetId,
  );
  if (
    currentCellTarget
    && getCommittedProjectileDamage(simulation, "cell", currentCellTarget.id) < currentCellTarget.health
    && (!priorityArea
      || isWithinTargetArea(
        currentCellTarget,
        priorityArea,
        TARGET_AREA_RADIUS * Math.min(width, height),
        width,
        height,
      ))
  ) {
    return { id: currentCellTarget.id, type: "cell" };
  }

  simulation.currentCellTargetId = null;
  if (priorityArea) {
    const areaTarget = getTargetAreaCell(simulation, priorityArea, width, height);
    if (areaTarget) {
      simulation.currentCellTargetId = areaTarget.id;
      return { id: areaTarget.id, type: "cell" };
    }
    return null;
  }

  const nearestCell = simulation.cells
    .map((cell) => ({
      cell,
      distance: distanceInPixels(simulation.turret, cell, width, height),
    }))
    .filter(({ cell }) =>
      getCommittedProjectileDamage(simulation, "cell", cell.id) < cell.health
    )
    .sort((first, second) => first.distance - second.distance)[0]?.cell;

  if (!nearestCell) return null;
  simulation.currentCellTargetId = nearestCell.id;
  return { id: nearestCell.id, type: "cell" };
}

function advanceProjectiles(
  simulation: Simulation,
  delta: number,
  width: number,
  height: number,
): void {
  const minDimension = Math.min(width, height);
  const travelDistance = PROJECTILE_SPEED * minDimension * delta;
  const remainingProjectiles: Projectile[] = [];

  for (const projectile of simulation.projectiles) {
    const target = projectile.targetType === "cell"
      ? simulation.cells.find((cell) => cell.id === projectile.targetId)
      : projectile.targetType === "node"
        ? simulation.nodes.find(
            (node) => node.id === projectile.targetId && node.state === "available",
          )
        : simulation.researchCache?.id === projectile.targetId
          ? simulation.researchCache
          : undefined;

    if (!target) continue;

    const distance = distanceInPixels(projectile, target, width, height);
    const targetRadius = target.radius * minDimension;
    if (distance <= travelDistance + targetRadius) {
      applyProjectileDamage(
        simulation,
        projectile.targetType,
        projectile.targetId,
        projectile.damage,
      );
      continue;
    }

    const ratio = travelDistance / distance;
    projectile.x += (target.x - projectile.x) * ratio;
    projectile.y += (target.y - projectile.y) * ratio;
    remainingProjectiles.push(projectile);
  }

  simulation.projectiles = remainingProjectiles;
}

function applyProjectileDamage(
  simulation: Simulation,
  targetType: Projectile["targetType"],
  targetId: number,
  damage: number,
): void {
  if (targetType === "cell") {
    const cellIndex = simulation.cells.findIndex((cell) => cell.id === targetId);
    if (cellIndex < 0) return;
    const cell = simulation.cells[cellIndex];
    applyDurabilityDamage(cell, damage);
    if (cell.health <= 0) {
      simulation.cells.splice(cellIndex, 1);
      if (simulation.currentCellTargetId === cell.id) {
        simulation.currentCellTargetId = null;
      }
      simulation.cellsDestroyed += 1;
      simulation.research += RESEARCH_PER_CELL;
    }
    if (simulation.fireRateLevel >= 3) {
      const chainCount = simulation.fireRateLevel >= 6 ? 2 : 1;
      const chainDamage = damage * (simulation.fireRateLevel >= 6 ? 0.55 : 0.35);
      const adjacent = simulation.cells
        .filter((candidate) => candidate.id !== targetId)
        .sort((first, second) =>
          distanceInPixels(first, cell, 1000, 600)
            - distanceInPixels(second, cell, 1000, 600)
        )
        .slice(0, chainCount);
      for (const candidate of adjacent) {
        applyDurabilityDamage(candidate, chainDamage);
        if (candidate.health <= 0) {
          const candidateIndex = simulation.cells.findIndex((item) => item.id === candidate.id);
          if (candidateIndex >= 0) {
            simulation.cells.splice(candidateIndex, 1);
            if (simulation.currentCellTargetId === candidate.id) {
              simulation.currentCellTargetId = null;
            }
            simulation.cellsDestroyed += 1;
            simulation.research += RESEARCH_PER_CELL;
          }
        }
      }
    }
    return;
  }

  if (targetType === "node") {
    const node = simulation.nodes.find(
      (candidate) => candidate.id === targetId && candidate.state === "available",
    );
    if (!node) return;
    const siegeDamage = simulation.damageLevel >= 6
      ? damage * 1.5
      : simulation.damageLevel >= 3
        ? damage * 1.25
        : damage;
    applyDurabilityDamage(node, siegeDamage);
    if (node.health <= 0) {
      node.state = "destroyed";
      simulation.nodesDestroyed += 1;
      simulation.research += RESEARCH_PER_NODE;
      if (simulation.priorityNodeId === node.id) simulation.priorityNodeId = null;
    }
    return;
  }

  const cache = simulation.researchCache;
  if (!cache || cache.id !== targetId) return;
  const siegeDamage = simulation.damageLevel >= 6
    ? damage * 1.5
    : simulation.damageLevel >= 3
      ? damage * 1.25
      : damage;
  applyDurabilityDamage(cache, siegeDamage);
  if (cache.health <= 0) {
    if (cache.selectedReward === "upgrade") {
      const availableUpgrades = getAvailableTurretUpgrades();
      if (availableUpgrades.length > 0) {
        const upgrade = availableUpgrades[
          Math.floor(random(simulation) * availableUpgrades.length)
        ];
        grantTurretUpgrade(simulation, upgrade);
        simulation.cacheUpgradesGranted += 1;
      } else {
        simulation.research += cache.rewardResearch;
      }
    } else {
      simulation.research += cache.rewardResearch;
    }
    simulation.cachesDestroyed += 1;
    simulation.nextCacheAt = simulation.elapsed
      + GAME_RULES.researchCache.nextDelayMin
      + Math.random() * GAME_RULES.researchCache.nextDelayRange;
    if (simulation.priorityCacheId === cache.id) simulation.priorityCacheId = null;
    simulation.researchCache = null;
  }
}

function applyDurabilityDamage(
  component: { health: number; maxHealth: number },
  damage: number,
): void {
  component.health = Math.max(
    0,
    component.health - damage,
  );
}

function getCommittedProjectileDamage(
  simulation: Simulation,
  targetType: Projectile["targetType"],
  targetId: number,
): number {
  return simulation.projectiles.reduce(
    (total, projectile) =>
      projectile.targetType === targetType && projectile.targetId === targetId
        ? total + projectile.damage
        : total,
    0,
  );
}

function consumeReachableNodes(
  simulation: Simulation,
  delta: number,
  width: number,
  height: number,
): void {
  const minDimension = Math.min(width, height);

  for (const node of simulation.nodes) {
    if (node.state !== "available") continue;
    let contactCount = 0;
    for (const cell of simulation.cells) {
      const reach = (node.radius + cell.radius * 0.55) * minDimension;
      if (distanceInPixels(cell, node, width, height) <= reach) {
        contactCount += 1;
        if (contactCount >= 5) break;
      }
    }

    if (contactCount > 0) {
      const consumptionRate = NODE_CONSUMPTION_RATE
        * (1 + Math.min(
          contactCount - 1,
          GAME_RULES.nutrientNode.maxExtraContacts,
        ) * GAME_RULES.nutrientNode.contactBonusPerExtraCell);
      const durabilityConsumed = Math.min(node.health, consumptionRate * delta);
      node.health -= durabilityConsumed;
      simulation.biomass += node.biomass * (durabilityConsumed / node.maxHealth);
    }

    if (node.health <= 0) {
      node.state = "consumed";
      simulation.nodesConsumed += 1;
      simulation.organismGrowthLevel += 1;
      if (simulation.priorityNodeId === node.id) simulation.priorityNodeId = null;
    }
  }
}

function spawnColonyCell(simulation: Simulation, width: number, height: number): boolean {
  const minDimension = Math.min(width, height);
  const radius = BASE_CELL_RADIUS * (
    simulation.mutationActive && simulation.mutationKind === "rapidSpread"
      ? 1.12
      : 1
  );
  const targetNodes = simulation.nodes.filter((node) => node.state === "available");
  const bucketSize = Math.max(8, minDimension * radius * 2.2);
  const spatialBuckets = new Map<string, ColonyCell[]>();

  for (const cell of simulation.cells) {
    const bucketX = Math.floor(cell.x * width / bucketSize);
    const bucketY = Math.floor(cell.y * height / bucketSize);
    const bucketKey = `${bucketX}:${bucketY}`;
    const bucket = spatialBuckets.get(bucketKey);
    if (bucket) bucket.push(cell);
    else spatialBuckets.set(bucketKey, [cell]);
  }
  for (let attempt = 0; attempt < 128; attempt += 1) {
    const parentCell = simulation.cells.length > 0
      ? simulation.cells[Math.floor(random(simulation) * simulation.cells.length)]
      : undefined;
    const parent = parentCell ?? simulation.origin;
    let angle = random(simulation) * Math.PI * 2;
    const directionRoll = random(simulation);
    const nutrientDirectionChance = simulation.mutationActive
      && simulation.mutationKind === "nutrientSeek"
      ? 0.55
      : GAME_RULES.organism.growthTowardNodeChance;
    const turretTargetChance = targetNodes.length > 0
      ? GAME_RULES.organism.growthTowardTurretWithNodesChance
      : GAME_RULES.organism.growthTowardTurretWithoutNodesChance;

    if (
      targetNodes.length > 0
      && directionRoll < nutrientDirectionChance
    ) {
      const target = targetNodes.reduce((nearest, candidate) => (
        distanceInPixels(candidate, parent, width, height)
          < distanceInPixels(nearest, parent, width, height)
          ? candidate
          : nearest
      ));
      angle = Math.atan2(
        (target.y - parent.y) * height,
        (target.x - parent.x) * width,
      ) + (random(simulation) - 0.5) * GAME_RULES.organism.growthTargetWanderRadians;
    } else if (
      directionRoll
        < (targetNodes.length > 0
          ? nutrientDirectionChance + turretTargetChance
          : turretTargetChance)
    ) {
      angle = Math.atan2(
        (simulation.turret.y - parent.y) * height,
        (simulation.turret.x - parent.x) * width,
      ) + (random(simulation) - 0.5) * GAME_RULES.organism.growthTargetWanderRadians;
    }

    const offset = minDimension * (radius * (simulation.cells.length > 0 ? 1.8 : 1.2) + random(simulation) * radius);
    const candidate: Point = {
      x: parent.x + Math.cos(angle) * offset / width,
      y: parent.y + Math.sin(angle) * offset / height,
    };

    if (!isInsideHabitat(candidate)) continue;
    const bucketX = Math.floor(candidate.x * width / bucketSize);
    const bucketY = Math.floor(candidate.y * height / bucketSize);
    let overlaps = false;
    for (let offsetX = -1; offsetX <= 1 && !overlaps; offsetX += 1) {
      for (let offsetY = -1; offsetY <= 1 && !overlaps; offsetY += 1) {
        const bucket = spatialBuckets.get(`${bucketX + offsetX}:${bucketY + offsetY}`);
        if (!bucket) continue;
        overlaps = bucket.some((cell) => {
          const requiredGap = (cell.radius + radius) * minDimension * 0.92;
          return distanceInPixels(cell, candidate, width, height) < requiredGap;
        });
      }
    }
    if (overlaps) continue;

    const armored = simulation.mutationActive
      && simulation.mutationKind === "armored";
    const durability = armored
      ? GAME_RULES.organism.armoredCellDurability
      : GAME_RULES.organism.cellDurability;
    simulation.cells.push({
      ...candidate,
      id: simulation.nextEntityId,
      radius,
      health: durability,
      maxHealth: durability,
      bornAt: simulation.elapsed,
    });
    simulation.totalDurabilityAdded += durability;
    simulation.nextEntityId += 1;
    return true;
  }

  const parent = simulation.cells[
    Math.floor(random(simulation) * simulation.cells.length)
  ] ?? simulation.origin;
  const angle = random(simulation) * Math.PI * 2;
  const denseOffset = minDimension * radius * 0.9;
  const candidate: Point = {
    x: Math.min(
      0.98,
      Math.max(0.02, parent.x + Math.cos(angle) * denseOffset / width),
    ),
    y: Math.min(
      0.98,
      Math.max(0.02, parent.y + Math.sin(angle) * denseOffset / height),
    ),
  };
  const armored = simulation.mutationActive
    && simulation.mutationKind === "armored";
  const durability = armored
    ? GAME_RULES.organism.armoredCellDurability
    : GAME_RULES.organism.cellDurability;
  simulation.cells.push({
    ...candidate,
    id: simulation.nextEntityId,
    radius,
    health: durability,
    maxHealth: durability,
    bornAt: simulation.elapsed,
  });
  simulation.totalDurabilityAdded += durability;
  simulation.nextEntityId += 1;
  return true;
}

export function isInsideHabitat(point: Point): boolean {
  return point.x >= 0.02 && point.x <= 0.98 && point.y >= 0.02 && point.y <= 0.98;
}

function randomOrigin(): Point {
  const edge = Math.floor(Math.random() * 4);
  const alongEdge = 0.05 + Math.random() * 0.9;

  if (edge === 0) return { x: alongEdge, y: 0.03 };
  if (edge === 1) return { x: 0.97, y: alongEdge };
  if (edge === 2) return { x: alongEdge, y: 0.97 };
  return { x: 0.03, y: alongEdge };
}

function createNutrientNodes(
  origin: Point,
  turret: Point,
  width: number,
  height: number,
): NutrientNode[] {
  const nodes: NutrientNode[] = [];
  const minDimension = Math.min(width, height);

  for (let index = 0; index < GAME_RULES.nutrientNode.count; index += 1) {
    let position: Point | null = null;
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const candidate = {
        x: 0.06 + Math.random() * 0.88,
        y: 0.06 + Math.random() * 0.88,
      };
      const tooCloseToOrigin = distanceInPixels(candidate, origin, width, height) < minDimension * 0.14;
      const tooCloseToTurret = distanceInPixels(candidate, turret, width, height) < minDimension * 0.09;
      const overlapsNode = nodes.some(
        (node) => distanceInPixels(candidate, node, width, height) < minDimension * 0.12,
      );

      if (!tooCloseToOrigin && !tooCloseToTurret && !overlapsNode) {
        position = candidate;
        break;
      }
    }

    if (!position) {
      const fallbackAngle = (index / 5) * Math.PI * 2;
      position = {
        x: 0.5 + Math.cos(fallbackAngle) * 0.38,
        y: 0.5 + Math.sin(fallbackAngle) * 0.38,
      };
    }

    nodes.push({
      id: 101 + index,
      ...position,
      radius: NODE_RADIUS,
      biomass: GAME_RULES.nutrientNode.biomass,
      health: GAME_RULES.nutrientNode.durability,
      maxHealth: GAME_RULES.nutrientNode.durability,
      state: "available",
    });
  }

  return nodes;
}

function createResearchCache(
  simulation: Simulation,
  width: number,
  height: number,
): ResearchCache {
  const minDimension = Math.min(width, height);
  let position: Point | null = null;

  for (let attempt = 0; attempt < 64; attempt += 1) {
    const candidate = {
      x: 0.04 + Math.random() * 0.92,
      y: 0.04 + Math.random() * 0.92,
    };
    const nearTurret = distanceInPixels(candidate, simulation.turret, width, height) < minDimension * 0.1;
    const nearColony = simulation.cells.some(
      (cell) => distanceInPixels(candidate, cell, width, height) < minDimension * 0.09,
    );
    const nearNode = simulation.nodes.some(
      (node) => node.state === "available"
        && distanceInPixels(candidate, node, width, height) < minDimension * 0.09,
    );

    if (isInsideHabitat(candidate) && !nearTurret && !nearColony && !nearNode) {
      position = candidate;
      break;
    }
  }

  position ??= {
    x: 0.5 + (Math.random() - 0.5) * 0.5,
    y: 0.5 + (Math.random() - 0.5) * 0.5,
  };
  const durability = GAME_RULES.researchCache.minDurability
    + Math.floor(
      Math.random()
        * (GAME_RULES.researchCache.maxDurability
          - GAME_RULES.researchCache.minDurability + 1),
    );
  const rewardScale = getResearchCacheRewardScale(simulation.elapsed);
  const baseReward = GAME_RULES.researchCache.minResearchReward
    + Math.floor(
      Math.random()
        * (GAME_RULES.researchCache.maxResearchReward
          - GAME_RULES.researchCache.minResearchReward + 1),
    );
  const rewardResearch = Math.max(
    1,
    Math.round(baseReward * rewardScale),
  );
  const rewardType = getAvailableTurretUpgrades().length > 0
    && random(simulation) < GAME_RULES.researchCache.upgradeRewardChance
    ? "upgrade"
    : "research";

  return {
    id: simulation.nextCacheId++,
    ...position,
    radius: CACHE_RADIUS,
    health: durability,
    maxHealth: durability,
    rewardResearch,
    rewardScale,
    rewardType,
    selectedReward: rewardType,
  };
}

function random(simulation: Simulation): number {
  simulation.randomSeed = (simulation.randomSeed * 1_664_525 + 1_013_904_223) >>> 0;
  return simulation.randomSeed / 4_294_967_296;
}
