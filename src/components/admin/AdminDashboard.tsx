import { useState } from 'react';
import {
  Users, FileText, AlertTriangle, Clock, Monitor, Settings,
  Shield, Languages, Building2, Activity, BarChart3, Lock,
  CheckCircle2, XCircle, Search, Download, RefreshCw, Server,
  Cpu, HardDrive, Wifi, AlertOctagon, ChevronRight, Eye,
  ScrollText, UserCog, Plus, Trash2, MapPin,
} from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { BarChart, HorizontalBarChart, DonutChart } from '@/components/shared/Charts';
import { StatusBadge } from '@/components/shared/Badges';
import { Logo } from '@/components/shared/Logo';
import { cn } from '@/utils/cn';

type AdminTab = 'dashboard' | 'analytics' | 'kiosks' | 'redflags' | 'config' | 'audit';

export function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>('dashboard');

  const navItems: { id: AdminTab; label: string; icon: typeof Users }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'analytics', label: 'Patient Analytics', icon: Users },
    { id: 'kiosks', label: 'Kiosk Monitoring', icon: Monitor },
    { id: 'redflags', label: 'Red Flag Cases', icon: AlertTriangle },
    { id: 'config', label: 'Configuration', icon: Settings },
    { id: 'audit', label: 'Audit & Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <aside className="w-60 bg-white border-r border-neutral-200 flex flex-col shrink-0">
        <div className="p-5 border-b border-neutral-200">
          <Logo size="sm" />
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition',
                tab === item.id ? 'bg-primary-50 text-primary-700' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {item.id === 'redflags' && (
                <span className="ml-auto badge bg-danger-100 text-danger-700 text-2xs">0</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-neutral-200">
          <div className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-400">
            <div className="w-2 h-2 rounded-full bg-success-500" />
            <span>System operational</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto scrollbar-thin">
        {tab === 'dashboard' && <DashboardTab />}
        {tab === 'analytics' && <AnalyticsTab />}
        {tab === 'kiosks' && <KiosksTab />}
        {tab === 'redflags' && <RedFlagsTab />}
        {tab === 'config' && <ConfigTab />}
        {tab === 'audit' && <AuditTab />}
      </main>
    </div>
  );
}

function DashboardTab() {
  const hours = ['8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM'];
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Hospital Dashboard</h1>
        <p className="text-sm text-neutral-500">OPD Overview · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatCard label="Total patients today" value="0" icon={<Users className="w-5 h-5" />} accent="primary" />
        <StatCard label="Completed histories" value="0" icon={<CheckCircle2 className="w-5 h-5" />} accent="success" />
        <StatCard label="Documents scanned" value="0" icon={<FileText className="w-5 h-5" />} accent="secondary" />
        <StatCard label="Red flag cases" value="0" icon={<AlertTriangle className="w-5 h-5" />} accent="danger" />
        <StatCard label="Avg completion time" value="—" icon={<Clock className="w-5 h-5" />} accent="warning" />
        <StatCard label="Incomplete sessions" value="0" icon={<XCircle className="w-5 h-5" />} accent="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-neutral-900">Patient Intake by Hour</h3>
            <span className="text-xs text-neutral-400">Today</span>
          </div>
          <BarChart data={hours.map(h => ({ label: h, value: 0 }))} height={200} />
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-neutral-900">Language Distribution</h3>
            <Languages className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="flex items-center justify-center h-[200px] text-sm text-neutral-400">
            No data yet
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-neutral-900">Department-wise Usage</h3>
            <Building2 className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="flex items-center justify-center h-[150px] text-sm text-neutral-400">
            No data yet
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-neutral-900">Kiosk Availability</h3>
            <Monitor className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="flex items-center justify-center h-[150px] text-sm text-neutral-400">
            No kiosks registered
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Patient Analytics</h1>
          <p className="text-sm text-neutral-500">Detailed breakdown of patient intake and history completion</p>
        </div>
        <button className="btn-secondary py-2 px-4 text-sm">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="card p-5">
          <h3 className="font-bold text-neutral-900 mb-4">Completion Rate</h3>
          <div className="flex items-center gap-6">
            <DonutChart
              segments={[
                { label: 'Completed', value: 0, color: '#22c55e' },
                { label: 'Incomplete', value: 0, color: '#f59e0b' },
              ]}
            />
            <div>
              <p className="text-3xl font-bold text-neutral-900">—</p>
              <p className="text-sm text-neutral-500">No data yet</p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-bold text-neutral-900 mb-4">Language Distribution</h3>
          <div className="flex items-center justify-center h-[150px] text-sm text-neutral-400">
            No data yet
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-bold text-neutral-900 mb-4">Department-wise Usage</h3>
        <div className="flex items-center justify-center h-[150px] text-sm text-neutral-400">
          No data yet
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <StatCard label="Avg documents per patient" value="—" icon={<FileText className="w-5 h-5" />} accent="primary" />
        <StatCard label="Avg history time" value="—" icon={<Clock className="w-5 h-5" />} accent="secondary" />
        <StatCard label="OCR accuracy" value="—" icon={<Activity className="w-5 h-5" />} accent="success" />
      </div>
    </div>
  );
}

