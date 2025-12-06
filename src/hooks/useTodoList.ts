"use client";

import { useState } from 'react';

// 默认婚礼任务分类
const DEFAULT_CATEGORIES: TodoCategory[] = [
  { id: 'wedding-venue', name: '场地布置', color: 'rose', icon: '🏰', order: 1 },
  { id: 'wedding-clothes', name: '服装造型', color: 'pink', icon: '👗', order: 2 },
  { id: 'wedding-photo', name: '摄影摄像', color: 'purple', icon: '📸', order: 3 },
  { id: 'wedding-guests', name: '宾客邀请', color: 'blue', icon: '👥', order: 4 },
  { id: 'wedding-food', name: '餐饮服务', color: 'orange', icon: '🍰', order: 5 },
  { id: 'wedding-music', name: '音乐娱乐', color: 'green', icon: '🎵', order: 6 },
  { id: 'wedding-docs', name: '证件文书', color: 'gray', icon: '📋', order: 7 },
  { id: 'wedding-other', name: '其他事项', color: 'indigo', icon: '📦', order: 8 }
];

export interface TodoCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  order: number;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  categoryId: string;
  priority: 'high' | 'medium' | 'low';
  parentId?: string;
  children?: Todo[];
  notes?: string;
  dueDate?: string;
}

