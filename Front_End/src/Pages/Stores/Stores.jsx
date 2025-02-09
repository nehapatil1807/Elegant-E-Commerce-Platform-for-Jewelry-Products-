import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Leaflet styles
import L from "leaflet";
import "./Stores.css"; // Add custom styles
import Navbar from "../../customer/Components/Navbar/Navigation";

// Fix default marker icon issues in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Store locations with details
const storeLocations = [
  {
    name: "Elegant - Mumbai",
    address: "123 Gold Street, Bandra, Mumbai, Maharashtra",
    lat: 19.076,
    lng: 72.8777,
  },
  {
    name: "Elegant - Delhi",
    address: "456 Platinum Avenue, Connaught Place, New Delhi",
    lat: 28.6139,
    lng: 77.209,
  },
  {
    name: "Elegant - Bangalore",
    address: "789 Diamond Plaza, MG Road, Bangalore, Karnataka",
    lat: 12.9716,
    lng: 77.5946,
  },
  // USA Stores
  {
    name: "Elegant - New York",
    address: "500 5th Avenue, Manhattan, New York, NY 10110",
    lat: 40.7532,
    lng: -73.9822,
  },
  {
    name: "Elegant - Los Angeles",
    address: "8500 Beverly Blvd, Los Angeles, CA 90048",
    lat: 34.0736,
    lng: -118.4004,
  },
  {
    name: "Elegant - Chicago",
    address: "835 N Michigan Ave, Chicago, IL 60611",
    lat: 41.8972,
    lng: -87.6238,
  },
  {
    name: "Elegant - Houston",
    address: "5135 Westheimer Rd, Houston, TX 77056",
    lat: 29.7397,
    lng: -95.4644,
  },
  {
    name: "Elegant - San Francisco",
    address: "865 Market St, San Francisco, CA 94103",
    lat: 37.7837,
    lng: -122.4089,
  },
];

const Stores = () => {
  return (
    <><div> <Navbar /></div><div className="stores-container">
      <h1 className="stores-title">Our Stores</h1>
      <p className="stores-description">
        Visit any of our stores to explore our exquisite collection of jewelry in person.
      </p>

      {/* Map container */}
      <MapContainer
        center={[28.6139, 77.209]} // Default center: New Delhi
        zoom={5} // Zoom level
        style={{ height: "500px", width: "100%" }}
      >
        {/* OpenStreetMap tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />

        {/* Add markers for each store */}
        {storeLocations.map((store, index) => (
          <Marker key={index} position={[store.lat, store.lng]}>
            <Popup>
              <strong>{store.name}</strong>
              <br />
              {store.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div></>
  );
};

export default Stores;
