import {atom} from "jotai";
import { RpcConnection, MessageUtil, PubkeyUtil, Instruction, Message } from '@saturnbtcio/arch-sdk';


const clientAtom = atom<RpcConnection | null>(new RpcConnection(process.env.NEXT_PUBLIC_RPC_URL || "http://localhost:9002"));