export function useTodoList() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window !== 'undefined') {
      const savedTodos = localStorage.getItem('weddingTodos');
      if (savedTodos) {
        try {
          return JSON.parse(savedTodos);
        } catch (error) {
          console.error('Error parsing todos:', error);
        }
      }
    }
    return [];
  });

  const [categories, setCategories] = useState<TodoCategory[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCategories = localStorage.getItem('weddingCategories');
      if (savedCategories) {
        try {
          return JSON.parse(savedCategories);
        } catch (error) {
          console.error('Error parsing categories:', error);
        }
      }
    }
    return DEFAULT_CATEGORIES;
  });

  const saveTodos = (newTodos: Todo[]) => {
    setTodos(newTodos);
    localStorage.setItem('weddingTodos', JSON.stringify(newTodos));
  };

  const saveCategories = (newCategories: TodoCategory[]) => {
    setCategories(newCategories);
    localStorage.setItem('weddingCategories', JSON.stringify(newCategories));
  };

  const addTodo = (
    text: string,
    categoryId: string = 'wedding-other',
    priority?: Todo['priority'],
    parentId?: string,
    notes?: string,
    dueDate?: string
  ) => {
    const newTodo: Todo = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      categoryId,
      priority: priority || 'medium',
      parentId,
      notes,
      dueDate
    };

    if (parentId) {
      // 如果是子任务，需要更新父任务
      const updatedTodos = todos.map(todo => {
        if (todo.id === parentId) {
          return {
            ...todo,
            children: [...(todo.children || []), newTodo]
          };
        }
        return todo;
      });
      saveTodos(updatedTodos);
    } else {
      saveTodos([...todos, newTodo]);
    }
  };

  const addCategory = (name: string, color: string = 'gray', icon: string = '📦') => {
    const newCategory: TodoCategory = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      color,
      icon,
      order: categories.length + 1
    };
    saveCategories([...categories, newCategory]);
  };

  const toggleTodo = (id: string) => {
    const updateParentCompletion = (todo: Todo): Todo => {
      // 如果有子任务，检查是否所有子任务都完成
      if (todo.children && todo.children.length > 0) {
        const allChildrenCompleted = todo.children.every(child => child.completed);
        return { ...todo, completed: allChildrenCompleted };
      }
      return todo;
    };

    const toggleTodoRecursive = (todo: Todo): Todo => {
      if (todo.id === id) {
        // 如果是子任务，直接切换
        if (todo.parentId) {
          return { ...todo, completed: !todo.completed };
        }
        // 如果是父任务，切换自己的状态（但要基于子任务状态）
        const toggledTodo = { ...todo, completed: !todo.completed };
        return toggledTodo;
      }

      // 递归处理子任务
      if (todo.children) {
        const updatedChildren = todo.children.map(toggleTodoRecursive);
        const updatedTodo = { ...todo, children: updatedChildren };

        // 更新父任务的完成状态
        return updateParentCompletion(updatedTodo);
      }
      return todo;
    };

    saveTodos(todos.map(toggleTodoRecursive));
  };

  const deleteTodo = (id: string) => {
    const deleteTodoRecursive = (todo: Todo): Todo | null => {
      // 如果当前任务就是要删除的任务
      if (todo.id === id) {
        return null;
      }
      // 如果有子任务，递归处理
      if (todo.children) {
        const filteredChildren = todo.children
          .map(deleteTodoRecursive)
          .filter((child): child is Todo => child !== null);
        return { ...todo, children: filteredChildren };
      }
      return todo;
    };

    const filteredTodos = todos
      .map(deleteTodoRecursive)
      .filter((todo): todo is Todo => todo !== null);
    saveTodos(filteredTodos);
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    const updateTodoRecursive = (todo: Todo): Todo => {
      if (todo.id === id) {
        return { ...todo, ...updates };
      }
      if (todo.children) {
        return {
          ...todo,
          children: todo.children.map(updateTodoRecursive)
        };
      }
      return todo;
    };

    saveTodos(todos.map(updateTodoRecursive));
  };

  const clearCompleted = () => {
    const clearCompletedRecursive = (todo: Todo): Todo | null => {
      // 如果任务已完成，删除它（包括子任务）
      if (todo.completed) {
        return null;
      }
      // 如果有子任务，递归清理已完成的子任务
      if (todo.children) {
        const filteredChildren = todo.children
          .map(clearCompletedRecursive)
          .filter((child): child is Todo => child !== null);
        return { ...todo, children: filteredChildren };
      }
      return todo;
    };

    const filteredTodos = todos
      .map(clearCompletedRecursive)
      .filter((todo): todo is Todo => todo !== null);
    saveTodos(filteredTodos);
  };

  const getStats = () => {
    const countTodos = (todo: Todo, includeChildren: boolean = true): { total: number; completed: number; pending: number } => {
      const isCompleted = todo.completed ? 1 : 0;
      const isPending = todo.completed ? 0 : 1;

      let childrenStats = { total: 0, completed: 0, pending: 0 };
      if (includeChildren && todo.children) {
        childrenStats = todo.children.reduce(
          (acc, child) => {
            const childStats = countTodos(child, includeChildren);
            return {
              total: acc.total + childStats.total,
              completed: acc.completed + childStats.completed,
              pending: acc.pending + childStats.pending
            };
          },
          { total: 0, completed: 0, pending: 0 }
        );
      }

      return {
        total: 1 + childrenStats.total,
        completed: isCompleted + childrenStats.completed,
        pending: isPending + childrenStats.pending
      };
    };

    const allStats = todos.reduce(
      (acc, todo) => {
        const todoStats = countTodos(todo);
        return {
          total: acc.total + todoStats.total,
          completed: acc.completed + todoStats.completed,
          pending: acc.pending + todoStats.pending
        };
      },
      { total: 0, completed: 0, pending: 0 }
    );

    const byCategory = categories.reduce((acc, category) => {
      const categoryTodos = todos.filter(todo => todo.categoryId === category.id);
      const categoryStats = categoryTodos.reduce(
        (acc, todo) => {
          const todoStats = countTodos(todo);
          return {
            total: acc.total + todoStats.total,
            completed: acc.completed + todoStats.completed,
            pending: acc.pending + todoStats.pending
          };
        },
        { total: 0, completed: 0, pending: 0 }
      );
      acc[category.id] = categoryStats;
      return acc;
    }, {} as Record<string, { total: number; completed: number; pending: number }>);

    return {
      ...allStats,
      byCategory
    };
  };

  const getTodosByCategory = () => {
    return categories.map(category => {
      const categoryTodos = todos.filter(todo => todo.categoryId === category.id && !todo.parentId);
      return {
        category,
        todos: categoryTodos
      };
    });
  };

  return {
    todos,
    categories,
    addTodo,
    addCategory,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    getStats,
    getTodosByCategory
  };
}