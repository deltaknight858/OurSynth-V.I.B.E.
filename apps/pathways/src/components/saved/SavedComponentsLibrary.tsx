'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  Code,
  Delete,
  Download,
  Edit,
  MoreVert,
  Search,
  FilterList,
  ContentCopy,
  Visibility,
  Star,
  StarBorder,
} from '@mui/icons-material';
import CodePreview from '../generator/CodePreview';
import toast from 'react-hot-toast';

interface SavedComponent {
  id: number;
  name: string;
  code: string;
  createdAt: string;
  title: string;
  favorite?: boolean;
  tags?: string[];
}

export default function SavedComponentsLibrary() {
  const [savedComponents, setSavedComponents] = useState<SavedComponent[]>([]);
  const [filteredComponents, setFilteredComponents] = useState<SavedComponent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<SavedComponent | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<SavedComponent | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ [key: number]: HTMLElement | null }>({});

  useEffect(() => {
    loadSavedComponents();
  }, []);

  useEffect(() => {
    filterComponents();
  }, [savedComponents, searchTerm]);

  const loadSavedComponents = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedComponents') || '[]');
      setSavedComponents(saved);
    } catch (error) {
      console.error('Failed to load saved components:', error);
      toast.error('Failed to load saved components');
    }
  };

  const filterComponents = () => {
    if (!searchTerm) {
      setFilteredComponents(savedComponents);
      return;
    }

    const filtered = savedComponents.filter(component =>
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredComponents(filtered);
  };

  const handleDelete = (id: number) => {
    const updated = savedComponents.filter(comp => comp.id !== id);
    setSavedComponents(updated);
    localStorage.setItem('savedComponents', JSON.stringify(updated));
    toast.success('Component deleted');
  };

  const handleToggleFavorite = (id: number) => {
    const updated = savedComponents.map(comp =>
      comp.id === id ? { ...comp, favorite: !comp.favorite } : comp
    );
    setSavedComponents(updated);
    localStorage.setItem('savedComponents', JSON.stringify(updated));
    toast.success('Favorite updated');
  };

  const handleEdit = (component: SavedComponent) => {
    setEditingComponent(component);
    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingComponent) return;

    const updated = savedComponents.map(comp =>
      comp.id === editingComponent.id ? editingComponent : comp
    );
    setSavedComponents(updated);
    localStorage.setItem('savedComponents', JSON.stringify(updated));
    setEditOpen(false);
    setEditingComponent(null);
    toast.success('Component updated');
  };

  const handleDownload = (component: SavedComponent) => {
    const blob = new Blob([component.code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${component.name}.tsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${component.name}.tsx`);
  };

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Code copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  const getComponentStats = (code: string) => {
    const lines = code.split('\n').length;
    const chars = code.length;
    const components = (code.match(/const\s+\w+Component/g) || []).length;
    return { lines, chars, components };
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            background: 'linear-gradient(45deg, #a020f0 30%, #e1bee7 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            mb: 1,
          }}
        >
          Component Library
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Your saved AI-generated components
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search components..."
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: <Search sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />,
          }}
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#a020f0',
              },
            },
          }}
        />
        <Chip
          label={`${filteredComponents.length} component${filteredComponents.length !== 1 ? 's' : ''}`}
          sx={{
            background: 'rgba(160, 32, 240, 0.2)',
            color: '#e1bee7',
          }}
        />
      </Box>

      {/* Components Grid */}
      {filteredComponents.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            border: '2px dashed rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
          }}
        >
          <Code sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
            {savedComponents.length === 0 ? 'No saved components yet' : 'No components match your search'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            {savedComponents.length === 0 
              ? 'Generate some components and save them to see them here'
              : 'Try adjusting your search terms'
            }
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: 3,
          }}
        >
          {filteredComponents.map((component) => {
            const stats = getComponentStats(component.code);
            return (
              <Card
                key={component.id}
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(160, 32, 240, 0.15)',
                    border: '1px solid rgba(160, 32, 240, 0.3)',
                  },
                }}
              >
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flex: 1, mr: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            mb: 0.5,
                            fontSize: '1.1rem',
                          }}
                        >
                          {component.title || component.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                        >
                          {new Date(component.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleFavorite(component.id)}
                          sx={{ color: component.favorite ? '#ffd700' : 'rgba(255, 255, 255, 0.5)' }}
                        >
                          {component.favorite ? <Star fontSize="small" /> : <StarBorder fontSize="small" />}
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => setMenuAnchor({ ...menuAnchor, [component.id]: e.currentTarget })}
                          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip
                        label={`${stats.lines} lines`}
                        size="small"
                        sx={{
                          background: 'rgba(160, 32, 240, 0.2)',
                          color: '#e1bee7',
                          fontSize: '0.7rem',
                        }}
                      />
                      <Chip
                        label={`${stats.components} component${stats.components !== 1 ? 's' : ''}`}
                        size="small"
                        sx={{
                          background: 'rgba(76, 175, 80, 0.2)',
                          color: '#c8e6c9',
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.4,
                        height: '2.8em',
                      }}
                    >
                      {component.name}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => {
                        setSelectedComponent(component);
                        setPreviewOpen(true);
                      }}
                      sx={{
                        color: '#e1bee7',
                        '&:hover': {
                          background: 'rgba(160, 32, 240, 0.1)',
                        },
                      }}
                    >
                      Preview
                    </Button>
                    <Button
                      size="small"
                      startIcon={<ContentCopy />}
                      onClick={() => handleCopy(component.code)}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      Copy
                    </Button>
                  </CardActions>

                  {/* Component Menu */}
                  <Menu
                    anchorEl={menuAnchor[component.id]}
                    open={Boolean(menuAnchor[component.id])}
                    onClose={() => setMenuAnchor({ ...menuAnchor, [component.id]: null })}
                    PaperProps={{
                      sx: {
                        background: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'white',
                      }
                    }}
                  >
                    <MenuItem onClick={() => { handleEdit(component); setMenuAnchor({ ...menuAnchor, [component.id]: null }); }}>
                      <ListItemIcon><Edit sx={{ color: 'rgba(255, 255, 255, 0.7)' }} /></ListItemIcon>
                      <ListItemText>Edit</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => { handleDownload(component); setMenuAnchor({ ...menuAnchor, [component.id]: null }); }}>
                      <ListItemIcon><Download sx={{ color: 'rgba(255, 255, 255, 0.7)' }} /></ListItemIcon>
                      <ListItemText>Download</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => { handleDelete(component.id); setMenuAnchor({ ...menuAnchor, [component.id]: null }); }}>
                      <ListItemIcon><Delete sx={{ color: '#f44336' }} /></ListItemIcon>
                      <ListItemText>Delete</ListItemText>
                    </MenuItem>
                  </Menu>
                </Card>
              );
            })}
          </Box>
        )}

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>
          {selectedComponent?.title || selectedComponent?.name}
        </DialogTitle>
        <DialogContent>
          {selectedComponent && (
            <CodePreview
              code={selectedComponent.code}
              fileName={selectedComponent.name}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Edit Component</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Component Name"
            value={editingComponent?.name || ''}
            onChange={(e) => setEditingComponent(prev => prev ? { ...prev, name: e.target.value } : null)}
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />
          <TextField
            fullWidth
            label="Title"
            value={editingComponent?.title || ''}
            onChange={(e) => setEditingComponent(prev => prev ? { ...prev, title: e.target.value } : null)}
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} sx={{ color: '#a020f0' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
