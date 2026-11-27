import React, { useState, useMemo } from 'react';
import * as d3 from 'd3';
import { SpiritualAttributes, ATTRIBUTE_METADATA, AttributeDescription } from './data/characters';

interface SpiritualRadarChartProps {
  attributes: SpiritualAttributes;
  attributeNotes: { [K in keyof SpiritualAttributes]: string };
  accentColor: string;
  characterName: string;
  reiatsuTheme: string;
  onPlaySound?: () => void;
}

export const SpiritualRadarChart: React.FC<SpiritualRadarChartProps> = ({
  attributes,
  attributeNotes,
  accentColor,
  characterName,
  reiatsuTheme,
  onPlaySound,
}) => {
  const [hoveredAttr, setHoveredAttr] = useState<AttributeDescription | null>(null);

  const width = 360;
  const height = 340;
  const cx = width / 2;
  const cy = height / 2 - 8;
  const radius = 115;
  const levels = [20, 40, 60, 80, 100];
  const numAxes = ATTRIBUTE_METADATA.length;

  // D3 radius scale
  const rScale = useMemo(() => {
    return d3.scaleLinear().domain([0, 100]).range([0, radius]);
  }, [radius]);

  // Compute angle for each axis (0 at 12 o'clock, moving clockwise)
  const angleForIndex = (i: number) => {
    return (i * (2 * Math.PI)) / numAxes - Math.PI / 2;
  };

  // Generate coordinates for any value on an axis
  const getCoordinates = (value: number, index: number) => {
    const angle = angleForIndex(index);
    const r = rScale(value);
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  // Concentric polygon grid points
  const gridPolygons = useMemo(() => {
    return levels.map((lvl) => {
      const points = ATTRIBUTE_METADATA.map((_, i) => {
        const { x, y } = getCoordinates(lvl, i);
        return `${x},${y}`;
      }).join(' ');
      return { level: lvl, points };
    });
  }, [cx, cy, rScale]);

  // Character polygon points string
  const characterPolygonPoints = useMemo(() => {
    return ATTRIBUTE_METADATA.map((attr, i) => {
      const val = attributes[attr.key];
      const { x, y } = getCoordinates(val, i);
      return `${x},${y}`;
    }).join(' ');
  }, [attributes, cx, cy, rScale]);

  // Coordinates for each vertex marker
  const vertices = useMemo(() => {
    return ATTRIBUTE_METADATA.map((attr, i) => {
      const val = attributes[attr.key];
      const coord = getCoordinates(val, i);
      const outerCoord = getCoordinates(120, i); // label anchor
      return {
        attr,
        value: val,
        x: coord.x,
        y: coord.y,
        labelX: outerCoord.x,
        labelY: outerCoord.y,
      };
    });
  }, [attributes, cx, cy, rScale]);

  // Overall combat power index
  const totalPower = useMemo(() => {
    const sum = Object.values(attributes).reduce((acc, v) => acc + v, 0);
    return Math.round((sum / (numAxes * 100)) * 100);
  }, [attributes, numAxes]);

  // Highest attribute
  const highestStat = useMemo(() => {
    let max = -1;
    let top = ATTRIBUTE_METADATA[0];
    ATTRIBUTE_METADATA.forEach((attr) => {
      if (attributes[attr.key] > max) {
        max = attributes[attr.key];
        top = attr;
      }
    });
    return { ...top, value: max };
  }, [attributes]);

  return (
    <div className="spiritual-radar-container">
      {/* Header bar of the radar card */}
      <div className="radar-header">
        <div className="radar-title-box">
          <span className="radar-tag">COMBAT ATTRIBUTES • 戦闘能力測定</span>
          <h4 className="radar-title">Spiritual Radar Visual (D3)</h4>
        </div>
        <div className="radar-tier-badge" style={{ borderColor: accentColor, color: accentColor }}>
          <span className="tier-label">REIATSU INDEX</span>
          <strong className="tier-val">{totalPower}% TIER</strong>
        </div>
      </div>

      {/* SVG D3 Spider Chart */}
      <div className="radar-svg-wrapper">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="radar-svg"
          aria-label={`${characterName}'s spiritual attributes spider chart`}
        >
          <defs>
            {/* Radial glow gradient matching character's Reiatsu color */}
            <radialGradient id={`radar-grad-${characterName}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.45" />
              <stop offset="65%" stopColor={accentColor} stopOpacity="0.2" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.04" />
            </radialGradient>

            {/* Glowing filter */}
            <filter id={`radar-glow-${characterName}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Concentric Web Grid Rings */}
          {gridPolygons.map((g, idx) => (
            <g key={idx} className="grid-level-group">
              <polygon
                points={g.points}
                fill="none"
                stroke={g.level === 100 ? 'rgba(201, 166, 91, 0.35)' : 'rgba(255, 255, 255, 0.08)'}
                strokeWidth={g.level === 100 ? 1.5 : 0.8}
                strokeDasharray={g.level === 100 ? undefined : '2,3'}
              />
              {/* Level indicator tick on the vertical 12 o'clock line */}
              <text
                x={cx + 3}
                y={cy - rScale(g.level) - 2}
                fill="rgba(244, 241, 234, 0.38)"
                fontSize="7.5"
                fontFamily="var(--mono)"
                textAnchor="start"
              >
                {g.level}
              </text>
            </g>
          ))}

          {/* Radial Axis Spokes */}
          {ATTRIBUTE_METADATA.map((_, i) => {
            const { x, y } = getCoordinates(100, i);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
              />
            );
          })}

          {/* Character Polygon Area Fill with D3 Data */}
          <polygon
            points={characterPolygonPoints}
            fill={`url(#radar-grad-${characterName})`}
            stroke={accentColor}
            strokeWidth="2.5"
            filter={`url(#radar-glow-${characterName})`}
            className="radar-char-polygon"
          />

          {/* Axis Labels (English + Kanji) */}
          {vertices.map((v, i) => {
            const isHovered = hoveredAttr?.key === v.attr.key;
            // Alignment based on angle
            const angle = angleForIndex(i);
            let textAnchor: 'start' | 'middle' | 'end' = 'middle';
            let dy = '0.35em';

            if (Math.cos(angle) > 0.2) {
              textAnchor = 'start';
            } else if (Math.cos(angle) < -0.2) {
              textAnchor = 'end';
            }

            if (Math.sin(angle) < -0.8) {
              dy = '-0.5em';
            } else if (Math.sin(angle) > 0.8) {
              dy = '1.1em';
            }

            return (
              <g
                key={v.attr.key}
                className="radar-label-group cursor-pointer"
                onMouseEnter={() => {
                  setHoveredAttr(v.attr);
                  onPlaySound?.();
                }}
                onMouseLeave={() => setHoveredAttr(null)}
                onClick={() => {
                  setHoveredAttr(v.attr);
                  onPlaySound?.();
                }}
              >
                <text
                  x={v.labelX}
                  y={v.labelY}
                  textAnchor={textAnchor}
                  dy={dy}
                  fill={isHovered ? accentColor : 'var(--paper)'}
                  fontSize={isHovered ? '9.5' : '8.5'}
                  fontFamily="var(--mono)"
                  fontWeight={isHovered ? '700' : '500'}
                  className="transition-all duration-150 select-none"
                >
                  {v.attr.label.toUpperCase()}
                  <tspan
                    fill={accentColor}
                    fontWeight="700"
                    dx="4"
                    fontSize="9"
                  >
                    {v.value}
                  </tspan>
                </text>
              </g>
            );
          })}

          {/* Interactive Vertex Data Points */}
          {vertices.map((v) => {
            const isHovered = hoveredAttr?.key === v.attr.key;
            return (
              <g
                key={`vertex-${v.attr.key}`}
                className="cursor-pointer"
                onMouseEnter={() => {
                  setHoveredAttr(v.attr);
                  onPlaySound?.();
                }}
                onMouseLeave={() => setHoveredAttr(null)}
                onClick={() => {
                  setHoveredAttr(v.attr);
                  onPlaySound?.();
                }}
              >
                {/* Pulse ring on hover */}
                {isHovered && (
                  <circle
                    cx={v.x}
                    cy={v.y}
                    r="8"
                    fill="none"
                    stroke={accentColor}
                    strokeWidth="1.5"
                    className="animate-ping"
                  />
                )}
                <circle
                  cx={v.x}
                  cy={v.y}
                  r={isHovered ? '5.5' : '3.8'}
                  fill={accentColor}
                  stroke="#05060f"
                  strokeWidth="1.8"
                  filter={`drop-shadow(0 0 6px ${accentColor})`}
                  className="transition-all duration-200"
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Detail Tooltip on Hover */}
        {hoveredAttr && (
          <div
            className="radar-live-tooltip"
            style={{
              borderColor: accentColor,
            }}
          >
            <div className="tooltip-head">
              <strong style={{ color: accentColor }}>
                {hoveredAttr.label} • {hoveredAttr.jp}
              </strong>
              <span className="tooltip-score" style={{ backgroundColor: `${accentColor}26`, color: accentColor }}>
                {attributes[hoveredAttr.key]} / 100
              </span>
            </div>
            <p className="tooltip-note">{attributeNotes[hoveredAttr.key]}</p>
          </div>
        )}
      </div>

      {/* Mini Attribute Scoreboard Grid */}
      <div className="radar-stats-grid">
        {ATTRIBUTE_METADATA.map((attr) => {
          const val = attributes[attr.key];
          const isSelected = hoveredAttr?.key === attr.key;
          return (
            <button
              key={attr.key}
              type="button"
              className={`radar-stat-pill ${isSelected ? 'active' : ''}`}
              onMouseEnter={() => setHoveredAttr(attr)}
              onMouseLeave={() => setHoveredAttr(null)}
              onClick={() => {
                setHoveredAttr(attr);
                onPlaySound?.();
              }}
              style={{
                borderColor: isSelected ? accentColor : undefined,
                background: isSelected ? `${accentColor}18` : undefined,
              }}
            >
              <div className="pill-left">
                <span className="pill-key">{attr.label}</span>
                <small className="pill-jp">{attr.jp.split(' ')[0]}</small>
              </div>
              <strong className="pill-val" style={{ color: val >= 95 ? accentColor : 'var(--paper)' }}>
                {val}
              </strong>
            </button>
          );
        })}
      </div>

      {/* Specialty callout footer */}
      <div className="radar-footer">
        <span className="specialty-label">SUPREME COMBAT SPECIALTY:</span>
        <strong className="specialty-text" style={{ color: accentColor }}>
          {highestStat.label} ({highestStat.value}/100) — {highestStat.jp}
        </strong>
      </div>
    </div>
  );
};
