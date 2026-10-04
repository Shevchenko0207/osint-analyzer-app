'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OSINTEntity } from '@/types/entity';
import { VPK_LABELS } from '@/data/entities';
import { MapPin, Crosshair, ExternalLink, ShieldAlert } from 'lucide-react';

interface MapInnerProps {
  entities: OSINTEntity[];
  onSelectEntity: (entity: OSINTEntity) => void;
}

// Custom Leaflet marker icons created via L.divIcon with CSS SVGs
const createCustomMarkerIcon = (entity: OSINTEntity) => {
  const isTraining = entity.training_hub;
  const color = entity.color;

  const html = isTraining
    ? `<div style="
        background-color: #0d121f;
        border: 2px solid #007AFF;
        box-shadow: 0 0 12px rgba(0, 122, 255, 0.8);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #38bdf8;
        font-weight: bold;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
      </div>`
    : `<div style="
        background-color: ${color};
        border: 2px solid #ffffff;
        box-shadow: 0 0 10px ${color}80;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-size: 11px;
        font-weight: bold;
        font-family: monospace;
      ">
        ${entity.vpk_score}
      </div>`;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Component to handle map center auto-adjusting
const MapRecenter: React.FC<{ entities: OSINTEntity[] }> = ({ entities }) => {
  const map = useMap();
  useEffect(() => {
    if (entities.length > 0) {
      const bounds = L.latLngBounds(entities.map((e) => [e.lat, e.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
    }
  }, [entities, map]);
  return null;
};

export const MapInnerComponent: React.FC<MapInnerProps> = ({ entities, onSelectEntity }) => {
  // Center of Russia / European part
  const defaultCenter: [number, number] = [55.7558, 37.6173];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={5}
      scrollWheelZoom={true}
      className="w-full h-full"
    >
 <TileLayer
  attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
  url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
/>
      <MapRecenter entities={entities} />

      {entities.map((entity) => (
        <Marker
          key={entity.id}
          position={[entity.lat, entity.lng]}
          icon={createCustomMarkerIcon(entity)}
        >
          <Popup>
            <div className="p-1 space-y-2 max-w-xs text-slate-100">
              <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5">
                <span className="text-[10px] font-mono text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                  INN: {entity.id}
                </span>
                <span
                  className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: `${entity.color}30`, color: entity.color }}
                >
                  Grade {entity.vpk_score}
                </span>
              </div>

              <h4 className="font-bold text-sm text-white leading-tight">{entity.name}</h4>
              <p className="text-xs text-slate-300 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                {entity.city} • <span className="font-mono text-slate-400">{entity.cluster}</span>
              </p>

              <div className="text-[11px] font-mono text-slate-300 bg-slate-900/80 p-2 rounded border border-slate-800 space-y-0.5">
                <div>Revenue: <strong className="text-white">{entity.metrics.revenue || 'N/A'}</strong></div>
                <div>Profit: <strong className="text-emerald-400">{entity.metrics.profit || 'N/A'}</strong></div>
              </div>

              {entity.training_hub && (
                <div className="text-[10px] font-bold text-blue-300 bg-blue-950/80 p-1.5 rounded border border-blue-500/40 flex items-center gap-1">
                  <Crosshair className="w-3.5 h-3.5 text-blue-400" />
                  Active Drone Training Hub
                </div>
              )}

              <button
                onClick={() => onSelectEntity(entity)}
                className="w-full mt-2 py-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 shadow-md"
              >
                <span>Inspect Full Intel</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
