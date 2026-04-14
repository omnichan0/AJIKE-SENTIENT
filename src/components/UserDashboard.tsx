import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Zap, CreditCard, Info, CheckCircle2, Star, Crown, ArrowRight, Activity, RefreshCw, Shield, Code, Globe, MessageSquare, FileText, PenTool, Calculator, Ruler, Book, Mail, Layout, Search, List, Cloud, Coffee, GraduationCap, Smile, Quote, BookOpen, HelpCircle, Cpu, Lock, Terminal, ShieldAlert, Database, Mic2, RefreshCcw, Smartphone, Binary, Share2, ZapOff, Infinity, Wallet, Radio, Heart, ChevronLeft, ChevronRight, Plus, Film, Wand2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { auth, db } from '@/src/lib/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { TIER_SKILLS, TIERS } from '@/src/constants';
import { AjikeChat } from './AjikeChat';
import { CinematicLab } from './CinematicLab';
import { AnimeStudio } from './AnimeStudio';
import { ToolLibrary } from './ToolLibrary';
import { SecureSearch } from './SecureSearch';
import { AjikeOps } from './AjikeOps';

export function UserDashboard() {
  const userEmail = auth.currentUser?.email || "";
  const isAdmin = userEmail === "lovethayo2017@gmail.com";
  const [currentTier, setCurrentTier] = useState<string>('JJC');
  const [stats, setStats] = useState({ tokens: 0, tier: 'JJC' });
  const [trxId, setTrxId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<any>(null);
  const [tierPrices, setTierPrices] = useState<Record<string, string>>({});
  const [tronWallet, setTronWallet] = useState('T-AJIKE-SOVEREIGN-WALLET-ADDRESS');
  const [selectedTierPreview, setSelectedTierPreview] = useState<string>('JJC');
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Omni-Lab',
    founder: 'ALADEJANA LOVETH AYOMIDE',
    goals: 'To build sovereign, decentralized intelligence.',
    phone: '',
    comingSoon: 'Petals Swarm v2, Neural Voice Generation'
  });

  const [toolRequest, setToolRequest] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const [tierSkills, setTierSkills] = useState<any>(TIER_SKILLS);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const configDoc = await getDoc(doc(db, 'kernel_config', 'global'));
        if (configDoc.exists()) {
          const data = configDoc.data();
          if (data.tierPrices) setTierPrices(data.tierPrices);
          if (data.tronWallet) setTronWallet(data.tronWallet);
          if (data.companyInfo) setCompanyInfo(data.companyInfo);
          if (data.tierSkills) setTierSkills(data.tierSkills);
        }
      } catch (error) {
        console.error("Error loading kernel config:", error);
      }
    };
    loadConfig();
  }, []);

  const handleVerifyTrx = async (tierId: string) => {
    if (!trxId.trim()) return;
    setIsVerifying(true);
    try {
      const response = await fetch('/api/payments/tron/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trxId, email: userEmail, tier: tierId })
      });
      const data = await response.json();
      setPaymentStatus(data);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRequestTool = async () => {
    if (!toolRequest.trim()) return;
    setIsRequesting(true);
    try {
      await addDoc(collection(db, 'tool_requests'), {
        userEmail,
        request: toolRequest,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setRequestSuccess(true);
      setToolRequest('');
      setTimeout(() => setRequestSuccess(false), 3000);
    } catch (error) {
      console.error("Error requesting tool:", error);
    } finally {
      setIsRequesting(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (paymentStatus?.trxId) {
      interval = setInterval(async () => {
        const res = await fetch(`/api/payments/tron/status/${paymentStatus.trxId}`);
        const data = await res.json();
        setPaymentStatus(data);
        if (data.status === 'confirmed') {
          clearInterval(interval);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [paymentStatus?.trxId]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!userEmail) return;
      try {
        const response = await fetch(`/api/inference/stats/${userEmail}`);
        const data = await response.json();
        setStats(data);
        if (data.tier) setCurrentTier(data.tier);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [userEmail]);

  const TABS = [
    { id: 'overview', label: 'Overview & Tiers', icon: Activity },
    { id: 'chat', label: 'AJIKE Chat', icon: MessageSquare },
    { id: 'ops', label: 'Active Operations', icon: ShieldAlert },
    { id: 'cinematic', label: 'Cinematic Lab', icon: Film },
    { id: 'anime', label: 'Anime Studio', icon: Wand2 },
    { id: 'tools', label: 'The Vault', icon: Shield },
    { id: 'search', label: 'Secure Net', icon: Globe },
    { id: 'request', label: 'Request Tool', icon: Plus },
    { id: 'about', label: 'About & Info', icon: Info },
  ];

  return (
    <div className="h-full flex overflow-hidden">
      {/* Sidebar Menu */}
      <motion.div 
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 256 }}
        className="bg-black/40 border-r border-white/10 flex flex-col relative"
      >
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-4 top-6 z-10 w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white border-2 border-black"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>

        <div className={`p-6 flex items-center gap-3 border-b border-white/10 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
          <User className="w-8 h-8 text-indigo-500 shrink-0" />
          {!isSidebarCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-lg font-bold text-glow whitespace-nowrap">User Command</h2>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] whitespace-nowrap">Dashboard</p>
            </motion.div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${isSidebarCollapsed ? 'justify-center' : ''} ${
                activeTab === tab.id 
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
              title={isSidebarCollapsed ? tab.label : undefined}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span className="whitespace-nowrap">{tab.label}</span>}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-8 pb-4 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-medium text-glow capitalize">{activeTab.replace('-', ' ')}</h2>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-white/40">Current Status:</span>
            <Badge className="bg-orange-500">
              {isAdmin ? 'OBA (OWNER)' : currentTier}
            </Badge>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8">
          {activeTab === 'overview' && (
            <div className="space-y-8 w-full">
            {isAdmin && (
              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center gap-4">
                <Crown className="w-8 h-8 text-orange-500" />
                <div>
                  <h3 className="text-sm font-bold text-orange-400">Owner Privileges Active</h3>
                  <p className="text-[10px] text-white/60">You have unlimited access to all tiers and sovereign logic. No payment required.</p>
                </div>
              </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <Activity className="w-3 h-3 text-orange-400" /> Swarm Inference
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-mono">{stats.tokens.toLocaleString()}</div>
                  <p className="text-[10px] text-white/20">Tokens processed</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <Zap className="w-3 h-3 text-indigo-400" /> Priority Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-mono">{isAdmin || currentTier === 'OBA' ? 'MAX' : 'NORMAL'}</div>
                  <p className="text-[10px] text-white/20">Inference Queue</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <Crown className="w-3 h-3 text-yellow-400" /> Sovereign Access
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-mono">{isAdmin || currentTier === 'OBA' ? 'ENABLED' : 'LOCKED'}</div>
                  <p className="text-[10px] text-white/20">Unfiltered Logic</p>
                </CardContent>
              </Card>
            </div>

            <Separator className="bg-white/10" />

            {/* Tier Selection */}
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 font-mono">Select Your Tier</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {TIERS.map((tier) => {
                  if (tier.id === 'OBA' && !isAdmin) return null;
                  return (
                    <Card 
                      key={tier.id} 
                      className={`bg-white/5 border-white/10 transition-all cursor-pointer hover:bg-white/10 ${selectedTierPreview === tier.id ? 'ring-2 ring-indigo-500' : ''} ${currentTier === tier.id ? 'ring-2 ring-orange-500' : ''}`}
                      onClick={() => setSelectedTierPreview(tier.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <Badge variant="outline" className={`text-${tier.color.split('-')[1]}-400 border-${tier.color.split('-')[1]}-500/30`}>
                            {tier.id === 'JJC' || tier.id === 'OBA' ? tier.price : (tierPrices[tier.id] || tier.price)}
                          </Badge>
                          {tier.id === 'OBA' && <Crown className="w-4 h-4 text-yellow-500" />}
                        </div>
                        <CardTitle className="text-lg mt-2">{tier.name}</CardTitle>
                        <CardDescription className="text-[10px]">{tier.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-xs font-mono text-white/40">{tier.tokens} Tokens</div>
                        {!isAdmin && currentTier !== tier.id && tier.id !== 'JJC' && tier.id !== 'OBA' && (
                          <Button 
                            className="w-full h-8 text-[10px] uppercase tracking-widest bg-white/10 hover:bg-white/20"
                            onClick={(e) => { e.stopPropagation(); setTrxId(''); }}
                          >
                            Upgrade
                          </Button>
                        )}
                        {(isAdmin || currentTier === tier.id) && (
                          <Badge className="w-full justify-center bg-green-500/20 text-green-500 border-green-500/30">Active</Badge>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Tier Arsenal Preview */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 font-mono">
                  {TIERS.find(t => t.id === selectedTierPreview)?.name} Specialized Arsenal
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {(tierSkills[selectedTierPreview as keyof typeof tierSkills] || tierSkills.JJC || []).map((skill: any, i: number) => (
                  <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedTierPreview === currentTier ? 'bg-orange-500' : 'bg-indigo-500'}`} />
                      <span className="text-xs font-medium text-white/90">{skill.name}</span>
                    </div>
                    <p className="text-[10px] text-white/50 leading-relaxed">{skill.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {!isAdmin && selectedTierPreview !== currentTier && selectedTierPreview !== 'JJC' && selectedTierPreview !== 'OBA' && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-red-500" /> TRON Payment Gateway
                  </CardTitle>
                  <CardDescription className="text-[10px]">Upgrade your tier via TRX payment. 30 confirmations required.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Send TRX to:</div>
                    <div className="text-xs font-mono text-orange-400 break-all">{tronWallet}</div>
                    <p className="text-[10px] text-white/40 mt-2">
                      Amount: <strong className="text-white">{tierPrices[selectedTierPreview] || TIERS.find(t => t.id === selectedTierPreview)?.price}</strong>
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="Paste Transaction ID (trxid)..."
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-red-500/50"
                    />
                    <Button 
                      onClick={() => handleVerifyTrx(selectedTierPreview)}
                      disabled={isVerifying || paymentStatus?.status === 'pending' || !trxId}
                      className="bg-red-600 hover:bg-red-500 text-white text-xs px-8"
                    >
                      {isVerifying ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Verify TRX'}
                    </Button>
                  </div>

                  {paymentStatus && (
                    <div className={`p-3 rounded-xl border text-xs ${paymentStatus.status === 'confirmed' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'}`}>
                      <div className="flex items-center justify-between">
                        <span>Status: {paymentStatus.status?.toUpperCase()}</span>
                        {paymentStatus.status === 'pending' && (
                          <span>Confirmations: {paymentStatus.confirmations}/30</span>
                        )}
                      </div>
                      {paymentStatus.status === 'pending' && (
                        <Progress value={(paymentStatus.confirmations / 30) * 100} className="h-1 mt-2 bg-white/5" />
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="h-full">
            <AjikeChat />
          </div>
        )}

        {activeTab === 'ops' && (
          <div className="h-full">
            <AjikeOps />
          </div>
        )}

        {activeTab === 'cinematic' && (
          <div className="h-full">
            <CinematicLab />
          </div>
        )}

        {activeTab === 'anime' && (
          <div className="h-full">
            <AnimeStudio />
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="h-full">
            <ToolLibrary />
          </div>
        )}

        {activeTab === 'search' && (
          <div className="h-full">
            <SecureSearch />
          </div>
        )}

        {activeTab === 'request' && (
          <div className="w-full space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4 text-green-400" /> Request a New Tool
                </CardTitle>
                <CardDescription className="text-[10px]">Need a specific capability? Request it here and the Omni-Lab team will review it for forging.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  placeholder="Describe the tool or skill you need AJIKE to have..."
                  value={toolRequest}
                  onChange={(e) => setToolRequest(e.target.value)}
                  className="min-h-[120px] bg-black/40 border-white/10 text-xs text-white focus:border-green-500/50"
                />
                <Button 
                  onClick={handleRequestTool}
                  disabled={isRequesting || !toolRequest.trim()}
                  className="w-full bg-green-600 hover:bg-green-500 text-white text-xs"
                >
                  {isRequesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Submit Request'}
                </Button>
                {requestSuccess && (
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-xs text-green-400 text-center">
                    Request submitted successfully! The Sultan will review it.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="w-full space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" /> About {companyInfo.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Founder</div>
                    <div className="text-sm text-white">{companyInfo.founder}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Contact</div>
                    <div className="text-sm text-white">{companyInfo.phone || 'Not provided'}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Our Goals</div>
                    <div className="text-sm text-white/80 leading-relaxed">{companyInfo.goals}</div>
                  </div>
                </div>
                
                <Separator className="bg-white/10" />
                
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Activity className="w-3 h-3 text-orange-400" /> Coming Soon
                  </div>
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-sm text-orange-200">
                    {companyInfo.comingSoon}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
