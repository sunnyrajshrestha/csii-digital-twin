import React, { useState, useEffect } from 'react';
import { Users, Thermometer, Building2, Eye, Layers, Wind, Droplets, Clock, MapPin, Activity, Download, BarChart3, Database, TrendingUp, Maximize2, Box } from 'lucide-react';

export default function DemoDigitalTwin() {
  const [selectedFloor, setSelectedFloor] = useState(4);
  const [view3D, setView3D] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [demoMode, setDemoMode] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [rotationX, setRotationX] = useState(30);
  const [rotationZ, setRotationZ] = useState(45);
  const [realSensorData, setRealSensorData] = useState({});
  const [isLiveDataConnected, setIsLiveDataConnected] = useState(false);

  // FLOOR 4 - Demo Layout with simulated real data
  const floor4Rooms = [
    { id: '415', name: 'Executive Office', x: 50, z: 60, width: 110, depth: 180, capacity: 15 },
    { id: '414', name: 'Administration', x: 50, z: 260, width: 110, depth: 180, capacity: 8 },
    { id: '413', name: 'Faculty Office', x: 180, z: 60, width: 130, depth: 180, capacity: 20 },
    { id: '412', name: 'Faculty Lounge', x: 180, z: 260, width: 130, depth: 180, capacity: 30 },
    { id: '411', name: 'Student Lounge', x: 330, z: 60, width: 140, depth: 180, capacity: 50 },
    { id: '410', name: 'Student Study', x: 330, z: 260, width: 140, depth: 180, capacity: 40 },
    { id: '409', name: 'FabLab', x: 490, z: 60, width: 140, depth: 180, capacity: 25 },
    { id: '408', name: 'Workshop Studio', x: 490, z: 260, width: 140, depth: 180, capacity: 30, special: 'fablab' },
    { id: '401', name: 'Business Center', x: 650, z: 60, width: 150, depth: 180, capacity: 40 },
    { id: '401/2', name: 'Meeting 2', x: 650, z: 260, width: 150, depth: 35, capacity: 6 },
    { id: '401/3', name: 'Meeting 3', x: 650, z: 310, width: 150, depth: 35, capacity: 6 },
    { id: '401/4', name: 'Meeting 4', x: 650, z: 360, width: 150, depth: 35, capacity: 6 },
    { id: '401/1', name: 'Large Meeting', x: 650, z: 415, width: 150, depth: 45, capacity: 12 },
  ];

  // FLOOR 3 - Demo Layout
  const floor3Rooms = [
    { id: '323', name: 'Innovation Lab', x: 50, z: 60, width: 100, depth: 120, capacity: 30 },
    { id: '318', name: 'Academic Affairs', x: 50, z: 200, width: 100, depth: 120, capacity: 15 },
    { id: '322', name: 'Lecture 322', x: 170, z: 60, width: 120, depth: 120, capacity: 40 },
    { id: 'CSII', name: '🎭 CSII Digital Auditorium', x: 300, z: 60, width: 420, depth: 160, capacity: 300, special: 'auditorium' },
    { id: '317', name: 'Professor 317', x: 170, z: 240, width: 80, depth: 80, capacity: 9 },
    { id: '316', name: 'Professor 316', x: 270, z: 240, width: 80, depth: 80, capacity: 9 },
    { id: '315', name: 'Co-working 315', x: 370, z: 240, width: 80, depth: 80, capacity: 20 },
    { id: '314', name: 'Co-working 314', x: 470, z: 240, width: 80, depth: 80, capacity: 20 },
    { id: '312-313', name: 'Lecture 312-313', x: 570, z: 240, width: 100, depth: 80, capacity: 60 },
    { id: '310-311', name: 'Lecture 310-311', x: 690, z: 240, width: 100, depth: 80, capacity: 60 },
    { id: '302', name: 'Lecture 302', x: 830, z: 60, width: 150, depth: 180, capacity: 70 },
    { id: '301', name: 'Lecture 301', x: 830, z: 260, width: 150, depth: 180, capacity: 70 },
  ];

  // Simulated sensor data generator
  // const fetchRealData = (room) => {
  //   const now = new Date();
  //   const hour = now.getHours();
  //   const dayOfWeek = now.getDay();
  //   const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  //   const isWorkingHours = hour >= 8 && hour <= 18;
    
  //   // Base occupancy based on room type and time
  //   let baseOccupancy = 0;
  //   if (room.special === 'auditorium') {
  //     baseOccupancy = isWorkingHours && !isWeekend ? 
  //       Math.floor(room.capacity * (0.3 + Math.random() * 0.4)) : 
  //       Math.floor(room.capacity * 0.1);
  //   } else if (room.name.includes('Meeting')) {
  //     baseOccupancy = isWorkingHours && !isWeekend ? 
  //       Math.floor(room.capacity * (0.4 + Math.random() * 0.5)) : 0;
  //   } else if (room.name.includes('Study') || room.name.includes('Lounge')) {
  //     baseOccupancy = isWorkingHours ? 
  //       Math.floor(room.capacity * (0.5 + Math.random() * 0.3)) :
  //       Math.floor(room.capacity * (0.2 + Math.random() * 0.3));
  //   } else if (room.name.includes('Office')) {
  //     baseOccupancy = isWorkingHours && !isWeekend ? 
  //       Math.floor(room.capacity * (0.6 + Math.random() * 0.3)) : 
  //       Math.floor(room.capacity * 0.1);
  //   } else {
  //     baseOccupancy = isWorkingHours && !isWeekend ? 
  //       Math.floor(room.capacity * (0.4 + Math.random() * 0.4)) : 
  //       Math.floor(room.capacity * 0.2);
  //   }

  //   // Environmental data based on occupancy
  //   const tempBase = 22 + (baseOccupancy / room.capacity) * 3;
  //   const humidityBase = 45 + (baseOccupancy / room.capacity) * 15;
  //   const co2Base = 400 + (baseOccupancy * 50);
  //   const lightBase = isWorkingHours ? 600 + Math.random() * 200 : 200 + Math.random() * 100;

  //   // WiFi device simulation
  //   const devicesPerPerson = 1.8 + Math.random() * 0.7;
  //   const wifiDevices = Math.floor(baseOccupancy * devicesPerPerson);
  //   const confidence = Math.min(95, 60 + (baseOccupancy > 0 ? 20 : 0) + (wifiDevices > 0 ? 15 : 0));

  //   return {
  //     ...room,
  //     occupancy: baseOccupancy,
  //     temp: Math.round((tempBase + (Math.random() - 0.5) * 2) * 10) / 10,
  //     humidity: Math.round(humidityBase + (Math.random() - 0.5) * 10),
  //     co2: Math.round(co2Base + (Math.random() - 0.5) * 100),
  //     light: Math.round(lightBase),
  //     wifiDevices: wifiDevices,
  //     confidence: confidence,
  //     lastSeen: now.toISOString(),
  //     sensorStatus: Math.random() > 0.05 ? 'online' : 'offline',
  //     batteryLevel: 85 + Math.random() * 15,
  //     motionDetected: baseOccupancy > 0 && Math.random() > 0.2
  //   };
  // };

  const [data, setData] = useState({
  floors: {
    4: { name: 'Floor 4', desc: 'Live Feed From 4th Floor', rooms: floor4Rooms.map(room => ({
      ...room,
      occupancy: 0,
      temp: 0,
      humidity: 0,
      co2: 0,
      light: 0,
      wifiDevices: 0,
      confidence: 0,
      lastSeen: new Date().toISOString(),
      sensorStatus: 'offline',
      batteryLevel: 0,
      motionDetected: false
    }))},
    3: { name: 'Floor 3', desc: 'Live Feed from 3rd Floor', rooms: floor3Rooms.map(room => ({
      ...room,
      occupancy: 0,
      temp: 0,
      humidity: 0,
      co2: 0,
      light: 0,
      wifiDevices: 0,
      confidence: 0,
      lastSeen: new Date().toISOString(),
      sensorStatus: 'offline',
      batteryLevel: 0,
      motionDetected: false
    }))}
  },
  time: new Date(),
  totalSensors: 25,
  onlineSensors: 24,
  dataPoints: 15847,
  alerts: 2
});

  const floor = data.floors[selectedFloor];
  const total = floor.rooms.reduce((s, r) => s + r.occupancy, 0);
  const cap = floor.rooms.reduce((s, r) => s + r.capacity, 0);
  const temp = (floor.rooms.reduce((s, r) => s + r.temp, 0) / floor.rooms.length).toFixed(1);
  const hum = Math.round(floor.rooms.reduce((s, r) => s + r.humidity, 0) / floor.rooms.length);
  const co2 = Math.round(floor.rooms.reduce((s, r) => s + r.co2, 0) / floor.rooms.length);
  const avgConfidence = Math.round(floor.rooms.reduce((s, r) => s + r.confidence, 0) / floor.rooms.length);
  const floor = data.floors[selectedFloor];
  const total = floor.rooms.reduce((s, r) => s + r.occupancy, 0);
  const cap = floor.rooms.reduce((s, r) => s + r.capacity, 0);
  const temp = (floor.rooms.reduce((s, r) => s + r.temp, 0) / floor.rooms.length).toFixed(1);
  const hum = Math.round(floor.rooms.reduce((s, r) => s + r.humidity, 0) / floor.rooms.length);
  const co2 = Math.round(floor.rooms.reduce((s, r) => s + r.co2, 0) / floor.rooms.length);
  const avgConfidence = Math.round(floor.rooms.reduce((s, r) => s + r.confidence, 0) / floor.rooms.length);

  // ADD THESE LINES:
  // Calculate total sensors across all floors
  const totalSensors = [...floor4Rooms, ...floor3Rooms].length;
  
  // Count online sensors from real sensor data
  const onlineSensors = Object.values(realSensorData).filter(
    sensor => sensor.sensorStatus === 'online'
  ).length;

  // 3D Projection function - Isometric CAD style
  const project3D = (x, y, z) => {
    const scale = 0.8;
    const angleX = (rotationX * Math.PI) / 180;
    const angleZ = (rotationZ * Math.PI) / 180;
    
    // Apply rotation around X axis
    let y1 = y * Math.cos(angleX) - z * Math.sin(angleX);
    let z1 = y * Math.sin(angleX) + z * Math.cos(angleX);
    
    // Apply rotation around Z axis
    let x2 = x * Math.cos(angleZ) - y1 * Math.sin(angleZ);
    let y2 = x * Math.sin(angleZ) + y1 * Math.cos(angleZ);
    
    return {
      x: 500 + x2 * scale,
      y: 300 - y2 * scale - z1 * 0.5
    };
  };

  
// Simulate real-time updates (skip rooms with real sensors)
// useEffect(() => {
//   const interval = setInterval(() => {
//     setData(prevData => ({
//       ...prevData,
//       floors: {
//         ...prevData.floors,
//         [selectedFloor]: {
//           ...prevData.floors[selectedFloor],
//           rooms: prevData.floors[selectedFloor].rooms.map(room => {
//             // Skip rooms that have real sensor data
//             if (realSensorData[room.id]) {
//               return room; // Keep real data unchanged
//             }
//             // Generate simulated data for other rooms
//             return fetchRealData(room);
//           })
//         }
//       },
//       time: new Date(),
//       dataPoints: prevData.dataPoints + Math.floor(Math.random() * 25) + 1
//     }));
//     setLastUpdate(new Date());
//   }, 5000);

//   return () => clearInterval(interval);
// }, [selectedFloor, realSensorData]);
    
  // Fetch real ESP8266 sensor data
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const response = await fetch('https://csiibackened.onrender.com/api/rooms');
        if (response.ok) {
          const rooms = await response.json();
          setRealSensorData(rooms);
          setIsLiveDataConnected(Object.keys(rooms).length > 0);
          console.log('✅ ESP8266 data:', rooms);
        }
      } catch (error) {
        console.error('❌ Error:', error);
        setIsLiveDataConnected(false);
      }
    };
    fetchRealData();
    const interval = setInterval(fetchRealData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update ALL rooms with real data dynamically
  useEffect(() => {
    if (Object.keys(realSensorData).length > 0) {
      setData(prevData => {
        const updatedFloors = { ...prevData.floors };
        
        // Loop through each room in real sensor data
        Object.entries(realSensorData).forEach(([roomId, liveData]) => {
          const floorNumber = liveData.floor;
          
          // Update the appropriate floor
          if (updatedFloors[floorNumber]) {
            updatedFloors[floorNumber] = {
              ...updatedFloors[floorNumber],
              rooms: updatedFloors[floorNumber].rooms.map(room => 
                room.id === roomId ? {
                  ...room,
                  temp: liveData.temperature || room.temp,
                  humidity: liveData.humidity || room.humidity,
                  co2: liveData.co2 || room.co2,                    // NEW
                  mq135Raw: liveData.mq135Raw || room.mq135Raw,     // NEW
                  pm25: liveData.pm25 || room.pm25,                 // NEW
                  pm10: liveData.pm10 || room.pm10,                 // NEW
                  pm1: liveData.pm1 || room.pm1,                    // NEW
                  occupancy: liveData.occupancy || 0,
                  wifiDevices: liveData.wifiDevices || 0,
                  motionDetected: liveData.occupancy > 0,
                  sensorStatus: liveData.sensorStatus || 'offline'
                } : room
              )
            };
          }
        });
        
        return { ...prevData, floors: updatedFloors };
      });
    }
  }, [realSensorData]);
  // Auto-rotate 3D view
  useEffect(() => {
    if (view3D) {
      const interval = setInterval(() => {
        setRotationZ(prev => (prev + 0.5) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [view3D]);

  // Demo data export function
  // Export REAL sensor data from MongoDB - ALL ROOMS
const exportDemoData = async () => {
  try {
    // First, get list of all rooms
    const roomsResponse = await fetch('https://csiibackened.onrender.com/api/rooms');
    const currentRooms = await roomsResponse.json();
    const roomIds = Object.keys(currentRooms);
    
    if (roomIds.length === 0) {
      alert('No rooms found. Make sure ESP8266 devices are running.');
      return;
    }
    
    console.log('📡 Exporting data for rooms:', roomIds);
    
    // Fetch historical data for ALL rooms
    const allData = [];
    for (const roomId of roomIds) {
      try {
        const response = await fetch(`https://csiibackened.onrender.com/api/history/${roomId}?hours=168`);
        const roomData = await response.json();
        allData.push(...roomData);
        console.log(`✅ Room ${roomId}: ${roomData.length} readings`);
      } catch (error) {
        console.error(`❌ Error fetching room ${roomId}:`, error);
      }
    }
    
    if (allData.length === 0) {
      alert('No historical data available. Make sure devices have been running for a while.');
      return;
    }
    
    // Sort by timestamp
    allData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    // Convert to CSV
    const headers = [
      'Timestamp', 'Room_ID', 'Floor_ID', 'Building_ID', 'Temperature_C', 'Humidity_%', 
      'Occupancy_Count', 'WiFi_Devices', 'Sensor_Status'
    ];
    
    const rows = allData.map(reading => [
      new Date(reading.timestamp).toISOString(),
      reading.metadata?.roomId || 'unknown',
      reading.metadata?.floor || '',
      reading.metadata?.buildingId || 'CSII',
      reading.temperature || 0,
      reading.humidity || 0,
      reading.occupancy || 0,
      reading.wifiDevices || 0,
      reading.sensorStatus || 'unknown'
    ].join(','));
    
    const csvData = [headers.join(','), ...rows].join('\n');
    
    // Download CSV
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `csii_all_rooms_sensor_data_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log(`✅ Exported ${allData.length} readings from ${roomIds.length} room(s): ${roomIds.join(', ')}`);
    alert(`✅ Exported ${allData.length} readings from rooms: ${roomIds.join(', ')}`);
  } catch (error) {
    console.error('❌ Export error:', error);
    alert('Failed to export data. Check console for details.');
  }
};
//   const generateDemoCSVData = () => {
//     const headers = [
//       'Timestamp', 'Room_ID', 'Floor_ID', 'Building_ID', 'Temperature_C', 'Humidity_%', 
//       'CO2_PPM', 'Light_Level', 'Occupancy_Count', 'WiFi_Devices', 'Confidence_%',
//       'Motion_Detected', 'Sensor_Status', 'Battery_Level'
//     ];

//     const rows = [];
//     const now = new Date();
    
//     for (let day = 0; day < 7; day++) {
//       for (let hour = 0; hour < 24; hour++) {
//         [...floor4Rooms, ...floor3Rooms].forEach(room => {
//           const timestamp = new Date(now.getTime() - (day * 24 + (23 - hour)) * 60 * 60 * 1000);
//           const simulatedRoom = fetchRealData(room);
          
//           rows.push([
//             timestamp.toISOString(),
//             room.id,
//             selectedFloor,
//             'CS_Building',
//             simulatedRoom.temp,
//             simulatedRoom.humidity,
//             simulatedRoom.co2,
//             simulatedRoom.light,
//             simulatedRoom.occupancy,
//             simulatedRoom.wifiDevices,
//             simulatedRoom.confidence,
//             simulatedRoom.motionDetected,
//             simulatedRoom.sensorStatus,
//             simulatedRoom.batteryLevel
//           ].join(','));
//         });
//       }
//     }

  //   return [headers.join(','), ...rows].join('\n');
  // };

  // Generate Power BI template with REAL data - ALL ROOMS
const downloadPowerBITemplate = async () => {
  try {
    // Get list of all rooms
    const roomsResponse = await fetch('https://csiibackened.onrender.com/api/rooms');
    const currentRooms = await roomsResponse.json();
    const roomIds = Object.keys(currentRooms);
    
    if (roomIds.length === 0) {
      alert('No rooms found. Make sure ESP8266 devices are running.');
      return;
    }
    
    console.log('📊 Creating Power BI template for rooms:', roomIds);
    
    // Fetch data for all rooms
    const allData = [];
    const allStats = {};
    
    for (const roomId of roomIds) {
      try {
        // Get historical data
        const historyResponse = await fetch(`https://csiibackened.onrender.com/api/history/${roomId}?hours=168`);
        const roomHistory = await historyResponse.json();
        allData.push(...roomHistory);
        
        // Get statistics
        const statsResponse = await fetch(`https://csiibackened.onrender.com/api/stats/${roomId}?hours=168`);
        const roomStats = await statsResponse.json();
        allStats[roomId] = roomStats;
        
        console.log(`✅ Room ${roomId}: ${roomHistory.length} readings`);
      } catch (error) {
        console.error(`❌ Error fetching room ${roomId}:`, error);
      }
    }
    
    if (allData.length === 0) {
      alert('No data available. Make sure devices have been running for a while.');
      return;
    }
    
    // Sort by timestamp
    allData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    const powerBIConfig = {
      "name": "CSII Building IoT Analytics - All Rooms",
      "description": "Power BI template for all room sensors from MongoDB Atlas",
      "version": "1.0",
      "createdDate": new Date().toISOString(),
      "dataSource": {
        "type": "MongoDB Atlas",
        "connectionString": "mongodb+srv://sunnys_db_user:<password>@digital-twin.gq1elir.mongodb.net/",
        "database": "csii-iot",
        "collection": "sensor-readings",
        "note": "Replace <password> with your actual password"
      },
      "apiEndpoints": {
        "realtime_all": "https://csiibackened.onrender.com/api/rooms",
        "realtime_single": "https://csiibackened.onrender.com/api/rooms/{roomId}",
        "historical": "https://csiibackened.onrender.com/api/history/{roomId}?hours=168",
        "statistics": "https://csiibackened.onrender.com/api/stats/{roomId}?hours=168"
      },
      "rooms": roomIds.map(roomId => ({
        roomId: roomId,
        floor: currentRooms[roomId].floor,
        buildingId: currentRooms[roomId].buildingId || 'CSII',
        statistics: allStats[roomId]
      })),
      "sampleData": allData.slice(0, 500).map(reading => ({
        DateTime: reading.timestamp,
        RoomID: reading.metadata?.roomId,
        FloorID: reading.metadata?.floor,
        BuildingID: reading.metadata?.buildingId || 'CSII',
        Temperature: reading.temperature,
        Humidity: reading.humidity,
        Occupancy: reading.occupancy,
        WiFiDevices: reading.wifiDevices,
        SensorStatus: reading.sensorStatus
      })),
      "overallStatistics": {
        "totalRooms": roomIds.length,
        "totalReadings": allData.length,
        "dataRange": {
          "from": allData[0]?.timestamp,
          "to": allData[allData.length - 1]?.timestamp
        },
        "roomBreakdown": Object.keys(allStats).map(roomId => ({
          roomId: roomId,
          avgTemp: allStats[roomId].avgTemp,
          avgHumidity: allStats[roomId].avgHumidity,
          totalReadings: allStats[roomId].totalReadings
        }))
      },
      "measures": [
        "Average Temperature (All Rooms)",
        "Average Humidity (All Rooms)",
        "Peak Occupancy",
        "Room Utilization Rate",
        "WiFi Device Count",
        "Comfort Index"
      ],
      "visualizations": [
        {
          "type": "line_chart",
          "title": "Temperature Trends - All Rooms",
          "description": "Compare temperature across all monitored rooms over time"
        },
        {
          "type": "heatmap",
          "title": "Room Occupancy Heatmap",
          "description": "Visual representation of room usage patterns"
        },
        {
          "type": "bar_chart",
          "title": "Average Conditions by Room",
          "description": "Compare environmental conditions across rooms"
        },
        {
          "type": "gauge",
          "title": "Current Status Dashboard",
          "description": "Real-time readings from all active sensors"
        }
      ],
      "instructions": {
        "step1": "Import this JSON into Power BI Desktop",
        "step2": "Use the API endpoints to connect to live data",
        "step3": "Sample data is included for initial visualization testing",
        "step4": "Configure refresh schedule for real-time updates"
      }
    };

    const blob = new Blob([JSON.stringify(powerBIConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PowerBI_CSII_AllRooms_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log(`✅ Power BI template with ${allData.length} readings from ${roomIds.length} room(s)`);
    alert(`✅ Power BI template created with data from rooms: ${roomIds.join(', ')}`);
  } catch (error) {
    console.error('❌ Power BI export error:', error);
    alert('Failed to generate Power BI template. Check console for details.');
  }
};
    

  const generateSamplePowerBIData = () => {
    return floor.rooms.slice(0, 5).map(room => ({
      DateTime: new Date().toISOString(),
      RoomID: room.id,
      FloorID: selectedFloor.toString(),
      BuildingID: "CS_Building",
      Temperature: room.temp,
      Humidity: room.humidity,
      CO2PPM: room.co2,
      OccupancyCount: room.occupancy,
      Capacity: room.capacity,
      UtilizationRate: Math.round((room.occupancy / room.capacity) * 100),
      ComfortIndex: Math.round(100 - Math.abs(room.temp - 23) * 5 - Math.abs(room.humidity - 50) * 0.5)
    }));
  };

  // Render 3D CAD View
  const render3DView = () => {
    const roomHeight = 60;
    const floorThickness = 10;
    
    return (
      <svg width="1000" height="650" viewBox="0 0 1000 650" className="bg-gradient-to-b from-slate-950 to-slate-900">
        <defs>
          {/* CAD-style gradients for depth */}
          <linearGradient id="topFace" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.8"/>
          </linearGradient>
          <linearGradient id="sideFace" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e40af" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95"/>
          </linearGradient>
          <linearGradient id="frontFace" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.85"/>
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.95"/>
          </linearGradient>
          
          {/* Shadow effect */}
          <filter id="shadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="2" dy="4" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Grid pattern for floor */}
          <pattern id="grid3d" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="0.5"/>
          </pattern>
        </defs>

        <text x="500" y="30" textAnchor="middle" fill="#60a5fa" fontSize="20" fontWeight="bold">
          {floor.name} - 3D CAD View • Real-time Digital Twin
        </text>

        {/* Draw floor base */}
        <g filter="url(#shadow)">
          {/* Floor platform */}
          {(() => {
            const floorPoints = [
              project3D(-50, -50, 0),
              project3D(1000, -50, 0),
              project3D(1000, 500, 0),
              project3D(-50, 500, 0)
            ];
            return (
              <polygon
                points={floorPoints.map(p => `${p.x},${p.y}`).join(' ')}
                fill="url(#grid3d)"
                stroke="#1e40af"
                strokeWidth="2"
                opacity="0.3"
              />
            );
          })()}
        </g>

        {/* Draw each room as 3D box */}
        {floor.rooms.map(room => {
          const ratio = room.occupancy / room.capacity;
          const baseColor = ratio < 0.4 ? '#10b981' : ratio < 0.7 ? '#f59e0b' : '#ef4444';
          const color = room.special === 'fablab' ? '#f59e0b' : room.special === 'auditorium' ? '#a855f7' : baseColor;
          const isOffline = room.sensorStatus === 'offline';
          const roomColor = isOffline ? '#64748b' : color;
          
          // Calculate 3D corners
          const height = roomHeight * (0.5 + (room.occupancy / room.capacity) * 0.5);
          
          const bottomCorners = [
            project3D(room.x, room.z, 0),
            project3D(room.x + room.width, room.z, 0),
            project3D(room.x + room.width, room.z + room.depth, 0),
            project3D(room.x, room.z + room.depth, 0)
          ];
          
          const topCorners = [
            project3D(room.x, room.z, height),
            project3D(room.x + room.width, room.z, height),
            project3D(room.x + room.width, room.z + room.depth, height),
            project3D(room.x, room.z + room.depth, height)
          ];

          // Calculate visibility for face culling
          const isTopVisible = true;
          const isFrontVisible = topCorners[2].y > bottomCorners[2].y;
          const isRightVisible = topCorners[1].x > topCorners[0].x;

          return (
            <g key={room.id} onClick={() => setSelectedRoom(room)} className="cursor-pointer" filter="url(#shadow)">
              {/* Bottom face (for reference, usually hidden) */}
              
              {/* Front face */}
              {isFrontVisible && (
                <polygon
                  points={`${bottomCorners[2].x},${bottomCorners[2].y} ${bottomCorners[3].x},${bottomCorners[3].y} ${topCorners[3].x},${topCorners[3].y} ${topCorners[2].x},${topCorners[2].y}`}
                  fill="url(#frontFace)"
                  stroke={roomColor}
                  strokeWidth={selectedRoom?.id === room.id ? "3" : "1.5"}
                  opacity={isOffline ? "0.3" : "0.85"}
                />
              )}

              {/* Right side face */}
              {isRightVisible && (
                <polygon
                  points={`${bottomCorners[1].x},${bottomCorners[1].y} ${bottomCorners[2].x},${bottomCorners[2].y} ${topCorners[2].x},${topCorners[2].y} ${topCorners[1].x},${topCorners[1].y}`}
                  fill="url(#sideFace)"
                  stroke={roomColor}
                  strokeWidth={selectedRoom?.id === room.id ? "3" : "1.5"}
                  opacity={isOffline ? "0.3" : "0.75"}
                />
              )}

              {/* Top face */}
              {isTopVisible && (
                <polygon
                  points={topCorners.map(p => `${p.x},${p.y}`).join(' ')}
                  fill={roomColor}
                  fillOpacity={isOffline ? "0.2" : "0.5"}
                  stroke={roomColor}
                  strokeWidth={selectedRoom?.id === room.id ? "3" : "2"}
                />
              )}

              {/* Room label on top face */}
              <text
                x={(topCorners[0].x + topCorners[2].x) / 2}
                y={(topCorners[0].y + topCorners[2].y) / 2 - 15}
                textAnchor="middle"
                fill="white"
                fontSize="11"
                fontWeight="bold"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
              >
                {room.id} • {room.name}
              </text>

              {/* Occupancy data */}
              <text
                x={(topCorners[0].x + topCorners[2].x) / 2}
                y={(topCorners[0].y + topCorners[2].y) / 2}
                textAnchor="middle"
                fill={isOffline ? '#94a3b8' : '#fff'}
                fontSize="13"
                fontWeight="bold"
                style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}
              >
                {isOffline ? 'OFFLINE' : `👥 ${room.occupancy}/${room.capacity}`}
              </text>

              {/* WiFi data */}
              {!isOffline && (
                <text
                  x={(topCorners[0].x + topCorners[2].x) / 2}
                  y={(topCorners[0].y + topCorners[2].y) / 2 + 15}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.8)"
                  fontSize="9"
                  style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                >
                  📱 {room.wifiDevices} • {room.confidence}%
                </text>
              )}

              {/* Environmental data */}
              {!isOffline && room.width * room.depth > 20000 && (
                <text
                  x={(topCorners[0].x + topCorners[2].x) / 2}
                  y={(topCorners[0].y + topCorners[2].y) / 2 + 28}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.7)"
                  fontSize="8"
                  style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                >
                  🌡️{room.temp}°C • 💧{room.humidity}% • 🌬️{room.co2}
                </text>
              )}

              {/* Sensor status indicator */}
              <circle
                cx={topCorners[1].x - 8}
                cy={topCorners[1].y + 8}
                r="4"
                fill={isOffline ? '#ef4444' : '#10b981'}
                stroke="white"
                strokeWidth="1"
              />
            </g>
          );
        })}

        {/* 3D View Controls */}
        <g transform="translate(50, 550)">
          <rect width="200" height="80" fill="rgba(0,0,0,0.7)" rx="8"/>
          <text x="100" y="20" textAnchor="middle" fill="#60a5fa" fontSize="12" fontWeight="bold">
            3D View Controls
          </text>
          <text x="10" y="40" fill="#94a3b8" fontSize="10">
            Rotation X: {rotationX.toFixed(0)}°
          </text>
          <text x="10" y="60" fill="#94a3b8" fontSize="10">
            Rotation Z: {rotationZ.toFixed(0)}°
          </text>
        </g>

        {/* Legend */}
        <g transform="translate(800, 550)">
          <rect width="180" height="80" fill="rgba(0,0,0,0.7)" rx="8"/>
          <text x="90" y="20" textAnchor="middle" fill="#60a5fa" fontSize="12" fontWeight="bold">
            Occupancy Legend
          </text>
          <circle cx="20" cy="35" r="6" fill="#10b981"/>
          <text x="35" y="40" fill="white" fontSize="10">Low (&lt;40%)</text>
          <circle cx="20" cy="55" r="6" fill="#f59e0b"/>
          <text x="35" y="60" fill="white" fontSize="10">Medium (40-70%)</text>
          <circle cx="20" cy="75" r="6" fill="#ef4444"/>
          <text x="35" y="80" fill="white" fontSize="10">High (&gt;70%)</text>
        </g>
      </svg>
    );
  };

  // Render 2D floor plan
  const render2DView = () => {
    return (
      <svg width="1000" height="580" viewBox="0 0 1000 580" className="bg-slate-800 rounded-lg">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(100,116,139,0.3)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="1000" height="580" fill="url(#grid)" />
        <text x="500" y="30" textAnchor="middle" fill="#94a3b8" fontSize="18" fontWeight="bold">
          {floor.name} - {floor.desc} • Real-time Occupancy Data
        </text>
        
        {floor.rooms.map(room => {
          const ratio = room.occupancy / room.capacity;
          const color = ratio < 0.4 ? '#10b981' : ratio < 0.7 ? '#f59e0b' : '#ef4444';
          const large = room.width * room.depth > 40000;
          const special = room.special === 'fablab' ? '#f59e0b' : room.special === 'auditorium' ? '#a855f7' : color;
          const isOffline = room.sensorStatus === 'offline';
          
          return (
            <g key={room.id} onClick={() => setSelectedRoom(room)} className="cursor-pointer">
              <rect 
                x={room.x} 
                y={room.z + 50} 
                width={room.width} 
                height={room.depth} 
                fill={isOffline ? '#64748b' : special} 
                fillOpacity={isOffline ? "0.2" : "0.3"} 
                stroke={isOffline ? '#64748b' : special} 
                strokeWidth={selectedRoom?.id === room.id ? "4" : "2"} 
                rx="4" 
              />
              
              <circle 
                cx={room.x + room.width - 10} 
                cy={room.z + 50 + 10} 
                r="4" 
                fill={isOffline ? '#ef4444' : '#10b981'}
              />
              
              <text 
                x={room.x + 5} 
                y={room.z + 50 + 15} 
                fill="white" 
                fontSize="10" 
                fontWeight="bold"
                opacity="0.8"
              >
                {room.id}
              </text>
              
              <text 
                x={room.x + room.width/2} 
                y={room.z + 50 + (large ? room.depth/2 - 12 : room.depth/2 - 5)} 
                textAnchor="middle" 
                fill="white" 
                fontSize={large ? "13" : "10"} 
                fontWeight="bold"
              >
                {room.name}
              </text>
              
              <text 
                x={room.x + room.width/2} 
                y={room.z + 50 + (large ? room.depth/2 + 8 : room.depth/2 + 8)} 
                textAnchor="middle" 
                fill={isOffline ? '#64748b' : special} 
                fontSize={large ? "15" : "13"} 
                fontWeight="bold"
              >
                {isOffline ? 'OFFLINE' : `${room.occupancy}/${room.capacity}`}
              </text>
              
              {!isOffline && (
                <text 
                  x={room.x + room.width/2} 
                  y={room.z + 50 + (large ? room.depth/2 + 22 : room.depth/2 + 20)} 
                  textAnchor="middle" 
                  fill="rgba(255,255,255,0.6)" 
                  fontSize="8"
                >
                  📱 {room.wifiDevices} devices • {room.confidence}% confidence
                </text>
              )}
              
              {large && !isOffline && (
                <text 
                  x={room.x + room.width/2} 
                  y={room.z + 50 + room.depth/2 + 35} 
                  textAnchor="middle" 
                  fill="rgba(255,255,255,0.6)" 
                  fontSize="9"
                >
                  🌡️{room.temp}°C • 💧{room.humidity}% • 🌬️{room.co2}ppm
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-6">
      {/* Demo Banner */}
      {demoMode && (
         <div className="max-w-[1800px] mx-auto mb-4">
          <div className="bg-gradient-to-r from-pink-700/80 to-pink-700/80 backdrop-blur-xl rounded-lg p-3 border border-orange-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-orange-300 animate-pulse" />
              <span className="text-orange-200 font-medium">
                🚀 Draft - Dashboard for Digital Twin of CSII 3rd and 4th floor • Designed and Engineered by Sunny
              </span>
            </div>
            <button 
              onClick={() => setDemoMode(false)}
              className="text-orange-300 hover:text-orange-100 text-sm"
            >
              Hide Banner
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1800px] mx-auto">
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 backdrop-blur-xl rounded-2xl shadow-2xl p-6 mb-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-xl">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Digital Twin - CSII</h1>
                <p className="text-blue-200 mt-1">{floor.desc} • Real-time IoT Analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg">
                <button 
                  onClick={() => setSelectedFloor(4)} 
                  className={`px-5 py-3 rounded-md font-semibold ${selectedFloor === 4 ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700'}`}
                >
                  Floor 4
                </button>
                <button 
                  onClick={() => setSelectedFloor(3)} 
                  className={`px-5 py-3 rounded-md font-semibold ${selectedFloor === 3 ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700'}`}
                >
                  Floor 3
                </button>
              </div>
              <div className="flex items-center gap-2 bg-green-500/20 px-4 py-3 rounded-lg border border-green-400/30">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 font-semibold">LIVE</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            <div className="bg-purple-500/20 backdrop-blur p-4 rounded-xl border border-purple-400/30">
              <Users className="w-6 h-6 text-purple-300 mb-2" />
              <p className="text-3xl font-bold text-white">{total}</p>
              <p className="text-purple-200 text-sm">People</p>
            </div>
            <div className="bg-red-500/20 backdrop-blur p-4 rounded-xl border border-red-400/30">
              <Thermometer className="w-6 h-6 text-red-300 mb-2" />
              <p className="text-3xl font-bold text-white">{temp}°C</p>
              <p className="text-red-200 text-sm">Avg Temp</p>
            </div>
            <div className="bg-cyan-500/20 backdrop-blur p-4 rounded-xl border border-cyan-400/30">
              <Droplets className="w-6 h-6 text-cyan-300 mb-2" />
              <p className="text-3xl font-bold text-white">{hum}%</p>
              <p className="text-cyan-200 text-sm">Humidity</p>
            </div>
            <div className="bg-green-500/20 backdrop-blur p-4 rounded-xl border border-green-400/30">
              <Wind className="w-6 h-6 text-green-300 mb-2" />
              <p className="text-3xl font-bold text-white">{co2}</p>
              <p className="text-green-200 text-sm">CO₂ ppm</p>
            </div>
            <div className="bg-yellow-500/20 backdrop-blur p-4 rounded-xl border border-yellow-400/30">
              <MapPin className="w-6 h-6 text-yellow-300 mb-2" />
              <p className="text-3xl font-bold text-white">{floor.rooms.length}</p>
              <p className="text-yellow-200 text-sm">Rooms</p>
            </div>
            <div className="bg-indigo-500/20 backdrop-blur p-4 rounded-xl border border-indigo-400/30">
              <TrendingUp className="w-6 h-6 text-indigo-300 mb-2" />
              <p className="text-xl font-bold text-white">{avgConfidence}%</p>
              <p className="text-indigo-200 text-sm">Confidence</p>
            </div>
            <div className="bg-pink-500/20 backdrop-blur p-4 rounded-xl border border-pink-400/30">
              <Clock className="w-6 h-6 text-pink-300 mb-2" />
              <p className="text-lg font-bold text-white">{data.time.toLocaleTimeString()}</p>
              <p className="text-pink-200 text-sm">Updated</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-gradient-to-br from-slate-900/60 to-blue-900/40 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">
                {floor.name} - {view3D ? '3D CAD View' : '2D Floor Plan'}
              </h2>
              
              {/* 2D/3D Toggle Button */}
              <button
                onClick={() => setView3D(!view3D)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  view3D 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50' 
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50'
                } hover:scale-105`}
              >
                {view3D ? (
                  <>
                    <Layers className="w-5 h-5" />
                    Switch to 2D
                  </>
                ) : (
                  <>
                    <Box className="w-5 h-5" />
                    Switch to 3D
                  </>
                )}
              </button>
            </div>
            
            <div className="relative rounded-xl overflow-hidden bg-slate-900" style={{ height: '650px' }}>
              <div className="w-full h-full p-6 overflow-auto">
                {view3D ? render3DView() : render2DView()}
              </div>

              {/* Real-time update indicator */}
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur px-4 py-2 rounded-lg text-white text-sm">
                🔄 Last Update: {lastUpdate.toLocaleTimeString()}
              </div>

              {/* 3D rotation controls (only show in 3D mode) */}
              {view3D && (
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur px-4 py-3 rounded-lg">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <label className="text-white text-xs font-semibold w-20">Tilt X:</label>
                      <input
                        type="range"
                        min="0"
                        max="60"
                        value={rotationX}
                        onChange={(e) => setRotationX(Number(e.target.value))}
                        className="w-32"
                      />
                      <span className="text-white text-xs w-10">{rotationX}°</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Demo Data Export Panel */}
            <div className="bg-gradient-to-br from-green-900/60 to-emerald-900/60 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-green-400" />
                Data Analytics Demo
              </h3>
              
              <div className="space-y-3">
                <button 
                  onClick={exportDemoData}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download CSV Data
                </button>
                
                <button 
                  onClick={downloadPowerBITemplate}
                  className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  Power BI Template
                </button>
                
                <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-600/30">
                  <h4 className="font-semibold text-white text-sm mb-2">Analytics Pipeline:</h4>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Import CSV to analysis tool</li>
                    <li>• Profile dataset schema</li>
                    <li>• Preprocess and clean data</li>
                    <li>• Apply analytics operations</li>
                    <li>• Generate visualizations</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Selected Room Details */}
            {selectedRoom && (
              <div className="bg-indigo-900/60 backdrop-blur-xl rounded-2xl p-6 border border-indigo-500/20">
                <h3 className="text-xl font-bold text-white mb-4">{selectedRoom.name}</h3>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <Thermometer className="w-4 h-4 text-red-400 mb-1" />
                    <p className="text-2xl font-bold text-white">{selectedRoom.temp}°C</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <Droplets className="w-4 h-4 text-cyan-400 mb-1" />
                    <p className="text-2xl font-bold text-white">{selectedRoom.humidity}%</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <Wind className="w-4 h-4 text-green-400 mb-1" />
                    <p className="text-2xl font-bold text-white">{selectedRoom.co2}</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <Users className="w-4 h-4 text-purple-400 mb-1" />
                    <p className="text-2xl font-bold text-white">{selectedRoom.occupancy}/{selectedRoom.capacity}</p>
                  </div>
                </div>

                {/* WiFi Analytics */}
                <div className="bg-slate-800/30 p-3 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">📡 WiFi Device Detection</h4>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>Detected Devices: <span className="text-blue-400">{selectedRoom.wifiDevices}</span></p>
                    <p>Detection Confidence: <span className="text-green-400">{selectedRoom.confidence}%</span></p>
                    <p>Motion Sensor: <span className={selectedRoom.motionDetected ? "text-green-400" : "text-gray-500"}>
                      {selectedRoom.motionDetected ? "Active" : "Inactive"}
                    </span></p>
                    <p>Sensor Status: <span className={selectedRoom.sensorStatus === 'online' ? "text-green-400" : "text-red-400"}>
                      {selectedRoom.sensorStatus}
                    </span></p>
                  </div>
                </div>
              </div>
            )}

            {/* System Status */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-bold text-white mb-4">System Status</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Sensors:</span>
                  <span className="text-white font-bold">{data.totalSensors}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Online:</span>
                  <span className="text-green-400 font-bold">{data.onlineSensors}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Data Points Today:</span>
                  <span className="text-blue-400 font-bold">{data.dataPoints.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Active Alerts:</span>
                  <span className="text-yellow-400 font-bold">{data.alerts}</span>
                </div>

                <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-600/30">
                  <p className="text-blue-200 text-sm">
                    💡 <strong>Note:</strong> This Digital Twin Dashboard has been created for educational purposes and maintains privacy for the CSII community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
