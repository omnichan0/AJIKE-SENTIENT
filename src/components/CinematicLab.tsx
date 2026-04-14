import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Video, Settings, Play, Download, Loader2, Sparkles, Film } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

export function CinematicLab() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resolution, setResolution] = useState('4K');
  const [duration, setDuration] = useState('10s');
  const [motionIntensity, setMotionIntensity] = useState('High');
  const [deepSync, setDeepSync] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    
    // Simulate Veo 3.1 API call
    setTimeout(() => {
      setVideoUrl('https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'); // Placeholder
      setIsGenerating(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-8 h-full overflow-y-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <Film className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-glow">Cinematic Lab</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono">Powered by Google Veo 3.1 & Runway Gen-4.5</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-400" /> Director's Prompt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the scene in detail. Include lighting, camera movement, and character actions..."
                className="min-h-[150px] bg-black/40 border-white/10 text-sm text-white focus:border-purple-500/50 rounded-xl resize-none"
              />
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full h-12 bg-purple-600 hover:bg-purple-500 text-white rounded-xl gap-2"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {isGenerating ? 'Rendering Scene...' : 'Action! (Generate Video)'}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 overflow-hidden">
            <CardContent className="p-0 aspect-video relative flex items-center justify-center bg-black/60">
              {videoUrl ? (
                <video src={videoUrl} controls className="w-full h-full object-contain" autoPlay loop />
              ) : (
                <div className="flex flex-col items-center gap-4 text-white/20">
                  <Play className="w-16 h-16" />
                  <p className="text-xs uppercase tracking-widest">Awaiting Render</p>
                </div>
              )}
              {isGenerating && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">Veo 3.1 Processing...</p>
                </div>
              )}
            </CardContent>
            {videoUrl && (
              <div className="p-4 border-t border-white/10 bg-white/2 flex justify-end">
                <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 gap-2">
                  <Download className="w-4 h-4" /> Download 4K
                </Button>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-400" /> Render Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] text-white/40 uppercase tracking-widest">Resolution</label>
                <select 
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
                >
                  <option value="1080p">1080p HD</option>
                  <option value="4K">4K Ultra HD</option>
                  <option value="8K">8K Cinematic</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] text-white/40 uppercase tracking-widest">Duration</label>
                <select 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
                >
                  <option value="5s">5 Seconds (Clip)</option>
                  <option value="30s">30 Seconds (Teaser)</option>
                  <option value="5m">5 Minutes (Short)</option>
                  <option value="20m">20 Minutes (Episode)</option>
                  <option value="120m">2 Hours (Feature Film)</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] text-white/40 uppercase tracking-widest">Motion Intensity</label>
                <select 
                  value={motionIntensity}
                  onChange={(e) => setMotionIntensity(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
                >
                  <option value="Low">Low (Subtle)</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High (Dynamic)</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="space-y-1">
                  <div className="text-xs font-medium">Deep-Sync</div>
                  <div className="text-[10px] text-white/40">Realistic lip-syncing & audio</div>
                </div>
                <Switch checked={deepSync} onCheckedChange={setDeepSync} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
