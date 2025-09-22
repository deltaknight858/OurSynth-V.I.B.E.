'use client';
import { useState, useEffect } from 'react';
import { MediaRecorder } from '../../../components/noteflow/MediaRecorder';
import { ScreenCapture } from '../../../components/noteflow/ScreenCapture';
import { VoiceCommandManager } from '../../../components/noteflow/VoiceCommandManager';
import { voiceCommandService } from '../../../lib/services/voiceCommandService';
import styles from '../noteflow/NoteFlow.module.css';

interface TaskInfo {
  title: string;
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled';
  assignedAgent?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: Date;
  subtasks?: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
}

interface MediaAttachment {
  id: string;
  kind: 'image' | 'audio' | 'video' | 'file';
  url: string;
  mime?: string;
  meta?: Record<string, unknown>;
}

interface MemoryNote {
  id: string;
  content: string;
  tags?: string[];
  timestamp: Date;
  attachments?: MediaAttachment[];
  taskInfo?: TaskInfo; // TaskFlow enhancement
  noteType?: 'standard' | 'taskflow'; // Track note type
}

export default function TaskFlowPage() {
  const [taskFlows, setTaskFlows] = useState<MemoryNote[]>([
    {
      id: '1',
      content: '# OurSynth Platform Development\n\nKey development tasks for the OurSynth ecosystem integration.\n\n## Tasks\n- [ ] Integrate TaskFlow with NoteFlow\n- [ ] Update shell navigation\n- [ ] Add pathways wizard support',
      tags: ['taskflow', 'development', 'integration'],
      timestamp: new Date('2025-09-20T17:00:00.000Z'),
      noteType: 'taskflow',
      taskInfo: {
        title: 'OurSynth Platform Development',
        status: 'in-progress',
        assignedAgent: 'AI Development Agent',
        priority: 'high',
        subtasks: [
          { id: '1_1', title: 'Integrate TaskFlow with NoteFlow', completed: true },
          { id: '1_2', title: 'Update shell navigation', completed: true },
          { id: '1_3', title: 'Add pathways wizard support', completed: false }
        ]
      }
    },
    {
      id: '2',
      content: '# User Experience Improvements\n\nEnhance the overall user experience across the platform.\n\n## Tasks\n- [ ] Improve navigation consistency\n- [ ] Add TaskFlow visual indicators\n- [ ] Implement voice command improvements',
      tags: ['taskflow', 'ux', 'improvements'],
      timestamp: new Date('2025-09-20T18:00:00.000Z'),
      noteType: 'taskflow',
      taskInfo: {
        title: 'User Experience Improvements',
        status: 'todo',
        assignedAgent: 'UX Team',
        priority: 'medium',
        subtasks: [
          { id: '2_1', title: 'Improve navigation consistency', completed: false },
          { id: '2_2', title: 'Add TaskFlow visual indicators', completed: false },
          { id: '2_3', title: 'Implement voice command improvements', completed: false }
        ]
      }
    }
  ]);

  const [newTaskFlow, setNewTaskFlow] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Get all unique tags
  const allTags = Array.from(
    new Set(taskFlows.flatMap(note => note.tags || []))
  );

  const filteredTaskFlows = taskFlows.filter(taskFlow => {
    const matchesSearch = !searchQuery || 
      taskFlow.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (taskFlow.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      taskFlow.taskInfo?.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => (taskFlow.tags || []).includes(tag));

    const matchesStatus = statusFilter === 'all' || taskFlow.taskInfo?.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || taskFlow.taskInfo?.priority === priorityFilter;

    return matchesSearch && matchesTags && matchesStatus && matchesPriority;
  });

  const handleAddTaskFlow = async () => {
    if (!newTaskFlow.trim()) return;

    const taskFlow: MemoryNote = {
      id: Date.now().toString(),
      content: newTaskFlow.trim(),
      timestamp: new Date(),
      tags: extractTags(newTaskFlow),
      noteType: 'taskflow',
      taskInfo: {
        title: extractTitle(newTaskFlow) || 'New TaskFlow',
        status: 'todo',
        priority: 'medium',
        subtasks: extractSubtasks(newTaskFlow)
      }
    };

    setTaskFlows(prev => [taskFlow, ...prev]);
    setNewTaskFlow('');
  };

  const extractTitle = (content: string): string => {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    return titleMatch ? titleMatch[1] : '';
  };

  const extractTags = (content: string): string[] => {
    const hashtagRegex = /#(\w+)/g;
    const matches = content.match(hashtagRegex);
    return matches ? matches.map(tag => tag.slice(1)) : ['taskflow'];
  };

  const extractSubtasks = (content: string): Array<{id: string; title: string; completed: boolean}> => {
    const taskRegex = /^-\s+\[( |x)\]\s+(.+)$/gm;
    const tasks = [];
    let match;
    let index = 0;
    
    while ((match = taskRegex.exec(content)) !== null) {
      tasks.push({
        id: `${Date.now()}_${index}`,
        title: match[2],
        completed: match[1] === 'x'
      });
      index++;
    }
    
    return tasks.length > 0 ? tasks : [{ id: `${Date.now()}_0`, title: 'Initial task', completed: false }];
  };

  const handleVoiceCommand = async (command?: any) => {
    if (!command) return;
    
    try {
      const result = await voiceCommandService.executeCommand(
        command, 
        'current-user', // Would come from auth context in real app
        taskFlows,
        setTaskFlows
      );
      console.log('Voice command result:', result);
    } catch (error) {
      console.error('Error executing voice command:', error);
    }
  };

  const updateTaskStatus = (taskFlowId: string, newStatus: string) => {
    const updatedTaskFlows = taskFlows.map(taskFlow => 
      taskFlow.id === taskFlowId && taskFlow.taskInfo
        ? { 
            ...taskFlow, 
            taskInfo: { 
              ...taskFlow.taskInfo, 
              status: newStatus as any 
            } 
          }
        : taskFlow
    );
    setTaskFlows(updatedTaskFlows);
  };

  const updateSubtaskCompletion = (taskFlowId: string, subtaskId: string) => {
    const updatedTaskFlows = taskFlows.map(taskFlow => 
      taskFlow.id === taskFlowId && taskFlow.taskInfo 
        ? {
            ...taskFlow,
            taskInfo: {
              ...taskFlow.taskInfo,
              subtasks: taskFlow.taskInfo.subtasks?.map(subtask =>
                subtask.id === subtaskId 
                  ? { ...subtask, completed: !subtask.completed }
                  : subtask
              )
            }
          }
        : taskFlow
    );
    setTaskFlows(updatedTaskFlows);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>TaskFlow Management</h1>
          <p className={styles.subtitle}>
            Organize tasks, assign agents, and track progress with intelligent task management
          </p>
        </div>
        <div className={styles.headerActions}>
          <span className={styles.badge}>
            {taskFlows.length} TaskFlows • {taskFlows.filter(t => t.taskInfo?.status === 'completed').length} completed
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.searchSection}>
        <div className={styles.searchInputGroup}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search TaskFlows..."
            className={styles.searchInput}
          />
          <div className={styles.filterControls}>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Status</option>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        {allTags.length > 0 && (
          <div className={styles.tagFilters}>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTags(prev =>
                    prev.includes(tag)
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag]
                  );
                }}
                className={`${styles.tagFilter} ${selectedTags.includes(tag) ? styles.tagFilterActive : ''}`}
              >
                #{tag}
              </button>
            ))}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className={styles.clearFilters}
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </div>

      <div className={styles.content}>
        {/* TaskFlow Input */}
        <div className={styles.noteInput}>
          <div className={styles.inputHeader}>
            <h2 className={styles.sectionTitle}>Create New TaskFlow</h2>
            <div className={styles.inputActions}>
              <VoiceCommandManager onCommand={handleVoiceCommand} />
              <MediaRecorder onRecordingComplete={(audioBlob) => console.log('Audio recorded:', audioBlob)} />
              <ScreenCapture onCapture={(imageUrl) => console.log('Screen captured:', imageUrl)} />
            </div>
          </div>
          
          <div className={styles.inputGroup}>
            <textarea
              value={newTaskFlow}
              onChange={(e) => setNewTaskFlow(e.target.value)}
              placeholder="Create a new TaskFlow... 

