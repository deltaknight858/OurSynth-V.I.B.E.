import { useState } from "react";

export function useOAIEvents() {
  const [events, setEvents] = useState<any[]>([]);
  function logEvent(event: any) {
    setEvents((prev) => [...prev, event]);
  }
  return { events, logEvent };
}
