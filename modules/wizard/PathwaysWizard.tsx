// PROMOTED from import-staging/apps/app/pathways/PathwaysWizard.tsx on 2025-09-08T20:34:32.028Z
// TODO: Review for token + design lint compliance.
import React, { useState } from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '../ui/Dialog';
import { Button } from '../ui/Button';
import '../ui/ui.css';

// Auth and supabase are optional; fall back gracefully if not present in this app context
let useAuth: any = () => ({ user: null });
let supabase: any = { from: () => ({ insert: async () => ({}), delete: async () => ({}), update: async () => ({}) }) };
try { useAuth = require('../../src/authContext').useAuth; } catch {}
try { supabase = require('../../src/supabaseClient').supabase; } catch {}
import { MyProjectsDialog } from './MyProjectsDialog';

const defaultAssets = {
  logo: null,
  color: '#a020f0',
  font: 'Inter',
};

const templates = [
  {
    key: 'blog',
    name: 'Blog',
    description: 'A simple blog with posts, comments, and authentication.',
    preset: {
      description: 'A modern blog platform.',
      vibe: 'neon',
      aiEngine: 'openai',
    }
  }
];

type DeploySummary = { description: string; vibe: string; aiEngine: string; components: string[]; assets: any; [key: string]: any };
function StepDeploy({ summary, onDeploy, deploying, deployResult }: { summary: DeploySummary; onDeploy: () => void; deploying: boolean; deployResult: string }) {
  return (
    <div>
      <h3>Review & Deploy</h3>
      <div className="mb12">
        <div className="fieldLabel">App Description:</div>
        <div className="mb8">{summary.description}</div>
        <div className="fieldLabel">Vibe:</div>
        <div className="mb8">{summary.vibe}</div>
        <div className="fieldLabel">AI Engine:</div>
        <div className="mb8">{summary.aiEngine}</div>
        <div className="fieldLabel">Components:</div>
        <div className="flex gap6 wrap mb8">
          {summary.components.map((c: string) => (
            <span key={c} className="chip">{c}</span>
          ))}
        </div>
        <div className="fieldLabel">Branding:</div>
        <div className="flex items-center gap8">
          {summary.assets.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={summary.assets.logo} alt="Logo" width={32} height={32} className="imgLogo" />
          )}
          <svg width="24" height="24" className="colorDotSvg" role="img" aria-label={`Color ${summary.assets.color}`}>
            <circle cx="12" cy="12" r="11" fill={summary.assets.color} stroke="#ccc" />
          </svg>
          <div>{summary.assets.font}</div>
        </div>
      </div>
      {deployResult ? (
        <div className="flex items-center gap8 mt8">
          <span aria-hidden>✅</span>
          <span className="textSuccess">{deployResult}</span>
        </div>
      ) : (
        <Button onClick={onDeploy} disabled={deploying} variant="primary">
          {deploying ? 'Deploying...' : 'Deploy App'}
        </Button>
      )}
    </div>
  );
}
const componentOptions = [
  { key: 'auth', label: 'Authentication', desc: 'User sign-in, registration, OAuth' },
  { key: 'db', label: 'Database', desc: 'Supabase/Postgres integration' },
  { key: 'chat', label: 'Chat', desc: 'Real-time chat, support, or messaging' },
  { key: 'analytics', label: 'Analytics', desc: 'Track usage, events, and metrics' },
  { key: 'api', label: 'API', desc: 'REST/GraphQL endpoints' },
  { key: 'storage', label: 'File Storage', desc: 'Upload and manage files' },
  { key: 'notifications', label: 'Notifications', desc: 'Email, SMS, or in-app alerts' },
];

