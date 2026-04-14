import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Globe, Radio, ExternalLink, Search, Sparkles, Star, Trash2, MoveRight, Archive } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TOOL_LIBRARY as INITIAL_TOOL_LIBRARY } from '@/src/data/tools';

type Tool = {
  name: string;
  description: string;
  link?: string;
  category?: string;
  grade?: string;
  origin?: string;
};

type ToolLibraryState = {
  [key: string]: Tool[];
};

export function ToolLibrary() {
  const [activeTab, setActiveTab] = useState<string>('AJIKE_NATIVE');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initialize with SKILLS_VAULT
  const [toolLibrary, setToolLibrary] = useState<ToolLibraryState>(() => {
    const saved = localStorage.getItem('ajike_tool_library');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      ...INITIAL_TOOL_LIBRARY,
      SKILLS_VAULT: []
    };
  });

  useEffect(() => {
    localStorage.setItem('ajike_tool_library', JSON.stringify(toolLibrary));
  }, [toolLibrary]);

  const categories = ['AJIKE_NATIVE', 'SIGINT', 'OSINT', 'CYBERSECURITY', 'SKILLS_VAULT'];

  const filteredTools = (toolLibrary[activeTab] || []).filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const moveTool = (tool: Tool, fromCategory: string, toCategory: string) => {
    setToolLibrary(prev => {
      const newLibrary = { ...prev };
      newLibrary[fromCategory] = newLibrary[fromCategory].filter(t => t.name !== tool.name);
      if (!newLibrary[toCategory]) newLibrary[toCategory] = [];
      newLibrary[toCategory] = [...newLibrary[toCategory], tool];
      return newLibrary;
    });
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-orange-500" />
            The Vault: Tool Library
          </h2>
          <p className="text-white/60 text-sm">Sovereign Data Sources & Native Capabilities</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-black/40 border-white/10 text-white focus:border-orange-500/50"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-1 bg-black/40 border border-white/10 rounded-lg w-fit">
        {categories.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === tab ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            {tab === 'AJIKE_NATIVE' && <Sparkles className="w-4 h-4 text-purple-400" />}
            {tab === 'SIGINT' && <Radio className="w-4 h-4" />}
            {tab === 'OSINT' && <Globe className="w-4 h-4" />}
            {tab === 'CYBERSECURITY' && <Shield className="w-4 h-4" />}
            {tab === 'SKILLS_VAULT' && <Archive className="w-4 h-4 text-yellow-500" />}
            {tab.replace('_', ' ')}
            <span className="ml-1 text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">
              {toolLibrary[tab]?.length || 0}
            </span>
          </button>
        ))}
      </div>

      <ScrollArea className="flex-1 pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
          {filteredTools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-black/40 border-white/10 hover:border-orange-500/30 transition-colors h-full flex flex-col relative overflow-visible">
                {/* Grade Badge */}
                {tool.grade && (
                  <div className={`absolute top-0 right-0 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-bl-lg z-10 ${
                    tool.grade === 'First Class' ? 'bg-yellow-500/20 text-yellow-500' :
                    tool.grade === 'Second Class' ? 'bg-gray-400/20 text-gray-400' :
                    'bg-orange-700/20 text-orange-700'
                  }`}>
                    {tool.grade}
                  </div>
                )}
                
                <CardHeader className="pb-2 pt-6">
                  <CardTitle className="text-lg text-white flex justify-between items-start">
                    <span className="pr-16">{tool.name}</span>
                    {tool.link && (
                      <a
                        href={tool.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/40 hover:text-orange-500 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <CardDescription className="text-white/60 mb-4">
                    {tool.description}
                  </CardDescription>
                  
                  <div className="mt-auto space-y-4">
                    {tool.origin && (
                      <div className="pt-4 border-t border-white/5">
                        <div className="flex items-center gap-1 text-[10px] text-white/30 uppercase tracking-widest">
                          <Star className="w-3 h-3" />
                          <span>Origin Class: {tool.origin}</span>
                        </div>
                        <p className="text-[9px] text-purple-400/60 italic mt-1">
                          * AJIKE Native Capability. No external API required.
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                      <select 
                        className="flex-1 bg-black/60 border border-white/10 rounded-md px-2 py-1 text-xs text-white/70 focus:outline-none focus:border-orange-500/50"
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            moveTool(tool, activeTab, e.target.value);
                          }
                        }}
                      >
                        <option value="" disabled>Move to Tier...</option>
                        {categories.filter(c => c !== activeTab).map(c => (
                          <option key={c} value={c}>{c.replace('_', ' ')}</option>
                        ))}
                      </select>
                      
                      {activeTab !== 'SKILLS_VAULT' && (
                        <button 
                          onClick={() => moveTool(tool, activeTab, 'SKILLS_VAULT')}
                          className="p-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Remove to Vault"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {filteredTools.length === 0 && (
            <div className="col-span-full text-center py-12 text-white/40">
              No tools found in {activeTab.replace('_', ' ')}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
