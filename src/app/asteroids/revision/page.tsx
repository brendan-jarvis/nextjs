"use client";

import "./game.css";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode, type RefObject } from "react";
import {
  Crosshair,
  Navigation,
  Orbit,
  Pause,
  Play,
  Smartphone,
  Volume2,
  VolumeX,
  Vibrate,
} from "lucide-react";
import { steerFromOrientation } from "@/game/tilt";
import type { ActionName, GameApi, Hud } from "@/game/types";

const INITIAL: Hud = {
  phase: "boot",
  score: 0,
  best: 0,
  wave: 1,
  lives: 3,
  banner: null,
  sound: true,
  haptics: true,
  tilt: false,
};

function formatScore(value: number) {
  return String(Math.max(0, Math.floor(value))).padStart(6, "0");
}

export default function Home() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const hapticLabel = useRef<HTMLLabelElement>(null);
  const hapticInput = useRef<HTMLInputElement>(null);
  const gameRef = useRef<GameApi | null>(null);
  const [hud, setHud] = useState<Hud>(INITIAL);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    hapticInput.current?.setAttribute("switch", "");
    const canvas = canvasRef.current;
    const root = rootRef.current;
    const popups = popRef.current;
    const label = hapticLabel.current;
    if (!canvas || !root || !popups || !label) return;

    let dead = false;
    let api: GameApi | null = null;
    void import("@/game/engine")
      .then(({ createGame }) => {
        if (dead) return;
        api = createGame({
          canvas,
          root,
          popups,
          hapticLabel: label,
          onHud: (next) => {
            if (!dead) setHud(next);
          },
        });
        gameRef.current = api;
      })
      .catch((err: unknown) => {
        if (dead) return;
        setError(err instanceof Error ? err.message : "This device couldn't open the field.");
      });

    return () => {
      dead = true;
      api?.dispose();
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!hud.tilt) return;
    const onOrientation = (event: DeviceOrientationEvent) => {
      gameRef.current?.setTiltSteer(steerFromOrientation(event));
    };
    window.addEventListener("deviceorientation", onOrientation);
    return () => {
      window.removeEventListener("deviceorientation", onOrientation);
      gameRef.current?.setTiltSteer(0);
    };
  }, [hud.tilt]);

  function unlock() {
    gameRef.current?.unlockAudio();
  }

  function onStart() {
    unlock();
    gameRef.current?.start();
  }

  async function onTilt() {
    unlock();
    if (hud.tilt) {
      gameRef.current?.setTiltEnabled(false);
      return;
    }
    const ok = await requestTilt();
    if (ok) gameRef.current?.setTiltEnabled(true);
  }

  const menu = hud.phase === "boot" || hud.phase === "attract" || hud.phase === "over";

  return (
    <main
      ref={rootRef}
      className="game-root"
      data-phase={hud.phase}
      onPointerDown={unlock}
      onContextMenu={(event) => event.preventDefault()}
    >
      <canvas ref={canvasRef} aria-label="Asteroids field" />
      <div ref={popRef} className="popups" />
      <label
        ref={hapticLabel}
        className="haptic-sink"
        aria-hidden="true"
        onMouseDown={(event) => event.preventDefault()}
      >
        <input ref={hapticInput} type="checkbox" tabIndex={-1} />
      </label>

      {(hud.phase === "play" || hud.phase === "pause") && (
        <header className="topbar">
          <div className="score-block">
            <p className="kicker">Score</p>
            <p className="num score-num">{formatScore(hud.score)}</p>
            <p className="num best-num">Best {formatScore(hud.best)}</p>
            <div className="lives" aria-label={`${hud.lives} ships`}>
              {Array.from({ length: Math.max(0, hud.lives) }, (_, index) => (
                <Navigation key={index} className="life" strokeWidth={2.25} aria-hidden="true" />
              ))}
            </div>
          </div>
          <div className="wave-block">
            <p className="kicker">Wave</p>
            <p className="num wave-num">{String(hud.wave).padStart(2, "0")}</p>
            <button type="button" className="icon-btn" aria-label="Pause" onClick={() => gameRef.current?.togglePause()}>
              <Pause size={18} strokeWidth={2.25} />
            </button>
          </div>
        </header>
      )}

      {hud.phase === "play" && hud.banner ? <p className="banner">{hud.banner}</p> : null}

      {menu ? (
        <div className="menu-wrap">
          <section className="card" aria-label={hud.phase === "over" ? "Game over" : "Asteroids"}>
            <p className="eyebrow">{hud.phase === "over" ? "Field lost" : "Revision"}</p>
            {hud.phase === "over" ? (
              <>
                <p className="num over-score">{formatScore(hud.score)}</p>
                <p className="over-wave">Wave {hud.wave}</p>
                <div className="best-line">
                  <span className="kicker">Best</span>
                  <span className="num">{formatScore(hud.best)}</span>
                </div>
                <button type="button" className="btn btn-primary" onClick={onStart}>
                  Again
                </button>
              </>
            ) : (
              <>
                <h1 className="title">Asteroids</h1>
                <p className="lede">Drift, fire, and clear the belt.</p>
                <div className="best-line">
                  <span className="kicker">Best</span>
                  <span className="num">{formatScore(hud.best)}</span>
                </div>
                <button type="button" className="btn btn-primary" onClick={onStart}>
                  Start
                </button>
                {error ? <p className="error-line">{error}</p> : null}
              </>
            )}
            <div className="toggles">
              <button
                type="button"
                className="toggle"
                aria-pressed={hud.sound}
                onClick={() => gameRef.current?.setSound(!hud.sound)}
              >
                {hud.sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
                Sound
              </button>
              <button
                type="button"
                className="toggle"
                aria-pressed={hud.haptics}
                onClick={() => gameRef.current?.setHaptics(!hud.haptics)}
              >
                <Vibrate size={16} />
                Haptics
              </button>
              <button type="button" className="toggle" aria-pressed={hud.tilt} onClick={() => void onTilt()}>
                <Smartphone size={16} />
                Tilt
              </button>
            </div>
            <p className="hint hint-keys">A D turn · W thrust · Space fire · H jump · P pause</p>
            <p className="hint hint-touch">Left stick aims and thrusts. Fire and jump sit on the right.</p>
            <p className="fine">Four shots at a time. Saucers keep score. Hyperspace is a gamble.</p>
          </section>
        </div>
      ) : null}

      {hud.phase === "pause" ? (
        <div className="menu-wrap">
          <section className="card card-slim">
            <p className="eyebrow">Holding</p>
            <h2 className="title">Paused</h2>
            <button type="button" className="btn btn-primary" onClick={() => gameRef.current?.resume()}>
              <Play size={16} /> Resume
            </button>
          </section>
        </div>
      ) : null}

      <div className="deck">
        <Stick gameRef={gameRef} />
        <div className="cluster">
          <div className="stack">
            <button
              type="button"
              className="pad hyper"
              aria-label="Hyperspace"
              onPointerDown={(event) => {
                event.preventDefault();
                gameRef.current?.tapHyper();
              }}
            >
              <Orbit size={18} />
            </button>
            <Hold name="fire" label="Fire" className="fire" gameRef={gameRef}>
              <Crosshair size={26} />
            </Hold>
          </div>
        </div>
      </div>

      <p className="legend">A D turn · W thrust · Space fire · H jump · P pause</p>
      <p className="sr" aria-live="polite">
        {hud.phase === "over" ? `Game over. Score ${hud.score}.` : ""}
      </p>
    </main>
  );
}

