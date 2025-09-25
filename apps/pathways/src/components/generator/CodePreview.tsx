'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Code,
  Visibility,
  Download,
  Save,
  ContentCopy,
  MoreVert,
  PlayArrow,
  Refresh,
  Settings,
  Info,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import * as beautify from 'js-beautify';
import toast from 'react-hot-toast';

interface CodePreviewProps {
  code: string;
  language?: string;
  fileName?: string;
  onSave?: (component: SavedComponent) => void;
}

interface SavedComponent {
  id: string;
  name: string;
  code: string;
  language: string;
  createdAt: string;
  isFavorite?: boolean;
  description?: string;
  tags?: string[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`code-tabpanel-${index}`}
      aria-labelledby={`code-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

const CodePreview: React.FC<CodePreviewProps> = ({
  code,
  language = 'typescript',
  fileName = 'Component.tsx',
  onSave,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [componentName, setComponentName] = useState('');
  const [componentDescription, setComponentDescription] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [formattedCode, setFormattedCode] = useState(code);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [codeStats, setCodeStats] = useState({
    lines: 0,
    characters: 0,
    words: 0,
    functions: 0,
    components: 0,
  });

  // Generate a simple hash for the code to ensure preview updates
  const codeHash = useMemo(() => {
    if (!code) return '';
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      const char = code.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }, [code]);

  // Calculate code statistics and trigger preview update
  useEffect(() => {
    if (code) {
      const lines = code.split('\n').length;
      const characters = code.length;
      const words = code.split(/\s+/).filter(word => word.length > 0).length;
      
      // Simple regex to count functions and components
      const functionMatches = code.match(/function\s+\w+|const\s+\w+\s*=\s*\(/g) || [];
      const componentMatches = code.match(/const\s+[A-Z]\w*\s*[:=]|function\s+[A-Z]\w*/g) || [];
      
      setCodeStats({
        lines,
        characters,
        words,
        functions: functionMatches.length,
        components: componentMatches.length,
      });

      // Format code
      try {
        if (language === 'typescript' || language === 'javascript') {
          const formatted = beautify.js(code, {
            indent_size: 2,
            space_in_empty_paren: true,
            preserve_newlines: true,
          });
          setFormattedCode(formatted);
        } else {
          setFormattedCode(code);
        }
      } catch (error) {
        console.warn('Code formatting failed:', error);
        setFormattedCode(code);
      }

      // Reset preview state when code changes
      setPreviewError(null);
      if (tabValue === 1) { // If preview tab is active
        setIsPreviewLoading(true);
        setTimeout(() => setIsPreviewLoading(false), 1000);
      }
    }
  }, [code, language, tabValue]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(formattedCode);
      toast.success('Code copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy code');
    }
    handleMenuClose();
  };

  const handleDownload = () => {
    const blob = new Blob([formattedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${fileName}`);
    handleMenuClose();
  };

  const handleSaveOpen = () => {
    setSaveDialogOpen(true);
    handleMenuClose();
  };

  const handleSaveClose = () => {
    setSaveDialogOpen(false);
    setComponentName('');
    setComponentDescription('');
    setIsFavorite(false);
  };

  const handleSaveComponent = () => {
    if (!componentName.trim()) {
      toast.error('Please enter a component name');
      return;
    }

    const savedComponent: SavedComponent = {
      id: Date.now().toString(),
      name: componentName.trim(),
      code: formattedCode,
      language,
      createdAt: new Date().toISOString(),
      isFavorite,
      description: componentDescription.trim() || undefined,
      tags: [], // Could be expanded later
    };

    // Save to localStorage
    const savedComponents = JSON.parse(localStorage.getItem('savedComponents') || '[]');
    savedComponents.push(savedComponent);
    localStorage.setItem('savedComponents', JSON.stringify(savedComponents));

    if (onSave) {
      onSave(savedComponent);
    }

    toast.success(`Component "${componentName}" saved!`);
    handleSaveClose();
  };

  const handleFormatCode = () => {
    try {
      if (language === 'typescript' || language === 'javascript') {
        const formatted = beautify.js(code, {
          indent_size: 2,
          space_in_empty_paren: true,
          preserve_newlines: true,
          max_preserve_newlines: 2,
        });
        setFormattedCode(formatted);
        toast.success('Code formatted successfully!');
      } else {
        toast('Code formatting is only available for JavaScript/TypeScript', {
          icon: 'ℹ️',
        });
      }
    } catch (error) {
      toast.error('Failed to format code');
    }
    handleMenuClose();
  };

  // Enhanced dynamic preview renderer that analyzes code structure
  const renderComponentPreview = () => {
    if (!code || (language !== 'typescript' && language !== 'javascript')) {
      return (
        <Alert severity="info">
          <Typography variant="body2">
            Preview is only available for React components (TypeScript/JavaScript)
          </Typography>
        </Alert>
      );
    }

    try {
      // Enhanced component detection
      const hasReactComponent = /(?:const|function)\s+[A-Z]\w*.*(?:React\.FC|FunctionComponent|\(\s*\)\s*=>|\s*=\s*\(\s*\)\s*=>)/.test(code);
      const hasJSXReturn = /return\s*\([\s\S]*</.test(code);
      const hasJSXElements = /<[A-Z]\w*/.test(code);
      
      if (!hasReactComponent && !hasJSXReturn && !hasJSXElements) {
        return (
          <Alert severity="info">
            <Typography variant="body2">
              This code doesn&apos;t appear to be a React component. Preview is only available for React components.
            </Typography>
          </Alert>
        );
      }

      // Extract component name from code
      const componentNameMatch = code.match(/(?:const|function)\s+([A-Z]\w*)/);
      const componentName = componentNameMatch ? componentNameMatch[1] : fileName.replace(/\.[^/.]+$/, "");

      // Analyze code for different UI elements with more sophisticated matching
      const uiElements = {
        buttons: code.match(/Button[^>]*(?:variant=["']([^"']*)|color=["']([^"']*))?[^>]*>/g) || [],
        textFields: code.match(/TextField[^>]*(?:variant=["']([^"']*)|placeholder=["']([^"']*))?[^>]*>/g) || [],
        cards: code.match(/Card[^>]*>/g) || [],
        chips: code.match(/Chip[^>]*(?:label=["']([^"']*)|color=["']([^"']*))?[^>]*>/g) || [],
        typography: code.match(/Typography[^>]*(?:variant=["']([^"']*)|color=["']([^"']*))?[^>]*>([^<]*)</g) || [],
        papers: code.match(/Paper[^>]*>/g) || [],
        boxes: code.match(/Box[^>]*(?:sx=\{[^}]*\})?[^>]*>/g) || [],
        grids: code.match(/Grid[^>]*>/g) || [],
        stacks: code.match(/Stack[^>]*>/g) || [],
        dividers: code.match(/Divider[^>]*>/g) || [],
        icons: code.match(/[A-Z]\w*Icon[^>]*>/g) || [],
        avatars: code.match(/Avatar[^>]*>/g) || [],
        badges: code.match(/Badge[^>]*>/g) || [],
        switches: code.match(/Switch[^>]*>/g) || [],
        sliders: code.match(/Slider[^>]*>/g) || [],
        tabs: code.match(/Tab[^>]*>/g) || [],
        menus: code.match(/Menu[^>]*>/g) || [],
        lists: code.match(/List[^>]*>/g) || [],
        tables: code.match(/Table[^>]*>/g) || [],
        alerts: code.match(/Alert[^>]*>/g) || [],
        progress: code.match(/(?:CircularProgress|LinearProgress)[^>]*>/g) || []
      };

      // Extract text content and styling hints
      const hasGradient = /gradient|linear-gradient|radial-gradient/.test(code);
      const hasShadow = /shadow|boxShadow/.test(code);
      const hasAnimation = /animation|transition|keyframes|transform/.test(code);
      const hasDarkTheme = /dark|night|black/.test(code.toLowerCase());
      const hasLightTheme = /light|bright|white/.test(code.toLowerCase());
      const hasColors = code.match(/color.*?['"`]([^'"`]*)/g) || [];

      // Calculate complexity score
      const complexityScore = Object.values(uiElements).reduce((sum, elements) => sum + elements.length, 0);

      return (
        <Box>
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              ✅ React Component Detected: {componentName}
            </Typography>
            <Typography variant="body2">
              Found {complexityScore} UI elements. Dynamic preview based on code analysis:
            </Typography>
          </Alert>
          
          {/* Dynamic preview representation */}
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 3, 
              bgcolor: hasDarkTheme ? 'grey.900' : 'grey.50',
              color: hasDarkTheme ? 'white' : 'inherit',
              border: '2px solid', 
              borderColor: 'primary.main',
              borderRadius: 3,
              background: hasGradient ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined,
              boxShadow: hasShadow ? 4 : 1,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Chip 
                label={`${componentName} Preview`}
                color="primary" 
                variant="outlined"
                sx={{ mb: 1 }}
              />
              <Typography variant="caption" display="block" color="text.secondary">
                {complexityScore} UI Elements • {codeStats.lines} Lines of Code
              </Typography>
            </Box>

            {/* Dynamic UI representation based on detected elements */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
              
              {/* Typography elements */}
              {uiElements.typography.length > 0 && (
                <Box sx={{ textAlign: 'center', mb: 1 }}>
                  <Typography variant="h5" gutterBottom>
                    {componentName.replace(/([A-Z])/g, ' $1').trim()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dynamic content with {uiElements.typography.length} text element(s)
                  </Typography>
                </Box>
              )}

              {/* Cards layout */}
              {uiElements.cards.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {Array.from({ length: Math.min(uiElements.cards.length, 3) }).map((_, i) => (
                    <Card key={i} sx={{ minWidth: 120, maxWidth: 200 }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle2">Card {i + 1}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Detected card component
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}

              {/* Buttons */}
              {uiElements.buttons.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {Array.from({ length: Math.min(uiElements.buttons.length, 4) }).map((_, i) => (
                    <Button 
                      key={i}
                      variant={i === 0 ? 'contained' : i === 1 ? 'outlined' : 'text'}
                      color={i % 2 === 0 ? 'primary' : 'secondary'}
                      size="small"
                    >
                      Button {i + 1}
                    </Button>
                  ))}
                </Box>
              )}

              {/* Text Fields */}
              {uiElements.textFields.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {Array.from({ length: Math.min(uiElements.textFields.length, 3) }).map((_, i) => (
                    <TextField
                      key={i}
                      size="small"
                      placeholder={`Input ${i + 1}`}
                      variant={i === 0 ? 'outlined' : i === 1 ? 'filled' : 'standard'}
                      sx={{ minWidth: 120 }}
                    />
                  ))}
                </Box>
              )}

              {/* Chips */}
              {uiElements.chips.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {Array.from({ length: Math.min(uiElements.chips.length, 5) }).map((_, i) => (
                    <Chip 
                      key={i}
                      label={`Tag ${i + 1}`}
                      size="small"
                      color={['primary', 'secondary', 'success', 'warning', 'error'][i] as string}
                      variant={i % 2 === 0 ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              )}

              {/* Progress indicators */}
              {uiElements.progress.length > 0 && (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <CircularProgress size={24} />
                  <Typography variant="caption">Loading...</Typography>
                </Box>
              )}

              {/* Special effects indicators */}
              {(hasAnimation || hasGradient || hasShadow) && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Special Features Detected:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {hasAnimation && <Chip label="Animations" size="small" color="success" />}
                    {hasGradient && <Chip label="Gradients" size="small" color="info" />}
                    {hasShadow && <Chip label="Shadows" size="small" color="warning" />}
                  </Box>
                </Box>
              )}
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block', textAlign: 'center' }}>
              💡 This preview is dynamically generated by analyzing your component code
            </Typography>
          </Paper>
        </Box>
      );
    } catch (error) {
      return (
        <Alert severity="warning">
          <Typography variant="body2">
            Unable to analyze component structure: {error instanceof Error ? error.message : 'Unknown error'}
          </Typography>
        </Alert>
      );
    }
  };

  const renderLivePreview = () => {
    if (isPreviewLoading) {
      return (
        <Box
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 300,
          }}
        >
          <Box textAlign="center">
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Analyzing component...
            </Typography>
          </Box>
        </Box>
      );
    }

    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Visibility color="primary" />
            Live Preview
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              size="small" 
              variant="outlined" 
              startIcon={<Refresh />}
              onClick={() => {
                setIsPreviewLoading(true);
                setPreviewError(null);
                setTimeout(() => setIsPreviewLoading(false), 1500);
              }}
            >
              Refresh
            </Button>
          </Box>
        </Box>
        
        {/* Use a key based on code hash to force re-render when code changes */}
        <Box key={`preview-${codeHash}-${codeStats.lines}`}>
          {renderComponentPreview()}
        </Box>
        
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            🚀 Future Enhancement
          </Typography>
          <Typography variant="body2" color="text.secondary">
            In a production environment, this preview would use a secure iframe sandbox 
            or server-side rendering to safely execute and display the component.
          </Typography>
        </Box>
      </Box>
    );
  };

  if (!code) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No code to preview
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Code color="primary" />
          <Typography variant="h6">{fileName}</Typography>
          <Chip 
            label={language.toUpperCase()} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveOpen}
            size="small"
          >
            Save
          </Button>
          <IconButton onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {/* Code Statistics */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Card variant="outlined" sx={{ textAlign: 'center', p: 1, flex: '1 1 auto', minWidth: 100 }}>
            <Typography variant="caption" color="text.secondary">Lines</Typography>
            <Typography variant="h6">{codeStats.lines}</Typography>
          </Card>
          <Card variant="outlined" sx={{ textAlign: 'center', p: 1, flex: '1 1 auto', minWidth: 100 }}>
            <Typography variant="caption" color="text.secondary">Characters</Typography>
            <Typography variant="h6">{codeStats.characters}</Typography>
          </Card>
          <Card variant="outlined" sx={{ textAlign: 'center', p: 1, flex: '1 1 auto', minWidth: 100 }}>
            <Typography variant="caption" color="text.secondary">Words</Typography>
            <Typography variant="h6">{codeStats.words}</Typography>
          </Card>
          <Card variant="outlined" sx={{ textAlign: 'center', p: 1, flex: '1 1 auto', minWidth: 100 }}>
            <Typography variant="caption" color="text.secondary">Functions</Typography>
            <Typography variant="h6">{codeStats.functions}</Typography>
          </Card>
          <Card variant="outlined" sx={{ textAlign: 'center', p: 1, flex: '1 1 auto', minWidth: 100 }}>
            <Typography variant="caption" color="text.secondary">Components</Typography>
            <Typography variant="h6">{codeStats.components}</Typography>
          </Card>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab icon={<Code />} label="Code" />
            <Tab icon={<Visibility />} label="Live Preview" />
          </Tabs>
        </Box>

        {/* Code Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ position: 'relative' }}>
            <SyntaxHighlighter
              language={language}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                fontSize: '14px',
                lineHeight: '1.5',
              }}
              showLineNumbers
              wrapLines
            >
              {formattedCode}
            </SyntaxHighlighter>
          </Box>
        </TabPanel>

        {/* Live Preview Tab */}
        <TabPanel value={tabValue} index={1}>
          {renderLivePreview()}
        </TabPanel>
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleCopyCode}>
          <ContentCopy sx={{ mr: 1 }} />
          Copy Code
        </MenuItem>
        <MenuItem onClick={handleDownload}>
          <Download sx={{ mr: 1 }} />
          Download File
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleFormatCode}>
          <Settings sx={{ mr: 1 }} />
          Format Code
        </MenuItem>
        <MenuItem onClick={handleSaveOpen}>
          <Save sx={{ mr: 1 }} />
          Save Component
        </MenuItem>
      </Menu>

      {/* Save Dialog */}
      <Dialog 
        open={saveDialogOpen} 
        onClose={handleSaveClose} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Save Component</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Component Name"
            fullWidth
            variant="outlined"
            value={componentName}
            onChange={(e) => setComponentName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description (optional)"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={componentDescription}
            onChange={(e) => setComponentDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={() => setIsFavorite(!isFavorite)}
              color={isFavorite ? 'primary' : 'default'}
            >
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <Typography variant="body2">
              Mark as favorite
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveClose}>Cancel</Button>
          <Button 
            onClick={handleSaveComponent} 
            variant="contained"
            disabled={!componentName.trim()}
          >
            Save Component
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CodePreview;
