// src/components/GeoHeatmap.jsx
import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

const geoUrl =
  "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

const GeoHeatmap = ({ geoData = [] }) => {
  const validGeo = geoData.filter(
    (entry) =>
      typeof entry.lat === "number" &&
      typeof entry.lng === "number" &&
      !isNaN(entry.lat) &&
      !isNaN(entry.lng)
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow border mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg">🗺️ Geo Heatmap</h3>
      </div>
      <div style={{ width: "100%", height: "400px" }}>
        <ComposableMap
          projection="geoEqualEarth"
          width={800}
          height={400}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#f5f5f5"
                    stroke="#D6D6DA"
                  />
                ))
              }
            </Geographies>

            {validGeo.map((entry, i) => (
              <Marker key={i} coordinates={[entry.lng, entry.lat]}>
                <circle
                  r={Math.min(entry.count / 10, 10)}
                  fill="purple"
                  fillOpacity={0.5}
                />
                <text
                  textAnchor="middle"
                  y={-10}
                  style={{ fontSize: "10px", fill: "#5D5A6D" }}
                >
                  {entry.city || "City"}, {entry.count}
                </text>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </div>
  );
};

export default GeoHeatmap;
