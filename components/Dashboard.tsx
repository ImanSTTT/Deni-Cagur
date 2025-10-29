import React, { useMemo } from 'react';
import { Permintaan, Bukti, RequestStatus, AuditProject } from '../types';
import { calculateDaysRemaining } from '../utils/dateUtils';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, CheckCircle, Clock, ListTodo } from './icons';

type DashboardProps = {
  requests: Permintaan[];
  evidence: Bukti[];
  auditProjects: AuditProject[];
  warningDays: number;
};

const COLORS = {
  piePending: '#3b82f6', // blue-500
  pieFulfilled: '#f43f5e', // rose-500
};

const barColors = ['#3b82f6', '#8b5cf6', '#22c55e', '#f97316', '#d946ef'];


const Dashboard: React.FC<DashboardProps> = ({ requests, evidence, auditProjects, warningDays }) => {
  const stats = useMemo(() => {
    const totalRequests = requests.length;
    const fulfilled = requests.filter(r => r.status === RequestStatus.Fulfilled).length;
    const approachingDeadline = requests.filter(
      r => r.status === RequestStatus.Pending && calculateDaysRemaining(r.tenggat, warningDays).status === 'warning'
    ).length;
    const overdue = requests.filter(
      r => r.status === RequestStatus.Pending && calculateDaysRemaining(r.tenggat, warningDays).status === 'overdue'
    ).length;
    const fulfillmentPercentage = totalRequests > 0 ? Math.round((fulfilled / totalRequests) * 100) : 0;

    return { totalRequests, fulfilled, approachingDeadline, overdue, fulfillmentPercentage };
  }, [requests, warningDays]);
  
  const requestsPerProjectData = useMemo(() => {
    const projectCounts = requests.reduce((acc, req) => {
        const project = auditProjects.find(p => p.id === req.auditProjectId);
        const projectName = project ? project.name : 'Unassigned';
        acc[projectName] = (acc[projectName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    return Object.entries(projectCounts).map(([name, value]) => ({ name, 'Jumlah Permintaan': value }));
  }, [requests, auditProjects]);

  const StatCard = ({ icon, title, value, colorClass }: { icon: React.ReactNode, title: string, value: number, colorClass: string }) => (
    <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl flex items-center gap-5 transition-all hover:border-gray-700 hover:bg-gray-800/50">
      <div className={`p-3 rounded-lg ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-white text-3xl font-bold">{value}</p>
      </div>
    </div>
  );

  const ChartContainer: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <h3 className="text-white font-semibold mb-4">{title}</h3>
          <div style={{ width: '100%', height: 300 }}>
              {children}
          </div>
      </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<ListTodo className="h-6 w-6 text-white"/>} title="Total Permintaan" value={stats.totalRequests} colorClass="bg-blue-500/80" />
        <StatCard icon={<CheckCircle className="h-6 w-6 text-white"/>} title="Terpenuhi" value={stats.fulfilled} colorClass="bg-green-500/80" />
        <StatCard icon={<AlertTriangle className="h-6 w-6 text-white"/>} title="Mendekati Deadline" value={stats.approachingDeadline} colorClass="bg-yellow-500/80" />
        <StatCard icon={<Clock className="h-6 w-6 text-white"/>} title="Terlambat" value={stats.overdue} colorClass="bg-red-500/80" />
      </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex flex-col justify-center">
            <div>
                <h3 className="text-white font-semibold">Persentase Terpenuhi (Global)</h3>
                <p className="text-5xl font-bold text-white mt-2">{stats.fulfillmentPercentage}%</p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
                <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${stats.fulfillmentPercentage}%` }}></div>
            </div>
            <p className="text-gray-400 text-sm mt-3">
                {stats.fulfilled} dari {stats.totalRequests} total permintaan telah terpenuhi.
            </p>
        </div>
      
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 mt-8">Status per Proyek Audit</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {auditProjects.map(project => {
                const projectRequests = requests.filter(r => r.auditProjectId === project.id);
                if (projectRequests.length === 0) return null;

                const fulfilled = projectRequests.filter(r => r.status === RequestStatus.Fulfilled).length;
                const pending = projectRequests.length - fulfilled;
                const projectStatusData = [
                    { name: 'Belum', value: pending },
                    { name: 'Terpenuhi', value: fulfilled },
                ];

                return (
                    <ChartContainer key={project.id} title={project.name}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={projectStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    stroke="none"
                                >
                                    {projectStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.piePending : COLORS.pieFulfilled} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }}/>
                                <Legend formatter={(value, entry) => <span className="text-gray-300">{value} ({entry.payload?.value})</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                );
            })}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
          <ChartContainer title="Jumlah Permintaan per Proyek Audit">
              <ResponsiveContainer>
                <BarChart data={requestsPerProjectData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }}/>
                    <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} allowDecimals={false}/>
                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }} cursor={{fill: 'rgba(107, 114, 128, 0.1)'}}/>
                    <Bar dataKey="Jumlah Permintaan" radius={[4, 4, 0, 0]}>
                         {requestsPerProjectData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                        ))}
                    </Bar>
                </BarChart>
              </ResponsiveContainer>
          </ChartContainer>
      </div>
    </div>
  );
};

export default Dashboard;