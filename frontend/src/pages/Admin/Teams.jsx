import { useEffect, useMemo, useState } from "react";
import UserApi from "../../services/Api/User/UserApi";
import { UseUserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Users as UsersIcon,
  SquareStack,
  UserPlus,
  AlertTriangle,
  Pencil,
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

export default function Teams() {
  const { users, setUsers, teams, setTeams } = UseUserContext();
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editedTeamName, setEditedTeamName] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch once (avoid depending on `users` to prevent refetch loop)
  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      try {
        setIsLoading(true);
        const [{ data: t }, { data: u }] = await Promise.all([
          UserApi.getTeams(),
          UserApi.getUsers(),
        ]);
        if (!mounted) return;
        setTeams(t.teams || []);
        setUsers(u.users || []);
      } catch (e) {
        console.error("Error fetching teams/users:", e);
        if (mounted) setError("Failed to load teams. Please try again.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    fetchAll();
    return () => {
      mounted = false;
    };
  }, [setTeams, setUsers]);

  // Build a lookup of teamId -> members array
  const membersByTeam = useMemo(() => {
    const map = new Map();
    for (const team of teams || []) map.set(team.id, []);
    for (const u of users || []) {
      if (u.team_id != null) {
        if (!map.has(u.team_id)) map.set(u.team_id, []);
        map.get(u.team_id).push(u);
      }
    }
    return map;
  }, [teams, users]);

  const stats = useMemo(() => {
    const teamCount = teams?.length || 0;
    const userCount = users?.length || 0;
    const emptyTeams = (teams || []).filter((t) => (membersByTeam.get(t.id) || []).length === 0).length;
    let maxTeam = { name: "—", count: 0 };
    for (const t of teams || []) {
      const c = (membersByTeam.get(t.id) || []).length;
      if (c > maxTeam.count) maxTeam = { name: t.name, count: c };
    }
    const avg = teamCount ? Math.round((userCount / teamCount) * 10) / 10 : 0;
    return { teamCount, userCount, emptyTeams, avgMembers: avg, maxTeam };
  }, [teams, users, membersByTeam]);

  const sortedTeams = useMemo(() => {
    return [...(teams || [])].sort((a, b) => new Date(b?.created_at || 0) - new Date(a?.created_at || 0));
  }, [teams]);

  const handleEdit = (teamId, currentName) => {
    setEditingTeamId(teamId);
    setEditedTeamName(currentName || "");
  };

  const handleSave = async (teamId) => {
    try {
      setSavingId(teamId);
      const { data } = await UserApi.updateTeam(teamId, { name: editedTeamName });
      setTeams((prev) => prev.map((t) => (t.id === teamId ? { ...t, name: data.name ?? editedTeamName } : t)));
      setEditingTeamId(null);
      setEditedTeamName("");
    } catch (e) {
      console.error("Error updating team:", e);
      setError("Couldn't update the team. Please try again.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDiscard = () => {
    setEditingTeamId(null);
    setEditedTeamName("");
  };

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Teams</h2>
          <p className="text-sm text-gray-500">Manage teams and see member distribution.</p>
        </div>
        <button
          onClick={() => navigate("/add-team")}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-blue-600/10 transition hover:bg-blue-700 focus:outline-none"
        >
          <UserPlus className="h-4 w-4" /> Add Team
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Teams" value={stats.teamCount} Icon={SquareStack} />
        <StatCard title="Users" value={stats.userCount} Icon={UsersIcon} />
        <StatCard title="Avg Members/Team" value={stats.avgMembers} Icon={UsersIcon} />
        <StatCard title="Teams w/ No Members" value={stats.emptyTeams} Icon={AlertTriangle} subtext="Needs attention" />
      </div>

      {/* Top team highlight */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Largest team:</span> {stats.maxTeam.name} ({stats.maxTeam.count} members)
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl border bg-white p-6 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p className="text-sm font-medium text-gray-700">Loading teams…</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedTeams.length === 0 ? (
            <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
              <p className="text-gray-600">No teams yet. Add your first team to get started.</p>
            </div>
          ) : (
            sortedTeams.map((team) => {
              const members = membersByTeam.get(team.id) || [];
              return (
                <div key={team.id} className="rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    {editingTeamId === team.id ? (
                      <input
                        type="text"
                        value={editedTeamName}
                        onChange={(e) => setEditedTeamName(e.target.value)}
                        className="w-full md:w-1/2 rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="Team name"
                      />
                    ) : (
                      <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                    )}

                    <div className="flex items-center gap-2">
                      {editingTeamId === team.id ? (
                        <>
                          <button
                            onClick={handleDiscard}
                            className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-800 transition hover:bg-gray-200"
                          >
                            <X className="h-4 w-4" /> Discard
                          </button>
                          <button
                            onClick={() => handleSave(team.id)}
                            disabled={savingId === team.id}
                            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white shadow-sm ring-1 ring-green-600/10 transition hover:bg-green-700 disabled:opacity-70"
                          >
                            <Check className="h-4 w-4" /> Save {savingId === team.id && <Loader2 className="h-4 w-4 animate-spin" />}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEdit(team.id, team.name)}
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm ring-1 ring-blue-600/10 transition hover:bg-blue-700"
                        >
                          <Pencil className="h-4 w-4" /> Edit
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Members */}
                  <div className="mt-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Members</p>
                    {members.length > 0 ? (
                      <ul className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {members.map((m) => (
                          <li key={m.id} className="flex items-center justify-between rounded-xl border bg-gray-50 px-3 py-2 text-sm text-gray-700">
                            <span className="truncate">
                              <span className="font-semibold">{m.name}</span>
                              <span className="text-gray-500"> — {m.email}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-sm text-red-600">No members in this team.</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
