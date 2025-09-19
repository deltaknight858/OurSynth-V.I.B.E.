// Data Hooks: useProjects & useProject
// React hooks and data fetching functions for projects and nodes

import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import type { Project, Node } from '@/types/projects';
export type { Project };

// ========================================
// DATA FETCHING FUNCTIONS
// ========================================

/**
 * Fetch all projects for a specific user
 */
export async function fetchProjects(userId: string): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

/**
 * Fetch a single project by ID
 */
export async function fetchProject(id: number): Promise<Project | null> {
  // For development, always return a default project without hitting the database
  console.log('Running in development mode - using offline project data');
  
  return {
    id: 1,
    name: 'My First Project',
    user_id: 'dev-user-id',
    description: 'A sample project for development (offline mode)',
    thumbnail_url: undefined,
    is_public: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  /* Database code disabled for development
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // Handle various database errors gracefully
      if (error.code === 'PGRST116' && id === 1) {
        console.log('Creating default project for development...');
        return {
          id: 1,
          name: 'My First Project',
          user_id: 'dev-user-id',
          description: 'A sample project for development',
          thumbnail_url: undefined,
          is_public: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      
      // Handle 406 Not Acceptable and other database connection issues
      console.log('Database error or project not found:', error.code, error.message);
      
      // Return default project for development when database is not available
      if (id === 1) {
        return {
          id: 1,
          name: 'My First Project',
          user_id: 'dev-user-id',
          description: 'A sample project for development (offline mode)',
          thumbnail_url: undefined,
          is_public: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error fetching project:', error);
    // Fallback for development
    if (id === 1) {
      return {
        id: 1,
        name: 'My First Project',
        user_id: 'dev-user-id',
        description: 'A sample project for development (fallback)',
        thumbnail_url: undefined,
        is_public: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    return null;
  }
  */
}

/**
 * Fetch all nodes for a specific project
 */
export async function fetchNodes(projectId: number): Promise<Node[]> {
  // For development, return empty array - nodes will be managed in memory
  console.log('Running in development mode - using in-memory node storage');
  return [];
  
  /* Database code disabled for development
  try {
    const { data, error } = await supabase
      .from('nodes')
      .select('*')
      .eq('project_id', projectId)
      .order('z_index', { ascending: true });

    if (error) {
      // For development, return empty array if nodes table doesn't exist or is empty
      console.log('No nodes found or database not configured, returning empty array');
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching nodes:', error);
    return [];
  }
  */
}

/**
 * Upsert (insert or update) nodes
 */
export async function upsertNodes(projectId: number, nodes: Partial<Node>[]): Promise<Node[]> {
  // For development, skip database and return properly formatted nodes
  console.log('Running in development mode - skipping database save, returning in-memory nodes');
  
  const processedNodes = nodes.map((node, index) => ({
    ...node,
    id: node.id || Date.now() + index,
    project_id: projectId,
    // Ensure numeric values are integers
    x: node.x ? Math.round(Number(node.x)) : 0,
    y: node.y ? Math.round(Number(node.y)) : 0,
    width: node.width ? Math.round(Number(node.width)) : 100,
    height: node.height ? Math.round(Number(node.height)) : 100,
    z_index: node.z_index ? Math.round(Number(node.z_index)) : 0,
    created_at: node.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  })) as Node[];
  
  return processedNodes;
  
  /* Database code disabled for development
  try {
    // Prepare nodes for upsert with proper data type validation
    const nodesToUpsert = nodes.map(node => ({
      ...node,
      project_id: projectId,
      // Ensure numeric values are integers
      x: node.x ? Math.round(Number(node.x)) : 0,
      y: node.y ? Math.round(Number(node.y)) : 0,
      width: node.width ? Math.round(Number(node.width)) : 100,
      height: node.height ? Math.round(Number(node.height)) : 100,
      z_index: node.z_index ? Math.round(Number(node.z_index)) : 0,
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('nodes')
      .upsert(nodesToUpsert, { onConflict: 'id' })
      .select();

    if (error) {
      console.log('Database not configured or error saving nodes:', error.code, error.message);
      // For development, simulate successful save by returning the input nodes with IDs
      return nodesToUpsert.map((node, index) => ({
        ...node,
        id: node.id || Date.now() + index,
        project_id: projectId,
        created_at: node.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      })) as Node[];
    }
    return data || [];
  } catch (error) {
    console.error('Error upserting nodes:', error);
    // Return fallback data for development
    return nodes.map((node, index) => ({
      ...node,
      id: node.id || Date.now() + index,
      project_id: projectId,
      x: node.x ? Math.round(Number(node.x)) : 0,
      y: node.y ? Math.round(Number(node.y)) : 0,
      width: node.width ? Math.round(Number(node.width)) : 100,
      height: node.height ? Math.round(Number(node.height)) : 100,
      z_index: node.z_index ? Math.round(Number(node.z_index)) : 0,
      created_at: node.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    })) as Node[];
  }
  */
}

// ========================================
// REACT HOOKS
// ========================================

/**
 * Hook to fetch and manage multiple projects
 */
export function useProjects(userId: string | null) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadProjects = async () => {
      if (!userId) {
        setProjects([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProjects(userId);
        if (mounted) {
          setProjects(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load projects');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    loadProjects();
    return () => { mounted = false; };
  }, [userId]);

  const refetch = async () => {
    if (!userId) return;
    try {
      setError(null);
      const data = await fetchProjects(userId);
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh projects');
    }
  };

  // Add createProject method
  const createProject = async (project: Partial<Project>) => {
    // For development, just add to local state
    const newProject: Project = {
      id: Date.now(),
      name: project.name || 'Untitled',
      user_id: userId || 'dev-user-id',
      description: project.description || '',
      thumbnail_url: project.thumbnail_url,
      is_public: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      project_data: project.project_data || {},
    };
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  return {
    projects,
    loading,
    error,
    refetch,
    createProject,
  };
}

/**
 * Hook to fetch and manage a single project with its nodes
 */
export function useProject(id: number | null) {
  const [project, setProject] = useState<Project | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadProject = async () => {
      if (!id) {
        setProject(null);
        setNodes([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const [projectData, nodesData] = await Promise.all([
          fetchProject(id),
          fetchNodes(id)
        ]);
        if (mounted) {
          setProject(projectData);
          setNodes(nodesData);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load project');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    loadProject();
    return () => { mounted = false; };
  }, [id]);

  const refetch = async () => {
    if (!id) return;
    try {
      setError(null);
      const [projectData, nodesData] = await Promise.all([
        fetchProject(id),
        fetchNodes(id)
      ]);
      setProject(projectData);
      setNodes(nodesData);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
    }
  };

  const updateNodes = async (newNodes: Partial<Node>[]) => {
    if (!id) return;
    try {
      const updatedNodes = await upsertNodes(id, newNodes);
      setNodes(updatedNodes);
      return updatedNodes;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update nodes');
      return [];
    }
  };

  // Add saveProjectData method
  const saveProjectData = async (data: any) => {
    if (!id) return;
    // For development, just update local state
    setProject(prev => prev ? { ...prev, project_data: data, updated_at: new Date().toISOString() } : prev);
    return true;
  };

  return {
    project,
    nodes,
    loading,
    error,
    refetch,
    updateNodes,
    saveProjectData,
  };
}