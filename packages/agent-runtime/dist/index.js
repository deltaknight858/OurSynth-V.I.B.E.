// src/index.ts
function runAgent(config = {}) {
  const emit = (type, payload) => config.onEvent?.({ type, payload, timestamp: Date.now() });
  emit("start");
  emit("progress", { message: "Agent runtime initialized" });
  emit("complete");
}
export {
  runAgent
};
