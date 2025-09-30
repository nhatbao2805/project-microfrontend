import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { createBoard, getListBoard } from '../../services/board.service';
import { useNavigate } from 'react-router-dom';

type Board = {
  id: string;
  name: string;
};

export default function BoardList() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const nav = useNavigate();
  const fetchData = async () => {
    try {
      const response = await getListBoard();
      console.log(response.data);
      if (response.data) {
        setBoards(response.data);
      }
    } catch (error) {
      console.log('Đăng ký thành công:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;
    setShowModal(false);
    try {
      const response = await createBoard(newBoardName);
      console.log(response);
      if (response.data) {
        setNewBoardName('');
        setBoards([...boards, { id: '', name: newBoardName }]);
      }
    } catch (error) {
      console.log('Đăng ký thành công:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        📋 Danh sách Board
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {boards.map((board) => (
          <div
            key={board.id}
            className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition"
            onClick={() => nav(`/board/${board.id}`)}
          >
            <h2 className="text-lg font-semibold text-gray-700">
              {board.name}
            </h2>
          </div>
        ))}

        {/* Add new board card */}
        <button
          onClick={() => setShowModal(true)}
          className="border-2 border-dashed border-blue-400 rounded-xl flex flex-col items-center justify-center p-6 hover:bg-blue-50 transition"
        >
          <Plus size={32} className="text-blue-500" />
          <span className="mt-2 text-blue-500 font-semibold">
            Tạo board mới
          </span>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Tạo board mới</h3>
            <input
              type="text"
              placeholder="Nhập tên board"
              className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring focus:ring-blue-400"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewBoardName('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateBoard}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
