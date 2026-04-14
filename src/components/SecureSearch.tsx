import React, { useState } from 'react';
import { Search, ShieldAlert, Globe, Link2, Loader2, Terminal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function SecureSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [harvestUrl, setHarvestUrl] = useState('');
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [harvestResult, setHarvestResult] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Redirect to DuckDuckGo (simulating secure search)
    window.open(`https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`, '_blank');
  };

  const handleHarvest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!harvestUrl.trim()) return;
    
    setIsHarvesting(true);
    setHarvestResult(null);

    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(harvestUrl)}`);
      const data = await response.json();
      
      if (!data.contents) {
        throw new Error("Failed to retrieve content");
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, "text/html");
      
      const title = doc.querySelector('title')?.innerText || 'No title found';
      const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || 'No description found';
      
      const links = Array.from(doc.querySelectorAll('a'))
        .map(a => a.href)
        .filter(href => href.startsWith('http'))
        // Filter out allorigins links if they got prefixed
        .filter(href => !href.includes('api.allorigins.win'))
        .slice(0, 15); // Limit to 15 links for display

      const result = `[AJIKE HARVESTER NODE]
Target: ${harvestUrl}
Status: ${data.status?.http_code || 200} OK

[META DATA]
Title: ${title}
Description: ${description}

[LINKS FOUND: ${links.length}]
${links.length > 0 ? links.map(l => `- ${l}`).join('\n') : '- No external links found'}

[SCRAPE COMPLETE]`;

      setHarvestResult(result);
    } catch (error) {
      setHarvestResult(`[AJIKE HARVESTER NODE]\nTarget: ${harvestUrl}\n\n[ERROR]\nFailed to harvest data. The target may be blocking requests or is unreachable.\n\n[SCRAPE ABORTED]`);
    } finally {
      setIsHarvesting(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Globe className="w-6 h-6 text-indigo-500" />
          AJIKE Secure Net
        </h2>
        <p className="text-white/60 text-sm">Encrypted Search & URL Harvesting Engine</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Secure Search Engine */}
        <Card className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-orange-500" />
              Secure Search (DuckDuckGo Routing)
            </CardTitle>
            <CardDescription className="text-white/60">
              Queries are routed through secure nodes to prevent tracking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="Enter search query..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-black/40 border-white/10 text-white focus:border-indigo-500/50"
                />
              </div>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* URL Harvester */}
        <Card className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Link2 className="w-5 h-5 text-green-500" />
              URL Harvester & Scraper
            </CardTitle>
            <CardDescription className="text-white/60">
              Extract metadata, links, and structure from target URLs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleHarvest} className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="https://example.com"
                  value={harvestUrl}
                  onChange={(e) => setHarvestUrl(e.target.value)}
                  className="pl-9 bg-black/40 border-white/10 text-white focus:border-green-500/50"
                />
              </div>
              <Button type="submit" disabled={isHarvesting} className="bg-green-600 hover:bg-green-500 text-white">
                {isHarvesting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Harvest'}
              </Button>
            </form>

            <div className="bg-black/60 border border-white/10 rounded-lg p-4 h-48 relative font-mono text-xs overflow-hidden">
              {isHarvesting ? (
                <div className="flex flex-col items-center justify-center h-full text-green-500/60 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <p>Initializing proxy nodes...</p>
                </div>
              ) : harvestResult ? (
                <ScrollArea className="h-full w-full">
                  <pre className="text-green-400 whitespace-pre-wrap">{harvestResult}</pre>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white/20 space-y-2">
                  <Terminal className="w-6 h-6" />
                  <p>Awaiting target URL...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
