'use client';

import { walletStore } from "@/store/authStore";
import Wallet, { MessageSigningProtocols } from "sats-connect";
import { toast } from 'sonner'

export default function FaucetButton() {

    const { address } = walletStore();


    const getBitcoin = async () => {

        const signResponse: any = await Wallet.request('signMessage', {
            address: address!,
            message: "Prediction market at its peak with Predictr",
            protocol: MessageSigningProtocols.BIP322,
        });
        const accessToken = localStorage.getItem('accessToken')

        console.log(signResponse)

        if (signResponse.status !== "success") {
            return;
        }

        const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}utils/send-bitcoin`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${accessToken!}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "walletAddress": address,
                "signature": signResponse.result.signature
            })
        })

        const jsn = await resp.json();

        if (resp.status !== 201) {
            toast.error("Cannot redeem bitcoins at the moment, please wait and try again later!")
        } else {
            toast.success(`Your bitcoin will be deposited in sometime ${jsn.txid}`)
        }

    }

    return (
        <button
            onClick={getBitcoin}
            className="text-gray-400 hover:text-white transition-colors text-center text-sm"
        >
            [ Get 10 USD ]
        </button>
    );
}
