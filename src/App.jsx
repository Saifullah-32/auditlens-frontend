import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Search, 
  Settings, 
  Activity, 
  Home, 
  Loader2,
  Play
} from 'lucide-react';
import { useUser, SignInButton, UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import ScanHistory from './ScanHistory';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://auditlens-backend-v8hp.onrender.com';

// ----------------------------------------------------------------------
// 3D ASCII PARTICLE BACKGROUND (Replicates the video's background)
// ----------------------------------------------------------------------
const ParticleGlobe = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Create a spherical distribution of ASCII characters
    const chars = ['0', '1', '+', '-', '.', '*', '|'];
    const particles = Array.from({ length: 1200 }).map(() => {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 350 + Math.random() * 250; // Radius range for a thick shell
      return {
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        char: chars[Math.floor(Math.random() * chars.length)],
        baseAlpha: 0.1 + Math.random() * 0.4
      };
    });

    let angle = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '14px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      angle += 0.0015; // Speed of rotation
      const sinA = Math.sin(angle);
      const cosA = Math.cos(angle);
      const cx = canvas.width / 2;
      // Shift center up slightly to match the video layout
      const cy = canvas.height / 2 - 100; 

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Rotate around Y-axis
        const rotX = p.x * cosA - p.z * sinA;
        const rotZ = p.z * cosA + p.x * sinA;
        const rotY = p.y;
        
        // Apply a slight static tilt on X-axis so we look down at it
        const tiltX = -0.3;
        const sinTilt = Math.sin(tiltX);
        const cosTilt = Math.cos(tiltX);
        const finalY = rotY * cosTilt - rotZ * sinTilt;
        const finalZ = rotZ * cosTilt + rotY * sinTilt;

        // 3D projection
        const fov = 1000;
        const zDepth = finalZ + fov;
        
        if (zDepth > 0) {
          const scale = fov / zDepth;
          const x2d = cx + rotX * scale;
          const y2d = cy + finalY * scale;
          
          // Opacity fades out in the distance
          const alpha = Math.max(0, Math.min(1, p.baseAlpha * (scale - 0.4)));
          
          ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
          ctx.fillText(p.char, x2d, y2d);
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-[120vh] z-0 pointer-events-none" 
      style={{ opacity: 0.6 }}
    />
  );
};


