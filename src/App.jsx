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
  Plus
} from 'lucide-react';
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react';

// ==========================================
// 1. DASHBOARD COMPONENT
// ==========================================
function Dashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');

  // Render dynamic dashboard content based on active tab
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
              <button className="bg-zinc-950 hover:bg-zinc-800 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm active:scale-95 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                New Scan
              </button>
            </div>

            {/* Empty State Card */}
            <div className="bg-white border border-zinc-200 rounded-[2rem] p-16 text-center shadow-sm">
              <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-100">
                <Search className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-2xl font-medium text-zinc-950 mb-3">No scans found</h3>
              <p className="text-zinc-500 text-lg max-w-md mx-auto mb-8">
                You haven't run any autonomous audits yet. Enter a staging or production URL to begin your first deep crawl.
              </p>
              <div className="flex max-w-lg mx-auto gap-3">
                <input 
                  type="url" 
                  placeholder="https://staging.your-app.com" 
                  className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-zinc-950 transition-shadow"
                />
                <button className="bg-zinc-950 hover:bg-zinc-800 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-sm active:scale-95">
                  Run Audit
                </button>
              </div>
            </div>
          </>
        );

      case 'scan-history':
        return (
          <>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-medium tracking-tight mb-2">Scan History</h2>
                <p className="text-zinc-500 text-lg">Review past audit results and regression reports.</p>
              </div>
            </div>
            <div className="bg-white border border-zinc-200 rounded-[2rem] p-16 shadow-sm text-center">
              <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-100">
                <Activity className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-2xl font-medium text-zinc-950 mb-3">History is empty</h3>
              <p className="text-zinc-500 text-lg max-w-md mx-auto">
                Once you complete your first scan, detailed logs and CSV exports will appear here.
              </p>
            </div>
          </>
        );

      case 'settings':
        return (
          <>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-medium tracking-tight mb-2">Settings</h2>
                <p className="text-zinc-500 text-lg">Manage your account and billing preferences.</p>
              </div>
            </div>
            <div className="bg-white border border-zinc-200 rounded-[2rem] p-10 shadow-sm space-y-10">
              
              <div>
                <h4 className="text-xl font-medium text-zinc-950 mb-5">Account Information</h4>
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Email Address</label>
                  <input 
                    disabled 
                    type="text" 
                    value={user?.primaryEmailAddress?.emailAddress || ''} 
                    className="bg-zinc-50 border border-zinc-200 rounded-xl px-5 py-4 text-zinc-500 max-w-md text-lg" 
                  />
                </div>
              </div>

              <div className="pt-10 border-t border-zinc-100">
                <h4 className="text-xl font-medium text-zinc-950 mb-5">Subscription Plan</h4>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-8 bg-zinc-50 rounded-2xl border border-zinc-200 max-w-3xl gap-6">
                  <div>
                    <div className="font-semibold text-zinc-950 text-xl mb-1">Starter Plan (Free)</div>
                    <div className="text-lg text-zinc-500">1 target URL limit • Basic UI checks</div>
                  </div>
                  <a 
                    href="/#pricing" 
                    className="bg-white border-2 border-zinc-200 hover:border-zinc-950 hover:text-zinc-950 text-zinc-600 px-6 py-3 rounded-xl font-medium transition-colors text-center"
                  >
                    Upgrade Plan
                  </a>
                </div>
              </div>

            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex font-sans text-zinc-950 antialiased">
      
      {/* Sidebar Navigation */}
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
              activeTab === 'overview' 
                ? 'bg-zinc-100 text-zinc-950 shadow-sm' 
                : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
            }`}
          >
            <Activity className="w-6 h-6" />
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('scan-history')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all text-lg ${
              activeTab === 'scan-history' 
                ? 'bg-zinc-100 text-zinc-950 shadow-sm' 
                : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
            }`}
          >
            <Search className="w-6 h-6" />
            Scan History
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all text-lg ${
              activeTab === 'settings' 
                ? 'bg-zinc-100 text-zinc-950 shadow-sm' 
                : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
            }`}
          >
            <Settings className="w-6 h-6" />
            Settings
          </button>
        </nav>

        <div className="p-5 border-t border-zinc-200">
          <a href="/" className="w-full flex items-center gap-4 px-5 py-4 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 rounded-xl font-medium transition-colors text-lg">
            <Home className="w-6 h-6" />
            Back to Website
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Dashboard Header */}
        <header className="bg-white border-b border-zinc-200 px-12 py-8 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back, {user?.firstName || 'there'}
          </h1>
          <div className="flex items-center gap-6">
            <div className="text-lg text-zinc-500 font-medium">
              {user?.primaryEmailAddress?.emailAddress}
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Dashboard Content Container */}
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
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % heroWords.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [activeModal]);

  const handleCheckout = (checkoutBaseUrl) => {
    if (!isSignedIn) {
      alert('Please sign in or create an account first to link your subscription.');
      return;
    }
    const checkoutUrl = new URL(checkoutBaseUrl);
    checkoutUrl.searchParams.set('checkout[custom][clerkUserId]', user.id);
    checkoutUrl.searchParams.set('checkout[email]', user.primaryEmailAddress?.emailAddress || '');
    window.location.href = checkoutUrl.toString();
  };

  const PRO_CHECKOUT_URL = 'https://audit-iq.lemonsqueezy.com/buy/pro-plan-placeholder';
  const PRO_PLUS_CHECKOUT_URL = 'https://audit-iq.lemonsqueezy.com/buy/pro-plus-placeholder';

  const modalData = {
    changelog: {
      title: "Changelog",
      body: (
        <div className="space-y-8">
          <div>
            <h4 className="font-bold text-zinc-950 text-xl">v1.0.2 - September 2026</h4>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-zinc-600">
              <li>Added interactive modal portals for legal and company pages.</li>
              <li>Improved ultra-wide monitor responsive layouts and typography scaling.</li>
              <li>Introduced dynamic tab routing for the Dashboard panel.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-zinc-950 text-xl">v1.0.1 - August 2026</h4>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-zinc-600">
              <li>Integrated Lemon Squeezy payment webhooks.</li>
              <li>Added Clerk authentication guardrails.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-zinc-950 text-xl">v1.0.0 - July 2026</h4>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-zinc-600">
              <li>Initial release of the AuditLens autonomous AI engine.</li>
            </ul>
          </div>
        </div>
      )
    },
    careers: {
      title: "Careers",
      body: (
        <div className="space-y-6">
          <p>AuditLens is growing! We are currently looking for passionate individuals to join our remote-first team at Software Index.</p>
          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200">
            <h4 className="font-bold text-zinc-950 text-xl mb-4">Open Positions:</h4>
            <ul className="space-y-4">
              <li className="flex justify-between items-center border-b border-zinc-200 pb-4">
                <div>
                  <div className="font-semibold text-zinc-950">Senior Frontend Engineer</div>
                  <div className="text-sm text-zinc-500">React, Tailwind CSS • Remote</div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">Actively Hiring</span>
              </li>
            </ul>
          </div>
          <p>Send your resume and portfolio to <a href="mailto:software.index.si@gmail.com" className="text-zinc-950 underline font-medium">software.index.si@gmail.com</a> to apply.</p>
        </div>
      )
    },
    blog: {
      title: "Blog",
      body: (
        <div className="space-y-8">
          <article className="border-b border-zinc-200 pb-8">
            <div className="text-sm font-mono text-zinc-400 mb-2">September 2026 • By Saifullah Abid</div>
            <h4 className="font-bold text-zinc-950 text-2xl mb-3">The Future of Autonomous QA</h4>
            <p className="text-zinc-600 leading-relaxed mb-4">
              Traditional end-to-end testing is brittle. By leveraging AI-native agents, we can now simulate human behavior across complex DOMs without writing thousands of lines of fragile Selenium scripts. AuditLens represents the next step in deployment confidence.
            </p>
            <button className="text-zinc-950 font-medium hover:underline">Read full article →</button>
          </article>
        </div>
      )
    },
    privacy: {
      title: "Privacy Policy",
      body: (
        <div className="space-y-6 text-zinc-600 leading-relaxed">
          <p className="font-medium text-zinc-950">Last Updated: September 2026</p>
          <p>AuditLens and Software Index respect your privacy. We collect minimal information required to operate our service.</p>
          <h4 className="font-bold text-zinc-950 text-xl mt-6">1. Data Collection</h4>
          <p>We collect your email address via our authentication provider (Clerk) and payment details securely via our merchant of record (Lemon Squeezy). We do not store full credit card numbers on our servers.</p>
          <h4 className="font-bold text-zinc-950 text-xl mt-6">2. Usage Data</h4>
          <p>Our AI agents scan the target URLs you explicitly provide. We do not retain crawled DOM data, screenshots, or sensitive environment variables longer than 30 days after an audit completes.</p>
          <h4 className="font-bold text-zinc-950 text-xl mt-6">3. Third-Party Sharing</h4>
          <p>We do not sell your personal data. We only share necessary data with compliance and payment partners to facilitate standard SaaS operations.</p>
        </div>
      )
    },
    terms: {
      title: "Terms of Service",
      body: (
        <div className="space-y-6 text-zinc-600 leading-relaxed">
          <p className="font-medium text-zinc-950">Last Updated: September 2026</p>
          <p>By using AuditLens, you agree to these terms binding you and Software Index.</p>
          <h4 className="font-bold text-zinc-950 text-xl mt-6">1. Acceptable Use</h4>
          <p>You may only audit domains and staging environments you own or have explicit authorization to test. Using our autonomous agents for scraping external competitors, DDoS simulation, or unauthorized penetration testing is strictly prohibited and will result in immediate account termination.</p>
          <h4 className="font-bold text-zinc-950 text-xl mt-6">2. Service Limits</h4>
          <p>Free tier users are limited to 1 target URL. Pro and Pro Plus users must adhere to specified rate limits to ensure platform stability for all tenants.</p>
          <h4 className="font-bold text-zinc-950 text-xl mt-6">3. Liability</h4>
          <p>AuditLens is provided "as is". We are not liable for production downtime, lost revenue, or damages resulting from missed regressions or false positive test results.</p>
        </div>
      )
    },
    cookies: {
      title: "Cookie Policy",
      body: (
        <div className="space-y-6 text-zinc-600 leading-relaxed">
          <p className="font-medium text-zinc-950">Last Updated: September 2026</p>
          <p>We use cookies to ensure the basic functionality and security of the AuditLens platform.</p>
          <h4 className="font-bold text-zinc-950 text-xl mt-6">Essential Cookies</h4>
          <p>These are required to maintain your logged-in session securely via Clerk and manage payment state transitions.</p>
          <h4 className="font-bold text-zinc-950 text-xl mt-6">Analytics Cookies</h4>
          <p>We use minimal, anonymous telemetry to help us understand which features (like specific assertion types or webhook integrations) are used most often, allowing us to improve the platform.</p>
          <p className="pt-4 border-t border-zinc-200">You can disable non-essential cookies in your browser settings, though some dashboard functionality may be reduced.</p>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-zinc-900 selection:text-white antialiased flex flex-col relative">
      
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/60 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-10 md:p-14 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-zinc-100">
                <h2 className="text-4xl font-bold text-zinc-950 tracking-tight">{modalData[activeModal].title}</h2>
                <button 
                  onClick={() => setActiveModal(null)} 
                  className="p-3 hover:bg-zinc-100 rounded-full transition-colors text-zinc-500 hover:text-zinc-950"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>
              <div className="text-xl">
                {modalData[activeModal].body}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100 py-6 transition-all">
        <div className="w-[96%] max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <a href="#" className="font-bold text-3xl tracking-tighter flex items-center gap-1">
              AuditLens<span className="text-sm text-zinc-400 font-mono align-top ml-1">™</span>
            </a>
            <div className="hidden lg:flex items-center gap-10 text-lg font-medium text-zinc-500">
              <a href="#features" className="hover:text-zinc-950 transition-colors">Features</a>
              <a href="#workflow" className="hover:text-zinc-950 transition-colors">How it works</a>
              <a href="#pricing" className="hover:text-zinc-950 transition-colors">Pricing</a>
              <a href="#about" className="hover:text-zinc-950 transition-colors">About Us</a>
              <a href="#contact" className="hover:text-zinc-950 transition-colors">Contact Us</a>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {isSignedIn ? (
              <div className="flex items-center gap-5">
                <span className="text-base text-zinc-500 hidden sm:inline">{user.primaryEmailAddress?.emailAddress}</span>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="text-lg font-medium hover:text-zinc-600 transition-colors">Sign in</button>
              </SignInButton>
            )}
            
            {isSignedIn ? (
              <a 
                href="/dashboard"
                className="bg-zinc-950 hover:bg-zinc-800 text-white px-8 py-3 rounded-xl text-lg font-medium transition-all shadow-sm active:scale-95"
              >
                Dashboard
              </a>
            ) : (
              <a 
                href="#pricing"
                className="bg-zinc-950 hover:bg-zinc-800 text-white px-8 py-3 rounded-xl text-lg font-medium transition-all shadow-sm active:scale-95"
              >
                Start creating
              </a>
            )}
          </div>
        </div>
      </nav>

      <section className="relative pt-36 pb-28 overflow-hidden text-center mx-auto w-[96%] max-w-[1800px]">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-zinc-200 text-base font-mono tracking-wide text-zinc-600 mb-12 uppercase">
          The platform for modern QA teams
        </div>
        <h1 className="text-7xl sm:text-8xl md:text-[140px] font-semibold tracking-tighter leading-tight mb-12 text-zinc-950">
          The platform <br className="hidden sm:inline" />
          to{' '}
          <span className="inline-grid grid-cols-1 grid-rows-1 items-center text-left min-w-[320px] sm:min-w-[550px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={heroWords[currentWordIndex]}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="col-start-1 row-start-1 text-zinc-950 underline decoration-zinc-200 underline-offset-[16px]"
              >
                {heroWords[currentWordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>
        <p className="text-2xl sm:text-3xl text-zinc-500 max-w-4xl mx-auto mb-16 leading-relaxed font-normal">
          Your autonomous agent toolkit to stop configuring and start shipping. Securely audit URLs, detect regressions, and verify production reliability.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href="#pricing"
            className="w-full sm:w-auto bg-zinc-950 hover:bg-zinc-800 text-white px-12 py-5 rounded-2xl font-medium text-xl flex items-center justify-center gap-3 transition-all shadow-md group"
          >
            Start free trial
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </a>
          <button 
            onClick={() => alert('Demo scanner active. Insert target URL in dashboard.')}
            className="w-full sm:w-auto border-2 border-zinc-200 hover:border-zinc-300 bg-white px-12 py-5 rounded-2xl font-medium text-xl text-zinc-800 transition-all"
          >
            Watch demo
          </button>
        </div>
      </section>

      <section className="border-y border-zinc-100 py-20 bg-zinc-50/40">
        <div className="w-[96%] max-w-[1800px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div><div className="text-6xl sm:text-7xl font-semibold tracking-tight text-zinc-950">0 days</div><div className="text-base uppercase tracking-wider text-zinc-400 mt-4 font-mono">Setup overhead</div></div>
          <div><div className="text-6xl sm:text-7xl font-semibold tracking-tight text-zinc-950">98%</div><div className="text-base uppercase tracking-wider text-zinc-400 mt-4 font-mono">Faster regressions</div></div>
          <div><div className="text-6xl sm:text-7xl font-semibold tracking-tight text-zinc-950">300%</div><div className="text-base uppercase tracking-wider text-zinc-400 mt-4 font-mono">Coverage increase</div></div>
          <div><div className="text-6xl sm:text-7xl font-semibold tracking-tight text-zinc-950">12ms</div><div className="text-base uppercase tracking-wider text-zinc-400 mt-4 font-mono">Audit response</div></div>
        </div>
      </section>

      <section id="features" className="py-36 mx-auto w-[96%] max-w-[1800px]">
        <div className="mb-24">
          <span className="text-base font-mono uppercase tracking-widest text-zinc-400">Capabilities</span>
          <h2 className="text-6xl sm:text-7xl font-medium tracking-tight text-zinc-950 mt-6 leading-tight">Everything you need.<br />Nothing you don't.</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="border border-zinc-200 rounded-[2.5rem] p-14 hover:border-zinc-300 transition-all bg-white flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-base font-mono text-zinc-400">01</span>
              <h3 className="text-4xl font-medium mt-8 mb-6">Instant Autonomous Auditing</h3>
              <p className="text-zinc-500 text-xl leading-relaxed">Point our AI crawler at any staging or production domain. AuditLens crawls routes, simulates user clicks, and extracts console errors automatically.</p>
            </div>
            <div className="mt-16 pt-10 border-t border-zinc-100 flex items-center justify-between text-zinc-400">
              <span className="text-base font-mono">No scripts required</span><Search className="w-10 h-10" />
            </div>
          </div>
          <div className="border border-zinc-200 rounded-[2.5rem] p-14 hover:border-zinc-300 transition-all bg-white flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-base font-mono text-zinc-400">02</span>
              <h3 className="text-4xl font-medium mt-8 mb-6">AI-Native Regression Logic</h3>
              <p className="text-zinc-500 text-xl leading-relaxed">Multi-agent validation checks visual regressions, broken styles, performance drops, and API schema mismatches before your clients notice.</p>
            </div>
            <div className="mt-16 pt-10 border-t border-zinc-100 flex items-center justify-between text-zinc-400">
              <span className="text-base font-mono">Zero false positives</span><Layers className="w-10 h-10" />
            </div>
          </div>
          <div className="border border-zinc-200 rounded-[2.5rem] p-14 hover:border-zinc-300 transition-all bg-white flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-base font-mono text-zinc-400">03</span>
              <h3 className="text-4xl font-medium mt-8 mb-6">Structured CSV & Webhook Exports</h3>
              <p className="text-zinc-500 text-xl leading-relaxed">Deliver clear findings directly to your engineering team via raw CSV report exports or automated Slack/Discord webhooks upon failed assertions.</p>
            </div>
            <div className="mt-16 pt-10 border-t border-zinc-100 flex items-center justify-between text-zinc-400">
              <span className="text-base font-mono">Real-time alerts</span><Terminal className="w-10 h-10" />
            </div>
          </div>
          <div className="border border-zinc-200 rounded-[2.5rem] p-14 hover:border-zinc-300 transition-all bg-white flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-base font-mono text-zinc-400">04</span>
              <h3 className="text-4xl font-medium mt-8 mb-6">Enterprise-Grade Security</h3>
              <p className="text-zinc-500 text-xl leading-relaxed">Audits are isolated inside sandbox edge workers. We never store cookies, credentials, or private internal endpoints on unencrypted disks.</p>
            </div>
            <div className="mt-16 pt-10 border-t border-zinc-100 flex items-center justify-between text-zinc-400">
              <span className="text-base font-mono">SOC-2 compliant logic</span><ShieldCheck className="w-10 h-10" />
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="py-40 bg-zinc-950 text-white">
        <div className="w-[96%] max-w-[1800px] mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-base font-mono uppercase tracking-widest text-zinc-400">Process</span>
            <h2 className="text-6xl sm:text-7xl font-medium tracking-tight mt-6 mb-12 leading-tight">Three steps.<br />Infinite possibilities.</h2>
            <div className="space-y-12 mt-16">
              <div className="border-l-4 border-white pl-8">
                <h4 className="font-medium text-3xl">I. Connect your targets</h4>
                <p className="text-xl text-zinc-400 mt-3">Specify target staging URLs or trigger audits directly via CI/CD pipelines.</p>
              </div>
              <div className="border-l-4 border-zinc-800 hover:border-zinc-400 pl-8 transition-colors">
                <h4 className="font-medium text-3xl text-zinc-300">II. Autonomous crawling</h4>
                <p className="text-xl text-zinc-500 mt-3">AI agents traverse routes, fill forms, and evaluate client runtime stability.</p>
              </div>
              <div className="border-l-4 border-zinc-800 hover:border-zinc-400 pl-8 transition-colors">
                <h4 className="font-medium text-3xl text-zinc-300">III. Ship with confidence</h4>
                <p className="text-xl text-zinc-500 mt-3">Inspect clean breakdowns, download logs, and merge production pull requests.</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl font-mono text-lg">
            <div className="flex items-center justify-between px-8 py-6 bg-zinc-950/60 border-b border-zinc-800 text-zinc-400">
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/40"></div>
                <div className="w-5 h-5 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40"></div>
                <span className="ml-4 text-zinc-400">audit-runner.ts</span>
              </div>
              <span className="text-emerald-400 text-sm font-bold uppercase tracking-wider">● Ready</span>
            </div>
            <div className="p-10 text-zinc-300 space-y-4 leading-loose">
              <p><span className="text-purple-400">import</span> &#123; createAudit &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">'@auditlens/core'</span>;</p>
              <p className="text-zinc-600 mt-6">// Initiate multi-agent target execution</p>
              <p><span className="text-blue-400">const</span> audit = <span className="text-purple-400">await</span> createAudit(&#123;</p>
              <p className="pl-8">target: <span className="text-emerald-300">'https://staging.app.dev'</span>,</p>
              <p className="pl-8">mode: <span className="text-emerald-300">'autonomous-deep'</span>,</p>
              <p className="pl-8">assertions: [ <span className="text-emerald-300">'no-console-errors'</span>, <span className="text-emerald-300">'strict-layout-shift'</span> ]</p>
              <p>&#125;);</p>
              <p className="mt-6"><span className="text-purple-400">await</span> audit.<span className="text-amber-300">executeAndReport</span>();</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-40 border-b border-zinc-100 mx-auto w-[96%] max-w-[1800px]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-20">
          <div>
            <span className="text-base font-mono uppercase tracking-widest text-zinc-400">Live metrics</span>
            <h2 className="text-6xl font-medium tracking-tight text-zinc-950 mt-5">Performance you can measure.</h2>
          </div>
          <div className="flex items-center gap-3 text-lg font-mono text-emerald-600 mt-8 sm:mt-0 font-medium">
            <span className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse"></span>
            All systems operational
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="border border-zinc-200 p-12 rounded-3xl"><div className="text-5xl font-semibold text-zinc-950">2,847,392</div><div className="text-lg text-zinc-500 font-mono mt-4">Requests audited</div></div>
          <div className="border border-zinc-200 p-12 rounded-3xl"><div className="text-5xl font-semibold text-zinc-950">99.99%</div><div className="text-lg text-zinc-500 font-mono mt-4">Engine SLA</div></div>
          <div className="border border-zinc-200 p-12 rounded-3xl"><div className="text-5xl font-semibold text-zinc-950">&lt; 18ms</div><div className="text-lg text-zinc-500 font-mono mt-4">Scan latency</div></div>
          <div className="border border-zinc-200 p-12 rounded-3xl"><div className="text-5xl font-semibold text-zinc-950">184</div><div className="text-lg text-zinc-500 font-mono mt-4">Locations simulated</div></div>
        </div>
      </section>

      <section id="about" className="py-40 bg-zinc-50/50 border-b border-zinc-100">
        <div className="mx-auto w-[96%] max-w-[1800px] grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-base font-mono uppercase tracking-widest text-zinc-400">About Us</span>
            <h2 className="text-6xl sm:text-7xl font-medium tracking-tight text-zinc-950 mt-6 leading-tight">Built for modern <br/>QA teams.</h2>
          </div>
          <div>
            <p className="text-2xl text-zinc-600 leading-relaxed">
              AuditLens was founded with a single mission: to eliminate the friction between shipping fast and shipping reliably. 
              We believe that quality assurance should be an invisible, autonomous layer that empowers engineering teams rather than slowing them down. 
              By leveraging AI-native agents, we are redefining how the web is tested and validated.
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-40 mx-auto w-[96%] max-w-[1800px]">
        <div className="text-center max-w-4xl mx-auto mb-24">
          <span className="text-base font-mono uppercase tracking-widest text-zinc-400">Pricing</span>
          <h2 className="text-7xl font-medium tracking-tighter text-zinc-950 mt-6 mb-8">Simple, transparent pricing</h2>
          <p className="text-2xl text-zinc-500">Start free and scale as you grow. No hidden fees or surprise invoices.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          <div className="border border-zinc-200 rounded-[2.5rem] p-14 bg-white hover:shadow-xl transition-shadow flex flex-col">
            <span className="text-base font-mono text-zinc-400 uppercase">01 / Starter</span>
            <h3 className="text-4xl font-medium mt-5">Free</h3>
            <p className="text-xl text-zinc-500 mt-3 mb-12">For hobbyists and early projects.</p>
            <div className="text-7xl font-semibold text-zinc-950 mb-12">$0 <span className="text-2xl font-normal text-zinc-400">/mo</span></div>
            <ul className="space-y-6 mb-16 text-xl text-zinc-600 font-normal flex-grow">
              <li className="flex items-center gap-4"><Check className="w-6 h-6 text-zinc-900" /> 1 target URL</li>
              <li className="flex items-center gap-4"><Check className="w-6 h-6 text-zinc-900" /> Basic UI audit checks</li>
              <li className="flex items-center gap-4"><Check className="w-6 h-6 text-zinc-900" /> Community support</li>
            </ul>
            {isSignedIn ? (
              <a href="/dashboard" className="block text-center w-full border-2 border-zinc-200 hover:bg-zinc-50 py-5 rounded-2xl text-xl font-medium transition-colors">
                Go to Dashboard
              </a>
            ) : (
              <SignInButton mode="modal">
                <button className="w-full border-2 border-zinc-200 hover:bg-zinc-50 py-5 rounded-2xl text-xl font-medium transition-colors">
                  Sign in to start free
                </button>
              </SignInButton>
            )}
          </div>

          <div className="border-4 border-zinc-950 rounded-[2.5rem] p-14 bg-white shadow-2xl relative flex flex-col">
            <div className="absolute -top-5 right-10 bg-zinc-950 text-white text-sm font-mono uppercase tracking-widest px-6 py-2 rounded-full">Most Popular</div>
            <span className="text-base font-mono text-zinc-400 uppercase">02 / Pro</span>
            <h3 className="text-4xl font-medium mt-5">AuditLens Pro</h3>
            <p className="text-xl text-zinc-500 mt-3 mb-12">For engineers shipping commercial web apps.</p>
            <div className="text-7xl font-semibold text-zinc-950 mb-12">$5.99 <span className="text-2xl font-normal text-zinc-400">/mo</span></div>
            <ul className="space-y-6 mb-16 text-xl text-zinc-800 font-medium flex-grow">
              <li className="flex items-center gap-4"><Check className="w-7 h-7 text-zinc-950" /> 3 test executions per day</li>
              <li className="flex items-center gap-4"><Check className="w-7 h-7 text-zinc-950" /> Deep autonomous AI crawling</li>
              <li className="flex items-center gap-4"><Check className="w-7 h-7 text-zinc-950" /> Structured CSV report exports</li>
              <li className="flex items-center gap-4"><Check className="w-7 h-7 text-zinc-950" /> Priority execution queue</li>
            </ul>
            <button onClick={() => handleCheckout(PRO_CHECKOUT_URL)} className="w-full bg-zinc-950 hover:bg-zinc-800 text-white py-5 rounded-2xl text-xl font-medium transition-all shadow-md active:scale-95 flex items-center justify-center gap-3">
              Start Pro trial <ArrowRight className="w-6 h-6" />
            </button>
          </div>

          <div className="border border-zinc-200 rounded-[2.5rem] p-14 bg-white hover:shadow-xl transition-shadow flex flex-col">
            <span className="text-base font-mono text-zinc-400 uppercase">03 / Pro Plus</span>
            <h3 className="text-4xl font-medium mt-5">AuditLens Pro Plus</h3>
            <p className="text-xl text-zinc-500 mt-3 mb-12">For engineering teams needing maximum throughput.</p>
            <div className="text-7xl font-semibold text-zinc-950 mb-12">$8.99 <span className="text-2xl font-normal text-zinc-400">/mo</span></div>
            <ul className="space-y-6 mb-16 text-xl text-zinc-600 font-normal flex-grow">
              <li className="flex items-center gap-4 font-medium"><Check className="w-6 h-6 text-zinc-900" /> 5 test executions per day</li>
              <li className="flex items-center gap-4"><Check className="w-6 h-6 text-zinc-900" /> Multi-agent cross-referencing</li>
              <li className="flex items-center gap-4"><Check className="w-6 h-6 text-zinc-900" /> Full REST & CLI API access</li>
              <li className="flex items-center gap-4"><Check className="w-6 h-6 text-zinc-900" /> Dedicated priority SLA support</li>
            </ul>
            <button onClick={() => handleCheckout(PRO_PLUS_CHECKOUT_URL)} className="w-full border-2 border-zinc-200 hover:border-zinc-900 py-5 rounded-2xl text-xl font-medium transition-colors flex items-center justify-center gap-3">
              Start Pro Plus trial <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      <section id="contact" className="py-40 bg-zinc-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-8">
          <span className="text-base font-mono uppercase tracking-widest text-zinc-400">Contact Us</span>
          <h2 className="text-6xl sm:text-7xl font-medium tracking-tight mt-6 mb-10 leading-tight">Let's build something great.</h2>
          <p className="text-2xl text-zinc-400 mb-16 leading-relaxed">
            Have questions about enterprise plans, custom integrations, or just want to say hi? Our inbox is always open.
          </p>
          <a href="mailto:software.index.si@gmail.com" className="inline-flex items-center justify-center gap-4 bg-white text-zinc-950 px-12 py-6 rounded-2xl text-2xl font-medium hover:bg-zinc-200 transition-colors shadow-xl">
            <Mail className="w-7 h-7" />
            software.index.si@gmail.com
          </a>
        </div>
      </section>

      <footer className="bg-zinc-50 pt-32 pb-16 border-t border-zinc-200 mt-auto">
        <div className="w-[96%] max-w-[1800px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
            <div className="col-span-2 lg:col-span-2">
              <a href="#" className="font-bold text-4xl tracking-tighter flex items-center gap-1 mb-6 text-zinc-950">
                AuditLens<span className="text-lg text-zinc-400 font-mono align-top ml-1">™</span>
              </a>
              <p className="text-xl text-zinc-500 max-w-sm leading-relaxed">
                The AI platform to audit and ship. Built for modern QA teams to verify production reliability.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-950 mb-8 text-xl">Product</h4>
              <ul className="space-y-5 text-zinc-500 text-lg">
                <li><a href="#features" className="hover:text-zinc-950 transition-colors">Features</a></li>
                <li><a href="#workflow" className="hover:text-zinc-950 transition-colors">How it works</a></li>
                <li><a href="#pricing" className="hover:text-zinc-950 transition-colors">Pricing</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('changelog'); }} className="hover:text-zinc-950 transition-colors cursor-pointer">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-950 mb-8 text-xl">Company</h4>
              <ul className="space-y-5 text-zinc-500 text-lg">
                <li><a href="#about" className="hover:text-zinc-950 transition-colors">About Us</a></li>
                <li><a href="#contact" className="hover:text-zinc-950 transition-colors">Contact Us</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('careers'); }} className="hover:text-zinc-950 transition-colors cursor-pointer">Careers</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('blog'); }} className="hover:text-zinc-950 transition-colors cursor-pointer">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-950 mb-8 text-xl">Legal</h4>
              <ul className="space-y-5 text-zinc-500 text-lg">
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('privacy'); }} className="hover:text-zinc-950 transition-colors cursor-pointer">Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('terms'); }} className="hover:text-zinc-950 transition-colors cursor-pointer">Terms of Service</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('cookies'); }} className="hover:text-zinc-950 transition-colors cursor-pointer">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-500 text-lg">
            <p>© {new Date().getFullYear()} Software Index. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="https://www.facebook.com/share/19fnp6Y7fB/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-950 transition-colors">Facebook</a>
              <a href="https://www.instagram.com/software.index.si?stkn=MXB6bGc1ZGh5MWM2cQ==" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-950 transition-colors">Instagram</a>
              <a href="https://youtube.com/@software-index-si?si=X759tAA3Ecsw6AGj" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-950 transition-colors">YouTube</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// 3. MAIN ROUTER
// ==========================================
export default function App() {
  const path = window.location.pathname;

  // Simple native routing logic
  if (path === '/dashboard') {
    return <Dashboard />;
  }

  return <LandingPage />;
}