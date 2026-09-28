import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  Activity, ChevronDown, CircleHelp, Gauge, Grip, Maximize2, Pause,
  Play, RotateCcw, Settings2, Thermometer, Wind, Zap,
} from 'lucide-react';

const COMPOUNDS = {
  Soft: { color: '#e74632', base: 91, wear: 0.09, pressure: 21.8 },
  Medium: { color: '#f0c94b', base: 84, wear: 0.055, pressure: 22.1 },
  Hard: { color: '#e9ece7', base: 77, wear: 0.032, pressure: 22.5 },
};
const INITIAL_TYRES = [
  { key: 'FL', label: 'Front left', temp: 82, wear: 14, pressure: 22.4 },
  { key: 'FR', label: 'Front right', temp: 84, wear: 12, pressure: 22.3 },
  { key: 'RL', label: 'Rear left', temp: 87, wear: 18, pressure: 21.9 },
  { key: 'RR', label: 'Rear right', temp: 85, wear: 16, pressure: 22.0 },
];

function Tire({ position, compoundColor }) {
  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.24, 32]} />
        <meshStandardMaterial color="#171918" roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.126, 0]}>
        <cylinderGeometry args={[0.205, 0.205, 0.012, 32]} />
        <meshStandardMaterial color={compoundColor} roughness={0.55} metalness={0.16} />
      </mesh>
      <mesh position={[0, -0.126, 0]}>
        <cylinderGeometry args={[0.205, 0.205, 0.012, 32]} />
        <meshStandardMaterial color={compoundColor} roughness={0.55} metalness={0.16} />
      </mesh>
    </group>
  );
}

function CarModel({ paint, compoundColor, driving, speed, aeroProfile }) {
  const car = useRef();
  const phase = useRef(0);

  useFrame((_, delta) => {
    if (!car.current) return;
    if (driving) {
      phase.current += delta * (0.12 + (speed / 340) * 0.55) * (aeroProfile === 'Low drag' ? 1.08 : 1);
      const angle = phase.current;
      car.current.position.set(Math.cos(angle) * 3.9, 0.02, Math.sin(angle) * 2.25);
      car.current.rotation.y = -angle + Math.PI / 2;
    } else {
      car.current.position.set(0, 0.02, 0);
      car.current.rotation.y = -0.42;
    }
  });

  const dark = '#151817';
  const carbon = '#242927';
  return (
    <group ref={car} position={[0, 0.02, 0]} rotation={[0, -0.42, 0]} scale={1.12}>
      <mesh castShadow receiveShadow position={[0, 0.36, 0.02]}>
        <boxGeometry args={[0.76, 0.24, 1.56]} />
        <meshStandardMaterial color={paint} metalness={0.3} roughness={0.32} />
      </mesh>
      <mesh castShadow position={[0, 0.37, -1.03]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.24, 0.82, 4]} />
        <meshStandardMaterial color={paint} metalness={0.25} roughness={0.36} />
      </mesh>
      <mesh castShadow position={[0, 0.42, 0.69]}>
        <boxGeometry args={[0.92, 0.3, 0.54]} />
        <meshStandardMaterial color={paint} metalness={0.3} roughness={0.34} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} castShadow position={[side * 0.53, 0.3, 0.03]}>
          <boxGeometry args={[0.37, 0.2, 0.88]} />
          <meshStandardMaterial color={paint} metalness={0.26} roughness={0.38} />
        </mesh>
      ))}
      <mesh castShadow position={[0, 0.63, -0.32]}>
        <sphereGeometry args={[0.32, 28, 20]} />
        <meshStandardMaterial color={carbon} metalness={0.65} roughness={0.27} />
      </mesh>
      <mesh position={[0, 0.57, -0.35]}>
        <sphereGeometry args={[0.23, 24, 16]} />
        <meshStandardMaterial color="#d3d7cf" metalness={0.35} roughness={0.2} />
      </mesh>
      <mesh castShadow position={[0, 0.7, 0.94]}>
        <boxGeometry args={[1.9, 0.07, 0.17]} />
        <meshStandardMaterial color={dark} metalness={0.66} roughness={0.3} />
      </mesh>
      <mesh castShadow position={[0, 0.56, 1.01]}>
        <boxGeometry args={[0.1, 0.31, 0.12]} />
        <meshStandardMaterial color={dark} metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh castShadow position={[0, 0.23, -1.27]}>
        <boxGeometry args={[1.8, 0.065, 0.2]} />
        <meshStandardMaterial color={dark} metalness={0.65} roughness={0.35} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh castShadow position={[side * 0.85, 0.21, -1.02]}>
            <boxGeometry args={[0.16, 0.45, 0.12]} />
            <meshStandardMaterial color={dark} metalness={0.4} roughness={0.38} />
          </mesh>
          <mesh castShadow position={[side * 0.64, 0.2, -0.89]}>
            <boxGeometry args={[0.56, 0.12, 0.28]} />
            <meshStandardMaterial color={carbon} metalness={0.38} roughness={0.42} />
          </mesh>
        </group>
      ))}
      <mesh castShadow position={[0, 0.22, 0.83]}>
        <boxGeometry args={[2.03, 0.06, 0.17]} />
        <meshStandardMaterial color={dark} metalness={0.65} roughness={0.35} />
      </mesh>
      {[
        [-0.68, 0.3, -0.78], [0.68, 0.3, -0.78],
        [-0.68, 0.3, 0.67], [0.68, 0.3, 0.67],
      ].map((position, index) => <Tire key={index} position={position} compoundColor={compoundColor} />)}
      <mesh position={[0, 0.37, -1.19]}>
        <boxGeometry args={[0.1, 0.045, 0.08]} />
        <meshBasicMaterial color="#edf2e6" />
      </mesh>
    </group>
  );
}

