"use client";
import { useState, useEffect } from 'react';
import styles from './InteractiveDemo.module.css';

export default function InteractiveDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      id: 0,
      title: "Universal Knowledge Compiler",
      subtitle: "Transform any file into structured, monetizable knowledge",
      content: "Welcome to OurSynth. Let's take something messy and turn it into structured, monetizable knowledge in seconds.",
      visual: "🏠",
      duration: 5
    },
    {
      id: 1,
      title: "Step 1: Upload",
      subtitle: "Any format, anywhere",
      content: "Drag a PDF scan or image into the Studio. This could be a research paper, a contract, or even a handwritten note. OurSynth ingests any format.",
      visual: "📄",
      formats: ["PDF", "PNG", "DOCX", "JPG", "Handwritten"],
      duration: 5
    },
    {
      id: 2,
      title: "Step 2: Compile",
      subtitle: "AI-powered processing pipeline",
      content: "Behind the scenes, our AI-powered OCR extracts the text, MarkItDown structures it into clean Markdown, and OurSynth enriches it with semantic tags and embeddings.",
      visual: "⚡",
      pipeline: [
        { name: "OCR Extract", tech: "Document AI", progress: 100 },
        { name: "Structure", tech: "Cloud Functions", progress: 100 },
        { name: "Enrich", tech: "Vertex AI", progress: 100 },
        { name: "Store", tech: "BigQuery", progress: 100 }
      ],
      duration: 10
    },
    {
      id: 3,
      title: "Step 3: Output",
      subtitle: "Queryable, persistent, deployable",
      content: "Now it's queryable, persistent, and ready to be deployed or shared.",
      visual: "🧠",
      capsule: {
        title: "Research Paper Analysis",
        tags: ["AI", "Machine Learning", "Neural Networks"],
        confidence: 95,
        words: 2847,
        concepts: 23
      },
      duration: 5
    },
    {
      id: 4,
      title: "Step 4: Monetize",
      subtitle: "Revenue-generating digital assets",
      content: "With one click, this Capsule becomes a revenue-generating digital asset — knowledge you can sell, share, or scale.",
      visual: "💰",
      marketplace: {
        price: "$29.99",
        revenue: "$150/month",
        audience: "2.3K researchers"
      },
      duration: 5
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setCurrentStep(curr => curr + 1);
            return 0;
          }
          return prev + (100 / (steps[currentStep].duration * 10));
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentStep, steps]);

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setProgress(0);
    setIsAutoPlaying(false);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
    if (!isAutoPlaying) {
      setProgress(0);
    }
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setProgress(0);
    setIsAutoPlaying(false);
  };

  const currentStepData = steps[currentStep];

  return (
    <div className={styles.demo}>
      <div className={styles.header}>
        <h2>See OurSynth in Action</h2>
        <div className={styles.controls}>
          <button 
            className={styles.playButton}
            onClick={toggleAutoPlay}
          >
            {isAutoPlaying ? '⏸️ Pause' : '▶️ Play Demo'}
          </button>
          <button 
            className={styles.resetButton}
            onClick={resetDemo}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      <div className={styles.timeline}>
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`${styles.timelineStep} ${
              currentStep === index ? styles.active : ''
            } ${currentStep > index ? styles.completed : ''}`}
            onClick={() => handleStepClick(index)}
          >
            <div className={styles.stepNumber}>{index + 1}</div>
            <div className={styles.stepTitle}>{step.title.replace(/^Step \d+: /, '')}</div>
          </div>
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.visual}>
          <div className={styles.visualIcon}>{currentStepData.visual}</div>
          
          {currentStep === 1 && (
            <div className={styles.uploadDemo}>
              <div className={styles.dragZone}>
                <div className={styles.uploadIcon}>📄</div>
                <div className={styles.uploadText}>Drop files here</div>
              </div>
              <div className={styles.formats}>
                {currentStepData.formats?.map((format) => (
                  <span key={format} className={styles.formatBadge}>{format}</span>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className={styles.pipelineDemo}>
              {currentStepData.pipeline?.map((stage, index) => (
                <div key={stage.name} className={styles.pipelineStage}>
                  <div className={styles.stageName}>{stage.name}</div>
                  <div className={styles.stageTech}>{stage.tech}</div>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${stage.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentStep === 3 && currentStepData.capsule && (
            <div className={styles.capsuleDemo}>
              <div className={styles.capsuleHeader}>
                <h4>{currentStepData.capsule.title}</h4>
                <div className={styles.capsuleStats}>
                  <span>✅ {currentStepData.capsule.confidence}% confidence</span>
                  <span>📝 {currentStepData.capsule.words} words</span>
                  <span>🧩 {currentStepData.capsule.concepts} concepts</span>
                </div>
              </div>
              <div className={styles.tags}>
                {currentStepData.capsule.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
              <div className={styles.capsuleActions}>
                <button className={styles.actionBtn}>🔍 Search</button>
                <button className={styles.actionBtn}>💾 Save</button>
                <button className={styles.actionBtn}>🚀 Deploy</button>
              </div>
            </div>
          )}

          {currentStep === 4 && currentStepData.marketplace && (
            <div className={styles.marketplaceDemo}>
              <div className={styles.marketplaceHeader}>
                <h4>Knowledge Marketplace</h4>
                <div className={styles.price}>{currentStepData.marketplace.price}</div>
              </div>
              <div className={styles.marketplaceStats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Projected Revenue</span>
                  <span className={styles.statValue}>{currentStepData.marketplace.revenue}</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Target Audience</span>
                  <span className={styles.statValue}>{currentStepData.marketplace.audience}</span>
                </div>
              </div>
              <button className={styles.listButton}>📈 List on Marketplace</button>
            </div>
          )}
        </div>

        <div className={styles.description}>
          <h3>{currentStepData.title}</h3>
          <p className={styles.subtitle}>{currentStepData.subtitle}</p>
          <p className={styles.content}>{currentStepData.content}</p>
          
          {isAutoPlaying && (
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className={styles.progressText}>
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.cta}>
        <button className={styles.ctaButton}>
          Try OurSynth Free
        </button>
        <p className={styles.ctaText}>
          Start transforming your knowledge today
        </p>
      </div>
    </div>
  );
}