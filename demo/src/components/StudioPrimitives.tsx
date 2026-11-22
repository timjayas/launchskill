import React from "react";
import { AbsoluteFill } from "remotion";
import { computeCameraTransform, FONT_SANS } from "../lib/motion";

/**
 * Deterministic 2.5% SVG fractal-noise grain overlay.
 * Prevents X H.264 encoder gradient banding on smooth light/dark backdrops.
 */
export const FilmGrainOverlay: React.FC<{ frame: number; opacity?: number }> = ({
  frame,
  opacity = 0.024,
}) => {
  const seed = Math.floor(frame / 2) % 24;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id={`studio-grain-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.78"
            numOctaves={2}
            seed={seed}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#studio-grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/**
 * Signature active-chrome Tool Node card (Fuser / Kinetic Studio grammar).
 */
export const NodeChromeCard: React.FC<{
  title: string;
  accentColor: string;
  width?: number;
  height?: number;
  dark?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ title, accentColor, width, height, dark = false, style, children }) => {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: dark ? "#591620" : "#FFFFFF",
        border: `2.5px solid ${accentColor}`,
        borderRadius: 24,
        boxShadow: dark
          ? "0 26px 70px rgba(0,0,0,0.38)"
          : `0 24px 64px rgba(17,17,22,0.11), 0 0 0 5px ${accentColor}18`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: FONT_SANS,
        ...style,
      }}
    >
      <div
        style={{
          height: 46,
          padding: "0 18px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid #F4F4F5",
          backgroundColor: dark ? "#4A121B" : "#FFFFFF",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            backgroundColor: accentColor,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 19,
            fontWeight: 650,
            letterSpacing: "-0.02em",
            color: dark ? "#FCE7F3" : "#27272A",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 18,
            color: dark ? "rgba(255,255,255,0.35)" : "#A1A1AA",
            letterSpacing: "-2px",
          }}
        >
          ⋮⋮
        </span>
      </div>
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>{children}</div>
    </div>
  );
};

/**
 * Tactile high-visibility vector cursor (orange accent default).
 */
export const TactileCursor: React.FC<{
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  fill?: string;
}> = ({ x, y, scale = 1, opacity = 1, fill = "#F97316" }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        transformOrigin: "top left",
        opacity,
        pointerEvents: "none",
        zIndex: 60,
        filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.22))",
      }}
    >
      <svg width={44} height={44} viewBox="0 0 24 24" fill="none">
        <path
          d="M4.5 3L19.5 11.8L12.2 13.8L9.2 20.8L4.5 3Z"
          fill={fill}
          stroke="#FFFFFF"
          strokeWidth={1.7}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

/**
 * 1-to-1 SVG Bezier Node Wire with deterministic draw & traveling signal pulse.
 */
export const ConnectedNodeWire: React.FC<{
  width?: number;
  height?: number;
  drawProgress: number;
  pulseProgress?: number;
  pulseOpacity?: number;
  accentColor?: string;
}> = ({
  width = 220,
  height = 100,
  drawProgress,
  pulseProgress = 0,
  pulseOpacity = 0,
  accentColor = "#F9A8D4",
}) => {
  const clampedDraw = Math.max(0, Math.min(1, drawProgress));
  const clampedPulse = Math.max(0, Math.min(1, pulseProgress));
  const yMid = height / 2;
  const xStart = 6;
  const xEnd = width - 6;
  const pathLen = xEnd - xStart;
  const pulseX = xStart + clampedPulse * pathLen;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: "visible", flexShrink: 0 }}
    >
      <path
        d={`M ${xStart} ${yMid} C ${width * 0.38} ${yMid}, ${width * 0.62} ${yMid}, ${xEnd} ${yMid}`}
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth={3.5}
      />
      <path
        d={`M ${xStart} ${yMid} C ${width * 0.38} ${yMid}, ${width * 0.62} ${yMid}, ${xEnd} ${yMid}`}
        fill="none"
        stroke={accentColor}
        strokeWidth={4.5}
        strokeLinecap="round"
        strokeDasharray={pathLen}
        strokeDashoffset={pathLen * (1 - clampedDraw)}
      />
      {pulseOpacity > 0.01 && (
        <circle
          cx={pulseX}
          cy={yMid}
          r={8}
          fill="#FFFFFF"
          opacity={pulseOpacity}
          style={{ filter: `drop-shadow(0 0 12px ${accentColor})` }}
        />
      )}
    </svg>
  );
};

/**
 * Exact Focal-Lock 2D Spatial Camera Rig.
 * Locks world coordinate (focusX, focusY) dead-center at any zoom with zero curved drift.
 */
export const SpatialCameraRig: React.FC<{
  focusX: number;
  focusY: number;
  zoom: number;
  blurPx?: number;
  viewportW?: number;
  viewportH?: number;
  children: React.ReactNode;
}> = ({ focusX, focusY, zoom, blurPx = 0, viewportW = 1920, viewportH = 1080, children }) => {
  const { x, y, scale } = computeCameraTransform(focusX, focusY, zoom, viewportW, viewportH);
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        transformOrigin: "0 0",
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        filter: blurPx > 0.25 ? `blur(${blurPx.toFixed(1)}px)` : undefined,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
};
