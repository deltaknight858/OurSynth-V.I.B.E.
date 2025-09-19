import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../contexts/WizardContext';

const deploymentOptions = [
  { id: 'vercel', name: 'Vercel', description: 'Fast deployment with edge functions' },
  { id: 'netlify', name: 'Netlify', description: 'JAMstack hosting with serverless functions' },
  { id: 'aws', name: 'AWS', description: 'Scalable cloud infrastructure' },
  { id: 'digital-ocean', name: 'DigitalOcean', description: 'Simple cloud hosting' },
];

const environmentOptions = [
  { id: 'development', name: 'Development', description: 'For testing and development' },
  { id: 'staging', name: 'Staging', description: 'Pre-production environment' },
  { id: 'production', name: 'Production', description: 'Live production environment' },
];

const availableFeatures = [
  'Authentication',
  'Database Integration',
  'API Documentation',
  'Testing Setup',
  'CI/CD Pipeline',
  'Monitoring',
  'Caching',
  'SEO Optimization',
  'Analytics',
  'Email Service',
];

// Smart feature recommendations based on template and deployment
const getRecommendedFeatures = (templateId: string, deploymentId: string) => {
  const essentialFeatures = ['Authentication', 'Database Integration', 'Testing Setup'];
  const productionFeatures = deploymentId === 'aws' || deploymentId === 'vercel' 
    ? ['CI/CD Pipeline', 'Monitoring', 'Caching'] 
    : ['CI/CD Pipeline'];
  
  if (templateId === 'webapp') {
    return [...essentialFeatures, ...productionFeatures, 'SEO Optimization', 'Analytics'];
  } else if (templateId === 'api') {
    return [...essentialFeatures, ...productionFeatures, 'API Documentation'];
  } else if (templateId === 'ecommerce') {
    return [...essentialFeatures, ...productionFeatures, 'Email Service', 'Analytics', 'SEO Optimization'];
  }
  return essentialFeatures;
};

const featureInfo = {
  'Authentication': {
    title: 'User Authentication',
    description: 'Secure user login/signup with JWT tokens, OAuth providers (Google, GitHub), password reset, and role-based access control.',
    benefits: ['Secure user management', 'Social login options', 'Protected routes', 'Session management'],
    setup: 'Includes NextAuth.js, secure password hashing, and database user schemas.'
  },
  'Database Integration': {
    title: 'Database Integration',
    description: 'Full database setup with PostgreSQL/MongoDB, migrations, ORM/ODM integration, and connection pooling.',
    benefits: ['Scalable data storage', 'Automatic migrations', 'Type-safe queries', 'Backup strategies'],
    setup: 'Includes Prisma/Mongoose setup, database schemas, and connection management.'
  },
  'API Documentation': {
    title: 'API Documentation',
    description: 'Interactive API documentation with Swagger/OpenAPI, automated endpoint discovery, and testing interface.',
    benefits: ['Self-documenting APIs', 'Interactive testing', 'Team collaboration', 'Client integration'],
    setup: 'Auto-generated docs with Swagger UI, request/response examples, and authentication flows.'
  },
  'Testing Setup': {
    title: 'Testing Framework',
    description: 'Comprehensive testing suite with Jest, React Testing Library, E2E tests with Playwright, and coverage reports.',
    benefits: ['Code reliability', 'Automated testing', 'Bug prevention', 'Quality assurance'],
    setup: 'Unit tests, integration tests, E2E tests, and CI/CD integration for automated testing.'
  },
  'CI/CD Pipeline': {
    title: 'CI/CD Pipeline',
    description: 'Automated deployment pipeline with GitHub Actions, testing automation, code quality checks, and deployment strategies.',
    benefits: ['Automated deployments', 'Quality gates', 'Rollback capabilities', 'Team efficiency'],
    setup: 'GitHub Actions workflows, environment management, and automated quality checks.'
  },
  'Monitoring': {
    title: 'Application Monitoring',
    description: 'Real-time monitoring with error tracking (Sentry), performance monitoring, health checks, and alerting systems.',
    benefits: ['Error tracking', 'Performance insights', 'Uptime monitoring', 'User experience tracking'],
    setup: 'Sentry integration, custom dashboards, alert configurations, and performance metrics.'
  },
  'Caching': {
    title: 'Caching Strategy',
    description: 'Multi-layer caching with Redis, CDN integration, API response caching, and cache invalidation strategies.',
    benefits: ['Improved performance', 'Reduced server load', 'Better user experience', 'Cost optimization'],
    setup: 'Redis setup, cache middleware, CDN configuration, and intelligent cache invalidation.'
  },
  'SEO Optimization': {
    title: 'SEO Optimization',
    description: 'Complete SEO setup with meta tags, sitemap generation, structured data, social media cards, and Core Web Vitals optimization.',
    benefits: ['Better search rankings', 'Increased organic traffic', 'Social media preview', 'Performance optimization'],
    setup: 'Next.js SEO optimization, automatic sitemap generation, and social media meta tags.'
  },
  'Analytics': {
    title: 'Analytics Integration',
    description: 'Comprehensive analytics with Google Analytics 4, custom event tracking, user behavior analysis, and conversion tracking.',
    benefits: ['User insights', 'Behavior tracking', 'Conversion analysis', 'Data-driven decisions'],
    setup: 'GA4 setup, custom event tracking, privacy-compliant analytics, and dashboard integration.'
  },
  'Email Service': {
    title: 'Email Service',
    description: 'Complete email solution with transactional emails, templates, delivery tracking, and email automation workflows.',
    benefits: ['Transactional emails', 'Email templates', 'Delivery tracking', 'Automated workflows'],
    setup: 'SendGrid/Mailgun integration, email templates, delivery analytics, and automation rules.'
  }
};