function Track() {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
      <mesh>
        <ringGeometry args={[2.52, 5.1, 96]} />
        <meshStandardMaterial color="#333835" roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.006, 0]}>
        <ringGeometry args={[2.45, 2.55, 96]} />
        <meshBasicMaterial color="#d6d9ce" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.007, 0]}>
        <ringGeometry args={[5.08, 5.18, 96]} />
        <meshBasicMaterial color="#d6d9ce" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.012, 0]}>
        <ringGeometry args={[3.72, 3.76, 96]} />
        <meshBasicMaterial color="#8e958a" side={THREE.DoubleSide} transparent opacity={0.32} />
      </mesh>
    </group>
  );
}

function RaceScene({ paint, compoundColor, driving, speed, aeroProfile, view }) {
  return (
    <Canvas shadows dpr={[1, 1.6]} camera={{ position: view === 'DETAIL' ? [5, 4.5, 6] : [8, 7, 9], fov: view === 'DETAIL' ? 31 : 37 }}>
      <color attach="background" args={['#191c19']} />
      <fog attach="fog" args={['#191c19', 15, 30]} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 9, 5]} intensity={2.4} castShadow shadow-mapSize={[1024, 1024]} />
      <spotLight position={[-7, 8, -5]} intensity={100} angle={0.45} penumbra={1} color="#f0c6a9" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.035, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#202420" roughness={0.96} />
      </mesh>
      <Track />
      <CarModel paint={paint} compoundColor={compoundColor} driving={driving} speed={speed} aeroProfile={aeroProfile} />
      <ContactShadows position={[0, 0, 0]} opacity={0.45} scale={13} blur={2.4} far={4} />
      <Environment preset="city" />
      <OrbitControls enablePan={false} minDistance={7} maxDistance={17} minPolarAngle={0.28} maxPolarAngle={1.43} />
    </Canvas>
  );
}

