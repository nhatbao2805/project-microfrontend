import React from 'react';

interface MentionTagProps {
  username: string;
}

export const MentionTag: React.FC<MentionTagProps> = ({ username }) => {
  return (
    <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-md mr-1">
      @{username}
    </span>
  );
};
