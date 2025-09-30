import React, { useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../../interface/Task';
import TaskDetail from '../Task/TaskDetail';
import { getDetailBoard } from '../../services/board.service';
import { useParams } from 'react-router-dom';

type List = {
  id: string;
  name: string;
  tasks: Task[];
};

const BoardDetail: React.FC = () => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const { boardId } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDetailBoard(boardId || '');
        if (response.data) {
          console.log('response', response);
          setLists(response.data.lists);
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchData();
  }, []);

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;
    const newList: List = {
      id: uuidv4(),
      name: newColumnTitle.trim(),
      tasks: [],
    };
    setLists((prev) => [...prev, newList]);
    setNewColumnTitle('');
  };

  const handleAddTask = (listId: string, title: string) => {
    if (!title.trim()) return;
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              tasks: [...list.tasks, { id: uuidv4(), title }],
            }
          : list
      )
    );
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === 'COLUMN') {
      const reordered = [...lists];
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);
      setLists(reordered);
      return;
    }

    const sourceListIndex = lists.findIndex(
      (list) => list.id === source.droppableId
    );
    const destListIndex = lists.findIndex(
      (list) => list.id === destination.droppableId
    );

    const sourceList = lists[sourceListIndex];
    const destList = lists[destListIndex];

    const sourceTasks = [...sourceList.tasks];
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (sourceList.id === destList.id) {
      sourceTasks.splice(destination.index, 0, movedTask);
      const updatedLists = [...lists];
      updatedLists[sourceListIndex] = {
        ...sourceList,
        tasks: sourceTasks,
      };
      setLists(updatedLists);
    } else {
      const destTasks = [...destList.tasks];
      destTasks.splice(destination.index, 0, movedTask);
      const updatedLists = [...lists];
      updatedLists[sourceListIndex] = {
        ...sourceList,
        tasks: sourceTasks,
      };
      updatedLists[destListIndex] = {
        ...destList,
        tasks: destTasks,
      };
      setLists(updatedLists);
    }
  };

  const handleSaveTask = () => {};

  return (
    <div className="p-6">
      <div className="mb-6">
        <input
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          placeholder="Tên cột mới..."
          className="border px-3 py-2 mr-2 rounded w-60"
        />
        <button
          onClick={handleAddColumn}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Thêm cột
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided) => (
            <div
              className="flex gap-4 overflow-x-auto"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {lists.map((list, index) => (
                <Draggable key={list.id} draggableId={list.id} index={index}>
                  {(provided) => (
                    <div
                      className="bg-white w-72 flex-shrink-0 rounded-lg shadow p-4"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div
                        className="text-lg font-semibold mb-3 cursor-move"
                        {...provided.dragHandleProps}
                      >
                        {list.name}
                      </div>

                      <Droppable droppableId={list.id} type="TASK">
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`min-h-[50px] space-y-3 ${
                              snapshot.isDraggingOver ? 'bg-blue-50' : ''
                            }`}
                          >
                            {list.tasks &&
                              list.tasks.map((task, taskIndex) => (
                                <Draggable
                                  key={task.id}
                                  draggableId={task.id}
                                  index={taskIndex}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      onClick={() => {
                                        setActiveTask(task);
                                      }}
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`p-3 rounded bg-gray-100 shadow-sm border ${
                                        snapshot.isDragging ? 'bg-blue-100' : ''
                                      }`}
                                    >
                                      {task.title}
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      {/* Form thêm task */}
                      <AddTaskForm
                        onAdd={(title) => handleAddTask(list.id, title)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {activeTask && (
        <TaskDetail
          task={activeTask}
          onClose={() => setActiveTask(null)}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

// Sub component
const AddTaskForm: React.FC<{ onAdd: (title: string) => void }> = ({
  onAdd,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd(title);
    setTitle('');
  };

  return (
    <div className="mt-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Thêm task..."
        className="border px-2 py-1 rounded w-full mb-2"
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-gray-200 hover:bg-gray-300 text-sm px-2 py-1 rounded"
      >
        + Thêm task
      </button>
    </div>
  );
};

export default BoardDetail;
