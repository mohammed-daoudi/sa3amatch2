import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Field } from '../../types';

interface FieldMapProps {
  fields: Field[];
  height?: string;
  zoom?: number;
  center?: [number, number];
  selectedFieldId?: string;
}

const FieldMap: React.FC<FieldMapProps> = ({
  fields,
  height = '400px',
  zoom = 13,
  center = [32.8959, -6.9190], // Khouribga center
}) => {
  // Custom icon for markers
  const footballIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1165/1165187.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: '100%', borderRadius: '0.375rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={(cluster) => {
          return new Icon({
            html: `<div class="cluster-marker">
              <div class="cluster-marker-inner">
                <span class="cluster-marker-text">${cluster.getChildCount()}</span>
              </div>
            </div>`,
            className: 'custom-cluster-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          });
        }}
      >
        {fields.map((field) => (
          <Marker
            key={field.id}
            position={[field.latitude, field.longitude]}
            icon={footballIcon}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-base">{field.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{field.address}</p>
                <p className="text-primary-600 font-medium">{field.pricePerHour} MAD/hour</p>
                <a
                  href={`/fields/${field.id}`}
                  className="text-sm text-secondary-600 hover:underline block mt-2"
                >
                  View Details
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default FieldMap;
