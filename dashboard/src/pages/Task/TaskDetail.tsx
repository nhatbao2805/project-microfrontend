import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  Plus,
  Send,
  Calendar,
  User,
  Tag,
  CheckSquare,
  MessageSquare,
  Save,
  Clock,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

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
  allUsers = ["alice", "bob", "charlie"],
}) => {
  const [form, setForm] = useState<Task>(task);
  const [newLabel, setNewLabel] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [commentContent, setCommentContent] = useState("");

  const editorRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = <K extends keyof Task>(field: K, value: Task[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddLabel = () => {
    const trimmed = newLabel.trim();
    if (!trimmed || form.labels?.includes(trimmed)) return;
    handleChange("labels", [...(form.labels || []), trimmed]);
    setNewLabel("");
  };

  const handleRemoveLabel = (index: number) => {
    const updated = [...(form.labels || [])];
    updated.splice(index, 1);
    handleChange("labels", updated);
  };

  const handleAddChecklist = () => {
    const trimmed = newChecklistItem.trim();
    if (!trimmed) return;
    const newItem: ChecklistItem = {
      id: uuidv4(),
      title: trimmed,
      done: false,
    };
    handleChange("checklist", [...(form.checklist || []), newItem]);
    setNewChecklistItem("");
  };

  const handleToggleChecklist = (id: string) => {
    const updated = form.checklist?.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    handleChange("checklist", updated || []);
  };

  const handleRemoveChecklist = (id: string) => {
    const updated = form.checklist?.filter((item) => item.id !== id);
    handleChange("checklist", updated || []);
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

    const mentionSpan = document.createElement("span");
    mentionSpan.className = "bg-blue-100 text-blue-700 px-1 rounded mr-1";
    mentionSpan.contentEditable = "false";
    mentionSpan.innerText = `@${username}`;

    div.appendChild(mentionSpan);
    div.appendChild(document.createTextNode(" "));
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
      author: "currentUser",
      content,
      createdAt: new Date().toISOString(),
    };

    const updatedComments = [...(form.comments || []), newComment];
    handleChange("comments", updatedComments);

    div.innerHTML = "";
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Task Details</h2>
                  <p className="text-blue-100 text-sm">
                    Manage your task information
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto">
            {/* Task Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Task Title
              </label>
              <input
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full text-xl font-semibold border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 rounded-lg px-3 py-2 cursor-blue"
                placeholder="Enter task title..."
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={form.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full min-h-[100px] border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-blue resize-none"
                placeholder="Describe your task..."
              />
            </div>

            {/* Due Date and Assignee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Due Date
                </label>
                <input
                  type="date"
                  value={form.dueDate || ""}
                  onChange={(e) => handleChange("dueDate", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-blue"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <User className="h-4 w-4 inline mr-2" />
                  Assignee
                </label>
                <select
                  value={form.assignee || ""}
                  onChange={(e) => handleChange("assignee", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-blue"
                >
                  <option value="">Select assignee</option>
                  {allUsers.map((user) => (
                    <option key={user} value={user}>
                      {user}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Labels */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                <Tag className="h-4 w-4 inline mr-2" />
                Labels
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddLabel();
                    }
                  }}
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-blue"
                  placeholder="Enter label and press Enter"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddLabel}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </motion.button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.labels || []).map((label, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-2 border border-blue-200"
                  >
                    {label}
                    <button
                      onClick={() => handleRemoveLabel(idx)}
                      className="text-blue-500 hover:text-red-500 text-sm font-bold"
                      title="Remove"
                    >
                      ×
                    </button>
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                <CheckSquare className="h-4 w-4 inline mr-2" />
                Checklist
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddChecklist();
                    }
                  }}
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-blue"
                  placeholder="Add checklist item..."
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddChecklist}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </motion.button>
              </div>
              <div className="space-y-2">
                {(form.checklist || []).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => handleToggleChecklist(item.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span
                        className={`${
                          item.done
                            ? "line-through text-gray-500"
                            : "text-gray-900"
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRemoveChecklist(item.id)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                <MessageSquare className="h-4 w-4 inline mr-2" />
                Comments
              </label>
              <div className="relative">
                <div
                  ref={editorRef}
                  contentEditable
                  className="flex-1 border border-gray-300 rounded-xl p-4 min-h-[100px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-blue empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
                  onInput={handleInput}
                  suppressContentEditableWarning
                  data-placeholder="Add a comment..."
                />
                {showSuggestions && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-full max-w-[250px] max-h-40 overflow-auto"
                  >
                    {suggestions.map((username) => (
                      <li
                        key={username}
                        onClick={() => insertMention(username)}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                      >
                        @{username}
                      </li>
                    ))}
                  </motion.ul>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveComment}
                  className="absolute bottom-3 right-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {(form.comments || []).map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {comment.author.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">
                          {comment.author}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500 text-sm">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div
                      className="text-gray-700 text-sm comment-content"
                      dangerouslySetInnerHTML={{ __html: comment.content }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSave(form)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskDetail;
