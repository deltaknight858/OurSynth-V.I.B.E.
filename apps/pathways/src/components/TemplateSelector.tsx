import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWizard, Template } from '../contexts/WizardContext';

const templates: Template[] = [
  {
    id: 'webapp',
    name: 'Web Application',
    description: 'Full-stack web application with modern frameworks',
    category: 'Web',
    features: ['React/Next.js', 'TypeScript', 'Database', 'Authentication'],
    thumbnail: '🌐',
  },
  {
    id: 'mobile',
    name: 'Mobile App',
    description: 'Cross-platform mobile application',
    category: 'Mobile',
    features: ['React Native', 'Push Notifications', 'Offline Support', 'App Store Ready'],
    thumbnail: '📱',
  },
  {
    id: 'api',
    name: 'REST API',
    description: 'Scalable backend API with documentation',
    category: 'Backend',
    features: ['Node.js/Express', 'OpenAPI', 'Database ORM', 'Rate Limiting'],
    thumbnail: '🔌',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Site',
    description: 'Complete online store with payment processing',
    category: 'E-commerce',
    features: ['Shopping Cart', 'Payment Gateway', 'Inventory Management', 'Admin Panel'],
    thumbnail: '🛒',
  },
  {
    id: 'dashboard',
    name: 'Analytics Dashboard',
    description: 'Data visualization and reporting dashboard',
    category: 'Analytics',
    features: ['Charts & Graphs', 'Real-time Data', 'Export Reports', 'User Management'],
    thumbnail: '📊',
  },
  {
    id: 'blog',
    name: 'Blog Platform',
    description: 'Content management system for blogging',
    category: 'Content',
    features: ['Markdown Editor', 'SEO Optimized', 'Comments System', 'Multi-author'],
    thumbnail: '✍️',
  },
];

const categories = ['All', 'Web', 'Mobile', 'Backend', 'E-commerce', 'Analytics', 'Content'];

export default function TemplateSelector() {
  const { state, selectTemplate, nextStep } = useWizard();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const handleTemplateSelect = (template: Template) => {
    selectTemplate(template);
  };

  const handleContinue = () => {
    if (state.selectedTemplate) {
      nextStep();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto px-4"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold leading-tight mb-8 text-white drop-shadow-lg"
        >
          What would you like to{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            create today?
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-white/80 text-xl max-w-3xl mx-auto leading-relaxed"
        >
          Choose from our collection of professionally crafted templates. 
          Each one comes packed with modern features and industry best practices.
        </motion.p>
      </div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-2 mb-8"
      >
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${selectedCategory === category
                ? 'bg-gradient-to-r from-lime-400 to-purple-500 text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>

      {/* Templates Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredTemplate(template.id)}
              onHoverEnd={() => setHoveredTemplate(null)}
              onClick={() => handleTemplateSelect(template)}
              className={`
                glass-card cursor-pointer group relative overflow-hidden
                transition-all duration-300 transform
                hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300
                ${state.selectedTemplate?.id === template.id 
                  ? 'ring-2 ring-indigo-400 shadow-xl shadow-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/10' 
                  : 'hover:shadow-xl hover:shadow-purple-500/25 hover:ring-2 hover:ring-purple-400/50'
                }
              `}
            >
              {/* Selected Indicator */}
              {state.selectedTemplate?.id === template.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center z-10 shadow-lg"
                >
                  <motion.svg 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-5 h-5 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </motion.svg>
                </motion.div>
              )}

              {/* Thumbnail */}
              <div className="text-center mb-4">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ 
                    rotate: hoveredTemplate === template.id ? [0, -10, 10, 0] : 0,
                    scale: hoveredTemplate === template.id ? 1.1 : 1 
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {template.thumbnail}
                </motion.div>
                <span className={`
                  inline-block px-3 py-1 rounded-full text-xs font-medium
                  ${selectedCategory === template.category || selectedCategory === 'All'
                    ? 'bg-purple-500/30 text-purple-200 border border-purple-400/50'
                    : 'bg-white/10 text-white/60'
                  }
                `}>
                  {template.category}
                </span>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-lime-300 transition-colors">
                  {template.name}
                </h3>
                <p className="text-white/70 text-sm mb-4 leading-relaxed">
                  {template.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  {template.features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + idx * 0.05 }}
                      className="flex items-center justify-center text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-lime-400 rounded-full mr-2" />
                      <span className="text-white/80">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Hover Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col items-center space-y-6"
      >
        {state.selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 text-center max-w-md mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2">Perfect Choice!</h3>
            <p className="text-white/80">
              <span className="text-indigo-400 font-semibold">
                {state.selectedTemplate.name}
              </span>{' '}
              selected. Ready to configure your project?
            </p>
          </motion.div>
        )}
        
        <div className="flex items-center space-x-6">
          <motion.button
            onClick={handleContinue}
            disabled={!state.selectedTemplate}
            className={`
              px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300
              ${state.selectedTemplate
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 hover:shadow-xl hover:scale-105 cursor-pointer'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
              }
            `}
            whileHover={state.selectedTemplate ? { scale: 1.05 } : {}}
            whileTap={state.selectedTemplate ? { scale: 0.95 } : {}}
          >
            {state.selectedTemplate ? 'Continue to Configuration →' : 'Select a Template First'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
