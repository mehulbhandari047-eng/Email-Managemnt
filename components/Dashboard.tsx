
import React from 'react';
import { ViewType, AuthState } from '../types';

interface Props {
  notify: (msg: string, type?: 'success' | 'error' | 'info') => void;
  setCurrentView: (view: ViewType) => void;
  auth: AuthState;
}

const Dashboard: React.FC<Props> = ({ notify, setCurrentView, auth }) => {
  const testSteps = [
    { 
      title: "1. Simulated Mailing", 
      desc: "Trigger a reset email from Login, then verify and interact with it in the Mail Log.",
      icon: "fa-envelope",
      view: ViewType.MAIL_LOG
    },
    { 
      title: "2. User Lifecycle", 
      desc: "As Admin, perform a 'Soft Delete' on mock users and observe state persistence.",
      icon: "fa-users-cog",
      view: ViewType.ADMIN_DASHBOARD,
      adminOnly: true
    },
    { 
      title: "3. AI Architecture Audit", 
      desc: "Use the AI Auditor to query the real Node.js source files for vulnerabilities.",
      icon: "fa-robot",
      view: ViewType.AI_AUDITOR
    },
    { 
      title: "4. Schema Verification", 
      desc: "Analyze the SQL Schema for proper indexing and relation constraints.",
      icon: "fa-database",
      view: ViewType.DATABASE_SCHEMA
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Test Dashboard</h2>
        <p className="text-slate-500">Manual verification suite for the Backend Architect project.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: 'Users', v: '1,284', c: 'bg-blue-600' },
          { l: 'Mails Sent', v: '45.2k', c: 'bg-purple-600' },
          { l: 'Active Tokens', v: '82', c: 'bg-emerald-600' },
          { l: 'Server Load', v: '4%', c: 'bg-slate-800' }
        ].map(s => (
          <div key={s.l} className="bg-white p-6 rounded-xl border flex items-center space-x-4">
            <div className={`w-2 h-10 rounded-full ${s.c}`}></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">{s.l}</p>
              <p className="text-2xl font-bold">{s.v}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center uppercase tracking-wider text-xs">
            <i className="fas fa-tasks mr-2 text-blue-500"></i>
            Manual Testing Steps
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {testSteps.map((step, idx) => (
            <div key={idx} className={`p-6 flex items-start space-x-4 hover:bg-slate-50 transition-colors ${step.adminOnly && auth.user?.role !== 'admin' ? 'opacity-40 grayscale' : ''}`}>
               <div className="bg-slate-100 w-10 h-10 rounded-full flex items-center justify-center text-slate-500 flex-shrink-0">
                  <i className={`fas ${step.icon}`}></i>
               </div>
               <div className="flex-1">
                  <h4 className="font-bold text-slate-700">{step.title}</h4>
                  <p className="text-sm text-slate-500">{step.desc}</p>
               </div>
               {(!step.adminOnly || auth.user?.role === 'admin') && (
                 <button onClick={() => setCurrentView(step.view)} className="text-blue-600 text-xs font-bold border border-blue-600 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition-all">Start Test</button>
               )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