function Stick({ gameRef }: { gameRef: RefObject<GameApi | null> }) {
  const baseRef = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0, hot: false });

  function aim(event: PointerEvent<HTMLDivElement>) {
    const el = baseRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const radius = rect.width * 0.32;
    let dx = event.clientX - (rect.left + rect.width / 2);
    let dy = event.clientY - (rect.top + rect.height / 2);
    const mag = Math.hypot(dx, dy);
    const clamped = Math.min(mag, radius);
    if (mag > 0) {
      dx = (dx / mag) * clamped;
      dy = (dy / mag) * clamped;
    }
    const nx = radius > 0 ? dx / radius : 0;
    const ny = radius > 0 ? -dy / radius : 0;
    setKnob({ x: dx, y: dy, hot: Math.hypot(nx, ny) > 0.18 });
    gameRef.current?.setStick(nx, ny, true);
  }

  function release() {
    setKnob({ x: 0, y: 0, hot: false });
    gameRef.current?.setStick(0, 0, false);
  }

  return (
    <div
      ref={baseRef}
      className="stick"
      data-hot={knob.hot ? "1" : "0"}
      role="slider"
      aria-label="Move"
      aria-valuemin={-1}
      aria-valuemax={1}
      aria-valuetext={knob.hot ? "Thrusting" : "Centered"}
      onPointerDown={(event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        aim(event);
      }}
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
        aim(event);
      }}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <span className="stick-knob" style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }} />
    </div>
  );
}

function Hold({
  name,
  label,
  className,
  gameRef,
  children,
}: {
  name: ActionName;
  label: string;
  className?: string;
  gameRef: RefObject<GameApi | null>;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={className ? `pad ${className}` : "pad"}
      aria-label={label}
      onPointerDown={(event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        gameRef.current?.setAction(name, true);
      }}
      onPointerUp={() => gameRef.current?.setAction(name, false)}
      onPointerCancel={() => gameRef.current?.setAction(name, false)}
    >
      {children}
    </button>
  );
}

async function requestTilt() {
  const orientation = DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<string>;
  };
  if (typeof orientation.requestPermission !== "function") return true;
  try {
    const result = await orientation.requestPermission();
    return result === "granted";
  } catch {
    return false;
  }
}