# TaskFlow Title
Description of the task workflow

## Tasks
- [ ] First task
- [ ] Second task
- [x] Completed task

Use # for tags: #development #urgent"
              className={styles.noteTextarea}
              rows={8}
            />
            <button 
              onClick={handleAddTaskFlow}
              className={styles.addButton}
              disabled={!newTaskFlow.trim()}
            >
              Create TaskFlow ✅
            </button>
          </div>
        </div>

        {/* TaskFlow List */}
        <div className={styles.notesGrid}>
          {filteredTaskFlows.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>✅</div>
              <h3>No TaskFlows found</h3>
              <p>Create your first TaskFlow or adjust your filters.</p>
            </div>
          ) : (
            filteredTaskFlows.map(taskFlow => (
              <div key={taskFlow.id} className={`${styles.noteCard} ${styles.taskflowCard}`}>
                <div className={styles.noteContent}>
                  {/* TaskFlow Header */}
                  {taskFlow.taskInfo && (
                    <div className={styles.taskflowHeader}>
                      <div className={styles.taskflowTitle}>
                        <span className={styles.taskflowIcon}>✅</span>
                        <h3>{taskFlow.taskInfo.title}</h3>
                      </div>
                      <div className={styles.taskflowMeta}>
                        <select
                          value={taskFlow.taskInfo.status}
                          onChange={(e) => updateTaskStatus(taskFlow.id, e.target.value)}
                          className={`${styles.taskStatus} ${styles[`status-${taskFlow.taskInfo.status}`]}`}
                        >
                          <option value="todo">Todo</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        {taskFlow.taskInfo.priority && (
                          <span className={`${styles.taskPriority} ${styles[`priority-${taskFlow.taskInfo.priority}`]}`}>
                            {taskFlow.taskInfo.priority}
                          </span>
                        )}
                        {taskFlow.taskInfo.assignedAgent && (
                          <span className={styles.assignedAgent}>
                            👤 {taskFlow.taskInfo.assignedAgent}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Subtasks */}
                  {taskFlow.taskInfo?.subtasks && taskFlow.taskInfo.subtasks.length > 0 && (
                    <div className={styles.subtasksList}>
                      <h4>Tasks:</h4>
                      {taskFlow.taskInfo.subtasks.map(subtask => (
                        <div key={subtask.id} className={styles.subtaskItem}>
                          <input 
                            type="checkbox" 
                            checked={subtask.completed}
                            onChange={() => updateSubtaskCompletion(taskFlow.id, subtask.id)}
                          />
                          <span className={subtask.completed ? styles.completedTask : ''}>
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Note Content */}
                  <div className={styles.noteText}>
                    {taskFlow.content.split('\n').map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                  
                  <div className={styles.noteMeta}>
                    <span className={styles.noteTime}>
                      {taskFlow.timestamp.toLocaleString()}
                    </span>
                    {taskFlow.tags && taskFlow.tags.length > 0 && (
                      <div className={styles.noteTags}>
                        {taskFlow.tags.map(tag => (
                          <span key={tag} className={styles.noteTag}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.noteActions}>
                  <button className={styles.actionButton} title="Edit TaskFlow">
                    ✏️
                  </button>
                  <button className={styles.actionButton} title="Share TaskFlow">
                    📤
                  </button>
                  <button 
                    className={styles.actionButton} 
                    title="Delete TaskFlow"
                    onClick={() => {
                      const filteredTaskFlows = taskFlows.filter(t => t.id !== taskFlow.id);
                      setTaskFlows(filteredTaskFlows);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}