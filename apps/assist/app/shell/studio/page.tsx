"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './Studio.module.css';

interface FeaturePanelProps {
  feature: string;
}

function FeaturePanel({ feature }: FeaturePanelProps) {
  switch (feature) {
    case 'vibe':
      return (
        <div className={styles.featurePanel}>
          <h2>V.I.B.E Studio</h2>
          <p>Visual Interactive Builder Environment - Create and orchestrate AI workflows with natural language.</p>
          <div className={styles.vibeInterface}>
            <div className={styles.canvasArea}>
              <div className={styles.placeholder}>
                🎨 Canvas Area
                <p>Drag and drop components to build your workflow</p>
              </div>
            </div>
            <div className={styles.componentPalette}>
              <h4>Components</h4>
              <div className={styles.component}>📄 Document Input</div>
              <div className={styles.component}>🧠 AI Processor</div>
              <div className={styles.component}>📊 Data Transform</div>
              <div className={styles.component}>💾 Output Handler</div>
            </div>
          </div>
        </div>
      );
    case 'code':
      return (
        <div className={styles.featurePanel}>
          <h2>Code Editor</h2>
          <p>Write and edit code with AI assistance.</p>
          <div className={styles.codeInterface}>
            <div className={styles.editor}>
              <div className={styles.placeholder}>
                💻 Code Editor
                <p>Your AI-powered development environment</p>
              </div>
            </div>
          </div>
        </div>
      );
    case 'preview':
      return (
        <div className={styles.featurePanel}>
          <h2>Live Preview</h2>
          <p>See your creations in real-time.</p>
          <div className={styles.previewInterface}>
            <div className={styles.preview}>
              <div className={styles.placeholder}>
                👀 Live Preview
                <p>Real-time rendering of your work</p>
              </div>
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div className={styles.featurePanel}>
          <h2>Studio Workspace</h2>
          <p>Select a feature from the left navigation to get started.</p>
        </div>
      );
  }
}

function RightInspector({ feature }: { feature: string }) {
  const getInspectorContent = () => {
    switch (feature) {
      case 'vibe':
        return (
          <div className={styles.inspectorSection}>
            <h4>V.I.B.E Tools</h4>
            <div className={styles.toolGroup}>
              <button className={styles.tool}>🔧 Component Props</button>
              <button className={styles.tool}>🔗 Connections</button>
              <button className={styles.tool}>⚙️ Settings</button>
              <button className={styles.tool}>🚀 Deploy</button>
            </div>
            <div className={styles.inspectorSection}>
              <h5>Current Selection</h5>
              <p>No component selected</p>
            </div>
          </div>
        );
      case 'code':
        return (
          <div className={styles.inspectorSection}>
            <h4>Code Tools</h4>
            <div className={styles.toolGroup}>
              <button className={styles.tool}>🐛 Debug</button>
              <button className={styles.tool}>🔍 Search</button>
              <button className={styles.tool}>📁 Files</button>
              <button className={styles.tool}>🔄 Git</button>
            </div>
          </div>
        );
      case 'preview':
        return (
          <div className={styles.inspectorSection}>
            <h4>Preview Tools</h4>
            <div className={styles.toolGroup}>
              <button className={styles.tool}>📱 Responsive</button>
              <button className={styles.tool}>🌓 Theme</button>
              <button className={styles.tool}>📊 Analytics</button>
              <button className={styles.tool}>🔄 Refresh</button>
            </div>
          </div>
        );
      default:
        return (
          <div className={styles.inspectorSection}>
            <h4>Studio Inspector</h4>
            <p>Select a feature to see contextual tools.</p>
          </div>
        );
    }
  };

  return (
    <div className={styles.rightInspector}>
      <div className={styles.inspectorHeader}>
        <h3>Inspector</h3>
      </div>
      {getInspectorContent()}
    </div>
  );
}

export default function StudioPage() {
  const searchParams = useSearchParams();
  const [activeFeature, setActiveFeature] = useState('');

  useEffect(() => {
    const feature = searchParams.get('feature') || '';
    setActiveFeature(feature);
  }, [searchParams]);

  const handleFeatureChange = (feature: string) => {
    setActiveFeature(feature);
    // Update URL without page reload
    const url = new URL(window.location.href);
    if (feature) {
      url.searchParams.set('feature', feature);
    } else {
      url.searchParams.delete('feature');
    }
    window.history.pushState({}, '', url.toString());
  };

  const features = [
    { id: 'vibe', name: 'V.I.B.E', icon: '🎨', description: 'Visual Interactive Builder' },
    { id: 'code', name: 'Code', icon: '💻', description: 'Code Editor' },
    { id: 'preview', name: 'Preview', icon: '👀', description: 'Live Preview' },
  ];

  return (
    <div className={styles.studioContainer}>
      {/* Left Navigation */}
      <div className={styles.leftNav}>
        <div className={styles.navHeader}>
          <h3>🎨 Studio</h3>
          <span className={styles.aiTag}>AI</span>
        </div>
        
        <nav className={styles.featureNav}>
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`${styles.featureItem} ${
                activeFeature === feature.id ? styles.active : ''
              }`}
              onClick={() => handleFeatureChange(feature.id)}
            >
              <span className={styles.featureIcon}>{feature.icon}</span>
              <div className={styles.featureInfo}>
                <div className={styles.featureName}>{feature.name}</div>
                <div className={styles.featureDesc}>{feature.description}</div>
              </div>
            </div>
          ))}
        </nav>

        <div className={styles.navFooter}>
          <div className={styles.currentProject}>
            <h5>Current Project</h5>
            <p>Knowledge Compiler Demo</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={styles.mainViewport}>
        <div className={styles.viewportHeader}>
          <div className={styles.breadcrumb}>
            <span>🏠 Shell</span>
            <span>→</span>
            <span>🎨 Studio</span>
            {activeFeature && (
              <>
                <span>→</span>
                <span>{features.find(f => f.id === activeFeature)?.name}</span>
              </>
            )}
          </div>
          <div className={styles.viewportActions}>
            <button className={styles.actionBtn}>💾 Save</button>
            <button className={styles.actionBtn}>🚀 Deploy</button>
            <button className={styles.actionBtn}>📤 Export</button>
          </div>
        </div>

        <div className={styles.featureViewport}>
          <FeaturePanel feature={activeFeature} />
        </div>
      </div>

      {/* Right Inspector */}
      <RightInspector feature={activeFeature} />
    </div>
  );
}