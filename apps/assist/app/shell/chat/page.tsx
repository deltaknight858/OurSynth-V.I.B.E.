'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './Chat.module.css';

interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  actions?: Array<{
    id: string;
    type: 'workflow' | 'capsule' | 'studio' | 'aether';
    title: string;
    description: string;
  }>;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'agent',
      content: 'Hello! I\'m your AI assistant powered by Google Cloud\'s Vertex AI. I can help you create workflows, generate capsules, design in Studio, or suggest Aether integrations. What would you like to work on today?',
      timestamp: new Date('2025-09-20T17:23:25.000Z'),
      actions: [
        {
          id: 'create-capsule',
          type: 'capsule',
          title: 'Create Capsule',
          description: 'Start the capsule lifecycle workflow'
        },
        {
          id: 'open-studio',
          type: 'studio',
          title: 'Open Studio',
          description: 'Design workflows with V.I.B.E'
        }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [contextActions, setContextActions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAgentResponse = async (userMessage: string): Promise<ChatMessage> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Generate contextual response based on keywords
    let response = '';
    let actions: ChatMessage['actions'] = [];
    
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('capsule') || lowerMessage.includes('workflow')) {
      response = 'I can help you create a capsule workflow! Capsules are portable, signed workflow artifacts with full provenance tracking. Would you like me to guide you through the lifecycle process or suggest a specific workflow type?';
      actions = [
        {
          id: 'start-capsule-flow',
          type: 'capsule',
          title: 'Start Capsule Flow',
          description: 'Begin the Create → Validate → Pack → Sign process'
        },
        {
          id: 'browse-marketplace',
          type: 'capsule',
          title: 'Browse Marketplace',
          description: 'Explore existing capsules for inspiration'
        }
      ];
    } else if (lowerMessage.includes('studio') || lowerMessage.includes('design') || lowerMessage.includes('vibe')) {
      response = 'Studio V.I.B.E is perfect for visual workflow design! I can help you create interactive experiences with our component palette. The Visual Interface Builder Experience lets you drag, drop, and connect workflow elements seamlessly.';
      actions = [
        {
          id: 'open-vibe',
          type: 'studio',
          title: 'Open V.I.B.E',
          description: 'Launch the Visual Interface Builder'
        },
        {
          id: 'view-components',
          type: 'studio',
          title: 'View Components',
          description: 'Explore available UI components'
        }
      ];
    } else if (lowerMessage.includes('aether') || lowerMessage.includes('graph') || lowerMessage.includes('workflow')) {
      response = 'Aether is our advanced workflow orchestration system! I can create pre-scaffolded graphs based on your requirements, suggest optimal workflow patterns, and help you integrate with Google Cloud services.';
      actions = [
        {
          id: 'suggest-aether',
          type: 'aether',
          title: 'Suggest Workflow',
          description: 'Generate a workflow recommendation'
        },
        {
          id: 'open-aether',
          type: 'aether',
          title: 'Open Aether',
          description: 'Launch the workflow orchestration interface'
        }
      ];
    } else if (lowerMessage.includes('help') || lowerMessage.includes('what') || lowerMessage.includes('how')) {
      response = 'I\'m here to assist with all aspects of the OurSynth platform! I can help you:\n\n• Create and manage capsule workflows\n• Design interfaces in Studio V.I.B.E\n• Set up Aether workflow orchestration\n• Navigate the knowledge compilation process\n• Integrate with Google Cloud AI services\n\nWhat specific area interests you most?';
      actions = [
        {
          id: 'show-capabilities',
          type: 'workflow',
          title: 'Show All Features',
          description: 'Overview of platform capabilities'
        }
      ];
    } else {
      response = `I understand you're asking about "${userMessage}". Let me help you with that using our Google Cloud-powered AI capabilities. Would you like me to create a workflow, suggest next steps, or connect this to one of our tools?`;
      actions = [
        {
          id: 'create-workflow',
          type: 'workflow',
          title: 'Create Workflow',
          description: 'Turn this into an actionable workflow'
        },
        {
          id: 'suggest-tools',
          type: 'workflow',
          title: 'Suggest Tools',
          description: 'Recommend relevant platform features'
        }
      ];
    }
    
    return {
      id: Date.now().toString(),
      role: 'agent',
      content: response,
      timestamp: new Date(),
      actions
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Store context for provenance
    setContextActions(prev => [...prev, `user_message:${userMessage.content}`]);
    
    try {
      const agentResponse = await simulateAgentResponse(userMessage.content);
      setMessages(prev => [...prev, agentResponse]);
      
      // Store agent response context
      setContextActions(prev => [...prev, `agent_response:${agentResponse.content}`]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'agent',
        content: 'Sorry, I encountered an issue processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: NonNullable<ChatMessage['actions']>[0]) => {
    // Store action context for provenance
    setContextActions(prev => [...prev, `action_triggered:${action.type}:${action.title}`]);
    
    // Navigate based on action type
    switch (action.type) {
      case 'capsule':
        if (action.id === 'start-capsule-flow' || action.id === 'create-capsule') {
          window.location.href = '/shell/capsules';
        }
        break;
      case 'studio':
        if (action.id === 'open-vibe' || action.id === 'open-studio') {
          window.location.href = '/shell/studio?feature=vibe';
        } else {
          window.location.href = '/shell/studio';
        }
        break;
      case 'aether':
        // For now, show a coming soon message
        const comingSoonMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'agent',
          content: 'Aether workflow orchestration is coming soon! For now, you can explore Studio V.I.B.E for visual workflow design or create capsules for portable workflow packaging.',
          timestamp: new Date(),
          actions: [
            {
              id: 'try-studio',
              type: 'studio',
              title: 'Try Studio Instead',
              description: 'Explore visual workflow design'
            },
            {
              id: 'try-capsules',
              type: 'capsule', 
              title: 'Try Capsules Instead',
              description: 'Create portable workflows'
            }
          ]
        };
        setMessages(prev => [...prev, comingSoonMessage]);
        break;
      default:
        // Generic workflow action
        const workflowMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'agent',
          content: `I've noted your interest in "${action.title}". Let me help you get started with the most relevant tools for your workflow.`,
          timestamp: new Date(),
          actions: [
            {
              id: 'explore-capsules',
              type: 'capsule',
              title: 'Explore Capsules',
              description: 'Create portable workflow packages'
            },
            {
              id: 'explore-studio',
              type: 'studio',
              title: 'Explore Studio',
              description: 'Design visual workflows'
            }
          ]
        };
        setMessages(prev => [...prev, workflowMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
          <a href="/shell/capsules" className={styles.navItem}>
            <span>💊</span>
            Capsules
            <span className={styles.marketplaceTag}>$</span>
          </a>
          <div className={`${styles.navItem} ${styles.navItemActive}`}>
            <span>💬</span>
            Chat
            <span className={styles.aiTag}>AI</span>
          </div>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.breadcrumb}>
          <span>💬 Chat</span>
          <span className={styles.cloudBadge}>Powered by Google Cloud AI</span>
        </div>
        
        <div className={styles.chatContainer}>
          {/* Chat Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerInfo}>
              <h1 className={styles.title}>AI Assistant Chat</h1>
              <p className={styles.description}>
                Conversational interface powered by Google Cloud Vertex AI with contextual workflow integration
              </p>
            </div>
            <div className={styles.statusIndicator}>
              <div className={styles.statusDot}></div>
              <span>Online</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className={styles.messagesContainer}>
            <div className={styles.messagesList}>
              {messages.map((message) => (
                <div key={message.id} className={`${styles.messageItem} ${styles[`message${message.role === 'user' ? 'User' : 'Agent'}`]}`}>
                  <div className={styles.messageAvatar}>
                    {message.role === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className={styles.messageContent}>
                    <div className={styles.messageHeader}>
                      <span className={styles.messageAuthor}>
                        {message.role === 'user' ? 'You' : 'AI Assistant'}
                      </span>
                      <span className={styles.messageTime}>
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className={styles.messageText}>
                      {message.content}
                    </div>
                    {message.actions && message.actions.length > 0 && (
                      <div className={styles.messageActions}>
                        <div className={styles.actionsLabel}>Suggested actions:</div>
                        <div className={styles.actionButtons}>
                          {message.actions.map((action) => (
                            <button
                              key={action.id}
                              className={styles.actionButton}
                              onClick={() => handleActionClick(action)}
                              title={action.description}
                            >
                              {action.type === 'capsule' && '💊'}
                              {action.type === 'studio' && '🎨'}
                              {action.type === 'aether' && '🌀'}
                              {action.type === 'workflow' && '⚡'}
                              {action.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className={`${styles.messageItem} ${styles.messageAgent}`}>
                  <div className={styles.messageAvatar}>🤖</div>
                  <div className={styles.messageContent}>
                    <div className={styles.messageHeader}>
                      <span className={styles.messageAuthor}>AI Assistant</span>
                    </div>
                    <div className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className={styles.inputContainer}>
            <div className={styles.inputWrapper}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about workflows, capsules, Studio V.I.B.E, or anything else..."
                className={styles.messageInput}
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className={styles.sendButton}
                aria-label="Send message"
              >
                {isTyping ? '⏳' : '🚀'}
              </button>
            </div>
            <div className={styles.inputHint}>
              Press Enter to send • Shift+Enter for new line • Context stored for provenance
            </div>
          </div>
        </div>

        {/* Context Panel */}
        {contextActions.length > 0 && (
          <div className={styles.contextPanel}>
            <h3 className={styles.contextTitle}>Session Context</h3>
            <div className={styles.contextList}>
              {contextActions.slice(-5).map((action, index) => (
                <div key={index} className={styles.contextItem}>
                  {action}
                </div>
              ))}
            </div>
            <div className={styles.contextNote}>
              Context stored for provenance tracking and memory agent integration
            </div>
          </div>
        )}
      </div>
    </div>
  );
}