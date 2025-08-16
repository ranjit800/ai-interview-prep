// /components/ChatOptions.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Edit, Trash2, Pin, Share2, Check } from 'lucide-react';
// ** THE CHANGE IS HERE: Use a relative path since it's in the same folder **
import Portal from './Portal.jsx';

export default function ChatOptions({ session, onTopicUpdate, onDeleteClick, onPinSession }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [topic, setTopic] = useState(session.topic);
    const [menuStyle, setMenuStyle] = useState({});
    
    const buttonRef = useRef(null);
    const menuRef = useRef(null);
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                menuRef.current && !menuRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }
        }
        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen]);

    useEffect(() => {
        if (isEditing && wrapperRef.current) {
            const input = wrapperRef.current.querySelector('input');
            if (input) {
                input.focus();
                input.select();
            }
        }
    }, [isEditing]);

    const handleRename = () => {
        setIsEditing(true);
        setIsMenuOpen(false);
    };

    const handleSave = async () => {
        if (topic.trim() === '' || topic === session.topic) {
            setIsEditing(false);
            setTopic(session.topic);
            return;
        }
        onTopicUpdate(session._id, topic);
        setIsEditing(false);
    };

    const handleDelete = () => {
        onDeleteClick(session);
        setIsMenuOpen(false);
    };

    const handlePin = () => {
        onPinSession(session._id, !session.pinned);
        setIsMenuOpen(false);
    };
    
    const handleShare = () => {
        alert('Share functionality coming soon!');
        setIsMenuOpen(false);
    }

    const handleToggleMenu = () => {
        if (!isMenuOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const menuHeight = 160;

            let style = {
                right: `${window.innerWidth - rect.right}px`,
            };

            if (spaceBelow < menuHeight) {
                style.bottom = `${window.innerHeight - rect.top}px`;
            } else {
                style.top = `${rect.bottom}px`;
            }
            setMenuStyle(style);
        }
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <div ref={wrapperRef} className="flex items-center justify-between w-full group">
            {isEditing ? (
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    className="bg-gray-700 text-white rounded px-1 py-0 w-full text-sm"
                />
            ) : (
                <span className="truncate flex-1">{topic}</span>
            )}

            <button ref={buttonRef} onClick={handleToggleMenu} className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 focus:opacity-100">
                <MoreHorizontal size={16} />
            </button>

            {isMenuOpen && (
                <Portal>
                    <div ref={menuRef} style={menuStyle} className="fixed z-50 w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                        <ul className="py-1 text-sm text-gray-200">
                            <li onClick={handleRename} className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer"><Edit size={14} className="mr-2"/> Rename</li>
                            <li onClick={handlePin} className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer"><Pin size={14} className="mr-2"/> {session.pinned ? 'Unpin' : 'Pin'}</li>
                            <li onClick={handleShare} className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer"><Share2 size={14} className="mr-2"/> Share</li>
                            <li onClick={handleDelete} className="flex items-center px-4 py-2 text-red-400 hover:bg-red-500/20 cursor-pointer"><Trash2 size={14} className="mr-2"/> Delete</li>
                        </ul>
                    </div>
                </Portal>
            )}
        </div>
    );
};
