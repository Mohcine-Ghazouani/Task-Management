import { useMemo, useState } from "react";
import { UseUserContext } from "../context/UserContext";
import UserApi from "../services/Api/User/UserApi";
import {
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  Mail,
  Users as UsersIcon,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  User as UserIcon,
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

export default function Profile() {
  const { user, setUser, tasks = [] } = UseUserContext();

  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [banner, setBanner] = useState({ type: "", msg: "" });

  const [editedUser, setEditedUser] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  // ---- Derived stats from tasks (if present) ----
  const stats = useMemo(() => {
    if (!user?.id) return { mine: 0, completed: 0, overdue: 0 };
    const mine = tasks.filter((t) => t.user_id === user.id);
    const completed = mine.filter(
      (t) => (t.status || "").toLowerCase() === "completed"
    ).length;
    const now = new Date();
    const overdue = mine.filter((t) => {
      if (!t.due_date) return false;
      const d = new Date(t.due_date);
      return (
        !isNaN(d) && d < now && (t.status || "").toLowerCase() !== "completed"
      );
    }).length;
    return { mine: mine.length, completed, overdue };
  }, [tasks, user?.id]);

  // ---- Helpers ----
  const emailValid = /.+@.+\..+/.test(editedUser.email);
  const canSaveProfile =
    isEditing &&
    editedUser.name.trim().length >= 2 &&
    emailValid &&
    !savingProfile;

  const passwordStrong = (s) => /^.{8,}$/.test(s);
  const canSavePwd =
    pwd.current.length > 0 &&
    passwordStrong(pwd.next) &&
    pwd.next === pwd.confirm &&
    !savingPassword;

  const resetBanner = () => setBanner({ type: "", msg: "" });

  // ---- Profile save ----
  const handleSaveProfile = async () => {
    resetBanner();
    if (!canSaveProfile) return;
    try {
      setSavingProfile(true);
      const { data } = await UserApi.updateUser(user.id, {
        name: editedUser.name,
        email: editedUser.email,
      });
      setUser(data.user);
      setIsEditing(false);
      setBanner({ type: "success", msg: "Profile updated successfully." });
    } catch (e) {
      console.error(e);
      setBanner({
        type: "error",
        msg: "Failed to update profile. Please try again.",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  // ---- Password change ----
  const handleChangePassword = async () => {
    resetBanner();
    if (!canSavePwd) {
      setBanner({
        type: "error",
        msg: "Please meet password requirements and confirm it correctly.",
      });
      return;
    }
    try {
      setSavingPassword(true);
      await UserApi.changePassword({
        currentPassword: pwd.current,
        newPassword: pwd.next,
        newPassword_confirmation: pwd.confirm,
      });
      setPwd({ current: "", next: "", confirm: "" });
      setBanner({ type: "success", msg: "Password updated successfully." });
    } catch (error) {
      console.error("Error changing password:", error);
      const apiMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to change password.";
      
      setBanner({ type: "error", msg: apiMsg });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-gray-100 text-gray-700">
            <UserIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <p className="text-sm text-gray-500">
              Manage your personal info and password.
            </p>
          </div>
        </div>
      </div>

      {/* Stats (from tasks) */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="My Tasks" value={stats.mine} Icon={ClipboardList} />
        <StatCard
          title="Completed"
          value={stats.completed}
          Icon={CheckCircle2}
        />
        <StatCard title="Overdue" value={stats.overdue} Icon={AlertTriangle} />
      </div>
      {/* Banner */}
      {banner.msg && (
        <div
          className={`mx-auto max-w-5xl rounded-xl border px-4 py-3 text-sm ${
            banner.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {banner.msg}
        </div>
      )}
      {/* Profile card */}
      <div className="mx-auto max-w-5xl rounded-2xl border bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Role
            </p>
            <span className="mt-1 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" /> {user?.role || "—"}
            </span>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Team
            </p>
            {user?.team ? (
              <span className="mt-1 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800">
                <UsersIcon className="mr-1 h-3.5 w-3.5" /> {user.team}
              </span>
            ) : (
              <span className="mt-1 inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                No Team
              </span>
            )}
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Name
            </p>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.name}
                onChange={(e) =>
                  setEditedUser((p) => ({ ...p, name: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            ) : (
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {user?.name}
              </p>
            )}
          </div>

          <div>
            <p className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-gray-500">
              <Mail className="h-3.5 w-3.5" /> Email
            </p>
            {isEditing ? (
              <input
                type="email"
                value={editedUser.email}
                onChange={(e) =>
                  setEditedUser((p) => ({ ...p, email: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-800">{user?.email}</p>
            )}
            {isEditing && !emailValid && (
              <p className="mt-1 text-xs text-red-600">
                Please enter a valid email address.
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedUser({
                    name: user?.name || "",
                    email: user?.email || "",
                  });
                }}
                className="inline-flex items-center rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-800 transition hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={!canSaveProfile}
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white shadow-sm ring-1 ring-green-600/10 transition hover:bg-green-700 disabled:opacity-70"
              >
                Save{" "}
                {savingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm ring-1 ring-blue-600/10 transition hover:bg-blue-700"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Password card */}
      <div className="mx-auto max-w-5xl rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Update Password
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Current Password
            </label>
            <div className="relative">
              <input
                type={show.current ? "text" : "password"}
                value={pwd.current}
                onChange={(e) =>
                  setPwd((p) => ({ ...p, current: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, current: !s.current }))}
                className="absolute inset-y-0 right-2 grid place-items-center text-gray-500"
              >
                {show.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
              New Password
            </label>
            <div className="relative">
              <input
                type={show.next ? "text" : "password"}
                value={pwd.next}
                onChange={(e) =>
                  setPwd((p) => ({ ...p, next: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, next: !s.next }))}
                className="absolute inset-y-0 right-2 grid place-items-center text-gray-500"
              >
                {show.next ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 8 characters.
            </p>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={show.confirm ? "text" : "password"}
                value={pwd.confirm}
                onChange={(e) =>
                  setPwd((p) => ({ ...p, confirm: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                className="absolute inset-y-0 right-2 grid place-items-center text-gray-500"
              >
                {show.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {pwd.confirm && pwd.next !== pwd.confirm && (
              <p className="mt-1 text-xs text-red-600">
                Passwords do not match.
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => setPwd({ current: "", next: "", confirm: "" })}
            className="inline-flex items-center rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-800 transition hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleChangePassword}
            
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white shadow-sm ring-1 ring-green-600/10 transition hover:bg-green-700 disabled:opacity-70"
          >
            Update{" "}
            {savingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
          </button>
        </div>
      </div>
    </div>
  );
}
