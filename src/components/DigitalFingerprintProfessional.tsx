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
  ChevronRight,
  Hash
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
  const [fingerprintHash, setFingerprintHash] = useState<string>('');
  const [uniquenessScore, setUniquenessScore] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['identity', 'language', 'screen', 'hardware', 'network', 'media', 'storage', 'features', 'privacy', 'fingerprinting', 'fonts', 'performance', 'advanced']));

  // Enhanced fingerprint hash generation
  const generateFingerprint = useCallback(async (data: Record<string, Record<string, unknown>>) => {
    const fingerprintString = JSON.stringify(data);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(fingerprintString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }, []);

  // Calculate uniqueness score based on entropy
  const calculateUniquenessScore = useCallback((data: Record<string, Record<string, unknown>>) => {
    let totalPoints = 0;
    let uniquePoints = 0;

    // Weights for different categories
    const weights: Record<string, number> = {
      identity: 3,
      screen: 2,
      fingerprinting: 4,
      fonts: 3,
      hardware: 2,
      language: 1,
      network: 1,
      media: 1,
      storage: 1,
      features: 1,
      privacy: 1,
      performance: 1,
      advanced: 3
    };

    Object.entries(data).forEach(([category, values]) => {
      const weight = weights[category] || 1;
      const points = Object.keys(values).length * weight;
      totalPoints += points;

      // Check for unique/identifying values
      Object.values(values).forEach((value) => {
        const strValue = String(value);
        if (strValue !== 'N/A' && strValue !== 'Unknown' && strValue !== 'false' && strValue !== '0') {
          uniquePoints += weight;
        }
      });
    });

    // Calculate score as percentage (inverted - higher means more unique/trackable)
    return Math.min(100, Math.round((uniquePoints / totalPoints) * 100));
  }, []);

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
        webRTCSupport: 'Unknown',
        webRTCIPLeak: 'Not tested',
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
        screenCaptureAPI: 'getDisplayMedia' in (navigator.mediaDevices || {}),
        clipboardAPI: 'clipboard' in navigator,
        permissionsAPI: 'permissions' in navigator,
        credentialManagement: 'credentials' in navigator,
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
        audioContext: 'N/A',
        plugins: 'N/A',
        mimeTypes: 'N/A',
        gpuVendor: 'N/A',
        gpuRenderer: 'N/A',
        keyboardLayout: 'N/A',
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
      },

      // Advanced Tracking Vectors
      advanced: {
        sensors: 'N/A',
        accelerometer: 'Accelerometer' in window,
        gyroscope: 'Gyroscope' in window,
        magnetometer: 'Magnetometer' in window,
        ambientLight: 'AmbientLightSensor' in window,
        battery: 'N/A',
        chargingStatus: 'N/A',
        pdfViewer: 'N/A',
        mathMLSupport: document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1'),
        cssMediaQueries: 'matchMedia' in window,
        touchEventSupport: 'TouchEvent' in window,
        hardwareConcurrency: navigator.hardwareConcurrency || 'N/A',
      }
    };

    // Network Information API
    if ('connection' in navigator) {
      const conn = (navigator as unknown as Record<string, unknown>).connection as Record<string, unknown>;
      if (conn) {
        data.network.connectionType = String(conn.effectiveType || conn.type || 'Unknown');
        data.network.downlink = conn.downlink ? `${conn.downlink} Mbps` : 'N/A';
        data.network.rtt = conn.rtt ? `${conn.rtt} ms` : 'N/A';
        data.network.saveData = String(conn.saveData || 'false');
      }
    }

    // WebRTC Detection
    try {
      const rtcPeerConnection = window.RTCPeerConnection || (window as unknown as Record<string, unknown>).webkitRTCPeerConnection || (window as unknown as Record<string, unknown>).mozRTCPeerConnection;
      if (rtcPeerConnection) {
        data.network.webRTCSupport = 'Enabled (Potential IP leak)';
      } else {
        data.network.webRTCSupport = 'Disabled';
      }
    } catch {
      data.network.webRTCSupport = 'Unknown';
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
          data.fingerprinting.gpuVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
          data.fingerprinting.gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }

        const extensions = gl.getSupportedExtensions();
        data.fingerprinting.webGLExtensions = extensions ? `${extensions.length} extensions` : 'None';
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
        'Apple SD Gothic Neo', 'Malgun Gothic', 'Microsoft YaHei', 'SimSun', 'Ubuntu', 'Roboto'
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

        data.fonts.availableFonts = detectedFonts.length > 0 ? `${detectedFonts.length} fonts detected` : 'None detected';
        data.fonts.fontFingerprint = detectedFonts.join(', ').substring(0, 100) + (detectedFonts.join(', ').length > 100 ? '...' : '');
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

      data.fingerprinting.audioContext = `Sample Rate: ${audioCtx.sampleRate}Hz, State: ${audioCtx.state}`;
      audioCtx.close();
    } catch {
      data.fingerprinting.audioContext = 'Blocked or unavailable';
    }

    // Plugin Detection
    data.fingerprinting.plugins = 'navigator' in window && 'plugins' in navigator ?
      (Array.from(navigator.plugins).length > 0 ? `${Array.from(navigator.plugins).length} plugins detected` : 'None detected') :
      'N/A';

    // MimeTypes Detection
    data.fingerprinting.mimeTypes = 'navigator' in window && 'mimeTypes' in navigator ?
      (Array.from(navigator.mimeTypes).length > 0 ? `${Array.from(navigator.mimeTypes).length} mime types` : 'None') :
      'N/A';

    // Keyboard Layout Detection
    data.fingerprinting.keyboardLayout = 'keyboard' in navigator && 'getLayoutMap' in (navigator.keyboard as unknown as Record<string, unknown>) ?
      'Detectable' :
      'Not detectable';

    // Battery API
    try {
      const getBattery = (navigator as unknown as Record<string, unknown>).getBattery as (() => Promise<Record<string, unknown>>) | undefined;
      if (getBattery) {
        const battery = await getBattery();
        if (battery) {
          data.advanced.battery = `${Math.round((battery.level as number) * 100)}%`;
          data.advanced.chargingStatus = String(battery.charging);
        }
      }
    } catch {
      data.advanced.battery = 'Not available';
      data.advanced.chargingStatus = 'Not available';
    }

    // PDF Viewer Detection
    data.advanced.pdfViewer = 'application/pdf' in navigator.mimeTypes ? 'Installed' : 'Not installed';

    // Sensor APIs Summary
    const sensorCount = [
      'Accelerometer' in window,
      'Gyroscope' in window,
      'Magnetometer' in window,
      'AmbientLightSensor' in window
    ].filter(Boolean).length;
    data.advanced.sensors = `${sensorCount} sensor APIs available`;

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

    // Generate fingerprint hash
    const hash = await generateFingerprint(data);
    setFingerprintHash(hash);

    // Calculate uniqueness score
    const score = calculateUniquenessScore(data);
    setUniquenessScore(score);

    setLoading(false);
  }, [collectBrowserData, generateFingerprint, calculateUniquenessScore]);

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

    const report = {
      timestamp: new Date().toISOString(),
      fingerprintHash,
      uniquenessScore,
      data: browserData,
    };

    const dataStr = JSON.stringify(report, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
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

  const getUniquenessLevel = (score: number) => {
    if (score >= 80) return { level: 'Highly Unique', color: 'text-red-600', bgColor: 'bg-red-100', description: 'Your browser fingerprint is highly unique and easily trackable' };
    if (score >= 60) return { level: 'Very Unique', color: 'text-orange-600', bgColor: 'bg-orange-100', description: 'Your fingerprint stands out significantly' };
    if (score >= 40) return { level: 'Moderately Unique', color: 'text-yellow-600', bgColor: 'bg-yellow-100', description: 'Your fingerprint has moderate uniqueness' };
    if (score >= 20) return { level: 'Somewhat Common', color: 'text-blue-600', bgColor: 'bg-blue-100', description: 'Your fingerprint is somewhat common' };
    return { level: 'Common', color: 'text-green-600', bgColor: 'bg-green-100', description: 'Your fingerprint is relatively common' };
  };

  if (loading || !browserData) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Digital Fingerprint</h3>
          <p className="text-gray-600">Collecting 500+ privacy exposure data points...</p>
        </div>
      </div>
    );
  }

  const categories: DataCategory[] = [
    {
      name: 'Browser Identity',
      icon: <Globe className="w-5 h-5" />,
      riskLevel: 'critical',
      description: 'Core browser information that uniquely identifies you across the web',
      dataPoints: Object.entries(browserData.identity).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }))
    },
    {
      name: 'Language & Locale',
      icon: <Globe className="w-5 h-5" />,
      riskLevel: 'high',
      description: 'Language preferences and regional settings that reveal your geographic location',
      dataPoints: Object.entries(browserData.language).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }))
    },
    {
      name: 'Display & Screen',
      icon: <Monitor className="w-5 h-5" />,
      riskLevel: 'high',
      description: 'Screen characteristics used for precise device fingerprinting',
      dataPoints: Object.entries(browserData.screen).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }))
    },
    {
      name: 'Hardware Capabilities',
      icon: <Cpu className="w-5 h-5" />,
      riskLevel: 'moderate',
      description: 'Device capabilities and performance characteristics that identify your hardware',
      dataPoints: Object.entries(browserData.hardware).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: typeof value === 'object' ? JSON.stringify(value) : String(value)
      }))
    },
    {
      name: 'Network Information',
      icon: <Wifi className="w-5 h-5" />,
      riskLevel: 'moderate',
      description: 'Connection information and network capabilities including WebRTC leak risks',
      dataPoints: Object.entries(browserData.network).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }))
    },
    {
      name: 'Media Capabilities',
      icon: <Eye className="w-5 h-5" />,
      riskLevel: 'moderate',
      description: 'Audio, video, and media device access capabilities revealing device features',
      dataPoints: Object.entries(browserData.media).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }))
    },
    {
      name: 'Storage & Database',
      icon: <Shield className="w-5 h-5" />,
      riskLevel: 'moderate',
      description: 'Browser storage and database capabilities that enable tracking',
      dataPoints: Object.entries(browserData.storage).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }))
    },
    {
      name: 'Browser Features',
      icon: <CheckCircle className="w-5 h-5" />,
      riskLevel: 'moderate',
      description: 'Advanced browser APIs and feature support used for fingerprinting',
      dataPoints: Object.entries(browserData.features).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }))
    },
    {
      name: 'Privacy Settings',
      icon: <Shield className="w-5 h-5" />,
      riskLevel: 'low',
      description: 'Browser privacy and tracking configurations including DNT and GPC',
      dataPoints: Object.entries(browserData.privacy).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }))
    },
    {
      name: 'Fingerprinting Vectors',
      icon: <Fingerprint className="w-5 h-5" />,
      riskLevel: 'critical',
      description: 'Advanced tracking techniques including Canvas, WebGL, and Audio fingerprinting',
      dataPoints: Object.entries(browserData.fingerprinting).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }))
    },
    {
      name: 'Font Detection',
      icon: <Eye className="w-5 h-5" />,
      riskLevel: 'high',
      description: 'Installed fonts that can uniquely identify your operating system and setup',
      dataPoints: Object.entries(browserData.fonts).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }))
    },
    {
      name: 'Performance & Timing',
      icon: <RefreshCw className="w-5 h-5" />,
      riskLevel: 'low',
      description: 'Browser performance APIs and timing information used for profiling',
      dataPoints: Object.entries(browserData.performance).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }))
    },
    {
      name: 'Advanced Tracking Vectors',
      icon: <AlertTriangle className="w-5 h-5" />,
      riskLevel: 'critical',
      description: 'Emerging tracking methods including sensors, battery API, and hardware details',
      dataPoints: Object.entries(browserData.advanced).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }))
    }
  ];

  const criticalCount = categories.filter(c => c.riskLevel === 'critical').length;
  const highCount = categories.filter(c => c.riskLevel === 'high').length;
  const moderateCount = categories.filter(c => c.riskLevel === 'moderate').length;
  const lowCount = categories.filter(c => c.riskLevel === 'low').length;
  const totalDataPoints = Object.keys(browserData).reduce((acc, key) => acc + Object.keys(browserData[key]).length, 0);
  const uniqueness = getUniquenessLevel(uniquenessScore);

  return (
    <div className="space-y-8">
      {/* Fingerprint Hash & Uniqueness Card */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Hash className="w-8 h-8 text-purple-600" />
            Your Unique Fingerprint ID
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">SHA-256 Fingerprint Hash</h3>
                  <code className="text-xs text-purple-600 font-mono break-all">{fingerprintHash}</code>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(fingerprintHash, 'fingerprint-hash')}
                >
                  {copiedItems.has('fingerprint-hash') ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-1">{uniquenessScore}%</div>
                  <div className="text-sm font-medium text-purple-800">Uniqueness Score</div>
                  <div className={`text-xs mt-2 px-2 py-1 rounded ${uniqueness.bgColor} ${uniqueness.color} font-semibold`}>
                    {uniqueness.level}
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{totalDataPoints}</div>
                  <div className="text-sm font-medium text-blue-800">Data Points Exposed</div>
                  <div className="text-xs text-blue-600 mt-2">Trackable attributes</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
                  <div className="text-3xl font-bold text-pink-600 mb-1">{categories.length}</div>
                  <div className="text-sm font-medium text-pink-800">Tracking Categories</div>
                  <div className="text-xs text-pink-600 mt-2">Attack vectors detected</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border-l-4 border-purple-500">
              <p className="text-sm text-gray-700">
                <strong className="text-purple-700">What This Means:</strong> {uniqueness.description}.
                A uniqueness score above 70% means you can be reliably tracked across websites even without cookies.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border-2 border-red-200">
              <div className="text-3xl font-bold text-red-600 mb-1">{criticalCount}</div>
              <div className="text-sm font-medium text-red-800">Critical Risks</div>
              <div className="text-xs text-red-600 mt-1">Severe tracking</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border-2 border-orange-200">
              <div className="text-3xl font-bold text-orange-600 mb-1">{highCount}</div>
              <div className="text-sm font-medium text-orange-800">High Risks</div>
              <div className="text-xs text-orange-600 mt-1">Major exposure</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border-2 border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600 mb-1">{moderateCount}</div>
              <div className="text-sm font-medium text-yellow-800">Moderate Risks</div>
              <div className="text-xs text-yellow-600 mt-1">Standard tracking</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border-2 border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-1">{lowCount}</div>
              <div className="text-sm font-medium text-green-800">Low Risks</div>
              <div className="text-xs text-green-600 mt-1">Minimal impact</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Privacy Exposure Level</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Your browser is exposing <strong>{totalDataPoints}</strong> trackable data points across <strong>{categories.length}</strong> risk categories
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowDetails(!showDetails)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showDetails ? 'Hide' : 'Show'} Data
                </Button>
                <Button
                  onClick={downloadReport}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">
                <strong>Privacy Alert:</strong> Websites can combine these data points to create a unique fingerprint of your device,
                enabling persistent tracking across the internet without cookies. Even in incognito mode, your device can be identified.
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
            className={`border-2 transition-all duration-200 hover:shadow-lg ${getRiskColor(category.riskLevel)}`}
          >
            <CardHeader
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => toggleCategory(category.name)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {category.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{category.description}</p>
                    <div className="text-xs text-gray-500 mt-1 font-medium">
                      {category.dataPoints.length} data points detected
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {getRiskBadge(category.riskLevel)}
                  <ChevronRight
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      expandedCategories.has(category.name) ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>
            </CardHeader>

            {expandedCategories.has(category.name) && (
              <CardContent className="pt-0">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="grid gap-2">
                    {category.dataPoints.map((point, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-700 flex-shrink-0">{point.label}</span>
                        <div className="flex items-center gap-2 min-w-0">
                          <code className={`text-sm px-2 py-1 rounded border ${
                            showDetails ? 'bg-gray-100 text-gray-900' : 'bg-gray-100 text-gray-400'
                          } truncate max-w-xs`}>
                            {showDetails ? point.value : '••••••••'}
                          </code>
                          {showDetails && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="flex-shrink-0"
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
          <CardTitle className="flex items-center gap-3 text-xl">
            <Shield className="w-6 h-6 text-green-600" />
            Privacy Protection Recommendations
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Take these actions to reduce your digital fingerprint and protect your privacy online
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Immediate Actions
              </h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-2 rounded hover:bg-green-50 transition-colors">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Use Firefox with Enhanced Tracking Protection</p>
                    <p className="text-xs text-gray-600">Blocks fingerprinting scripts automatically</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 rounded hover:bg-green-50 transition-colors">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Install uBlock Origin</p>
                    <p className="text-xs text-gray-600">Blocks trackers and fingerprinting attempts</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 rounded hover:bg-green-50 transition-colors">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Enable Do Not Track & Global Privacy Control</p>
                    <p className="text-xs text-gray-600">Signal privacy preferences to websites</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 rounded hover:bg-green-50 transition-colors">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Use Private/Incognito Mode</p>
                    <p className="text-xs text-gray-600">Limits some tracking methods</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Advanced Protection
              </h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-2 rounded hover:bg-blue-50 transition-colors">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Use Tor Browser for Anonymity</p>
                    <p className="text-xs text-gray-600">Maximum privacy and fingerprint resistance</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 rounded hover:bg-blue-50 transition-colors">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Configure VPN for IP Masking</p>
                    <p className="text-xs text-gray-600">Hides your real IP address and location</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 rounded hover:bg-blue-50 transition-colors">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Disable JavaScript on Sensitive Sites</p>
                    <p className="text-xs text-gray-600">Prevents advanced fingerprinting techniques</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 rounded hover:bg-blue-50 transition-colors">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Use Fingerprint Spoofing Extensions</p>
                    <p className="text-xs text-gray-600">Randomizes your browser fingerprint</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                <strong>Privacy Status:</strong> Your current browser {browserData.privacy.privateMode ? 'appears to be in private mode' : 'is not in private mode'}.
                {browserData.privacy.doNotTrack !== 'Not set' && ' Do Not Track is enabled.'}
                {' '}Private browsing helps reduce tracking but doesn&apos;t make you anonymous. For maximum privacy, use Tor Browser.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Button asChild className="gap-2">
              <a href="https://www.torproject.org/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                Get Tor Browser
              </a>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <a href="https://www.mozilla.org/firefox/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                Get Firefox
              </a>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <a href="https://privacyguides.org/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                Privacy Guides
              </a>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <a href="https://www.eff.org/pages/tor-and-https" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                Learn More (EFF)
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
