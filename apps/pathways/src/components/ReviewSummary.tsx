import React from 'react';
import { motion } from 'framer-motion';
import { useWizard } from '../contexts/WizardContext';
import NextArrowButton from './NextArrowButton';

export default function ReviewSummary() {
  const { state, nextStep, prevStep } = useWizard();
  const { selectedTemplate, config } = state;

  const deploymentName = {
    'vercel': 'Vercel',
    'netlify': 'Netlify', 
    'aws': 'AWS',
    'digital-ocean': 'DigitalOcean'
  }[config.deployment as keyof typeof deploymentName] || config.deployment;

  const sections = [
    {
      title: 'Template',
      icon: '🎯',
      items: [
        { label: 'Template Type', value: selectedTemplate?.name },
        { label: 'Category', value: selectedTemplate?.category },
        { label: 'Description', value: selectedTemplate?.description },
      ]
    },
    {
      title: 'Project Details',
      icon: '📋',
      items: [
        { label: 'Project Name', value: config.projectName },
        { label: 'Description', value: config.description },
        { label: 'Environment', value: config.environment.charAt(0).toUpperCase() + config.environment.slice(1) },
      ]
    },
    {
      title: 'Deployment',
      icon: '🚀',
      items: [
        { label: 'Platform', value: deploymentName },
        { label: 'Features Count', value: `${config.features.length} selected` },
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto px-4"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold leading-tight mb-8 text-white drop-shadow-lg"
        >
          Everything looks{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            perfect!
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-white/80 text-xl max-w-3xl mx-auto leading-relaxed"
        >
          Take a moment to review your configuration. Ready to bring your vision to life?
        </motion.p>
      </div>

      <div className="space-y-6">
        {/* Configuration Sections */}
        {sections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + sectionIndex * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">{section.icon}</span>
              <h3 className="text-xl font-semibold text-white">{section.title}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.items.map((item, itemIndex) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + sectionIndex * 0.1 + itemIndex * 0.05 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="text-white/60 text-sm font-medium mb-1">{item.label}</div>
                  <div className="text-white font-medium">{item.value}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Template Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-6"
        >
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">⚡</span>
            <h3 className="text-xl font-semibold text-white">Template Features</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {selectedTemplate?.features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.05 }}
                className="bg-gradient-to-r from-lime-400/20 to-purple-500/20 rounded-lg p-3 text-center border border-lime-400/30"
              >
                <div className="text-white font-medium text-sm">{feature}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Selected Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-card p-6"
        >
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">🎁</span>
            <h3 className="text-xl font-semibold text-white">Additional Features</h3>
          </div>
          
          {config.features.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {config.features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.03 }}
                  className="bg-gradient-to-r from-purple-500/20 to-lime-400/20 rounded-lg p-3 text-center border border-purple-400/30"
                >
                  <div className="text-white font-medium text-sm">{feature}</div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-white/60 text-center py-4">
              No additional features selected
            </div>
          )}
        </motion.div>

        {/* Project Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass-card p-8 bg-gradient-to-br from-lime-400/10 to-purple-500/10 border-2 border-lime-400/30"
        >
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-2">Ready to Create</h3>
            <p className="text-white/70 text-lg mb-6">
              Your <strong className="text-lime-300">{config.projectName}</strong> project will be created with{' '}
              <strong className="text-purple-300">{selectedTemplate?.name}</strong> template and deployed to{' '}
              <strong className="text-lime-300">{deploymentName}</strong>
            </p>
            
            <div className="flex justify-center items-center space-x-8 text-white/80">
              <div className="text-center">
                <div className="text-2xl font-bold text-lime-400">{selectedTemplate?.features.length || 0}</div>
                <div className="text-sm">Base Features</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{config.features.length}</div>
                <div className="text-sm">Add-on Features</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-lime-400">1</div>
                <div className="text-sm">Deployment Target</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="flex justify-between mt-8"
      >
        <motion.button
          onClick={prevStep}
          className="px-6 py-3 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back to Configuration
        </motion.button>

        <NextArrowButton 
          onClick={nextStep}
          text="Create Project"
          className="electric-button px-8 py-3 rounded-xl font-semibold text-lg"
        />
      </motion.div>
    </motion.div>
  );
}
