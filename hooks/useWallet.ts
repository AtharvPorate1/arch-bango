import { useState } from 'react';
import { AddressPurpose, request, MessageSigningProtocols } from 'sats-connect';
import { generatePrivateKey, generatePubkeyFromPrivateKey, hexToUint8Array } from "../utils/cryptoHelpers";
import * as secp256k1 from 'noble-secp256k1';
import Wallet from "sats-connect";

interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
  privateKey: string | null;
  address: string | null;
}

export function useWallet() {
  const NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'regtest';
  const [state, setState] = useState<WalletState>(() => {
    // Initialize from localStorage
    const savedState = localStorage.getItem('walletState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      return {
        isConnected: parsed.isConnected,
        publicKey: parsed.publicKey,
        privateKey: parsed.privateKey,
        address: parsed.address,
      };
    }
    return {
      isConnected: false,
      publicKey: null,
      privateKey: null,
      address: null,
    };
  });

  const connectWallet = async () => {
    try {
      const result: any = await Wallet.request('getAccounts', {
        purposes: [AddressPurpose.Ordinals],
        message: 'Connect to Predictr Market',
      });

      console.log(result)

      if (result.result[0].address && result.result.length > 0) {
        console.log("chute")
        const newState = {
          isConnected: true,
          address: result.result[0].address,
          publicKey: result.result[0].publicKey,
          privateKey: null,
        };
        console.log(newState)
        setState(newState);
        localStorage.setItem('walletState', JSON.stringify(newState));
        localStorage.setItem("walletAddress", newState.address)
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const connect = async () => {
    await connectWallet();
  };

  const disconnect = () => {
    localStorage.removeItem('walletState');
    localStorage.removeItem('walletAddress');

    setState({
      isConnected: false,
      publicKey: null,
      privateKey: null,
      address: null,
    });
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!state.isConnected) throw new Error('Wallet not connected');

    try {
      console.log(`Signing key: ${state.publicKey}`);
      const signResult: any = await Wallet.request('signMessage', {
        address: state.address!,
        message: message,
        protocol: MessageSigningProtocols.BIP322,
      });

      console.log(`Signature: ${signResult.result.signature}`);
      return signResult.result.signature;

    } catch (error) {
      console.error('Error signing with wallet:', error);
      throw error;
    }
  };

  return {
    ...state,
    connect,
    disconnect,
    signMessage,
  };
}