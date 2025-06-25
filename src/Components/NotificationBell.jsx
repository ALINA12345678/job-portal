import React, { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';

const mockNotifications = [
  { id: 1, message: "New candidate applied", read: false },
  { id: 2, message: "Job post approved", read: true },
  { id: 3, message: "Profile updated", read: false },
];

function NotificationBell() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button 
        onClick={() => setShowDropdown(!showDropdown)} 
        style={{ fontSize: '24px', position: 'relative', background: 'none', border: 'none', cursor: 'pointer' }}
        aria-label="Notifications"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: 0,
            right: 0,
            background: 'red',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '12px',
            fontWeight: 'bold',
            lineHeight: 1,
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div style={{
          position: 'absolute',
          right: 0,
          marginTop: '10px',
          width: '250px',
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 1000,
        }}>
          {notifications.length === 0 ? (
            <p style={{ padding: '10px' }}>No notifications</p>
          ) : (
            notifications.map(n => (
              <div key={n.id} style={{ 
                padding: '10px', 
                background: n.read ? '#f9f9f9' : '#e6f7ff', 
                borderBottom: '1px solid #ddd',
                cursor: 'pointer',
              }}>
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
