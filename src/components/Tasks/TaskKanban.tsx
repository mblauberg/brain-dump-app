import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useAppStore } from '../../stores/useAppStore';
import { Task, TaskStatus, Priority } from '../../types';
import DraggableTaskCard from './DraggableTaskCard';
import TaskCard from './TaskCard';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';

const TaskKanban: React.FC = () => {
  const { tasks, updateTask } = useAppStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const filteredTasks = tasks.filter(task => 
    filterPriority === 'all' || task.priority === filterPriority
  );

  const columns = [
    {
      id: 'not_started' as TaskStatus,
      title: 'To Do',
      tasks: filteredTasks.filter(task => task.status === 'not_started'),
      color: 'border-gray-300 bg-gray-50',
    },
    {
      id: 'in_progress' as TaskStatus,
      title: 'In Progress',
      tasks: filteredTasks.filter(task => task.status === 'in_progress'),
      color: 'border-blue-300 bg-blue-50',
    },
    {
      id: 'completed' as TaskStatus,
      title: 'Completed',
      tasks: filteredTasks.filter(task => task.status === 'completed'),
      color: 'border-green-300 bg-green-50',
    },
  ];

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = tasks.find(task => task.id === active.id);
    if (!activeTask) return;

    // Check if dropped on a column
    const targetColumn = columns.find(col => col.id === over.id);
    if (targetColumn && activeTask.status !== targetColumn.id) {
      updateTask(activeTask.id, { status: targetColumn.id });
      return;
    }

    // Handle reordering within the same column
    const activeColumn = columns.find(col => 
      col.tasks.some(task => task.id === active.id)
    );
    const overColumn = columns.find(col => 
      col.tasks.some(task => task.id === over.id) || col.id === over.id
    );

    if (activeColumn && overColumn && activeColumn.id === overColumn.id) {
      const oldIndex = activeColumn.tasks.findIndex(task => task.id === active.id);
      const newIndex = activeColumn.tasks.findIndex(task => task.id === over.id);
      
      if (oldIndex !== newIndex) {
        // Future: Implement task reordering within columns
        // const reorderedTasks = arrayMove(activeColumn.tasks, oldIndex, newIndex);
        // updateTaskOrder(reorderedTasks);
      }
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Task Board</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-4 w-4 text-gray-400" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as Priority | 'all')}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Priority Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterPriority('all')}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            filterPriority === 'all' 
              ? 'bg-primary-100 text-primary-800 border-primary-200' 
              : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
          }`}
        >
          All ({tasks.length})
        </button>
        {(['high', 'medium', 'low'] as Priority[]).map((priority) => {
          const count = tasks.filter(t => t.priority === priority).length;
          return (
            <button
              key={priority}
              onClick={() => setFilterPriority(priority)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                filterPriority === priority 
                  ? getPriorityColor(priority)
                  : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
              }`}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)} ({count})
            </button>
          );
        })}
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className={`rounded-lg border-2 border-dashed p-4 min-h-96 ${column.color}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  {column.title} ({column.tasks.length})
                </h3>
                {column.id === 'not_started' && (
                  <button className="p-1 rounded text-gray-400 hover:text-gray-600">
                    <PlusIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <SortableContext
                items={column.tasks.map(task => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {column.tasks.map((task) => (
                    <DraggableTaskCard key={task.id} task={task} />
                  ))}
                  
                  {/* Drop Zone */}
                  <div
                    id={column.id}
                    className="h-12 rounded-lg border-2 border-dashed border-gray-300 opacity-0 hover:opacity-50 transition-opacity flex items-center justify-center"
                  >
                    <span className="text-sm text-gray-500">Drop tasks here</span>
                  </div>
                </div>
              </SortableContext>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Mobile Instructions */}
      <div className="md:hidden bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">📱 Mobile Tip</h4>
        <p className="text-sm text-blue-700">
          Tap and hold a task to drag it between columns. This helps you organize your workflow visually!
        </p>
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500 mb-4">
            {filterPriority === 'all' 
              ? "Create some tasks using the Brain Dump feature to get started with the Kanban board!"
              : `No ${filterPriority} priority tasks found. Try selecting a different priority filter.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskKanban;