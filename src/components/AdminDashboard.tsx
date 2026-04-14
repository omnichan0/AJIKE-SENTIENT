import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Cpu, Users, Zap, Terminal, Globe, CreditCard, Radio } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function AdminDashboard() {
  const [command, setCommand] = useState('');
  const [newWallet, setNewWallet] = useState('');
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] AJIKE Kernel v4.0 initialized.",
    "[NETWORK] Petals Swarm connection established.",
    "[SECURITY] Firewall active on port 3000."
  ]);

  const handleUpdateWallet = async () => {
    if (!newWallet.trim()) return;
    try {
      // In a real app, this would update the kernel config in Firestore
      setLogs(prev => [`[ADMIN] Wallet updated to: ${newWallet}`, ...prev]);
      setNewWallet('');
    } catch (error) {
      console.error("Error updating wallet:", error);
    }
  };

  const handleCommand = () => {
    if (!command.trim()) return;
    setLogs(prev => [`[ADMIN] Executing: ${command}`, ...prev]);
    setCommand('');
    // In a real app, this would trigger the "Self-Rewriting" logic via the backend
  };

  return (
    <div className="h-full flex flex-col p-6 gap-6 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-medium text-glow">Kernel Administration</h2>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Sovereign Active</Badge>
          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20">Petals Link: 99%</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Cpu className="w-3 h-3" /> Neural Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono text-white">42.8%</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Users className="w-3 h-3" /> Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono text-white">1,284</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Zap className="w-3 h-3" /> Inference Speed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono text-white">12ms</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Globe className="w-3 h-3" /> Swarm Nodes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono text-white">842</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        <div className="md:col-span-2 flex flex-col gap-4 overflow-hidden">
          <Card className="flex-1 bg-white/5 border-white/10 flex flex-col overflow-hidden">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Kernel Command Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
              <ScrollArea className="flex-1 p-4 font-mono text-[11px] text-white/60">
                {logs.map((log, i) => (
                  <div key={i} className="mb-1">{log}</div>
                ))}
              </ScrollArea>
              <div className="p-4 border-t border-white/5 flex gap-2">
                <Input 
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
                  placeholder="Enter natural language command to rewrite kernel code..."
                  className="bg-white/5 border-white/10 text-white font-mono text-xs"
                />
                <Button onClick={handleCommand} className="bg-orange-600 hover:bg-orange-500">Execute</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 overflow-hidden">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Wallet Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                value={newWallet}
                onChange={(e) => setNewWallet(e.target.value)}
                placeholder="New Tron Wallet Address..."
                className="bg-black/40 border-white/10 text-xs text-white"
              />
              <Button onClick={handleUpdateWallet} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs">Update Wallet</Button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Tier Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">JJC Tier</span>
                <Badge variant="outline">$0.00 / mo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Sultan Tier</span>
                <Badge variant="outline" className="border-orange-500 text-orange-500">$49.99 / mo</Badge>
              </div>
              <Button className="w-full bg-white/10 hover:bg-white/20 text-white text-xs">Update Pricing</Button>
            </CardContent>
          </Card>

          <Card className="flex-1 bg-white/5 border-white/10 flex flex-col overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2">
                <Radio className="w-4 h-4" /> Broadcast Module
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <textarea 
                placeholder="Message to all users..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white resize-none focus:outline-none focus:border-orange-500/50"
              />
              <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs">Broadcast</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
