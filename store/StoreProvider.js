// /store/StoreProvider.js
'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './store'; // Import the store we created
import { checkUserSession } from './features/auth/authSlice';

export default function StoreProvider({ children }) {
  const storeRef = useRef(null);

  // This ensures the store is only created once
  if (!storeRef.current) {
    storeRef.current = store;
    // Dispatch the session check once when the store is created
    storeRef.current.dispatch(checkUserSession());
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
