"use client";

import { useState, useEffect } from 'react';
import { Todo, TodoCategory, TodoStats } from '@/lib/types';
import { TodoService } from '@/services/todoService';

export function useTodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<TodoCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  // 构建任务层级结构
  const buildTodoHierarchy = (flatTodos: Todo[]): Todo[] => {
    const todoMap = new Map<string, Todo>();
    const rootTodos: Todo[] = [];

    // 创建所有任务的映射
    flatTodos.forEach(todo => {
      todoMap.set(todo.id, { ...todo, children: [] });
    });

    // 构建层级关系
    flatTodos.forEach(todo => {
      const todoWithChildren = todoMap.get(todo.id)!;
      if (todo.parentId) {
        const parent = todoMap.get(todo.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(todoWithChildren);
        } else {
          // 如果找不到父任务，作为根任务处理
          rootTodos.push(todoWithChildren);
        }
      } else {
        // 根任务
        rootTodos.push(todoWithChildren);
      }
    });

    return rootTodos;
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [todosData, categoriesData] = await Promise.all([
        TodoService.getTodos(),
        TodoService.getCategories()
      ]);
      const hierarchicalTodos = buildTodoHierarchy(todosData);
      setTodos(hierarchicalTodos);
      setCategories(categoriesData);
    } catch (err) {
      console.error('加载数据失败:', err);
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (
    text: string,
    categoryId: string = 'wedding-other',
    priority?: Todo['priority'],
    parentId?: string,
    notes?: string,
    dueDate?: string
  ) => {
    try {
      setError(null);
      await TodoService.createTodo({
        text,
        categoryId,
        priority: priority || 'medium',
        parentId,
        notes,
        dueDate
      });
      // 重新加载数据以构建正确的层级结构
      await loadData();
    } catch (err) {
      console.error('创建任务失败:', err);
      setError(err instanceof Error ? err.message : '创建失败');
      throw err;
    }
  };

  const addCategory = async (name: string, color: string = 'gray', icon: string = '📦') => {
    try {
      setError(null);
      // 获取当前最大order
      const maxOrder = categories.length > 0 ? Math.max(...categories.map(c => c.order)) : 0;
      const newCategory = await TodoService.createCategory({
        name,
        color,
        icon,
        order: maxOrder + 1
      });
      setCategories(prev => [...prev, newCategory]);
    } catch (err) {
      console.error('创建分类失败:', err);
      setError(err instanceof Error ? err.message : '创建失败');
      throw err;
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      setError(null);
      const findTodoInHierarchy = (todoList: Todo[], targetId: string): Todo | null => {
        for (const todo of todoList) {
          if (todo.id === targetId) return todo;
          if (todo.children) {
            const found = findTodoInHierarchy(todo.children, targetId);
            if (found) return found;
          }
        }
        return null;
      };

      const todo = findTodoInHierarchy(todos, id);
      if (!todo) return;

      await TodoService.updateTodo(id, {
        completed: !todo.completed
      });
      // 重新加载数据以保持层级结构
      await loadData();
    } catch (err) {
      console.error('更新任务失败:', err);
      setError(err instanceof Error ? err.message : '更新失败');
      throw err;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setError(null);
      await TodoService.deleteTodo(id);
      // 重新加载数据以保持层级结构
      await loadData();
    } catch (err) {
      console.error('删除任务失败:', err);
      setError(err instanceof Error ? err.message : '删除失败');
      throw err;
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      setError(null);
      await TodoService.updateTodo(id, updates);
      // 重新加载数据以保持层级结构
      await loadData();
    } catch (err) {
      console.error('更新任务失败:', err);
      setError(err instanceof Error ? err.message : '更新失败');
      throw err;
    }
  };

  const clearCompleted = async () => {
    try {
      setError(null);
      const completedTodos = todos.filter(t => t.completed);
      await Promise.all(completedTodos.map(todo => TodoService.deleteTodo(todo.id)));
      setTodos(prev => prev.filter(t => !t.completed));
    } catch (err) {
      console.error('清除已完成任务失败:', err);
      setError(err instanceof Error ? err.message : '清除失败');
      throw err;
    }
  };

  // 扁平化层级结构中的所有任务
  const flattenTodos = (todoList: Todo[]): Todo[] => {
    const result: Todo[] = [];
    const traverse = (todos: Todo[]) => {
      todos.forEach(todo => {
        result.push(todo);
        if (todo.children) {
          traverse(todo.children);
        }
      });
    };
    traverse(todoList);
    return result;
  };

  const getStats = (): TodoStats => {
    const allTodos = flattenTodos(todos);
    const stats = {
      total: allTodos.length,
      completed: allTodos.filter(t => t.completed).length,
      pending: allTodos.filter(t => !t.completed).length,
      byCategory: {} as Record<string, { total: number; completed: number; pending: number }>
    };

    // 按分类统计
    categories.forEach(category => {
      const categoryTodos = allTodos.filter(t => t.categoryId === category.id);
      stats.byCategory[category.id] = {
        total: categoryTodos.length,
        completed: categoryTodos.filter(t => t.completed).length,
        pending: categoryTodos.filter(t => !t.completed).length
      };
    });

    return stats;
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

  const refetch = () => {
    loadData();
  };

  return {
    todos,
    categories,
    loading,
    error,
    addTodo,
    addCategory,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    getStats,
    getTodosByCategory,
    refetch
  };
}