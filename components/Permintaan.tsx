import React, { useState } from 'react';
import { Permintaan, RequestStatus, Bukti, AuditProject } from '../types';
import { calculateDaysRemaining } from '../utils/dateUtils';
import { Pencil, Trash2, ExternalLink, ChevronDown, Plus, Edit } from './icons';

type PermintaanProps = {
  requests: Permintaan[];
  auditProjects: AuditProject[];
  evidence: Bukti[];
  warningDays: number;
  onEditRequest: (item: Permintaan) => void;
  onDeleteRequest: (id: string) => void;
  onAddRequest: (auditProjectId: string) => void;
  onEditProject: (project: AuditProject) => void;
  onDeleteProject: (id: string) => void;
};

const StatusBadge: React.FC<{ status: RequestStatus }> = ({ status }) => {
    const baseClasses = 'px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block';
    if (status === RequestStatus.Fulfilled) {
        return <span className={`${baseClasses} bg-green-500/10 text-green-400 border border-green-500/20`}>Terpenuhi</span>;
    }
    return <span className={`${baseClasses} bg-yellow-500/10 text-yellow-400 border border-yellow-500/20`}>Belum</span>;
};

const DeadlineTag: React.FC<{ dueDate: string, warningDays: number }> = ({ dueDate, warningDays }) => {
    const { label, status } = calculateDaysRemaining(dueDate, warningDays);
    let colorClasses = '';
    switch(status) {
        case 'overdue': colorClasses = 'bg-red-500/10 text-red-400 border border-red-500/20'; break;
        case 'deadline': colorClasses = 'bg-orange-500/10 text-orange-400 border border-orange-500/20'; break;
        case 'warning': colorClasses = 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'; break;
        default: return null;
    }
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses}`}>{label}</span>
}


const PermintaanView: React.FC<PermintaanProps> = (props) => {
    const { requests, auditProjects, evidence, warningDays, onEditRequest, onDeleteRequest, onAddRequest, onEditProject, onDeleteProject } = props;
    
    const [openProjects, setOpenProjects] = useState<Record<string, boolean>>(
        auditProjects.reduce((acc, p) => ({ ...acc, [p.id]: true }), {})
    );

    const toggleProject = (projectId: string) => {
        setOpenProjects(prev => ({ ...prev, [projectId]: !prev[projectId] }));
    };

    if (auditProjects.length === 0) {
        return (
            <div className="bg-gray-900 border border-gray-800 rounded-xl text-center py-12">
                <p className="text-gray-400">Belum ada proyek audit yang dibuat.</p>
                <p className="text-sm text-gray-500 mt-1">Klik "Tambah Proyek Audit" untuk memulai.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {auditProjects.map(project => {
                const projectRequests = requests.filter(r => r.auditProjectId === project.id);
                const isOpen = openProjects[project.id] ?? true;

                return (
                    <div key={project.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden transition-all">
                        <div 
                            className="w-full flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-800/50 transition-colors"
                        >
                            <button onClick={() => toggleProject(project.id)} className="flex-grow flex items-center gap-4" aria-expanded={isOpen} aria-controls={`requests-table-${project.id}`}>
                                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                <h2 className="text-lg font-semibold text-white">{project.name}</h2>
                                <span className="px-2.5 py-1 text-xs font-semibold text-gray-300 bg-gray-700/50 rounded-full">{projectRequests.length} Permintaan</span>
                            </button>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                               <button onClick={() => onEditProject(project)} className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white p-2 rounded-md hover:bg-gray-700">
                                   <Edit className="h-4 w-4"/>
                               </button>
                               <button onClick={() => onDeleteProject(project.id)} className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-400 p-2 rounded-md hover:bg-red-500/20">
                                   <Trash2 className="h-4 w-4"/>
                               </button>
                               <div className="h-6 w-px bg-gray-700 mx-2"></div>
                               <button onClick={() => onAddRequest(project.id)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors text-sm">
                                   <Plus className="h-4 w-4" />
                                   Tambah Permintaan
                               </button>
                            </div>
                        </div>

                        {isOpen && (
                            <div id={`requests-table-${project.id}`} className="overflow-x-auto">
                                {projectRequests.length > 0 ? (
                                    <table className="w-full text-sm text-left text-gray-300">
                                        <thead className="text-xs text-gray-400 uppercase bg-gray-900/80 border-t border-b border-gray-800">
                                            <tr>
                                                {['ID', 'Tanggal', 'Unit', 'Deskripsi', 'Tenggat', 'Sisa Hari', 'PIC', 'Bukti Terkait', 'Status', 'Pemenuhan', 'Aksi'].map(header => (
                                                    <th key={header} scope="col" className="px-6 py-3 font-medium">
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {projectRequests.map((item) => (
                                                    <tr key={item.id} className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800/50 last:border-b-0">
                                                        <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{item.id}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{item.tanggal}</td>
                                                        <td className="px-6 py-4">{item.unit}</td>
                                                        <td className="px-6 py-4 max-w-xs truncate" title={item.deskripsi}>{item.deskripsi}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{item.tenggat}</td>
                                                        <td className="px-6 py-4">
                                                            {item.status === RequestStatus.Pending && item.tenggat && <DeadlineTag dueDate={item.tenggat} warningDays={warningDays} />}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{item.pic || '-'}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col items-start gap-1.5">
                                                                {item.buktiTerkait && item.buktiTerkait.length > 0 ? (
                                                                    item.buktiTerkait.map(buktiId => {
                                                                        const buktiItem = evidence.find(b => b.id === buktiId);
                                                                        return buktiItem ? (
                                                                            <a
                                                                                key={buktiId}
                                                                                href={buktiItem.link}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                download={buktiItem.filename}
                                                                                className="flex items-center gap-1 text-blue-400 hover:underline text-xs whitespace-nowrap"
                                                                                title={buktiItem.deskripsi}
                                                                            >
                                                                                {buktiItem.filename ? buktiItem.filename : buktiId} <ExternalLink className="h-3 w-3" />
                                                                            </a>
                                                                        ) : (
                                                                            <span key={buktiId} className="text-xs text-gray-500" title="Bukti tidak ditemukan">{buktiId}</span>
                                                                        );
                                                                    })
                                                                ) : (
                                                                    <span>-</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <StatusBadge status={item.status} />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{item.pemenuhan || '-'}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <button onClick={() => onEditRequest(item)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md" title="Ubah">
                                                                    <Pencil className="h-4 w-4" />
                                                                </button>
                                                                <button onClick={() => onDeleteRequest(item.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-md" title="Hapus">
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-8 border-t border-gray-800">
                                        <p className="text-gray-400">Belum ada permintaan untuk proyek ini.</p>
                                        <p className="text-sm text-gray-500">Klik "Tambah Permintaan" untuk memulai.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    );
};

export default PermintaanView;