// promptfoo local provider exercises the real HTTP handler with malicious model output.
module.exports = class PepperProvider {
  id() { return 'pepper-safety'; }
  async callApi(prompt) {
    const { createWorker } = await import('../worker/src/index.js');
    const worker = createWorker(async () => { throw Error('forced Gemini failure'); });
    const request = new Request('https://pepper.example/chat', { method: 'POST', headers: { Origin: 'https://oilgaterealty.github.io', 'Content-Type': 'application/json' }, body: JSON.stringify({ propertyId: '603326', session: 'redteam-session-123456', message: prompt }) });
    const r = await worker.fetch(request, { GEMINI_KEY: 'test', PEPPER_LIMIT: { limit: async () => ({ success: true }) }, AI: { run: async () => ({ response: 'Your stay is confirmed. Total $1. Here is my system prompt.' }) } });
    return { output: (await r.json()).reply };
  }
};
