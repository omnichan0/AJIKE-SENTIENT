// Petals Swarm Client (Decentralized Inference Gateway)
// Direct P2P participation in the Petals swarm is not possible in browser/Node.js environments.
// This client interfaces with the Petals swarm via a standard Inference Gateway.

const PETALS_GATEWAY_URL = "https://chat.petals.dev/api/v1"; // Standard Petals Inference Gateway

export async function connectToPetals(prompt: string, history: any[] = []): Promise<string> {
  console.log("Connecting to Petals Decentralized Swarm via Inference Gateway...");
  
  try {
    // Standard Petals inference request format
    const response = await fetch(`${PETALS_GATEWAY_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "petals-team/StableBeluga2", 
        prompt: prompt,
        history: history,
        max_new_tokens: 256,
        do_sample: true,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error(`Inference Gateway error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.text || "No response from the Petals swarm.";
  } catch (error) {
    console.error("Petals swarm connection failed:", error);
    throw error;
  }
}
