import React, { useState, useRef, useEffect } from 'react';
import { Bukti, Permintaan, RequestStatus, AuditProject } from './types';
import { MOCK_BUKTI, MOCK_PERMINTAAN, MOCK_AUDIT_PROJECTS } from './data/mockData';
import Dashboard from './components/Dashboard';
import PermintaanView from './components/Permintaan';
import BankBukti from './components/BankBukti';
import EvidenceModal from './components/EvidenceModal';
import PermintaanModal from './components/PermintaanModal';
import AuditProjectModal from './components/AuditProjectModal';
import Sidebar from './components/Sidebar';
import PageHeader from './components/PageHeader';
import { Search, Settings, Download, Plus } from './components/icons';

type Tab = 'dashboard' | 'permintaan' | 'bankBukti';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [warningDays, setWarningDays] = useState(7);

  const [appData, setAppData] = useState({
    requests: MOCK_PERMINTAAN,
    evidence: MOCK_BUKTI,
    auditProjects: MOCK_AUDIT_PROJECTS,
  });
  const { requests, evidence, auditProjects } = appData;

  // Refs to track the highest ID number to prevent reuse
  const latestRequestId = useRef(0);
  const latestEvidenceId = useRef(0);
  const latestProjectId = useRef(0);

  useEffect(() => {
    if (requests.length > 0) latestRequestId.current = Math.max(...requests.map(r => parseInt(r.id.split('-')[1], 10)));
    if (evidence.length > 0) latestEvidenceId.current = Math.max(...evidence.map(e => parseInt(e.id.split('-')[1], 10)));
    if (auditProjects.length > 0) latestProjectId.current = Math.max(...auditProjects.map(p => parseInt(p.id.split('-')[1], 10)));
  }, []);


  // Evidence Modal
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [editingEvidence, setEditingEvidence] = useState<Bukti | null>(null);
  
  const handleOpenEvidenceModal = (item: Bukti | null = null) => {
    setEditingEvidence(item);
    setIsEvidenceModalOpen(true);
  };
  const handleCloseEvidenceModal = () => setIsEvidenceModalOpen(false);

  const handleSaveEvidence = (item: Bukti) => {
    setAppData(d => {
      let newEvidence;
      if (editingEvidence) {
        newEvidence = d.evidence.map(e => e.id === item.id ? item : e);
      } else {
        latestEvidenceId.current += 1;
        const newId = `BKT-${String(latestEvidenceId.current).padStart(3, '0')}`;
        newEvidence = [...d.evidence, { ...item, id: newId }];
      }
      return { ...d, evidence: newEvidence };
    });
    handleCloseEvidenceModal();
  };

  const handleDeleteEvidence = (id: string) => {
    if (window.confirm(`Yakin ingin menghapus bukti ${id}?`)) {
      setAppData(d => ({
        ...d,
        evidence: d.evidence.filter(e => e.id !== id),
        requests: d.requests.map(req => ({
          ...req,
          buktiTerkait: req.buktiTerkait.filter(buktiId => buktiId !== id),
        })),
      }));
    }
  };


  // Request Modal
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<Permintaan | null>(null);
  const [targetAuditProjectId, setTargetAuditProjectId] = useState<string | null>(null);

  const handleOpenRequestModal = (item: Permintaan | null = null, auditProjectId: string | null = null) => {
    setEditingRequest(item);
    if(auditProjectId) setTargetAuditProjectId(auditProjectId);
    setIsRequestModalOpen(true);
  };
  const handleCloseRequestModal = () => {
    setIsRequestModalOpen(false);
    setEditingRequest(null);
    setTargetAuditProjectId(null);
  };

  const handleSaveRequest = (item: Permintaan) => {
    setAppData(d => {
      let newRequests;
      if (editingRequest) {
          newRequests = d.requests.map(r => r.id === item.id ? item : r);
      } else {
          latestRequestId.current += 1;
          const newId = `PRM-${String(latestRequestId.current).padStart(3, '0')}`;
          newRequests = [...d.requests, { ...item, id: newId, auditProjectId: targetAuditProjectId! }];
      }
      return { ...d, requests: newRequests };
    });
    handleCloseRequestModal();
  };

  const handleDeleteRequest = (id: string) => {
    if (window.confirm(`Yakin ingin menghapus permintaan ${id}?`)) {
       setAppData(d => ({
         ...d,
         requests: d.requests.filter(r => r.id !== id),
         evidence: d.evidence.map(bukti => {
           if (bukti.prmTerkait === id) {
             const { prmTerkait, ...rest } = bukti;
             return rest;
           }
           return bukti;
         }),
       }));
    }
  };

   // Audit Project Modal
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<AuditProject | null>(null);

  const handleOpenProjectModal = (project: AuditProject | null = null) => {
      setEditingProject(project);
      setIsProjectModalOpen(true);
  };
  const handleCloseProjectModal = () => setIsProjectModalOpen(false);

  const handleSaveProject = (projectData: { name: string }) => {
      setAppData(d => {
          let newProjects;
          if (editingProject) {
              newProjects = d.auditProjects.map(p => p.id === editingProject.id ? { ...p, name: projectData.name } : p);
          } else {
              latestProjectId.current += 1;
              const newId = `PROJ-${String(latestProjectId.current).padStart(2, '0')}`;
              newProjects = [...d.auditProjects, { id: newId, name: projectData.name }];
          }
          return { ...d, auditProjects: newProjects };
      });
      handleCloseProjectModal();
  };

  const handleDeleteProject = (id: string) => {
      if (window.confirm(`Yakin ingin menghapus proyek ini? SEMUA permintaan terkait akan dihapus.`)) {
          setAppData(d => ({
              ...d,
              auditProjects: d.auditProjects.filter(p => p.id !== id),
              requests: d.requests.filter(r => r.auditProjectId !== id),
          }));
      }
  };

  const handleDownloadFulfilled = () => {
    const fulfilled = requests.filter(r => r.status === RequestStatus.Fulfilled);
    if (!fulfilled.length) return alert("Tidak ada data untuk diunduh.");
    const csv = [
        Object.keys(fulfilled[0]).join(','),
        ...fulfilled.map(row => Object.values(row).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'permintaan_terpenuhi.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <PageHeader title="Dashboard" />
            <Dashboard requests={requests} evidence={evidence} auditProjects={auditProjects} warningDays={warningDays} />
          </>
        );
      case 'permintaan':
        return (
          <>
            <PageHeader title="Daftar Permintaan">
              <button onClick={handleDownloadFulfilled} className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors border border-gray-700 text-sm">
                  <Download className="h-4 w-4" />
                  Download Terpenuhi
              </button>
              <button onClick={() => handleOpenProjectModal()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
                  <Plus className="h-4 w-4" />
                  Tambah Proyek Audit
              </button>
            </PageHeader>
            <PermintaanView 
              requests={requests}
              auditProjects={auditProjects}
              evidence={evidence} 
              warningDays={warningDays}
              onEditRequest={handleOpenRequestModal}
              onDeleteRequest={handleDeleteRequest}
              onAddRequest={(projectId) => handleOpenRequestModal(null, projectId)}
              onEditProject={handleOpenProjectModal}
              onDeleteProject={handleDeleteProject}
            />
          </>
        );
      case 'bankBukti':
        return (
            <>
              <PageHeader title="Bank Bukti">
                <button onClick={() => handleOpenEvidenceModal()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
                    <Plus className="h-4 w-4" />
                    Tambah Bukti
                </button>
              </PageHeader>
              <BankBukti 
                evidence={evidence} 
                onEdit={handleOpenEvidenceModal}
                onDelete={handleDeleteEvidence}
              />
            </>
          );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isSidebarCollapsed}
        setCollapsed={setIsSidebarCollapsed}
      />
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'pl-20' : 'pl-64'}`}>
        <div className="p-8 max-w-7xl mx-auto">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-grow max-w-lg">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="text" placeholder="Cari permintaan atau bukti..." className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-11 pr-4 py-2.5 focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-gray-400"/>
                    <span className="text-sm text-gray-300">Batas Peringatan</span>
                    <input type="number" value={warningDays} onChange={(e) => setWarningDays(parseInt(e.target.value, 10))} className="w-16 bg-gray-900 border border-gray-800 rounded-lg px-2 py-1.5 text-center focus:ring-blue-500 focus:border-blue-500"/>
                    <span className="text-sm text-gray-400">hari</span>
                </div>
              </div>
          </header>

          <main>
            {renderContent()}
          </main>
        </div>
      </div>
      
      <EvidenceModal
        isOpen={isEvidenceModalOpen}
        onClose={handleCloseEvidenceModal}
        onSave={handleSaveEvidence}
        evidence={editingEvidence}
        requests={requests}
      />
      <PermintaanModal
        isOpen={isRequestModalOpen}
        onClose={handleCloseRequestModal}
        onSave={handleSaveRequest}
        permintaan={editingRequest}
        evidence={evidence}
      />
      <AuditProjectModal
        isOpen={isProjectModalOpen}
        onClose={handleCloseProjectModal}
        onSave={handleSaveProject}
        project={editingProject}
      />
    </div>
  );
}
