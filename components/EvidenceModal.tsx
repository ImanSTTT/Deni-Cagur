import React, { useState, useEffect } from 'react';
import { Bukti, Permintaan, EvidenceValidity } from '../types';
import { X } from './icons';

type EvidenceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (evidence: Bukti) => void;
  evidence: Bukti | null;
  requests: Permintaan[];
};

const EvidenceModal: React.FC<EvidenceModalProps> = ({ isOpen, onClose, onSave, evidence, requests }) => {
  const [formData, setFormData] = useState<Bukti>({
    id: '',
    kategori: '',
    deskripsi: '',
    link: '',
    unit: '',
    pic: '',
    tglDiterima: new Date().toISOString().split('T')[0],
    validitas: EvidenceValidity.Valid,
    catatan: '',
    prmTerkait: '',
    filename: '',
  });
  const [fileName, setFileName] = useState<string | undefined>('');


  useEffect(() => {
    if (evidence) {
      setFormData(evidence);
      setFileName(evidence.filename);
    } else {
      setFormData({
        id: '',
        kategori: '',
        deskripsi: '',
        link: '',
        unit: '',
        pic: '',
        tglDiterima: new Date().toISOString().split('T')[0],
        validitas: EvidenceValidity.Valid,
        catatan: '',
        prmTerkait: '',
        filename: '',
      });
      setFileName('');
    }
  }, [evidence, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            const dataUrl = loadEvent.target?.result as string;
            setFormData(prev => ({ ...prev, link: dataUrl, filename: file.name }));
            setFileName(file.name);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl text-white border border-gray-700/50">
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h3 className="text-lg font-semibold">{evidence ? 'Ubah Bukti' : 'Tambah Bukti'} {evidence?.id}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 max-h-[70vh] overflow-y-auto">
            
            {/* Form Fields */}
            <div className="col-span-1">
                <label htmlFor="id" className="block text-sm font-medium text-gray-300 mb-1.5">ID</label>
                <input type="text" name="id" value={formData.id} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50" disabled={!!evidence} placeholder={evidence ? "" : "BKT-XXX"}/>
            </div>
            <div className="col-span-1">
                <label htmlFor="kategori" className="block text-sm font-medium text-gray-300 mb-1.5">Kategori</label>
                <input type="text" name="kategori" value={formData.kategori} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div className="col-span-2">
                <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-300 mb-1.5">Deskripsi</label>
                <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows={2} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1.5">File Bukti</label>
                <div className="mt-1 flex items-center gap-3 p-3 bg-gray-800/50 border border-gray-700 rounded-md">
                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-3 rounded-md text-sm transition-colors"
                    >
                        <span>Upload file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                    </label>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate" title={fileName}>{fileName || "Belum ada file dipilih."}</p>
                    </div>
                </div>
            </div>
            <div className="col-span-1">
                <label htmlFor="unit" className="block text-sm font-medium text-gray-300 mb-1.5">Unit</label>
                <input type="text" name="unit" value={formData.unit} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
             <div className="col-span-1">
                <label htmlFor="pic" className="block text-sm font-medium text-gray-300 mb-1.5">PIC</label>
                <input type="text" name="pic" value={formData.pic} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Nama PIC"/>
            </div>
            <div className="col-span-1">
                <label htmlFor="tglDiterima" className="block text-sm font-medium text-gray-300 mb-1.5">Tanggal Diterima</label>
                <input type="date" name="tglDiterima" value={formData.tglDiterima} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
             <div className="col-span-1">
                <label htmlFor="validitas" className="block text-sm font-medium text-gray-300 mb-1.5">Validitas</label>
                <select name="validitas" value={formData.validitas} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value={EvidenceValidity.Valid}>Valid</option>
                    <option value={EvidenceValidity.NeedsImprovement}>Perlu Perbaikan</option>
                </select>
            </div>
            <div className="col-span-2">
                <label htmlFor="prmTerkait" className="block text-sm font-medium text-gray-300 mb-1.5">ID Permintaan Terkait (opsional)</label>
                <select name="prmTerkait" value={formData.prmTerkait} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">-</option>
                    {requests.map(req => <option key={req.id} value={req.id}>{req.id} - {req.deskripsi}</option>)}
                </select>
            </div>
             <div className="col-span-2">
                <label htmlFor="catatan" className="block text-sm font-medium text-gray-300 mb-1.5">Catatan</label>
                <textarea name="catatan" value={formData.catatan} onChange={handleChange} rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
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

export default EvidenceModal;
