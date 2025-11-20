"use client"
import { logMessage } from '@/utils/logger';
import { LogLevel } from '@/utils/logLevel';
import React, { createContext, useState, useEffect, useCallback } from 'react';


 interface ContextProviderProps {
  children: React.ReactNode;
}

interface WalletMessageData {
  [key: string]: unknown;
}

interface WalletContextType {
  isWalletInstalled: boolean;
  publicKey: string | null;
  sendToWallet: (type: string, data?: WalletMessageData) => void;
  buttonDisabled: boolean;
  lastRequest: { type: string; data?: WalletMessageData } | null;
  popupData: string | null | undefined;
  setPopupData: (val: string) => void;
  closeWallet: () => void;
}

// Create the context with a default value
export const WalletContext = createContext<WalletContextType>({
  isWalletInstalled: false,
  publicKey: null,
  sendToWallet: () => {},
  buttonDisabled: false,
  lastRequest: null, 
  popupData: null,
  setPopupData: (val: string) => {
    return;
  },
  closeWallet() {
    return;
  },
});

export default function WalletProvider({ children }: ContextProviderProps) {
  const [isWalletInstalled, setIsWalletInstalled] = useState<boolean>(false);
  const [publicKey, setPublicKey] = useState<string >("");
  const [buttonDisabled, toggleButtonDisabled] = useState<boolean>(false);
  const [lastRequest, setLastRequest] = useState<{ type: string; data?: WalletMessageData } | null>(null);
  const [popupData, setPopupData] = useState<string | null>();

  // Function to send messages to the extension
  function sendToWallet(type: string, data?: WalletMessageData) {
    setLastRequest({ type: type, data: data });
    // Use window.location.origin for same-origin communication
    // For extension communication, the extension should specify its origin
    const targetOrigin = typeof window !== 'undefined' ? window.location.origin : '*';
    window.postMessage({ type: type, ...data }, targetOrigin);
    toggleButtonDisabled(true);
  }

  function closeWallet() {
    const targetOrigin = typeof window !== 'undefined' ? window.location.origin : '*';
    window.postMessage({ type: 'CLOSE_POPUP' }, targetOrigin);
  }

  // Function to handle incoming messages from the extension
  const handleWalletMessage = useCallback((event: MessageEvent) => {
    // Validate message origin for security
    if (event.source !== window || !event.data?.type) return;
    // Additional origin validation can be added here if extension origin is known
    const { type, data } = event.data;

    switch (type) {
      case 'IKARUS_READY':
        setIsWalletInstalled(true);
        toggleButtonDisabled(false);
        setLastRequest(null);
        closeWallet();
        event.stopPropagation();
        break;
      case 'IKURUS_IS_WORKING':
        setIsWalletInstalled(true);
        toggleButtonDisabled(false);
        setLastRequest(null);
        closeWallet();
        event.stopPropagation();
        break;
      case 'PK_IS':
        setPublicKey(event.data.pk);
        setPopupData(null);
        setLastRequest(null);
        toggleButtonDisabled(false);
        closeWallet();
        break;
      case 'tx':
        setPopupData(null);
        setLastRequest(null);
        toggleButtonDisabled(false);
        closeWallet();
        break;
      case 'NEW_SUBWALLET':
        setPopupData(null);
        setLastRequest(null);
        toggleButtonDisabled(false);
        closeWallet();
        break;
      case 'SK_VALID':
        setPopupData(null);
        setLastRequest(null);
        toggleButtonDisabled(false);
        closeWallet();
        break;
      case 'ERROR':
        setPopupData(null);
        toggleButtonDisabled(false);
        logMessage(LogLevel.ERROR, 'extension', event.data, publicKey, 'context/wallet');
        setPopupData(
          typeof event.data.response === 'string' 
            ? event.data.response 
            : event.data.response?.details?.details || 'An error occurred'
        );
        closeWallet();
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleWalletMessage);

    // Send a message to the extension to check if it's installed
    sendToWallet('IDENTIFY_IKARUS', { details: 'Is application ready?' });

    return () => {
      window.removeEventListener('message', handleWalletMessage);
    };
  }, [handleWalletMessage]);

  return (
    <WalletContext.Provider
      value={{
        isWalletInstalled,
        publicKey,
        sendToWallet,
        buttonDisabled,
        lastRequest,
        popupData,
        setPopupData,
        closeWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
