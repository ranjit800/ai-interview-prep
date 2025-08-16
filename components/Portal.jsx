// /components/Portal.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Portal({ children }) {
    const portalRootRef = useRef(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Server-side rendering par, document available nahi hota
        // Isliye, hum client-side par hi portal root ko dhoondhte/banate hain
        let portalRoot = document.getElementById('portal-root-dynamic');
        if (!portalRoot) {
            portalRoot = document.createElement('div');
            portalRoot.setAttribute('id', 'portal-root-dynamic');
            document.body.appendChild(portalRoot);
        }
        portalRootRef.current = portalRoot;
        setMounted(true);

    }, []);

    // Jab component mount ho jaye, tabhi portal create karein
    return mounted && portalRootRef.current
        ? createPortal(children, portalRootRef.current)
        : null;
};
