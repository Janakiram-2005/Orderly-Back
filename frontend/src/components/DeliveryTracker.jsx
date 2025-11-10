// /components/DeliveryTracker.js

import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';

// Pass the Order ID as a prop
function DeliveryTracker({ orderId }) {
  // Use useRef to hold the socket and watchId
  // This prevents re-connecting on every re-render
  const socketRef = useRef(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    // 1. Connect to the socket server
    socketRef.current = io('http://localhost:5000'); // Your backend URL
    const socket = socketRef.current;

    // 2. Join the room for this specific order
    socket.emit('joinOrderRoom', orderId);
    console.log(`Delivery joining room: ${orderId}`);

    // 3. Start watching the user's position
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // 4. Emit the new location to the server
          socket.emit('updateLocation', {
            orderId: orderId,
            lat: latitude,
            lng: longitude,
          });
        },
        (error) => {
          console.error('Error watching position:', error);
        },
        {
          enableHighAccuracy: true, // Get best possible location
        }
      );
    }

    // 5. Clean up when the component unmounts
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (socket) {
        socket.disconnect();
      }
    };
  }, [orderId]); // Re-run if the orderId changes

  return (
    <div>
      <h3>Live Tracking Delivery</h3>
      <p>Delivering Order: {orderId}</p>
      <strong>Your location is being shared live.</strong>
    </div>
  );
}

export default DeliveryTracker;