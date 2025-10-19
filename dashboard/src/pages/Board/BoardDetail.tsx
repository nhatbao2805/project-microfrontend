import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { Task } from "../../interface/Task";
import TaskDetail from "../Task/TaskDetail";
import { getDetailBoard } from "../../services/board.service";
import { useParams } from "react-router-dom";

type List = {
  id: string;
  name: string;
  tasks: Task[];
};

const BoardDetail: React.FC = () => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const { boardId } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDetailBoard(boardId || "");
        if (response.data) {
          console.log("response", response);
          setLists(response.data.lists);
        }
      } catch (error) {
        console.log("error", error);
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
    setNewColumnTitle("");
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

    if (type === "COLUMN") {
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
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <input
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          placeholder="New column title..."
          className="border border-gray-200 ring-1 ring-inset ring-gray-100 px-4 py-2.5 rounded-xl w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddColumn}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium shadow hover:shadow-md transition"
        >
          + Add Column
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided) => (
            <div
              className="flex gap-4 overflow-x-auto pb-2"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {lists.map((list, index) => (
                <Draggable key={list.id} draggableId={list.id} index={index}>
                  {(provided) => (
                    <div
                      className="bg-white w-72 flex-shrink-0 rounded-2xl shadow-sm ring-1 ring-gray-100 border border-gray-200 p-3"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <div
                          className="text-sm font-semibold cursor-move text-gray-900 px-2 py-1 rounded"
                          {...provided.dragHandleProps}
                        >
                          {list.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            className="px-2 py-1 text-xs rounded-lg hover:bg-gray-100 text-gray-600"
                            title="Add card"
                            onClick={() => setActiveTask({ id: "", title: "" })}
                          >
                            + Card
                          </button>
                          <button
                            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
                            title="More"
                          >
                            ⋯
                          </button>
                        </div>
                      </div>

                      <Droppable droppableId={list.id} type="TASK">
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`min-h-[50px] space-y-3 rounded-xl p-1 ${
                              snapshot.isDraggingOver ? "bg-blue-50" : ""
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
                                      className={`p-3 rounded-xl bg-gray-50 shadow-sm border border-gray-200 hover:bg-gray-100 transition ${
                                        snapshot.isDragging ? "bg-blue-100" : ""
                                      }`}
                                    >
                                      <div className="text-sm font-medium text-gray-800">
                                        {task.title}
                                      </div>
                                      <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-500">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded">
                                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                          Todo
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded">
                                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                          0/1
                                        </span>
                                      </div>
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
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd(title.trim());
    setTitle("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="mt-2 w-full text-left text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
      >
        + Add a card
      </button>
    );
  }

  return (
    <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-2">
      <textarea
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        rows={3}
        placeholder="Enter a title for this card..."
        className="w-full resize-none border border-gray-200 ring-1 ring-inset ring-gray-100 px-3 py-2 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex items-center gap-2">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-lg transition"
        >
          Add card
        </button>
        <button
          onClick={() => {
            setIsOpen(false);
            setTitle("");
          }}
          className="text-sm text-gray-600 hover:text-gray-800 px-2 py-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BoardDetail;
