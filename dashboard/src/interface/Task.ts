export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO format
  labels?: string[];
  assignee?: string;
  checklist?: { id: string; title: string; done: boolean }[];
  comments?: {
    id: string;
    author: string;
    content: string;
    createdAt: string;
  }[];
}