function KiosksTab() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Kiosk Monitoring</h1>
        <p className="text-sm text-neutral-500">Real-time status of all MediKiosk installations</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total kiosks" value="0" icon={<Monitor className="w-5 h-5" />} accent="primary" />
        <StatCard label="Available" value="0" icon={<CheckCircle2 className="w-5 h-5" />} accent="success" />
        <StatCard label="In use" value="0" icon={<Activity className="w-5 h-5" />} accent="secondary" />
        <StatCard label="Offline / Maintenance" value="0" icon={<AlertOctagon className="w-5 h-5" />} accent="danger" />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="text-left px-5 py-3 text-xs font-bold uppercase text-neutral-400">Kiosk ID</th>
              <th className="text-left px-5 py-3 text-xs font-bold uppercase text-neutral-400">Location</th>
              <th className="text-left px-5 py-3 text-xs font-bold uppercase text-neutral-400">Status</th>
              <th className="text-left px-5 py-3 text-xs font-bold uppercase text-neutral-400">Current Patient</th>
              <th className="text-left px-5 py-3 text-xs font-bold uppercase text-neutral-400">Progress</th>
              <th className="text-left px-5 py-3 text-xs font-bold uppercase text-neutral-400">Last Used</th>
              <th className="text-right px-5 py-3 text-xs font-bold uppercase text-neutral-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7} className="px-5 py-12 text-center text-sm text-neutral-400">
                No kiosks registered. Add a kiosk from Configuration to begin monitoring.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RedFlagsTab() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Red Flag Cases</h1>
        <p className="text-sm text-neutral-500">Patients with symptoms requiring urgent attention</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total today" value="0" icon={<AlertTriangle className="w-5 h-5" />} accent="danger" />
        <StatCard label="Critical" value="0" icon={<AlertOctagon className="w-5 h-5" />} accent="danger" />
        <StatCard label="Urgent" value="0" icon={<AlertTriangle className="w-5 h-5" />} accent="warning" />
        <StatCard label="Resolved" value="0" icon={<CheckCircle2 className="w-5 h-5" />} accent="success" />
      </div>

      <div className="card p-12 text-center">
        <AlertTriangle className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
        <p className="text-neutral-500">No red flag cases today</p>
      </div>
    </div>
  );
}

