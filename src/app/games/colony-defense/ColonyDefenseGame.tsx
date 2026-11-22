"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { trackEvent } from "@/lib/analytics";
import {
  advanceSimulation,
  createSimulation,
  distanceInPixels,
  GAME_RULES,
  RESEARCH_REWARD_POPUP_LIFETIME,
  getArenaInfection,
  getAverageVitality,
  getOrganismDamageFraction,
  getPartsInTargetArea,
  getResearchCacheAtPoint,
  getNodeAtPoint,
  getOrganismIntegrity,
  getScoreBreakdown,
  getTargetAreaCell,
  getTurretWallRepairCost,
  getTurretDamageAmount,
  getTurretStats,
  getThreatStage,
  isTurretWallUnderAttack,
  isTurretUnderAttack,
  purchaseTurretUpgrade,
  repairTurretWall,
  stabilizeTurretWall,
  setResearchCacheReward,
  setPriorityNode,
  setPriorityCache,
  setPriorityArea,
  START_TURRET_DAMAGE,
  TARGET_AREA_RADIUS,
  type ColonyCell,
  type MutationKind,
  type NutrientNode,
  type Point,
  type ResearchCache,
  type ScoreBreakdown,
  type Simulation,
  type ThreatStage,
  type TurretUpgrade,
} from "./simulation";
import "./colony-defense.css";

type GamePhase = "intro" | "playing" | "gameover" | "victory";

interface HudSnapshot {
  elapsed: number;
  vitality: number;
  averageVitality: number;
  turretHealth: number;
  turretWallHealth: number;
  turretUnderAttack: boolean;
  turretWallUnderAttack: boolean;
  turretWallRepairCost: number | null;
  score: number;
  biomass: number;
  research: number;
  damage: number;
  fireRateLevel: number;
  damageLevel: number;
  fireInterval: number;
  shotsPerSecond: number;
  nextFireInterval: number;
  nextDamage: number;
  nextFireRateCost: number;
  nextDamageCost: number;
  organismParts: number;
  organismIntegrity: number;
  organismGrowthLevel: number;
  organismDamageFraction: number;
  openingGraceRemaining: number;
  threatStage: ThreatStage;
  mutationKind: MutationKind | null;
  mutationRemaining: number;
  wallCritical: boolean;
  fireRateTrait: string;
  damageTrait: string;
  nodesConsumed: number;
  cachesDestroyed: number;
  cacheUpgradesGranted: number;
  infection: number;
  nodes: NutrientNode[];
  researchCache: ResearchCache | null;
  cacheSecondsToNext: number;
  priorityNodeId: number | null;
  priorityCacheId: number | null;
  priorityArea: Point | null;
  priorityAreaNodeId: number | null;
  priorityAreaParts: number;
  mutationActive: boolean;
  cellsDestroyed: number;
  nodesDestroyed: number;
}

interface RunSummary {
  score: ScoreBreakdown;
  elapsed: number;
  averageVitality: number;
  cellsDestroyed: number;
  nodesDestroyed: number;
  cachesDestroyed: number;
}

const EMPTY_HUD: HudSnapshot = {
  elapsed: 0,
  vitality: 1,
  averageVitality: 1,
  turretHealth: GAME_RULES.habitatDurability,
  turretWallHealth: GAME_RULES.turretWall.durability,
  turretUnderAttack: false,
  turretWallUnderAttack: false,
  turretWallRepairCost: null,
  score: 0,
  biomass: 0,
  research: 0,
  damage: START_TURRET_DAMAGE,
  fireRateLevel: 0,
  damageLevel: 0,
  fireInterval: GAME_RULES.turret.baseFireInterval,
  shotsPerSecond: 1 / GAME_RULES.turret.baseFireInterval,
  nextFireInterval: GAME_RULES.turret.baseFireInterval * GAME_RULES.turret.fireRateMultiplier,
  nextDamage: START_TURRET_DAMAGE * GAME_RULES.turret.damageMultiplier,
  nextFireRateCost: GAME_RULES.turret.fireRateBaseCost,
  nextDamageCost: GAME_RULES.turret.damageBaseCost,
  organismParts: 0,
  organismIntegrity: 0,
  organismGrowthLevel: 0,
  organismDamageFraction: GAME_RULES.organism.damageFractionPerSecond,
  openingGraceRemaining: 0,
  threatStage: "Seedling",
  mutationKind: null,
  mutationRemaining: 0,
  wallCritical: false,
  fireRateTrait: "Standard targeting",
  damageTrait: "Standard damage",
  nodesConsumed: 0,
  cachesDestroyed: 0,
  cacheUpgradesGranted: 0,
  infection: 0,
  nodes: [],
  researchCache: null,
  cacheSecondsToNext: 15,
  priorityNodeId: null,
  priorityCacheId: null,
  priorityArea: null,
  priorityAreaNodeId: null,
  priorityAreaParts: 0,
  mutationActive: false,
  cellsDestroyed: 0,
  nodesDestroyed: 0,
};

const PIXEL_SCALE = 1;

const PREVIEW_CELLS: ColonyCell[] = [
  { id: 1, x: 0.77, y: 0.48, radius: 0.004, health: 10, maxHealth: 10, bornAt: 0 },
  { id: 2, x: 0.82, y: 0.44, radius: 0.004, health: 10, maxHealth: 10, bornAt: 0 },
  { id: 3, x: 0.83, y: 0.53, radius: 0.004, health: 10, maxHealth: 10, bornAt: 0 },
  { id: 4, x: 0.72, y: 0.54, radius: 0.004, health: 10, maxHealth: 10, bornAt: 0 },
  { id: 5, x: 0.74, y: 0.42, radius: 0.004, health: 10, maxHealth: 10, bornAt: 0 },
];

const PREVIEW_NODES: NutrientNode[] = [
  { id: 101, x: 0.31, y: 0.27, radius: 0.009, biomass: 8, health: 400, maxHealth: 400, state: "available" },
  { id: 102, x: 0.53, y: 0.72, radius: 0.009, biomass: 8, health: 400, maxHealth: 400, state: "available" },
  { id: 103, x: 0.7, y: 0.31, radius: 0.009, biomass: 8, health: 400, maxHealth: 400, state: "available" },
];

