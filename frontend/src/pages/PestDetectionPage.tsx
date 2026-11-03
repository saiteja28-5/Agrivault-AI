import React, { useState, useEffect, useRef } from 'react';
import {
  Bug,
  Volume2,
  VolumeX,
  Play,
  Square,
  Activity,
  Layers,
  Sparkles,
  Info,
  ChevronRight,
  ShieldAlert,
  Search,
  Filter,
  Sliders,
  CheckCircle2,
  Radio
} from 'lucide-react';
import { useAgrivault } from '../context/AgrivaultContext';
import { PestDetection } from '../types';

export const PestDetectionPage: React.FC = () => {
  const { pestDetections, storageUnits, setSelectedUnitId, setSelectedZoneId } = useAgrivault();

  const [activeTab, setActiveTab] = useState<'all' | 'weevil' | 'borer' | 'beetle' | 'moth'>('all');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [selectedSample, setSelectedSample] = useState<'sample1' | 'sample2' | 'sample3'>('sample1');
  const [canvasEnergy, setCanvasEnergy] = useState<number[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Audio Samples info
  const samples = {
    sample1: {
      name: 'INMP441-S01-A (Wheat Silo 01 Headspace)',
      target: 'Lesser Grain Borer (Rhyzopertha dominica)',
      confidence: '91.4%',
      freqRange: '3.8 kHz – 5.2 kHz',
      stridulationType: 'Internal seed boring & mandible scraping',
    },
    sample2: {
      name: 'INMP441-W01-B (Central Warehouse Zone A2)',
      target: 'Rice Weevil (Sitophilus oryzae)',
      confidence: '86.2%',
      freqRange: '2.5 kHz – 4.4 kHz',
      stridulationType: 'Locomotion pulse and pericarp puncture',
    },
    sample3: {
      name: 'INMP441-W02-A (Intake Ambient Background)',
      target: 'Clean / Baseline Background Noise',
      confidence: '98.5% Clean',
      freqRange: 'Ambient < 1.2 kHz',
      stridulationType: 'Ventilation blower hum (filtered out)',
    },
  };

  // Generate dynamic frequency spectrum bars
  useEffect(() => {
    const barsCount = 36;
    const interval = setInterval(() => {
      const bars = [];
      for (let i = 0; i < barsCount; i++) {
        const peakWeight = selectedSample === 'sample3' ? 0.2 : (i > 14 && i < 26 ? 0.9 : 0.35);
        const val = Math.min(100, Math.max(10, Math.floor(Math.random() * 80 * peakWeight + (isPlayingAudio ? 25 : 8))));
        bars.push(val);
      }
      setCanvasEnergy(bars);
    }, 120);

    return () => clearInterval(interval);
  }, [isPlayingAudio, selectedSample]);

  // Filter pest cards
  const filteredDetections = pestDetections.filter((p) => {
    if (activeTab === 'weevil') return p.insect_name.toLowerCase().includes('weevil');
    if (activeTab === 'borer') return p.insect_name.toLowerCase().includes('borer');
    if (activeTab === 'beetle') return p.insect_name.toLowerCase().includes('beetle');
    if (activeTab === 'moth') return p.insect_name.toLowerCase().includes('moth');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-xl border border-agri-border shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-agri-text">Acoustic Pest Intelligence</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-agri-forest/10 text-agri-forest">
              BIO-ACOUSTIC CNN
            </span>
          </div>
          <p className="text-xs text-agri-muted mt-0.5">
            Early subsurface detection of hidden insect boring and stridulation using MEMS acoustic sensors.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-lg">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            Demonstration mode: Simulated inference results illustrating planned PyTorch Librosa architecture.
          </span>
        </div>
      </div>

      {/* Acoustic Pipeline Architecture Diagram */}
      <div className="bg-white rounded-xl border border-agri-border shadow-2xs p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold font-mono uppercase text-agri-muted tracking-wider">
            Planned Acoustic Intelligence Pipeline
          </h2>
          <span className="text-[10px] font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
            Detect → Localize → Classify
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center space-y-1">
            <span className="text-[10px] font-mono font-bold text-agri-forest block">STEP 1: SENSING</span>
            <span className="text-xs font-bold text-agri-text block">INMP441 MEMS</span>
            <span className="text-[11px] text-agri-muted">44.1 kHz, 24-bit I2S direct grain immersion</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center space-y-1">
            <span className="text-[10px] font-mono font-bold text-agri-forest block">STEP 2: FILTERING</span>
            <span className="text-xs font-bold text-agri-text block">Spectral Subtraction</span>
            <span className="text-[11px] text-agri-muted">Ambient air blower & fan noise suppression</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center space-y-1">
            <span className="text-[10px] font-mono font-bold text-agri-forest block">STEP 3: SPECTROGRAM</span>
            <span className="text-xs font-bold text-agri-text block">128-Band Mel Spec</span>
            <span className="text-[11px] text-agri-muted">Librosa STFT with 2048 FFT & 512 hop length</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center space-y-1">
            <span className="text-[10px] font-mono font-bold text-agri-forest block">STEP 4: MODEL</span>
            <span className="text-xs font-bold text-agri-text block">2D ResNet-18 CNN</span>
            <span className="text-[11px] text-agri-muted">Feature extractor trained on insect stridulation</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-center space-y-1">
            <span className="text-[10px] font-mono font-bold text-emerald-800 block">STEP 5: INFERENCE</span>
            <span className="text-xs font-bold text-emerald-950 block">Species & Probability</span>
            <span className="text-[11px] text-emerald-700">Classification score & localization zone</span>
          </div>
        </div>
      </div>

      {/* Simulated Mel Spectrogram & Audio Player Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spectrogram Energy Visualizer */}
        <div className="bg-white rounded-xl border border-agri-border shadow-2xs p-5 lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-agri-text">Simulated Mel Spectrogram Visualizer</h2>
                <span className={`w-2 h-2 rounded-full ${isPlayingAudio ? 'bg-emerald-500 animate-ping' : 'bg-gray-300'}`} />
              </div>
              <p className="text-[11px] text-agri-muted">
                Real-time frequency-domain energy distribution (0 Hz – 12 kHz)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs ${
                  isPlayingAudio ? 'bg-agri-red text-white' : 'bg-agri-forest text-white hover:bg-agri-deep'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop Playback</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Audio Stream</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Simulated Frequency Bars Matrix */}
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 border-b border-gray-800 pb-1.5">
              <span>Low Freq (Blower Baseline)</span>
              <span className="text-amber-400 font-bold">Insect Stridulation Envelope (3.5 kHz - 5 kHz)</span>
              <span>High Freq Harmonic</span>
            </div>

            <div className="h-44 flex items-end gap-1.5 pt-4">
              {canvasEnergy.map((height, idx) => {
                const isTargetFreq = idx > 14 && idx < 26;
                const barColor = isTargetFreq
                  ? height > 60
                    ? 'bg-rose-500'
                    : 'bg-amber-400'
                  : 'bg-emerald-600/70';

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div
                      className={`w-full rounded-t-xs transition-all duration-100 ${barColor}`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 pt-1">
              <span>0 kHz</span>
              <span>2.5 kHz</span>
              <span>5.0 kHz</span>
              <span>7.5 kHz</span>
              <span>10.0 kHz</span>
              <span>12.5 kHz</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-1 text-agri-muted">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Feeding clicks (3-5 kHz)
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-600" /> Noise floor
              </span>
            </div>
            <span className="font-mono text-[11px]">FFT Window: Hanning 2048 pts</span>
          </div>
        </div>

        {/* Acoustic Probe Controller & Sample Selector */}
        <div className="bg-white rounded-xl border border-agri-border shadow-2xs p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-agri-text">Audio Analysis Channel</h2>
              <span className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                INMP441-S01-A
              </span>
            </div>

            <p className="text-xs text-agri-muted mb-4">
              Select demo audio probe recording to evaluate simulated model classification confidence.
            </p>

            <div className="space-y-2.5">
              {(['sample1', 'sample2', 'sample3'] as const).map((s) => {
                const isSelected = selectedSample === s;
                return (
                  <div
                    key={s}
                    onClick={() => {
                      setSelectedSample(s);
                      setIsPlayingAudio(true);
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-agri-forest bg-agri-forest/5 shadow-2xs'
                        : 'border-gray-100 bg-gray-50/50 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-agri-text">{samples[s].target}</span>
                      <span className="text-[10px] font-mono font-bold text-agri-forest bg-white px-1.5 py-0.5 rounded border border-gray-200">
                        {samples[s].confidence}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 font-mono truncate">{samples[s].name}</p>
                    <p className="text-[10px] text-agri-muted mt-1">{samples[s].stridulationType}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 text-xs space-y-2">
            <div className="flex items-center justify-between text-agri-muted">
              <span>Sensor Sampling Rate:</span>
              <span className="font-mono font-semibold text-agri-text">44,100 Hz</span>
            </div>
            <div className="flex items-center justify-between text-agri-muted">
              <span>Analog Sensitivity:</span>
              <span className="font-mono font-semibold text-agri-text">-26 dBFS @ 94 dB SPL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pest Species Classification Cards Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-agri-border shadow-2xs">
          <div>
            <h2 className="text-sm font-bold text-agri-text">Detected Insect Species Classification</h2>
            <p className="text-[11px] text-agri-muted">
              Acoustic detections categorized by target grain storage pest biology
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center bg-gray-100 p-0.5 rounded-lg text-xs font-medium border border-agri-border">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'all' ? 'bg-white text-agri-forest font-bold shadow-xs' : 'text-gray-500'
              }`}
            >
              All Detections
            </button>
            <button
              onClick={() => setActiveTab('borer')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'borer' ? 'bg-white text-agri-forest font-bold shadow-xs' : 'text-gray-500'
              }`}
            >
              Grain Borer
            </button>
            <button
              onClick={() => setActiveTab('weevil')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'weevil' ? 'bg-white text-agri-forest font-bold shadow-xs' : 'text-gray-500'
              }`}
            >
              Rice Weevil
            </button>
            <button
              onClick={() => setActiveTab('beetle')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'beetle' ? 'bg-white text-agri-forest font-bold shadow-xs' : 'text-gray-500'
              }`}
            >
              Flour Beetle
            </button>
            <button
              onClick={() => setActiveTab('moth')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'moth' ? 'bg-white text-agri-forest font-bold shadow-xs' : 'text-gray-500'
              }`}
            >
              Grain Moth
            </button>
          </div>
        </div>

        {/* Pest Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDetections.map((detection) => (
            <div
              key={detection.id}
              className="bg-white rounded-xl border border-agri-border shadow-2xs p-5 hover:border-agri-sage/80 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-gray-400 block">
                      {detection.id} • {detection.acoustic_sensor_id}
                    </span>
                    <h3 className="text-base font-bold text-agri-text">{detection.insect_name}</h3>
                    <p className="text-xs italic text-gray-500">{detection.scientific_name}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      detection.severity === 'Critical'
                        ? 'bg-red-100 text-red-800'
                        : detection.severity === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {detection.severity}
                  </span>
                </div>

                {/* Location & Confidence */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-agri-muted">Location:</span>
                    <span className="font-bold text-agri-text">{detection.storage_unit_name}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-agri-muted">Zone ID:</span>
                    <span className="text-agri-forest font-semibold">{detection.zone_id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-agri-muted">CNN Confidence:</span>
                    <span className="font-mono font-bold text-rose-700">
                      {Math.round(detection.probability * 100)}%
                    </span>
                  </div>

                  {/* Confidence Bar */}
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-agri-red rounded-full"
                      style={{ width: `${detection.probability * 100}%` }}
                    />
                  </div>
                </div>

                {/* Suggested Action */}
                <div className="mt-3 text-[11px] space-y-1">
                  <span className="font-bold text-agri-text block">Recommended Inspection:</span>
                  <p className="text-agri-muted bg-emerald-50/50 p-2 rounded border border-emerald-100/70">
                    {detection.suggested_action}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-gray-400 font-mono">{detection.timestamp}</span>
                <button
                  onClick={() => {
                    setSelectedUnitId(detection.storage_unit_id);
                    setSelectedZoneId(detection.zone_id);
                  }}
                  className="font-semibold text-agri-forest hover:underline"
                >
                  Locate Zone →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

