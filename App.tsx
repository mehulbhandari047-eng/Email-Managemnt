
import React, { useState, useEffect } from 'react';
import { ViewType, User, AuthState, Notification, SimulatedMail } from './types';
import { apiService } from './services/apiService';
import { BACKEND_FILES } from './constants';
import { NotificationSystem } from './components/NotificationSystem';
import CodeViewer from './components/CodeViewer';
import AIAuditor from './components/AIAuditor';
import DatabaseVisualizer from './components/DatabaseVisualizer';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.LOGIN);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [mailLog, setMailLog] = useState<SimulatedMail[]>([]);
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false
  });

  const notify = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  };

  const addMail = (to: string, type: 'welcome' | 'reset') => {
    const newMail: SimulatedMail = {
      id: Math.random().toString(36).substr(2, 9),
      to,
      subject: type === 'welcome' ? 'Welcome to Architect!' : 'Password Reset Request',
      body: type === 'welcome' 
        ? `Hi ${to.split('@')[0]}, your account has been successfully created. Welcome aboard!`
        : `We received a request to reset your password. Click the link below to continue.`,
      timestamp: new Date().toLocaleTimeString(),
      type
    };
    setMailLog(prev => [newMail, ...prev]);
  };

  const login = async (email: string, pass: string) => {
    try {
      setAuth(prev => ({ ...prev, loading: true }));
      const res = await apiService.login(email, pass);
      setAuth({ user: res.user as User, token: res.token, isAuthenticated: true, loading: false });
      notify(`Authenticated as ${res.user.role}`, 'success');
      setCurrentView(ViewType.DASHBOARD);
    } catch (err: any) {
      setAuth(prev => ({ ...prev, loading: false }));
      notify(err.message, 'error');
    }
  };

  const logout = () => {
    setAuth({ user: null, token: null, isAuthenticated: false, loading: false });
    setCurrentView(ViewType.LOGIN);
    notify("Session terminated.");
  };

  const register = async (name: string, email: string, pass: string) => {
    try {
      setAuth(prev => ({ ...prev, loading: true }));
      await apiService.register(name, email, pass);
      addMail(email, 'welcome');
      setAuth(prev => ({ ...prev, loading: false }));
      notify("Registration successful. Welcome email sent!", 'success');
      setCurrentView(ViewType.LOGIN);
    } catch (err: any) {
      setAuth(prev => ({ ...prev, loading: false }));
      notify(err.message, 'error');
    }
  };

  // Views
  const LoginView = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
              <i className="fas fa-shield-alt text-xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">System Gateway</h1>
            <p className="text-slate-500 text-sm">Testing Environment v1.2</p>
          </div>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); login(email, pass); }}>
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border p-3 rounded-lg outline-none" required />
            <input placeholder="Password" type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-slate-50 border p-3 rounded-lg outline-none" required />
            <div className="flex justify-between text-xs font-bold">
              <button type="button" onClick={() => setCurrentView(ViewType.REGISTER)} className="text-blue-600">Register</button>
              <button type="button" onClick={() => setCurrentView(ViewType.FORGOT_PASSWORD)} className="text-slate-400">Forgot Password?</button>
            </div>
            <button disabled={auth.loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-md hover:bg-blue-700 transition-all">
              {auth.loading ? <i className="fas fa-spinner fa-spin"></i> : "Sign In"}
            </button>
          </form>
          <div className="mt-8 pt-6 border-t grid grid-cols-2 gap-2">
            <button onClick={() => { setEmail('admin@example.com'); setPass('password123'); }} className="text-[10px] font-bold p-2 bg-slate-50 rounded border hover:bg-slate-100">Admin Bypass</button>
            <button onClick={() => { setEmail('user@example.com'); setPass('password123'); }} className="text-[10px] font-bold p-2 bg-slate-50 rounded border hover:bg-slate-100">User Bypass</button>
          </div>
        </div>
      </div>
    );
  };

  // Fix: Added missing RegisterView component definition to resolve the error on line 206
  const RegisterView = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
            <p className="text-slate-500 text-sm">Join the Adventure-Triangle</p>
          </div>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); register(name, email, pass); }}>
            <input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 border p-3 rounded-lg outline-none" required />
            <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border p-3 rounded-lg outline-none" required />
            <input placeholder="Password" type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-slate-50 border p-3 rounded-lg outline-none" required />
            <button disabled={auth.loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-md hover:bg-blue-700 transition-all">
              {auth.loading ? <i className="fas fa-spinner fa-spin"></i> : "Sign Up"}
            </button>
            <button type="button" onClick={() => setCurrentView(ViewType.LOGIN)} className="w-full mt-4 text-slate-500 text-sm">Already have an account? Sign In</button>
          </form>
        </div>
      </div>
    );
  };

  const ResetPasswordView = () => {
    const [p, setP] = useState('');
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
          <p className="text-slate-500 text-sm mb-6">Enter your new secure password.</p>
          <input type="password" placeholder="New Password" value={p} onChange={e => setP(e.target.value)} className="w-full border p-3 rounded-lg mb-4" />
          <button onClick={() => { notify("Password updated!", "success"); setCurrentView(ViewType.LOGIN); }} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Update Password</button>
        </div>
      </div>
    );
  };

  const MailLogView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Simulated Mail Log</h2>
        <button onClick={() => setMailLog([])} className="text-xs font-bold text-rose-500 hover:underline">Clear Logs</button>
      </div>
      {mailLog.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-dashed border-slate-300">
          <i className="fas fa-inbox text-4xl text-slate-200 mb-4"></i>
          <p className="text-slate-400">No emails sent yet. Trigger a Reset or Welcome email to test.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {mailLog.map(mail => (
            <div key={mail.id} className="bg-white p-6 rounded-xl border shadow-sm hover:border-blue-300 transition-all">
              <div className="flex justify-between mb-4">
                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase tracking-widest">{mail.type}</span>
                <span className="text-xs text-slate-400 font-mono">{mail.timestamp}</span>
              </div>
              <h3 className="font-bold text-slate-800 mb-1">{mail.subject}</h3>
              <p className="text-xs text-slate-500 mb-4">To: {mail.to}</p>
              <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-600 mb-4 italic">
                {mail.body}
              </div>
              {mail.type === 'reset' && (
                <button 
                  onClick={() => setCurrentView(ViewType.RESET_PASSWORD)}
                  className="text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
                >
                  Reset Password Link
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const AdminView = () => {
    const [users, setUsers] = useState<User[]>([]);
    useEffect(() => { apiService.getUsers().then(setUsers); }, []);
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"><th className="px-6 py-4">User</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y">
              {users.map(u => (
                <tr key={u.id}>
                  <td className="px-6 py-4"><span className="text-sm font-bold">{u.name}</span><br/><span className="text-xs text-slate-400">{u.email}</span></td>
                  <td className="px-6 py-4"><span className={`h-2 w-2 rounded-full inline-block mr-2 ${u.is_active ? 'bg-green-500' : 'bg-rose-500'}`}></span><span className="text-xs">{u.is_active ? 'Active' : 'Deactivated'}</span></td>
                  <td className="px-6 py-4 text-right">
                    {u.is_active && u.id !== auth.user?.id && <button onClick={async () => { await apiService.softDelete(u.id); notify("User soft-deleted", "success"); setUsers(prev => prev.map(usr => usr.id === u.id ? {...usr, is_active: false} : usr)); }} className="text-rose-500 text-xs font-bold">Soft Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const NavItem = ({ view, icon, label, adminOnly = false }: { view: ViewType, icon: string, label: string, adminOnly?: boolean }) => {
    if (adminOnly && auth.user?.role !== 'admin') return null;
    return (
      <button 
        onClick={() => setCurrentView(view)}
        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${currentView === view ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
      >
        <i className={`fas ${icon} w-5 text-center`}></i><span className="font-medium text-sm">{label}</span>
      </button>
    );
  };

  // Main Layout
  if (!auth.isAuthenticated) {
    if (currentView === ViewType.REGISTER) return <><RegisterView /><NotificationSystem notifications={notifications} remove={id => setNotifications(n => n.filter(x => x.id !== id))} /></>;
    if (currentView === ViewType.RESET_PASSWORD) return <><ResetPasswordView /><NotificationSystem notifications={notifications} remove={id => setNotifications(n => n.filter(x => x.id !== id))} /></>;
    if (currentView === ViewType.FORGOT_PASSWORD) return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Account Recovery</h2>
          <input className="w-full bg-slate-50 border p-3 rounded-lg mb-4" placeholder="Email Address" type="email" id="forgotEmail" />
          <button 
            onClick={() => { 
              const email = (document.getElementById('forgotEmail') as HTMLInputElement).value || 'test@user.com';
              addMail(email, 'reset'); 
              notify("Reset link sent! Check Mail Log.", "success"); 
              setCurrentView(ViewType.LOGIN); 
            }} 
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold"
          >Send Link</button>
          <button onClick={() => setCurrentView(ViewType.LOGIN)} className="w-full mt-4 text-sm text-slate-500">Back to Login</button>
        </div>
        <NotificationSystem notifications={notifications} remove={id => setNotifications(n => n.filter(x => x.id !== id))} />
      </div>
    );
    return <><LoginView /><NotificationSystem notifications={notifications} remove={id => setNotifications(n => n.filter(x => x.id !== id))} /></>;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <NotificationSystem notifications={notifications} remove={id => setNotifications(n => n.filter(x => x.id !== id))} />
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r transition-all duration-300 flex flex-col z-20`}>
        <div className="p-6 border-b"><h1 className="font-bold text-xl text-blue-600">Architect v1.2</h1></div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Operations</p>
          <NavItem view={ViewType.DASHBOARD} icon="fa-chart-line" label="Overview" />
          <NavItem view={ViewType.ADMIN_DASHBOARD} icon="fa-users-cog" label="User Management" adminOnly />
          <NavItem view={ViewType.MAIL_LOG} icon="fa-envelope-open-text" label="Mail Log" />
          
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6 mb-2">Architecture</p>
          <NavItem view={ViewType.CODE_VIEWER} icon="fa-code" label="Source Code" />
          <NavItem view={ViewType.DATABASE_SCHEMA} icon="fa-database" label="SQL Schema" />
          <NavItem view={ViewType.AI_AUDITOR} icon="fa-robot" label="AI Auditor" />
        </nav>
        <div className="p-4 border-t">
          <button onClick={logout} className="w-full flex items-center space-x-3 p-3 rounded-lg text-rose-500 hover:bg-rose-50 font-bold text-sm">
            <i className="fas fa-sign-out-alt w-5"></i><span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-slate-600"><i className={`fas ${sidebarOpen ? 'fa-indent' : 'fa-outdent'}`}></i></button>
          <div className="flex items-center space-x-4"><span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded uppercase">Live Test Mode</span></div>
        </header>
        <section className="flex-1 overflow-y-auto p-8">
          {currentView === ViewType.DASHBOARD && <Dashboard notify={notify} setCurrentView={setCurrentView} auth={auth} />}
          {currentView === ViewType.ADMIN_DASHBOARD && <AdminView />}
          {currentView === ViewType.MAIL_LOG && <MailLogView />}
          {currentView === ViewType.CODE_VIEWER && <CodeViewer files={BACKEND_FILES} />}
          {currentView === ViewType.DATABASE_SCHEMA && <DatabaseVisualizer />}
          {currentView === ViewType.AI_AUDITOR && <AIAuditor />}
        </section>
      </main>
    </div>
  );
};

export default App;
