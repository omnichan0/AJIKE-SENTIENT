export const TOOL_LIBRARY = {
  SIGINT: [
    { name: "Wireshark", link: "https://www.wireshark.org/", description: "Network protocol analyzer for deep inspection of data traffic." },
    { name: "Kismet", link: "https://www.kismetwireless.net/", description: "Wireless network and device detector, sniffer, wardriving tool." },
    { name: "Aircrack-ng", link: "https://www.aircrack-ng.org/", description: "Complete suite of tools to assess WiFi network security." },
    { name: "Zeek", link: "https://zeek.org/", description: "Powerful network analysis framework." }
  ],
  OSINT: [
    { name: "theHarvester", link: "https://github.com/laramies/theHarvester", description: "E-mail, subdomain and people names harvester." },
    { name: "Maltego", link: "https://www.maltego.com/", description: "Interactive data mining tool that renders directed graphs for link analysis." },
    { name: "Shodan", link: "https://www.shodan.io/", description: "Search engine for Internet-connected devices." },
    { name: "SpiderFoot", link: "https://www.spiderfoot.net/", description: "Automated OSINT collection and analysis tool." },
    { name: "Recon-ng", link: "https://github.com/lanmaster53/recon-ng", description: "Full-featured Web Reconnaissance framework." },
    { name: "OSINT Framework", link: "https://osintframework.com/", description: "Collection of various OSINT tools and resources." }
  ],
  CYBERSECURITY: [
    { name: "Nmap", link: "https://nmap.org/", description: "Utility for network discovery and security auditing.", category: "CYBERSECURITY" },
    { name: "Burp Suite", link: "https://portswigger.net/burp", description: "Web vulnerability scanner and security testing tool.", category: "CYBERSECURITY" },
    { name: "Metasploit", link: "https://www.metasploit.com/", description: "Penetration testing platform (Defensive/Educational use).", category: "CYBERSECURITY" },
    { name: "OWASP ZAP", link: "https://www.zaproxy.org/", description: "Free, open-source penetration testing tool.", category: "CYBERSECURITY" },
    { name: "Ghidra", link: "https://ghidra-sre.org/", description: "Software reverse engineering (SRE) suite of tools.", category: "CYBERSECURITY" },
    { name: "CTF Tools", link: "https://github.com/zardus/ctf-tools", description: "Collection of setup scripts for security research tools.", category: "CYBERSECURITY" }
  ],
  AJIKE_NATIVE: [
    { name: "Neural Image Synthesis", description: "Direct thought-to-pixel rendering engine.", grade: "First Class", origin: "Midjourney/DALL-E 3 Grade" },
    { name: "Vocal Resonance Cloning", description: "Zero-shot voice extraction and synthesis.", grade: "First Class", origin: "ElevenLabs Grade" },
    { name: "Cinematic Video Generation", description: "High-fidelity motion picture rendering.", grade: "First Class", origin: "Sora/Veo Grade" },
    { name: "Anime Studio Director", description: "Full-scale animation production pipeline.", grade: "Second Class", origin: "Niji/Runway Grade" },
    { name: "Deep Code Execution", description: "Isolated sandbox for executing complex scripts.", grade: "First Class", origin: "Code Interpreter Grade" },
    { name: "Real-time Web Scraper", description: "Autonomous data harvesting and analysis.", grade: "Second Class", origin: "Perplexity Grade" }
  ]
};
