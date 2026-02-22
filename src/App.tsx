/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  MapPin, 
  Navigation, 
  Settings, 
  Heart, 
  RefreshCw, 
  ChevronRight, 
  Info,
  Compass,
  ArrowUpRight,
  Coffee,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Location {
  lat: number;
  lng: number;
  accuracy: number;
}

interface Route {
  distance: number;
  bearing: number;
  bearingName: string;
  destination: {
    lat: number;
    lng: number;
  };
  estimatedTime: number; // in minutes
  steps: string[];
}

// --- Constants ---
const BEARINGS = [
  { name: '正北', angle: 0 },
  { name: '東北', angle: 45 },
  { name: '正東', angle: 90 },
  { name: '東南', angle: 135 },
  { name: '正南', angle: 180 },
  { name: '西南', angle: 225 },
  { name: '正西', angle: 270 },
  { name: '西北', angle: 315 },
];

export default function App() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [distance, setDistance] = useState<number>(3); // Default 3km
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRoute, setGeneratedRoute] = useState<Route | null>(null);
  const [showDonation, setShowDonation] = useState(false);

  // --- Geolocation ---
  const updateLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('您的瀏覽器不支援 GPS 定位');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setError(null);
      },
      (err) => {
        setError(`定位失敗: ${err.message}`);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    updateLocation();
  }, [updateLocation]);

  // --- Route Generation Logic ---
  const generateRoute = () => {
    if (!location) {
      setError('請先開啟定位以生成路線');
      return;
    }

    setIsGenerating(true);
    
    // Simulate some calculation time for effect
    setTimeout(() => {
      const randomBearingIndex = Math.floor(Math.random() * BEARINGS.length);
      const selectedBearing = BEARINGS[randomBearingIndex];
      
      // Basic math to calculate a destination point (rough approximation)
      // 1 degree lat is ~111km
      // 1 degree lng is ~111km * cos(lat)
      const latOffset = (distance * Math.cos(selectedBearing.angle * Math.PI / 180)) / 111;
      const lngOffset = (distance * Math.sin(selectedBearing.angle * Math.PI / 180)) / (111 * Math.cos(location.lat * Math.PI / 180));

      const newRoute: Route = {
        distance: distance,
        bearing: selectedBearing.angle,
        bearingName: selectedBearing.name,
        destination: {
          lat: location.lat + latOffset,
          lng: location.lng + lngOffset,
        },
        estimatedTime: Math.round(distance * 12), // Assuming 5km/h walking speed
        steps: [
          `從目前位置出發`,
          `朝著 ${selectedBearing.name} 方向前進`,
          `持續步行約 ${distance} 公里`,
          `預計抵達目的地`
        ]
      };

      setGeneratedRoute(newRoute);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-bottom border-black/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Navigation size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">今日路線</h1>
            <p className="text-[10px] uppercase tracking-wider text-black/40 font-semibold">Today's Route</p>
          </div>
        </div>
        <button 
          onClick={() => setShowDonation(true)}
          className="p-2 hover:bg-black/5 rounded-full transition-colors relative group"
        >
          <Heart size={20} className="text-rose-500 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
        </button>
      </header>

      <main className="max-w-md mx-auto p-6 space-y-8">
        {/* GPS Status Card */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm font-medium opacity-60">
              <MapPin size={16} />
              <span>目前位置</span>
            </div>
            <button 
              onClick={updateLocation}
              className="p-1.5 hover:bg-black/5 rounded-lg transition-colors"
              title="重新整理定位"
            >
              <RefreshCw size={14} className={!location && !error ? 'animate-spin' : ''} />
            </button>
          </div>
          
          {error ? (
            <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs flex items-center gap-2">
              <Info size={14} />
              {error}
            </div>
          ) : location ? (
            <div className="space-y-1">
              <p className="text-2xl font-bold tracking-tight">
                {location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°E
              </p>
              <p className="text-xs text-black/40">精確度: ±{Math.round(location.accuracy)} 公尺</p>
            </div>
          ) : (
            <div className="h-10 bg-black/5 animate-pulse rounded-xl"></div>
          )}
        </section>

        {/* Settings Card */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Settings size={18} className="opacity-40" />
            <h2 className="text-sm font-bold uppercase tracking-widest opacity-40">路線設定</h2>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-sm font-medium opacity-60">目標距離</label>
                <span className="text-3xl font-black text-emerald-600">
                  {distance} <span className="text-sm font-bold">KM</span>
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="15" 
                step="0.5"
                value={distance}
                onChange={(e) => setDistance(parseFloat(e.target.value))}
                className="w-full h-2 bg-black/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-bold opacity-30 px-1">
                <span>1 KM</span>
                <span>8 KM</span>
                <span>15 KM</span>
              </div>
            </div>

            <button 
              onClick={generateRoute}
              disabled={isGenerating || !location}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-black/10 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              {isGenerating ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <>
                  <Compass size={20} className="group-hover:rotate-45 transition-transform" />
                  <span>生成今日路線</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Result Section */}
        <AnimatePresence mode="wait">
          {generatedRoute && (
            <motion.section 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 px-2">
                <ArrowUpRight size={18} className="opacity-40" />
                <h2 className="text-sm font-bold uppercase tracking-widest opacity-40">探索建議</h2>
              </div>

              <div className="bg-emerald-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-800 rounded-full blur-3xl opacity-50"></div>
                
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-1">目標方向</p>
                      <h3 className="text-4xl font-black">{generatedRoute.bearingName}</h3>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl">
                      <Compass size={32} className="text-emerald-300" style={{ transform: `rotate(${generatedRoute.bearing}deg)` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                      <p className="text-[10px] font-bold opacity-50 uppercase mb-1">預計距離</p>
                      <p className="text-xl font-bold">{generatedRoute.distance} 公里</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                      <p className="text-[10px] font-bold opacity-50 uppercase mb-1">預計耗時</p>
                      <p className="text-xl font-bold">{generatedRoute.estimatedTime} 分鐘</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    {generatedRoute.steps.map((step, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm opacity-80">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/30 flex items-center justify-center text-[10px] font-bold">
                          {i + 1}
                        </div>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => {
                      const { lat, lng } = generatedRoute.destination;
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
                      window.open(url, '_blank');
                    }}
                    className="w-full bg-white text-emerald-900 font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors active:scale-95 mt-4"
                  >
                    <Navigation size={20} className="fill-current" />
                    <span>開始導航</span>
                  </button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Donation Modal */}
      <AnimatePresence>
        {showDonation && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDonation(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="relative bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="bg-rose-500 p-8 text-white text-center space-y-2">
                <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto flex items-center justify-center mb-2">
                  <Heart size={32} fill="currentColor" />
                </div>
                <h3 className="text-2xl font-black">支持我們</h3>
                <p className="text-rose-100 text-sm">您的支持是我們持續開發的動力</p>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <button className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black/90 transition-all active:scale-95">
                    <Coffee size={20} />
                    <span>請我喝杯咖啡 (NT$ 50)</span>
                  </button>
                  <button className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all active:scale-95">
                    <Gift size={20} />
                    <span>贊助開發計畫 (NT$ 150)</span>
                  </button>
                </div>

                <div className="bg-black/5 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold opacity-40">
                    <Info size={14} />
                    <span>關於 Google Play 捐贈</span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-60">
                    由於這是網頁應用程式，我們目前透過模擬按鈕展示功能。在正式版本中，這將連結至 Google Play 結帳系統或第三方支付平台。
                  </p>
                </div>

                <button 
                  onClick={() => setShowDonation(false)}
                  className="w-full py-2 text-sm font-bold opacity-30 hover:opacity-100 transition-opacity"
                >
                  稍後再說
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <footer className="max-w-md mx-auto p-8 text-center space-y-4">
        <div className="flex justify-center gap-4 opacity-20">
          <div className="w-1 h-1 bg-black rounded-full"></div>
          <div className="w-1 h-1 bg-black rounded-full"></div>
          <div className="w-1 h-1 bg-black rounded-full"></div>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">
          探索未知 • 享受當下 • 保持健康
        </p>
      </footer>
    </div>
  );
}
