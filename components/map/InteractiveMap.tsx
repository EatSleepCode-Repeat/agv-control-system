import React, { useEffect, useRef, useState } from 'react';
import { Vehicle, Location } from '@/types';
import { STATUS_COLORS } from '@/lib/constants';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface InteractiveMapProps {
  vehicles: Vehicle[];
  locations: Location[];
  selectedVehicle?: Vehicle | null;
  onVehicleClick?: (vehicle: Vehicle) => void;
}

interface ViewState {
  zoom: number;
  panX: number;
  panY: number;
}

const MAP_WIDTH = 800;
const MAP_HEIGHT = 600;
const MAX_ZOOM = 3;
const MIN_ZOOM = 0.5;

export function InteractiveMap({
  vehicles,
  locations,
  selectedVehicle,
  onVehicleClick,
}: InteractiveMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewState, setViewState] = useState<ViewState>({ zoom: 1, panX: 0, panY: 0 });
  const [hoveredVehicle, setHoveredVehicle] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Main rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

      // Save context state
      ctx.save();

      // Apply transformations
      ctx.translate(MAP_WIDTH / 2 + viewState.panX, MAP_HEIGHT / 2 + viewState.panY);
      ctx.scale(viewState.zoom, viewState.zoom);
      ctx.translate(-MAP_WIDTH / 2, -MAP_HEIGHT / 2);

      // Draw grid
      drawGrid(ctx);

      // Draw locations
      drawLocations(ctx, locations);

      // Draw vehicles
      drawVehicles(ctx, vehicles, selectedVehicle?.id);

      // Draw routes if multiple vehicles selected
      drawRoutes(ctx, vehicles);

      // Restore context state
      ctx.restore();

      requestAnimationFrame(render);
    };

    render();
  }, [vehicles, locations, selectedVehicle, viewState]);

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    const gridSize = 40;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
    ctx.lineWidth = 0.5;

    for (let x = 0; x < MAP_WIDTH; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, MAP_HEIGHT);
      ctx.stroke();
    }

    for (let y = 0; y < MAP_HEIGHT; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(MAP_WIDTH, y);
      ctx.stroke();
    }
  };

  const drawLocations = (ctx: CanvasRenderingContext2D, locations: Location[]) => {
    locations.forEach(loc => {
      const size = 16;

      // Outer glow
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.beginPath();
      ctx.arc(loc.x, loc.y, size + 8, 0, Math.PI * 2);
      ctx.fill();

      // Main square
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(loc.x - size / 2, loc.y - size / 2, size, size);

      // Border
      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 2;
      ctx.strokeRect(loc.x - size / 2, loc.y - size / 2, size, size);

      // Label
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(loc.name, loc.x, loc.y + size / 2 + 6);
    });
  };

  const drawVehicles = (ctx: CanvasRenderingContext2D, vehicles: Vehicle[], selectedId?: number) => {
    vehicles.forEach(v => {
      const isSelected = v.id === selectedId;
      const isHovered = v.id === hoveredVehicle;
      const size = isSelected ? 12 : isHovered ? 10 : 8;

      // Glow effect
      if (isSelected || isHovered) {
        ctx.fillStyle = isSelected
          ? 'rgba(34, 197, 94, 0.3)'
          : 'rgba(59, 130, 246, 0.2)';
        ctx.beginPath();
        ctx.arc(v.x, v.y, size + 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Direction indicator (small line showing movement direction)
      if (v.status === 'moving') {
        const angle = Math.random() * Math.PI * 2;
        const lineLength = size * 2;
        ctx.strokeStyle = STATUS_COLORS[v.status];
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(v.x, v.y);
        ctx.lineTo(v.x + Math.cos(angle) * lineLength, v.y + Math.sin(angle) * lineLength);
        ctx.stroke();
      }

      // Main vehicle circle
      ctx.fillStyle = STATUS_COLORS[v.status];
      ctx.beginPath();
      ctx.arc(v.x, v.y, size, 0, Math.PI * 2);
      ctx.fill();

      // Selection ring
      if (isSelected) {
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(v.x, v.y, size + 5, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Hover ring
      if (isHovered) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(v.x, v.y, size + 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Battery indicator (small bar above vehicle)
      const barWidth = 14;
      const barHeight = 2;
      ctx.fillStyle = '#334155';
      ctx.fillRect(v.x - barWidth / 2, v.y - size - 8, barWidth, barHeight);

      const batteryColor = v.battery > 50 ? '#22c55e' : v.battery > 30 ? '#eab308' : '#ef4444';
      ctx.fillStyle = batteryColor;
      ctx.fillRect(v.x - barWidth / 2, v.y - size - 8, (barWidth * v.battery) / 100, barHeight);

      // Label
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(v.name, v.x, v.y - size - 12);
    });
  };

  const drawRoutes = (ctx: CanvasRenderingContext2D, vehicles: Vehicle[]) => {
    // Draw lines between consecutive vehicle positions for visual interest
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    for (let i = 0; i < vehicles.length - 1; i++) {
      const v1 = vehicles[i];
      const v2 = vehicles[i + 1];

      if (v1.status === 'moving' && v2.status === 'moving') {
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.stroke();
      }
    }

    ctx.setLineDash([]);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Transform screen coordinates to world coordinates
    const worldX = (x - MAP_WIDTH / 2 - viewState.panX) / viewState.zoom + MAP_WIDTH / 2;
    const worldY = (y - MAP_HEIGHT / 2 - viewState.panY) / viewState.zoom + MAP_HEIGHT / 2;

    // Check if click is on a vehicle
    for (const v of vehicles) {
      const dist = Math.sqrt((worldX - v.x) ** 2 + (worldY - v.y) ** 2);
      if (dist < 15) {
        onVehicleClick?.(v);
        return;
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    // Transform screen coordinates to world coordinates
    const worldX = (x - MAP_WIDTH / 2 - viewState.panX) / viewState.zoom + MAP_WIDTH / 2;
    const worldY = (y - MAP_HEIGHT / 2 - viewState.panY) / viewState.zoom + MAP_HEIGHT / 2;

    // Check if hovering over a vehicle
    let hovered = null;
    for (const v of vehicles) {
      const dist = Math.sqrt((worldX - v.x) ** 2 + (worldY - v.y) ** 2);
      if (dist < 15) {
        hovered = v.id;
        break;
      }
    }
    setHoveredVehicle(hovered);
  };

  const handleZoom = (delta: number) => {
    setViewState(prev => ({
      ...prev,
      zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev.zoom + delta * 0.1)),
    }));
  };

  const handleReset = () => {
    setViewState({ zoom: 1, panX: 0, panY: 0 });
  };

  const handlePan = (deltaX: number, deltaY: number) => {
    setViewState(prev => ({
      ...prev,
      panX: prev.panX + deltaX,
      panY: prev.panY + deltaY,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <h2 className="text-xl font-semibold text-white mb-3">Live Fleet Map</h2>

        {/* Canvas */}
        <div className="relative bg-slate-900 rounded border border-slate-600 overflow-hidden">
          <canvas
            ref={canvasRef}
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            className="w-full h-auto cursor-crosshair"
          />

          {/* Zoom/Pan Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              onClick={() => handleZoom(1)}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded border border-slate-600 text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(-1)}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded border border-slate-600 text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded border border-slate-600 text-white"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Pan Arrows */}
          <div className="absolute bottom-4 left-4 grid grid-cols-3 gap-1">
            <div />
            <button
              onClick={() => handlePan(0, 30)}
              className="p-1 bg-slate-700 hover:bg-slate-600 rounded text-white text-xs"
            >
              ↑
            </button>
            <div />

            <button
              onClick={() => handlePan(30, 0)}
              className="p-1 bg-slate-700 hover:bg-slate-600 rounded text-white text-xs"
            >
              ←
            </button>
            <button
              onClick={() => handlePan(0, 0)}
              className="p-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-400 text-xs"
            >
              •
            </button>
            <button
              onClick={() => handlePan(-30, 0)}
              className="p-1 bg-slate-700 hover:bg-slate-600 rounded text-white text-xs"
            >
              →
            </button>

            <div />
            <button
              onClick={() => handlePan(0, -30)}
              className="p-1 bg-slate-700 hover:bg-slate-600 rounded text-white text-xs"
            >
              ↓
            </button>
            <div />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Legend</h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-slate-300">Idle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-slate-300">Moving</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="text-slate-300">Charging</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-slate-300">Maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500" />
            <span className="text-slate-300">Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-full h-0.5 bg-slate-500" />
            <span className="text-slate-300">Active Route</span>
          </div>
        </div>
      </div>

      {/* Hovered/Selected Vehicle Info */}
      {(hoveredVehicle || selectedVehicle) && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Vehicle Details</h3>
          {selectedVehicle && (
            <div className="space-y-2 text-sm">
              <p className="text-slate-300">
                <span className="text-slate-400">ID:</span> <span className="text-white font-mono">{selectedVehicle.name}</span>
              </p>
              <p className="text-slate-300">
                <span className="text-slate-400">Status:</span> <span className="text-white capitalize">{selectedVehicle.status}</span>
              </p>
              <p className="text-slate-300">
                <span className="text-slate-400">Position:</span> <span className="text-white font-mono">{Math.round(selectedVehicle.x)}, {Math.round(selectedVehicle.y)}</span>
              </p>
              <p className="text-slate-300">
                <span className="text-slate-400">Battery:</span> <span className="text-white">{selectedVehicle.battery}%</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}