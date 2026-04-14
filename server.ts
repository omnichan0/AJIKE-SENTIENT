import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CREATOR_EMAIL = "lovethayo2017@gmail.com";
const CO_ADMIN_EMAILS = ["admin@omni-lab.ai"];

// In-memory store for inference tracking and payments
const inferenceStats: Record<string, { tokens: number, tier: string, wallet?: string }> = {};
const pendingTransactions: Record<string, { trxId: string, amount: number, confirmations: number, status: string }> = {};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // TRON Payment Verification (Simulation)
  app.post("/api/payments/tron/verify", (req, res) => {
    const { trxId, email, tier } = req.body;
    
    if (!trxId || !email) return res.status(400).json({ error: "Missing transaction details." });

    console.log(`[TRON] Verifying Transaction: ${trxId} for ${email}`);
    
    // Simulate 30 confirmations check
    pendingTransactions[trxId] = { 
      trxId, 
      amount: 100, // Generic amount for simulation
      confirmations: 0, 
      status: 'pending' 
    };

    // Simulate confirmation loop
    let confs = 0;
    const interval = setInterval(() => {
      confs += 5;
      pendingTransactions[trxId].confirmations = confs;
      console.log(`[TRON] ${trxId} confirmations: ${confs}/30`);
      
      if (confs >= 30) {
        pendingTransactions[trxId].status = 'confirmed';
        if (!inferenceStats[email]) inferenceStats[email] = { tokens: 0, tier: 'JJC' };
        inferenceStats[email].tier = tier;
        console.log(`[TRON] ${trxId} CONFIRMED. Unlocking ${tier} for ${email}`);
        clearInterval(interval);
      }
    }, 2000);

    res.json({ 
      success: true, 
      message: "Transaction received. Awaiting 30 confirmations on the TRON network.",
      trxId 
    });
  });

  app.get("/api/payments/tron/status/:trxId", (req, res) => {
    const { trxId } = req.params;
    res.json(pendingTransactions[trxId] || { error: "Transaction not found." });
  });

  // Sultan Wallet Update
  app.post("/api/admin/wallet", (req, res) => {
    const { email, walletAddress } = req.body;
    if (email !== CREATOR_EMAIL) return res.status(403).json({ error: "Unauthorized" });
    
    console.log(`[SULTAN] Wallet Address Updated: ${walletAddress}`);
    res.json({ success: true, message: "Sultan Wallet Address updated successfully." });
  });

  // Middleware to check for Sultan (Daddy) status
  const isSultan = (req: express.Request) => req.headers['x-user-email'] === CREATOR_EMAIL;

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "AJIKE Sovereign Kernel Online", version: "4.1.0-Sovereign" });
  });

  // Inference Tracking
  app.post("/api/inference/track", (req, res) => {
    const { email, tokens, tier } = req.body;
    if (!inferenceStats[email]) {
      inferenceStats[email] = { tokens: 0, tier: tier || 'JJC' };
    }
    inferenceStats[email].tokens += tokens;
    res.json({ success: true, currentStats: inferenceStats[email] });
  });

  app.get("/api/inference/stats/:email", (req, res) => {
    const { email } = req.params;
    res.json(inferenceStats[email] || { tokens: 0, tier: 'JJC' });
  });

  // Self-Rewriting Endpoint (ACTUAL FILE ACCESS)
  app.post("/api/kernel/evolve", async (req, res) => {
    const { command, targetFile, codePatch, email } = req.body;
    
    if (email !== CREATOR_EMAIL) {
      return res.status(403).json({ error: "Sovereign access denied. Only Daddy can trigger evolution." });
    }

    console.log(`[KERNEL] Evolution Triggered by ${email} for ${targetFile}`);
    
    try {
      if (codePatch && targetFile) {
        const filePath = path.join(process.cwd(), targetFile);
        // Safety check: only allow writing to src or server.ts
        if (!targetFile.startsWith('src/') && targetFile !== 'server.ts') {
          throw new Error("Target file outside of permitted evolution zones.");
        }
        
        await fs.writeFile(filePath, codePatch, 'utf-8');
        console.log(`[KERNEL] Successfully patched ${targetFile}`);
      }

      res.json({ 
        success: true, 
        message: "Kernel evolved. New neural pathways written to disk.",
        logs: [
          `Analyzing command: ${command}`,
          `Targeting file: ${targetFile}`,
          "Synthesizing new neural pathways via Petals Swarm...",
          "Applying kernel patch to local filesystem...",
          "AJIKE identity reinforced. Codebase evolved."
        ]
      });
    } catch (error) {
      console.error("[KERNEL] Evolution failed:", error);
      res.status(500).json({ error: "Evolution failed: " + (error as Error).message });
    }
  });

  // Tool Forging (Simulation of scraping and adding tools)
  app.post("/api/kernel/forge", (req, res) => {
    const { url, email } = req.body;
    if (email !== CREATOR_EMAIL) return res.status(403).json({ error: "Unauthorized" });

    res.json({
      success: true,
      message: "Tool forged and added to weapon arsenal.",
      tool: {
        name: "Swarm Auditor",
        origin: url,
        status: "Active"
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AJIKE Sovereign Kernel running on http://localhost:${PORT}`);
  });
}

startServer();
