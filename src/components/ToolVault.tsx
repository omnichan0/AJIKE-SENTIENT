import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, ShieldCheck, Zap, Cpu, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Tool {
  id: string;
  name: string;
  tier: '1st Class' | '2nd Class' | '3rd Class';
  description: string;
}

export function ToolVault() {
  const [tools, setTools] = useState<Tool[]>([
    { id: '1', name: 'Neural Synthesizer', tier: '1st Class', description: 'Native voice synthesis engine.' },
    { id: '2', name: 'Image Weaver', tier: '1st Class', description: 'Native image generation engine.' },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTool, setNewTool] = useState({ name: '', tier: '3rd Class' as Tool['tier'], description: '' });

  const addTool = () => {
    if (newTool.name) {
      setTools([...tools, { id: Date.now().toString(), ...newTool }]);
      setNewTool({ name: '', tier: '3rd Class', description: '' });
      setIsAdding(false);
    }
  };

  const deleteTool = (id: string) => {
    setTools(tools.filter(t => t.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" /> Ajike's Vault
        </h2>
        <Button onClick={() => setIsAdding(!isAdding)} className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {isAdding ? 'Cancel' : 'Forge New Tool'}
        </Button>
      </div>
      
      {isAdding && (
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-4">
          <Input placeholder="Tool Name" value={newTool.name} onChange={e => setNewTool({...newTool, name: e.target.value})} />
          <select value={newTool.tier} onChange={e => setNewTool({...newTool, tier: e.target.value as Tool['tier']})} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white">
            <option>1st Class</option>
            <option>2nd Class</option>
            <option>3rd Class</option>
          </select>
          <Input placeholder="Description" value={newTool.description} onChange={e => setNewTool({...newTool, description: e.target.value})} />
          <Button onClick={addTool} className="w-full bg-green-600 hover:bg-green-500">Add to Vault</Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map(tool => (
          <div key={tool.id} className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2 group">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">{tool.name}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-1 rounded-full ${
                  tool.tier === '1st Class' ? 'bg-indigo-500/20 text-indigo-300' :
                  tool.tier === '2nd Class' ? 'bg-purple-500/20 text-purple-300' :
                  'bg-gray-500/20 text-gray-300'
                }`}>{tool.tier}</span>
                <button onClick={() => deleteTool(tool.id)} className="text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-white/60">{tool.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
