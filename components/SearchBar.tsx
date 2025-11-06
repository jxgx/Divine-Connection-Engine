import React, { useState, useRef, useEffect, useCallback } from 'react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearchSubmit: () => void;
}

type NoiseType = 'black' | 'pink' | 'white';
type Volumes = Record<NoiseType, number>;

interface AudioNodes {
    context: AudioContext;
    masterGain: GainNode;
    analyser: AnalyserNode;
    whiteNoiseSource: AudioBufferSourceNode;
    pinkFilter: BiquadFilterNode;
    gainNodes: Record<NoiseType, GainNode>;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, onSearchSubmit }) => {
  const audioNodesRef = useRef<AudioNodes | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // FIX: Provide an initial value to useRef to fix "Expected 1 arguments, but got 0" error.
  const animationFrameId = useRef<number | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumes, setVolumes] = useState<Volumes>({
    black: 0.05,
    pink: 0,
    white: 0,
  });
  
  const draw = useCallback(() => {
    const audioNodes = audioNodesRef.current;
    const canvas = canvasRef.current;
    if (!audioNodes || !canvas || !isPlaying) return;

    const { analyser } = audioNodes;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = '#00A8A8';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = '#FFFFFF';
    canvasCtx.beginPath();

    const sliceWidth = canvas.width * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;
        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
    }
    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
    animationFrameId.current = requestAnimationFrame(draw);
  }, [isPlaying]);

  const setupAudio = () => {
    if (audioNodesRef.current) return;
    try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const masterGain = context.createGain();
        masterGain.gain.setValueAtTime(0, context.currentTime);

        const analyser = context.createAnalyser();
        masterGain.connect(analyser);
        analyser.connect(context.destination);
        
        const bufferSize = context.sampleRate * 2;
        const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        const whiteNoiseSource = context.createBufferSource();
        whiteNoiseSource.buffer = buffer;
        whiteNoiseSource.loop = true;

        const pinkFilter = context.createBiquadFilter();
        pinkFilter.type = 'lowpass';
        pinkFilter.frequency.setValueAtTime(800, context.currentTime);
        pinkFilter.Q.setValueAtTime(0.5, context.currentTime);
        
        const gainNodes: Record<NoiseType, GainNode> = {
            black: context.createGain(),
            white: context.createGain(),
            pink: context.createGain(),
        };

        whiteNoiseSource.connect(gainNodes.black);
        whiteNoiseSource.connect(gainNodes.white);
        
        whiteNoiseSource.connect(pinkFilter);
        pinkFilter.connect(gainNodes.pink);

        Object.values(gainNodes).forEach(node => node.connect(masterGain));
        
        whiteNoiseSource.start();
        
        audioNodesRef.current = { context, masterGain, whiteNoiseSource, pinkFilter, gainNodes, analyser };
    } catch (e) {
        console.error("Web Audio API is not supported in this browser.", e);
    }
  };
  
  useEffect(() => {
    return () => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
        audioNodesRef.current?.context.close().catch(e => console.error("Failed to close AudioContext", e));
    };
  }, []);
  
  useEffect(() => {
      if (isPlaying) {
          animationFrameId.current = requestAnimationFrame(draw);
      } else {
          if (animationFrameId.current) {
              cancelAnimationFrame(animationFrameId.current);
          }
      }
      return () => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
      }
  }, [isPlaying, draw]);

  const togglePlay = () => {
    setupAudio();
    const audioNodes = audioNodesRef.current;
    if (!audioNodes) return;
    
    const newIsPlaying = !isPlaying;
    if (newIsPlaying) {
        if (audioNodes.context.state === 'suspended') {
            audioNodes.context.resume();
        }
        audioNodes.masterGain.gain.linearRampToValueAtTime(1, audioNodes.context.currentTime + 0.2);
    } else {
        audioNodes.masterGain.gain.linearRampToValueAtTime(0, audioNodes.context.currentTime + 0.2);
    }
    setIsPlaying(newIsPlaying);
  };

  const handleVolumeChange = (type: NoiseType, value: number) => {
    setVolumes(prev => ({...prev, [type]: value}));
    const audioNodes = audioNodesRef.current;
    if (audioNodes) {
        audioNodes.gainNodes[type].gain.linearRampToValueAtTime(value, audioNodes.context.currentTime + 0.05);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };
  
  const StaticSlider: React.FC<{label: string, type: NoiseType}> = ({ label, type }) => (
      <div className="mt-2">
        <label className="block text-sm">{label}:</label>
        <div className="flex items-center space-x-2">
            <input 
                type="range" 
                min="0" 
                max="0.2"
                step="0.005" 
                value={volumes[type]}
                onChange={(e) => handleVolumeChange(type, parseFloat(e.target.value))}
                className="w-full h-1 bg-holy-gray appearance-none"
            />
        </div>
      </div>
  );

  return (
    <fieldset className="border-2 border-holy-dark-blue p-2 w-full md:w-2/3 shadow-holy-inset flex flex-col justify-between">
      <div>
        <legend className="px-1 font-bold">Divine Search</legend>
        <form onSubmit={handleSearch} className="flex space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="e.g. 'compiler' or 'divine...' "
            className="flex-grow p-1 bg-holy-black border-2 border-holy-dark-blue shadow-holy-inset focus:outline-none placeholder-holy-gray"
          />
          <button
            type="submit"
            className="px-3 py-1 border-2 border-holy-dark-blue shadow-holy-outset bg-holy-gray text-holy-black active:shadow-holy-inset"
          >
            Search
          </button>
        </form>
      </div>
      <div className="mt-auto pt-2">
        <canvas ref={canvasRef} className="w-full h-16 border border-holy-dark-blue bg-holy-blue shadow-holy-inset" width="500" height="100"></canvas>
        <StaticSlider label="White Static" type="white" />
        <StaticSlider label="Pink Static" type="pink" />
        <div className="mt-2">
            <label className="block text-sm font-bold">Black Static:</label>
            <div className="flex items-center space-x-2">
                <button onClick={togglePlay} className="px-2 py-0 border-2 border-holy-dark-blue shadow-holy-outset bg-holy-gray active:shadow-holy-inset text-holy-black">
                    {isPlaying ? '||' : '>'}
                </button>
                <input 
                    type="range" 
                    min="0" 
                    max="0.2" 
                    step="0.01" 
                    value={volumes.black}
                    onChange={(e) => handleVolumeChange('black', parseFloat(e.target.value))}
                    className="w-full h-1 bg-holy-gray appearance-none"
                />
            </div>
        </div>
      </div>
    </fieldset>
  );
};