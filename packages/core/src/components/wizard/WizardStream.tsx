'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type StreamData = {
  phase: string;
  fileCount: number;
  elapsed: number;
  errors?: string[];
};

type Props = { runId: string };

export default function WizardStream({ runId }: Props) {
  const [status, setStatus] = useState<StreamData | null>(null);
  const [done, setDone] = useState(false);
  const liveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const evt = new EventSource(`/api/pathways/status?runId=${runId}`);
    evt.onmessage = (e) => {
      const data: StreamData = JSON.parse(e.data);
      setStatus(data);
      if (data.phase === 'done' || data.errors) {
        setDone(true);
        evt.close();
      }
    };
    evt.onerror = () => evt.close();
    return () => evt.close();
  }, [runId]);

  const phases: Record<string, string> = {
    analyze: 'Analyzing inputs',
    generate: 'Generating files',
    lint: 'Linting & formatting',
    diff: 'Preparing diff',
    done: 'Ready!',
    error: 'Error',
  };

  return (
    <div className="rounded-2xl border border-cyan-400/30 bg-[rgba(20,20,30,0.85)] p-4 text-white backdrop-blur-xl">
      <h4 className="text-cyan-300 font-semibold mb-2">Generating with Pathways</h4>

      <AnimatePresence>
        {status && (
          <motion.div
            key={status.phase}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-sm mb-2">
              Phase: <span className="text-cyan-200">{phases[status.phase] ?? status.phase}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 rounded bg-cyan-400/10 border border-cyan-400/30">
                {status.fileCount} files
              </span>
              <span className="px-2 py-1 rounded bg-cyan-400/10 border border-cyan-400/30">
                {status.elapsed}s elapsed
              </span>
              {status.errors?.length ? (
                <span className="px-2 py-1 rounded bg-red-400/10 border border-red-400/40 text-red-300">
                  Error
                </span>
              ) : null}
            </div>
            <div className="mt-3 h-1 w-full rounded bg-neutral-700 overflow-hidden">
              <div
                className={`h-1 transition-all ${
                  done ? 'w-full bg-cyan-400' : 'w-1/3 animate-pulse bg-cyan-500'
                }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={liveRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {status?.phase}
      </div>
    </div>
  );
}