function ConfigTab() {
  const [languages, setLanguages] = useState(['Hindi', 'English', 'Marathi', 'Gujarati', 'Tamil', 'Telugu', 'Bengali', 'Kannada', 'Punjabi', 'Odia']);
  const [departments, setDepartments] = useState(['General Medicine', 'Cardiology', 'Orthopedics', 'Pediatrics', 'AYUSH / Ayurveda', 'Dermatology', 'Neurology']);
  const [newLang, setNewLang] = useState('');
  const [newDept, setNewDept] = useState('');

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Configuration</h1>
        <p className="text-sm text-neutral-500">Manage languages, departments, and system settings</p>
      </div>

      <div className="card p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Languages className="w-5 h-5 text-primary-600" />
          <h3 className="font-bold text-neutral-900">Supported Languages</h3>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {languages.map((lang) => (
            <div key={lang} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-sm font-medium text-neutral-700">
              {lang}
              <button onClick={() => setLanguages(languages.filter(l => l !== lang))} className="text-neutral-300 hover:text-danger-500">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newLang}
            onChange={(e) => setNewLang(e.target.value)}
            placeholder="Add language..."
            className="input flex-1 py-2 text-sm"
          />
          <button
            onClick={() => { if (newLang) { setLanguages([...languages, newLang]); setNewLang(''); } }}
            className="btn-primary py-2 px-4 text-sm"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      <div className="card p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-primary-600" />
          <h3 className="font-bold text-neutral-900">Departments</h3>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {departments.map((dept) => (
            <div key={dept} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-sm font-medium text-neutral-700">
              {dept}
              <button onClick={() => setDepartments(departments.filter(d => d !== dept))} className="text-neutral-300 hover:text-danger-500">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newDept}
            onChange={(e) => setNewDept(e.target.value)}
            placeholder="Add department..."
            className="input flex-1 py-2 text-sm"
          />
          <button
            onClick={() => { if (newDept) { setDepartments([...departments, newDept]); setNewDept(''); } }}
            className="btn-primary py-2 px-4 text-sm"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-primary-600" />
          <h3 className="font-bold text-neutral-900">System Settings</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Session timeout', value: '10 minutes', desc: 'Auto-clear kiosk session after inactivity' },
            { label: 'Data retention', value: '30 days', desc: 'Temporary data retention before permanent deletion' },
            { label: 'ABDM integration', value: 'API Placeholder', desc: 'FHIR-based interoperability with ABDM' },
            { label: 'HIS/EMR sync', value: 'API Placeholder', desc: 'Hospital information system integration' },
            { label: 'OCR engine', value: 'Multilingual', desc: 'Supports printed and handwritten text in Indian languages' },
          ].map((setting, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-neutral-50">
              <div>
                <p className="font-semibold text-sm text-neutral-900">{setting.label}</p>
                <p className="text-xs text-neutral-400">{setting.desc}</p>
              </div>
              <span className="text-sm font-medium text-primary-600">{setting.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuditTab() {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Audit & Security</h1>
          <p className="text-sm text-neutral-500">Complete audit trail of all system actions</p>
        </div>
        <button className="btn-secondary py-2 px-4 text-sm">
          <Download className="w-4 h-4" /> Export Logs
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Encryption" value="AES-256" icon={<Lock className="w-5 h-5" />} accent="success" />
        <StatCard label="Active sessions" value="0" icon={<Activity className="w-5 h-5" />} accent="primary" />
        <StatCard label="Failed logins" value="0" icon={<Shield className="w-5 h-5" />} accent="success" />
        <StatCard label="Data cleared" value="0" icon={<RefreshCw className="w-5 h-5" />} accent="secondary" />
      </div>

      <div className="card p-5 mb-6">
        <h3 className="font-bold text-neutral-900 mb-3">Security Architecture</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Consent-first', icon: Shield },
            { label: 'Role-based access', icon: UserCog },
            { label: 'End-to-end encryption', icon: Lock },
            { label: 'Audit logging', icon: ScrollText },
            { label: 'Session timeout', icon: Clock },
            { label: 'Temporary data cleanup', icon: RefreshCw },
            { label: 'Minimal data retention', icon: HardDrive },
            { label: 'Patient consent management', icon: CheckCircle2 },
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-neutral-50">
              <feature.icon className="w-4 h-4 text-success-500" />
              <span className="text-sm font-medium text-neutral-700">{feature.label}</span>
              <CheckCircle2 className="w-4 h-4 text-success-500 ml-auto" />
            </div>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="font-bold text-neutral-900">Audit Log</h3>
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search logs..." className="pl-9 pr-4 py-1.5 text-sm rounded-lg border border-neutral-200 bg-neutral-50 w-48 focus:bg-white outline-none" />
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="text-left px-5 py-2.5 text-xs font-bold uppercase text-neutral-400">Time</th>
              <th className="text-left px-5 py-2.5 text-xs font-bold uppercase text-neutral-400">User</th>
              <th className="text-left px-5 py-2.5 text-xs font-bold uppercase text-neutral-400">Role</th>
              <th className="text-left px-5 py-2.5 text-xs font-bold uppercase text-neutral-400">Action</th>
              <th className="text-left px-5 py-2.5 text-xs font-bold uppercase text-neutral-400">Resource</th>
              <th className="text-left px-5 py-2.5 text-xs font-bold uppercase text-neutral-400">IP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-sm text-neutral-400">
                No audit events recorded yet
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
