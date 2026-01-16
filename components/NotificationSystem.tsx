
import React from 'react';
import { Notification } from '../types';

interface Props {
  notifications: Notification[];
  remove: (id: string) => void;
}

export const NotificationSystem: React.FC<Props> = ({ notifications, remove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2">
      {notifications.map(n => (
        <div 
          key={n.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium flex items-center space-x-3 animate-in slide-in-from-right duration-300 ${
            n.type === 'success' ? 'bg-emerald-500' : n.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'
          }`}
        >
          <i className={`fas ${n.type === 'success' ? 'fa-check-circle' : n.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
          <span>{n.message}</span>
          <button onClick={() => remove(n.id)} className="opacity-70 hover:opacity-100">
            <i className="fas fa-times"></i>
          </button>
        </div>
      ))}
    </div>
  );
};
