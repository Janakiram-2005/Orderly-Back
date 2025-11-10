// /components/CustomerOrderTracker.js

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Pass the Order ID as a prop
function CustomerOrderTracker({ orderId }) {
  const [deliveryLocation, setDeliveryLocation] = useState(null); // Live location
  // You would pass these as props from your order details
  const shopLocation = [16.30, 80.43]; // Example shop location
  const customerLocation = [16.32, 80.45]; // Example customer location
  
  const socketRef = useRef(null);

  useEffect(() => {
    // 1. Connect to the socket server
    socketRef.current = io('http://localhost:5000');
    const socket = socketRef.current;

    // 2. Join the same room
    socket.emit('joinOrderRoom', orderId);
    console.log(`Customer joining room: ${orderId}`);

    // 3. Listen for the 'locationUpdated' event
    socket.on('locationUpdated', (data) => {
      // data is { lat, lng }
      console.log('Location update received:', data);
      setDeliveryLocation([data.lat, data.lng]);
    });

    // 4. Clean up
    return () => {
      socket.off('locationUpdated'); // Stop listening
      socket.disconnect();
    };
  }, [orderId]);

  return (
    <div>
      <h3>Track Your Order</h3>
      <MapContainer 
        center={shopLocation} 
        zoom={14} 
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {/* Static Markers */}
        <Marker position={shopLocation}>
          {/* You can add custom icons here */}
        </Marker>
        <Marker position={customerLocation}>
        </Marker>
        
        {/* --- LIVE DELIVERY MARKER --- */}
        {deliveryLocation && (
          <Marker position={deliveryLocation}>
            {/* Add a delivery icon here */}
          </Marker>
        )}
        
        {/* Optional: Draw a line from shop to customer */}
        <Polyline positions={[shopLocation, customerLocation]} color="blue" />
        
      </MapContainer>
    </div>
  );
}

export default CustomerOrderTracker;