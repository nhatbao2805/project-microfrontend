import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Kanban,
  Users,
  Calendar,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Star,
  Clock,
  CheckCircle,
} from "lucide-react";
import { createBoard, getListBoard } from "../../services/board.service";
import { useNavigate } from "react-router-dom";

type Board = {
  id: string;
  name: string;
  description?: string;
  taskCount?: number;
  memberCount?: number;
  lastUpdated?: string;
  isFavorite?: boolean;
  color?: string;
};

export default function BoardList() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardDescription, setNewBoardDescription] = useState("");
  const [newBoardColor, setNewBoardColor] = useState("#3B82F6");
  const [isCreating, setIsCreating] = useState(false);
  const nav = useNavigate();

  const boardColors = [
    { name: "Blue", value: "#3B82F6", bg: "bg-blue-500" },
    { name: "Green", value: "#10B981", bg: "bg-green-500" },
    { name: "Purple", value: "#8B5CF6", bg: "bg-purple-500" },
    { name: "Orange", value: "#F59E0B", bg: "bg-orange-500" },
    { name: "Red", value: "#EF4444", bg: "bg-red-500" },
    { name: "Pink", value: "#EC4899", bg: "bg-pink-500" },
  ];

  const fetchData = async () => {
    try {
      const response = await getListBoard();
      console.log(response.data);
      if (response.data) {
        // Add mock data for demo
        const boardsWithMockData = response.data.map((board: any) => ({
          ...board,
          description: board.description || "Project management board",
          taskCount: Math.floor(Math.random() * 50) + 5,
          memberCount: Math.floor(Math.random() * 8) + 1,
          lastUpdated: new Date().toISOString(),
          isFavorite: Math.random() > 0.7,
          color:
            boardColors[Math.floor(Math.random() * boardColors.length)].value,
        }));
        setBoards(boardsWithMockData);
      }
    } catch (error) {
      console.log("Error fetching boards:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;
    setIsCreating(true);

    try {
      const response = await createBoard(newBoardName);
      console.log(response);
      if (response.data) {
        const newBoard = {
          id: response.data.id || Date.now().toString(),
          name: newBoardName,
          description: newBoardDescription,
          taskCount: 0,
          memberCount: 1,
          lastUpdated: new Date().toISOString(),
          isFavorite: false,
          color: newBoardColor,
        };

        setBoards([...boards, newBoard]);
        setNewBoardName("");
        setNewBoardDescription("");
        setNewBoardColor("#3B82F6");
        setShowModal(false);
      }
    } catch (error) {
      console.log("Error creating board:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
              Kanban Boards
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your projects with visual task boards
            </p>
          </div>
          <div className="mt-4 lg:mt-0">
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create Board</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 ring-1 ring-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Boards</p>
              <p className="text-3xl font-bold text-gray-900">
                {boards.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Kanban className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 ring-1 ring-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-3xl font-bold text-green-600">
                {boards.reduce((sum, board) => sum + (board.taskCount || 0), 0)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 ring-1 ring-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-3xl font-bold text-purple-600">
                {boards.reduce(
                  (sum, board) => sum + (board.memberCount || 0),
                  0
                )}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Boards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {boards.map((board, index) => (
          <motion.div
            key={board.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 ring-1 ring-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
            onClick={() => nav(`/board/${board.id}`)}
          >
            {/* Board Header */}
            <div
              className="h-20 p-4 flex items-center justify-between"
              style={{ backgroundColor: board.color + "20" }}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: board.color }}
                >
                  <Kanban className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {board.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {board.description || "Project board"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {board.isFavorite && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                )}
                <button className="p-1 hover:bg-white/60 rounded-lg transition-colors">
                  <MoreHorizontal className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Board Stats */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">
                    {board.taskCount || 0} tasks
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    {board.memberCount || 0} members
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {formatLastUpdated(board.lastUpdated || "")}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: board.color }}
                  />
                  <span className="text-xs text-gray-500">Active</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Create New Board Card */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 + boards.length * 0.1 }}
          onClick={() => setShowModal(true)}
          className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 group"
        >
          <div className="p-4 bg-gray-100 rounded-xl group-hover:bg-blue-100 transition-colors">
            <Plus className="h-8 w-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </div>
          <span className="mt-4 text-gray-500 group-hover:text-blue-600 font-medium transition-colors">
            Create New Board
          </span>
        </motion.button>
      </motion.div>

      {/* Create Board Modal */}
      <AnimatePresence>
        {showModal && (
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
              className="bg-white rounded-2xl shadow-xl w-full max-w-md ring-1 ring-gray-100"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Create New Board
                </h3>

                <div className="space-y-4">
                  {/* Board Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Board Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter board name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl ring-1 ring-inset ring-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-blue"
                      value={newBoardName}
                      onChange={(e) => setNewBoardName(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleCreateBoard()
                      }
                      autoFocus
                    />
                  </div>

                  {/* Board Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      placeholder="Describe your board"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl ring-1 ring-inset ring-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-blue resize-none"
                      value={newBoardDescription}
                      onChange={(e) => setNewBoardDescription(e.target.value)}
                    />
                  </div>

                  {/* Color Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Board Color
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {boardColors.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setNewBoardColor(color.value)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                            newBoardColor === color.value
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div
                            className={`h-6 w-6 rounded-lg mx-auto ${color.bg}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setNewBoardName("");
                      setNewBoardDescription("");
                      setNewBoardColor("#3B82F6");
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateBoard}
                    disabled={!newBoardName.trim() || isCreating}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isCreating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      "Create Board"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
