'use client';

import { useState } from 'react';
import { Todo } from '@/hooks/useTodoList';

interface TodoItemProps {
  todo: Todo;
  level?: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddSubtask: (parentId: string, text: string) => void;
}

export default function TodoItem({
  todo,
  level = 0,
  onToggle,
  onDelete,
  onAddSubtask
}: TodoItemProps) {
  const [showSubtaskInput, setShowSubtaskInput] = useState(false);
  const [subtaskText, setSubtaskText] = useState('');
  const [expanded, setExpanded] = useState(true);

  const hasChildren = todo.children && todo.children.length > 0;
  const completedSubtasks = hasChildren ? todo.children.filter(child => child.completed).length : 0;
  const progressPercent = hasChildren ? (completedSubtasks / todo.children.length) * 100 : 0;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (subtaskText.trim()) {
      onAddSubtask(todo.id, subtaskText.trim());
      setSubtaskText('');
      setShowSubtaskInput(false);
    }
  };

  return (
    <div className={`${level > 0 ? 'ml-4' : ''} mb-4`}>
      <div
        className={`glass-panel rounded-xl overflow-hidden transition-all hover:shadow-sm ${
          todo.completed ? 'bg-green-50 border-green-200' : ''
        }`}
      >
        {/* 任务头部 */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            {/* 展开/收起按钮 */}
            {hasChildren && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-stone-400 hover:text-stone-600 transition-colors transform transition-transform"
                style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* 完成状态复选框 */}
            <button
              onClick={() => onToggle(todo.id)}
              className={`w-5 h-5 rounded-full border-2 transition-all ${
                todo.completed
                  ? 'bg-green-500 border-green-500 flex items-center justify-center'
                  : 'border-stone-300 hover:border-stone-400'
              }`}
            >
              {todo.completed && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            {/* 任务文本 */}
            <div className="flex-1">
              <p className={`text-sm ${todo.completed ? 'line-through text-stone-500' : 'text-stone-700'}`}>
                {todo.text}
              </p>

              {/* 进度条 */}
              {hasChildren && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span>进度:</span>
                    <span>{completedSubtasks}/{todo.children?.length}</span>
                    <span>({Math.round(progressPercent)}%)</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 添加子任务按钮 */}
            {!todo.completed && (
              <button
                onClick={() => setShowSubtaskInput(!showSubtaskInput)}
                className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                title="添加子任务"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}

            {/* 删除按钮 */}
            <button
              onClick={() => onDelete(todo.id)}
              className="p-2 text-stone-400 hover:text-red-500 transition-colors"
              title="删除任务"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 子任务输入 */}
          {showSubtaskInput && (
            <form onSubmit={handleAddSubtask} className="mt-2 px-4 flex gap-2">
              <input
                type="text"
                value={subtaskText}
                onChange={(e) => setSubtaskText(e.target.value)}
                placeholder="输入子任务内容"
                className="flex-1 px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-rose-400"
                autoFocus
              />
              <button
                type="submit"
                className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                title="保存"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSubtaskInput(false);
                  setSubtaskText('');
                }}
                className="p-1 text-stone-400 hover:text-stone-700 transition-colors"
                title="取消"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </form>
          )}
        </div>

        {/* 子任务列表 - 在同一个框内 */}
        {hasChildren && expanded && (
          <div className="subtasks-container border-t border-stone-200 bg-stone-50 bg-opacity-50">
            <div className="p-4 space-y-2">
              {todo.children?.map((child) => (
                <div key={child.id} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                  {/* 完成状态复选框 */}
                  <button
                    onClick={() => onToggle(child.id)}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      child.completed
                        ? 'bg-green-500 border-green-500 flex items-center justify-center'
                        : 'border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    {child.completed && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* 子任务文本 */}
                  <span className={`text-sm flex-1 ${
                    child.completed ? 'line-through text-stone-500' : 'text-stone-700'
                  }`}>
                    {child.text}
                  </span>

                  {/* 删除按钮 */}
                  <button
                    onClick={() => onDelete(child.id)}
                    className="p-1 text-stone-400 hover:text-red-500 transition-colors"
                    title="删除子任务"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}