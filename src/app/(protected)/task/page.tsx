"use client";

import { useState } from 'react';
import { useTodoList, Todo } from "@/hooks/useTodoList";
import TodoItem from "@/components/TodoItem";

export default function TaskPage() {
  const { todos, addTodo, toggleTodo, deleteTodo, getStats } = useTodoList();
  const [newTodoText, setNewTodoText] = useState('');

  const stats = getStats();
  const pendingTodos = todos.filter(todo => !todo.completed && !todo.parentId); // 只显示顶级待完成任务
  const completedTodos = todos.filter(todo => todo.completed);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      addTodo(newTodoText.trim(), 'wedding-other');
      setNewTodoText('');
    }
  };

  const handleAddSubtask = (parentId: string, text: string) => {
    addTodo(text, 'wedding-other', undefined, parentId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 from-gray-900 to-gray-800 p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-800 text-stone-100 font-playfair text-center mb-8">任务清单</h1>

        {/* 统计 */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass-panel rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-rose-600 text-rose-400">{stats.total}</div>
            <div className="text-xs text-stone-600 text-stone-400">总任务</div>
          </div>
          <div className="glass-panel rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-blue-600 text-blue-400">{stats.pending}</div>
            <div className="text-xs text-stone-600 text-stone-400">待完成</div>
          </div>
          <div className="glass-panel rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-green-600 text-green-400">{stats.completed}</div>
            <div className="text-xs text-stone-600 text-stone-400">已完成</div>
          </div>
        </div>

        {/* 新建任务 */}
        <div className="glass-panel rounded-xl p-4 mb-6">
          <form onSubmit={handleAddTodo} className="flex gap-3">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="添加新任务..."
              className="flex-1 px-3 py-2 rounded-lg border border-stone-200 border-stone-600 bg-white bg-stone-800 text-stone-800 text-stone-200 focus:border-rose-300 focus:outline-none transition-all text-sm placeholder-stone-400 placeholder-stone-500"
            />

            <button
              type="submit"
              className="gradient-rose text-white px-4 py-2 rounded-lg font-medium text-sm hover:shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              添加任务
            </button>
          </form>
        </div>

        {/* 任务列表 */}
        {pendingTodos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-stone-700 text-stone-300 mb-4">
              待完成任务 ({pendingTodos.length})
            </h2>
            <div className="space-y-3">
              {pendingTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onAddSubtask={handleAddSubtask}
                />
              ))}
            </div>
          </div>
        )}

        {/* 已完成任务 */}
        {completedTodos.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-stone-500 text-stone-400 mb-4">
              已完成任务 ({completedTodos.length})
            </h2>
            <div className="space-y-3">
              {completedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onAddSubtask={handleAddSubtask}
                />
              ))}
            </div>
          </div>
        )}

        {/* 空状态 */}
        {todos.length === 0 && (
          <div className="text-center py-12 glass-panel rounded-xl">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-stone-500 text-stone-400 text-sm">
              暂无任务，开始添加您的第一个任务吧！
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
