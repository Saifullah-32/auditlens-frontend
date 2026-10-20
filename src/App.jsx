import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Terminal, 
  Search, 
  Layers, 
  Mail,
  X,
  Activity,
  Settings,
  Home,
  Plus,
  Loader2
} from 'lucide-react';
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://auditlens-backend-v8hp.onrender.com';

// ==========================================
// 1. DASHBOARD COMPONENT
// ==========================================
function Dashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  
  const [targetUrl, setTargetUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState('');
  const [currentReport, setCurrentReport] = useState(null);

  // Ping backend to wake it up if slept
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
          userId: user?.id,
          userEmail: user?.primaryEmailAddress?.emailAddress 
        })
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      if (data.reportId) {
        pollReportStatus(data.reportId);
      } else {
        throw new Error("No reportId returned from server");
      }
      
    } catch (error) {
      console.error("Audit failed:", error);
      alert("Failed to trigger audit. Please check server logs or CORS configuration.");
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

            {/* Input Form */}
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

            {/* Active Audit Report Display */}
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
        return (
          <>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-medium tracking-tight mb-2">Scan History</h2>
                <p className="text-zinc-500 text-lg">Review past audit results.</p>
              </div>
            </div>
            <div className="bg-white border border-zinc-200 rounded-[2rem] p-16 shadow-sm text-center">
              <h3 className="text-2xl font-medium text-zinc-950 mb-3">Scan History</h3>
              <p className="text-zinc-500 text-lg max-w-md mx-auto">
                All scans conducted within your current session are displayed in the Overview tab.
              </p>
            </div>
          </>
        );

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
          <a href="/" className="font-bold text-3xl tracking-tighter flex items-center gap-1">
            AuditLens<span className="text-sm text-zinc-400 font-mono align-top ml-1">™</span>
          </a>
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
          <a href="/" className="w-full flex items-center gap-4 px-5 py-4 text-zinc-500 hover:bg-zinc-50 rounded-xl font-medium transition-colors text-lg">
            <Home className="w-6 h-6" /> Back to Website
          </a>
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

// ==========================================
// 2. LANDING PAGE COMPONENT
// ==========================================
function LandingPage() {
  const { isSignedIn, user } = useUser();
  const heroWords = ['audit', 'crawl', 'validate', 'scale'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`).catch(() => {});
    const interval = setInterval(() => setCurrentWordIndex((prev) => (prev + 1) % heroWords.length), 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-950 font-sans antialiased flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100 py-6">
        <div className="w-[96%] max-w-[1800px] mx-auto flex items-center justify-between">
          <a href="#" className="font-bold text-3xl tracking-tighter">AuditLens<span className="text-sm text-zinc-400 font-mono">™</span></a>
          <div className="flex items-center gap-6">
            {isSignedIn ? (
              <>
                <UserButton afterSignOutUrl="/" />
                <a href="/dashboard" className="bg-zinc-950 text-white px-6 py-3 rounded-xl font-medium">Dashboard</a>
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-zinc-950 text-white px-6 py-3 rounded-xl font-medium">Sign in</button>
              </SignInButton>
            )}
          </div>
        </div>
      </nav>

      <section className="pt-36 pb-28 text-center mx-auto w-[96%] max-w-[1800px]">
        <h1 className="text-7xl font-semibold tracking-tighter mb-8">
          The platform to <span className="underline decoration-zinc-200">{heroWords[currentWordIndex]}</span>
        </h1>
        <p className="text-2xl text-zinc-500 max-w-3xl mx-auto mb-12">
          Autonomous QA auditing built for modern engineering teams.
        </p>
        <a href={isSignedIn ? "/dashboard" : "#"} className="bg-zinc-950 text-white px-10 py-5 rounded-2xl font-medium text-xl inline-flex items-center gap-3">
          Get Started <ArrowRight className="w-6 h-6" />
        </a>
      </section>
    </div>
  );
}

export default function App() {
  return window.location.pathname === '/dashboard' ? <Dashboard /> : <LandingPage />;
}