import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, Save, RotateCcw, Trash2, Play, Pause } from 'lucide-react';

interface Stats {
  corners: number;
  shots: number;
  timestamp: string;
  matchTime: string;
  event: string;
}

interface TeamStatsProps {
  teamName: string;
  onSaveStats: (stats: Stats) => void;
  savedStats: Stats[];
  onDeleteStat: (index: number) => void;
  matchTime: string;
  onCornerEvent: (time: string) => void;
  onShotEvent: (time: string) => void;
}

function TeamStats({ teamName, onSaveStats, savedStats, onDeleteStat, matchTime, onCornerEvent, onShotEvent }: TeamStatsProps) {
  // Load initial values from localStorage
  const storedCorners = localStorage.getItem(`${teamName}-corners`);
  const storedShots = localStorage.getItem(`${teamName}-shots`);
  
  const [corners, setCorners] = useState(storedCorners ? parseInt(storedCorners) : 0);
  const [shots, setShots] = useState(storedShots ? parseInt(storedShots) : 0);

  // Save to localStorage whenever values change
  useEffect(() => {
    localStorage.setItem(`${teamName}-corners`, corners.toString());
  }, [corners, teamName]);

  useEffect(() => {
    localStorage.setItem(`${teamName}-shots`, shots.toString());
  }, [shots, teamName]);

  const handleSave = () => {
    const newStats: Stats = {
      corners,
      shots,
      timestamp: new Date().toLocaleTimeString(),
      matchTime,
      event: 'Estatísticas salvas'
    };
    onSaveStats(newStats);
  };

  const handleReset = () => {
    setCorners(0);
    setShots(0);
  };

  const handleCornerChange = (increment: boolean) => {
    setCorners(prev => {
      const newValue = increment ? prev + 1 : Math.max(0, prev - 1);
      if (increment) {
        onCornerEvent(matchTime);
      }
      return newValue;
    });
  };

  const handleShotChange = (increment: boolean) => {
    setShots(prev => {
      const newValue = increment ? prev + 1 : Math.max(0, prev - 1);
      if (increment) {
        onShotEvent(matchTime);
      }
      return newValue;
    });
  };

  return (
    <div className="flex-1 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">{teamName}</h2>
      
      {/* Corner Kicks Counter */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Escanteios</h3>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => handleCornerChange(false)}
            className="p-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <MinusCircle size={32} />
          </button>
          <span className="text-3xl font-bold w-16 text-center">{corners}</span>
          <button
            onClick={() => handleCornerChange(true)}
            className="p-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <PlusCircle size={32} />
          </button>
        </div>
      </div>

      {/* Shots Counter */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Finalizações</h3>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => handleShotChange(false)}
            className="p-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <MinusCircle size={32} />
          </button>
          <span className="text-3xl font-bold w-16 text-center">{shots}</span>
          <button
            onClick={() => handleShotChange(true)}
            className="p-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <PlusCircle size={32} />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save size={20} />
          Salvar
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RotateCcw size={20} />
          Zerar
        </button>
      </div>

      {/* Saved Stats */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Histórico</h3>
        <div className="space-y-2">
          {savedStats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div>
                <span className="text-sm text-gray-500">{stat.matchTime} - {stat.event}</span>
                <div className="font-medium">
                  {stat.event === 'Estatísticas salvas' ? 
                    `Escanteios: ${stat.corners} | Finalizações: ${stat.shots}` :
                    stat.event
                  }
                </div>
              </div>
              <button
                onClick={() => onDeleteStat(index)}
                className="p-1 text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  // Load saved stats from localStorage
  const storedTeam1Stats = localStorage.getItem('team1-stats');
  const storedTeam2Stats = localStorage.getItem('team2-stats');
  const storedTime = localStorage.getItem('match-time');
  
  const [team1Stats, setTeam1Stats] = useState<Stats[]>(storedTeam1Stats ? JSON.parse(storedTeam1Stats) : []);
  const [team2Stats, setTeam2Stats] = useState<Stats[]>(storedTeam2Stats ? JSON.parse(storedTeam2Stats) : []);
  const [time, setTime] = useState(storedTime ? parseInt(storedTime) : 0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          localStorage.setItem('match-time', newTime.toString());
          return newTime;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('team1-stats', JSON.stringify(team1Stats));
  }, [team1Stats]);

  useEffect(() => {
    localStorage.setItem('team2-stats', JSON.stringify(team2Stats));
  }, [team2Stats]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    localStorage.setItem('match-time', '0');
  };

  const handleSaveTeam1 = (stats: Stats) => {
    setTeam1Stats(prev => [...prev, stats]);
  };

  const handleSaveTeam2 = (stats: Stats) => {
    setTeam2Stats(prev => [...prev, stats]);
  };

  const handleDeleteTeam1Stat = (index: number) => {
    setTeam1Stats(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteTeam2Stat = (index: number) => {
    setTeam2Stats(prev => prev.filter((_, i) => i !== index));
  };

  const handleTeam1Corner = (matchTime: string) => {
    setTeam1Stats(prev => [...prev, {
      corners: 0,
      shots: 0,
      timestamp: new Date().toLocaleTimeString(),
      matchTime,
      event: 'Escanteio'
    }]);
  };

  const handleTeam1Shot = (matchTime: string) => {
    setTeam1Stats(prev => [...prev, {
      corners: 0,
      shots: 0,
      timestamp: new Date().toLocaleTimeString(),
      matchTime,
      event: 'Finalização'
    }]);
  };

  const handleTeam2Corner = (matchTime: string) => {
    setTeam2Stats(prev => [...prev, {
      corners: 0,
      shots: 0,
      timestamp: new Date().toLocaleTimeString(),
      matchTime,
      event: 'Escanteio'
    }]);
  };

  const handleTeam2Shot = (matchTime: string) => {
    setTeam2Stats(prev => [...prev, {
      corners: 0,
      shots: 0,
      timestamp: new Date().toLocaleTimeString(),
      matchTime,
      event: 'Finalização'
    }]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Timer Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-center">
          <div className="text-4xl font-bold mb-4 font-mono">{formatTime(time)}</div>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleStartStop}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white transition-colors ${
                isRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
              {isRunning ? 'Pausar' : 'Iniciar'}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RotateCcw size={20} />
              Zerar
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Estatísticas da Partida</h1>
        <div className="flex gap-6 flex-col md:flex-row">
          <TeamStats 
            teamName="ABC" 
            onSaveStats={handleSaveTeam1}
            savedStats={team1Stats}
            onDeleteStat={handleDeleteTeam1Stat}
            matchTime={formatTime(time)}
            onCornerEvent={handleTeam1Corner}
            onShotEvent={handleTeam1Shot}
          />
          <TeamStats 
            teamName="Adversário" 
            onSaveStats={handleSaveTeam2}
            savedStats={team2Stats}
            onDeleteStat={handleDeleteTeam2Stat}
            matchTime={formatTime(time)}
            onCornerEvent={handleTeam2Corner}
            onShotEvent={handleTeam2Shot}
          />
        </div>
      </div>
    </div>
  );
}

export default App;