// ----------------------------------------------------------------------
// LANDING PAGE (Replicates the animations and layout)
// ----------------------------------------------------------------------
function LandingPage() {
  const navigate = useNavigate();
  const heroWords = ['build', 'create', 'scale', 'ship'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Smooth fade transition for the changing word
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`).catch(() => {});
    
    const interval = setInterval(() => {
      setFade(false); // trigger fade out
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % heroWords.length);
        setFade(true); // trigger fade in
      }, 400); // 400ms transition time
    }, 3000); // change word every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: '0 days', label: 'saved on builds', sub: 'NETFLIX' },
    { value: '98%', label: 'faster deployment', sub: 'STRIPE' },
    { value: '300%', label: 'throughput increase', sub: 'LINEAR' },
    { value: '6x', label: 'faster to ship', sub: 'NOTION' },
    { value: '20 days', label: 'saved on QA', sub: 'VERCEL' },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0a0a0a] font-sans antialiased flex flex-col relative overflow-x-hidden">
      
      {/* 3D Background Canvas */}
      <ParticleGlobe />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-100/50 py-4 transition-all">
        <div className="w-[96%] max-w-[1400px] mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="font-bold text-2xl tracking-tighter flex items-center">
            AuditLens<span className="text-xs text-zinc-400 font-mono ml-1 align-top">™</span>
          </button>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
            <a href="#features" className="hover:text-black transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-black transition-colors">How it works</a>
            <a href="#developers" className="hover:text-black transition-colors">Developers</a>
            <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
              <button onClick={() => navigate('/dashboard')} className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
                Dashboard
              </button>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-zinc-600 hover:text-black transition-colors mr-2">Sign in</button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-[0_0_15px_rgba(0,0,0,0.1)]">
                  Start creating
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-48 pb-24 w-[96%] max-w-[1400px] mx-auto flex flex-col items-center justify-center text-center">
        <p className="text-zinc-500 font-mono text-sm tracking-[0.2em] uppercase mb-8">
          The platform for modern teams
        </p>
        
        <h1 className="text-[5rem] md:text-[7.5rem] leading-[1.05] font-medium tracking-tighter mb-8 text-[#0a0a0a]">
          The platform to <br />
          <span className={`inline-block min-w-[300px] transition-all duration-400 ease-in-out ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {heroWords[currentWordIndex]}
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-zinc-500 max-w-3xl mx-auto mb-12 font-normal leading-relaxed">
          Your toolkit to stop configuring and start innovating. Securely build, deploy, and scale the best experiences.
        </p>

        <div className="flex items-center gap-4">
          <SignedIn>
            <button onClick={() => navigate('/dashboard')} className="bg-black hover:bg-zinc-800 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all shadow-xl hover:shadow-2xl">
              Go to Dashboard
            </button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-black hover:bg-zinc-800 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all shadow-xl hover:shadow-2xl">
                Start free trial
              </button>
            </SignInButton>
          </SignedOut>
          <button className="bg-white hover:bg-zinc-50 text-black border border-zinc-200 px-8 py-4 rounded-xl font-medium text-lg flex items-center gap-2 transition-all">
            <Play className="w-5 h-5 fill-current" /> Watch demo
          </button>
        </div>
      </main>

      {/* Stats Section */}
      <section className="relative z-10 w-full border-y border-zinc-100 bg-white/50 backdrop-blur-sm mt-12 py-10">
        <div className="max-w-[1400px] mx-auto w-[96%] flex flex-wrap justify-between items-center gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-4xl md:text-5xl font-medium tracking-tight mb-2">{stat.value}</span>
              <span className="text-sm text-zinc-500 mb-1">{stat.label}</span>
              <span className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase">{stat.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities Section Placeholder */}
      <section className="relative z-10 w-full bg-white py-32">
        <div className="max-w-[1400px] mx-auto w-[96%]">
          <p className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-6">Capabilities</p>
          <h2 className="text-5xl md:text-7xl font-medium tracking-tighter max-w-2xl mb-24 leading-tight">
            Everything you need.<br/>Nothing you don't.
          </h2>
          
          <div className="grid md:grid-cols-2 gap-16">
            <div className="border-t border-zinc-200 pt-8">
              <span className="text-sm font-mono text-zinc-400 mb-4 block">01</span>
              <h3 className="text-3xl font-medium mb-4">Instant Deployment</h3>
              <p className="text-zinc-500 text-lg leading-relaxed">Push to production in seconds. Our edge network ensures your applications load instantly, anywhere in the world.</p>
            </div>
            <div className="border-t border-zinc-200 pt-8">
              <span className="text-sm font-mono text-zinc-400 mb-4 block">02</span>
              <h3 className="text-3xl font-medium mb-4">AI-Native Workflows</h3>
              <p className="text-zinc-500 text-lg leading-relaxed">Build intelligent applications with built-in AI capabilities. From inference to training, everything scales automatically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Section Placeholder */}
      <section className="relative z-10 w-full bg-[#0a0a0a] text-white py-32">
        <div className="max-w-[1400px] mx-auto w-[96%]">
          <p className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-6">Process</p>
          <h2 className="text-5xl md:text-7xl font-medium tracking-tighter max-w-2xl mb-24 leading-tight">
            Three steps.<br/>Infinite possibilities.
          </h2>
        </div>
      </section>

    </div>
  );
}

