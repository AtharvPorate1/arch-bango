import { client } from "@/lib/utils";
import { Instruction, Message, MessageUtil, Pubkey, PubkeyUtil } from "@saturnbtcio/arch-sdk";
import * as borsh from 'borsh';
import { v4 as uuidv4 } from "uuid"


export const fetchEventData = async () => {
  try {

    const eventPubKey = PubkeyUtil.fromHex(process.env.NEXT_PUBLIC_EVENT_ACCOUNT_PUBKEY!);
    const eventAccount = await client.readAccountInfo(eventPubKey);
    if (!eventAccount) {
      return [];
    }

    const eventData = eventAccount.data;

    // If data is empty or invalid length, just set empty messages without error
    if (!eventData || eventData.length < 4) {
      return [];
    }

    const schema = {
      struct: {
        total_predictions: 'u32', // Total number of predictions
        predictions: {
          array: {
            type: {
              struct: {
                unique_id: { array: { type: 'u8', len: 32 } }, // 32-byte unique ID
                creator: { array: { type: 'u8', len: 32 } }, // Pubkey as [u8; 32]
                expiry_timestamp: 'u32', // Expiry timestamp as u32
                outcomes: {
                  array: {
                    type: {
                      struct: {
                        id: 'u8', // Outcome ID as u8
                        total_amount: 'u64', // Total amount in the pool for this outcome
                        bets: {
                          map: {
                            key: { array: { type: 'u8', len: 32 } }, // Pubkey as [u8; 32]
                            value: {
                              array: {
                                type: {
                                  struct: {
                                    user: { array: { type: 'u8', len: 32 } }, // Pubkey as [u8; 32]
                                    event_id: { array: { type: 'u8', len: 32 } }, // [u8; 32]
                                    outcome_id: 'u8', // Outcome ID as u8
                                    amount: 'u64', // Amount as u64
                                    timestamp: 'i64', // Timestamp as i64
                                    bet_type: 'u8' // BetType as u8 (enum values: SELL, BUY)
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                total_pool_amount: 'u64', // Total pool amount across all outcomes
                status: 'u8', // EventStatus as u8 (enum values: Active, Closed, Resolved, Cancelled)
                winning_outcome: { option: 'u8' }, // Optional winning outcome ID
              },
            },
          },
        },
      },
    };

    const data: any = borsh.deserialize(schema, eventData);

    const eventId = new Uint8Array(data.predictions[data.total_predictions - 1].unique_id)
    const decoder = new TextDecoder(); // Default UTF-8 decoding
    const decodedString = decoder.decode(eventId);

    console.log(decodedString, "++++++++");
    return data;


  } catch (error) {
    console.error('Error fetching wall data:', error);
  }
};


export const fetchTokenData = async () => {
  try {

    const tokenPubKey = PubkeyUtil.fromHex(process.env.NEXT_PUBLIC_TOKEN_ACCOUNT_PUBKEY!);
    const tokenAccount = await client.readAccountInfo(tokenPubKey);
    if (!tokenAccount) {
      return [];
    }

    const wallData = tokenAccount.data;

    // console.log(`Wall data: ${wallDa}`);

    // If data is empty or invalid length, just set empty messages without error
    if (!wallData || wallData.length < 4) {
      return [];
    }

    const schema = {
      struct: {
        owner: { array: { type: 'u8', len: 32 } }, // 32-byte array
        status: 'u8', // Enum as u8 (MintStatus)
        supply: 'u64', // u64 as BigInt
        circulating_supply: 'u64', // u64 as BigInt
        ticker: 'string', // Token ticker (String)
        decimals: 'u8', // Unsigned 8-bit integer
        token_metadata: {
          map: {
            key: 'string', // Key is a string
            value: { array: { type: 'u8', len: 32 } }, // Value is a 32-byte array
          },
        },
        balances: {
          map: {
            key: { array: { type: 'u8', len: 32 } }, // Key is a 32-byte array (Pubkey)
            value: 'u64', // Value is u64 (BigInt)
          },
        },
      },
    };


    const data = borsh.deserialize(schema, wallData);

    console.log(data, "==========");
    return data;


  } catch (error) {
    console.error('Error fetching wall data:', error);
  }
};



export const handleBuyOutcome = async (uniqueIdStr: string, amount: number, outcome_id: number) => {

  try {

    const uniqueId = new Uint8Array(32).fill(0); // Fill with your ID bytes
    const uniqueIdBytes = new TextEncoder().encode(uniqueIdStr.replaceAll("-", ""));
    uniqueId.set(uniqueIdBytes.slice(0, 32));

    const randomUniqueId = new Uint8Array(32).fill(0); // Fill with your ID bytes
    const randomUniqueIdBytes = new TextEncoder().encode(uuidv4().replaceAll("-", ""));
    randomUniqueId.set(randomUniqueIdBytes.slice(0, 32));

    const schema = {
      struct: {
        function_number: 'u8',
        random_uid: { array: { type: 'u8', len: 32 } },
        uid: { array: { type: 'u8', len: 32 } },
        outcome_id: 'u8',
        amount: 'u64',
      }
    };

    const data2 = {
      function_number: 3,
      random_uid: randomUniqueId,
      uid: uniqueId,
      outcome_id: 1,
      amount: BigInt(amount)
    };

    const serialized_data = borsh.serialize(schema, data2);
    const publicKeyResp: string = await window.unisat.getPublicKey();
    const publicKey = publicKeyResp.slice(2, publicKeyResp.length)

    const instruction: Instruction = {
      program_id: PubkeyUtil.fromHex(process.env.NEXT_PUBLIC_PROGRAM_PUBKEY!),
      accounts: [
        {
          pubkey: PubkeyUtil.fromHex(process.env.NEXT_PUBLIC_EVENT_ACCOUNT_PUBKEY!),
          is_signer: false,
          is_writable: true,
        },
        {
          pubkey: PubkeyUtil.fromHex(process.env.NEXT_PUBLIC_TOKEN_ACCOUNT_PUBKEY!),
          is_signer: false,
          is_writable: true
        },
        {
          pubkey: PubkeyUtil.fromHex(publicKey),
          is_signer: true,
          is_writable: false
        }
      ],
      data: serialized_data,
    };

    const messageObj: Message = {
      signers: [PubkeyUtil.fromHex(publicKey)],
      instructions: [instruction],
    };

    const messageHash = MessageUtil.hash(messageObj);
    const signature: any = await window.unisat.signMessage(Buffer.from(messageHash).toString('hex'), "bip322-simple")
    const signatureBytes = new Uint8Array(Buffer.from(signature, 'base64')).slice(2);


    const result = await client.sendTransaction({
      version: 0,
      signatures: [signatureBytes],
      message: messageObj,
    });

    console.log(result, "++++++++");
    return true;

  } catch (error) {
    console.error('Error creating event:', error);
    return false;
  }
};




export const handleSellOutcome = async (uniqueIdStr: string, amount: number, outcome_id: number) => {

  try {

    const uniqueId = new Uint8Array(32).fill(0); // Fill with your ID bytes
    const uniqueIdBytes = new TextEncoder().encode(uniqueIdStr.replaceAll("-", ""));
    uniqueId.set(uniqueIdBytes.slice(0, 32));

    const randomUniqueId = new Uint8Array(32).fill(0); // Fill with your ID bytes
    const randomUniqueIdBytes = new TextEncoder().encode(uuidv4().replaceAll("-", ""));
    randomUniqueId.set(randomUniqueIdBytes.slice(0, 32));

    const schema = {
      struct: {
        function_number: 'u8',
        random_uid: { array: { type: 'u8', len: 32 } },
        uid: { array: { type: 'u8', len: 32 } },
        outcome_id: 'u8',
        amount: 'u64',
      }
    };

    const data2 = {
      function_number: 4,
      random_uid: randomUniqueId,
      uid: uniqueId,
      outcome_id: 0,
      amount: BigInt(amount)
    };
    console.log(data2)
    const serialized_data = borsh.serialize(schema, data2);
    const publicKeyResp: string = await window.unisat.getPublicKey();
    const publicKey = publicKeyResp.slice(2, publicKeyResp.length)

    const instruction: Instruction = {
      program_id: PubkeyUtil.fromHex(process.env.NEXT_PUBLIC_PROGRAM_PUBKEY!),
      accounts: [
        {
          pubkey: PubkeyUtil.fromHex(process.env.NEXT_PUBLIC_EVENT_ACCOUNT_PUBKEY!),
          is_signer: false,
          is_writable: true,
        },
        {
          pubkey: PubkeyUtil.fromHex(process.env.NEXT_PUBLIC_TOKEN_ACCOUNT_PUBKEY!),
          is_signer: false,
          is_writable: true
        },
        {
          pubkey: PubkeyUtil.fromHex(publicKey),
          is_signer: true,
          is_writable: false
        }
      ],
      data: serialized_data,
    };

    const messageObj: Message = {
      signers: [PubkeyUtil.fromHex(publicKey)],
      instructions: [instruction],
    };

    const messageHash = MessageUtil.hash(messageObj);
    const signature: any = await window.unisat.signMessage(Buffer.from(messageHash).toString('hex'), "bip322-simple")
    const signatureBytes = new Uint8Array(Buffer.from(signature, 'base64')).slice(2);

    const result = await client.sendTransaction({
      version: 0,
      signatures: [signatureBytes],
      message: messageObj,
    });

    console.log(result, "++++++++");
    return true;

  } catch (error) {
    console.error('Error creating event:', error);
    return false;
  }
};




export const handleMintTokens = async (amount: number) => {

  try {

    const uniqueId = new Uint8Array(32).fill(0); // Fill with your ID bytes
    const uniqueIdBytes = new TextEncoder().encode(uuidv4().replaceAll("-", ""));
    uniqueId.set(uniqueIdBytes.slice(0, 32));

    const schema = {
      struct: {
        function_number: 'u8',
        uid: { array: { type: 'u8', len: 32 } },
        amount: 'u64',
      }
    };

    const data2 = {
      function_number: 6,
      uid: uniqueId,
      amount: BigInt(amount),
    };

    const serialized_data = borsh.serialize(schema, data2);

    const publicKeyResp: string = await window.unisat.getPublicKey();
    const publicKey = publicKeyResp.slice(2, publicKeyResp.length)

    const instruction: Instruction = {
      program_id: PubkeyUtil.fromHex(process.env.NEXT_PUBLIC_PROGRAM_PUBKEY!),
      accounts: [
        {
          pubkey: PubkeyUtil.fromHex(process.env.NEXT_PUBLIC_TOKEN_ACCOUNT_PUBKEY!),
          is_signer: false,
          is_writable: true,
        },
        {
          pubkey: PubkeyUtil.fromHex(publicKey),
          is_signer: true,
          is_writable: false
        }
      ],
      data: serialized_data,
    };

    const messageObj: Message = {
      signers: [PubkeyUtil.fromHex(publicKey)],
      instructions: [instruction],
    };

    const messageHash = MessageUtil.hash(messageObj);
    const signature: any = await window.unisat.signMessage(Buffer.from(messageHash).toString('hex'), "bip322-simple")
    const signatureBytes = new Uint8Array(Buffer.from(signature, 'base64')).slice(2);

    const result = await client.sendTransaction({
      version: 0,
      signatures: [signatureBytes],
      message: messageObj,
    });

    console.log(result, "++++++++");
    return true;

  } catch (error) {
    console.error('Error creating event:', error);
    return false;
  }
};



export const handleCreateNewToken = async () => {

  try {

    const publicKeyResp: string = await window.unisat.getPublicKey();
    const publicKey = publicKeyResp.slice(2, publicKeyResp.length)


    const owner = new Uint8Array(32).fill(0); // Fill with your ID bytes
    const ownerBytes = new TextEncoder().encode(publicKey);
    owner.set(ownerBytes.slice(0, 32));

    const supply = BigInt(1000000);
    const ticker = "PUSD"
    const decimals = 10;


    const schema = {
      struct: {
        function_number: 'u8',
        owner: { array: { type: 'u8', len: 32 } },
        supply: 'u64',
        ticker: 'string',
        decimals: 'u8'
      }
    };

    const data2 = {
      function_number: 5,
      owner: Array.from(owner),
      supply,
      ticker,
      decimals: decimals
    };


    const serialized_data = borsh.serialize(schema, data2);

    const instruction: Instruction = {
      program_id: PubkeyUtil.fromHex(process.env.NEXT_PUBLIC_PROGRAM_PUBKEY!),
      accounts: [
        {
          pubkey: PubkeyUtil.fromHex(process.env.NEXT_PUBLIC_TOKEN_ACCOUNT_PUBKEY!),
          is_signer: false,
          is_writable: true,
        },
        {
          pubkey: PubkeyUtil.fromHex(publicKey),
          is_signer: true,
          is_writable: false
        }
      ],
      data: serialized_data,
    };

    const messageObj: Message = {
      signers: [PubkeyUtil.fromHex(publicKey)],
      instructions: [instruction],
    };

    const messageHash = MessageUtil.hash(messageObj);
    const signature: any = await window.unisat.signMessage(Buffer.from(messageHash).toString('hex'), "bip322-simple")
    const signatureBytes = new Uint8Array(Buffer.from(signature, 'base64')).slice(2);

    const result = await client.sendTransaction({
      version: 0,
      signatures: [signatureBytes],
      message: messageObj,
    });

    console.log(result, "++++++++");
    return true;

  } catch (error) {
    console.error('Error creating event:', error);
    return false;
  }
};