function TemperatureChart({ history }) {
  const width = 640;
  const height = 120;
  const points = history.map((value, index) => {
    const x = history.length < 2 ? width : (index / (history.length - 1)) * width;
    const y = height - ((value - 60) / 50) * height;
    return `${x},${Math.max(0, Math.min(height, y))}`;
  }).join(' ');
  const area = `0,${height} ${points} ${width},${height}`;
  return (
    <svg className="temperature-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label="Average tire temperature history">
      <defs>
        <linearGradient id="temp-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#c7eb4d" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#c7eb4d" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[25, 60, 95].map((y) => <line key={y} x1="0" x2={width} y1={y} y2={y} stroke="#394039" strokeDasharray="3 6" />)}
      <polygon points={area} fill="url(#temp-fill)" />
      <polyline points={points} fill="none" stroke="#c7eb4d" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function TyreCard({ tyre, compound }) {
  const tempStatus = tyre.temp > 105 ? 'hot' : tyre.temp < 72 ? 'cool' : 'good';
  return (
    <article className="tyre-card">
      <div className="tyre-card-top">
        <div className="tyre-id"><span className={`tyre-dot ${tempStatus}`} />{tyre.key}</div>
        <span className="tyre-position">{tyre.label}</span>
      </div>
      <div className="tyre-visual-row">
        <div className="tyre-visual" style={{ '--compound': compound.color }}><span>{compound === COMPOUNDS.Soft ? 'S' : compound === COMPOUNDS.Medium ? 'M' : 'H'}</span></div>
        <div className="tyre-readings">
          <div><strong>{Math.round(tyre.temp)}°</strong><span>CORE TEMP</span></div>
          <div><strong>{tyre.pressure.toFixed(1)} <small>psi</small></strong><span>PRESSURE</span></div>
        </div>
      </div>
      <div className="wear-label"><span>DEGRADATION</span><span>{Math.round(tyre.wear)}%</span></div>
      <div className="wear-track"><span style={{ width: `${Math.max(5, 100 - tyre.wear)}%` }} /></div>
    </article>
  );
}

function App() {
  const [compoundName, setCompoundName] = useState('Medium');
  const [driving, setDriving] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [brakeBalance, setBrakeBalance] = useState(54);
  const [aeroProfile, setAeroProfile] = useState('Balanced');
  const [tyres, setTyres] = useState(INITIAL_TYRES);
  const [history, setHistory] = useState(Array(28).fill(82));
  const [lap, setLap] = useState(1);
  const [elapsed, setElapsed] = useState(0);
  const viewerRef = useRef(null);
  const compound = COMPOUNDS[compoundName];
  const speedRef = useRef(speed);

  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    if (!driving) return undefined;
    const timer = window.setInterval(() => {
      setElapsed((previous) => {
        const next = previous + 1;
        if (next >= 92) {
          setLap((current) => current + 1);
          return 0;
        }
        return next;
      });
      setTyres((previous) => {
        const pace = speedRef.current / 240 * (aeroProfile === 'Low drag' ? 0.94 : 1);
        const next = previous.map((tyre, index) => ({
          ...tyre,
          temp: THREE.MathUtils.clamp(tyre.temp + (compound.base + pace * 9 - tyre.temp) * 0.13 + (Math.random() - 0.48) * 1.5, 62, 122),
          wear: THREE.MathUtils.clamp(tyre.wear + compound.wear * pace * (index > 1 ? 1.16 : 0.88), 0, 100),
          pressure: THREE.MathUtils.clamp(tyre.pressure + (compound.pressure + pace * 0.9 - tyre.pressure) * 0.08, 19, 27),
        }));
        const average = next.reduce((total, tyre) => total + tyre.temp, 0) / next.length;
        setHistory((values) => [...values.slice(1), average]);
        return next;
      });
    }, 850);
    return () => window.clearInterval(timer);
  }, [driving, compound, aeroProfile]);

  useEffect(() => {
    function handleKey(event) {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (event.code === 'Space') {
        event.preventDefault();
        setDriving((active) => !active);
        setSpeed((current) => current === 0 ? 188 : current);
      } else if (event.key.toLowerCase() === 'w' || event.key === 'ArrowUp') {
        setSpeed((current) => Math.min(340, current + 8));
      } else if (event.key.toLowerCase() === 's' || event.key === 'ArrowDown') {
        setSpeed((current) => Math.max(0, current - 12));
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  function toggleDrive() {
    setDriving((active) => !active);
    setSpeed((current) => current === 0 ? 188 : current);
  }

  function resetSession() {
    setDriving(false);
    setSpeed(0);
    setElapsed(0);
    setLap(1);
    setTyres(INITIAL_TYRES);
    setHistory(Array(28).fill(82));
  }

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await viewerRef.current?.requestFullscreen();
    }
  }

  const averageTemp = Math.round(tyres.reduce((total, tyre) => total + tyre.temp, 0) / tyres.length);
  const wearAverage = Math.round(tyres.reduce((total, tyre) => total + tyre.wear, 0) / tyres.length);
  const clock = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#garage" aria-label="Apex Racing home">
          <span className="brand-mark">A<span>.</span></span>
          <span className="brand-name">APEX <b>RACING</b></span>
        </a>
        <div className="topbar-center"><span className="live-indicator" /> SIMULATION ENVIRONMENT <span className="topbar-divider">/</span> CIRCUIT 01</div>
        <div className="topbar-right"><span className="connection"><span />SYSTEMS NOMINAL</span><button className="icon-button help-button" aria-label="Help"><CircleHelp size={18} /></button><div className="driver-avatar">AR</div></div>
      </header>

      <div className="workspace" id="garage">
        <section className="main-column">
          <div className="page-heading">
            <div><div className="eyebrow"><span>GARAGE 01</span><span className="eyebrow-line" /> 2011 SEASON</div><h1>THE <span>HRT</span> F111</h1></div>
            <div className="model-select"><span className="model-label">CHASSIS</span><strong>F111</strong></div>
          </div>

          <section className="viewer" ref={viewerRef} aria-label="Interactive 3D car viewer">
            <div className="viewer-topline"><div className="viewer-chip"><span className="status-dot" />{driving ? 'SESSION ACTIVE' : 'MODEL VIEWER'}</div><div className="viewer-top-actions"><span className="viewer-view-label">DRAG TO ORBIT <Grip size={13} /></span><button className="icon-button" aria-label="Reset car session" onClick={resetSession}><RotateCcw size={16} /></button><button className="icon-button" aria-label="Expand 3D view" onClick={toggleFullscreen}><Maximize2 size={16} /></button></div></div>
            <div className="scene-label scene-label-front"><span>01</span> FRONT WING</div>
            <div className="scene-label scene-label-rear"><span>02</span> POWER UNIT</div>
            <iframe className="model-embed" title="HRT F111 3D model by Dave Love SketchFab" src="https://sketchfab.com/models/3bb0f476ca5e409e928864e856097ab8/embed?autostart=1&preload=1&ui_theme=dark&ui_infos=0&ui_controls=1" allow="autoplay; fullscreen; xr-spatial-tracking; accelerometer; gyroscope" referrerPolicy="strict-origin-when-cross-origin" />
            <div className="viewer-caption"><span>MODEL <b>HRT F111</b></span><span>2011 <b>FORMULA 1</b></span><a href="https://sketchfab.com/3d-models/2011-hrt-f111-3bb0f476ca5e409e928864e856097ab8" target="_blank" rel="noreferrer">MODEL: DAVE LOVE · CC BY 4.0</a></div>
          </section>

          <div className="drive-console">
            <div className="drive-main"><button className={`drive-button ${driving ? 'active' : ''}`} onClick={toggleDrive}>{driving ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}<span>{driving ? 'PAUSE SESSION' : 'START SESSION'}</span></button><div className="drive-hint"><kbd>W</kbd><kbd>S</kbd><span>THROTTLE</span><i /> <kbd>SPACE</kbd><span>IGNITION</span></div></div>
            <div className="speed-control"><label htmlFor="speed">TARGET SPEED <span>{speed} <small>KM/H</small></span></label><input id="speed" type="range" min="0" max={aeroProfile === 'Low drag' ? 360 : 340} step="10" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} style={{ '--range-progress': `${(speed / (aeroProfile === 'Low drag' ? 360 : 340)) * 100}%` }} /><div className="speed-scale"><span>0</span><span>{aeroProfile === 'Low drag' ? '180' : '170'}</span><span>{aeroProfile === 'Low drag' ? '360' : '340'} KM/H</span></div></div>
            <div className="lap-clock"><span>SESSION TIME</span><strong>{clock}<small> / 01:32</small></strong></div>
          </div>

          <section className="analytics-section">
            <div className="section-heading"><div><div className="eyebrow"><span>LIVE TELEMETRY</span><span className="eyebrow-line" /></div><h2>TYRE <span>ANALYTICS</span></h2></div><div className="telemetry-live"><Activity size={14} />{driving ? 'LIVE DATA' : 'STANDBY'}</div></div>
            <div className="analytics-grid">
              <div className="tyre-grid">{tyres.map((tyre) => <TyreCard key={tyre.key} tyre={tyre} compound={compound} />)}</div>
              <div className="chart-panel"><div className="chart-header"><div><span className="chart-title">TYRE TEMPERATURE</span><span className="chart-subtitle">4-CORNER AVERAGE · LAST 24 SEC</span></div><div className="chart-value">{averageTemp}<small>°C</small></div></div><TemperatureChart history={history} /><div className="chart-axis"><span>24 SEC AGO</span><span>12 SEC</span><span>NOW</span></div><div className="chart-legend"><span><i /> CORE TEMP</span><span className="target-legend"><i /> OPTIMAL 80–100°C</span></div></div>
            </div>
            <div className="summary-metrics"><div className="summary-metric"><Thermometer size={17} /><span>AVERAGE CORE</span><strong>{averageTemp}<small>°C</small></strong><em className={averageTemp > 105 ? 'warning' : ''}>{averageTemp > 105 ? 'ABOVE WINDOW' : 'IN OPERATING WINDOW'}</em></div><div className="summary-metric"><Grip size={17} /><span>SET DEGRADATION</span><strong>{wearAverage}<small>%</small></strong><em>EST. {Math.max(0, 100 - wearAverage)}% LIFE REMAINING</em></div><div className="summary-metric"><Wind size={17} /><span>AVG. PRESSURE</span><strong>{(tyres.reduce((total, tyre) => total + tyre.pressure, 0) / 4).toFixed(1)}<small> PSI</small></strong><em>HOT PRESSURE TARGET · 22–24 PSI</em></div><div className="summary-metric"><Gauge size={17} /><span>SESSION DISTANCE</span><strong>{(speed * elapsed / 3600).toFixed(2)}<small> KM</small></strong><em>ESTIMATED FROM SESSION PACE</em></div></div>
          </section>
        </section>

        <aside className="setup-column">
          <section className="setup-panel">
            <div className="panel-heading"><div><div className="eyebrow">CAR SETUP</div><h2>CONFIGURATION</h2></div><button className="icon-button" aria-label="Reset car setup" onClick={() => { setCompoundName('Medium'); setBrakeBalance(54); setAeroProfile('Balanced'); setSpeed(0); }}><Settings2 size={16} /></button></div>
            <div className="setup-block"><div className="control-heading"><span>MODEL LIVERY</span><span className="control-value">ORIGINAL</span></div><div className="original-livery"><span className="heritage-swatch" /><div><strong>HRT F1 TEAM</strong><span>2011 TEAM LIVERY</span></div></div></div>
            <div className="setup-block compound-block"><div className="control-heading"><span>TYRE COMPOUND</span><span className="control-value">P ZERO</span></div><div className="compound-options" role="group" aria-label="Choose tire compound">{Object.keys(COMPOUNDS).map((name) => <button key={name} className={`compound-option ${compoundName === name ? 'selected' : ''}`} onClick={() => setCompoundName(name)}><i style={{ '--compound': COMPOUNDS[name].color }}>{name[0]}</i><span>{name}</span></button>)}</div><div className="compound-note"><span className="compound-badge" style={{ '--compound': compound.color }}>{compoundName[0]}</span><p><b>{compoundName.toUpperCase()} COMPOUND</b><span>{compoundName === 'Soft' ? 'Maximum grip · faster degradation' : compoundName === 'Hard' ? 'Long life · lower peak grip' : 'Balanced grip and durability'}</span></p><ChevronDown size={14} /></div></div>
            <div className="setup-block balance-block"><div className="control-heading"><label htmlFor="brake-balance">BRAKE BALANCE</label><span className="control-value">{brakeBalance}% <small>FRONT</small></span></div><input id="brake-balance" className="balance-slider" type="range" min="48" max="60" value={brakeBalance} onChange={(event) => setBrakeBalance(Number(event.target.value))} style={{ '--balance-progress': `${((brakeBalance - 48) / 12) * 100}%` }} /><div className="balance-labels"><span>REAR</span><span>FRONT</span></div></div>
            <div className="setup-block aero-block"><div className="control-heading"><span>AERO PROFILE</span><span className="control-value">{aeroProfile.toUpperCase()}</span></div><div className="aero-selector"><button className={aeroProfile === 'Balanced' ? 'selected' : ''} aria-pressed={aeroProfile === 'Balanced'} onClick={() => setAeroProfile('Balanced')}><Zap size={14} /><span>Balanced</span></button><button className={aeroProfile === 'Low drag' ? 'selected' : ''} aria-pressed={aeroProfile === 'Low drag'} onClick={() => { setAeroProfile('Low drag'); setSpeed((current) => Math.min(360, current)); }}><Wind size={14} /><span>Low drag</span></button></div></div>
            <div className="setup-footer"><div className="setup-status"><span className="status-dot" /><span>SETUP SAVED</span></div><button className="save-button" onClick={() => setDriving(false)}>APPLY SETUP</button></div>
          </section>

          <section className="session-panel"><div className="session-heading"><div><span className="eyebrow">CURRENT RUN</span><h3>SESSION <span>OVERVIEW</span></h3></div><span className="session-tag">PRACTICE</span></div><div className="session-stats"><div><span>BEST LAP</span><strong>1:24.680</strong><small>PERSONAL BEST</small></div><div><span>LAST LAP</span><strong>{lap > 1 ? '1:26.142' : '--:--.---'}</strong><small>{lap > 1 ? '−1.462 SEC' : 'NO LAPS SET'}</small></div></div><div className="lap-row"><span>COMPLETED LAPS</span><b>{String(lap - 1).padStart(2, '0')}</b></div><button className="session-link" onClick={resetSession}>RESET SESSION <RotateCcw size={13} /></button></section>

          <div className="sidebar-footnote"><span>APEX RACING SIMULATOR <b>V 2.6.04</b></span><span>DATA REFRESH <b>850 MS</b></span></div>
        </aside>
      </div>
      <footer className="page-footer"><span>APEX RACING <i /> PERFORMANCE ENGINEERING</span><span>ALL TELEMETRY IS SIMULATED FOR DEMONSTRATION <span className="footer-divider">·</span> 2026</span></footer>
    </main>
  );
}

export default App;