import React from 'react';
import { LayoutDashboard, ListTodo, Database, Layers3, ChevronLeft, ChevronRight } from './icons';

type Tab = 'dashboard' | 'permintaan' | 'bankBukti';

type SidebarProps = {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isCollapsed: boolean;
  setCollapsed: (isCollapsed: boolean) => void;
};

const NavButton = ({ tabName, label, icon, activeTab, setActiveTab, isCollapsed }: { tabName: Tab; label: string; icon: React.ReactNode; activeTab: Tab; setActiveTab: (tab: Tab) => void; isCollapsed: boolean; }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left ${
        activeTab === tabName
          ? 'bg-blue-600 text-white'
          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
      } ${isCollapsed ? 'justify-center' : ''}`}
      title={isCollapsed ? label : ''}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
    </button>
  );


const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isCollapsed, setCollapsed }) => {
  return (
    <aside className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 p-4 flex flex-col z-10 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className={`flex items-center gap-3 px-2 mb-8 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="bg-gray-800 p-2 rounded-lg flex-shrink-0">
                <Layers3 className="h-7 w-7 text-blue-500" />
            </div>
            {!isCollapsed && <h1 className="text-base font-bold text-white leading-snug">Audit Evidence and Request Dashboard</h1>}
        </div>
        <nav className="flex flex-col gap-2">
            <NavButton tabName="dashboard" label="Dashboard" icon={<LayoutDashboard className="h-5 w-5" />} activeTab={activeTab} setActiveTab={setActiveTab} isCollapsed={isCollapsed} />
            <NavButton tabName="permintaan" label="Permintaan" icon={<ListTodo className="h-5 w-5" />} activeTab={activeTab} setActiveTab={setActiveTab} isCollapsed={isCollapsed} />
            <NavButton tabName="bankBukti" label="Bank Bukti" icon={<Database className="h-5 w-5" />} activeTab={activeTab} setActiveTab={setActiveTab} isCollapsed={isCollapsed} />
        </nav>

        <div className="mt-auto border-t border-gray-800 pt-4">
            <button
                onClick={() => setCollapsed(!isCollapsed)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left text-gray-400 hover:bg-gray-800 hover:text-white ${isCollapsed ? 'justify-center' : ''}`}
            >
                {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                {!isCollapsed && <span>Sembunyikan</span>}
            </button>
        </div>
    </aside>
  );
};

export default Sidebar;