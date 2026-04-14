import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Users, LayoutTemplate, Play, Save, Loader2, Sparkles, Wand2, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export function AnimeStudio() {
  const [genre, setGenre] = useState('Shonen');
  const [storyPrompt, setStoryPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('bible');

  const handleGenerate = async () => {
    if (!storyPrompt.trim() || isGenerating) return;
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-8 h-full overflow-y-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-600 to-orange-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
          <Wand2 className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-glow">Anime Studio</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono">Project Manager & Storyboard Engine</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
        <Button 
          variant={activeTab === 'bible' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('bible')}
          className={activeTab === 'bible' ? 'bg-pink-600 hover:bg-pink-500 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}
        >
          <BookOpen className="w-4 h-4 mr-2" /> Story Bible
        </Button>
        <Button 
          variant={activeTab === 'characters' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('characters')}
          className={activeTab === 'characters' ? 'bg-pink-600 hover:bg-pink-500 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}
        >
          <Users className="w-4 h-4 mr-2" /> Characters
        </Button>
        <Button 
          variant={activeTab === 'episodes' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('episodes')}
          className={activeTab === 'episodes' ? 'bg-pink-600 hover:bg-pink-500 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}
        >
          <LayoutTemplate className="w-4 h-4 mr-2" /> Episode Planner
        </Button>
      </div>

      {activeTab === 'bible' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-pink-400" /> Core Concept
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  value={storyPrompt}
                  onChange={(e) => setStoryPrompt(e.target.value)}
                  placeholder="e.g., Make a Shonen about a digital ghost in Ekiti..."
                  className="min-h-[150px] bg-black/40 border-white/10 text-sm text-white focus:border-pink-500/50 rounded-xl resize-none"
                />
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !storyPrompt.trim()}
                  className="w-full h-12 bg-pink-600 hover:bg-pink-500 text-white rounded-xl gap-2"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  {isGenerating ? 'Consulting Script...' : 'Generate Story Bible'}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4 text-orange-400" /> Generated Synopsis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[200px] bg-black/40 rounded-xl border border-white/10 p-4 text-sm text-white/80">
                  {isGenerating ? (
                    <div className="h-full flex items-center justify-center text-white/40">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" /> Generating world-building data...
                    </div>
                  ) : (
                    <p className="text-white/40 text-center mt-16">No synopsis generated yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-400" /> Project Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] text-white/40 uppercase tracking-widest">Genre / Style</label>
                  <select 
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500/50"
                  >
                    <option value="Shonen">Modern Shonen</option>
                    <option value="Seinen">Seinen (Dark/Mature)</option>
                    <option value="Manga">Manga (B&W)</option>
                    <option value="Shojo">Shojo</option>
                    <option value="Ghibli">Studio Ghibli Style</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] text-white/40 uppercase tracking-widest">Project Title</label>
                  <Input 
                    placeholder="Untitled Project"
                    className="bg-black/40 border-white/10 text-white focus:border-pink-500/50"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] text-white/40 uppercase tracking-widest">Episode Length</label>
                  <select 
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500/50"
                  >
                    <option value="12m">12 Minutes (Short)</option>
                    <option value="24m">24 Minutes (Standard)</option>
                    <option value="45m">45 Minutes (Special)</option>
                    <option value="90m">90 Minutes (Feature Film)</option>
                  </select>
                </div>

                <Button className="w-full bg-white/10 hover:bg-white/20 text-white gap-2">
                  <Save className="w-4 h-4" /> Save Project
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'characters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/5 border-white/10 border-dashed flex flex-col items-center justify-center min-h-[300px] cursor-pointer hover:bg-white/10 transition-colors">
            <Users className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-sm text-white/60">Add Character</p>
          </Card>
        </div>
      )}

      {activeTab === 'episodes' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
            <div>
              <h3 className="font-medium text-white">Season 1, Episode 1</h3>
              <p className="text-xs text-white/40">Not started</p>
            </div>
            <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10">
              Open Planner
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
