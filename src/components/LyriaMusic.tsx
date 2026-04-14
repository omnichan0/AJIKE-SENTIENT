import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Music, Play, Pause, Loader2, Sparkles, Download, Mic, Square } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export function LyriaMusic() {
  const [prompt, setPrompt] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setVoiceBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Recording error:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const generateMusic = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setAudioUrl(null);
    setLyrics(null);
    
    try {
      // Simulate Lyria generation process with voice cloning
      console.log(voiceBlob ? "Generating with voice clone" : "Generating without voice clone");
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Use a placeholder public domain audio file for demonstration
      setAudioUrl('https://actions.google.com/sounds/v1/science_fiction/sci_fi_drone_loop.ogg');
      
      setLyrics(`(Ethereal hum begins)\n\nNeural pathways aligning...\n${prompt}\n\n(Resonant frequency stabilizes)`);
    } catch (error) {
      console.error("Lyria Error:", error);
    } finally {
      setIsLoading(false);
      setVoiceBlob(null); // Reset voice blob
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col h-full p-8">
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full gap-8">
        <div className="relative">
          <div className={`w-48 h-48 rounded-full border-2 border-white/10 flex items-center justify-center relative ${isPlaying ? 'animate-spin-slow' : ''}`}>
             <div className="absolute inset-0 rounded-full border border-orange-500/20 animate-pulse" />
             <Music className={`w-16 h-16 ${isPlaying ? 'text-orange-500' : 'text-white/20'}`} />
          </div>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-full">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>

        <div className="w-full space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-medium text-glow">Sonic Manifestation</h2>
            <p className="text-xs text-white/40 uppercase tracking-[0.2em]">Lyria Neural Audio Core</p>
          </div>

          <div className="flex gap-2">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateMusic()}
              placeholder="Compose a symphony of thoughts..."
              className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
            />
            <Button 
              onClick={isRecording ? stopRecording : startRecording}
              className={`h-12 w-12 rounded-xl ${isRecording ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white/60'}`}
            >
              {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button 
              onClick={generateMusic}
              disabled={isLoading}
              className="h-12 px-6 bg-orange-600 hover:bg-orange-500 text-white rounded-xl gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate Music
            </Button>
          </div>

          {audioUrl && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-2xl space-y-4"
            >
              <div className="flex items-center gap-4">
                <Button onClick={togglePlay} size="icon" className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-500">
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </Button>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-widest">
                    <span>Neural Composition</span>
                    <span>30s</span>
                  </div>
                  <Slider defaultValue={[0]} max={100} step={1} className="w-full" />
                </div>
                <a href={audioUrl} download="aetheria-composition.wav" className="inline-flex items-center justify-center rounded-lg h-8 w-8 text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                  <Download className="w-4 h-4" />
                </a>
              </div>
              
              {lyrics && (
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 max-h-32 overflow-y-auto">
                  <p className="text-xs text-white/60 italic leading-relaxed whitespace-pre-wrap">{lyrics}</p>
                </div>
              )}
              
              <audio 
                ref={audioRef} 
                src={audioUrl} 
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
