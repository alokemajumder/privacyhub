'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  EyeOff, 
  Globe, 
  Monitor, 
  Wifi, 
  AlertTriangle,
  RefreshCw,
  Copy,
  CheckCircle,
  Shield,
  Cpu,
  Fingerprint,
  Download,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface DataCategory {
  name: string;
  icon: React.ReactNode;
  riskLevel: 'critical' | 'high' | 'moderate' | 'low';
  dataPoints: { label: string; value: string | number | boolean }[];
  description: string;
}

export function DigitalFingerprintProfessional() {
  const [browserData, setBrowserData] = useState<Record<string, Record<string, unknown>> | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['identity', 'language', 'screen', 'hardware', 'network', 'media', 'storage', 'features', 'privacy', 'fingerprinting', 'fonts', 'performance']));

  const collectBrowserData = useCallback(async () => {
    const data: Record<string, Record<string, unknown>> = {
      // Basic Identity
      identity: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        appName: navigator.appName,
        appVersion: navigator.appVersion,
        appCodeName: navigator.appCodeName,
        product: navigator.product,
        productSub: navigator.productSub,
        vendor: navigator.vendor,
        vendorSub: navigator.vendorSub,
        buildID: (navigator as unknown as Record<string, unknown>).buildID || 'N/A',
        oscpu: (navigator as unknown as Record<string, unknown>).oscpu || 'N/A',
      },

      // Language & Locale
      language: {
        primaryLanguage: navigator.language,
        allLanguages: navigator.languages ? Array.from(navigator.languages).join(', ') : 'N/A',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: `UTC${new Date().getTimezoneOffset() > 0 ? '-' : '+'}${Math.abs(new Date().getTimezoneOffset() / 60)}`,
        locale: Intl.DateTimeFormat().resolvedOptions().locale,
        currency: Intl.NumberFormat().resolvedOptions().currency || 'N/A',
        calendar: Intl.DateTimeFormat().resolvedOptions().calendar || 'N/A',
        numberingSystem: Intl.DateTimeFormat().resolvedOptions().numberingSystem || 'N/A',
        dateFormat: new Intl.DateTimeFormat().format(new Date()),
        timeFormat: new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(new Date()),
      },

      // Screen & Display
      screen: {
        resolution: `${screen.width} × ${screen.height}`,
        availableSpace: `${screen.availWidth} × ${screen.availHeight}`,
        colorDepth: `${screen.colorDepth}-bit`,
        pixelDepth: `${screen.pixelDepth}-bit`,
        devicePixelRatio: window.devicePixelRatio,
        screenOrientation: screen.orientation ? screen.orientation.type : 'N/A',
        screenAngle: screen.orientation ? screen.orientation.angle : 'N/A',
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        screenLeft: window.screenLeft || window.screenX,
        screenTop: window.screenTop || window.screenY,
      },

      // Hardware Capabilities
      hardware: {
        cpuCores: navigator.hardwareConcurrency || 'Unknown',
        deviceMemory: (navigator as unknown as Record<string, unknown>).deviceMemory ? `${(navigator as unknown as Record<string, unknown>).deviceMemory} GB` : 'N/A',
        maxTouchPoints: navigator.maxTouchPoints || 0,
        touchSupport: 'ontouchstart' in window,
        pointerEvents: 'PointerEvent' in window,
        vibrationAPI: 'vibrate' in navigator,
        gamepads: navigator.getGamepads ? navigator.getGamepads().length : 'N/A',
        webkitTemporaryStorage: 'webkitTemporaryStorage' in navigator,
        webkitPersistentStorage: 'webkitPersistentStorage' in navigator,
      },

      // Network Information
      network: {
        onLine: navigator.onLine,
        connectionType: 'Unknown',
        downlink: 'N/A',
        effectiveType: 'N/A',
        rtt: 'N/A',
        saveData: 'N/A',
      },

      // Media Capabilities
      media: {
        mediaDevices: 'mediaDevices' in navigator,
        webRTC: 'RTCPeerConnection' in window,
        webAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
        speechRecognition: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
        speechSynthesis: 'speechSynthesis' in window,
        webMIDI: 'requestMIDIAccess' in navigator,
        mediaRecorder: 'MediaRecorder' in window,
      },

      // Storage & Database
      storage: {
        localStorage: typeof localStorage !== 'undefined',
        sessionStorage: typeof sessionStorage !== 'undefined',
        indexedDB: 'indexedDB' in window,
        webSQL: 'openDatabase' in window,
        cookies: navigator.cookieEnabled,
        serviceWorker: 'serviceWorker' in navigator,
        cacheAPI: 'caches' in window,
        storageQuota: 'storage' in navigator && !!(navigator as unknown as Record<string, unknown>).storage,
      },

      // Browser Features
      features: {
        webGL: !!window.WebGLRenderingContext,
        webGL2: !!window.WebGL2RenderingContext,
        webAssembly: 'WebAssembly' in window,
        sharedArrayBuffer: 'SharedArrayBuffer' in window,
        webWorkers: 'Worker' in window,
        webSockets: 'WebSocket' in window,
        fetch: 'fetch' in window,
        webVR: 'getVRDisplays' in navigator,
        webXR: 'xr' in navigator,
        bluetooth: 'bluetooth' in navigator,
        usb: 'usb' in navigator,
        serial: 'serial' in navigator,
        hid: 'hid' in navigator,
        geolocation: 'geolocation' in navigator,
        notifications: 'Notification' in window,
        pushManager: 'PushManager' in window,
      },

      // Security & Privacy
      privacy: {
        doNotTrack: navigator.doNotTrack || 'Not set',
        globalPrivacyControl: (navigator as unknown as Record<string, unknown>).globalPrivacyControl || 'Not set',
        cookiesEnabled: navigator.cookieEnabled,
        thirdPartyCookies: 'N/A',
        privateMode: await detectPrivateMode(),
        adBlocker: 'N/A',
        tracking: 'N/A',
        referrer: document.referrer || 'Direct visit',
      },

      // Canvas & WebGL Fingerprinting
      fingerprinting: {
        canvasSupport: !!document.createElement('canvas').getContext,
        canvasFingerprint: 'N/A',
        webGLSupport: false,
        webGLVendor: 'N/A',
        webGLRenderer: 'N/A',
        webGLVersion: 'N/A',
        webGLShadingLanguage: 'N/A',
        webGLExtensions: 'N/A',
      },

      // Fonts & Text Rendering
      fonts: {
        availableFonts: 'N/A',
        fontFingerprint: 'N/A',
        textMetrics: 'N/A',
      },

      // Performance & Timing
      performance: {
        performanceAPI: 'performance' in window,
        navigationTiming: 'navigation' in performance,
        resourceTiming: 'getEntriesByType' in performance,
        userTiming: 'mark' in performance,
        highResTime: 'now' in performance,
        memoryInfo: 'memory' in performance ? JSON.stringify((performance as Record<string, unknown>).memory) : 'N/A',
      }
    };

    // Network Information API
    if ('connection' in navigator) {
      const conn = (navigator as unknown as Record<string, unknown>).connection as Record<string, unknown>;
      if (conn) {
        data.network.connectionType = conn.effectiveType || conn.type || 'Unknown';
        data.network.downlink = conn.downlink ? `${conn.downlink} Mbps` : 'N/A';
        data.network.rtt = conn.rtt ? `${conn.rtt} ms` : 'N/A';
      }
    }

    // Canvas Fingerprinting
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 200;
        canvas.height = 50;
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('Canvas fingerprint 🌐', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('Canvas fingerprint 🌐', 4, 17);
        data.fingerprinting.canvasFingerprint = canvas.toDataURL().substring(0, 50) + '...';
      }
    } catch {
      data.fingerprinting.canvasFingerprint = 'Blocked or unavailable';
    }

    // WebGL Information
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl && gl instanceof WebGLRenderingContext) {
        data.fingerprinting.webGLSupport = true;
        data.fingerprinting.webGLVersion = gl.getParameter(gl.VERSION);
        data.fingerprinting.webGLShadingLanguage = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          data.fingerprinting.webGLVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
          data.fingerprinting.webGLRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
        
        const extensions = gl.getSupportedExtensions();
        data.fingerprinting.webGLExtensions = extensions ? extensions.join(', ') : 'None';
      }
    } catch {
      // WebGL not available
    }

    // Font Detection
    try {
      const baseFonts = ['monospace', 'sans-serif', 'serif'];
      const testFonts = [
        'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Palatino',
        'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact',
        'Calibri', 'Cambria', 'Consolas', 'Lucida Console', 'Tahoma', 'Segoe UI',
        'Apple SD Gothic Neo', 'Malgun Gothic', 'Microsoft YaHei'
      ];
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const testString = 'mmmmmmmmmmlli';
        const testSize = '72px';
        const h = 100;
        const w = 100;
        
        canvas.width = w;
        canvas.height = h;
        
        const defaultWidth: Record<string, number> = {};
        const defaultHeight: Record<string, number> = {};
        
        for (const font of baseFonts) {
          ctx.font = `${testSize} ${font}`;
          const metrics = ctx.measureText(testString);
          defaultWidth[font] = metrics.width;
          defaultHeight[font] = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        }
        
        const detectedFonts: string[] = [];
        for (const font of testFonts) {
          let detected = false;
          for (const baseFont of baseFonts) {
            ctx.font = `${testSize} ${font}, ${baseFont}`;
            const metrics = ctx.measureText(testString);
            const width = metrics.width;
            const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
            
            if (width !== defaultWidth[baseFont] || height !== defaultHeight[baseFont]) {
              detected = true;
              break;
            }
          }
          if (detected) {
            detectedFonts.push(font);
          }
        }
        
        data.fonts.availableFonts = detectedFonts.join(', ') || 'None detected';
        data.fonts.fontFingerprint = `${detectedFonts.length} fonts detected`;
      }
    } catch {
      data.fonts.availableFonts = 'Detection failed';
      data.fonts.fontFingerprint = 'N/A';
    }

    // Audio Context Fingerprinting
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as Record<string, unknown>).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const analyser = audioCtx.createAnalyser();
      const gain = audioCtx.createGain();
      const scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);
      
      gain.gain.value = 0;
      oscillator.frequency.value = 10000;
      oscillator.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(gain);
      gain.connect(audioCtx.destination);
      
      data.fingerprinting.audioContext = 'Available';
      audioCtx.close();
    } catch {
      data.fingerprinting.audioContext = 'Blocked or unavailable';
    }

    // Battery API
    try {
      const getBattery = (navigator as unknown as Record<string, unknown>).getBattery as (() => Promise<Record<string, unknown>>) | undefined;
      if (getBattery) {
        const battery = await getBattery();
        if (battery) {
          data.hardware.battery = {
            level: `${Math.round((battery.level as number) * 100)}%`,
            charging: battery.charging as boolean,
          };
        }
      }
    } catch {
      // Battery API not available
    }

    return data;
  }, []);

  const detectPrivateMode = async (): Promise<boolean> => {
    try {
      const testKey = 'private_test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return false;
    } catch {
      return true;
    }
  };

  const loadBrowserData = useCallback(async () => {
    setLoading(true);
    const data = await collectBrowserData();
    setBrowserData(data);
    setLoading(false);
  }, [collectBrowserData]);

  useEffect(() => {
    loadBrowserData();
  }, [loadBrowserData]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItems(prev => new Set([...prev, key]));
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }, 2000);
    });
  };

  const downloadReport = () => {
    if (!browserData) return;
    
    const data = JSON.stringify(browserData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digital-fingerprint-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'moderate': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'critical': return <Badge className="bg-red-100 text-red-800 border-red-300">Critical Risk</Badge>;
      case 'high': return <Badge className="bg-orange-100 text-orange-800 border-orange-300">High Risk</Badge>;
      case 'moderate': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Moderate Risk</Badge>;
      case 'low': return <Badge className="bg-green-100 text-green-800 border-green-300">Low Risk</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  if (loading || !browserData) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Digital Fingerprint</h3>
          <p className="text-gray-600">Collecting privacy exposure data...</p>
        </div>
      </div>
    );
  }

  const categories: DataCategory[] = [
    {
      name: 'Browser Identity',
      icon: <Globe className="w-5 h-5" />,
      riskLevel: 'critical',
      description: 'Core browser information that uniquely identifies you',
      dataPoints: Object.entries(browserData.identity).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }))
    },
    {
      name: 'Language & Locale',
      icon: <Globe className="w-5 h-5" />,
      riskLevel: 'high',
      description: 'Language preferences and regional settings that reveal location',
      dataPoints: Object.entries(browserData.language).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }))
    },
    {
      name: 'Display & Screen',
      icon: <Monitor className="w-5 h-5" />,
      riskLevel: 'high',
      description: 'Screen characteristics used for device fingerprinting',
      dataPoints: Object.entries(browserData.screen).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }))
    },
    {
      name: 'Hardware Capabilities',
      icon: <Cpu className="w-5 h-5" />,
      riskLevel: 'moderate',
      description: 'Device capabilities and performance characteristics',
      dataPoints: Object.entries(browserData.hardware).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: typeof value === 'object' ? JSON.stringify(value) : String(value)
      }))
    },
    {
      name: 'Network Information',
      icon: <Wifi className="w-5 h-5" />,
      riskLevel: 'moderate',
      description: 'Connection information and network capabilities',
      dataPoints: Object.entries(browserData.network).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }))
    },
    {
      name: 'Media Capabilities',
      icon: <Eye className="w-5 h-5" />,
      riskLevel: 'moderate',
      description: 'Audio, video, and media device access capabilities',
      dataPoints: Object.entries(browserData.media).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }))
    },
    {
      name: 'Storage & Database',
      icon: <Shield className="w-5 h-5" />,
      riskLevel: 'moderate',
      description: 'Browser storage and database capabilities',
      dataPoints: Object.entries(browserData.storage).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }))
    },
    {
      name: 'Browser Features',
      icon: <CheckCircle className="w-5 h-5" />,
      riskLevel: 'moderate',
      description: 'Advanced browser APIs and feature support',
      dataPoints: Object.entries(browserData.features).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }))
    },
    {
      name: 'Privacy Settings',
      icon: <Shield className="w-5 h-5" />,
      riskLevel: 'low',
      description: 'Browser privacy and tracking configurations',
      dataPoints: Object.entries(browserData.privacy).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }))
    },
    {
      name: 'Fingerprinting Vectors',
      icon: <Fingerprint className="w-5 h-5" />,
      riskLevel: 'critical',
      description: 'Advanced tracking techniques used for unique identification',
      dataPoints: Object.entries(browserData.fingerprinting).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }))
    },
    {
      name: 'Font Detection',
      icon: <Eye className="w-5 h-5" />,
      riskLevel: 'high',
      description: 'Installed fonts that can uniquely identify your system',
      dataPoints: Object.entries(browserData.fonts).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }))
    },
    {
      name: 'Performance & Timing',
      icon: <RefreshCw className="w-5 h-5" />,
      riskLevel: 'low',
      description: 'Browser performance APIs and timing information',
      dataPoints: Object.entries(browserData.performance).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }))
    }
  ];

  const criticalCount = categories.filter(c => c.riskLevel === 'critical').length;
  const highCount = categories.filter(c => c.riskLevel === 'high').length;
  const moderateCount = categories.filter(c => c.riskLevel === 'moderate').length;
  const lowCount = categories.filter(c => c.riskLevel === 'low').length;

  return (
    <div className="space-y-8">
      {/* Risk Overview Card */}
      <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            Your Privacy Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-3xl font-bold text-red-600 mb-1">{criticalCount}</div>
              <div className="text-sm font-medium text-red-800">Critical Risks</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-3xl font-bold text-orange-600 mb-1">{highCount}</div>
              <div className="text-sm font-medium text-orange-800">High Risks</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-3xl font-bold text-yellow-600 mb-1">{moderateCount}</div>
              <div className="text-sm font-medium text-yellow-800">Moderate Risks</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-1">{lowCount}</div>
              <div className="text-sm font-medium text-green-800">Low Risks</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Privacy Exposure Level</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Your browser is exposing {Object.keys(browserData).reduce((acc, key) => acc + Object.keys(browserData[key]).length, 0)} trackable data points
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowDetails(!showDetails)} 
                  variant="outline"
                  className="gap-2"
                >
                  {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showDetails ? 'Hide' : 'Show'} Raw Data
                </Button>
                <Button 
                  onClick={downloadReport} 
                  variant="outline"
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Report
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">
                <strong>Privacy Alert:</strong> Websites can use this information to create a unique fingerprint of your device, 
                tracking you across the internet without cookies. Consider using privacy-focused browsers and extensions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Categories */}
      <div className="space-y-4">
        {categories.map((category) => (
          <Card 
            key={category.name} 
            className={`border-2 transition-all duration-200 ${getRiskColor(category.riskLevel)}`}
          >
            <CardHeader 
              className="cursor-pointer"
              onClick={() => toggleCategory(category.name)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {category.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getRiskBadge(category.riskLevel)}
                  <ChevronRight 
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedCategories.has(category.name) ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>
            </CardHeader>
            
            {expandedCategories.has(category.name) && (
              <CardContent className="pt-0">
                <div className="bg-white rounded-lg p-4">
                  <div className="grid gap-3">
                    {category.dataPoints.map((point, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-700">{point.label}</span>
                        <div className="flex items-center gap-2">
                          <code className={`text-sm px-2 py-1 rounded border ${
                            showDetails ? 'bg-gray-100 text-gray-900' : 'bg-gray-100 text-gray-400'
                          } max-w-xs truncate`}>
                            {showDetails ? point.value : '••••••••'}
                          </code>
                          {showDetails && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(String(point.value), `${category.name}-${index}`)}
                            >
                              {copiedItems.has(`${category.name}-${index}`) ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Protection Recommendations */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-green-600" />
            Privacy Protection Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 mb-3">Immediate Actions</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <p className="text-sm text-gray-700">Use Firefox with enhanced tracking protection</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <p className="text-sm text-gray-700">Install uBlock Origin ad blocker</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <p className="text-sm text-gray-700">Enable &quot;Do Not Track&quot; in browser settings</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <p className="text-sm text-gray-700">Use private/incognito browsing mode</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 mb-3">Advanced Protection</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-gray-700">Use Tor Browser for anonymous browsing</p>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-gray-700">Configure VPN for IP address masking</p>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-gray-700">Disable JavaScript on sensitive sites</p>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-gray-700">Use browser fingerprint spoofing extensions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Privacy Tip:</strong> Your current browser {browserData.privacy.privateMode ? 'appears to be in private mode' : 'is not in private mode'}. 
              Private browsing helps reduce tracking but doesn&apos;t make you anonymous.
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <Button asChild className="gap-2">
              <a href="https://www.torproject.org/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                Get Tor Browser
              </a>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <a href="https://privacyguides.org/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                Privacy Guides
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}