function StepComponents({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const toggle = (key: string) => {
    if (value.includes(key)) {
      onChange(value.filter((k) => k !== key));
    } else {
      onChange([...value, key]);
    }
  };
  return (
    <div>
      <h3>Select features/components</h3>
      <div className="cardGrid mt8">
        {componentOptions.map((opt) => {
          const selected = value.includes(opt.key);
          const cls = ['card', selected ? 'card--selected' : ''].filter(Boolean).join(' ');
          return (
            <div key={opt.key} className={cls} onClick={() => toggle(opt.key)}>
              <div className="fontBold mb4">{opt.label}</div>
              <div className="textMutedSmall">{opt.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
const aiEngines = [
  { key: 'openai', label: 'OpenAI', desc: 'GPT-4, GPT-3.5, DALL·E, Whisper', color: '#10a37f', needsKey: true },
  { key: 'gemini', label: 'Gemini', desc: 'Google Gemini Pro, Vision', color: '#4285f4', needsKey: true },
  { key: 'local', label: 'Local', desc: 'Run models on your own hardware', color: '#888', needsKey: false },
];

function StepAIEngine({ value, onChange, apiKey, onApiKeyChange }: { value: string; onChange: (v: string) => void; apiKey: string; onApiKeyChange: (v: string) => void }) {
  const selected = aiEngines.find(e => e.key === value);
  return (
    <div>
      <h3>Choose your AI engine</h3>
      <div className="cardGrid mt8">
        {aiEngines.map((engine) => {
          const selected = value === engine.key;
          const cls = ['card', selected ? 'card--selected' : ''].filter(Boolean).join(' ');
          return (
            <div key={engine.key} className={cls} onClick={() => onChange(engine.key)}>
              <div className="fontBold mb4">{engine.label}</div>
              <div className="textMutedSmall">{engine.desc}</div>
            </div>
          );
        })}
      </div>
      <div className="mt12">
        <div className="fieldLabel mb6">API Key</div>
        <input className="input" value={apiKey} onChange={(e) => onApiKeyChange(e.target.value)} placeholder="Enter your API key" />
        <div className="textMutedSmall mt6">
          {selected?.needsKey ? 'Required for OpenAI and Gemini engines.' : 'No API key needed for Local engine.'}
        </div>
      </div>
    </div>
  );
}
import { useEffect } from 'react';

function StepOverview({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <h3>Describe your app</h3>
      <textarea className="input" value={value} onChange={(e) => onChange(e.target.value)} rows={4} placeholder="What are we building?" />
    </div>
  );
}

function StepVibe({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <h3>Pick a vibe</h3>
  <label className="fieldLabel mb6" htmlFor="vibeSel">Vibe</label>
  <select id="vibeSel" className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select…</option>
        <option value="neon">Neon</option>
        <option value="calm">Calm</option>
        <option value="retro">Retro</option>
      </select>
    </div>
  );
}

function StepAssets({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  return (
    <div>
      <h3>Brand assets</h3>
      <label className="fieldLabel mb6" htmlFor="logoUrl">Logo URL</label>
      <input id="logoUrl" className="input mb8" value={value.logo ?? ''} onChange={(e) => onChange({ ...value, logo: e.target.value })} placeholder="https://..." />
      <label className="fieldLabel mb6" htmlFor="brandColor">Primary color</label>
      <input id="brandColor" className="input mb8" value={value.color} onChange={(e) => onChange({ ...value, color: e.target.value })} placeholder="#a020f0" />
      <label className="fieldLabel mb6" htmlFor="brandFont">Font</label>
      <input id="brandFont" className="input" value={value.font} onChange={(e) => onChange({ ...value, font: e.target.value })} placeholder="Inter" />
    </div>
  );
}

type WizardProps = { open: boolean; onClose: () => void; onComplete?: (result: any) => void };
export default function PathwaysWizard({ open, onClose, onComplete }: WizardProps): JSX.Element {
  const [activeStep, setActiveStep] = useState(0);
  const [description, setDescription] = useState('');
  const [vibe, setVibe] = useState('');
  const [aiEngine, setAIEngine] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [components, setComponents] = useState([]);
  const [assets, setAssets] = useState(defaultAssets);
  const [deploying, setDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  // Template customization state
  const [template, setTemplate] = useState('basic');
  const [uiLib, setUiLib] = useState('mui');
  const [db, setDb] = useState('supabase');
  const [features, setFeatures] = useState({ auth: false, payments: false, cms: false });

  const wizardSteps = [
    'Template',
    'Customize',
    'Overview',
    'Vibe',
    'AI Engine',
    'Components',
    'Assets',
    'Deploy',
  ];

  const handleNext = () => {
    if (activeStep === wizardSteps.length - 1) {
      // Deploy step: do nothing, handled by deploy button
      return;
    }
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div>
            <h3>Choose a Template</h3>
            <div className="cardGrid mb8">
              {templates.map((tmpl) => {
                const selected = selectedTemplate === tmpl.key;
                const cls = ['card', selected ? 'card--selected' : ''].filter(Boolean).join(' ');
                return (
                  <div
                    key={tmpl.key}
                    className={cls}
                    onClick={() => {
                      setSelectedTemplate(tmpl.key);
                      setDescription(tmpl.preset.description);
                      setVibe(tmpl.preset.vibe);
                      setAIEngine(tmpl.preset.aiEngine);
                      setComponents((tmpl as any).preset.components || []);
                      setAssets((tmpl as any).preset.assets || defaultAssets);
                    }}
                  >
        <div className="fontBold">{tmpl.name}</div>
        <div className="textMutedSmall">{tmpl.description}</div>
                  </div>
                );
              })}
            </div>
      <div className="textMutedSmall">Or start from scratch by clicking Next.</div>
          </div>
        );
      case 1:
        // Template customization step
        return (
          <div>
            <h3>Customize Your Starter</h3>
            <div className="mb12">
              <label className="fieldLabel mb6" htmlFor="uiLib">
                UI Library <sup title="Choose your preferred React UI framework." className="supHelp">?</sup>
              </label>
              <select id="uiLib" className="input" value={uiLib} onChange={(e) => setUiLib(e.target.value)}>
                <option value="halo">Halo</option>
                <option value="tailwind">Tailwind CSS</option>
              </select>
              <label className="fieldLabel mt8" htmlFor="db">
                Database <sup title="Supabase (Postgres, auth, storage), PlanetScale (MySQL, serverless), MongoDB Atlas (NoSQL, flexible)" className="supHelp">?</sup>
              </label>
              <select id="db" className="input" value={db} onChange={(e) => setDb(e.target.value)}>
                <option value="supabase">Supabase</option>
                <option value="planetscale">PlanetScale</option>
                <option value="mongodb">MongoDB Atlas</option>
              </select>
              <div className="fieldLabel mt8">
                Features <sup title="Add built-in authentication, Stripe payments, or a headless CMS" className="supHelp">?</sup>
              </div>
              <div className="col gap4 mb8">
                <label><input type="checkbox" checked={features.auth} onChange={(e) => setFeatures((f) => ({ ...f, auth: e.target.checked }))} /> Auth (Sign up, login)</label>
                <label><input type="checkbox" checked={features.payments} onChange={(e) => setFeatures((f) => ({ ...f, payments: e.target.checked }))} /> Payments (Stripe)</label>
                <label><input type="checkbox" checked={features.cms} onChange={(e) => setFeatures((f) => ({ ...f, cms: e.target.checked }))} /> Headless CMS</label>
              </div>
              <div className="textErrorSmall">
                {(!features.auth && !features.payments && !features.cms) && 'Tip: Select at least one feature for a richer starter.'}
              </div>
            </div>
          </div>
        );
      case 2:
  return <StepOverview value={description} onChange={setDescription} />;
      case 3:
  return <StepVibe value={vibe} onChange={setVibe} />;
      case 4:
  return <StepAIEngine value={aiEngine as any} onChange={setAIEngine as any} apiKey={apiKey} onApiKeyChange={setApiKey} />;
      case 5:
  return <StepComponents value={components as any} onChange={setComponents as any} />;
      case 6:
  return <StepAssets value={assets} onChange={setAssets} />;
      case 7:
  return <StepDeploy summary={{ description, vibe, aiEngine, components, assets, template, uiLib, db, features }} onDeploy={handleDeploy} deploying={deploying} deployResult={deployResult} />;
      default:
  return <div>Step coming soon...</div>;
    }
  };

  const isNextDisabled = () => {
    switch (activeStep) {
      case 0:
        return !description.trim();
      case 1:
        return !vibe;
      case 2: {
        const selected = aiEngines.find(e => e.key === aiEngine);
        if (!aiEngine) return true;
        if (selected && selected.needsKey && !apiKey.trim()) return true;
        return false;
      }
      case 3:
        return components.length === 0;
      case 4:
        return !assets.logo || !assets.color || !assets.font;
      case 5:
        return false;
      default:
        return false;
    }
  };

  const handleDeploy = () => {
    setDeploying(true);
    setTimeout(() => {
      setDeploying(false);
      setDeployResult('App deployed successfully!');
      onComplete && onComplete({ description, vibe, aiEngine, apiKey, components, assets });
      // Optionally close dialog after a delay
      // setTimeout(onClose, 1500);
    }, 1200);
  };

  const { user } = useAuth();
  const [saveLoading, setSaveLoading] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaveLoading(true);
    const project = {
      user_id: user.id,
      name: description || 'Untitled',
      description: vibe,
      data: { description, vibe, aiEngine, components, assets },
    };
    await supabase.from('projects').insert([project]);
    setSaveLoading(false);
  };
  const handleLoad = (proj: any) => {
    if (!proj) return;
    const d = proj.data || {};
    setDescription(d.description || '');
    setVibe(d.vibe || '');
    setAIEngine(d.aiEngine || '');
    setComponents(d.components || []);
    setAssets(d.assets || defaultAssets);
    setActiveStep(0);
    setProjectsOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth ariaLabel="App Creation Wizard">
      <DialogHeader>
        <DialogTitle>App Creation Wizard</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <div className="flex gap8 mb12">
          {user && (
            <>
              <Button onClick={handleSave} disabled={saveLoading} variant="outline" size="sm">
                {saveLoading ? 'Saving...' : 'Save Project'}
              </Button>
              <Button onClick={() => setProjectsOpen(true)} variant="outline" size="sm">
                My Projects
              </Button>
            </>
          )}
        </div>
        <div className="stepper">
          {wizardSteps.map((label, i) => (
            <div key={label} className={["step", i === activeStep ? 'step--active' : ''].join(' ')}>
              {label}
            </div>
          ))}
        </div>
        {renderStepContent()}
        <div className="flex justify-between mt16">
          <Button disabled={activeStep === 0} onClick={handleBack} variant="outline">
            Back
          </Button>
          {activeStep < wizardSteps.length - 1 && (
            <Button onClick={handleNext} variant="primary" disabled={isNextDisabled()}>
              Next
            </Button>
          )}
        </div>
        <MyProjectsDialog open={projectsOpen} onClose={() => setProjectsOpen(false)} onLoad={handleLoad} />
      </DialogBody>
    </Dialog>
  );
}
