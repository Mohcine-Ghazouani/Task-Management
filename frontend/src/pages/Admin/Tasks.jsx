import { useEffect, useMemo, useState } from "react";
import { UseUserContext } from "../../context/UserContext";
import UserApi from "../../services/Api/User/UserApi";
import { Loader2, CheckCircle2, Clock4, CircleDot, CalendarClock, MessageSquareText, Users as UsersIcon, AlertTriangle, Pencil, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function StatCard({ title, value, Icon, subtext, tone = "default" }) {
  const toneMap = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-50 text-green-700",
    warn: "bg-yellow-50 text-yellow-700",
    danger: "bg-red-50 text-red-700",
    info: "bg-blue-50 text-blue-700",
  };
  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className={`rounded-xl p-3 ${toneMap[tone]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="truncate text-2xl font-bold text-gray-900">{value}</p>
        {subtext ? <p className="text-xs text-gray-500">{subtext}</p> : null}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, tasks, setTasks, users, setUsers, comments, setComments } = UseUserContext();
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({});
  const navigate = useNavigate();
  const [savingId, setSavingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // --- Fetch once for admins ---
  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      if (!user || user.role !== "Admin") {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const [{ data: t }, { data: u }, { data: c }] = await Promise.all([
          UserApi.getTasks(),
          UserApi.getUsers(),
          UserApi.getComments(),
        ]);
        if (!mounted) return;
        setTasks(t.tasks || []);
        setUsers(u.users || []);
        setComments(c.comments || []);
      } catch (e) {
        console.error(e);
        if (mounted) setError("Failed to load dashboard data. Please retry.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    fetchAll();
    return () => {
      mounted = false;
    };
  }, [user, setTasks, setUsers, setComments]);

  // --- Derived statistics ---
  const {
    total,
    completed,
    inProgress,
    notStarted,
    overdue,
    dueSoon,
    commentsCount,
    usersCount,
  } = useMemo(() => {
    const now = new Date();
    const soonCutoff = new Date();
    soonCutoff.setDate(now.getDate() + 7);

    let total = tasks?.length || 0;
    let completed = 0,
      inProgress = 0,
      notStarted = 0,
      overdue = 0,
      dueSoon = 0;

    for (const t of tasks || []) {
      const status = (t.status || "").toLowerCase();
      if (status === "completed") completed++;
      else if (status === "in progress") inProgress++;
      else notStarted++;

      if (t.due_date) {
        const d = new Date(t.due_date);
        if (!isNaN(d)) {
          if (d < now && status !== "completed") overdue++;
          else if (d >= now && d <= soonCutoff && status !== "completed") dueSoon++;
        }
      }
    }

    const commentsCount = comments?.length || 0;
    const usersCount = users?.length || 0;

    return { total, completed, inProgress, notStarted, overdue, dueSoon, commentsCount, usersCount };
  }, [tasks, users, comments]);

  const sortedTasks = useMemo(() => {
    return [...(tasks || [])].sort((a, b) => new Date(b?.created_at || 0) - new Date(a?.created_at || 0));
  }, [tasks]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await UserApi.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      console.error("Error deleting task:", e);
      setError("Couldn't delete task. Please try again.");
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setEditedTask({ ...task });
  };

  const handleUpdate = async () => {
    try {
      setSavingId(editingTaskId);
      const { data } = await UserApi.updateTask(editingTaskId, editedTask);
      setTasks((prev) => prev.map((t) => (t.id === editingTaskId ? data.task : t)));
      setEditingTaskId(null);
      setEditedTask({});
    } catch (e) {
      console.error("Error updating task:", e);
      setError("Couldn't save changes. Please try again.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDiscard = () => {
    setEditingTaskId(null);
    setEditedTask({});
  };

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Admin Dashboard</h2>
          <p className="text-sm text-gray-500">Overview of tasks, users, and activity.</p>
        </div>
        <button
          onClick={() => navigate("/add-task")}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-blue-600/10 transition hover:bg-blue-700 focus:outline-none"
        >
          <Plus className="h-4 w-4" /> Add Task
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Tasks" value={total} Icon={CircleDot} tone="info" />
        <StatCard title="Completed" value={completed} Icon={CheckCircle2} tone="success" subtext={`${((completed / (total || 1)) * 100).toFixed(0)}% of all`} />
        <StatCard title="In Progress" value={inProgress} Icon={Clock4} />
        <StatCard title="Not Started" value={notStarted} Icon={CircleDot} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Overdue" value={overdue} Icon={AlertTriangle} tone="danger" subtext="Past due and not completed" />
        <StatCard title="Due Soon (7d)" value={dueSoon} Icon={CalendarClock} tone="warn" subtext="Upcoming deadlines" />
        <StatCard title="Comments" value={commentsCount} Icon={MessageSquareText} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard title="Users" value={usersCount} Icon={UsersIcon} />
        <StatCard title="Admins" value={users.filter((u) => (u.role || "").toLowerCase() === "admin").length} Icon={UsersIcon} subtext="with Admin role" />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl border bg-white p-6 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p className="text-sm font-medium text-gray-700">Loading dashboard…</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedTasks.length === 0 ? (
            <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
              <p className="text-gray-600">No tasks yet. Add your first task to get started.</p>
            </div>
          ) : (
            sortedTasks.map((task) => (
              <div key={task.id} className="rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Title */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Task Title</p>
                    {editingTaskId === task.id ? (
                      <input
                        type="text"
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={editedTask.title || ""}
                        onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                      />
                    ) : (
                      <p className="truncate text-sm font-semibold text-gray-900">{task.title}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Status</p>
                    {editingTaskId === task.id ? (
                      <select
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={editedTask.status || ""}
                        onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                      >
                        <option value="Not started">Not started</option>
                        <option value="In progress">In progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    ) : task.status === "Completed" ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">Completed</span>
                    ) : task.status === "In progress" ? (
                      <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-700">In progress</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">Not started</span>
                    )}
                  </div>

                  {/* Priority */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Priority</p>
                    {editingTaskId === task.id ? (
                      <select
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={editedTask.priority || ""}
                        onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                      >
                        <option value="Low">Low</option>
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                      </select>
                    ) : task.priority === "High" ? (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">High</span>
                    ) : task.priority === "Normal" ? (
                      <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-700">Normal</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">Low</span>
                    )}
                  </div>

                  {/* Due Date */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Due Date</p>
                    {editingTaskId === task.id ? (
                      <input
                        type="date"
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={editedTask.due_date || ""}
                        onChange={(e) => setEditedTask({ ...editedTask, due_date: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm text-gray-700">{task.due_date || "—"}</p>
                    )}
                  </div>

                  {/* Assigned To */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Assigned To</p>
                    {editingTaskId === task.id ? (
                      <select
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={editedTask.user_id || ""}
                        onChange={(e) => setEditedTask({ ...editedTask, user_id: e.target.value })}
                      >
                        <option value="">Unassigned</option>
                        {users.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                    ) : task.user ? (
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">{task.user.name}</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">Unassigned</span>
                    )}
                  </div>

                  {/* Comments preview */}
                  <div className="md:col-span-2 lg:col-span-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Comments</p>
                    {comments.some((c) => c.task_id === task.id) ? (
                      <div className="mt-1 space-y-1">
                        {comments
                          .filter((c) => c.task_id === task.id)
                          .slice(0, 3)
                          .map((c) => (
                            <p key={c.id || c.created_at} className="truncate text-sm text-gray-700">• {c.content}</p>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No comments</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center justify-end gap-2">
                  {editingTaskId === task.id ? (
                    <>
                      <button
                        onClick={handleDiscard}
                        className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-800 transition hover:bg-gray-200"
                      >
                        Discard
                      </button>
                      <button
                        onClick={handleUpdate}
                        disabled={savingId === task.id}
                        className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white shadow-sm ring-1 ring-green-600/10 transition hover:bg-green-700 disabled:opacity-70"
                      >
                        Save {savingId === task.id && <Loader2 className="h-5 w-5 animate-spin" />}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(task)}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm ring-1 ring-blue-600/10 transition hover:bg-blue-700"
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white shadow-sm ring-1 ring-red-600/10 transition hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
