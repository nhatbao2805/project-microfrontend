import React, { useRef, useState } from 'react';
import { X, Trash2, Plus, Send } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Kiểu dữ liệu
interface ChecklistItem {
  id: string;
  title: string;
  done: boolean;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  assignee?: string;
  labels?: string[];
  checklist?: ChecklistItem[];
  comments?: Comment[];
}

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
  allUsers?: string[];
}

const TaskDetail: React.FC<TaskDetailModalProps> = ({
  task,
  onClose,
  onSave,
  allUsers = ['alice', 'bob', 'charlie'],
}) => {
  const [form, setForm] = useState<Task>(task);
  const [newLabel, setNewLabel] = useState('');
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [commentContent, setCommentContent] = useState('');

  const editorRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = <K extends keyof Task>(field: K, value: Task[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddLabel = () => {
    const trimmed = newLabel.trim();
    if (!trimmed || form.labels?.includes(trimmed)) return;
    handleChange('labels', [...(form.labels || []), trimmed]);
    setNewLabel('');
  };

  const handleRemoveLabel = (index: number) => {
    const updated = [...(form.labels || [])];
    updated.splice(index, 1);
    handleChange('labels', updated);
  };

  const handleAddChecklist = () => {
    const trimmed = newChecklistItem.trim();
    if (!trimmed) return;
    const newItem: ChecklistItem = {
      id: uuidv4(),
      title: trimmed,
      done: false,
    };
    handleChange('checklist', [...(form.checklist || []), newItem]);
    setNewChecklistItem('');
  };

  const handleToggleChecklist = (id: string) => {
    const updated = form.checklist?.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    handleChange('checklist', updated || []);
  };

  const handleRemoveChecklist = (id: string) => {
    const updated = form.checklist?.filter((item) => item.id !== id);
    handleChange('checklist', updated || []);
  };

  const handleInput = () => {
    const div = editorRef.current;
    if (!div) return;
    const text = div.innerText;

    const match = /@([\w]*)$/.exec(text);
    if (match) {
      const keyword = match[1].toLowerCase();
      const filtered = allUsers.filter((u) =>
        u.toLowerCase().startsWith(keyword)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const insertMention = (username: string) => {
    const div = editorRef.current;
    if (!div) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const text = div.innerText;
    const match = /@([\w]*)$/.exec(text);
    if (!match) return;

    const mentionStart = match.index;
    const mentionEnd = mentionStart + match[0].length;
    const before = text.slice(0, mentionStart);
    const after = text.slice(mentionEnd);

    div.innerText = before;

    const mentionSpan = document.createElement('span');
    mentionSpan.className = 'bg-blue-100 text-blue-700 px-1 rounded mr-1';
    mentionSpan.contentEditable = 'false';
    mentionSpan.innerText = `@${username}`;

    div.appendChild(mentionSpan);
    div.appendChild(document.createTextNode(' '));
    div.appendChild(document.createTextNode(after));

    const newRange = document.createRange();
    newRange.selectNodeContents(div);
    newRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(newRange);

    setShowSuggestions(false);
  };

  const handleSaveComment = () => {
    const div = editorRef.current;
    if (!div) return;

    const content = div.innerHTML.trim();
    if (!content) return;

    const newComment: Comment = {
      id: uuidv4(),
      author: 'currentUser',
      content,
      createdAt: new Date().toISOString(),
    };

    const updatedComments = [...(form.comments || []), newComment];
    handleChange('comments', updatedComments);

    div.innerHTML = '';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-4">Chi tiết công việc</h2>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <input
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full text-lg font-medium border-b border-gray-300 focus:outline-none focus:border-blue-500"
          />

          <textarea
            value={form.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full min-h-[80px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none text-sm"
            placeholder="Mô tả công việc..."
          />

          {/* Nhãn */}
          <div>
            <label className="text-sm text-gray-600">Nhãn</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddLabel();
                  }
                }}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none text-sm"
                placeholder="Nhập nhãn rồi nhấn Enter"
              />
              <button
                onClick={handleAddLabel}
                className="bg-gradient-to-tr from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-sm"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(form.labels || []).map((label, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {label}
                  <button
                    onClick={() => handleRemoveLabel(idx)}
                    className="text-blue-500 hover:text-red-500 text-xs"
                    title="Xóa"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div>
            <label className="text-sm text-gray-600">Checklist</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklist();
                  }
                }}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none text-sm"
                placeholder="Thêm checklist..."
              />
              <button
                onClick={handleAddChecklist}
                className="bg-gradient-to-tr from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-sm"
              >
                <Plus size={18} />
              </button>
            </div>
            <ul className="mt-2 space-y-2">
              {(form.checklist || []).map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md border"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => handleToggleChecklist(item.id)}
                    />
                    <span
                      className={item.done ? 'line-through text-gray-500' : ''}
                    >
                      {item.title}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveChecklist(item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Bình luận */}
          <div className="relative">
            <label className="text-sm text-gray-600">Bình luận</label>
            <div className="flex gap-2 mt-1">
              <div
                ref={editorRef}
                contentEditable
                className="flex-1 border border-gray-300 p-2 rounded-md min-h-[80px] text-sm focus:outline-none focus:ring-blue-500 focus:border-ring-blue-500 "
                onInput={handleInput}
                suppressContentEditableWarning
              ></div>
              {showSuggestions && (
                <ul className="absolute top-[50%] left-2 mt-1 bg-white border border-gray-300 rounded shadow-md z-50 w-full text-sm max-h-40 overflow-auto max-w-[200px]">
                  {suggestions.map((username) => (
                    <li
                      key={username}
                      onClick={() => insertMention(username)}
                      className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                    >
                      @{username}
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={handleSaveComment}
                className="bg-gradient-to-tr from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-sm"
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          {/* Danh sách bình luận */}
          <div className="mt-4 space-y-2">
            {(form.comments || []).map((comment) => (
              <div
                key={comment.id}
                className="border rounded p-3 text-sm space-y-1"
              >
                <div className="font-medium text-gray-800">
                  {comment.author}
                </div>
                <div
                  className="comment-content"
                  dangerouslySetInnerHTML={{ __html: comment.content }}
                />
                <div className="text-gray-400 text-xs">
                  {new Date(comment.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => onSave(form)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
