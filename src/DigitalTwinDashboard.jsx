import React, { useState, useEffect, useRef } from 'react';
import { Users, Thermometer, Building2, Eye, Layers, Wind, Droplets, Clock, MapPin, Cpu, BookOpen } from 'lucide-react';

export default function CompleteDigitalTwin() {
  const canvasRef = useRef(null);
  const [selectedFloor, setSelectedFloor] = useState(4);
  const [view3D, setView3D] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // FLOOR 4 - Final Layout with corrected meeting rooms
  const floor4Rooms = [
    { id: '415', name: 'Faculty Office', x: 50, z: 60, width: 110, depth: 180, occupancy: 8, capacity: 15, temp: 23, humidity: 46, co2: 480 },
    { id: '414', name: 'Executive Office', x: 50, z: 260, width: 110, depth: 180, occupancy: 4, capacity: 8, temp: 22, humidity: 44, co2: 420 },
    { id: '413', name: 'Administration', x: 180, z: 60, width: 130, depth: 180, occupancy: 12, capacity: 20, temp: 23, humidity: 47, co2: 520 },
    { id: '412', name: 'Faculty Lounge', x: 180, z: 260, width: 130, depth: 180, occupancy: 18, capacity: 30, temp: 23, humidity: 50, co2: 580 },
    { id: '411', name: 'Student Lounge', x: 330, z: 60, width: 140, depth: 180, occupancy: 35, capacity: 50, temp: 24, humidity: 52, co2: 650 },
    { id: '410', name: 'Student Study', x: 330, z: 260, width: 140, depth: 180, occupancy: 28, capacity: 40, temp: 23, humidity: 48, co2: 600 },
    { id: '409', name: 'Workshop Studio', x: 490, z: 60, width: 140, depth: 180, occupancy: 15, capacity: 25, temp: 22, humidity: 45, co2: 520 },
    { id: '408', name: '🔧 FabLab', x: 490, z: 260, width: 140, depth: 180, occupancy: 20, capacity: 30, temp: 21, humidity: 43, co2: 480, special: 'fablab' },
    { id: '401', name: 'Business Center', x: 650, z: 60, width: 150, depth: 180, occupancy: 25, capacity: 40, temp: 22, humidity: 46, co2: 540 },
    
    // Small parallel meeting rooms replacing 401/1
    { id: '401/2', name: 'Meeting 2', x: 650, z: 260, width: 150, depth: 35, occupancy: 3, capacity: 6, temp: 23, humidity: 44, co2: 420 },
    { id: '401/3', name: 'Meeting 3', x: 650, z: 310, width: 150, depth: 35, occupancy: 4, capacity: 6, temp: 22, humidity: 45, co2: 430 },
    { id: '401/4', name: 'Meeting 4', x: 650, z: 360, width: 150, depth: 35, occupancy: 2, capacity: 6, temp: 23, humidity: 44, co2: 410 },
    
    // Large meeting room in former 401/4 position
    { id: '401/1', name: 'Large Meeting', x: 650, z: 415, width: 150, depth: 45, occupancy: 8, capacity: 12, temp: 22, humidity: 45, co2: 460 },
  ];

  // FLOOR 3 - Final Correct Layout with 302/301 separated by lobby on far right
  const floor3Rooms = [
    // Top row - left to right
    { id: '323', name: 'Innovation Lab', x: 50, z: 60, width: 100, depth: 120, occupancy: 18, capacity: 30, temp: 22, humidity: 47, co2: 540 },
    { id: '322', name: 'Lecture 322', x: 170, z: 60, width: 100, depth: 120, occupancy: 28, capacity: 40, temp: 23, humidity: 48, co2: 600 },
    { id: 'CSII', name: '🎭 CSII Digital Auditorium', x: 290, z: 60, width: 280, depth: 120, occupancy: 220, capacity: 300, temp: 22, humidity: 49, co2: 780, special: 'auditorium' },
    
    // Bottom row opposite - in separate parallel columns continuing the sequence
    { id: '318', name: 'Academic Affairs', x: 50, z: 200, width: 100, depth: 80, occupancy: 10, capacity: 15, temp: 23, humidity: 46, co2: 500 },
    { id: '317', name: 'Professor 317', x: 170, z: 200, width: 80, depth: 80, occupancy: 6, capacity: 9, temp: 23, humidity: 44, co2: 460 },
    { id: '316', name: 'Professor 316', x: 270, z: 200, width: 80, depth: 80, occupancy: 5, capacity: 9, temp: 22, humidity: 45, co2: 450 },
    { id: '315', name: 'Co-working 315', x: 370, z: 200, width: 80, depth: 80, occupancy: 15, capacity: 20, temp: 23, humidity: 47, co2: 530 },
    { id: '314', name: 'Co-working 314', x: 470, z: 200, width: 80, depth: 80, occupancy: 12, capacity: 20, temp: 23, humidity: 46, co2: 520 },
    
    // Continuing the parallel sequence after 314
    { id: '312-313', name: 'Lecture 312-313', x: 570, z: 200, width: 100, depth: 80, occupancy: 45, capacity: 60, temp: 24, humidity: 50, co2: 650 },
    { id: '310-311', name: 'Lecture 310-311', x: 690, z: 200, width: 100, depth: 80, occupancy: 42, capacity: 60, temp: 23, humidity: 49, co2: 640 },
    
    // Far right rooms - separated by lobby, in different columns
    { id: '302', name: 'Lecture 302', x: 830, z: 60, width: 150, depth: 180, occupancy: 50, capacity: 70, temp: 23, humidity: 50, co2: 680 },
    { id: '301', name: 'Lecture 301', x: 830, z: 260, width: 150, depth: 140, occupancy: 48, capacity: 70, temp: 24, humidity: 51, co2: 670 },
  ];

  const [data, setData] = useState({
    floors: {
      4: { name: 'Floor 4', desc: 'Offices, Lounges & FabLab', rooms: floor4Rooms },
      3: { name: 'Floor 3', desc: 'Auditorium & Lecture Rooms', rooms: floor3Rooms }
    },
    time: new Date()
  });

  const floor = data.floors[selectedFloor];
  const total = floor.rooms.reduce((s, r) => s + r.occupancy, 0);
  const cap = floor.rooms.reduce((s, r) => s + r.capacity, 0);
  const temp = (floor.rooms.reduce((s, r) => s + r.temp, 0) / floor.rooms.length).toFixed(1);
  const hum = Math.round(floor.rooms.reduce((s, r) => s + r.humidity, 0) / floor.rooms.length);
  const co2 = Math.round(floor.rooms.reduce((s, r) => s + r.co2, 0) / floor.rooms.length);

  useEffect(() => {
    if (!canvasRef.current || !view3D || !window.THREE) return;

    let scene, camera, renderer, animationId;
    let mouseX = 0, mouseY = 0, targetX = 500, targetZ = 700;

    const init = () => {
      scene = new window.THREE.Scene();
      scene.background = new window.THREE.Color(0x0a0e1a);
      scene.fog = new window.THREE.Fog(0x0a0e1a, 800, 2000);

      camera = new window.THREE.PerspectiveCamera(50, canvasRef.current.clientWidth / canvasRef.current.clientHeight, 1, 3000);
      camera.position.set(500, 500, 700);
      camera.lookAt(500, 0, 300);

      renderer = new window.THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
      renderer.shadowMap.enabled = true;

      const ambientLight = new window.THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      const mainLight = new window.THREE.DirectionalLight(0xffffff, 0.8);
      mainLight.position.set(500, 600, 400);
      mainLight.castShadow = true;
      scene.add(mainLight);

      const floor = new window.THREE.Mesh(
        new window.THREE.PlaneGeometry(1200, 700),
        new window.THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);

      const grid = new window.THREE.GridHelper(1200, 60, 0x334155, 0x1a1f2e);
      grid.position.y = 0.5;
      scene.add(grid);

      data.floors[selectedFloor].rooms.forEach(room => {
        const ratio = room.occupancy / room.capacity;
        const color = ratio < 0.4 ? 0x10b981 : ratio < 0.7 ? 0xf59e0b : 0xef4444;
        const wallMat = new window.THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.5 });
        
        [
          [room.width, 100, 4, room.x + room.width/2, 50, room.z],
          [room.width, 100, 4, room.x + room.width/2, 50, room.z + room.depth],
          [4, 100, room.depth, room.x, 50, room.z + room.depth/2],
          [4, 100, room.depth, room.x + room.width, 50, room.z + room.depth/2]
        ].forEach(([w, h, d, x, y, z]) => {
          const wall = new window.THREE.Mesh(new window.THREE.BoxGeometry(w, h, d), wallMat);
          wall.position.set(x, y, z);
          wall.castShadow = true;
          scene.add(wall);
        });

        // Room label in 3D
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 256;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(0, 0, 512, 256);
        ctx.strokeStyle = ratio < 0.4 ? '#10b981' : ratio < 0.7 ? '#f59e0b' : '#ef4444';
        ctx.lineWidth = 4;
        ctx.strokeRect(8, 8, 496, 240);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(room.name, 256, 70);
        ctx.font = 'bold 56px Arial';
        ctx.fillStyle = ratio < 0.4 ? '#10b981' : ratio < 0.7 ? '#f59e0b' : '#ef4444';
        ctx.fillText(`${room.occupancy}/${room.capacity}`, 256, 140);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '24px Arial';
        ctx.fillText('PEOPLE', 256, 170);
        ctx.fillText(`${room.temp}°C`, 256, 200);

        const texture = new window.THREE.CanvasTexture(canvas);
        const sprite = new window.THREE.Sprite(new window.THREE.SpriteMaterial({ map: texture }));
        sprite.position.set(room.x + room.width/2, 150, room.z + room.depth/2);
        sprite.scale.set(100, 50, 1);
        scene.add(sprite);

        for (let i = 0; i < room.occupancy; i++) {
          const person = new window.THREE.Mesh(
            new window.THREE.CylinderGeometry(2.5, 2.5, 18, 8),
            new window.THREE.MeshStandardMaterial({ color: 0x60a5fa, emissive: 0x3b82f6, emissiveIntensity: 0.6 })
          );
          person.position.set(
            room.x + 20 + Math.random() * (room.width - 40),
            9,
            room.z + 20 + Math.random() * (room.depth - 40)
          );
          person.userData.baseY = 9;
          person.userData.offset = Math.random() * Math.PI * 2;
          scene.add(person);
        }
      });

      document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        targetX = 500 + mouseX * 200;
        targetZ = 700 + mouseY * 100;
      });
    };

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.z += (targetZ - camera.position.z) * 0.05;
      camera.lookAt(500, 0, 300);

      const time = Date.now() * 0.001;
      scene.children.forEach(child => {
        if (child.geometry?.type === 'CylinderGeometry') {
          child.position.y = child.userData.baseY + Math.sin(time + child.userData.offset) * 1.5;
          child.rotation.y += 0.008;
        }
      });

      renderer.render(scene, camera);
    };

    init();
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      if (renderer) renderer.dispose();
    };
  }, [view3D, selectedFloor, data]);

  useEffect(() => {
    const int = setInterval(() => {
      setData(p => ({
        ...p,
        floors: {
          ...p.floors,
          [selectedFloor]: {
            ...p.floors[selectedFloor],
            rooms: p.floors[selectedFloor].rooms.map(r => ({
              ...r,
              occupancy: Math.max(0, Math.min(r.capacity, r.occupancy + Math.floor(Math.random() * 3) - 1))
            }))
          }
        },
        time: new Date()
      }));
    }, 5000);
    return () => clearInterval(int);
  }, [selectedFloor]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 backdrop-blur-xl rounded-2xl shadow-2xl p-6 mb-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-xl">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Building Digital Twin</h1>
                <p className="text-blue-200 mt-1">{floor.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg">
                <button onClick={() => setSelectedFloor(4)} className={`px-5 py-3 rounded-md font-semibold ${selectedFloor === 4 ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700'}`}>
                  Floor 4
                </button>
                <button onClick={() => setSelectedFloor(3)} className={`px-5 py-3 rounded-md font-semibold ${selectedFloor === 3 ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700'}`}>
                  Floor 3
                </button>
              </div>
              <button onClick={() => setView3D(!view3D)} className="flex items-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-lg hover:bg-purple-700 font-semibold">
                {view3D ? <Layers className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                {view3D ? '2D' : '3D'}
              </button>
              <div className="flex items-center gap-2 bg-green-500/20 px-4 py-3 rounded-lg border border-green-400/30">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 font-semibold">LIVE</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-purple-500/20 backdrop-blur p-4 rounded-xl border border-purple-400/30">
              <Users className="w-6 h-6 text-purple-300 mb-2" />
              <p className="text-3xl font-bold text-white">{total}</p>
              <p className="text-purple-200 text-sm">People</p>
            </div>
            <div className="bg-red-500/20 backdrop-blur p-4 rounded-xl border border-red-400/30">
              <Thermometer className="w-6 h-6 text-red-300 mb-2" />
              <p className="text-3xl font-bold text-white">{temp}°C</p>
              <p className="text-red-200 text-sm">Temp</p>
            </div>
            <div className="bg-cyan-500/20 backdrop-blur p-4 rounded-xl border border-cyan-400/30">
              <Droplets className="w-6 h-6 text-cyan-300 mb-2" />
              <p className="text-3xl font-bold text-white">{hum}%</p>
              <p className="text-cyan-200 text-sm">Humidity</p>
            </div>
            <div className="bg-green-500/20 backdrop-blur p-4 rounded-xl border border-green-400/30">
              <Wind className="w-6 h-6 text-green-300 mb-2" />
              <p className="text-3xl font-bold text-white">{co2}</p>
              <p className="text-green-200 text-sm">CO₂</p>
            </div>
            <div className="bg-yellow-500/20 backdrop-blur p-4 rounded-xl border border-yellow-400/30">
              <MapPin className="w-6 h-6 text-yellow-300 mb-1" />
              <p className="text-3xl font-bold text-white">{floor.rooms.length}</p>
              <p className="text-yellow-200 text-sm">Rooms</p>
            </div>
            <div className="bg-indigo-500/20 backdrop-blur p-4 rounded-xl border border-indigo-400/30">
              <Clock className="w-6 h-6 text-indigo-300 mb-2" />
              <p className="text-xl font-bold text-white">{data.time.toLocaleTimeString()}</p>
              <p className="text-indigo-200 text-sm">Updated</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-gradient-to-br from-slate-900/60 to-blue-900/40 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-blue-500/20">
            <h2 className="text-2xl font-bold text-white mb-4">{floor.name} - {view3D ? '3D' : '2D'} View</h2>
            
            <div className="relative rounded-xl overflow-hidden bg-slate-900" style={{ height: '650px' }}>
              {view3D ? (
                <>
                  <canvas ref={canvasRef} className="w-full h-full" />
                  <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur px-4 py-2 rounded-lg text-white text-sm">
                    🖱️ Move mouse to rotate • Real-time 3D visualization
                  </div>
                </>
              ) : (
                <div className="w-full h-full p-6 overflow-auto">
                  <svg width="1000" height="580" viewBox="0 0 1000 580" className="bg-slate-800 rounded-lg">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(100,116,139,0.3)" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="1000" height="580" fill="url(#grid)" />
                    <text x="500" y="30" textAnchor="middle" fill="#94a3b8" fontSize="18" fontWeight="bold">
                      {floor.name} - {floor.desc}
                    </text>
                    
                    {floor.rooms.map(room => {
                      const ratio = room.occupancy / room.capacity;
                      const color = ratio < 0.4 ? '#10b981' : ratio < 0.7 ? '#f59e0b' : '#ef4444';
                      const large = room.width * room.depth > 40000;
                      const special = room.special === 'fablab' ? '#f59e0b' : room.special === 'auditorium' ? '#a855f7' : color;
                      
                      return (
                        <g key={room.id} onClick={() => setSelectedRoom(room)} className="cursor-pointer">
                          <rect 
                            x={room.x} 
                            y={room.z + 50} 
                            width={room.width} 
                            height={room.depth} 
                            fill={special} 
                            fillOpacity="0.3" 
                            stroke={special} 
                            strokeWidth={selectedRoom?.id === room.id ? "4" : "2"} 
                            rx="4" 
                          />
                          
                          {/* Room ID Label */}
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
                          
                          {/* Room Name */}
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
                          
                          {/* Occupancy */}
                          <text 
                            x={room.x + room.width/2} 
                            y={room.z + 50 + (large ? room.depth/2 + 8 : room.depth/2 + 8)} 
                            textAnchor="middle" 
                            fill={special} 
                            fontSize={large ? "15" : "13"} 
                            fontWeight="bold"
                          >
                            {room.occupancy}/{room.capacity}
                          </text>
                          
                          {/* Environmental data for larger rooms */}
                          {large && (
                            <text 
                              x={room.x + room.width/2} 
                              y={room.z + 50 + room.depth/2 + 22} 
                              textAnchor="middle" 
                              fill="rgba(255,255,255,0.6)" 
                              fontSize="9"
                            >
                              {room.temp}°C • {room.humidity}% • {room.co2}ppm
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {selectedRoom && (
              <div className="bg-indigo-900/60 backdrop-blur-xl rounded-2xl p-6 border border-indigo-500/20">
                <h3 className="text-xl font-bold text-white mb-4">{selectedRoom.name}</h3>
                <div className="grid grid-cols-2 gap-3">
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
              </div>
            )}

            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-bold text-white mb-4">All Rooms ({floor.rooms.length})</h2>
              <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2">
                {floor.rooms.map(room => {
                  const ratio = room.occupancy / room.capacity;
                  const color = ratio < 0.4 ? 'green' : ratio < 0.7 ? 'orange' : 'red';
                  return (
                    <div key={room.id} onClick={() => setSelectedRoom(room)} className={`p-3 rounded-lg cursor-pointer border ${selectedRoom?.id === room.id ? 'bg-purple-500/40 border-purple-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-white text-sm">{room.name}</h3>
                          <p className="text-xs text-gray-400 mt-1">{room.temp}°C • {room.co2}ppm</p>
                        </div>
                        <span className={`text-${color}-400 font-bold`}>{room.occupancy}/{room.capacity}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div className={`h-full bg-${color}-500 rounded-full`} style={{ width: `${(ratio * 100)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}