'use client';
import { useState } from 'react';
import styles from './Capsules.module.css';

export default function CapsulesPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [capsuleName, setCapsuleName] = useState('');
  const [capsuleDescription, setCapsuleDescription] = useState('');
  const [validationStatus, setValidationStatus] = useState('pending');
  const [packingStatus, setPackingStatus] = useState('pending');
  const [signingStatus, setSigningStatus] = useState('pending');
  const [publishStatus, setPublishStatus] = useState('pending');

  const steps = [
    { id: 0, name: 'Create', icon: '✨', description: 'Define capsule manifest and structure' },
    { id: 1, name: 'Validate', icon: '✓', description: 'Verify schema and dependencies' },
    { id: 2, name: 'Pack', icon: '📦', description: 'Bundle code and manifest into archive' },
    { id: 3, name: 'Sign', icon: '🔐', description: 'Cryptographically sign with Ed25519' },
    { id: 4, name: 'Publish', icon: '🚀', description: 'Upload to marketplace (optional)' },
    { id: 5, name: 'Import', icon: '📥', description: 'Import capsule for execution' },
    { id: 6, name: 'Execute', icon: '⚡', description: 'Run capsule with full provenance' }
  ];

  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Create
        return (
          <div className={styles.stepContent}>
            <h3>Create Capsule</h3>
            <div className={styles.formGroup}>
              <label>Capsule Name</label>
              <input
                type="text"
                value={capsuleName}
                onChange={(e) => setCapsuleName(e.target.value)}
                placeholder="e.g. realtime-chat-capsule"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                value={capsuleDescription}
                onChange={(e) => setCapsuleDescription(e.target.value)}
                placeholder="Describe what this capsule does..."
                className={styles.textarea}
                rows={3}
              />
            </div>
            <div className={styles.manifestPreview}>
              <h4>Manifest Preview</h4>
              <pre className={styles.codeBlock}>
{`{
  "id": "urn:oursynth:capsule:${capsuleName || 'my-capsule'}@1.0.0",
  "name": "${capsuleName || 'My Capsule'}",
  "version": "1.0.0",
  "description": "${capsuleDescription || 'A portable workflow capsule'}",
  "build": "sha256-pending",
  "services": [],
  "env": { "NODE_ENV": "production" },
  "rights": { 
    "license": "OSL-3.0-or-compatible", 
    "resaleAllowed": true, 
    "attribution": true 
  },
  "sbom": "pending",
  "attestation": "pending",
  "signature": "pending",
  "publicKey": "pending"
}`}
              </pre>
            </div>
          </div>
        );

      case 1: // Validate
        return (
          <div className={styles.stepContent}>
            <h3>Validate Capsule</h3>
            <div className={styles.validationPanel}>
              <div className={styles.validationItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Schema validation passed</span>
              </div>
              <div className={styles.validationItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Dependencies resolved</span>
              </div>
              <div className={styles.validationItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Security scan completed</span>
              </div>
              <div className={styles.validationItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>License compatibility verified</span>
              </div>
            </div>
            <div className={styles.validationDetails}>
              <h4>Validation Report</h4>
              <div className={styles.reportItem}>
                <strong>Bundle Size:</strong> 2.1MB (within limits)
              </div>
              <div className={styles.reportItem}>
                <strong>Dependencies:</strong> 12 packages, all verified
              </div>
              <div className={styles.reportItem}>
                <strong>Security:</strong> No vulnerabilities detected
              </div>
              <div className={styles.reportItem}>
                <strong>Compliance:</strong> OSL-3.0 compatible
              </div>
            </div>
          </div>
        );

      case 2: // Pack
        return (
          <div className={styles.stepContent}>
            <h3>Pack Capsule</h3>
            <div className={styles.packingPanel}>
              <div className={styles.packingStep}>
                <span className={styles.stepNumber}>1</span>
                <span>Bundling source code and assets</span>
                <span className={styles.statusComplete}>✓</span>
              </div>
              <div className={styles.packingStep}>
                <span className={styles.stepNumber}>2</span>
                <span>Generating integrity hashes</span>
                <span className={styles.statusComplete}>✓</span>
              </div>
              <div className={styles.packingStep}>
                <span className={styles.stepNumber}>3</span>
                <span>Creating archive structure</span>
                <span className={styles.statusComplete}>✓</span>
              </div>
              <div className={styles.packingStep}>
                <span className={styles.stepNumber}>4</span>
                <span>Compressing to .capsule format</span>
                <span className={styles.statusComplete}>✓</span>
              </div>
            </div>
            <div className={styles.archiveInfo}>
              <h4>Archive Details</h4>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label>File Size:</label>
                  <span>1.8MB compressed</span>
                </div>
                <div className={styles.infoItem}>
                  <label>SHA-256:</label>
                  <span>a1b2c3d4e5f6...</span>
                </div>
                <div className={styles.infoItem}>
                  <label>Files:</label>
                  <span>47 total</span>
                </div>
                <div className={styles.infoItem}>
                  <label>Format:</label>
                  <span>.capsule v1.0</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Sign
        return (
          <div className={styles.stepContent}>
            <h3>Sign Capsule</h3>
            <div className={styles.signingPanel}>
              <div className={styles.keyInfo}>
                <h4>Signing Key</h4>
                <div className={styles.keyDisplay}>
                  <div className={styles.keyType}>Ed25519 Public Key</div>
                  <div className={styles.keyValue}>3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f...</div>
                </div>
              </div>
              <div className={styles.signatureInfo}>
                <h4>Digital Signature</h4>
                <div className={styles.signatureDisplay}>
                  <div className={styles.signatureValue}>9f8e7d6c5b4a392817263...</div>
                  <div className={styles.signatureStatus}>✓ Valid signature generated</div>
                </div>
              </div>
              <div className={styles.attestation}>
                <h4>Attestation</h4>
                <ul className={styles.attestationList}>
                  <li>✓ Source code integrity verified</li>
                  <li>✓ Build reproducibility confirmed</li>
                  <li>✓ No malicious patterns detected</li>
                  <li>✓ License compliance verified</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 4: // Publish
        return (
          <div className={styles.stepContent}>
            <h3>Publish to Marketplace</h3>
            <div className={styles.publishPanel}>
              <div className={styles.marketplaceInfo}>
                <h4>OurSynth Workflow Marketplace</h4>
                <p>Share your capsule with the community or monetize your work.</p>
              </div>
              <div className={styles.pricingOptions}>
                <div className={styles.pricingOption}>
                  <input type="radio" id="free" name="pricing" defaultChecked />
                  <label htmlFor="free">
                    <strong>Free</strong>
                    <span>Open source contribution</span>
                  </label>
                </div>
                <div className={styles.pricingOption}>
                  <input type="radio" id="paid" name="pricing" />
                  <label htmlFor="paid">
                    <strong>Paid</strong>
                    <span>Monetize your capsule</span>
                  </label>
                </div>
              </div>
              <div className={styles.marketplaceDetails}>
                <div className={styles.detailItem}>
                  <label>Revenue Share:</label>
                  <span>70% creator, 30% platform</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Distribution:</label>
                  <span>Global, mesh-ready</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Provenance:</label>
                  <span>Full execution tracking</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // Import
        return (
          <div className={styles.stepContent}>
            <h3>Import Capsule</h3>
            <div className={styles.importPanel}>
              <div className={styles.importOptions}>
                <div className={styles.importOption}>
                  <h4>From Marketplace</h4>
                  <div className={styles.searchBox}>
                    <input type="text" placeholder="Search capsules..." className={styles.searchInput} />
                    <button className={styles.searchButton}>🔍</button>
                  </div>
                </div>
                <div className={styles.importOption}>
                  <h4>From File</h4>
                  <div className={styles.fileUpload}>
                    <button className={styles.uploadButton}>Choose .capsule file</button>
                    <span className={styles.uploadHint}>Drag and drop supported</span>
                  </div>
                </div>
                <div className={styles.importOption}>
                  <h4>From URL</h4>
                  <input type="text" placeholder="https://..." className={styles.urlInput} />
                </div>
              </div>
              <div className={styles.recentCapsules}>
                <h4>Recent Imports</h4>
                <div className={styles.capsuleList}>
                  <div className={styles.capsuleItem}>
                    <span className={styles.capsuleIcon}>💊</span>
                    <div className={styles.capsuleInfo}>
                      <div className={styles.capsuleName}>chat-realtime@1.0.0</div>
                      <div className={styles.capsuleAuthor}>by oursynth-team</div>
                    </div>
                    <button className={styles.capsuleAction}>Import</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 6: // Execute
        return (
          <div className={styles.stepContent}>
            <h3>Execute Capsule</h3>
            <div className={styles.executePanel}>
              <div className={styles.selectedCapsule}>
                <h4>Selected Capsule</h4>
                <div className={styles.capsuleDetails}>
                  <div className={styles.capsuleHeader}>
                    <span className={styles.capsuleIcon}>💊</span>
                    <div>
                      <div className={styles.capsuleName}>{capsuleName || 'my-capsule'}@1.0.0</div>
                      <div className={styles.capsuleStatus}>✓ Verified and ready</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.executionConfig}>
                <h4>Execution Configuration</h4>
                <div className={styles.configGrid}>
                  <div className={styles.configItem}>
                    <label htmlFor="environment-select">Environment:</label>
                    <select id="environment-select" className={styles.configSelect} aria-label="Select environment">
                      <option>Production</option>
                      <option>Development</option>
                      <option>Staging</option>
                    </select>
                  </div>
                  <div className={styles.configItem}>
                    <label htmlFor="resources-select">Resources:</label>
                    <select id="resources-select" className={styles.configSelect} aria-label="Select resource configuration">
                      <option>Standard</option>
                      <option>High Memory</option>
                      <option>GPU Accelerated</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className={styles.provenanceConfig}>
                <h4>Provenance Settings</h4>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked />
                    <span>Full execution logging</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked />
                    <span>Artifact storage</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" />
                    <span>Real-time monitoring</span>
                  </label>
                </div>
              </div>
              <button className={styles.executeButton}>
                ⚡ Execute Capsule
              </button>
            </div>
          </div>
        );

      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <a href="/shell" className={styles.logoLink}>
            <span className={styles.logoIcon}>OS</span>
            OurSynth
          </a>
        </div>
        <div className={styles.tagline}>Universal Knowledge Compiler</div>
        
        <nav>
          <a href="/shell" className={styles.navItem}>
            <span>📊</span>
            Dashboard
          </a>
          <div className={styles.navItem}>
            <span>📝</span>
            Notes
          </div>
          <div className={styles.navItem}>
            <span>📓</span>
            Notebooks
          </div>
          <a href="/shell/studio" className={styles.navItem}>
            <span>🎨</span>
            Studio
            <span className={styles.aiTag}>AI</span>
          </a>
          <div className={styles.navItem}>
            <span>🌀</span>
            Aether
          </div>
          <div className={`${styles.navItem} ${styles.navItemActive}`}>
            <span>💊</span>
            Capsules
            <span className={styles.marketplaceTag}>$</span>
          </div>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.breadcrumb}>
          <span>💊 Capsules</span>
          <span className={styles.cloudBadge}>Powered by Google Cloud AI</span>
        </div>
        
        <div className={styles.header}>
          <h1 className={styles.title}>Capsules Lifecycle</h1>
          <p className={styles.description}>
            Create, validate, pack, sign, and execute portable workflow capsules with full provenance tracking.
          </p>
        </div>

        <div className={styles.lifecycleContainer}>
          {/* Step Progress */}
          <div className={styles.stepProgress}>
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`${styles.stepItem} ${index <= activeStep ? styles.stepCompleted : ''} ${index === activeStep ? styles.stepActive : ''}`}
                onClick={() => setActiveStep(index)}
              >
                <div className={styles.stepIcon}>{step.icon}</div>
                <div className={styles.stepInfo}>
                  <div className={styles.stepName}>{step.name}</div>
                  <div className={styles.stepDescription}>{step.description}</div>
                </div>
                {index < steps.length - 1 && <div className={styles.stepConnector}></div>}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className={styles.stepPanel}>
            {renderStepContent()}
            
            {/* Navigation */}
            <div className={styles.stepNavigation}>
              <button 
                className={styles.navButton}
                onClick={handlePreviousStep}
                disabled={activeStep === 0}
              >
                ← Previous
              </button>
              <span className={styles.stepCounter}>
                Step {activeStep + 1} of {steps.length}
              </span>
              <button 
                className={styles.navButton}
                onClick={handleNextStep}
                disabled={activeStep === steps.length - 1}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}