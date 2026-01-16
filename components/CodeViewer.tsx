
import React, { useState } from 'react';
import { BackendFile } from '../types';

interface CodeViewerProps {
  files: BackendFile[];
}

const CodeViewer: React.FC<CodeViewerProps> = ({ files }) => {
  const [selectedFile, setSelectedFile] = useState<BackendFile>(files[0]);

  const highlightCode = (code: string, lang: string) => {
    // Simple mock highlighting
    if (lang === 'sql') {
      return code.replace(/(CREATE|TABLE|INSERT|INTO|VALUES|PRIMARY KEY|DEFAULT|AUTO_INCREMENT|NOT NULL|FOREIGN KEY|REFERENCES|USE|DATABASE|IF NOT EXISTS)/g, '<span class="text-pink-600 font-bold">$1</span>');
    }
    return code
      .replace(/(const|let|var|function|async|await|return|exports|module|require|if|else|try|catch|new)/g, '<span class="text-blue-600 font-bold">$1</span>')
      .replace(/(\".*?\"|\'.*?\')/g, '<span class="text-green-600">$1</span>')
      .replace(/(\d+)/g, '<span class="text-orange-500">$1</span>')
      .replace(/(\/\/.*)/g, '<span class="text-slate-400 italic">$1</span>');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Source Code Repository</h2>
        <p className="text-slate-500">Examine the architectural implementation of the backend logic.</p>
      </div>

      <div className="flex-1 flex overflow-hidden bg-slate-900 rounded-xl shadow-2xl border border-slate-700">
        {/* File Tree */}
        <div className="w-64 border-r border-slate-800 flex flex-col">
          <div className="p-4 bg-slate-800/50 text-xs font-bold text-slate-500 uppercase">Project Explorer</div>
          <div className="flex-1 overflow-y-auto p-2">
            {files.map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-3 py-2 rounded-md transition-all text-sm mb-1 flex items-center space-x-2 ${
                  selectedFile.path === file.path 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <i className={`fas ${file.language === 'sql' ? 'fa-database text-yellow-500' : 'fa-file-code text-blue-400'} text-xs`}></i>
                <span className="truncate">{file.path}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="bg-slate-800/80 px-4 py-2 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 text-xs font-mono">{selectedFile.path}</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-700 text-slate-300 uppercase">{selectedFile.language}</span>
            </div>
            <button 
              onClick={() => navigator.clipboard.writeText(selectedFile.content)}
              className="text-slate-400 hover:text-white text-xs transition-colors flex items-center space-x-1"
            >
              <i className="fas fa-copy"></i>
              <span>Copy</span>
            </button>
          </div>
          <div className="flex-1 overflow-auto p-6 code-font text-sm leading-relaxed text-slate-300">
            <pre 
              className="whitespace-pre"
              dangerouslySetInnerHTML={{ __html: highlightCode(selectedFile.content, selectedFile.language) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeViewer;
