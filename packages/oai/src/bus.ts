// Minimal event bus stub for local development
type Listener = (event: string, payload: unknown) => void;
const listeners = new Map<string, Listener[]>();

export function publish(channel: string, event: string, payload?: unknown) {
  const key = `${channel}`;
  const subs = listeners.get(key) || [];
  subs.forEach((fn) => fn(event, payload));
}

export function subscribe(channel: string, fn: Listener) {
  const key = `${channel}`;
  const subs = listeners.get(key) || [];
  subs.push(fn);
  listeners.set(key, subs);
  return () => {
    const arr = listeners.get(key) || [];
    listeners.set(key, arr.filter((f) => f !== fn));
  };
}
