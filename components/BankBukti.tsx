import React from 'react';
import { Bukti, EvidenceValidity } from '../types';
import { Pencil, Trash2, ExternalLink } from './icons';

type BankBuktiProps = {
  evidence: Bukti[];
  onEdit: (item: Bukti) => void;
  onDelete: (id: string) => void;
};

const BankBukti: React.FC<BankBuktiProps> = ({ evidence, onEdit, onDelete }) => {
  
  const ValidityBadge: React.FC<{ validity: EvidenceValidity }> = ({ validity }) => {
    const baseClasses = 'px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block';
    if (validity === EvidenceValidity.Valid) {
      return <span className={`${baseClasses} bg-green-500/10 text-green-400 border border-green-500/20`}>Valid</span>;
    }
    return <span className={`${baseClasses} bg-yellow-500/10 text-yellow-400 border border-yellow-500/20`}>Perlu Perbaikan</span>;
  };

  return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-900 border-b border-gray-800">
                <tr>
                    <th scope="col" className="px-6 py-4 font-medium">ID</th>
                    <th scope="col" className="px-6 py-4 font-medium">Kategori</th>
                    <th scope="col" className="px-6 py-4 font-medium">Deskripsi</th>
                    <th scope="col" className="px-6 py-4 font-medium">File/Link</th>
                    <th scope="col" className="px-6 py-4 font-medium">Unit</th>
                    <th scope="col" className="px-6 py-4 font-medium">PIC</th>
                    <th scope="col" className="px-6 py-4 font-medium">Tgl Diterima</th>
                    <th scope="col" className="px-6 py-4 font-medium">Validitas</th>
                    <th scope="col" className="px-6 py-4 font-medium">PRM Terkait</th>
                    <th scope="col" className="px-6 py-4 font-medium text-center">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {evidence.map((item) => (
                    <tr key={item.id} className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{item.id}</td>
                        <td className="px-6 py-4">{item.kategori}</td>
                        <td className="px-6 py-4 max-w-xs truncate">{item.deskripsi}</td>
                        <td className="px-6 py-4">
                            <a 
                                href={item.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                download={item.filename}
                                className="flex items-center gap-1 text-blue-400 hover:underline"
                                title={item.filename || item.link}
                            >
                                {item.filename ? 'Unduh File' : 'Buka Link'}
                                <ExternalLink className="h-4 w-4 flex-shrink-0"/>
                            </a>
                        </td>
                        <td className="px-6 py-4">{item.unit}</td>
                        <td className="px-6 py-4">{item.pic || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.tglDiterima}</td>
                        <td className="px-6 py-4">
                            <ValidityBadge validity={item.validitas} />
                        </td>
                        <td className="px-6 py-4">{item.prmTerkait || '-'}</td>
                        <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                                <button onClick={() => onEdit(item)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md">
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button onClick={() => onDelete(item.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-md">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
  );
};

export default BankBukti;
