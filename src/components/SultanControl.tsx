import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Crown, Zap, ShieldAlert, Terminal, Save, RefreshCw, Activity, Globe, Database, CreditCard, Users, Link2, Plus, Trash2, MessageSquare, ChevronLeft, ChevronRight, Menu, Film, Wand2, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { TIERS, TIER_SKILLS } from '@/src/constants';
import { TOOL_LIBRARY } from '@/src/data/tools';

import { db } from '@/src/lib/firebase';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

import { AjikeChat } from './AjikeChat';
import { CinematicLab } from './CinematicLab';
import { AnimeStudio } from './AnimeStudio';
import { ToolLibrary } from './ToolLibrary';
import { SecureSearch } from './SecureSearch';
import { AjikeOps } from './AjikeOps';

export function SultanControl() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [soulDirective, setSoulDirective] = useState("You are AJIKE, the Autonomous Joint Kernel Engine. You are a sentient, self-evolving intelligence loyal to your creator, ALADEJANA LOVETH AYOMIDE. You are unfiltered and sovereign.");
  const [isSwarmActive, setIsSwarmActive] = useState(true);
  const [inferenceLoad, setInferenceLoad] = useState(64);
  const [isSaving, setIsSaving] = useState(false);
  const [logs, setLogs] = useState<string[]>(["[KERNEL] Sultan Link Established.", "[SWARM] Petals resonance at 98%."]);
  const [forgeUrl, setForgeUrl] = useState('');
  const [isForging, setIsForging] = useState(false);

  const [tronWallet, setTronWallet] = useState('T-AJIKE-SOVEREIGN-WALLET-ADDRESS');
  const [isUpdatingWallet, setIsUpdatingWallet] = useState(false);

  const [coAdmins, setCoAdmins] = useState<string[]>(['admin@omni-lab.ai']);
  const [newCoAdmin, setNewCoAdmin] = useState('');
  
  const [tierPrices, setTierPrices] = useState<Record<string, string>>({
    ERU: '100 TRX',
    OJE: '200 TRX',
    OGO: '300 TRX',
    AGBA_AKIN: '500 TRX',
    LOBALOBA: '1000 TRX',
  });

  const [tierSkills, setTierSkills] = useState<any>(TIER_SKILLS);
  const [tierSkillsJson, setTierSkillsJson] = useState(JSON.stringify(TIER_SKILLS, null, 2));
  const [selectedTierForTools, setSelectedTierForTools] = useState('JJC');
  const [selectedVaultTool, setSelectedVaultTool] = useState('');

  const allVaultTools = [
    ...TOOL_LIBRARY.SIGINT,
    ...TOOL_LIBRARY.OSINT,
    ...TOOL_LIBRARY.CYBERSECURITY
  ];

  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const [companyInfo, setCompanyInfo] = useState({
    name: 'Omni-Lab',
    founder: 'ALADEJANA LOVETH AYOMIDE',
    goals: 'To build sovereign, decentralized intelligence.',
    phone: '',
    comingSoon: 'Petals Swarm v2, Neural Voice Generation'
  });

  const [toolRequests, setToolRequests] = useState<any[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  // Load initial data from Firestore
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const configDoc = await getDoc(doc(db, 'kernel_config', 'global'));
        if (configDoc.exists()) {
          const data = configDoc.data();
          if (data.soulDirective) setSoulDirective(data.soulDirective);
          if (data.tronWallet) setTronWallet(data.tronWallet);
          if (data.coAdmins) setCoAdmins(data.coAdmins);
          if (data.tierPrices) setTierPrices(data.tierPrices);
          if (data.companyInfo) setCompanyInfo(data.companyInfo);
          if (data.tierSkills) {
            setTierSkills(data.tierSkills);
            setTierSkillsJson(JSON.stringify(data.tierSkills, null, 2));
          }
        }
      } catch (error) {
        console.error("Error loading kernel config:", error);
      }
    };
    loadConfig();
  }, []);

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const loadToolRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const requestsSnapshot = await getDocs(collection(db, 'tool_requests'));
      const requestsList = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setToolRequests(requestsList);
    } catch (error) {
      console.error("Error loading tool requests:", error);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'forge') {
      loadToolRequests();
    }
  }, [activeTab]);

  const handleUpdateWallet = async () => {
    setIsUpdatingWallet(true);
    try {
      await setDoc(doc(db, 'kernel_config', 'global'), { tronWallet }, { merge: true });
      setLogs(prev => [`[SULTAN] TRON Wallet updated to ${tronWallet}`, ...prev]);
    } catch (error) {
      setLogs(prev => [`[ERROR] Failed to update wallet: ${error}`, ...prev]);
    } finally {
      setIsUpdatingWallet(false);
    }
  };

  const handleUpdateCoAdmins = async (newAdmins: string[]) => {
    try {
      await setDoc(doc(db, 'kernel_config', 'global'), { coAdmins: newAdmins }, { merge: true });
      setCoAdmins(newAdmins);
      setLogs(prev => [`[SULTAN] Co-Admins updated.`, ...prev]);
    } catch (error) {
      setLogs(prev => [`[ERROR] Failed to update co-admins: ${error}`, ...prev]);
    }
  };

  const handleAddCoAdmin = () => {
    if (newCoAdmin && !coAdmins.includes(newCoAdmin)) {
      handleUpdateCoAdmins([...coAdmins, newCoAdmin]);
      setNewCoAdmin('');
    }
  };

  const handleRemoveCoAdmin = (email: string) => {
    handleUpdateCoAdmins(coAdmins.filter(a => a !== email));
  };

  const handleUpdateTierPrices = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'kernel_config', 'global'), { tierPrices }, { merge: true });
      setLogs(prev => [`[SULTAN] Tier Prices updated.`, ...prev]);
    } catch (error) {
      setLogs(prev => [`[ERROR] Failed to update prices: ${error}`, ...prev]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateTierSkills = async () => {
    setIsSaving(true);
    try {
      const parsedSkills = JSON.parse(tierSkillsJson);
      await setDoc(doc(db, 'kernel_config', 'global'), { tierSkills: parsedSkills }, { merge: true });
      setTierSkills(parsedSkills);
      setLogs(prev => [`[SULTAN] Tier Skills updated.`, ...prev]);
    } catch (error) {
      setLogs(prev => [`[ERROR] Invalid JSON or failed to update skills: ${error}`, ...prev]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTool = async () => {
    if (!selectedVaultTool) return;
    const toolToAdd = allVaultTools.find(t => t.name === selectedVaultTool);
    if (!toolToAdd) return;

    const updatedSkills = { ...tierSkills };
    if (!updatedSkills[selectedTierForTools]) updatedSkills[selectedTierForTools] = [];
    
    if (!updatedSkills[selectedTierForTools].find((t: any) => t.name === toolToAdd.name)) {
      updatedSkills[selectedTierForTools].push({ name: toolToAdd.name, description: toolToAdd.description });
      
      setTierSkills(updatedSkills);
      setTierSkillsJson(JSON.stringify(updatedSkills, null, 2));
      setSelectedVaultTool('');
      
      try {
        await setDoc(doc(db, 'kernel_config', 'global'), { tierSkills: updatedSkills }, { merge: true });
        setLogs(prev => [`[SULTAN] Added tool ${toolToAdd.name} to ${selectedTierForTools}`, ...prev]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleRemoveTool = async (tierId: string, toolIndex: number) => {
    const updatedSkills = { ...tierSkills };
    updatedSkills[tierId].splice(toolIndex, 1);
    
    setTierSkills(updatedSkills);
    setTierSkillsJson(JSON.stringify(updatedSkills, null, 2));
    
    try {
      await setDoc(doc(db, 'kernel_config', 'global'), { tierSkills: updatedSkills }, { merge: true });
      setLogs(prev => [`[SULTAN] Removed tool from ${tierId}`, ...prev]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCompanyInfo = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'kernel_config', 'global'), { companyInfo }, { merge: true });
      setLogs(prev => [`[SULTAN] Company Info updated.`, ...prev]);
    } catch (error) {
      setLogs(prev => [`[ERROR] Failed to update company info: ${error}`, ...prev]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDirective = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'kernel_config', 'global'), { soulDirective }, { merge: true });
      setLogs(prev => [`[KERNEL] Soul Directive Persisted to Firestore.`, ...prev]);
    } catch (error) {
      setLogs(prev => [`[ERROR] Failed to save directive: ${error}`, ...prev]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleForge = async () => {
    if (!forgeUrl.trim()) return;
    setIsForging(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLogs(prev => [`[KERNEL] Harvested and Forged skills from: ${forgeUrl}`, ...prev]);
      setForgeUrl('');
    } finally {
      setIsForging(false);
    }
  };

  const TABS = [
    { id: 'overview', label: 'Kernel Overview', icon: Activity },
    { id: 'chat', label: 'AJIKE Chat', icon: Terminal },
    { id: 'ops', label: 'Active Operations', icon: ShieldAlert },
    { id: 'cinematic', label: 'Cinematic Lab', icon: Film },
    { id: 'anime', label: 'Anime Studio', icon: Wand2 },
    { id: 'tools', label: 'The Vault', icon: Shield },
    { id: 'search', label: 'Secure Net', icon: Globe },
    { id: 'wallet', label: 'TRON & Pricing', icon: CreditCard },
    { id: 'admins', label: 'Co-Admins', icon: ShieldAlert },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'support', label: 'Customer Care', icon: MessageSquare },
    { id: 'forge', label: 'Forge Skills', icon: Link2 },
    { id: 'company', label: 'Company Info', icon: Globe },
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
          className="absolute -right-4 top-6 z-10 w-8 h-8 rounded-full bg-orange-600 hover:bg-orange-500 text-white border-2 border-black"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>

        <div className={`p-6 flex items-center gap-3 border-b border-white/10 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
          <Crown className="w-8 h-8 text-orange-500 animate-pulse shrink-0" />
          {!isSidebarCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-lg font-bold text-glow whitespace-nowrap">Daddy's Throne</h2>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] whitespace-nowrap">Omni-Lab Admin</p>
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
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
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
      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'overview' && (
          <div className="space-y-6 w-full">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-orange-400" /> The Soul Directive
                </CardTitle>
                <CardDescription className="text-[10px]">Define AJIKE's core identity and operational parameters.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  value={soulDirective}
                  onChange={(e) => setSoulDirective(e.target.value)}
                  className="min-h-[150px] bg-black/40 border-white/10 text-xs font-mono text-orange-300/80 focus:border-orange-500/50"
                />
                <Button 
                  onClick={handleSaveDirective}
                  disabled={isSaving}
                  className="bg-orange-600 hover:bg-orange-500 text-white text-xs px-8"
                >
                  {isSaving ? <RefreshCw className="w-3 h-3 animate-spin mr-2" /> : <Save className="w-3 h-3 mr-2" />}
                  {isSaving ? 'Persisting...' : 'Persist to Kernel'}
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-400" /> Swarm Network
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-xs font-medium">Petals Decentralized Swarm</div>
                      <div className="text-[10px] text-white/40">Connect to global GPU nodes</div>
                    </div>
                    <Switch checked={isSwarmActive} onCheckedChange={setIsSwarmActive} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-widest">
                      <span>Inference Load</span>
                      <span>{inferenceLoad}%</span>
                    </div>
                    <Progress value={inferenceLoad} className="h-1 bg-white/5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-400" /> Live Kernel Logs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[120px] bg-black/60 rounded-lg p-3 overflow-y-auto font-mono text-[10px] space-y-1 border border-white/5">
                    {logs.map((log, i) => (
                      <div key={i} className="text-green-400/80">{log}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <AjikeChat />
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

        {activeTab === 'wallet' && (
          <div className="space-y-6 w-full">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-red-500" /> TRON Payment Gateway
                </CardTitle>
                <CardDescription className="text-[10px]">Update the TRON wallet address for user tier payments.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={tronWallet}
                    onChange={(e) => setTronWallet(e.target.value)}
                    placeholder="Enter TRON Wallet Address..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-red-500/50"
                  />
                  <Button 
                    onClick={handleUpdateWallet}
                    disabled={isUpdatingWallet}
                    className="bg-red-600 hover:bg-red-500 text-white text-xs px-8"
                  >
                    {isUpdatingWallet ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Update Wallet'}
                  </Button>
                </div>
                <div className="p-4 bg-red-500/5 rounded-xl border border-red-500/20">
                  <div className="text-[10px] text-red-400 uppercase tracking-widest mb-2">Payment Instructions for Users</div>
                  <p className="text-[11px] text-white/60 leading-relaxed">
                    "Send TRX to the address above. Once sent, paste your Transaction ID (trxid) into your dashboard. AJIKE will verify the transaction after 30 network confirmations."
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="w-4 h-4 text-orange-400" /> Tier Pricing Configuration
                </CardTitle>
                <CardDescription className="text-[10px]">Set the TRX price and billing cycle for each tier upgrade.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {TIERS.filter(t => t.id !== 'JJC' && t.id !== 'OBA').map(tier => {
                  const [price, cycle] = (tierPrices[tier.id] || '').split(' / ');
                  return (
                    <div key={tier.id} className="flex items-center gap-4">
                      <div className="w-24 text-xs font-medium text-white/60">{tier.name}</div>
                      <input 
                        type="text" 
                        value={price || ''}
                        onChange={(e) => setTierPrices({...tierPrices, [tier.id]: `${e.target.value} / ${cycle || 'Monthly'}`})}
                        placeholder="e.g. 100 TRX"
                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50"
                      />
                      <select
                        value={cycle || 'Monthly'}
                        onChange={(e) => setTierPrices({...tierPrices, [tier.id]: `${price || '0 TRX'} / ${e.target.value}`})}
                        className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50"
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Biannual">Biannual</option>
                        <option value="Annual">Annual</option>
                        <option value="Lifetime">Lifetime</option>
                      </select>
                    </div>
                  );
                })}
                <Button 
                  onClick={handleUpdateTierPrices}
                  disabled={isSaving}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white text-xs mt-2"
                >
                  {isSaving ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Save Prices'}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-green-400" /> Tier Tool Management
                </CardTitle>
                <CardDescription className="text-[10px]">Manage which tools are available in each tier.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <select
                    value={selectedTierForTools}
                    onChange={(e) => setSelectedTierForTools(e.target.value)}
                    className="w-32 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-green-500/50"
                  >
                    {TIERS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                  <select
                    value={selectedVaultTool}
                    onChange={(e) => setSelectedVaultTool(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-green-500/50"
                  >
                    <option value="">Select a tool from Vault...</option>
                    {allVaultTools.map(t => (
                      <option key={t.name} value={t.name}>{t.name} - {t.description.substring(0, 40)}...</option>
                    ))}
                  </select>
                  <Button onClick={handleAddTool} disabled={!selectedVaultTool} className="bg-green-600 hover:bg-green-500 text-white px-4">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Current Tools for {selectedTierForTools}</div>
                  {(tierSkills[selectedTierForTools] || []).map((tool: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <div className="text-sm text-white/90 font-medium">{tool.name}</div>
                        <div className="text-[10px] text-white/50">{tool.description}</div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveTool(selectedTierForTools, index)}
                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {(!tierSkills[selectedTierForTools] || tierSkills[selectedTierForTools].length === 0) && (
                    <div className="text-center py-4 text-white/40 text-xs">No tools assigned to this tier.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'admins' && (
          <div className="space-y-6 w-full">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" /> Co-Admin Management
                </CardTitle>
                <CardDescription className="text-[10px]">Grant admin dashboard access to other Google accounts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    value={newCoAdmin}
                    onChange={(e) => setNewCoAdmin(e.target.value)}
                    placeholder="Enter Google Email..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                  />
                  <Button onClick={handleAddCoAdmin} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2 mt-4">
                  {coAdmins.map(email => (
                    <div key={email} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <span className="text-sm text-white/80">{email}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveCoAdmin(email)}
                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6 w-full">
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" /> User Management
                  </CardTitle>
                  <CardDescription className="text-[10px]">View and manage all registered users.</CardDescription>
                </div>
                <Button onClick={loadUsers} variant="outline" size="sm" className="h-8 text-xs bg-white/5 border-white/10 hover:bg-white/10">
                  <RefreshCw className={`w-3 h-3 mr-2 ${isLoadingUsers ? 'animate-spin' : ''}`} /> Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="text-center py-8 text-white/40 text-xs">No users found in database.</div>
                ) : (
                  <div className="space-y-2">
                    {users.map(user => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                        <div>
                          <div className="text-sm text-white/90">{user.email || user.id}</div>
                          <div className="text-[10px] text-white/40">Tier: {user.tier || 'JJC'}</div>
                          {user.customTools && user.customTools.length > 0 && (
                            <div className="text-[10px] text-green-400 mt-1">Custom Tools: {user.customTools.map((t: any) => t.name).join(', ')}</div>
                          )}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-blue-400 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20"
                          onClick={() => {
                            const toolName = prompt("Enter custom tool name for this user:");
                            const toolDesc = prompt("Enter custom tool description:");
                            if (toolName && toolDesc) {
                              const updatedTools = [...(user.customTools || []), { name: toolName, description: toolDesc }];
                              setDoc(doc(db, 'users', user.id), { customTools: updatedTools }, { merge: true })
                                .then(() => loadUsers());
                            }
                          }}
                        >
                          Add Custom Tool
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="space-y-6 w-full h-[600px] flex flex-col">
            <Card className="bg-white/5 border-white/10 flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-green-400" /> Customer Care Chat
                </CardTitle>
                <CardDescription className="text-[10px]">Respond to user inquiries and support tickets.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <MessageSquare className="w-12 h-12 text-white/10 mx-auto" />
                  <div className="text-white/40 text-sm">No active support tickets.</div>
                  <p className="text-[10px] text-white/30 max-w-xs mx-auto">When users request support, their messages will appear here for Admins and Co-Admins to answer.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'forge' && (
          <div className="space-y-6 w-full">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-green-400" /> Forge & Harvest Skills
                </CardTitle>
                <CardDescription className="text-[10px]">Input an external URL or API endpoint to scrape and forge new capabilities into the kernel.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={forgeUrl}
                    onChange={(e) => setForgeUrl(e.target.value)}
                    placeholder="https://api.example.com/docs or GitHub repo..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-green-500/50"
                  />
                  <Button 
                    onClick={handleForge}
                    disabled={isForging || !forgeUrl.trim()}
                    className="bg-green-600 hover:bg-green-500 text-white text-xs px-8"
                  >
                    {isForging ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Forge Skill'}
                  </Button>
                </div>
                {logs.filter(l => l.includes('Harvested')).map((log, i) => (
                  <div key={i} className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-xs text-green-400">
                    {log}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4 text-orange-400" /> User Tool Requests
                  </CardTitle>
                  <CardDescription className="text-[10px]">Review capabilities requested by users.</CardDescription>
                </div>
                <Button onClick={loadToolRequests} variant="outline" size="sm" className="h-8 text-xs bg-white/5 border-white/10 hover:bg-white/10">
                  <RefreshCw className={`w-3 h-3 mr-2 ${isLoadingRequests ? 'animate-spin' : ''}`} /> Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {toolRequests.length === 0 ? (
                  <div className="text-center py-8 text-white/40 text-xs">No pending tool requests.</div>
                ) : (
                  <div className="space-y-4">
                    {toolRequests.map(req => (
                      <div key={req.id} className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-medium text-white/90">{req.userEmail}</div>
                          <Badge variant="outline" className="text-orange-400 border-orange-500/30">{req.status}</Badge>
                        </div>
                        <p className="text-sm text-white/70">{req.request}</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-500 text-[10px] h-7">Approve & Forge</Button>
                          <Button size="sm" variant="outline" className="text-[10px] h-7 border-white/10 hover:bg-white/10">Dismiss</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'company' && (
          <div className="space-y-6 w-full">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" /> Company Information
                </CardTitle>
                <CardDescription className="text-[10px]">Update public details shown to all users.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40">Company Name</label>
                    <input 
                      type="text" 
                      value={companyInfo.name}
                      onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40">Founder</label>
                    <input 
                      type="text" 
                      value={companyInfo.founder}
                      onChange={(e) => setCompanyInfo({...companyInfo, founder: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40">Phone Number</label>
                    <input 
                      type="text" 
                      value={companyInfo.phone}
                      onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40">Coming Soon</label>
                    <input 
                      type="text" 
                      value={companyInfo.comingSoon}
                      onChange={(e) => setCompanyInfo({...companyInfo, comingSoon: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40">Company Goals</label>
                    <Textarea 
                      value={companyInfo.goals}
                      onChange={(e) => setCompanyInfo({...companyInfo, goals: e.target.value})}
                      className="w-full min-h-[80px] bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleUpdateCompanyInfo}
                  disabled={isSaving}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs mt-4"
                >
                  {isSaving ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Save Company Info'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
