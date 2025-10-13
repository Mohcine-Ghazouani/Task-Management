import { useState, useEffect, useMemo } from "react";
import { UseUserContext } from "../../context/UserContext";
import UserApi from "../../services/Api/User/UserApi";
import {
  Loader2,
  ClipboardList,
  CheckCircle2,
  Hourglass,
  CircleAlert,
  CalendarClock,
  CalendarDays,
  Flag,
  Plus,
  Check,
  X,
} from "lucide-react";

function StatCard({ title, value, Icon, subtext }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="rounded-xl bg-gray-100 p-3">
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

function Badge({ intent = "gray", children }) {
  const cls =
    intent === "green"
      ? "bg-green-100 text-green-700"
      : intent === "yellow"
      ? "bg-yellow-100 text-yellow-700"
      : intent === "red"
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-800";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}
    >
      {children}
    </span>
  );
}

export default function Dashboard() {
  const { user, userTask, setUserTask, comments, setComments } =
    UseUserContext();

  // Member can only edit STATUS
  const [statusEditId, setStatusEditId] = useState(null);
  const [statusDraft, setStatusDraft] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Comments (allowed)
  const [addingCommentId, setAddingCommentId] = useState(null);
  const [newComment, setNewComment] = useState("");

  // Page loading (like admin)
  const [tasksLoading, setTasksLoading] = useState(true);

  // Fetch my tasks & comments (no fetch loop)
  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      if (user?.role !== "Member" || !user?.id) {
        setTasksLoading(false);
        return;
      }
      try {
        setTasksLoading(true);
        const [{ data: t }, { data: c }] = await Promise.all([
          UserApi.getUserTasks(user.id),
          UserApi.getUserComments(user.id),
        ]);
        if (!mounted) return;
        setUserTask(t.tasks || []);
        setComments(c.comments || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setTasksLoading(false);
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, [user?.id, user?.role, setUserTask, setComments]);

  // Stats
  const { stats, myTasksSorted } = useMemo(() => {
    const list = Array.isArray(userTask) ? userTask.slice() : [];
    const now = new Date();
    const in7d = new Date(now);
    in7d.setDate(in7d.getDate() + 7);
    const toDate = (v) => {
      const d = new Date(v);
      return isNaN(d) ? null : d;
    };

    const completed = list.filter((t) => t.status === "Completed").length;
    const inProgress = list.filter((t) => t.status === "In progress").length;
    const notStarted = list.filter((t) => t.status === "Not started").length;

    const overdue = list.filter((t) => {
      const d = t.due_date ? toDate(t.due_date) : null;
      return d && d < now && t.status !== "Completed";
    }).length;

    const dueSoon = list.filter((t) => {
      const d = t.due_date ? toDate(t.due_date) : null;
      return d && d >= now && d <= in7d && t.status !== "Completed";
    }).length;

    const myTasksSorted = list.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    return {
      stats: {
        total: list.length,
        completed,
        inProgress,
        notStarted,
        overdue,
        dueSoon,
      },
      myTasksSorted,
    };
  }, [userTask]);

  // map to badge intents
  const statusIntent = (s) =>
    s === "Completed" ? "green" : s === "In progress" ? "yellow" : "red";
  const priorityIntent = (p) =>
    p === "High" ? "red" : p === "Normal" ? "yellow" : "green";

  // Status editing
  const startEditStatus = (task) => {
    setStatusEditId(task.id);
    setStatusDraft(task.status || "Not started");
    // allow adding comment concurrently? choose: no overlap
    setAddingCommentId(null);
    setNewComment("");
  };
  const cancelEditStatus = () => {
    setStatusEditId(null);
    setStatusDraft("");
  };
  const saveStatus = async () => {
    if (!statusEditId) return;
    try {
      setActionLoading(true);
      const { data } = await UserApi.updateTask(statusEditId, {
        status: statusDraft,
      });
      setUserTask((prev) =>
        prev.map((t) => (t.id === statusEditId ? data.task : t))
      );
      cancelEditStatus();
    } catch (e) {
      console.error("Error updating status:", e);
    } finally {
      setActionLoading(false);
    }
  };

  // Comments
  const startAddComment = (taskId) => {
    setAddingCommentId(taskId);
    setNewComment("");
    // prevent overlapping edit
    setStatusEditId(null);
    setStatusDraft("");
  };
  const saveComment = async () => {
    if (!newComment.trim()) return;
    try {
      setActionLoading(true);
      const { data } = await UserApi.createComment({
        content: newComment,
        user_id: user.id,
        task_id: addingCommentId,
      });
      setComments((prev) => [...prev, data.comment]);
      setAddingCommentId(null);
      setNewComment("");
    } catch (e) {
      console.error("Error adding comment:", e);
    } finally {
      setActionLoading(false);
    }
  };
  const cancelComment = () => {
    setAddingCommentId(null);
    setNewComment("");
  };

  return (
    <div className="container mx-auto space-y-4">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome{user?.name ? `, ${user.name}` : ""} 👋
        </h1>
        <p className="text-sm text-gray-500">
          Here’s a quick look at your work.
        </p>
      </div>

      {/* Stats row (admin style) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="My Tasks" value={stats.total} Icon={ClipboardList} />
        <StatCard
          title="Completed"
          value={stats.completed}
          Icon={CheckCircle2}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          Icon={Hourglass}
        />
        <StatCard
          title="Not Started"
          value={stats.notStarted}
          Icon={CircleAlert}
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          Icon={CircleAlert}
          subtext="Past due & not completed"
        />
        <StatCard
          title="Due Soon (7d)"
          value={stats.dueSoon}
          Icon={CalendarClock}
          subtext="Upcoming within a week"
        />
      </div>

      {/* Loading banner under stats (like admin) */}
      {tasksLoading && (
        <div className="flex items-center justify-center gap-2 rounded-xl border bg-white p-4">
          <p className="text-sm font-semibold text-gray-700">Loading tasks…</p>
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}

      {/* Task cards */}
      {!tasksLoading &&
        (myTasksSorted.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myTasksSorted.map((task) => {
              const due = task.due_date ? new Date(task.due_date) : null;
              const now = new Date();
              const overdue = !!(
                due &&
                due < now &&
                task.status !== "Completed"
              );

              return (
                <div
                  key={task.id}
                  className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  {/* Header */}
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="line-clamp-1 text-base font-semibold text-gray-900">
                      {task.title}
                    </h3>

                    {statusEditId === task.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          className="rounded-lg border border-gray-300 p-1.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          value={statusDraft}
                          onChange={(e) => setStatusDraft(e.target.value)}
                          autoFocus
                        >
                          <option value="Not started">Not started</option>
                          <option value="In progress">In progress</option>
                          <option value="Completed">Completed</option>
                        </select>

                        <button
                          onClick={saveStatus}
                          className="inline-flex items-center justify-center rounded-md bg-green-600 p-1.5 text-white hover:bg-green-700 focus:outline-none"
                          title="Save status"
                        >
                          <Check className="h-4 w-4" />
                          {actionLoading && (
                              <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                        </button>
                        <button
                          onClick={cancelEditStatus}
                          className="inline-flex items-center justify-center rounded-md bg-gray-500 p-1.5 text-white hover:bg-gray-600 focus:outline-none"
                          title="Cancel"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEditStatus(task)}
                        className="group inline-flex items-center"
                        title="Change status"
                      >
                        <Badge intent={statusIntent(task.status)}>
                          {task.status}
                        </Badge>
                      </button>
                    )}
                  </div>

                  {/* Description (read-only) */}
                  <p className="line-clamp-3 text-sm text-gray-700">
                    {task.description || "No description."}
                  </p>

                  {/* Meta */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <CalendarDays className="h-4 w-4" />
                      {due ? (
                        <span
                          className={
                            overdue ? "font-semibold text-red-600" : ""
                          }
                        >
                          {due.toLocaleDateString()}
                          {overdue ? " · Overdue" : ""}
                        </span>
                      ) : (
                        <span className="text-gray-500">No due date</span>
                      )}
                    </div>
                    <div className="flex items-center justify-end gap-2 text-gray-700">
                      <Flag className="h-4 w-4" />
                      <Badge intent={priorityIntent(task.priority)}>
                        {task.priority || "Normal"}
                      </Badge>
                    </div>
                  </div>

                  {/* Comments (view + add) */}
                  <div className="mt-4 border-t pt-3">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                      Comments
                    </p>
                    {comments.some((c) => c.task_id === task.id) ? (
                      <div className="space-y-1">
                        {comments
                          .filter((c) => c.task_id === task.id)
                          .map((c) => (
                            <p
                              key={c.id || c.created_at}
                              className="text-sm text-gray-700"
                            >
                              {c.content}
                            </p>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No comments yet.</p>
                    )}

                    {addingCommentId === task.id ? (
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          placeholder="Write a comment…"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={saveComment}
                            className="flex items-center rounded bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
                          >
                            Save{" "}
                            {actionLoading && (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            )}
                          </button>
                          <button
                            onClick={cancelComment}
                            className="rounded bg-gray-500 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3">
                        <button
                          onClick={() => startAddComment(task.id)}
                          className="rounded bg-green-600 px-2 py-2 text-xs font-semibold text-white hover:bg-green-700"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border bg-white p-8 text-center text-sm text-gray-600 shadow-sm">
            You have no tasks yet.
          </div>
        ))}
    </div>
  );
}
