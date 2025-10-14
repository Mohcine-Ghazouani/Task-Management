import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  CalendarClock,
  PieChart as PieIcon,
  TrendingUp,
  Users as UsersIcon,
  SquareStack,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/**
 * Replace these with your real API calls. For example, create a StatsApi:
 *   - StatsApi.getKpis({ from, to }) => { users, admins, members, teams }
 *   - StatsApi.getUsersOverTime({ from, to }) => [{ date, users }]
 *   - StatsApi.getTeamDistribution({ from, to }) => [{ team, count }]
 */
async function mockFetch(delay = 500) {
  await new Promise((r) => setTimeout(r, delay));
}

async function getKpis() {
  await mockFetch();
  return {
    users: 128,
    admins: 7,
    members: 121,
    teams: 9,
    activeThisWeek: 56,
  };
}

async function getUsersOverTime() {
  await mockFetch();
  // last 8 weeks mock
  const now = new Date();
  return Array.from({ length: 8 }).map((_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (7 * (7 - i)));
    return { date: d.toISOString().slice(0, 10), users: 80 + i * 6 + (i % 2 ? 5 : -3) };
  });
}

async function getTeamDistribution() {
  await mockFetch();
  return [
    { team: "Engineering", count: 42 },
    { team: "Product", count: 18 },
    { team: "Design", count: 12 },
    { team: "Marketing", count: 25 },
    { team: "Ops", count: 31 },
  ];
}

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

export default function Dashboard() {
  const [range, setRange] = useState("last_30");
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState(null);
  const [usersOverTime, setUsersOverTime] = useState([]);
  const [teamDist, setTeamDist] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [k, u, t] = await Promise.all([
          getKpis(),
          getUsersOverTime(),
          getTeamDistribution(),
        ]);
        if (!mounted) return;
        setKpis(k);
        setUsersOverTime(u);
        setTeamDist(t);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [range]);

  const pieData = useMemo(() => teamDist.map((d) => ({ name: d.team, value: d.count })), [teamDist]);

  return (
    <div className="container mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500">Key metrics and trends across your workspace.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="last_7">Last 7 days</option>
            <option value="last_30">Last 30 days</option>
            <option value="last_90">Last 90 days</option>
            <option value="ytd">Year to date</option>
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Users" value={kpis?.users ?? "—"} Icon={UsersIcon} />
        <StatCard title="Admins" value={kpis?.admins ?? "—"} Icon={SquareStack} />
        <StatCard title="Members" value={kpis?.members ?? "—"} Icon={TrendingUp} />
        <StatCard title="Teams" value={kpis?.teams ?? "—"} Icon={BarChart3} />
        <StatCard title="Active (7d)" value={kpis?.activeThisWeek ?? "—"} Icon={Activity} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Users Over Time */}
        <div className="lg:col-span-2 rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Users over time</h3>
            <CalendarClock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usersOverTime} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="users" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Distribution */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Users by team</h3>
            <PieIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100}>
                  {pieData.map((_, idx) => (
                    <Cell key={idx} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Team headcount</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamDist} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="team" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Notes</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Use the range selector to recalc metrics.</li>
            <li>• Wire the mock API to your backend when ready.</li>
            <li>• Keep dashboards fast: cache heavy queries on the server.</li>
          </ul>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-10 grid place-items-center bg-white/40 backdrop-blur-sm">
          <div className="rounded-xl border bg-white p-4 text-sm text-gray-700 shadow-md">
            Loading dashboard…
          </div>
        </div>
      )}
    </div>
  );
}
