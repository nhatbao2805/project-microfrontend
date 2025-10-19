import React, { useMemo, useState } from "react";
import {
  createSchedule,
  CreateScheduleDto,
} from "../../services/schedule.service";
type DayTask = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description?: string;
  startAt?: string; // ISO string
  endAt?: string; // ISO string
  isDone?: boolean;
  meetingLink?: string; // Meeting link (Zoom, Google Meet, etc.)
};

export default function SchedulePage() {
  const today = new Date();
  const [current, setCurrent] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tasksByDate, setTasksByDate] = useState<Record<string, DayTask[]>>({});
  const [formValues, setFormValues] = useState({
    date: "",
    title: "",
    description: "",
    startAt: "",
    endAt: "",
    isDone: false,
    meetingLink: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<DayTask | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);

  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const gridDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < startWeekday; i++) {
      days.push(new Date(year, month, i - startWeekday + 1));
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d));
    }
    while (days.length % 7 !== 0) {
      const last = days[days.length - 1];
      days.push(
        new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1)
      );
    }
    return days;
  }, [year, month, startWeekday, daysInMonth]);

  const formatKey = (d: Date) => d.toISOString().slice(0, 10);

  const isSameMonth = (d: Date) => d.getMonth() === month;

  const isToday = (d: Date) =>
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();

  const canClickDate = (d: Date) => {
    // So sánh với ngày hiện tại thực tế, không phụ thuộc vào tháng đang xem
    const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    // Ngày hiện tại và tương lai luôn click được
    if (dateOnly >= todayOnly) return true;

    // Ngày quá khứ chỉ click được nếu có task
    const key = formatKey(d);
    const tasks = tasksByDate[key] || [];
    return tasks.length > 0;
  };

  const gotoPrev = () => setCurrent(new Date(year, month - 1, 1));
  const gotoNext = () => setCurrent(new Date(year, month + 1, 1));
  const gotoToday = () =>
    setCurrent(new Date(today.getFullYear(), today.getMonth(), 1));
  const toVietnamISOString = (date: Date): string => {
    const offsetMs = 7 * 60 * 60 * 1000; // UTC+7
    const vnTime = new Date(date.getTime() + offsetMs);
    const iso = vnTime.toISOString().slice(0, 19); // "YYYY-MM-DDTHH:mm:ss"
    return `${iso}+07:00`;
  };
  const formatVNDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const openAddTask = (d: Date) => {
    if (!canClickDate(d)) return;
    setSelectedDate(d);
    setFormValues({
      date: d.toISOString().split("T")[0],
      title: "",
      description: "",
      startAt: "",
      endAt: "",
      isDone: false,
      meetingLink: "",
    });
    setShowAddModal(true);
  };

  const addTask = async () => {
    if (!selectedDate || !formValues.title.trim()) return;
    const key = formatKey(selectedDate);
    const isoDate = key;
    setTasksByDate((prev) => ({
      ...prev,
      [key]: [
        ...(prev[key] || []),
        {
          id: Math.random().toString(36).slice(2),
          date: isoDate,
          title: formValues.title.trim().slice(0, 200),
          description: formValues.description.trim()
            ? formValues.description.trim().slice(0, 2000)
            : undefined,
          startAt: formValues.startAt || undefined,
          endAt: formValues.endAt || undefined,
          isDone: formValues.isDone || false,
          meetingLink: formValues.meetingLink.trim() || undefined,
        },
      ],
    }));
    const payload: CreateScheduleDto = {
      date: formatVNDate(selectedDate),
      title: formValues.title.trim().slice(0, 200),
      description: formValues.description?.trim()
        ? formValues.description.trim().slice(0, 2000)
        : undefined,
      startAt: formValues.startAt
        ? toVietnamISOString(new Date(formValues.startAt))
        : "",
      endAt: formValues.endAt
        ? toVietnamISOString(new Date(formValues.endAt))
        : "",
      isDone: formValues.isDone || false,
      meetingLink: formValues.meetingLink.trim() || "",
    };

    setFormValues({
      date: "",
      title: "",
      description: "",
      startAt: "",
      endAt: "",
      isDone: false,
      meetingLink: "",
    });
    setShowAddModal(false);
    try {
      const response = await createSchedule(payload);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = (date: string, taskId: string) => {
    setTasksByDate((prev) => ({
      ...prev,
      [date]: (prev[date] || []).filter((t) => t.id !== taskId),
    }));
  };

  const openTaskDetail = (task: DayTask) => {
    setSelectedTask(task);
    setShowTaskDetail(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            My Schedule
          </h1>
          <p className="text-gray-600">Plan your days efficiently</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex items-center justify-between">
          <button
            onClick={gotoPrev}
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 font-medium transition-all hover:scale-105"
          >
            ← Prev
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {new Date(year, month).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={gotoToday}
              className="px-4 py-2 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium transition-all hover:scale-105"
            >
              Today
            </button>
            <button
              onClick={gotoNext}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 font-medium transition-all hover:scale-105"
            >
              Next →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl border border-blue-100 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Calendar
              </h2>
              <p className="text-sm text-gray-600">
                Click on any date to view or add tasks
              </p>
            </div>

            <div className="grid grid-cols-7 text-xs font-bold text-gray-700 mb-3 px-1">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                <div key={d} className="text-center py-2">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {gridDays.map((d, idx) => {
                const key = formatKey(d);
                const tasks = tasksByDate[key] || [];
                const hasTask = tasks.length > 0;
                const isSelected =
                  selectedDate && formatKey(selectedDate) === key;
                const clickable = canClickDate(d);

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (clickable) {
                        setSelectedDate(d);
                      }
                    }}
                    className={`relative h-20 rounded-2xl text-center p-2 transition-all duration-200 ${
                      clickable
                        ? isSelected
                          ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg scale-105"
                          : isSameMonth(d)
                          ? "bg-white hover:bg-blue-50 border-2 border-transparent hover:border-blue-200"
                          : "bg-gray-50 hover:bg-blue-50 border-2 border-transparent hover:border-blue-200 text-gray-600"
                        : isSameMonth(d)
                        ? "bg-gray-50 text-gray-400 cursor-not-allowed opacity-60"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-40"
                    } ${
                      isToday(d) && !isSelected ? "ring-2 ring-blue-400" : ""
                    }`}
                    disabled={!clickable}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <span
                        className={`text-lg font-bold mb-1 ${
                          isSelected
                            ? "text-white"
                            : clickable
                            ? isSameMonth(d)
                              ? "text-gray-800"
                              : "text-gray-600"
                            : "text-gray-400"
                        }`}
                      >
                        {d.getDate()}
                      </span>
                      {hasTask && (
                        <div className="flex gap-0.5">
                          {tasks.slice(0, 3).map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSelected ? "bg-white" : "bg-blue-500"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    {isToday(d) && !isSelected && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Has Tasks</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>Today</span>
              </div>
            </div>
          </div>

          <div className="col-span-1 bg-white rounded-3xl shadow-xl border border-gray-200 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedDate
                    ? selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })
                    : "Select a date"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedDate
                    ? `${
                        (tasksByDate[formatKey(selectedDate)] || []).length
                      } task(s)`
                    : "Click on a calendar date"}
                </p>
              </div>
              {selectedDate && (
                <button
                  onClick={() => openAddTask(selectedDate)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  + Add Task
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {selectedDate ? (
                (tasksByDate[formatKey(selectedDate)] || []).length > 0 ? (
                  <div className="space-y-4">
                    {(tasksByDate[formatKey(selectedDate)] || [])
                      .filter((t) => t.startAt || t.endAt)
                      .sort((a, b) => {
                        const timeA = a.startAt
                          ? new Date(a.startAt).getTime()
                          : 0;
                        const timeB = b.startAt
                          ? new Date(b.startAt).getTime()
                          : 0;
                        return timeA - timeB;
                      })
                      .map((t) => (
                        <div
                          key={t.id}
                          onClick={() => openTaskDetail(t)}
                          className={`p-4 rounded-2xl border-2 transition-all hover:shadow-lg cursor-pointer ${
                            t.isDone
                              ? "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 opacity-75"
                              : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={!!t.isDone}
                              onChange={(e) => {
                                e.stopPropagation();
                                const key = t.date;
                                setTasksByDate((prev) => ({
                                  ...prev,
                                  [key]: (prev[key] || []).map((x) =>
                                    x.id === t.id
                                      ? { ...x, isDone: e.target.checked }
                                      : x
                                  ),
                                }));
                              }}
                              className="mt-1 h-5 w-5 text-blue-600 rounded-lg border-gray-300 cursor-pointer"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span>
                                    {t.startAt
                                      ? new Date(t.startAt).toLocaleTimeString(
                                          [],
                                          {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          }
                                        )
                                      : "--:--"}
                                    {" → "}
                                    {t.endAt
                                      ? new Date(t.endAt).toLocaleTimeString(
                                          [],
                                          {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          }
                                        )
                                      : "--:--"}
                                  </span>
                                </div>
                                {t.isDone && (
                                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                    ✓ Completed
                                  </span>
                                )}
                              </div>
                              <h3
                                className={`font-semibold text-gray-900 mb-1 ${
                                  t.isDone ? "line-through text-gray-500" : ""
                                }`}
                              >
                                {t.title}
                              </h3>
                              {t.description && (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {t.description}
                                </p>
                              )}
                              {t.meetingLink && (
                                <a
                                  href={t.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs font-semibold transition-colors"
                                >
                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                  </svg>
                                  Join Meeting
                                </a>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTask(t.date, t.id);
                              }}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}

                    {(tasksByDate[formatKey(selectedDate)] || []).filter(
                      (t) => !t.startAt && !t.endAt
                    ).length > 0 && (
                      <div className="pt-4 border-t-2 border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                          All Day Tasks
                        </h4>
                        {(tasksByDate[formatKey(selectedDate)] || [])
                          .filter((t) => !t.startAt && !t.endAt)
                          .map((t) => (
                            <div
                              key={t.id}
                              onClick={() => openTaskDetail(t)}
                              className={`mb-3 p-4 rounded-2xl border-2 transition-all hover:shadow-lg cursor-pointer ${
                                t.isDone
                                  ? "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 opacity-75"
                                  : "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:border-purple-300"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <input
                                  type="checkbox"
                                  checked={!!t.isDone}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    const key = t.date;
                                    setTasksByDate((prev) => ({
                                      ...prev,
                                      [key]: (prev[key] || []).map((x) =>
                                        x.id === t.id
                                          ? { ...x, isDone: e.target.checked }
                                          : x
                                      ),
                                    }));
                                  }}
                                  className="mt-1 h-5 w-5 text-purple-600 rounded-lg border-gray-300 cursor-pointer"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3
                                      className={`font-semibold text-gray-900 ${
                                        t.isDone
                                          ? "line-through text-gray-500"
                                          : ""
                                      }`}
                                    >
                                      {t.title}
                                    </h3>
                                    {t.isDone && (
                                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                        ✓ Completed
                                      </span>
                                    )}
                                  </div>
                                  {t.description && (
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                      {t.description}
                                    </p>
                                  )}
                                  {t.meetingLink && (
                                    <a
                                      href={t.meetingLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-semibold transition-colors"
                                    >
                                      <svg
                                        className="w-3.5 h-3.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                      </svg>
                                      Join Meeting
                                    </a>
                                  )}
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteTask(t.date, t.id);
                                  }}
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <svg
                      className="w-16 h-16 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p className="text-lg font-medium">No tasks for this day</p>
                    <p className="text-sm mt-1">
                      Click "Add Task" to create one
                    </p>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <svg
                    className="w-16 h-16 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-lg font-medium">
                    Select a date from calendar
                  </p>
                  <p className="text-sm mt-1">to view or add tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Add New Task
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={formValues.title}
                  onChange={(e) =>
                    setFormValues({ ...formValues, title: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formValues.description}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Link
                </label>
                <input
                  type="url"
                  value={formValues.meetingLink}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      meetingLink: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={
                      formValues.startAt
                        ? new Date(formValues.startAt)
                            .toTimeString()
                            .slice(0, 5)
                        : ""
                    }
                    onChange={(e) => {
                      const timeValue = e.target.value;
                      if (timeValue && selectedDate) {
                        const dateStr = formatKey(selectedDate);
                        setFormValues({
                          ...formValues,
                          startAt: new Date(
                            `${dateStr}T${timeValue}`
                          ).toISOString(),
                        });
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={
                      formValues.endAt
                        ? new Date(formValues.endAt).toTimeString().slice(0, 5)
                        : ""
                    }
                    onChange={(e) => {
                      const timeValue = e.target.value;
                      if (timeValue && selectedDate) {
                        const dateStr = formatKey(selectedDate);
                        setFormValues({
                          ...formValues,
                          endAt: new Date(
                            `${dateStr}T${timeValue}`
                          ).toISOString(),
                        });
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formValues.isDone}
                  onChange={(e) =>
                    setFormValues({ ...formValues, isDone: e.target.checked })
                  }
                  className="h-5 w-5 text-blue-600 rounded-lg border-gray-300 cursor-pointer"
                />
                <label className="text-sm font-medium text-gray-700">
                  Mark as completed
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {showTaskDetail && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    checked={!!selectedTask.isDone}
                    onChange={(e) => {
                      const key = selectedTask.date;
                      setTasksByDate((prev) => ({
                        ...prev,
                        [key]: (prev[key] || []).map((x) =>
                          x.id === selectedTask.id
                            ? { ...x, isDone: e.target.checked }
                            : x
                        ),
                      }));
                      setSelectedTask({
                        ...selectedTask,
                        isDone: e.target.checked,
                      });
                    }}
                    className="h-6 w-6 text-blue-600 rounded-lg border-gray-300 cursor-pointer"
                  />
                  <h3
                    className={`text-3xl font-bold ${
                      selectedTask.isDone
                        ? "line-through text-gray-500"
                        : "text-gray-900"
                    }`}
                  >
                    {selectedTask.title}
                  </h3>
                </div>
                {selectedTask.isDone && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Task Completed
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setShowTaskDetail(false);
                  setSelectedTask(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Date</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(selectedTask.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {(selectedTask.startAt || selectedTask.endAt) && (
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Time Range
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {selectedTask.startAt
                        ? new Date(selectedTask.startAt).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "--:--"}
                      {" → "}
                      {selectedTask.endAt
                        ? new Date(selectedTask.endAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--:--"}
                    </p>
                  </div>
                </div>
              )}

              {selectedTask.description && (
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-sm text-gray-600 font-medium mb-2">
                    Description
                  </p>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {selectedTask.description}
                  </p>
                </div>
              )}

              {selectedTask.meetingLink && (
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
                  <p className="text-sm text-gray-600 font-medium mb-3">
                    Meeting Link
                  </p>
                  <a
                    href={selectedTask.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold transition-all hover:scale-105 shadow-lg"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Join Meeting
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                  <p className="text-xs text-gray-500 mt-3 break-all">
                    {selectedTask.meetingLink}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this task?"
                      )
                    ) {
                      deleteTask(selectedTask.date, selectedTask.id);
                      setShowTaskDetail(false);
                      setSelectedTask(null);
                    }
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-medium transition-all hover:scale-105"
                >
                  Delete Task
                </button>
                <button
                  onClick={() => {
                    setShowTaskDetail(false);
                    setSelectedTask(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