export default function ConfigForm() {
  const { state, updateConfig, nextStep, prevStep } = useWizard();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFeatureInfo, setSelectedFeatureInfo] = useState<string | null>(null);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const recommendedFeatures = getRecommendedFeatures(
    state.selectedTemplate?.id || 'webapp', 
    state.config.deployment
  );

  const handleInputChange = (field: string, value: string | string[]) => {
    updateConfig({ [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const applyRecommendedFeatures = () => {
    handleInputChange('features', recommendedFeatures);
  };

  const skipOptionalFeatures = () => {
    const essentialOnly = ['Authentication', 'Database Integration', 'Testing Setup'];
    handleInputChange('features', essentialOnly);
  };

  const toggleFeature = (feature: string) => {
    const currentFeatures = state.config.features;
    const newFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];
    handleInputChange('features', newFeatures);
  };

  const showFeatureInfo = (feature: string) => {
    setSelectedFeatureInfo(feature);
  };

  const closeFeatureInfo = () => {
    setSelectedFeatureInfo(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!state.config.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }

    if (!state.config.description.trim()) {
      newErrors.description = 'Project description is required';
    }

    if (!state.config.deployment) {
      newErrors.deployment = 'Please select a deployment option';
    }

    if (state.config.features.length === 0) {
      newErrors.features = 'Please select at least one feature';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      nextStep();
    }
  };

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
          Let&apos;s configure your{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {state.selectedTemplate?.name}
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-white/80 text-xl max-w-3xl mx-auto leading-relaxed"
        >
          Fine-tune every detail to match your vision. We&apos;ll set up everything 
          exactly how you need it.
        </motion.p>
      </div>

      <div className="glass-card p-8 space-y-8">
        {/* Project Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-lime-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
              1
            </span>
            Project Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Project Name *
              </label>
              <div className="electric-input">
                <input
                  type="text"
                  value={state.config.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  placeholder="My Awesome Project"
                  className={`
                    w-full px-4 py-3 rounded-xl bg-white/10 border transition-all duration-300
                    text-white placeholder-white/50 focus:outline-none 
                    focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    hover:bg-white/15 hover:border-indigo-400/50
                    ${errors.projectName 
                      ? 'border-red-400 focus:ring-red-400' 
                      : 'border-white/20'
                    }
                  `}
                />
              </div>
              {errors.projectName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.projectName}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Environment
              </label>
              <select
                value={state.config.environment}
                onChange={(e) => handleInputChange('environment', e.target.value)}
                title="Select Environment"
                aria-label="Select Environment"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400"
              >
                {environmentOptions.map(option => (
                  <option key={option.id} value={option.id} className="bg-gray-800">
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Project Description *
            </label>
            <div className="electric-input">
              <textarea
                value={state.config.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what your project will do..."
                rows={4}
                className={`
                  w-full px-4 py-3 rounded-xl bg-white/10 border transition-all duration-300
                  text-white placeholder-white/50 focus:outline-none focus:ring-2 resize-none
                  ${errors.description 
                    ? 'border-red-400 focus:ring-red-400' 
                    : 'border-white/20 focus:border-lime-400 focus:ring-lime-400/50'
                  }
                `}
              />
            </div>
            {errors.description && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-1"
              >
                {errors.description}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Deployment Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-lime-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
              2
            </span>
            Deployment Platform *
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deploymentOptions.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleInputChange('deployment', option.id)}
                className={`
                  p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                  ${state.config.deployment === option.id
                    ? 'border-lime-400 bg-lime-400/10 shadow-lg'
                    : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{option.name}</h4>
                  {state.config.deployment === option.id && (
                    <div className="w-5 h-5 bg-lime-400 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-white/70 text-sm">{option.description}</p>
              </motion.div>
            ))}
          </div>
          {errors.deployment && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm"
            >
              {errors.deployment}
            </motion.p>
          )}
        </motion.div>

        {/* Features Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-lime-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                3
              </span>
              Additional Features
            </h3>
            <div className="flex space-x-2">
              <motion.button
                onClick={applyRecommendedFeatures}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
              >
                ✨ Smart Recommendations
              </motion.button>
              <motion.button
                onClick={skipOptionalFeatures}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white/10 text-white/70 border border-white/20 rounded-lg text-sm font-medium hover:bg-white/20 transition-all duration-300"
              >
                Skip Optional
              </motion.button>
            </div>
          </div>

          {/* Recommended Features Notice */}
          {state.config.deployment && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-indigo-500/20 border border-indigo-400/30 rounded-xl p-4"
            >
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-indigo-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="text-white font-medium mb-1">Recommended for {state.selectedTemplate?.name} on {state.config.deployment}</h4>
                  <p className="text-white/70 text-sm">
                    Based on your choices, we recommend: {recommendedFeatures.join(', ')}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {(showAllFeatures ? availableFeatures : availableFeatures).map((feature) => {
              const isRecommended = recommendedFeatures.includes(feature);
              return (
                <motion.div
                  key={feature}
                  className="relative group"
                >
                  {isRecommended && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center z-10">
                      <svg className="w-2.5 h-2.5 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <motion.button
                    onClick={() => toggleFeature(feature)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      w-full p-3 rounded-xl text-sm font-medium transition-all duration-300 relative
                      ${state.config.features.includes(feature)
                        ? 'bg-gradient-to-r from-lime-400 to-purple-500 text-white shadow-lg'
                        : isRecommended
                        ? 'bg-yellow-400/20 text-yellow-100 border border-yellow-400/40 hover:bg-yellow-400/30'
                        : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                      }
                    `}
                  >
                    {feature}
                  </motion.button>
                  
                  {/* Info Button */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      showFeatureInfo(feature);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={`Learn more about ${feature}`}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 hover:bg-indigo-400 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
          {errors.features && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm"
            >
              {errors.features}
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex justify-between items-center mt-8"
      >
        <motion.button
          onClick={prevStep}
          className="px-6 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                     hover:bg-white/20 hover:scale-105 hover:shadow-xl 
                     focus:outline-none focus:ring-4 focus:ring-indigo-300
                     transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back
        </motion.button>

        <div className="flex items-center space-x-4">
          <motion.button
            onClick={handleContinue}
            className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300
                       bg-gradient-to-r from-indigo-500 to-purple-500 text-white 
                       hover:from-indigo-600 hover:to-purple-600 hover:shadow-xl hover:scale-105 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Review Configuration →
          </motion.button>
        </div>
      </motion.div>

      {/* Feature Info Popup */}
      <AnimatePresence>
        {selectedFeatureInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={closeFeatureInfo}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {featureInfo[selectedFeatureInfo as keyof typeof featureInfo]?.title}
                  </h3>
                </div>
                <button
                  onClick={closeFeatureInfo}
                  aria-label="Close feature information"
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <p className="text-white/80 text-lg leading-relaxed">
                  {featureInfo[selectedFeatureInfo as keyof typeof featureInfo]?.description}
                </p>

                {/* Benefits */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-lime-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Key Benefits
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {featureInfo[selectedFeatureInfo as keyof typeof featureInfo]?.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-lime-400 rounded-full"></div>
                        <span className="text-white/70 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Setup Info */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    What&apos;s Included
                  </h4>
                  <p className="text-white/70 text-sm leading-relaxed bg-white/5 rounded-xl p-4 border border-white/10">
                    {featureInfo[selectedFeatureInfo as keyof typeof featureInfo]?.setup}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-white/10">
                <div className="flex items-center space-x-2 text-white/50 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Click the feature button to add/remove from your project</span>
                </div>
                <motion.button
                  onClick={() => {
                    toggleFeature(selectedFeatureInfo);
                    closeFeatureInfo();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    state.config.features.includes(selectedFeatureInfo)
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gradient-to-r from-lime-400 to-purple-500 hover:from-lime-500 hover:to-purple-600 text-white'
                  }`}
                >
                  {state.config.features.includes(selectedFeatureInfo) ? 'Remove Feature' : 'Add Feature'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