// ----------------------------------------------------------------------
// DASHBOARD (Unchanged to protect your workflow)
// ----------------------------------------------------------------------
function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const [targetUrl, setTargetUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState('');
  const [currentReport, setCurrentReport] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`).catch(() => {});
  }, []);

  const handleRunAudit = async () => {
    if (!targetUrl) {
      alert("Please enter a URL to audit.");
      return;
    }

    setIsScanning(true);
    setScanProgress('Queuing audit job...');
    setCurrentReport(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: targetUrl,
          userId: user?.id || 'guest_user',
          userEmail: user?.primaryEmailAddress?.emailAddress || 'guest@auditlens.me'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || `HTTP error! Status: ${response.status}`);
      }

      if (data.reportId) {
        pollReportStatus(data.reportId);
      } else {
        throw new Error("No reportId returned from server");
      }
      
    } catch (error) {
      console.error("Audit failed:", error);
      alert(`Audit error: ${error.message}`);
      setIsScanning(false);
    }
  };

  const pollReportStatus = (reportId) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/audit/${reportId}`);
        if (!res.ok) return;

        const report = await res.json();
        const completed = report.reportData?.completed_pages || 0;
        const total = report.reportData?.total_pages_to_test || 1;

        setScanProgress(`Testing pages (${completed}/${total})...`);

        if (report.status === 'completed') {
          clearInterval(interval);
          setCurrentReport(report);
          setIsScanning(false);
          setScanProgress('');
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-medium tracking-tight mb-2">Your Audits</h2>
                <p className="text-zinc-500 text-lg">Manage and review your autonomous staging scans.</p>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-[2rem] p-10 mb-8 shadow-sm">
              <h3 className="text-2xl font-medium text-zinc-950 mb-3">Run New Audit</h3>
              <p className="text-zinc-500 text-lg mb-6">
                Enter a target URL to map routes and execute autonomous QA tests.
              </p>
              
              <div className="flex max-w-xl gap-3">
                <input 
                  type="url" 
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://example.com" 
                  disabled={isScanning}
                  className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-zinc-950 transition-shadow disabled:opacity-50"
                />
                <button 
                  onClick={handleRunAudit}
                  disabled={isScanning}
                  className="bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-400 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-sm active:scale-95 flex items-center gap-2"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    'Run Audit'
                  )}
                </button>
              </div>

              {isScanning && (
                <div className="mt-4 text-zinc-600 font-medium flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                  {scanProgress}
                </div>
              )}
            </div>

            {currentReport ? (
              <div className="bg-white border border-zinc-200 rounded-[2rem] p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-zinc-950">{currentReport.url}</h3>
                    <p className="text-zinc-500">Scan Status: <span className="text-emerald-600 font-semibold uppercase text-sm">{currentReport.status}</span></p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-zinc-950">{currentReport.reportData?.Issues?.length || 0}</span>
                    <p className="text-sm text-zinc-500">Issues Found</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-4 text-zinc-900">Detected Issues</h4>
                  {currentReport.reportData?.Issues?.length === 0 ? (
                    <p className="text-emerald-600 font-medium">No functional errors detected across pages!</p>
                  ) : (
                    <div className="space-y-4">
                      {currentReport.reportData?.Issues?.map((issue, idx) => (
                        <div key={idx} className="p-5 bg-red-50/50 border border-red-100 rounded-2xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-red-900">{issue.title || 'Functional Issue'}</span>
                            <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-bold uppercase">{issue.severity || 'Medium'}</span>
                          </div>
                          <p className="text-zinc-600 text-sm">{issue.description || JSON.stringify(issue)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              !isScanning && (
                <div className="bg-white border border-zinc-200 rounded-[2rem] p-16 text-center shadow-sm">
                  <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-100">
                    <Search className="w-8 h-8 text-zinc-400" />
                  </div>
                  <h3 className="text-2xl font-medium text-zinc-950 mb-3">No scans completed yet</h3>
                  <p className="text-zinc-500 text-lg max-w-md mx-auto">
                    Enter a target URL above to start an audit crawl.
                  </p>
                </div>
              )
            )}
          </>
        );

      case 'scan-history':
        return <ScanHistory />;

      case 'settings':
        return (
          <div className="bg-white border border-zinc-200 rounded-[2rem] p-10 shadow-sm space-y-6">
            <h2 className="text-3xl font-medium tracking-tight mb-2">Settings</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-500">Email Address</label>
              <input disabled type="text" value={user?.primaryEmailAddress?.emailAddress || ''} className="bg-zinc-50 border rounded-xl px-5 py-3 text-zinc-500 max-w-md" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex font-sans text-zinc-950 antialiased">
      <aside className="w-72 bg-white border-r border-zinc-200 flex flex-col">
        <div className="p-8 border-b border-zinc-100">
          <button onClick={() => navigate('/')} className="font-bold text-3xl tracking-tighter flex items-center gap-1 text-left">
            AuditLens<span className="text-sm text-zinc-400 font-mono align-top ml-1">™</span>
          </button>
        </div>
        
        <nav className="flex-1 p-5 space-y-3">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all text-lg ${
              activeTab === 'overview' ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50'
            }`}
          >
            <Activity className="w-6 h-6" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('scan-history')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all text-lg ${
              activeTab === 'scan-history' ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50'
            }`}
          >
            <Search className="w-6 h-6" /> Scan History
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all text-lg ${
              activeTab === 'settings' ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50'
            }`}
          >
            <Settings className="w-6 h-6" /> Settings
          </button>
        </nav>

        <div className="p-5 border-t border-zinc-200">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-4 px-5 py-4 text-zinc-500 hover:bg-zinc-50 rounded-xl font-medium transition-colors text-lg">
            <Home className="w-6 h-6" /> Back to Website
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-zinc-200 px-12 py-8 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back, {user?.firstName || 'there'}</h1>
          <div className="flex items-center gap-6">
            <span className="text-lg text-zinc-500">{user?.primaryEmailAddress?.emailAddress}</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        <div className="p-12 max-w-7xl w-full mx-auto flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

// ----------------------------------------------------------------------
// MAIN APP ROUTER
// ----------------------------------------------------------------------
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/dashboard" 
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <Navigate to="/" replace />
              </SignedOut>
            </>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}