import React, { useState } from 'react';
import { Mic, Play, Square, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function VoiceGeneration() {
  const [isRecording, setIsRecording] = useState(false);
  const [audio, setAudio] = useState<string | null>(null);

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-4">
      <h3 className="font-semibold text-white flex items-center gap-2">
        <Mic className="w-5 h-5 text-indigo-400" /> Native Voice Synthesis
      </h3>
      <p className="text-sm text-white/60">Record your voice to create a custom synthesis model.</p>
      <div className="flex gap-2">
        <Button onClick={() => setIsRecording(!isRecording)} className={isRecording ? 'bg-red-600' : 'bg-indigo-600'}>
          {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />} {isRecording ? 'Stop' : 'Record'}
        </Button>
      </div>
    </div>
  );
}
