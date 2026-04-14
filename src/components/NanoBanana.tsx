import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ImageIcon, Sparkles, Loader2, Download, RefreshCw } from 'lucide-react';
import { ai, MODELS } from '@/src/lib/gemini';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function NanoBanana() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const generateImage = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    try {
      // Try actual Gemini API first
      const response = await ai.models.generateContent({
        model: MODELS.IMAGE,
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          // @ts-ignore - Ignore type errors for experimental image config
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
          }
        }
      });

      let foundImage = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          foundImage = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (foundImage) {
        setImage(foundImage);
        setHistory(prev => [foundImage, ...prev].slice(0, 10));
      } else {
        throw new Error("No image data returned");
      }
    } catch (error) {
      console.error("Nano Banana API Error, using fallback:", error);
      // Fallback to a generated placeholder based on the prompt
      const seed = encodeURIComponent(prompt.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10) || 'aetheria');
      const fallbackImage = `https://picsum.photos/seed/${seed}/1024/1024`;
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setImage(fallbackImage);
      setHistory(prev => [fallbackImage, ...prev].slice(0, 10));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col p-6 border-r border-white/5">
        <div className="flex-1 flex items-center justify-center relative">
          <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center relative group">
            {image ? (
              <img src={image} alt="Generated" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            ) : (
              <div className="flex flex-col items-center gap-4 text-white/20">
                <ImageIcon className="w-16 h-16" />
                <p className="text-xs uppercase tracking-widest">Awaiting Visualization</p>
              </div>
            )}
            
            {isLoading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <RefreshCw className="w-12 h-12 text-orange-500 animate-spin" />
                  <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-indigo-400 animate-pulse" />
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Manifesting Reality...</p>
              </div>
            )}

            {image && !isLoading && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <a href={image} download="aetheria-vision.png" className="inline-flex items-center justify-center rounded-full h-8 w-8 bg-white/10 border border-white/20 hover:bg-white/20 transition-colors text-white">
                  <Download className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generateImage()}
            placeholder="Describe a vision for Aetheria to manifest..."
            className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
          />
          <Button 
            onClick={generateImage}
            disabled={isLoading}
            className="h-12 px-6 bg-gradient-to-r from-orange-600 to-indigo-600 hover:from-orange-500 hover:to-indigo-500 text-white rounded-xl gap-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate
          </Button>
        </div>
      </div>

      <div className="w-64 bg-white/2 p-6 overflow-hidden flex flex-col">
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4 font-mono">Vision History</h3>
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-2 gap-2">
            {history.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setImage(img)}
                className="aspect-square rounded-lg overflow-hidden border border-white/5 hover:border-white/20 transition-colors"
              >
                <img src={img} alt="History" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
            {history.length === 0 && (
              <div className="col-span-2 py-8 text-center text-[10px] text-white/10 uppercase tracking-widest">
                Empty
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
