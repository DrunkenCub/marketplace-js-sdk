import { PublicKey, Transaction, Connection } from "@solana/web3.js";
import { Wallet } from "@metaplex/js";
import { Client } from "./client";
import { AuctionHouse } from "./types";
import {
  createWithdrawFromTreasuryInstruction,
  WithdrawFromTreasuryInstructionAccounts,
  WithdrawFromTreasuryInstructionArgs,
} from "@metaplex-foundation/mpl-auction-house/dist/src/generated/instructions";
import BN from "bn.js";

export interface WithdrawFromTreasuryParams {
  amount: BN;
}

export class TreasuryClient extends Client {
  private auctionHouse: AuctionHouse;

  constructor(
    connection: Connection,
    wallet: Wallet,
    auctionHouse: AuctionHouse
  ) {
    super(connection, wallet);

    this.auctionHouse = auctionHouse;
  }

  async withdrawFromTreasury({ amount }: WithdrawFromTreasuryParams) {
    const { publicKey, signTransaction } = this.wallet;
    const connection = this.connection;
    const ah = this.auctionHouse;

    const auctionHouse = new PublicKey(ah.address);
    const authority = new PublicKey(ah.authority);
    const treasuryMint = new PublicKey(ah.treasuryMint);
    const auctionHouseTreasury = new PublicKey(ah.auctionHouseTreasury);
    const treasuryWithdrawalDestination = new PublicKey(
      ah.treasuryWithdrawalDestination
    );

    const withdrawFromTreasuryInstructionAccounts: WithdrawFromTreasuryInstructionAccounts =
      {
        treasuryMint: treasuryMint,
        authority: authority,
        treasuryWithdrawalDestination: treasuryWithdrawalDestination,
        auctionHouseTreasury: auctionHouseTreasury,
        auctionHouse: auctionHouse,
      };

    const withdrawFromTreasuryInstructionArgs: WithdrawFromTreasuryInstructionArgs =
      {
        amount: amount,
      };

    const withdrawFromTreasuryInstruction =
      createWithdrawFromTreasuryInstruction(
        withdrawFromTreasuryInstructionAccounts,
        withdrawFromTreasuryInstructionArgs
      );

    const txt = new Transaction();

    txt.add(withdrawFromTreasuryInstruction);

    txt.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    txt.feePayer = publicKey;

    const signed = await signTransaction(txt);

    const signature = await connection.sendRawTransaction(signed.serialize());

    await connection.confirmTransaction(signature, "confirmed");
  }
}
