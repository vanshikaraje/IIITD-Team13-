import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- FIX: Leaflet's default icon paths for the user marker ---
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// --- NEW: Custom icon for pharmacies ---
const pharmacyIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063463.png', // A simple medical cross icon
  iconSize: [35, 35],     // Size of the icon
  iconAnchor: [17, 35],   // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -35]   // Point from which the popup should open relative to the iconAnchor
});

// --- NEW: Define the structure for pharmacy data ---
interface Pharmacy {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
  };
}

interface LocationMapProps {
  lat: number;
  lon: number;
  cityName: string;
}

const LocationMap = ({ lat, lon, cityName }: LocationMapProps) => {
  // --- NEW: State to hold the list of nearby pharmacies ---
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);

  // --- NEW: useEffect to fetch pharmacies when the map is loaded ---
  useEffect(() => {
    const fetchNearbyPharmacies = async () => {
      // Overpass API query to find pharmacies within a 1km radius
      const query = `
        [out:json];
        (
          node[amenity=pharmacy](around:1000,${lat},${lon});
          way[amenity=pharmacy](around:1000,${lat},${lon});
        );
        out center;
      `;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setPharmacies(data.elements);
      } catch (error) {
        console.error("Error fetching nearby pharmacies:", error);
      }
    };

    fetchNearbyPharmacies();
  }, [lat, lon]); // Re-run if the user's location changes

  return (
    <MapContainer center={[lat, lon]} zoom={15} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marker for the user's current location */}
      <Marker position={[lat, lon]}>
        <Popup>You are here: <br /> <b>{cityName}</b></Popup>
      </Marker>

      {/* --- NEW: Markers for nearby pharmacies -- */}
      {pharmacies.map(pharmacy => {
        // Determine the correct position based on the element type from the API
        const position: [number, number] = pharmacy.lat && pharmacy.lon
          ? [pharmacy.lat, pharmacy.lon] // For 'node' elements
          : [pharmacy.center.lat, pharmacy.center.lon]; // For 'way' elements

        return (
          <Marker key={pharmacy.id} position={position} icon={pharmacyIcon}>
            <Popup>
              <b>{pharmacy.tags?.name || 'Pharmacy'}</b>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default LocationMap;
