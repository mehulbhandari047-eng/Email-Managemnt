
import React from 'react';

const DatabaseVisualizer: React.FC = () => {
  const tables = [
    {
      name: 'users',
      columns: [
        { name: 'id', type: 'INT', extra: 'PK, AI' },
        { name: 'name', type: 'VARCHAR(100)', extra: '' },
        { name: 'email', type: 'VARCHAR(100)', extra: 'UNIQUE' },
        { name: 'password', type: 'VARCHAR(255)', extra: '' },
        { name: 'role_id', type: 'INT', extra: 'FK' },
        { name: 'is_active', type: 'BOOLEAN', extra: 'DEFAULT TRUE' },
        { name: 'created_at', type: 'TIMESTAMP', extra: '' },
      ]
    },
    {
      name: 'roles',
      columns: [
        { name: 'id', type: 'INT', extra: 'PK, AI' },
        { name: 'name', type: 'VARCHAR(50)', extra: 'UNIQUE' },
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Database Schema</h2>
        <p className="text-slate-500">Relational visualization of the MySQL user management system.</p>
      </div>

      <div className="relative flex flex-col md:flex-row items-start justify-center space-y-8 md:space-y-0 md:space-x-20 p-12 bg-slate-100 rounded-3xl border border-dashed border-slate-300">
        
        {tables.map((table, idx) => (
          <div key={table.name} className="w-full max-w-xs bg-white rounded-xl shadow-xl border-t-4 border-blue-600 overflow-hidden transform hover:-translate-y-1 transition-transform">
            <div className="px-4 py-3 bg-slate-50 border-b flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center">
                <i className="fas fa-table mr-2 text-blue-500"></i>
                {table.name}
              </h3>
              <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded uppercase">Table</span>
            </div>
            <div className="p-0">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 font-bold border-b border-slate-100">
                    <th className="px-4 py-2">Column</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Meta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {table.columns.map((col) => (
                    <tr key={col.name} className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-mono text-slate-700">{col.name}</td>
                      <td className="px-4 py-2 text-slate-500">{col.type}</td>
                      <td className="px-4 py-2">
                        <span className="text-[9px] font-bold text-blue-500">{col.extra}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Pseudo Connector */}
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-0.5 bg-blue-300 border-t border-dashed border-blue-400">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
        <h4 className="font-bold text-blue-800 mb-2 flex items-center">
          <i className="fas fa-info-circle mr-2"></i>
          Architectural Note
        </h4>
        <p className="text-sm text-blue-700 leading-relaxed">
          The database implements a <strong>Soft Delete</strong> mechanism via the <code>is_active</code> flag. 
          When a user is "deleted" in the application, the backend updates this flag to <code>FALSE</code> instead of removing the row, preserving referential integrity and audit trails.
          Role-Based Access Control (RBAC) is enforced using a many-to-one relationship between <code>users</code> and <code>roles</code>.
        </p>
      </div>
    </div>
  );
};

export default DatabaseVisualizer;
