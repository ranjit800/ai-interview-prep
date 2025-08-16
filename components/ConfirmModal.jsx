// /components/ConfirmModal.jsx
'use client';

import { X, AlertTriangle } from 'lucide-react';
// ** THE CHANGE IS HERE: Use a relative path since it's in the same folder **
import Portal from './Portal.jsx';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;

    return (
        <Portal>
            <div className="fixed inset-0 bg-black/30 bg-opacity-10 z-50 flex items-center justify-center p-4">
                <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 border border-gray-700">
                    <div className="flex items-start">
                        <div className="mr-4 flex-shrink-0 bg-red-500/20 text-red-500 rounded-full p-3">
                            <AlertTriangle size={24} />
                        </div>
                        <div className="flex-grow">
                            <h2 className="text-xl font-bold text-white">{title}</h2>
                            <p className="text-gray-300 mt-2">{message}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </Portal>
    );
}
