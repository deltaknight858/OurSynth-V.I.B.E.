'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
// Integration stub; real implementation should live in @oursynth/integrations/pathways-client
type StartWizard = (args: {
  productSlug: string;
  version: string;
  wizardConfig: Record<string, unknown> & { targetApp: string; route: string };
}) => Promise<void>;
const getStartWizard = (): StartWizard | null => null;
// Minimal user stub; replace when auth lib is available
function useSupabaseUser(){ return { user: null as null | { id: string } }; }

type Props = {
  product: {
    slug: string;
    title: string;
    version: string;
    isPremium: boolean;
    templateMeta?: {
      route?: string;
  options?: Record<string, unknown>;
    };
  };
  isEntitled: boolean;
};

export function GenerateWithPathways({ product, isEntitled }: Props) {
  const { user } = useSupabaseUser();
  const [open, setOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  async function handleGenerate() {
    if (!user || !product.templateMeta) return;
    setIsRunning(true);
    try {
  const startWizard = getStartWizard();
  if (!startWizard) throw new Error('Pathways client not available');
  await startWizard({
        productSlug: product.slug,
        version: product.version ?? 'latest',
        wizardConfig: {
          targetApp: 'web',
          route: product.templateMeta.route ?? `/store/${product.slug}`,
          ...(product.templateMeta.options ?? {}),
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
      setOpen(false);
    }
  }

  if (!user) return null;

  return (
    <>
      <button
        className={`mt-2 px-4 py-2 rounded-lg font-semibold transition shadow-[0_0_10px_rgba(34,211,238,0.35)] ${
          isEntitled
            ? 'bg-cyan-400 text-black hover:brightness-110'
            : 'bg-neutral-800 text-cyan-300 hover:bg-neutral-700'
        }`}
        onClick={() => {
          if (isEntitled) setOpen(true);
          else window.location.href = `/cart?product=${product.slug}`;
        }}
      >
        {isEntitled ? 'Generate with Pathways' : 'Buy to Generate'}
      </button>

      <AnimatePresence>
        {open && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-cyan-400/30 bg-[rgba(20,20,30,0.9)] p-6 backdrop-blur-xl text-white"
            >
              <h3 className="text-xl font-semibold text-cyan-300 mb-2">
                Generate {product.title}
              </h3>
              <p className="text-sm text-gray-300">
                This will scaffold files into your monorepo. You can preview diffs and apply via PR.
              </p>
              <button
                onClick={handleGenerate}
                disabled={isRunning}
                className="mt-4 px-4 py-2 rounded-lg bg-cyan-400 text-black font-semibold hover:brightness-110 transition disabled:opacity-60"
              >
                {isRunning ? 'Generating…' : 'Run Wizard'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}