export default function ColonyDefenseGame() {
  const reduceMotion = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [statsOpen, setStatsOpen] = useState(false);
  const [howToOpen, setHowToOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hud, setHud] = useState<HudSnapshot>(EMPTY_HUD);
  const [summary, setSummary] = useState<RunSummary | null>(null);
  const [notice, setNotice] = useState("");
  const [targetAreaDragging, setTargetAreaDragging] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simulationRef = useRef<Simulation | null>(null);
  const previewSimulationRef = useRef<Simulation | null>(null);
  const targetAreaDragPointerRef = useRef<number | null>(null);
  const targetAreaDragOffsetRef = useRef<Point>({ x: 0, y: 0 });

  useEffect(() => {
    trackEvent("game_visit", { game_name: "colony-defense" });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    if (phase === "intro" && !previewSimulationRef.current) {
      previewSimulationRef.current = createSimulation({ x: 0.5, y: 0.5 });
    }

    let animationFrame = 0;
    let previousFrame = performance.now();
    let lastHudUpdate = 0;
    let completionHandled = false;

    const renderFrame = (now: number) => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const pixelWidth = Math.max(1, Math.floor(width / PIXEL_SCALE));
      const pixelHeight = Math.max(1, Math.floor(height / PIXEL_SCALE));

      if (width > 0 && height > 0) {
        if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
          canvas.width = pixelWidth;
          canvas.height = pixelHeight;
        }

        context.imageSmoothingEnabled = false;
        context.setTransform(1, 0, 0, 1, 0, 0);
        const delta = Math.min((now - previousFrame) / 1000, 0.05);
        const simulation = phase === "intro"
          ? previewSimulationRef.current
          : simulationRef.current;

        if (phase === "playing" && simulation) {
          if (!statsOpen && !howToOpen && !paused) {
            advanceSimulation(simulation, delta, width, height);
          }

          if (simulation.vitality <= 0 && !completionHandled) {
            completionHandled = true;
            setSummary({
              score: getScoreBreakdown(simulation),
              elapsed: simulation.elapsed,
              averageVitality: getAverageVitality(simulation),
              cellsDestroyed: simulation.cellsDestroyed,
              nodesDestroyed: simulation.nodesDestroyed,
              cachesDestroyed: simulation.cachesDestroyed,
            });
            setHud(createHudSnapshot(simulation, width, height));
            setPhase("gameover");
            setNotice("The habitat collapsed. Your run is complete.");
          }

          if (now - lastHudUpdate >= 180) {
            setHud(createHudSnapshot(simulation, width, height));
            lastHudUpdate = now;
          }
        }
        if (phase === "intro" && simulation && !statsOpen) {
          advanceSimulation(simulation, delta * 1.4, width, height);
        }

        drawScene(
          context,
          pixelWidth,
          pixelHeight,
          phase,
          simulation,
          now / 1000,
          reduceMotion,
        );
      }

      previousFrame = now;
      animationFrame = window.requestAnimationFrame(renderFrame);
    };

    animationFrame = window.requestAnimationFrame(renderFrame);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [phase, reduceMotion, statsOpen, howToOpen, paused]);

  const startRun = () => {
    simulationRef.current = null;
    setPaused(false);
    setHowToOpen(false);
    const dimensions = getCanvasDimensions(canvasRef.current);
    const simulation = createSimulation(
      { x: 0.5, y: 0.5 },
      dimensions.width,
      dimensions.height,
    );
    simulationRef.current = simulation;
    setSummary(null);
    setHud(createHudSnapshot(simulation, dimensions.width, dimensions.height));
    setNotice("Turret fixed at the center. A new organism has appeared at the habitat edge.");
    setPhase("playing");
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key.toLowerCase() === "p") {
        if (phase === "playing") {
          event.preventDefault();
          setPaused((current) => !current);
        }
        return;
      }
      if (
        phase !== "playing"
        || paused
        || statsOpen
        || howToOpen
      ) {
        return;
      }

      const simulation = simulationRef.current;
      if (!simulation) return;
      const canvas = canvasRef.current;
      const rect = canvas?.getBoundingClientRect();
      const dimensions = rect
        ? { width: rect.width, height: rect.height }
        : { width: 1000, height: 600 };

      if (event.key.startsWith("Arrow") || ["w", "a", "s", "d"].includes(event.key.toLowerCase())) {
        event.preventDefault();
        const current = simulation.priorityArea ?? { x: 0.5, y: 0.5 };
        const step = event.shiftKey ? 0.09 : 0.035;
        const key = event.key.toLowerCase();
        const next = {
          x: Math.min(0.98, Math.max(0.02,
            current.x + (key === "arrowright" || key === "d" ? step : key === "arrowleft" || key === "a" ? -step : 0))),
          y: Math.min(0.98, Math.max(0.02,
            current.y + (key === "arrowdown" || key === "s" ? step : key === "arrowup" || key === "w" ? -step : 0))),
        };
        setPriorityArea(simulation, next);
        setNotice(`Organism target area moved. ${getPartsInTargetArea(simulation, dimensions.width, dimensions.height)} parts in zone.`);
        setHud(createHudSnapshot(simulation, dimensions.width, dimensions.height));
        return;
      }

      if (/^[1-5]$/.test(event.key)) {
        event.preventDefault();
        const nodeId = 100 + Number(event.key);
        const node = simulation.nodes.find((candidate) =>
          candidate.id === nodeId && candidate.state === "available");
        if (node) {
          const nextTarget = simulation.priorityNodeId === nodeId ? null : nodeId;
          setPriorityNode(simulation, nextTarget);
          setNotice(nextTarget === null
            ? "Nutrient-node priority cleared."
            : `Nutrient node ${event.key} prioritized.`);
          setHud(createHudSnapshot(simulation, dimensions.width, dimensions.height));
        }
        return;
      }

      if (event.key.toLowerCase() === "c" && simulation.researchCache) {
        event.preventDefault();
        setPriorityCache(
          simulation,
          simulation.priorityCacheId === simulation.researchCache.id
            ? null
            : simulation.researchCache.id,
        );
        setNotice("Research cache priority changed.");
        setHud(createHudSnapshot(simulation, dimensions.width, dimensions.height));
        return;
      }

      if (event.key === " ") {
        event.preventDefault();
        setPriorityArea(simulation, null);
        setNotice("Organism target area cleared. Automatic targeting restored.");
        setHud(createHudSnapshot(simulation, dimensions.width, dimensions.height));
        return;
      }

      if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        if (repairTurretWall(simulation)) {
          setNotice("Turret wall repaired to full durability.");
        } else {
          setNotice("Not enough research or the wall is already full.");
        }
        setHud(createHudSnapshot(simulation, dimensions.width, dimensions.height));
        return;
      }

      if (event.key.toLowerCase() === "e") {
        event.preventDefault();
        if (stabilizeTurretWall(simulation)) {
          setNotice("Emergency wall stabilization restored 50 durability.");
        } else {
          setNotice("Wall stabilization requires 50 research and a damaged wall.");
        }
        setHud(createHudSnapshot(simulation, dimensions.width, dimensions.height));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, paused, statsOpen, howToOpen]);

  const pointFromPointer = (event: ReactPointerEvent<HTMLCanvasElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
  };

  const handleCanvasPointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const simulation = simulationRef.current;
    const point = pointFromPointer(event);

    if (phase !== "playing" || !simulation) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const cache = getResearchCacheAtPoint(simulation, point, rect.width, rect.height);
    if (cache) {
      selectPriorityCache(cache.id);
      return;
    }
    const node = getNodeAtPoint(simulation, point, rect.width, rect.height);
    if (node) {
      selectPriorityNode(node.id);
      return;
    }

    const hitTargetArea = simulation.priorityArea
      ? distanceInPixels(
          simulation.priorityArea,
          point,
          rect.width,
          rect.height,
        ) <= TARGET_AREA_RADIUS * Math.min(rect.width, rect.height)
      : false;

    if (hitTargetArea && simulation.priorityArea) {
      targetAreaDragOffsetRef.current = {
        x: point.x - simulation.priorityArea.x,
        y: point.y - simulation.priorityArea.y,
      };
      setPriorityArea(simulation, { ...simulation.priorityArea });
    } else {
      targetAreaDragOffsetRef.current = { x: 0, y: 0 };
      setPriorityArea(simulation, point);
    }
    targetAreaDragPointerRef.current = event.pointerId;
    setTargetAreaDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);

    const areaCenter = simulation.priorityArea;
    const targetCell = areaCenter
      ? getTargetAreaCell(simulation, areaCenter, rect.width, rect.height)
      : undefined;
    if (targetCell) {
      simulation.aimAngle = Math.atan2(
        (targetCell.y - simulation.turret.y) * rect.height,
        (targetCell.x - simulation.turret.x) * rect.width,
      );
      setNotice(hitTargetArea
        ? "Moving the organism target circle."
        : `Organism target circle placed. ${getPartsInTargetArea(simulation, rect.width, rect.height)} parts in zone.`);
    } else {
      setNotice(hitTargetArea
        ? "Moving the organism target circle."
        : "Organism target circle placed.");
    }
    setHud(createHudSnapshot(simulation, rect.width, rect.height));
  };

  const handleCanvasPointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (targetAreaDragPointerRef.current !== event.pointerId) return;

    const simulation = simulationRef.current;
    if (!simulation) return;
    const point = pointFromPointer(event);
    const rect = event.currentTarget.getBoundingClientRect();
    const areaCenter = {
      x: Math.min(1, Math.max(0, point.x - targetAreaDragOffsetRef.current.x)),
      y: Math.min(1, Math.max(0, point.y - targetAreaDragOffsetRef.current.y)),
    };

    setPriorityArea(simulation, areaCenter);
    const targetCell = getTargetAreaCell(simulation, areaCenter, rect.width, rect.height);
    if (targetCell) {
      simulation.aimAngle = Math.atan2(
        (targetCell.y - simulation.turret.y) * rect.height,
        (targetCell.x - simulation.turret.x) * rect.width,
      );
    }
    setHud(createHudSnapshot(simulation, rect.width, rect.height));
  };

  const handleCanvasPointerEnd = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (targetAreaDragPointerRef.current !== event.pointerId) return;
    targetAreaDragPointerRef.current = null;
    targetAreaDragOffsetRef.current = { x: 0, y: 0 };
    setTargetAreaDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const simulation = simulationRef.current;
    const rect = event.currentTarget.getBoundingClientRect();
    if (simulation) {
      setHud(createHudSnapshot(simulation, rect.width, rect.height));
      setNotice(`Organism target area set. ${getPartsInTargetArea(simulation, rect.width, rect.height)} parts in zone.`);
    }
  };

  const selectPriorityNode = (nodeId: number) => {
    const simulation = simulationRef.current;
    if (!simulation) return;

    const nextTarget = simulation.priorityNodeId === nodeId ? null : nodeId;
    setPriorityNode(simulation, nextTarget);
    const node = simulation.nodes.find((candidate) => candidate.id === nodeId);
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    if (nextTarget !== null && node && rect) {
      simulation.aimAngle = Math.atan2(
        (node.y - simulation.turret.y) * rect.height,
        (node.x - simulation.turret.x) * rect.width,
      );
    }

    if (nextTarget === null) {
      setNotice(simulation.priorityArea
        ? "Nutrient-node priority cleared. Returning to the selected organism area."
        : "Automatic targeting restored: the turret is firing at the nearest colony cell.");
    } else {
      setNotice(`Nutrient node ${nodeId - 100} prioritized.`);
    }

    if (rect) setHud(createHudSnapshot(simulation, rect.width, rect.height));
  };

  const selectPriorityCache = (cacheId: number) => {
    const simulation = simulationRef.current;
    if (!simulation) return;

    const nextTarget = simulation.priorityCacheId === cacheId ? null : cacheId;
    setPriorityCache(simulation, nextTarget);
    const cache = simulation.researchCache;
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    if (nextTarget !== null && cache?.id === cacheId && rect) {
      simulation.aimAngle = Math.atan2(
        (cache.y - simulation.turret.y) * rect.height,
        (cache.x - simulation.turret.x) * rect.width,
      );
      setNotice(cache.selectedReward === "upgrade"
        ? "Research cache targeted. Reward: a random turret upgrade."
        : `Research cache targeted. Reward: ${cache.rewardResearch} research.`);
    } else {
      setNotice(simulation.priorityArea
        ? "Research-cache priority cleared. Returning to the selected organism area."
        : "Automatic targeting restored: the turret is firing at the nearest colony cell.");
    }

    if (rect) setHud(createHudSnapshot(simulation, rect.width, rect.height));
  };

  const clearPriorityArea = () => {
    const simulation = simulationRef.current;
    if (!simulation) return;
    setPriorityArea(simulation, null);
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    if (rect) setHud(createHudSnapshot(simulation, rect.width, rect.height));
    setNotice("Organism target area cleared. Automatic targeting restored.");
  };

  const purchaseUpgrade = (feature: TurretUpgrade) => {
    const simulation = simulationRef.current;
    if (!simulation || !purchaseTurretUpgrade(simulation, feature)) return;
    const dimensions = getCanvasDimensions(canvasRef.current);
    setHud(createHudSnapshot(simulation, dimensions.width, dimensions.height));
    setNotice(feature === "fireRate" ? "Fire-rate level increased." : "Damage level increased.");
  };

  const repairWall = () => {
    const simulation = simulationRef.current;
    const repairCost = simulation ? getTurretWallRepairCost(simulation) : null;
    if (!simulation || phase !== "playing" || repairCost === null) return;
    if (!repairTurretWall(simulation)) {
      setNotice(`Not enough research to repair the turret wall. ${repairCost} required.`);
      return;
    }

    const dimensions = getCanvasDimensions(canvasRef.current);
    setHud(createHudSnapshot(simulation, dimensions.width, dimensions.height));
    setNotice(`Turret wall repaired to full durability for ${repairCost} research.`);
  };

  const stabilizeWall = () => {
    const simulation = simulationRef.current;
    if (!simulation || phase !== "playing") return;
    if (!stabilizeTurretWall(simulation)) {
      setNotice("Wall stabilization requires 50 research and a damaged wall.");
      return;
    }
    const dimensions = getCanvasDimensions(canvasRef.current);
    setHud(createHudSnapshot(simulation, dimensions.width, dimensions.height));
    setNotice("Emergency wall stabilization restored 50 durability.");
  };

  const chooseCacheReward = (reward: "research" | "upgrade") => {
    const simulation = simulationRef.current;
    if (!simulation) return;
    setResearchCacheReward(simulation, reward);
    const dimensions = getCanvasDimensions(canvasRef.current);
    setHud(createHudSnapshot(simulation, dimensions.width, dimensions.height));
    setNotice(reward === "upgrade"
      ? "Cache set to grant a random turret upgrade."
      : "Cache set to grant research.");
  };

  const restartRun = () => {
    simulationRef.current = null;
    startRun();
  };

  const availableUpgradeCosts = [hud.nextFireRateCost, hud.nextDamageCost]
  const cheapestUpgradeCost = Math.min(...availableUpgradeCosts);
  const canAffordUpgrade = hud.research >= cheapestUpgradeCost;
  const activeCache = hud.researchCache;
  const activeCacheReward = activeCache?.selectedReward === "upgrade"
    ? "Random turret upgrade"
    : activeCache ? `+${activeCache.rewardResearch} research` : "";
  const canvasLabel =
    "Live pixel habitat. Drag the organism target circle, or select a nutrient node or research cache to prioritize turret fire.";

  return (
    <main className="colony-page dark">
      {phase === "intro" ? (
        <section className="colony-intro" aria-labelledby="colony-title">
          <div className="colony-intro-copy">
            <Link href="/" className="colony-back-link">Back to portfolio</Link>
            <h1 id="colony-title">Colony Defense</h1>
            <p className="colony-lede">
              A fixed turret. A random frontier. Hold the habitat for as long as you can.
            </p>
            <p className="colony-description">
              Direct a fixed turret, deny nutrients, spend research, and hold the habitat until the colony is stopped.
            </p>
            <div className="colony-intro-actions">
              <button type="button" className="colony-primary-button" onClick={startRun}>
                Begin a run
              </button>
              <button
                type="button"
                className="colony-outline-button"
                onClick={() => setHowToOpen(true)}
              >
                How to play
              </button>
              <button
                type="button"
                className="colony-outline-button"
                onClick={() => setStatsOpen(true)}
              >
                Game stats
              </button>
            </div>
            <p className="colony-control-note">
              Drag a target circle across the colony, or select a nutrient node or cache to direct fire.
            </p>
          </div>

          <div className="colony-preview">
            <div className="colony-preview-canvas">
              <canvas ref={canvasRef} aria-hidden="true" />
            </div>
          </div>
        </section>
      ) : (
        <section className="colony-overlay dark" aria-label="Colony Defense game">
          <header className="colony-runbar">
            <Link href="/" className="colony-exit-link">Exit to home</Link>
            <div className="colony-run-title">
              <span className="colony-live-indicator" />
              <span>COLONY DEFENSE</span>
            </div>
            <div className="colony-run-actions">
              <button
                type="button"
                className="colony-run-stats-button"
                onClick={() => setPaused((current) => !current)}
              >
                {paused ? "Resume" : "Pause"}
              </button>
              <button
                type="button"
                className="colony-run-stats-button"
                onClick={() => setStatsOpen(true)}
              >
                Stats
              </button>
              <div className="colony-run-clock">{formatTime(hud.elapsed)}</div>
            </div>
          </header>

          <div className="colony-game-layout">
            <div className="colony-arena-column">
              <div className="colony-arena-topline" aria-live="polite">
                <span>
                  {hud.openingGraceRemaining > 0
                    ? `OPENING GRACE · ${Math.ceil(hud.openingGraceRemaining)}S`
                    : `${hud.threatStage.toUpperCase()} PHASE`}
                </span>
                <span>
                  {hud.wallCritical
                    ? "WALL CRITICAL"
                    : hud.organismParts === 0
                      ? "COLONY SUPPRESSED"
                      : "HABITAT ACTIVE"}
                </span>
              </div>
              <div className="colony-arena-frame">
                <canvas
                  ref={canvasRef}
                  aria-label={canvasLabel}
                  aria-describedby="colony-arena-instructions"
                  tabIndex={0}
                  className={targetAreaDragging ? "is-dragging" : ""}
                  onPointerDown={handleCanvasPointerDown}
                  onPointerMove={handleCanvasPointerMove}
                  onPointerUp={handleCanvasPointerEnd}
                  onPointerCancel={handleCanvasPointerEnd}
                />
              </div>
              <p id="colony-arena-instructions" className="sr-only">
                Drag the organism target circle to move it. Arrow keys or WASD move it. Number keys 1 through 5 select nutrient nodes. C selects a cache. Space clears the target area. R repairs the wall. E stabilizes the wall. P or Escape pauses.
              </p>
            </div>

            <aside className="colony-console" aria-label="Run controls and habitat status">
              {(phase === "gameover" || phase === "victory") && summary ? (
                <div className="colony-results">
                  <h2>{phase === "victory" ? "Colony eradicated" : "Habitat lost"}</h2>
                  <p>
                    {phase === "victory"
                      ? "The organism was cleared completely. The habitat is secure."
                      : "The colony overwhelmed the ecosystem. Every second and every preserved patch counted."}
                  </p>
                  <div className="colony-total-score">
                    <span>RUN SCORE</span>
                    <strong>{summary.score.total.toLocaleString()}</strong>
                  </div>
                  <dl className="colony-score-breakdown">
                    <div><dt>Survival</dt><dd>{summary.score.survival}</dd></div>
                    <div>
                      <dt>Habitat health · {Math.round(summary.averageVitality * 100)}% average</dt>
                      <dd>{summary.score.habitat}</dd>
                    </div>
                    <div><dt>Colony suppression</dt><dd>{summary.score.suppression}</dd></div>
                    <div><dt>Time held</dt><dd>{formatTime(summary.elapsed)}</dd></div>
                    <div><dt>Cells cleared</dt><dd>{summary.cellsDestroyed}</dd></div>
                    <div><dt>Nutrient nodes denied</dt><dd>{summary.nodesDestroyed}</dd></div>
                    <div><dt>Research caches destroyed</dt><dd>{summary.cachesDestroyed}</dd></div>
                  </dl>
                  <button type="button" className="colony-primary-button colony-wide-button" onClick={restartRun}>
                    Try another run
                  </button>
                  <Link href="/" className="colony-secondary-link">Return to portfolio</Link>
                </div>
              ) : (
                <>
                  <div className="colony-vitality">
                    <div className="colony-console-heading">
                      <h2>Habitat vitality</h2>
                      <strong>{Math.ceil(hud.vitality * 100)}%</strong>
                    </div>
                    <div
                      className="colony-vitality-track"
                      role="progressbar"
                      aria-label="Habitat vitality"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.ceil(hud.vitality * 100)}
                    >
                      <span style={{ width: `${Math.max(0, hud.vitality * 100)}%` }} />
                    </div>
                    <div className="colony-vitality-meta">
                      <span>
                        {Math.ceil(hud.turretHealth).toLocaleString()} /{" "}
                        {GAME_RULES.habitatDurability.toLocaleString()} durability
                      </span>
                      <strong className={hud.turretUnderAttack ? "is-under-attack" : ""}>
                        {hud.turretUnderAttack ? "UNDER ATTACK" : "SECURE"}
                      </strong>
                    </div>
                  </div>

                  <div className="colony-turret-wall">
                    <div className="colony-console-heading">
                      <h2>Turret wall</h2>
                      <span>
                        {hud.turretWallUnderAttack
                          ? "UNDER ATTACK"
                          : hud.turretWallHealth <= 0 ? "BREACHED" : "SECURE"}
                      </span>
                    </div>
                    <div
                      className={`colony-wall-track${hud.turretWallHealth <= 0 ? " is-breached" : ""}`}
                      role="progressbar"
                      aria-label="Turret wall durability"
                      aria-valuemin={0}
                      aria-valuemax={GAME_RULES.turretWall.durability}
                      aria-valuenow={Math.max(0, Math.ceil(hud.turretWallHealth))}
                    >
                      <span
                        style={{
                          width: `${Math.min(100, Math.max(0, hud.turretWallHealth / GAME_RULES.turretWall.durability * 100))}%`,
                        }}
                      />
                    </div>
                    <div className="colony-vitality-meta">
                      <span>
                        {Math.ceil(hud.turretWallHealth).toLocaleString()} /{" "}
                        {GAME_RULES.turretWall.durability.toLocaleString()} durability
                      </span>
                      <strong
                        className={
                          hud.turretWallUnderAttack || hud.turretWallHealth <= 0
                            ? "is-under-attack"
                            : ""
                        }
                      >
                        {hud.turretWallUnderAttack
                          ? "ABSORBING CONTACT"
                          : hud.turretWallHealth <= 0 ? "BREACHED" : "PROTECTIVE"}
                      </strong>
                    </div>
                    <p className="colony-console-copy">
                      Absorbs organism damage before habitat health. Repairs cost 0.1 research per missing durability.
                    </p>
                    <button
                      type="button"
                      className="colony-outline-button colony-wide-button"
                      onClick={repairWall}
                      disabled={
                        hud.turretWallRepairCost === null
                        || hud.research < hud.turretWallRepairCost
                      }
                    >
                      {hud.turretWallRepairCost === null
                        ? "Wall at full durability"
                        : `Repair wall · ${hud.turretWallRepairCost} research`}
                    </button>
                    {hud.turretWallHealth < GAME_RULES.turretWall.durability && (
                      <button
                        type="button"
                        className="colony-outline-button colony-wide-button"
                        onClick={stabilizeWall}
                        disabled={
                          hud.research < GAME_RULES.turretWall.emergencyStabilizeCost
                        }
                      >
                        Stabilize +50 · {GAME_RULES.turretWall.emergencyStabilizeCost} research
                      </button>
                    )}
                  </div>

                  <div className="colony-organism-integrity">
                    <div className="colony-console-heading">
                      <h2>Organism integrity</h2>
                      <strong>{Math.ceil(hud.organismIntegrity * 100)}%</strong>
                    </div>
                    <div
                      className="colony-organism-track"
                      role="progressbar"
                      aria-label="Organism integrity"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.ceil(hud.organismIntegrity * 100)}
                    >
                      <span style={{ width: `${Math.max(0, hud.organismIntegrity * 100)}%` }} />
                    </div>
                  </div>

                  <dl className="colony-run-stats">
                    <div><dt>Run score</dt><dd>{hud.score.toLocaleString()}</dd></div>
                    <div><dt>Research</dt><dd>{Math.floor(hud.research)}</dd></div>
                    <div><dt>Colony biomass</dt><dd>{Math.floor(hud.biomass)}</dd></div>
                    <div><dt>Organism parts</dt><dd>{hud.organismParts}</dd></div>
                    <div><dt>Territory</dt><dd>{Math.round(hud.infection * 100)}%</dd></div>
                    <div><dt>Growth level</dt><dd>{hud.organismGrowthLevel}</dd></div>
                    <div><dt>Nodes consumed</dt><dd>{hud.nodesConsumed}</dd></div>
                  </dl>

                  <div className="colony-turret-stats">
                    <div className="colony-console-heading">
                      <h2>Turret stats</h2>
                      <span>DAMAGE / FIRE RATE</span>
                    </div>
                    <dl>
                      <div>
                        <dt>Damage · LV {hud.damageLevel}</dt>
                        <dd>
                          {formatDurability(hud.damage)} damage / hit
                        </dd>
                      </div>
                      <div>
                        <dt>Fire rate · LV {hud.fireRateLevel}</dt>
                        <dd>{hud.shotsPerSecond.toFixed(2)} shots / sec</dd>
                      </div>
                    </dl>
                    <p className="colony-console-copy">
                      <strong>Build:</strong> {hud.damageTrait} · {hud.fireRateTrait}
                    </p>
                  </div>

                  {hud.mutationActive && (
                    <div className="colony-mutation" role="status">
                      <span className="colony-mutation-pulse" />
                      <div>
                        <strong>
                          {hud.mutationKind === "armored"
                            ? "Armored mutation"
                            : hud.mutationKind === "nutrientSeek"
                              ? "Nutrient-seeking mutation"
                              : "Rapid-spread mutation"}
                        </strong>
                        <span>
                          {Math.ceil(hud.mutationRemaining)}s · {" "}
                          {hud.mutationKind === "armored"
                            ? "New parts gain 50% durability."
                            : hud.mutationKind === "nutrientSeek"
                              ? "Growth increasingly targets nutrient nodes."
                              : "Spread size and growth rate increase."}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="colony-target-section">
                    <div className="colony-console-heading">
                      <h2>Organism target area</h2>
                      <span>
                        {hud.priorityAreaNodeId !== null
                          ? `NODE ${hud.priorityAreaNodeId - 100}`
                          : hud.priorityArea === null ? "AUTO" : `${hud.priorityAreaParts} PARTS`}
                      </span>
                    </div>
                    <p className="colony-console-copy">
                      Drag the target circle across the organism to move it. Node and cache priorities can temporarily override it without clearing it.
                    </p>
                    {hud.priorityArea && (
                      <button
                        type="button"
                        className="colony-outline-button colony-wide-button"
                        onClick={clearPriorityArea}
                      >
                        Clear target area
                      </button>
                    )}
                  </div>

                  <div className="colony-target-section">
                    <div className="colony-console-heading">
                      <h2>Nutrient nodes</h2>
                      <span>{hud.nodes.filter((node) => node.state === "available").length} active</span>
                    </div>
                    <p className="colony-console-copy">
                      Prioritize a rich food source to slow biomass growth.
                    </p>
                    <div className="colony-node-list">
                      {hud.nodes.map((node) => {
                        const selected = node.id === hud.priorityNodeId
                          || node.id === hud.priorityAreaNodeId;
                        const nodeLabel = `Node ${node.id - 100}`;

                        return (
                          <button
                            key={node.id}
                            type="button"
                            className={`colony-node-button${selected ? " is-selected" : ""}`}
                            disabled={node.state !== "available"}
                            onClick={() => selectPriorityNode(node.id)}
                            aria-pressed={selected}
                            aria-label={`${nodeLabel}: ${formatDurability(node.health)} of ${formatDurability(node.maxHealth)} durability`}
                          >
                            <span className={`colony-node-dot colony-node-dot--${node.state}`} />
                            <span className="colony-node-name">{nodeLabel}</span>
                            <span className="colony-node-status">
                              {node.state === "available"
                                ? `${selected ? "TARGET" : "READY"} · ${formatDurability(node.health)} HP`
                                : node.state === "destroyed" ? "Denied" : "Consumed"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="colony-cache-section">
                    <div className="colony-console-heading">
                      <h2>Research cache</h2>
                      <span>{activeCache ? "SIGNAL" : `NEXT ${Math.ceil(hud.cacheSecondsToNext)}s`}</span>
                    </div>
                    {activeCache ? (
                      <>
                        <p className="colony-console-copy">
                          {formatDurability(activeCache.health)} / {formatDurability(activeCache.maxHealth)} durability ·
                          {" "}{activeCacheReward} if destroyed.
                          {" "}Reward scale: {activeCache.rewardScale.toFixed(2)}×.
                        </p>
                        <div className="colony-cache-choices" role="group" aria-label="Choose cache reward">
                          <button
                            type="button"
                            className={`colony-node-button${activeCache.selectedReward === "research" ? " is-selected" : ""}`}
                            onClick={() => chooseCacheReward("research")}
                            aria-pressed={activeCache.selectedReward === "research"}
                          >
                            Research · +{activeCache.rewardResearch}
                          </button>
                          <button
                            type="button"
                            className={`colony-node-button${activeCache.selectedReward === "upgrade" ? " is-selected" : ""}`}
                            onClick={() => chooseCacheReward("upgrade")}
                            aria-pressed={activeCache.selectedReward === "upgrade"}
                          >
                            Random upgrade
                          </button>
                        </div>
                        <div
                          className="colony-cache-track"
                          role="progressbar"
                          aria-label="Research cache durability"
                          aria-valuemin={0}
                          aria-valuemax={activeCache.maxHealth}
                          aria-valuenow={Math.max(0, activeCache.health)}
                        >
                          <span
                            style={{
                              width: `${Math.max(0, activeCache.health / activeCache.maxHealth * 100)}%`,
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          className={`colony-node-button colony-cache-button${hud.priorityCacheId === activeCache.id ? " is-selected" : ""}`}
                          onClick={() => selectPriorityCache(activeCache.id)}
                          aria-pressed={hud.priorityCacheId === activeCache.id}
                          aria-label={`Target research cache. ${formatDurability(activeCache.health)} durability. Reward ${activeCacheReward}.`}
                        >
                          <span className="colony-cache-dot" />
                          <span className="colony-node-name">Prioritize cache</span>
                          <span className="colony-node-status">{activeCacheReward}</span>
                        </button>
                      </>
                    ) : (
                      <p className="colony-console-copy">
                        A cache will appear at a random habitat location.
                      </p>
                    )}
                  </div>

                  <div className="colony-upgrade-section">
                    <div className="colony-console-heading">
                      <h2>Turret upgrades</h2>
                      <span>
                        {canAffordUpgrade
                          ? "READY TO BUY"
                          : "COST PREVIEW"}
                      </span>
                    </div>
                    <p className="colony-console-copy">
                      Unlimited levels; scaled gains use a nonlinear power curve while research costs increase.
                    </p>
                    <div className="colony-upgrade-choices">
                      <div className="colony-upgrade-choice">
                        <strong>Fire rate · LV {hud.fireRateLevel}</strong>
                        <p>
                          {hud.fireInterval.toFixed(2)}s → {hud.nextFireInterval.toFixed(2)}s between shots.
                        </p>
                        <button
                          type="button"
                          className="colony-primary-button colony-wide-button"
                          onClick={() => purchaseUpgrade("fireRate")}
                          disabled={hud.research < hud.nextFireRateCost}
                        >
                          Upgrade · {hud.nextFireRateCost} research
                        </button>
                      </div>
                      <div className="colony-upgrade-choice">
                        <strong>Damage · LV {hud.damageLevel}</strong>
                        <p>
                          {formatDurability(hud.damage)} → {formatDurability(hud.nextDamage)} damage / hit.
                        </p>
                        <button
                          type="button"
                          className="colony-primary-button colony-wide-button"
                          onClick={() => purchaseUpgrade("damage")}
                          disabled={hud.research < hud.nextDamageCost}
                        >
                          Upgrade · {hud.nextDamageCost} research
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </aside>
          </div>
          {paused && (
            <div className="colony-pause-overlay" role="dialog" aria-modal="true" aria-label="Game paused">
              <div className="colony-pause-panel">
                <span>SIMULATION PAUSED</span>
                <strong>{formatTime(hud.elapsed)}</strong>
                <button
                  type="button"
                  className="colony-primary-button colony-wide-button"
                  onClick={() => setPaused(false)}
                >
                  Resume run
                </button>
              </div>
            </div>
          )}
          <div className="colony-live-notice" aria-live="polite" aria-atomic="true">{notice}</div>
        </section>
      )}
      <HowToPlayDialog
        isOpen={howToOpen}
        onClose={() => setHowToOpen(false)}
        onBegin={startRun}
      />
      <GameStatsDialog
        isOpen={statsOpen}
        onClose={() => setStatsOpen(false)}
        phase={phase}
        stats={hud}
      />
    </main>
  );
}

interface HowToPlayDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBegin: () => void;
}

function HowToPlayDialog({
  isOpen,
  onClose,
  onBegin,
}: HowToPlayDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    else if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="colony-stats-dialog colony-how-dialog"
      aria-labelledby="colony-how-title"
      onClose={onClose}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="colony-stats-dialog-inner">
        <header className="colony-stats-header">
          <div>
            <h2 id="colony-how-title">How to play</h2>
          </div>
          <button type="button" className="colony-stats-close" onClick={onClose} autoFocus>
            Close
          </button>
        </header>
        <div className="colony-how-grid">
          <section>
            <strong>1 · Direct fire</strong>
            <p>Click or tap the habitat to place a target area. Use arrow keys or WASD to move it.</p>
          </section>
          <section>
            <strong>2 · Deny nutrients</strong>
            <p>Press 1-5 or select a node to stop the colony feeding from that resource.</p>
          </section>
          <section>
            <strong>3 · Choose cache rewards</strong>
            <p>Target a cache with C, then choose research or a random turret upgrade before it is destroyed.</p>
          </section>
          <section>
            <strong>4 · Protect the wall</strong>
            <p>Press R to repair the wall fully or E for a fast 50-durability stabilization.</p>
          </section>
        </div>
        <p className="colony-stats-pause-note">
          P or Escape pauses the run. The first 8 seconds are a preparation grace period.
        </p>
        {isOpen && (
          <button
            type="button"
            className="colony-primary-button colony-wide-button"
            onClick={() => {
              onClose();
              onBegin();
            }}
          >
            Begin a run
          </button>
        )}
      </div>
    </dialog>
  );
}

interface GameStatsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  phase: GamePhase;
  stats: HudSnapshot;
}

function GameStatsDialog({
  isOpen,
  onClose,
  phase,
  stats,
}: GameStatsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const infectionGrowthBonus = Math.min(
    stats.infection * GAME_RULES.organism.infectionGrowthMultiplier,
    GAME_RULES.organism.maxInfectionGrowthBonus,
  );
  const biomassGrowthBonus = Math.min(
    stats.biomass / GAME_RULES.organism.biomassGrowthDivisor,
    GAME_RULES.organism.maxBiomassGrowthBonus,
  );
  const mutationGrowthBonus = stats.mutationActive
    ? GAME_RULES.organism.mutationGrowthBonus
    : 0;
  const nutrientGrowthBonus = Math.min(
    stats.organismGrowthLevel * GAME_RULES.organism.nutrientGrowthPerConsumedNode,
    GAME_RULES.organism.maxNutrientGrowthBonus,
  );
  const growthMultiplier = Math.min(
    1 + infectionGrowthBonus + biomassGrowthBonus
      + mutationGrowthBonus + nutrientGrowthBonus,
    GAME_RULES.organism.maxGrowthBoost,
  );
  const growthInterval = GAME_RULES.organism.baseGrowthInterval / growthMultiplier;
  const damageMultiplier = stats.damage / GAME_RULES.turret.baseDamage;
  const fireRateIncreasePerLevel = (
    1 / GAME_RULES.turret.fireRateMultiplier - 1
  ) / GAME_RULES.turret.baseFireInterval;
  const survivalScore = Math.floor(stats.elapsed * GAME_RULES.scoring.survivalPerSecond);
  const habitatScore = Math.floor(
    stats.averageVitality * GAME_RULES.scoring.vitalityMultiplier,
  );
  const suppressionScore = stats.cellsDestroyed * GAME_RULES.scoring.suppressionPerCell
    + stats.nodesDestroyed * GAME_RULES.scoring.suppressionPerNode;
  const scoreTotal = survivalScore + habitatScore + suppressionScore;
  const activeNutrientNodeCount = stats.nodes.filter(
    (node) => node.state === "available",
  ).length;
  const currentResearchRate = GAME_RULES.research.perSecond
    + activeNutrientNodeCount * GAME_RULES.research.perActiveNutrientNodePerSecond;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="colony-stats-dialog"
      aria-labelledby="colony-stats-title"
      onClose={onClose}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="colony-stats-dialog-inner">
        <header className="colony-stats-header">
          <div>
            <p className="colony-stats-eyebrow">FIELD MANUAL / BALANCE SHEET</p>
            <h2 id="colony-stats-title">Game stats &amp; scaling</h2>
          </div>
          <button
            type="button"
            className="colony-stats-close"
            onClick={onClose}
            autoFocus
            aria-label="Close game stats"
          >
            Close
          </button>
        </header>

        <p className="colony-stats-pause-note">
          The simulation pauses while this panel is open. Close it to resume the run.
        </p>
        <div className="colony-stats-content">
          <section className="colony-stats-section">
            <h3>Live run</h3>
            {phase === "intro" ? (
              <p className="colony-stats-note">Start a run to see live values here.</p>
            ) : (
              <dl className="colony-stats-list">
                <div><dt>Run time</dt><dd>{formatTime(stats.elapsed)}</dd></div>
                <div><dt>Threat stage</dt><dd>{stats.threatStage}</dd></div>
                <div><dt>Opening grace</dt><dd>{stats.openingGraceRemaining > 0 ? `${Math.ceil(stats.openingGraceRemaining)} sec` : "Ended"}</dd></div>
                <div>
                  <dt>Habitat / turret durability</dt>
                  <dd>
                    {Math.ceil(stats.turretHealth).toLocaleString()} /{" "}
                    {GAME_RULES.habitatDurability.toLocaleString()}
                    {" "}({Math.ceil(stats.vitality * 100)}%)
                  </dd>
                </div>
                <div>
                  <dt>Turret wall durability</dt>
                  <dd>
                    {Math.ceil(stats.turretWallHealth).toLocaleString()} /{" "}
                    {GAME_RULES.turretWall.durability.toLocaleString()}
                    {" "}({stats.turretWallUnderAttack ? "under attack" : "active"})
                  </dd>
                </div>
                <div><dt>Turret status</dt><dd>{stats.turretUnderAttack ? "Under attack" : "Secure"}</dd></div>
                <div><dt>Average vitality</dt><dd>{Math.round(stats.averageVitality * 100)}%</dd></div>
                <div><dt>Organism integrity</dt><dd>{Math.round(stats.organismIntegrity * 100)}%</dd></div>
                <div><dt>Territory occupied</dt><dd>{Math.round(stats.infection * 100)}%</dd></div>
                <div><dt>Organism parts / destroyed</dt><dd>{stats.organismParts} / {stats.cellsDestroyed}</dd></div>
                <div><dt>Biomass / research</dt><dd>{stats.biomass.toFixed(1)} / {Math.floor(stats.research)}</dd></div>
                <div><dt>Nutrient nodes consumed / denied</dt><dd>{stats.nodesConsumed} / {stats.nodesDestroyed}</dd></div>
                <div>
                  <dt>Active nodes / research rate</dt>
                  <dd>
                    {activeNutrientNodeCount} / {currentResearchRate.toFixed(1)} / sec
                  </dd>
                </div>
                <div><dt>Research caches destroyed</dt><dd>{stats.cachesDestroyed}</dd></div>
                <div><dt>Cache upgrades granted</dt><dd>{stats.cacheUpgradesGranted}</dd></div>
                <div>
                  <dt>Active cache / next appearance</dt>
                  <dd>
                    {stats.researchCache
                      ? `${formatDurability(stats.researchCache.health)} / ${formatDurability(stats.researchCache.maxHealth)} · ${stats.researchCache.selectedReward === "upgrade" ? "random upgrade" : `${stats.researchCache.rewardResearch} research (${stats.researchCache.rewardScale.toFixed(2)}×)`}`
                      : `${Math.ceil(stats.cacheSecondsToNext)} sec`}
                  </dd>
                </div>
                <div><dt>Current score</dt><dd>{scoreTotal.toLocaleString()}</dd></div>
              </dl>
            )}
          </section>

          <section className="colony-stats-section">
            <h3>Turret wall &amp; habitat damage</h3>
            <dl className="colony-stats-list">
              <div><dt>Maximum turret wall durability</dt><dd>{GAME_RULES.turretWall.durability.toLocaleString()}</dd></div>
              <div><dt>Wall contact radius</dt><dd>{(GAME_RULES.turretWall.contactRadius * 100).toFixed(1)}% of short arena side</dd></div>
              <div><dt>Wall repair cost</dt><dd>{GAME_RULES.turretWall.repairResearchPerDurability.toFixed(2)} research per missing durability</dd></div>
              <div><dt>Maximum habitat durability</dt><dd>{GAME_RULES.habitatDurability.toLocaleString()}</dd></div>
              <div>
                <dt>Damage at a turret breach</dt>
                <dd>
                  {(stats.organismDamageFraction * 100).toFixed(2)}% max durability / sec
                  {" "}({getTurretDamageAmount(
                    GAME_RULES.habitatDurability,
                    stats.organismDamageFraction,
                  ).toFixed(2)} / sec)
                </dd>
              </div>
              <div>
                <dt>Nutrient damage scaling</dt>
                <dd>
                  +{(GAME_RULES.organism.damageBonusPerConsumedNode * 100).toFixed(0)}% per node,
                  {" "}capped at +{(GAME_RULES.organism.maxDamageBonus * 100).toFixed(0)}%
                </dd>
              </div>
              <div>
                <dt>Breach trigger</dt>
                <dd>
                  A colony part reaches the turret
                  {" "}({GAME_RULES.organism.contactRadius.toFixed(3)} × short arena side + part radius)
                </dd>
              </div>
            </dl>
            <p className="colony-stats-note">
              Habitat vitality is current turret durability divided by {GAME_RULES.habitatDurability}.
              {" "}Vitality scoring uses the average durability ratio over the run.
            </p>
          </section>

          <section className="colony-stats-section">
            <h3>Turret damage per hit</h3>
            <p className="colony-stats-note">
              Every turret hit deals {formatDurability(stats.damage)} base damage to organism parts.
              {" "}At damage level 3 or higher, nodes and caches receive 25% piercing bonus; level 6 grants 50%.
            </p>
            <dl className="colony-stats-list">
              <div>
                <dt>Organism part · {GAME_RULES.organism.cellDurability} durability</dt>
                <dd>{formatDurability(stats.damage)} / hit</dd>
              </div>
              <div>
                <dt>Nutrient node · {GAME_RULES.nutrientNode.durability.toLocaleString()} durability</dt>
                <dd>{formatDurability(stats.damage)} / hit</dd>
              </div>
              <div>
                <dt>Research cache · {GAME_RULES.researchCache.minDurability}–{GAME_RULES.researchCache.maxDurability} durability</dt>
                <dd>{formatDurability(stats.damage)} / hit</dd>
              </div>
              <div><dt>Damage level</dt><dd>{stats.damageLevel} · no cap</dd></div>
              <div>
                <dt>Damage scaling</dt>
                <dd>
                  Base × (1 + {((GAME_RULES.turret.damageMultiplier - 1) * 100).toFixed(0)}%
                  {" "}× level<sup>{GAME_RULES.turret.upgradeScalingExponent.toFixed(1)}</sup>)
                </dd>
              </div>
              <div><dt>Fire rate / interval</dt><dd>{stats.shotsPerSecond.toFixed(2)} / sec · {stats.fireInterval.toFixed(3)} sec</dd></div>
              <div>
                <dt>Fire-rate scaling</dt>
                <dd>
                  Base + {fireRateIncreasePerLevel.toFixed(2)} × level
                  <sup>{GAME_RULES.turret.upgradeScalingExponent.toFixed(1)}</sup> shots / sec
                </dd>
              </div>
              <div><dt>Projectile speed</dt><dd>{GAME_RULES.turret.projectileSpeed.toFixed(2)} arena units / sec</dd></div>
              <div><dt>Target-area radius</dt><dd>{(GAME_RULES.turret.targetAreaRadius * 100).toFixed(1)}% of short arena side</dd></div>
            </dl>
          </section>

          <section className="colony-stats-section">
            <h3>Organism growth scaling</h3>
            <dl className="colony-stats-list">
              <div><dt>Base growth interval</dt><dd>{GAME_RULES.organism.baseGrowthInterval.toFixed(2)} sec / part</dd></div>
              <div><dt>Suppression rule</dt><dd>Generation stops when no organism parts remain</dd></div>
              <div>
                <dt>Current effective interval</dt>
                <dd>{phase === "intro" ? "Start a run to calculate" : `${growthInterval.toFixed(3)} sec / part`}</dd>
              </div>
              <div><dt>Growth sources</dt><dd>Every organism part can seed growth independently</dd></div>
              <div><dt>Territory bonus</dt><dd>min(territory × {GAME_RULES.organism.infectionGrowthMultiplier.toFixed(1)}, +{(GAME_RULES.organism.maxInfectionGrowthBonus * 100).toFixed(0)}%)</dd></div>
              <div><dt>Biomass bonus</dt><dd>min(biomass ÷ {GAME_RULES.organism.biomassGrowthDivisor}, +{(GAME_RULES.organism.maxBiomassGrowthBonus * 100).toFixed(0)}%)</dd></div>
              <div><dt>Mutation system</dt><dd>18-second rapid-spread, armored, or nutrient-seeking mutations after escalation thresholds</dd></div>
              <div><dt>Consumed-node bonus</dt><dd>+{(GAME_RULES.organism.nutrientGrowthPerConsumedNode * 100).toFixed(0)}% per node, capped at +{(GAME_RULES.organism.maxNutrientGrowthBonus * 100).toFixed(0)}%</dd></div>
              <div>
                <dt>Growth direction with active nodes</dt>
                <dd>
                  {Math.round(GAME_RULES.organism.growthTowardNodeChance * 100)}% nearest node,
                  {" "}{Math.round(GAME_RULES.organism.growthTowardTurretWithNodesChance * 100)}% turret,
                  {" "}{Math.round((1
                    - GAME_RULES.organism.growthTowardNodeChance
                    - GAME_RULES.organism.growthTowardTurretWithNodesChance) * 100)}% random
                </dd>
              </div>
              <div>
                <dt>Growth direction after nodes are spent</dt>
                <dd>
                  {Math.round(GAME_RULES.organism.growthTowardTurretWithoutNodesChance * 100)}% turret,
                  {" "}{Math.round((1
                    - GAME_RULES.organism.growthTowardTurretWithoutNodesChance) * 100)}% random
                </dd>
              </div>
              <div>
                <dt>Target direction wander</dt>
                <dd>±{(GAME_RULES.organism.growthTargetWanderRadians / 2).toFixed(2)} radians</dd>
              </div>
              <div><dt>Biomass generation</dt><dd>{GAME_RULES.organism.biomassBasePerSecond.toFixed(2)} + {GAME_RULES.organism.biomassInfectionPerSecond.toFixed(2)} × territory / sec</dd></div>
              <div><dt>Current growth multiplier</dt><dd>×{growthMultiplier.toFixed(2)}</dd></div>
            </dl>
          </section>

          <section className="colony-stats-section">
            <h3>Nutrients &amp; research</h3>
            <dl className="colony-stats-list">
              <div><dt>Starting nutrient nodes</dt><dd>{GAME_RULES.nutrientNode.count}</dd></div>
              <div><dt>Node durability / biomass</dt><dd>{GAME_RULES.nutrientNode.durability.toLocaleString()} / {GAME_RULES.nutrientNode.biomass}</dd></div>
              <div><dt>Organism consumption rate</dt><dd>{GAME_RULES.nutrientNode.consumptionRate} durability / sec</dd></div>
              <div><dt>Multi-part consumption bonus</dt><dd>+{(GAME_RULES.nutrientNode.contactBonusPerExtraCell * 100).toFixed(0)}% per extra part, up to {GAME_RULES.nutrientNode.maxExtraContacts} extra parts</dd></div>
              <div><dt>Passive research</dt><dd>{GAME_RULES.research.perSecond.toFixed(2)} / sec</dd></div>
              <div><dt>Active nutrient node income</dt><dd>+{GAME_RULES.research.perActiveNutrientNodePerSecond.toFixed(2)} / active node / sec</dd></div>
              <div><dt>Destroy an organism part</dt><dd>+{GAME_RULES.research.perCell} research</dd></div>
              <div><dt>Destroy a nutrient node</dt><dd>+{GAME_RULES.research.perDestroyedNode} research</dd></div>
            </dl>
          </section>

          <section className="colony-stats-section">
            <h3>Research caches &amp; upgrades</h3>
            <dl className="colony-stats-list">
              <div><dt>Cache durability</dt><dd>{GAME_RULES.researchCache.minDurability}–{GAME_RULES.researchCache.maxDurability}</dd></div>
              <div>
                <dt>Research reward</dt>
                <dd>
                  {GAME_RULES.researchCache.minResearchReward}–{GAME_RULES.researchCache.maxResearchReward}
                  {" "}× (1 + elapsed minutes)
                </dd>
              </div>
              <div>
                <dt>Cache reward split</dt>
                <dd>
                  {(GAME_RULES.researchCache.upgradeRewardChance * 100).toFixed(0)}% random upgrade /
                  {" "}{(100 - GAME_RULES.researchCache.upgradeRewardChance * 100).toFixed(0)}% research
                </dd>
              </div>
              <div><dt>Upgrade cache reward</dt><dd>+1 random fire-rate or damage level</dd></div>
              <div><dt>First / next cache timing</dt><dd>{GAME_RULES.researchCache.firstDelayMin}–{GAME_RULES.researchCache.firstDelayMin + GAME_RULES.researchCache.firstDelayRange} sec / {GAME_RULES.researchCache.nextDelayMin}–{GAME_RULES.researchCache.nextDelayMin + GAME_RULES.researchCache.nextDelayRange} sec</dd></div>
              <div><dt>Fire-rate upgrade cost</dt><dd>{GAME_RULES.turret.fireRateBaseCost} × {GAME_RULES.turret.fireRateCostMultiplier.toFixed(2)}<sup>level</sup> research</dd></div>
              <div><dt>Damage upgrade cost</dt><dd>{GAME_RULES.turret.damageBaseCost} × {GAME_RULES.turret.damageCostMultiplier.toFixed(2)}<sup>level</sup> research</dd></div>
            </dl>
          </section>

          <section className="colony-stats-section">
            <h3>Score calculation</h3>
            <dl className="colony-stats-list">
              <div><dt>Survival</dt><dd>⌊seconds × {GAME_RULES.scoring.survivalPerSecond}⌋</dd></div>
              <div><dt>Habitat</dt><dd>⌊average vitality × {GAME_RULES.scoring.vitalityMultiplier}⌋</dd></div>
              <div><dt>Suppression</dt><dd>{GAME_RULES.scoring.suppressionPerCell} per cell + {GAME_RULES.scoring.suppressionPerNode} per denied node</dd></div>
              <div><dt>Current breakdown</dt><dd>{survivalScore} + {habitatScore} + {suppressionScore} = {scoreTotal}</dd></div>
            </dl>
          </section>
        </div>
      </div>
    </dialog>
  );
}

function createHudSnapshot(
  simulation: Simulation,
  width: number,
  height: number,
): HudSnapshot {
  const turretStats = getTurretStats(simulation);
  return {
    elapsed: simulation.elapsed,
    vitality: simulation.vitality,
    averageVitality: getAverageVitality(simulation),
    turretHealth: simulation.turretHealth,
    turretWallHealth: simulation.turretWallHealth,
    turretUnderAttack: isTurretUnderAttack(simulation, width, height),
    turretWallUnderAttack: simulation.turretWallHealth > 0
      && isTurretWallUnderAttack(simulation, width, height),
    turretWallRepairCost: getTurretWallRepairCost(simulation),
    score: getScoreBreakdown(simulation).total,
    biomass: simulation.biomass,
    research: simulation.research,
    damage: turretStats.damage,
    fireRateLevel: turretStats.fireRateLevel,
    damageLevel: turretStats.damageLevel,
    fireInterval: turretStats.fireInterval,
    shotsPerSecond: turretStats.shotsPerSecond,
    nextFireInterval: turretStats.nextFireInterval,
    nextDamage: turretStats.nextDamage,
    nextFireRateCost: turretStats.nextFireRateCost,
    nextDamageCost: turretStats.nextDamageCost,
    organismParts: simulation.cells.length,
    organismIntegrity: getOrganismIntegrity(simulation),
    organismGrowthLevel: simulation.organismGrowthLevel,
    organismDamageFraction: getOrganismDamageFraction(simulation),
    openingGraceRemaining: simulation.openingGraceRemaining,
    threatStage: getThreatStage(simulation),
    mutationKind: simulation.mutationKind,
    mutationRemaining: simulation.mutationRemaining,
    wallCritical: simulation.turretWallHealth
      / GAME_RULES.turretWall.durability <= 0.25,
    fireRateTrait: simulation.fireRateLevel >= 6
      ? "Pulse chain ×2"
      : simulation.fireRateLevel >= 3
        ? "Pulse chain ×1"
        : "Standard targeting",
    damageTrait: simulation.damageLevel >= 6
      ? "Siege piercing 50%"
      : simulation.damageLevel >= 3
        ? "Siege piercing 25%"
        : "Standard damage",
    nodesConsumed: simulation.nodesConsumed,
    infection: getArenaInfection(simulation, width, height),
    nodes: simulation.nodes.map((node) => ({ ...node })),
    researchCache: simulation.researchCache ? { ...simulation.researchCache } : null,
    cacheSecondsToNext: Math.max(0, simulation.nextCacheAt - simulation.elapsed),
    priorityNodeId: simulation.priorityNodeId,
    priorityCacheId: simulation.priorityCacheId,
    priorityArea: simulation.priorityArea ? { ...simulation.priorityArea } : null,
    priorityAreaNodeId: simulation.priorityAreaNodeId,
    priorityAreaParts: getPartsInTargetArea(simulation, width, height),
    mutationActive: simulation.mutationActive,
    cellsDestroyed: simulation.cellsDestroyed,
    nodesDestroyed: simulation.nodesDestroyed,
    cachesDestroyed: simulation.cachesDestroyed,
    cacheUpgradesGranted: simulation.cacheUpgradesGranted,
  };
}

function drawScene(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  phase: GamePhase,
  simulation: Simulation | null,
  time: number,
  reduceMotion: boolean,
): void {
  const minDimension = Math.min(width, height);
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#080d0a";
  context.fillRect(0, 0, width, height);

  const ground = context.createRadialGradient(
    width * 0.45,
    height * 0.43,
    minDimension * 0.04,
    width * 0.5,
    height * 0.5,
    minDimension * 0.72,
  );
  ground.addColorStop(0, "#15221a");
  ground.addColorStop(0.58, "#0d1712");
  ground.addColorStop(1, "#080d0a");
  context.fillStyle = ground;
  context.fillRect(0, 0, width, height);

  for (let index = 0; index < 38; index += 1) {
    const x = pseudoRandom(index * 17 + 3) * width;
    const y = pseudoRandom(index * 29 + 11) * height;
    const radius = 1 + pseudoRandom(index * 7 + 4) * 2.2;
    context.beginPath();
    context.fillStyle = `rgba(130, 170, 140, ${0.06 + pseudoRandom(index * 9 + 1) * 0.1})`;
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  drawVeins(context, width, height);

  const cells = simulation?.cells ?? PREVIEW_CELLS;
  const nodes = simulation?.nodes ?? PREVIEW_NODES;
  const turret = simulation?.turret ?? { x: 0.5, y: 0.5 };
  const aimAngle = simulation?.aimAngle ?? 0;
  const mutationActive = simulation?.mutationActive ?? false;

  const visualTime = reduceMotion ? 0 : simulation?.elapsed ?? time;
  drawColony(
    context,
    cells,
    width,
    height,
    visualTime,
    mutationActive,
  );
  drawNutrients(context, nodes, width, height, visualTime, simulation?.priorityNodeId ?? null);

  if (simulation) {
    drawResearchRewardPopups(context, simulation, width, height, reduceMotion);
    drawProjectiles(context, simulation, width, height);
    if (simulation.researchCache) {
      drawResearchCache(
        context,
        simulation.researchCache,
        width,
        height,
        simulation.priorityCacheId === simulation.researchCache.id,
      );
    }
  }

  if (simulation?.priorityArea) {
    const areaRadius = TARGET_AREA_RADIUS * minDimension;
    context.save();
    context.beginPath();
    context.arc(
      simulation.priorityArea.x * width,
      simulation.priorityArea.y * height,
      areaRadius,
      0,
      Math.PI * 2,
    );
    context.fillStyle = "rgba(255, 244, 205, 0.08)";
    context.fill();
    context.strokeStyle = "#fff4cd";
    context.lineWidth = 2;
    context.setLineDash([7, 5]);
    context.stroke();
    context.setLineDash([]);
    context.beginPath();
    context.arc(
      simulation.priorityArea.x * width,
      simulation.priorityArea.y * height,
      Math.max(3, areaRadius * 0.045),
      0,
      Math.PI * 2,
    );
    context.fillStyle = "#fff4cd";
    context.fill();
    context.restore();
  }

  if (simulation) {
    const target = simulation.priorityCacheId !== null
      ? simulation.researchCache?.id === simulation.priorityCacheId
        ? simulation.researchCache
        : undefined
      : simulation.priorityNodeId !== null
        ? simulation.nodes.find((node) => node.id === simulation.priorityNodeId && node.state === "available")
        : simulation.currentCellTargetId !== null
          ? simulation.cells.find((cell) => cell.id === simulation.currentCellTargetId)
          : simulation.priorityArea !== null
          ? getTargetAreaCell(simulation, simulation.priorityArea, width, height)
          : simulation.cells
          .map((cell) => ({
            cell,
            distance: distanceInPixels(simulation.turret, cell, width, height),
          }))
          .sort((first, second) => first.distance - second.distance)[0]?.cell;

    if (target) {
      context.beginPath();
      context.moveTo(simulation.turret.x * width, simulation.turret.y * height);
      context.lineTo(target.x * width, target.y * height);
      context.strokeStyle = "rgba(8, 202, 95, 0.2)";
      context.lineWidth = 1;
      context.setLineDash([3, 8]);
      context.stroke();
      context.setLineDash([]);
    }
  }

  drawTurretWall(
    context,
    turret,
    width,
    height,
    simulation?.turretWallHealth ?? GAME_RULES.turretWall.durability,
  );
  drawTurret(
    context,
    turret,
    width,
    height,
    phase === "playing" || phase === "gameover" || phase === "victory",
    aimAngle,
  );
}

function getCanvasDimensions(canvas: HTMLCanvasElement | null): { width: number; height: number } {
  const rect = canvas?.getBoundingClientRect();
  if (!rect || rect.width <= 0 || rect.height <= 0) return { width: 1000, height: 600 };
  return { width: rect.width, height: rect.height };
}

function drawVeins(context: CanvasRenderingContext2D, width: number, height: number): void {
  context.save();
  context.globalAlpha = 0.17;
  context.strokeStyle = "#536d59";
  context.lineWidth = 1;

  const paths = [
    [0.08, 0.3, 0.3, 0.22, 0.34, 0.46, 0.57, 0.39],
    [0.4, 0.92, 0.48, 0.67, 0.66, 0.76, 0.91, 0.45],
    [0.14, 0.7, 0.32, 0.55, 0.38, 0.78, 0.57, 0.89],
    [0.62, 0.12, 0.69, 0.32, 0.82, 0.21, 0.94, 0.34],
  ];

  for (const [x1, y1, c1x, c1y, c2x, c2y, x2, y2] of paths) {
    context.beginPath();
    context.moveTo(x1 * width, y1 * height);
    context.bezierCurveTo(
      c1x * width,
      c1y * height,
      c2x * width,
      c2y * height,
      x2 * width,
      y2 * height,
    );
    context.stroke();
  }
  context.restore();
}

function drawColony(
  context: CanvasRenderingContext2D,
  cells: ColonyCell[],
  width: number,
  height: number,
  time: number,
  mutationActive: boolean,
): void {
  const minDimension = Math.min(width, height);
  context.save();

  cells.forEach((cell) => {
    const age = Math.max(0, time - cell.bornAt);
    const growthStep = age < 0.45 ? Math.ceil(age / 0.15) / 3 : 1;
    const size = Math.max(3, Math.round(cell.radius * minDimension * 2 * growthStep));
    const blockSize = Math.max(2, Math.floor(size / 4));
    const x = Math.round(cell.x * width);
    const y = Math.round(cell.y * height);

    context.fillStyle = mutationActive ? "#6d2442" : "#522039";
    context.fillRect(x - size / 2, y - size / 2, size, size);
    context.fillStyle = age < 0.45 ? "#ffc2d1" : mutationActive ? "#f0789b" : "#d85d82";
    context.fillRect(
      x - size / 2 + blockSize,
      y - size / 2 + blockSize,
      Math.max(1, size - blockSize * 2),
      Math.max(1, size - blockSize * 2),
    );
    context.fillStyle = mutationActive ? "#ffb0c5" : "#f28aa8";
    context.fillRect(x - blockSize / 2, y - size / 2 + blockSize, blockSize, blockSize);
    context.fillRect(x + size / 2 - blockSize, y + size / 2 - blockSize, blockSize, blockSize);
  });

  context.restore();
}

function drawNutrients(
  context: CanvasRenderingContext2D,
  nodes: NutrientNode[],
  width: number,
  height: number,
  time: number,
  priorityNodeId: number | null,
): void {
  const minDimension = Math.min(width, height);

  nodes.forEach((node, index) => {
    const x = Math.round(node.x * width);
    const y = Math.round(node.y * height);
    const size = Math.max(5, Math.round(node.radius * minDimension * 1.8));
    const inset = Math.max(1, Math.floor(size / 4));
    const available = node.state === "available";
    const pulse = 1 + Math.round(Math.sin(time * 1.6 + index) * 0.04 * size);
    const frameSize = size + pulse;

    context.strokeStyle = available
      ? node.id === priorityNodeId ? "#ffe39b" : "#c99943"
      : "#596052";
    context.lineWidth = node.id === priorityNodeId ? 2 : 1;
    context.strokeRect(x - frameSize / 2, y - frameSize / 2, frameSize, frameSize);
    context.fillStyle = available ? "#654f2a" : "#353d37";
    context.fillRect(
      x - size / 2 + inset,
      y - size / 2 + inset,
      Math.max(1, size - inset * 2),
      Math.max(1, size - inset * 2),
    );
    context.fillStyle = available ? "#f5d485" : "#7d8776";
    context.fillRect(x - inset / 2, y - inset / 2, inset, inset);
    context.fillRect(x - size / 2 + inset, y - size / 2 + inset, inset, inset);
  });
}

function drawProjectiles(
  context: CanvasRenderingContext2D,
  simulation: Simulation,
  width: number,
  height: number,
): void {
  simulation.projectiles.forEach((projectile) => {
    context.fillStyle = "#98ffc0";
    context.fillRect(Math.round(projectile.x * width), Math.round(projectile.y * height), 3, 3);
  });
}

function drawResearchRewardPopups(
  context: CanvasRenderingContext2D,
  simulation: Simulation,
  width: number,
  height: number,
  reduceMotion: boolean,
): void {
  for (const popup of simulation.researchRewardPopups) {
    const age = simulation.elapsed - popup.bornAt;
    if (age < 0 || age > RESEARCH_REWARD_POPUP_LIFETIME) continue;

    const progress = age / RESEARCH_REWARD_POPUP_LIFETIME;
    const x = popup.x * width;
    const y = popup.y * height - 14 - (reduceMotion ? 0 : Math.round(progress * 18));
    const label = `+${popup.amount.toFixed(1)} R`;
    context.save();
    context.globalAlpha = reduceMotion ? 1 : 1 - progress;
    context.font = "600 12px monospace";
    context.textAlign = "center";
    context.strokeStyle = "#080d0a";
    context.lineWidth = 3;
    context.strokeText(label, x, y);
    context.fillStyle = "#8cf2a1";
    context.fillText(label, x, y);
    context.restore();
  }
}

function drawTurretWall(
  context: CanvasRenderingContext2D,
  turret: Point,
  width: number,
  height: number,
  durability: number,
): void {
  const minDimension = Math.min(width, height);
  const radius = GAME_RULES.turretWall.contactRadius * minDimension;
  const ratio = Math.min(1, Math.max(0, durability / GAME_RULES.turretWall.durability));
  const x = turret.x * width;
  const y = turret.y * height;

  context.save();
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.strokeStyle = "rgba(8, 202, 95, 0.28)";
  context.lineWidth = Math.max(1, Math.round(minDimension * 0.002));
  context.setLineDash([4, 3]);
  context.stroke();
  context.setLineDash([]);

  if (ratio > 0) {
    context.beginPath();
    context.arc(x, y, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ratio);
    context.strokeStyle = ratio < 0.25 ? "#fbbf24" : "#08ca5f";
    context.lineWidth = Math.max(2, Math.round(minDimension * 0.004));
    context.stroke();
  }
  context.restore();
}

function drawResearchCache(
  context: CanvasRenderingContext2D,
  cache: ResearchCache,
  width: number,
  height: number,
  isPriority: boolean,
): void {
  const size = Math.max(6, Math.round(cache.radius * Math.min(width, height) * 2.4));
  const x = Math.round(cache.x * width);
  const y = Math.round(cache.y * height);
  const block = Math.max(2, Math.floor(size / 4));

  context.fillStyle = "#19213b";
  context.fillRect(x - size / 2, y - size / 2, size, size);
  context.strokeStyle = isPriority ? "#f5f0ff" : "#b7aaff";
  context.lineWidth = isPriority ? 2 : 1;
  context.strokeRect(x - size / 2, y - size / 2, size, size);
  context.fillStyle = "#7768d8";
  context.fillRect(
    x - size / 2 + block,
    y - size / 2 + block,
    Math.max(1, size - block * 2),
    Math.max(1, size - block * 2),
  );
  context.fillStyle = "#ede8ff";
  context.fillRect(x - 1, y - 1, 2, 2);

  const durabilityRatio = Math.max(0, cache.health / cache.maxHealth);
  context.fillStyle = "#b7aaff";
  context.fillRect(x - size / 2, y + size / 2 + 2, Math.round(size * durabilityRatio), 2);
}

function drawTurret(
  context: CanvasRenderingContext2D,
  turret: Point,
  width: number,
  height: number,
  active: boolean,
  aimAngle: number,
): void {
  const x = turret.x * width;
  const y = turret.y * height;
  const size = Math.max(4, Math.round(Math.min(width, height) * 0.022));
  const xPixel = Math.round(x);
  const yPixel = Math.round(y);

  context.save();
  context.translate(xPixel, yPixel);
  context.rotate(aimAngle);
  context.fillStyle = active ? "#8cf2a1" : "#6ac780";
  context.fillRect(0, -Math.max(2, Math.floor(size / 5)), size, Math.max(3, Math.floor(size / 2.5)));
  context.restore();

  context.fillStyle = active ? "#8cf2a1" : "#6ac780";
  context.fillRect(xPixel - size / 2, yPixel - size / 2, size, size);
  context.fillStyle = "#10251a";
  context.fillRect(
    xPixel - size / 2 + 2,
    yPixel - size / 2 + 2,
    Math.max(1, size - 4),
    Math.max(1, size - 4),
  );
  context.fillStyle = "#d8ffe1";
  context.fillRect(xPixel - 2, yPixel - 2, 4, 4);
}

function pseudoRandom(seed: number): number {
  const value = Math.sin(seed * 127.1) * 43_758.5453;
  return value - Math.floor(value);
}

function formatTime(seconds: number): string {
  const wholeSeconds = Math.floor(seconds);
  const minutes = Math.floor(wholeSeconds / 60).toString().padStart(2, "0");
  const remainder = (wholeSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function formatDurability(value: number): string {
  const nearestInteger = Math.round(value);
  return Math.abs(value - nearestInteger) < 0.001
    ? nearestInteger.toLocaleString()
    : value.toFixed(2);
}
