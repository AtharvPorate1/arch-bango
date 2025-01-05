import { RpcConnection } from "@saturnbtcio/arch-sdk";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const client = new RpcConnection(process.env.NEXT_PUBLIC_RPC_URL || "http://localhost:9002");
