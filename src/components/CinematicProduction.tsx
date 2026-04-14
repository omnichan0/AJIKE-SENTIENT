import React, { useState, useRef, useEffect } from 'react';
import { Film, Clock, Mic, Square, Sparkles, Play as PlayIcon, Pause, Save, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function CinematicProduction() {
  const [duration, setDuration] = useState('10');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const savedDuration = localStorage.getItem('cinematicDuration');
    if (savedDuration) setDuration(savedDuration);
  }, []);

  const saveSettings = () => {
    localStorage.setItem('cinematicDuration', duration);
    alert('Settings saved!');
  };

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

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-4">
      <h3 className="font-semibold text-white flex items-center gap-2">
        <Film className="w-5 h-5 text-indigo-400" /> Cinematic Production
      </h3>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-white/40" />
        <Input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="w-20" />
        <span className="text-sm text-white/60">minutes per episode</span>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm text-white/60">Voice Cloning</label>
        <Button 
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-full gap-2 ${isRecording ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white/60'}`}
        >
          {isRecording ? <><Square className="w-4 h-4" /> Stop Recording</> : <><Mic className="w-4 h-4" /> Record Voice Sample</>}
        </Button>
        {voiceBlob && <p className="text-xs text-green-400">Voice sample captured.</p>}
      </div>

      <div className="flex gap-2">
        <Button onClick={saveSettings} className="flex-1 bg-emerald-600 hover:bg-emerald-500 gap-2">
          <Save className="w-4 h-4" /> Save Settings
        </Button>
        <Button className="flex-1 bg-indigo-600 hover:bg-indigo-500">Initialize Production</Button>
      </div>

      <div className="mt-4 space-y-2">
        <label className="text-sm text-white/60">Video Preview</label>
        <div className="aspect-video bg-black/40 rounded-lg flex items-center justify-center border border-white/10">
          <video ref={videoRef} className="w-full h-full rounded-lg" onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)} />
          {!videoRef.current && <span className="text-white/20">No video loaded</span>}
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={togglePlay} size="sm" variant="ghost">
            {isPlaying ? <Pause className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
          </Button>
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500" style={{ width: `${(currentTime / (videoRef.current?.duration || 1)) * 100}%` }} />
          </div>
          <span className="text-xs text-white/40">{Math.floor(currentTime)}s</span>
        </div>
      </div>
    </div>
  );
}
