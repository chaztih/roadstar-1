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
  Gift,
  Languages,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Language = 'zh-TW' | 'en' | 'ja' | 'ko' | 'es' | 'fr';

interface Translation {
  title: string;
  subtitle: string;
  currentLocation: string;
  accuracy: string;
  routeSettings: string;
  targetDistance: string;
  generateButton: string;
  explorationSuggestion: string;
  targetDirection: string;
  estDistance: string;
  estTime: string;
  startNavigation: string;
  supportUs: string;
  supportDesc: string;
  buyCoffee: string;
  sponsorDev: string;
  aboutDonation: string;
  donationDisclaimer: string;
  later: string;
  footerText: string;
  km: string;
  min: string;
  gpsError: string;
  locationError: string;
  needLocation: string;
  bearings: string[];
  steps: (bearing: string, distance: number) => string[];
}

const TRANSLATIONS: Record<Language, Translation> = {
  'zh-TW': {
    title: '今日路線',
    subtitle: 'Today\'s Route',
    currentLocation: '目前位置',
    accuracy: '精確度',
    routeSettings: '路線設定',
    targetDistance: '目標距離',
    generateButton: '生成今日路線',
    explorationSuggestion: '探索建議',
    targetDirection: '目標方向',
    estDistance: '預計距離',
    estTime: '預計耗時',
    startNavigation: '開始導航',
    supportUs: '支持我們',
    supportDesc: '您的支持是我們持續開發的動力',
    buyCoffee: '請我喝杯咖啡',
    sponsorDev: '贊助開發計畫',
    aboutDonation: '關於 Google Play 捐贈',
    donationDisclaimer: '由於這是網頁應用程式，我們目前透過模擬按鈕展示功能。在正式版本中，這將連結至 Google Play 結帳系統或第三方支付平台。',
    later: '稍後再說',
    footerText: '探索未知 • 享受當下 • 保持健康',
    km: '公里',
    min: '分鐘',
    gpsError: '您的瀏覽器不支援 GPS 定位',
    locationError: '定位失敗',
    needLocation: '請先開啟定位以生成路線',
    bearings: ['正北', '東北', '正東', '東南', '正南', '西南', '正西', '西北'],
    steps: (b, d) => [`從目前位置出發`, `朝著 ${b} 方向前進`, `持續步行約 ${d} 公里`, `預計抵達目的地`]
  },
  'en': {
    title: 'Today\'s Route',
    subtitle: 'Explore Your Day',
    currentLocation: 'Current Location',
    accuracy: 'Accuracy',
    routeSettings: 'Route Settings',
    targetDistance: 'Target Distance',
    generateButton: 'Generate Route',
    explorationSuggestion: 'Exploration Suggestion',
    targetDirection: 'Target Direction',
    estDistance: 'Est. Distance',
    estTime: 'Est. Time',
    startNavigation: 'Start Navigation',
    supportUs: 'Support Us',
    supportDesc: 'Your support keeps us going',
    buyCoffee: 'Buy me a coffee',
    sponsorDev: 'Sponsor Development',
    aboutDonation: 'About Google Play Donation',
    donationDisclaimer: 'As this is a web app, we use simulated buttons. In production, this would link to Google Play billing or third-party payments.',
    later: 'Maybe later',
    footerText: 'Explore the Unknown • Enjoy the Moment • Stay Healthy',
    km: 'KM',
    min: 'MIN',
    gpsError: 'GPS not supported by your browser',
    locationError: 'Location failed',
    needLocation: 'Please enable location to generate route',
    bearings: ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'],
    steps: (b, d) => [`Start from current location`, `Head towards ${b}`, `Continue for about ${d} km`, `Arrive at destination`]
  },
  'ja': {
    title: '今日のルート',
    subtitle: 'Today\'s Route',
    currentLocation: '現在地',
    accuracy: '精度',
    routeSettings: 'ルート設定',
    targetDistance: '目標距離',
    generateButton: 'ルートを生成',
    explorationSuggestion: '探索の提案',
    targetDirection: '目標方向',
    estDistance: '予定距離',
    estTime: '予定時間',
    startNavigation: 'ナビを開始',
    supportUs: 'サポートする',
    supportDesc: '皆様のサポートが開発の励みになります',
    buyCoffee: 'コーヒーを奢る',
    sponsorDev: '開発を支援する',
    aboutDonation: 'Google Play 寄付について',
    donationDisclaimer: 'これはウェブアプリであるため、現在はシミュレーションボタンを表示しています。正式版では Google Play 決済に接続されます。',
    later: '後で',
    footerText: '未知を探索 • 今を楽しむ • 健康を維持',
    km: 'km',
    min: '分',
    gpsError: 'ブラウザが GPS をサポートしていません',
    locationError: '位置情報の取得に失敗しました',
    needLocation: 'ルートを生成するには位置情報を有効にしてください',
    bearings: ['北', '北東', '東', '南東', '南', '南西', '西', '北西'],
    steps: (b, d) => [`現在地から出発`, `${b} 方向に進む`, `約 ${d} km 歩き続ける`, `目的地に到着予定`]
  },
  'ko': {
    title: '오늘의 경로',
    subtitle: 'Today\'s Route',
    currentLocation: '현재 위치',
    accuracy: '정확도',
    routeSettings: '경로 설정',
    targetDistance: '목표 거리',
    generateButton: '경로 생성',
    explorationSuggestion: '탐색 제안',
    targetDirection: '목표 방향',
    estDistance: '예상 거리',
    estTime: '예상 시간',
    startNavigation: '길찾기 시작',
    supportUs: '후원하기',
    supportDesc: '여러분의 후원이 개발의 원동력이 됩니다',
    buyCoffee: '커피 한 잔 사주기',
    sponsorDev: '개발 프로젝트 후원',
    aboutDonation: 'Google Play 기부 안내',
    donationDisclaimer: '이것은 웹 앱이므로 현재 시뮬레이션 버튼을 사용합니다. 정식 버전에서는 Google Play 결제 시스템으로 연결됩니다.',
    later: '나중에',
    footerText: '미지를 탐험 • 현재를 즐김 • 건강 유지',
    km: 'km',
    min: '분',
    gpsError: '브라우저가 GPS를 지원하지 않습니다',
    locationError: '위치 정보 획득 실패',
    needLocation: '경로를 생성하려면 위치 정보를 활성화하세요',
    bearings: ['북쪽', '북동쪽', '동쪽', '남동쪽', '남쪽', '남서쪽', '서쪽', '북서쪽'],
    steps: (b, d) => [`현재 위치에서 출발`, `${b} 방향으로 이동`, `약 ${d} km 계속 걷기`, `목적지 도착 예정`]
  },
  'es': {
    title: 'Ruta de Hoy',
    subtitle: 'Today\'s Route',
    currentLocation: 'Ubicación Actual',
    accuracy: 'Precisión',
    routeSettings: 'Ajustes de Ruta',
    targetDistance: 'Distancia Objetivo',
    generateButton: 'Generar Ruta',
    explorationSuggestion: 'Sugerencia de Exploración',
    targetDirection: 'Dirección Objetivo',
    estDistance: 'Distancia Est.',
    estTime: 'Tiempo Est.',
    startNavigation: 'Iniciar Navegación',
    supportUs: 'Apóyanos',
    supportDesc: 'Tu apoyo nos motiva a seguir',
    buyCoffee: 'Invítame a un café',
    sponsorDev: 'Patrocinar Desarrollo',
    aboutDonation: 'Sobre Donaciones Google Play',
    donationDisclaimer: 'Como es una web app, usamos botones simulados. En producción, esto conectaría con Google Play o pagos de terceros.',
    later: 'Más tarde',
    footerText: 'Explora lo Desconocido • Disfruta el Momento • Mantente Sano',
    km: 'km',
    min: 'min',
    gpsError: 'GPS no compatible con tu navegador',
    locationError: 'Error de ubicación',
    needLocation: 'Activa la ubicación para generar la ruta',
    bearings: ['Norte', 'Noreste', 'Este', 'Sureste', 'Sur', 'Suroeste', 'Oeste', 'Noroeste'],
    steps: (b, d) => [`Salida desde ubicación actual`, `Hacia el ${b}`, `Caminar unos ${d} km`, `Llegada al destino`]
  },
  'fr': {
    title: 'Route du Jour',
    subtitle: 'Today\'s Route',
    currentLocation: 'Position Actuelle',
    accuracy: 'Précision',
    routeSettings: 'Réglages de Route',
    targetDistance: 'Distance Cible',
    generateButton: 'Générer la Route',
    explorationSuggestion: 'Suggestion d\'Exploration',
    targetDirection: 'Direction Cible',
    estDistance: 'Distance Est.',
    estTime: 'Temps Est.',
    startNavigation: 'Démarrer Navigation',
    supportUs: 'Soutenez-nous',
    supportDesc: 'Votre soutien nous motive',
    buyCoffee: 'Offrez-moi un café',
    sponsorDev: 'Parrainer le Développement',
    aboutDonation: 'À propos des dons Google Play',
    donationDisclaimer: 'Ceci étant une web app, nous utilisons des boutons simulés. En production, cela lierait au système Google Play.',
    later: 'Plus tard',
    footerText: 'Explorer l\'Inconnu • Profiter du Moment • Rester en Bonne Santé',
    km: 'km',
    min: 'min',
    gpsError: 'GPS non supporté par votre navigateur',
    locationError: 'Échec de localisation',
    needLocation: 'Activez la localisation pour générer la route',
    bearings: ['Nord', 'Nord-Est', 'Est', 'Sud-Est', 'Sud', 'Sud-Ouest', 'Ouest', 'Nord-Ouest'],
    steps: (b, d) => [`Départ de la position actuelle`, `Direction ${b}`, `Marcher environ ${d} km`, `Arrivée à destination`]
  }
};

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
  const [language, setLanguage] = useState<Language>('zh-TW');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const t = TRANSLATIONS[language];

  // --- Geolocation ---
  const updateLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError(t.gpsError);
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
        setError(`${t.locationError}: ${err.message}`);
      },
      { enableHighAccuracy: true }
    );
  }, [t]);

  useEffect(() => {
    updateLocation();
  }, [updateLocation]);

  // --- Route Generation Logic ---
  const generateRoute = () => {
    if (!location) {
      setError(t.needLocation);
      return;
    }

    setIsGenerating(true);
    
    // Simulate some calculation time for effect
    setTimeout(() => {
      const angles = [0, 45, 90, 135, 180, 225, 270, 315];
      const randomIdx = Math.floor(Math.random() * angles.length);
      const angle = angles[randomIdx];
      const bearingName = t.bearings[randomIdx];
      
      // Basic math to calculate a destination point (rough approximation)
      const latOffset = (distance * Math.cos(angle * Math.PI / 180)) / 111;
      const lngOffset = (distance * Math.sin(angle * Math.PI / 180)) / (111 * Math.cos(location.lat * Math.PI / 180));

      const newRoute: Route = {
        distance: distance,
        bearing: angle,
        bearingName: bearingName,
        destination: {
          lat: location.lat + latOffset,
          lng: location.lng + lngOffset,
        },
        estimatedTime: Math.round(distance * 12), // Assuming 5km/h walking speed
        steps: t.steps(bearingName, distance)
      };

      setGeneratedRoute(newRoute);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-black/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Navigation size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">{t.title}</h1>
            <p className="text-[10px] uppercase tracking-wider text-black/40 font-semibold">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <Languages size={20} className="text-black/60" />
            </button>
            <AnimatePresence>
              {showLangMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowLangMenu(false)} />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-black/5 py-2 z-40 overflow-hidden"
                  >
                    {(Object.keys(TRANSLATIONS) as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setShowLangMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-black/5 transition-colors"
                      >
                        <span className={language === lang ? 'font-bold text-emerald-600' : 'opacity-70'}>
                          {lang === 'zh-TW' ? '繁體中文' : 
                           lang === 'en' ? 'English' : 
                           lang === 'ja' ? '日本語' : 
                           lang === 'ko' ? '한국어' : 
                           lang === 'es' ? 'Español' : 'Français'}
                        </span>
                        {language === lang && <Check size={14} className="text-emerald-600" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          <button 
            onClick={() => setShowDonation(true)}
            className="p-2 hover:bg-black/5 rounded-full transition-colors relative group"
          >
            <Heart size={20} className="text-rose-500 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-6 space-y-8">
        {/* GPS Status Card */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm font-medium opacity-60">
              <MapPin size={16} />
              <span>{t.currentLocation}</span>
            </div>
            <button 
              onClick={updateLocation}
              className="p-1.5 hover:bg-black/5 rounded-lg transition-colors"
              title="Refresh Location"
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
              <p className="text-xs text-black/40">{t.accuracy}: ±{Math.round(location.accuracy)} m</p>
            </div>
          ) : (
            <div className="h-10 bg-black/5 animate-pulse rounded-xl"></div>
          )}
        </section>

        {/* Settings Card */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Settings size={18} className="opacity-40" />
            <h2 className="text-sm font-bold uppercase tracking-widest opacity-40">{t.routeSettings}</h2>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-sm font-medium opacity-60">{t.targetDistance}</label>
                <span className="text-3xl font-black text-emerald-600">
                  {distance} <span className="text-sm font-bold">{t.km}</span>
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
                <span>1 {t.km}</span>
                <span>8 {t.km}</span>
                <span>15 {t.km}</span>
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
                  <span>{t.generateButton}</span>
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
                <h2 className="text-sm font-bold uppercase tracking-widest opacity-40">{t.explorationSuggestion}</h2>
              </div>

              <div className="bg-emerald-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-800 rounded-full blur-3xl opacity-50"></div>
                
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-1">{t.targetDirection}</p>
                      <h3 className="text-4xl font-black">{generatedRoute.bearingName}</h3>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl">
                      <Compass size={32} className="text-emerald-300" style={{ transform: `rotate(${generatedRoute.bearing}deg)` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                      <p className="text-[10px] font-bold opacity-50 uppercase mb-1">{t.estDistance}</p>
                      <p className="text-xl font-bold">{generatedRoute.distance} {t.km}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                      <p className="text-[10px] font-bold opacity-50 uppercase mb-1">{t.estTime}</p>
                      <p className="text-xl font-bold">{generatedRoute.estimatedTime} {t.min}</p>
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
                    <span>{t.startNavigation}</span>
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
                <h3 className="text-2xl font-black">{t.supportUs}</h3>
                <p className="text-rose-100 text-sm">{t.supportDesc}</p>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <button className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black/90 transition-all active:scale-95">
                    <Coffee size={20} />
                    <span>{t.buyCoffee} (NT$ 50)</span>
                  </button>
                  <button className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all active:scale-95">
                    <Gift size={20} />
                    <span>{t.sponsorDev} (NT$ 150)</span>
                  </button>
                </div>

                <div className="bg-black/5 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold opacity-40">
                    <Info size={14} />
                    <span>{t.aboutDonation}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-60">
                    {t.donationDisclaimer}
                  </p>
                </div>

                <button 
                  onClick={() => setShowDonation(false)}
                  className="w-full py-2 text-sm font-bold opacity-30 hover:opacity-100 transition-opacity"
                >
                  {t.later}
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
          {t.footerText}
        </p>
      </footer>
    </div>
  );
}
