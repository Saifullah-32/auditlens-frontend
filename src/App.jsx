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
// 3D ASCII PARTICLE BACKGROUND 
// ----------------------------------------------------------------------
const ParticleGlobe = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      // Make canvas cover the hero section height
      canvas.height = window.innerHeight * 1.2; 
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const chars = ['0', '1', '+', '-', '.', '*', '|'];
    const particles = Array.from({ length: 1000 }).map(() => {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 350 + Math.random() * 300; 
      return {
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        char: chars[Math.floor(Math.random() * chars.length)],
        baseAlpha: 0.1 + Math.random() * 0.3
      };
    });

    let angle = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '14px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      angle += 0.0010; 
      const sinA = Math.sin(angle);
      const cosA = Math.cos(angle);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 - 50; 

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        const rotX = p.x * cosA - p.z * sinA;
        const rotZ = p.z * cosA + p.x * sinA;
        const rotY = p.y;
        
        const tiltX = -0.2;
        const sinTilt = Math.sin(tiltX);
        const cosTilt = Math.cos(tiltX);
        const finalY = rotY * cosTilt - rotZ * sinTilt;
        const finalZ = rotZ * cosTilt + rotY * sinTilt;

        const fov = 1000;
        const zDepth = finalZ + fov;
        
        if (zDepth > 0) {
          const scale = fov / zDepth;
          const x2d = cx + rotX * scale;
          const y2d = cy + finalY * scale;
          
          const alpha = Math.max(0, Math.min(1, p.baseAlpha * (scale - 0.3)));
          
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
    <div className="absolute top-0 left-0 w-full h-[120vh] overflow-hidden z-0 pointer-events-none">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{ opacity: 0.7 }}
      />
    </div>
  );
};

