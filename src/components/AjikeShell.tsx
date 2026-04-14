import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Music, Image as ImageIcon, Mic2, Settings, Sparkles, Cpu, Menu, X, Mic, Activity, Film } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AjikeBrain } from './AjikeBrain';
import { NanoBanana } from './NanoBanana';
import { LyriaMusic } from './LyriaMusic';
import { VibeVoice } from './VibeVoice';
import { AjikeEvolution } from './AjikeEvolution';
import { ToolVault } from './ToolVault';
import { VoiceGeneration } from './VoiceGeneration';
import { ImageGeneration } from './ImageGeneration';
import { CinematicProduction } from './CinematicProduction';
import { AdminDashboard } from './AdminDashboard';
import { UserDashboard } from './UserDashboard';
import { SultanControl } from './SultanControl';
import { Shield, LayoutDashboard, User as UserIcon, Crown, LogIn, LogOut } from 'lucide-react';
import { auth, signInWithGoogle, logout, onAuthStateChanged, User, db } from '@/src/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const CREATOR_EMAIL = "lovethayo2017@gmail.com";

export function AjikeShell() {
  console.log("AjikeShell rendering...");
  const [activeTab, setActiveTab] = useState('brain');
  const [view, setView] = useState<'app' | 'admin' | 'user' | 'sultan'>('app');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [coAdmins, setCoAdmins] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configDoc = await getDoc(doc(db, 'kernel_config', 'global'));
        if (configDoc.exists()) {
          setCoAdmins(configDoc.data().coAdmins || []);
        }
      } catch (error) {
        console.error("Error fetching kernel config:", error);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      if (currentUser?.email === CREATOR_EMAIL) {
        setView('sultan');
      } else if (currentUser?.email && coAdmins.includes(currentUser.email)) {
        setView('admin');
      } else {
        setView('app');
      }
    });
    return () => unsubscribe();
  }, [coAdmins]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isSultan = user?.email === CREATOR_EMAIL;
  const isCoAdmin = user?.email ? coAdmins.includes(user.email) : false;

  const [authError, setAuthError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error("Sign-in failed:", error);
      if (error.code === 'auth/network-request-failed') {
        setAuthError("Network error. Please ensure this domain is added to 'Authorized Domains' in your Firebase Console.");
      } else {
        setAuthError(error.message || "Sign-in failed. Please try again.");
      }
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Synchronizing Kernel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-black">
      {/* Sentient Background */}
      <div className="atmosphere-bg animate-pulse-slow" />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-screen flex flex-col relative z-10"
      >
        {/* Header */}
        <header className="p-4 md:px-6 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-xl relative z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-medium tracking-tight text-glow">AJIKE</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono">Autonomous Joint Kernel Engine</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!user ? (
              <div className="flex flex-col items-end gap-1">
                <button 
                  onClick={handleSignIn}
                  className="px-4 py-1.5 rounded-full bg-orange-600 text-white text-[10px] uppercase tracking-wider flex items-center gap-2 hover:bg-orange-500 transition-colors"
                >
                  <LogIn className="w-3 h-3" /> Google Sign-In
                </button>
                {authError && <p className="text-[8px] text-red-500 max-w-[150px] text-right leading-tight">{authError}</p>}
              </div>
            ) : (
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[100] flex flex-col"
                    >
                      <div className="p-4 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <Sparkles className="text-white w-6 h-6" />
                          </div>
                          <div>
                            <h1 className="text-xl font-medium tracking-tight text-glow">AJIKE</h1>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono">System Menu</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setIsMenuOpen(false)}
                          className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => { setView('app'); setIsMenuOpen(false); }}
                            className={`w-full p-4 rounded-xl text-lg uppercase tracking-wider transition-colors flex items-center gap-4 ${view === 'app' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}
                          >
                            <Brain className="w-6 h-6" /> Kernel
                          </button>
                          {view === 'app' && (
                            <div className="pl-4 flex flex-col gap-2 mt-2 border-l-2 border-white/10 ml-6">
                              <button onClick={() => { setActiveTab('brain'); setIsMenuOpen(false); }} className={`w-full p-3 rounded-lg text-sm uppercase tracking-wider text-left flex items-center gap-3 ${activeTab === 'brain' ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'}`}><Brain className="w-4 h-4"/> Kernel Brain</button>
                              <button onClick={() => { setActiveTab('nano'); setIsMenuOpen(false); }} className={`w-full p-3 rounded-lg text-sm uppercase tracking-wider text-left flex items-center gap-3 ${activeTab === 'nano' ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'}`}><Sparkles className="w-4 h-4"/> Nano Banana</button>
                              <button onClick={() => { setActiveTab('lyria'); setIsMenuOpen(false); }} className={`w-full p-3 rounded-lg text-sm uppercase tracking-wider text-left flex items-center gap-3 ${activeTab === 'lyria' ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'}`}><Sparkles className="w-4 h-4"/> Lyria</button>
                              <button onClick={() => { setActiveTab('vibe'); setIsMenuOpen(false); }} className={`w-full p-3 rounded-lg text-sm uppercase tracking-wider text-left flex items-center gap-3 ${activeTab === 'vibe' ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'}`}><Mic className="w-4 h-4"/> Vibe Voice</button>
                              <button onClick={() => { setActiveTab('evolution'); setIsMenuOpen(false); }} className={`w-full p-3 rounded-lg text-sm uppercase tracking-wider text-left flex items-center gap-3 ${activeTab === 'evolution' ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'}`}><Activity className="w-4 h-4"/> Evolution</button>
                              <button onClick={() => { setActiveTab('vault'); setIsMenuOpen(false); }} className={`w-full p-3 rounded-lg text-sm uppercase tracking-wider text-left flex items-center gap-3 ${activeTab === 'vault' ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'}`}><Sparkles className="w-4 h-4"/> Tool Vault</button>
                              <button onClick={() => { setActiveTab('voice'); setIsMenuOpen(false); }} className={`w-full p-3 rounded-lg text-sm uppercase tracking-wider text-left flex items-center gap-3 ${activeTab === 'voice' ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'}`}><Mic className="w-4 h-4"/> Voice Gen</button>
                              <button onClick={() => { setActiveTab('image'); setIsMenuOpen(false); }} className={`w-full p-3 rounded-lg text-sm uppercase tracking-wider text-left flex items-center gap-3 ${activeTab === 'image' ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'}`}><ImageIcon className="w-4 h-4"/> Image Gen</button>
                              <button onClick={() => { setActiveTab('cinematic'); setIsMenuOpen(false); }} className={`w-full p-3 rounded-lg text-sm uppercase tracking-wider text-left flex items-center gap-3 ${activeTab === 'cinematic' ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'}`}><Film className="w-4 h-4"/> Cinematic</button>
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => { setView('user'); setIsMenuOpen(false); }}
                          className={`w-full p-4 rounded-xl text-lg uppercase tracking-wider transition-colors flex items-center gap-4 ${view === 'user' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}
                        >
                          <UserIcon className="w-6 h-6" /> Dashboard
                        </button>
                        {isSultan && (
                          <button 
                            onClick={() => { setView('sultan'); setIsMenuOpen(false); }}
                            className={`w-full p-4 rounded-xl text-lg uppercase tracking-wider transition-colors flex items-center gap-4 ${view === 'sultan' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' : 'bg-orange-500/5 text-orange-500/60 hover:bg-orange-500/10 hover:text-orange-500'}`}
                          >
                            <Crown className="w-6 h-6" /> /daddy
                          </button>
                        )}
                        {(isSultan || isCoAdmin) && (
                          <button 
                            onClick={() => { setView('admin'); setIsMenuOpen(false); }}
                            className={`w-full p-4 rounded-xl text-lg uppercase tracking-wider transition-colors flex items-center gap-4 ${view === 'admin' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}
                          >
                            <Shield className="w-6 h-6" /> Admin
                          </button>
                        )}
                        
                        <div className="mt-auto pt-4">
                          <button 
                            onClick={() => { logout(); setIsMenuOpen(false); }}
                            className="w-full p-4 rounded-xl text-lg uppercase tracking-wider transition-colors flex items-center justify-center gap-4 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          >
                            <LogOut className="w-6 h-6" /> Logout
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {view === 'app' && (
              <motion.div
                key="app"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="h-full flex flex-col"
              >
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                  <div className="flex-1 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                      >
                        <TabsContent value="brain" className="h-full m-0 p-0">
                          <AjikeBrain />
                        </TabsContent>
                        <TabsContent value="nano" className="h-full m-0 p-0">
                          <NanoBanana />
                        </TabsContent>
                        <TabsContent value="lyria" className="h-full m-0 p-0">
                          <LyriaMusic />
                        </TabsContent>
                        <TabsContent value="vibe" className="h-full m-0 p-0">
                          <VibeVoice />
                        </TabsContent>
                        <TabsContent value="evolution" className="h-full m-0 p-0">
                          <AjikeEvolution />
                        </TabsContent>
                        <TabsContent value="vault" className="h-full m-0 p-0">
                          <ToolVault />
                        </TabsContent>
                        <TabsContent value="voice" className="h-full m-0 p-0">
                          <VoiceGeneration />
                        </TabsContent>
                        <TabsContent value="image" className="h-full m-0 p-0">
                          <ImageGeneration />
                        </TabsContent>
                        <TabsContent value="cinematic" className="h-full m-0 p-0">
                          <CinematicProduction />
                        </TabsContent>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </Tabs>
              </motion.div>
            )}

            {user && (isSultan || isCoAdmin) && view === 'admin' && (
              <motion.div
                key="admin"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <AdminDashboard />
              </motion.div>
            )}

            {user && view === 'user' && (
              <motion.div
                key="user"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full"
              >
                <UserDashboard />
              </motion.div>
            )}

            {user && isSultan && view === 'sultan' && (
              <motion.div
                key="sultan"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="h-full"
              >
                <SultanControl />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
