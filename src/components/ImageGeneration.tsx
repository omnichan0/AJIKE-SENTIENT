import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ImageGeneration() {
  const [prompt, setPrompt] = useState('');

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-4">
      <h3 className="font-semibold text-white flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-indigo-400" /> Native Image Weaver
      </h3>
      <Input placeholder="Describe your vision..." value={prompt} onChange={e => setPrompt(e.target.value)} />
      <Button className="w-full bg-indigo-600 hover:bg-indigo-500">
        <Sparkles className="w-4 h-4" /> Generate
      </Button>
    </div>
  );
}
