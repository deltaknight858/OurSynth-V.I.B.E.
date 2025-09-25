// Supabase client functions for Projects & Nodes
// Type-safe database operations

import { supabase } from './supabase';
import type { 
  Project, 
  Node, 
  CreateProjectInput, 
  UpdateProjectInput, 
  CreateNodeInput, 
  UpdateNodeInput,
  ProjectWithStats,
  ApiResponse,
  PaginatedResponse
} from '@/types/projects';

// ========================================
// PROJECT OPERATIONS
// ========================================

export async function createProject(input: CreateProjectInput): Promise<ApiResponse<Project>> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return { data };
  } catch (error) {
    return { data: null, error: (error as Error).message };
  }
}

export async function getProject(id: number): Promise<ApiResponse<Project>> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data };
  } catch (error) {
    return { data: null, error: (error as Error).message };
  }
}

export async function getUserProjects(
  userId?: string,
  page = 1,
  pageSize = 10
): Promise<PaginatedResponse<ProjectWithStats>> {
  try {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize - 1;

    let query = supabase
      .from('projects_with_stats')
      .select('*', { count: 'exact' })
      .order('updated_at', { ascending: false })
      .range(startIndex, endIndex);

    // If userId provided, filter by user, otherwise get public projects
    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.eq('is_public', true);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data || [],
      count: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  } catch (error) {
    return {
      data: [],
      count: 0,
      page,
      pageSize,
      totalPages: 0
    };
  }
}

export async function updateProject(
  id: number, 
  input: UpdateProjectInput
): Promise<ApiResponse<Project>> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data };
  } catch (error) {
    return { data: null, error: (error as Error).message };
  }
}

export async function deleteProject(id: number): Promise<ApiResponse<boolean>> {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { data: true };
  } catch (error) {
    return { data: false, error: (error as Error).message };
  }
}

export async function duplicateProject(
  id: number, 
  newName: string
): Promise<ApiResponse<Project>> {
  try {
    // Get original project
    const { data: originalProject, error: projectError } = await supabase
      .from('projects')
      .select()
      .eq('id', id)
      .single();

    if (projectError) throw projectError;

    // Create new project
    const { data: newProject, error: createError } = await supabase
      .from('projects')
      .insert({
        name: newName,
        description: originalProject.description,
        thumbnail_url: originalProject.thumbnail_url,
        is_public: false, // New projects are private by default
        user_id: originalProject.user_id
      })
      .select()
      .single();

    if (createError) throw createError;

    // Get all nodes from original project
    const { data: originalNodes, error: nodesError } = await supabase
      .from('nodes')
      .select()
      .eq('project_id', id);

    if (nodesError) throw nodesError;

    // Create new nodes for the duplicated project
    if (originalNodes && originalNodes.length > 0) {
      const newNodes = originalNodes.map(node => ({
        project_id: newProject.id,
        type: node.type,
        props: node.props,
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height,
        z_index: node.z_index,
        parent_id: node.parent_id, // Note: parent_id relationships will need mapping for nested nodes
        locked: node.locked,
        visible: node.visible
      }));

      const { error: insertNodesError } = await supabase
        .from('nodes')
        .insert(newNodes);

      if (insertNodesError) throw insertNodesError;
    }

    return { data: newProject };
  } catch (error) {
    return { data: null, error: (error as Error).message };
  }
}

// ========================================
// NODE OPERATIONS
// ========================================

export async function createNode(input: CreateNodeInput): Promise<ApiResponse<Node>> {
  try {
    const { data, error } = await supabase
      .from('nodes')
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return { data };
  } catch (error) {
    return { data: null, error: (error as Error).message };
  }
}

export async function getProjectNodes(projectId: number): Promise<ApiResponse<Node[]>> {
  try {
    const { data, error } = await supabase
      .from('nodes')
      .select()
      .eq('project_id', projectId)
      .order('z_index', { ascending: true });

    if (error) throw error;
    return { data: data || [] };
  } catch (error) {
    return { data: [], error: (error as Error).message };
  }
}

export async function updateNode(
  id: number, 
  input: UpdateNodeInput
): Promise<ApiResponse<Node>> {
  try {
    const { data, error } = await supabase
      .from('nodes')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data };
  } catch (error) {
    return { data: null, error: (error as Error).message };
  }
}

