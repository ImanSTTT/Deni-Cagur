import React, { useState, useEffect } from 'react';
import { AuditProject } from '../types';
import { X } from './icons';

type AuditProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: { name: string }) => void;
  project: AuditProject | null;
};

const AuditProjectModal: React.FC<AuditProjectModalProps> = ({ isOpen, onClose, onSave, project }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(project ? project.name : '');
    }
  }, [project, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({ name });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md text-white border border-gray-700/50">
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h3 className="text-lg font-semibold">{project ? 'Ubah Proyek Audit' : 'Tambah Proyek Audit'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-1.5">Nama Proyek</label>
            <input 
                type="text" 
                id="projectName"
                name="projectName" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="cth: Audit BPK Semester II 2025"
                required
                autoFocus
            />
          </div>
          <div className="flex justify-end items-center p-5 border-t border-gray-800 bg-gray-900/50 rounded-b-xl">
            <button type="button" onClick={onClose} className="px-4 py-2 text-white bg-transparent hover:bg-gray-700 rounded-md mr-2 font-semibold text-sm">Batal</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md text-sm transition-colors">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuditProjectModal;