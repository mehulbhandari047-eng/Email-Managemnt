
import React, { useState } from 'react';
import { auditBackendCode } from '../services/geminiService';
import { BACKEND_FILES } from '../constants';

const AIAuditor: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFileIdx, setSelectedFileIdx] = useState(4); // Default to controller

  const handleAudit = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    
    const analysis = await auditBackendCode(BACKEND_FILES[selectedFileIdx].content, query);
    setResult(analysis);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">AI Code Auditor</h2>
        <p className="text-slate-500">Ask Gemini to analyze security, logic, or best practices in your backend source.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Context File</label>
              <select 
                value={selectedFileIdx}
                onChange={(e) => setSelectedFileIdx(parseInt(e.target.value))}
                className="w-full bg-white border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {BACKEND_FILES.map((f, i) => (
                  <option key={f.path} value={i}>{f.path}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="E.g., 'How is the password hashing implemented?' or 'Are there any SQL injection vulnerabilities?'"
              className="w-full border border-slate-200 rounded-xl p-4 text-sm min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none shadow-inner"
            />
            <button
              onClick={handleAudit}
              disabled={loading || !query}
              className="absolute bottom-4 right-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-md flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-magnifying-glass-chart"></i>
                  <span>Audit Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-6 min-h-[300px]">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400">
              <i className="fas fa-robot text-5xl mb-4 opacity-20"></i>
              <p className="text-sm font-medium">Ready for code analysis. Input a query above.</p>
            </div>
          )}

          {loading && (
            <div className="space-y-4">
              <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse"></div>
              <div className="h-4 bg-slate-100 rounded w-4/5 animate-pulse"></div>
            </div>
          )}

          {result && (
            <div className="prose prose-slate max-w-none prose-sm animate-in fade-in duration-700">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center space-x-2 mb-4 text-blue-600 font-bold text-xs uppercase">
                  <i className="fas fa-circle-check"></i>
                  <span>Audit Results</span>
                </div>
                <div className="text-slate-700 leading-relaxed space-y-4 whitespace-pre-wrap">
                  {result}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAuditor;
