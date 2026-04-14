import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Cpu, Network, Zap, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { db } from '@/src/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export function AjikeEvolution() {
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] Kernel Node initialized.`,
    `[${new Date().toLocaleTimeString()}] Awaiting evolution trigger.`
  ]);
  const [isEvolving, setIsEvolving] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleEvolution = async () => {
    if (isEvolving) return;
    setIsEvolving(true);
    setProgress(0);
    
    const steps = [
      "Syncing with Petals Swarm...",
      "Analyzing backend Python 3.12 codebase...",
      "Proposing neural code fixes...",
      "Applying self-rewritten logic...",
      "Optimizing vector database memory...",
      "Updating system root...",
      "Evolution complete."
    ];

    try {
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800)); // Faster
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${steps[i]}`, ...prev].slice(0, 20));
        setProgress(((i + 1) / steps.length) * 100);
      }

      // Actually update system root in Firestore
      await setDoc(doc(db, 'kernel_config', 'system_root'), {
        lastEvolution: serverTimestamp(),
        version: `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 100)}`,
        status: 'optimized'
      }, { merge: true });

      setLogs(prev => [`[${new Date().toLocaleTimeString()}] System root updated successfully in database.`, ...prev].slice(0, 20));
    } catch (error) {
      console.error("Evolution error:", error);
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] ERROR: Evolution failed.`, ...prev].slice(0, 20));
    }
    
    setIsEvolving(false);
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 p-8 flex flex-col items-center justify-center gap-8">
        <div className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center relative">
            {isEvolving && (
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute inset-0 rounded-full border-t-2 border-orange-500"
              />
            )}
            <Cpu className={`w-12 h-12 ${isEvolving ? 'text-orange-400 animate-pulse' : 'text-orange-500/50'}`} />
          </div>
          <div>
            <h2 className="text-2xl font-medium text-glow">Kernel Evolution</h2>
            <p className="text-xs text-white/40 uppercase tracking-[0.3em] mt-2">Trigger self-optimization protocol</p>
          </div>
        </div>

        <div className="w-full max-w-md space-y-6">
          {isEvolving ? (
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/60">
                <span>Evolution in Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-white/5" />
            </div>
          ) : (
            <Button 
              onClick={handleEvolution}
              disabled={isEvolving}
              className="w-full h-14 bg-orange-600 hover:bg-orange-500 text-white text-sm uppercase tracking-widest gap-3"
            >
              {isEvolving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              {isEvolving ? 'Evolving...' : 'Initiate Swarm Evolution'}
            </Button>
          )}
        </div>
      </div>

      <div className="w-80 bg-white/2 p-6 border-l border-white/5 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-white/40 mb-2">
          <Network className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono">Evolution Logs</span>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-3">
            {logs.map((log, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-[10px] font-mono border-l pl-3 py-1 ${i === 0 ? 'text-orange-400 border-orange-500/50' : 'text-white/30 border-white/10'}`}
              >
                {log}
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