// ----------------------------------------------------------------------
// LANDING PAGE
// ----------------------------------------------------------------------
function LandingPage() {
  const navigate = useNavigate();
  // Updated words to match QA auditing niche
  const heroWords = ['audit', 'validate', 'crawl', 'test'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`).catch(() => {});
    
    const interval = setInterval(() => {
      setFade(false); 
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % heroWords.length);
        setFade(true); 
      }, 400); 
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0a0a0a] font-sans antialiased flex flex-col relative">
      
      <ParticleGlobe />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md py-5">
        <div className="w-[92%] max-w-[1200px] mx-auto flex items-center justify-between">
          
          <div className="flex-1">
            <button onClick={() => navigate('/')} className="font-bold text-xl tracking-tight flex items-center">
              AuditLens<span className="text-[10px] text-zinc-500 font-mono ml-1 align-top relative -top-1">™</span>
            </button>
          </div>
          
          <div className="flex-1 hidden md:flex justify-center items-center gap-10 text-[15px] font-medium text-zinc-500">
            <a href="#features" className="hover:text-black transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-black transition-colors">How it works</a>
            <a href="#developers" className="hover:text-black transition-colors">Developers</a>
            <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
          </div>

          <div className="flex-1 flex justify-end items-center gap-4">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
              <button onClick={() => navigate('/dashboard')} className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors">
                Dashboard
              </button>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-zinc-600 hover:text-black transition-colors mr-2">Sign in</button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm">
                  Dashboard
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-48 pb-32 w-[92%] max-w-[1200px] mx-auto flex flex-col items-center justify-center text-center">
        <p className="text-zinc-500 font-medium text-[11px] tracking-[0.3em] uppercase mb-10">
          THE PLATFORM FOR MODERN ENGINEERING TEAMS
        </p>
        
        <h1 className="text-[5rem] md:text-[8rem] leading-[1.05] font-medium tracking-tighter mb-8 text-[#0a0a0a]">
          The platform to <br />
          <span className={`inline-block min-w-[300px] transition-all duration-400 ease-in-out ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {heroWords[currentWordIndex]}
          </span>
        </h1>

        <p className="text-xl md:text-[22px] text-zinc-500 max-w-3xl mx-auto mb-14 font-normal leading-relaxed">
          Your toolkit to stop manual testing and start shipping. Autonomously crawl, validate, and secure your web applications in seconds.
        </p>

        <div className="flex items-center gap-4">
          <SignedIn>
            <button onClick={() => navigate('/dashboard')} className="bg-black hover:bg-zinc-800 text-white px-8 py-4 rounded-xl font-medium text-[17px] transition-all shadow-xl hover:shadow-2xl">
              Go to Dashboard
            </button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-black hover:bg-zinc-800 text-white px-8 py-4 rounded-xl font-medium text-[17px] transition-all shadow-xl hover:shadow-2xl">
                Go to Dashboard
              </button>
            </SignInButton>
          </SignedOut>
          <button className="bg-white hover:bg-zinc-50 text-black border border-zinc-200 px-8 py-4 rounded-xl font-medium text-[17px] flex items-center gap-3 transition-all shadow-sm">
            <Play className="w-4 h-4 fill-current" /> Watch demo
          </button>
        </div>
      </main>

      {/* Stats Section - Updated for QA/Auditing */}
      <section className="relative z-10 w-full bg-white pt-24 pb-32">
        <div className="max-w-[1200px] mx-auto w-[92%] flex flex-wrap justify-between items-start gap-8">
          
          <div className="flex flex-col items-start">
            <span className="text-5xl md:text-6xl font-medium tracking-tighter mb-3">100+</span>
            <span className="text-[15px] text-zinc-500 mb-2">hours saved on QA</span>
            <span className="text-[10px] text-zinc-400 tracking-[0.1em] uppercase font-medium">STARTUPS</span>
          </div>

          <div className="flex flex-col items-start">
            <span className="text-5xl md:text-6xl font-medium tracking-tighter mb-3">10x</span>
            <span className="text-[15px] text-zinc-500 mb-2">faster bug detection</span>
            <span className="text-[10px] text-zinc-400 tracking-[0.1em] uppercase font-medium">AGENCIES</span>
          </div>

          <div className="flex flex-col items-start">
            <span className="text-5xl md:text-6xl font-medium tracking-tighter mb-3">0</span>
            <span className="text-[15px] text-zinc-500 mb-2">configuration required</span>
            <span className="text-[10px] text-zinc-400 tracking-[0.1em] uppercase font-medium">PLUG & PLAY</span>
          </div>

          <div className="flex flex-col items-start">
            <span className="text-5xl md:text-6xl font-medium tracking-tighter mb-3">99%</span>
            <span className="text-[15px] text-zinc-500 mb-2">automated test coverage</span>
            <span className="text-[10px] text-zinc-400 tracking-[0.1em] uppercase font-medium">ENTERPRISE</span>
          </div>

          <div className="flex flex-col items-start">
            <span className="text-5xl md:text-6xl font-medium tracking-tighter mb-3">24/7</span>
            <span className="text-[15px] text-zinc-500 mb-2">continuous monitoring</span>
            <span className="text-[10px] text-zinc-400 tracking-[0.1em] uppercase font-medium">RELIABILITY</span>
          </div>

        </div>
      </section>

      {/* Capabilities Section - Updated for QA/Auditing */}
      <section className="relative z-10 w-full bg-white pb-32 pt-10">
        <div className="max-w-[1200px] mx-auto w-[92%]">
          <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-[0.2em] mb-8">CAPABILITIES</p>
          <h2 className="text-5xl md:text-[5rem] leading-[1.05] font-medium tracking-tighter max-w-3xl mb-28">
            Everything you need.<br/>Nothing you don't.
          </h2>
          
          <div className="grid md:grid-cols-2 gap-x-20 gap-y-16">
            <div className="border-t border-zinc-200 pt-8">
              <span className="text-xs font-mono text-zinc-400 mb-5 block">01</span>
              <h3 className="text-3xl font-medium mb-4 tracking-tight">Autonomous Crawling</h3>
              <p className="text-zinc-500 text-[17px] leading-relaxed">Simply provide a target URL and watch as AuditLens maps your entire web application. We automatically identify all routes and pages without you writing a single test script.</p>
            </div>
            <div className="border-t border-zinc-200 pt-8">
              <span className="text-xs font-mono text-zinc-400 mb-5 block">02</span>
              <h3 className="text-3xl font-medium mb-4 tracking-tight">Deep Functional Analysis</h3>
              <p className="text-zinc-500 text-[17px] leading-relaxed">Instantly detect broken links, console warnings, and structural errors. Get detailed, actionable reports to fix functional issues before they reach your end users.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Process Section */}
      <section className="relative z-10 w-full bg-[#0a0a0a] text-white py-40">
        <div className="max-w-[1200px] mx-auto w-[92%]">
          <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-[0.2em] mb-10">PROCESS</p>
          <h2 className="text-5xl md:text-[5.5rem] leading-[1.05] font-medium tracking-tighter max-w-4xl">
            Three steps.<br/>Zero bugs.
          </h2>
        </div>
      </section>

    </div>
  );
}

// ----------------------------------------------------------------------
// DASHBOARD
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
            AuditLens<span className="text-[10px] text-zinc-400 font-mono align-top ml-1 relative -top-1">™</span>
          </button>
        </div>
        
        <nav className="flex-1 p-5 space-y-3">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all text-[15px] ${
              activeTab === 'overview' ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50'
            }`}
          >
            <Activity className="w-5 h-5" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('scan-history')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all text-[15px] ${
              activeTab === 'scan-history' ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50'
            }`}
          >
            <Search className="w-5 h-5" /> Scan History
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all text-[15px] ${
              activeTab === 'settings' ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50'
            }`}
          >
            <Settings className="w-5 h-5" /> Settings
          </button>
        </nav>

        <div className="p-5 border-t border-zinc-200">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-4 px-5 py-4 text-zinc-500 hover:bg-zinc-50 rounded-xl font-medium transition-colors text-[15px]">
            <Home className="w-5 h-5" /> Back to Website
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-zinc-200 px-12 py-8 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {user?.firstName || 'there'}</h1>
          <div className="flex items-center gap-6">
            <span className="text-[15px] text-zinc-500">{user?.primaryEmailAddress?.emailAddress}</span>
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