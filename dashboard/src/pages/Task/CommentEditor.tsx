import React, { useState } from 'react';

interface CommentEditorProps {
  onSubmit: (content: string) => void;
  users?: string[];
}

export const CommentEditor: React.FC<CommentEditorProps> = ({
  onSubmit,
  users,
}) => {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (value.trim()) {
      onSubmit(value);
      setValue('');
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
        placeholder="Viết bình luận..."
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
      >
        Gửi
      </button>
    </div>
  );
};
