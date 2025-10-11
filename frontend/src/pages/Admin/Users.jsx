import { useEffect, useMemo, useState } from "react";
import { UseUserContext } from "../../context/UserContext";
import UserApi from "../../services/Api/User/UserApi";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Users as UsersIcon,
  ShieldCheck,
  UserRound,
  SquareStack,
  Pencil,
  Trash2,
  Plus,
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
        {subtext ? (
          <p className="text-xs text-gray-500">{subtext}</p>
        ) : null}
      </div>
    </div>
  );
}

export default function Users() {
  const { users, setUsers } = UseUserContext();
  const [editingUserId, setEditingUserId] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();
  const [savingId, setSavingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Initial load (avoid re-fetch loop by not depending on `users`)
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        setIsLoading(true);
        const [{ data: usersRes }, { data: teamsRes }] = await Promise.all([
          UserApi.getUsers(),
          UserApi.getTeams(),
        ]);
        if (!isMounted) return;
        setUsers(usersRes.users || []);
        setTeams(teamsRes.teams || []);
      } catch (e) {
        console.error(e);
        if (isMounted) setError("Failed to load users/teams. Please retry.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [setUsers]);

  const stats = useMemo(() => {
    const total = users?.length || 0;
    const admins = users?.filter((u) => (u.role || "").toLowerCase() === "admin").length || 0;
    const members = users?.filter((u) => (u.role || "").toLowerCase() === "member").length || 0;
    const teamCount = teams?.length || 0;
    return { total, admins, members, teamCount };
  }, [users, teams]);

  const sortedUsers = useMemo(() => {
    return [...(users || [])].sort(
      (a, b) => new Date(b?.created_at || 0) - new Date(a?.created_at || 0)
    );
  }, [users]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await UserApi.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      console.error("Error deleting user:", e);
      setError("Couldn't delete user. Please try again.");
    }
  };

  const handleEdit = (userId, currentTeamId, currentRole) => {
    setEditingUserId(userId);
    setSelectedTeam(currentTeamId ?? "");
    setSelectedRole(currentRole ?? "");
  };

  const handleUpdate = async (userId) => {
    try {
      setSavingId(userId);
      const payload = { team_id: selectedTeam || null, role: selectedRole };
      const { data } = await UserApi.updateUser(userId, payload);
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? data.user : u))
      );
      setEditingUserId(null);
      setSelectedTeam("");
      setSelectedRole("");
    } catch (e) {
      console.error("Error updating user:", e);
      setError("Couldn't save changes. Please try again.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDiscard = () => {
    setEditingUserId(null);
    setSelectedTeam("");
    setSelectedRole("");
  };

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Users</h2>
          <p className="text-sm text-gray-500">Manage members, roles and team assignments.</p>
        </div>
        <button
          onClick={() => navigate("/add-user")}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-blue-600/10 transition hover:bg-blue-700 focus:outline-none"
        >
          <Plus className="h-4 w-4" /> Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={stats.total} Icon={UsersIcon} />
        <StatCard title="Admins" value={stats.admins} Icon={ShieldCheck} />
        <StatCard title="Members" value={stats.members} Icon={UserRound} />
        <StatCard title="Teams" value={stats.teamCount} Icon={SquareStack} />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl border bg-white p-6 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p className="text-sm font-medium text-gray-700">Loading users…</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedUsers.length === 0 ? (
            <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
              <p className="text-gray-600">No users yet. Add your first user to get started.</p>
            </div>
          ) : (
            sortedUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Name</p>
                    <p className="truncate text-sm font-semibold text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Email</p>
                    <p className="truncate text-sm text-gray-700">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Role</p>
                    <div className="text-sm text-gray-700">
                      {editingUserId === user.id ? (
                        <select
                          className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                        >
                          <option value="" disabled>
                            Select a role
                          </option>
                          <option value="Admin">Admin</option>
                          <option value="Member">Member</option>
                        </select>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800">
                          {user.role || "—"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Team</p>
                    <div className="text-sm text-gray-700">
                      {editingUserId === user.id ? (
                        <select
                          className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          value={selectedTeam}
                          onChange={(e) => setSelectedTeam(e.target.value)}
                        >
                          <option value="" disabled>
                            Select a team
                          </option>
                          {teams.map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))}
                        </select>
                      ) : user.team ? (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                          {user.team.name}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                          No Team
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2">
                  {editingUserId === user.id ? (
                    <>
                      <button
                        onClick={handleDiscard}
                        className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-800 transition hover:bg-gray-200"
                      >
                        Discard
                      </button>
                      <button
                        onClick={() => handleUpdate(user.id)}
                        disabled={savingId === user.id}
                        className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white shadow-sm ring-1 ring-green-600/10 transition hover:bg-green-700 disabled:opacity-70"
                      >
                        Save {savingId === user.id && <Loader2 className="h-4 w-4 animate-spin" />}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(user.id, user.team?.id || "", user.role || "")}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm ring-1 ring-blue-600/10 transition hover:bg-blue-700"
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
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