export async function updateNodePosition(
  id: number, 
  x: number, 
  y: number
): Promise<ApiResponse<Node>> {
  return updateNode(id, { x, y });
}

export async function updateNodeSize(
  id: number, 
  width: number, 
  height: number
): Promise<ApiResponse<Node>> {
  return updateNode(id, { width, height });
}

export async function deleteNode(id: number): Promise<ApiResponse<boolean>> {
  try {
    const { error } = await supabase
      .from('nodes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { data: true };
  } catch (error) {
    return { data: false, error: (error as Error).message };
  }
}

export async function deleteNodes(ids: number[]): Promise<ApiResponse<boolean>> {
  try {
    const { error } = await supabase
      .from('nodes')
      .delete()
      .in('id', ids);

    if (error) throw error;
    return { data: true };
  } catch (error) {
    return { data: false, error: (error as Error).message };
  }
}

export async function updateNodeZIndex(
  id: number, 
  zIndex: number
): Promise<ApiResponse<Node>> {
  return updateNode(id, { z_index: zIndex });
}

export async function bringNodeToFront(projectId: number, nodeId: number): Promise<ApiResponse<Node>> {
  try {
    // Get the highest z_index in the project
    const { data: maxZNode, error: maxError } = await supabase
      .from('nodes')
      .select('z_index')
      .eq('project_id', projectId)
      .order('z_index', { ascending: false })
      .limit(1)
      .single();

    if (maxError) throw maxError;

    const newZIndex = (maxZNode?.z_index || 0) + 1;
    return updateNodeZIndex(nodeId, newZIndex);
  } catch (error) {
    return { data: null, error: (error as Error).message };
  }
}

export async function sendNodeToBack(projectId: number, nodeId: number): Promise<ApiResponse<Node>> {
  try {
    // Get the lowest z_index in the project
    const { data: minZNode, error: minError } = await supabase
      .from('nodes')
      .select('z_index')
      .eq('project_id', projectId)
      .order('z_index', { ascending: true })
      .limit(1)
      .single();

    if (minError) throw minError;

    const newZIndex = (minZNode?.z_index || 0) - 1;
    return updateNodeZIndex(nodeId, newZIndex);
  } catch (error) {
    return { data: null, error: (error as Error).message };
  }
}

// ========================================
// BATCH OPERATIONS
// ========================================

export async function createNodes(inputs: CreateNodeInput[]): Promise<ApiResponse<Node[]>> {
  try {
    const { data, error } = await supabase
      .from('nodes')
      .insert(inputs)
      .select();

    if (error) throw error;
    return { data: data || [] };
  } catch (error) {
    return { data: [], error: (error as Error).message };
  }
}

export async function updateNodes(
  updates: Array<{ id: number; updates: UpdateNodeInput }>
): Promise<ApiResponse<Node[]>> {
  try {
    const results = await Promise.all(
      updates.map(({ id, updates }) => updateNode(id, updates))
    );

    const errors = results.filter(r => r.error).map(r => r.error);
    if (errors.length > 0) {
      throw new Error(`Failed to update nodes: ${errors.join(', ')}`);
    }

    const data = results.map(r => r.data).filter(Boolean) as Node[];
    return { data };
  } catch (error) {
    return { data: [], error: (error as Error).message };
  }
}

// ========================================
// REAL-TIME SUBSCRIPTIONS
// ========================================

export function subscribeToProject(
  projectId: number,
  onProjectChange: (project: Project) => void
) {
  return supabase
    .channel(`project-${projectId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'projects',
        filter: `id=eq.${projectId}`
      },
      (payload) => {
        if (payload.new) {
          onProjectChange(payload.new as Project);
        }
      }
    )
    .subscribe();
}

export function subscribeToProjectNodes(
  projectId: number,
  onNodesChange: (nodes: Node[]) => void
) {
  return supabase
    .channel(`nodes-${projectId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'nodes',
        filter: `project_id=eq.${projectId}`
      },
      async () => {
        // Refetch all nodes when any change occurs
        const { data } = await getProjectNodes(projectId);
        if (data) {
          onNodesChange(data);
        }
      }
    )
    .subscribe();
}
