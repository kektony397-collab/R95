import React, { useReducer, useState } from 'react';
import { rideReducer, initialState } from './state/reducer';
import { useRide } from './hooks/useRide';
import { useWakeLock } from './hooks/useWakeLock';

import MeterDisplay from './components/MeterDisplay';
import ControlButton from './components/ControlButton';
import FloatingMeter from './components/FloatingMeter';
import { PowerIcon, StopIcon, ArrowPathIcon, ExclamationTriangleIcon, MapPinIcon } from './components/Icons';

const App: React.FC = () => {
  const [state, dispatch] = useReducer(rideReducer, initialState);
  const [isFloating, setIsFloating] = useState(false);

  // Custom hooks for side effects
  useRide(dispatch, state.phase);
  useWakeLock(state.phase);

  const handleStart = () => dispatch({ type: 'START_RIDE' });
  const handleStop = () => dispatch({ type: 'STOP_RIDE' });
  const handleReset = () => dispatch({ type: 'RESET_RIDE' });

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 selection:bg-cyan-500/30">
      
      {isFloating && state.phase === 'running' && (
        <FloatingMeter rideState={state} onClose={() => setIsFloating(false)} />
      )}

      <div className={`w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700 flex flex-col transition-opacity duration-300 ${isFloating && state.phase === 'running' ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        <header className="text-center mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-cyan-400 tracking-wider font-orbitron">Repido Meter</h1>
          <button 
            onClick={() => setIsFloating(true)} 
            disabled={state.phase !== 'running'}
            className="text-gray-400 hover:text-cyan-400 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
            aria-label="Show floating meter"
            title="Show floating meter"
            >
              <MapPinIcon className="h-7 w-7"/>
          </button>
        </header>

        <main className="flex-grow">
          <MeterDisplay 
            distance={state.distance}
            timeInSeconds={state.elapsedTime}
            fare={state.fare}
            status={state.phase}
          />

          {state.error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative my-4 text-sm flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 mr-3"/>
              <span>{state.error}</span>
            </div>
          )}

        </main>

        <footer className="mt-6">
          <div className="grid grid-cols-3 gap-4">
            <ControlButton onClick={handleStart} disabled={state.phase === 'running'} variant="start">
              <PowerIcon className="h-6 w-6 mr-2" />
              Start
            </ControlButton>
            <ControlButton onClick={handleStop} disabled={state.phase !== 'running'} variant="stop">
              <StopIcon className="h-6 w-6 mr-2" />
              Stop
            </ControlButton>
            <ControlButton onClick={handleReset} disabled={state.phase === 'running'} variant="reset">
              <ArrowPathIcon className="h-6 w-6 mr-2" />
              Reset
            </ControlButton>
          </div>
          <p className="text-center text-xs text-gray-500 mt-6">created by Yash K Pathak</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
