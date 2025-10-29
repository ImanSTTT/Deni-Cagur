import React, { useState, useEffect } from 'react';
import { Permintaan, RequestStatus, Bukti } from '../types';
import { X } from './icons';

type PermintaanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (permintaan: Permintaan) => void;
  permintaan: Permintaan | null;
  evidence: Bukti[];
};

const PermintaanModal: React.FC<PermintaanModalProps> = ({ isOpen, onClose, onSave, permintaan, evidence }) => {
  const getInitialFormData = (): Permintaan => ({
    id: '',
    tanggal: new Date().toISOString().split('T')[0],
    unit: '',
    deskripsi: '',
    tenggat: '',
    pic: '',
    auditProjectId: '',
    buktiTerkait: [],
    status: RequestStatus.Pending,
  });
  
  const [formData, setFormData] = useState<Permintaan>(getInitialFormData());

  useEffect(() => {
    if (permintaan) {
      setFormData({
        ...permintaan,
        buktiTerkait: Array.isArray(permintaan.buktiTerkait) ? permintaan.buktiTerkait : [],
      });
    } else {
      setFormData(getInitialFormData());
    }
  }, [permintaan, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBuktiCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: buktiId, checked } = e.target;
    setFormData(prev => {
      const currentBukti = prev.buktiTerkait || [];
      const newBuktiTerkait = checked
        ? [...currentBukti, buktiId]
        : currentBukti.filter(id => id !== buktiId);
      
      const newStatus = newBuktiTerkait.length > 0 ? prev.status : RequestStatus.Pending;

      return { ...prev, buktiTerkait: newBuktiTerkait, status: newStatus };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = { ...formData };
    if (finalData.status === RequestStatus.Fulfilled && !finalData.pemenuhan) {
        finalData.pemenuhan = new Date().toISOString().split('T')[0];
    } else if (finalData.status === RequestStatus.Pending) {
        finalData.pemenuhan = undefined;
    }
    onSave(finalData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl text-white border border-gray-700/50">
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h3 className="text-lg font-semibold">{permintaan ? 'Ubah Permintaan' : 'Tambah Permintaan'} {permintaan?.id}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 max-h-[70vh] overflow-y-auto">
                <div className="col-span-1">
                    <label htmlFor="id" className="block text-sm font-medium text-gray-300 mb-1.5">ID</label>
                    <input type="text" name="id" value={formData.id} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50" disabled={!!permintaan} placeholder="Otomatis"/>
                </div>
                <div className="col-span-1">
                    <label htmlFor="tanggal" className="block text-sm font-medium text-gray-300 mb-1.5">Tanggal</label>
                    <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div className="col-span-2">
                    <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-300 mb-1.5">Deskripsi</label>
                    <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                </div>
                <div className="col-span-2">
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-300 mb-1.5">Unit</label>
                    <input type="text" name="unit" value={formData.unit} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div className="col-span-1">
                    <label htmlFor="pic" className="block text-sm font-medium text-gray-300 mb-1.5">PIC</label>
                    <input type="text" name="pic" value={formData.pic} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Nama PIC"/>
                </div>
                <div className="col-span-1">
                    <label htmlFor="tenggat" className="block text-sm font-medium text-gray-300 mb-1.5">Tenggat</label>
                    <input type="date" name="tenggat" value={formData.tenggat} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div className="col-span-2">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1.5">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" disabled={formData.buktiTerkait.length === 0}>
                        <option value={RequestStatus.Pending}>Belum</option>
                        <option value={RequestStatus.Fulfilled}>Terpenuhi</option>
                    </select>
                     {formData.buktiTerkait.length === 0 && <p className="text-xs text-gray-400 mt-1">Pilih bukti untuk mengubah status.</p>}
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Bukti Terkait</label>
                    <div className="max-h-32 overflow-y-auto bg-gray-800/50 border border-gray-700 rounded-md p-3 space-y-2">
                        {evidence.length > 0 ? evidence.map(b => (
                        <div key={b.id} className="flex items-center">
                            <input
                            id={`bukti-${b.id}`}
                            type="checkbox"
                            value={b.id}
                            checked={formData.buktiTerkait.includes(b.id)}
                            onChange={handleBuktiCheckboxChange}
                            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
                            />
                            <label htmlFor={`bukti-${b.id}`} className="ml-3 text-sm text-gray-300 cursor-pointer select-none">
                            <span className="font-medium text-white">{b.id}</span> - <span className="text-gray-400 truncate">{b.deskripsi}</span>
                            </label>
                        </div>
                        )) : <p className="text-sm text-gray-500 text-center py-2">Tidak ada bukti tersedia di Bank Bukti.</p>}
                    </div>
                </div>
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

export default PermintaanModal;