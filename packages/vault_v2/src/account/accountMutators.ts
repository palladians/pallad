/**
 * @file Represents the mutator definitions related to accounts.
 */

import { AccountInfo, Mina } from '@palladxyz/mina-core';
import { SingleAccountState } from './accountState';
import { ChainAddress } from '@palladxyz/key-management';

/**
 * Type representing the mutators for a single account state.
 * @typedef {Object} SingleAccountMutators
 */
export type SingleAccountMutators = {
  setAccountInfo: (network: Mina.Networks, address: ChainAddress, accountInfo: AccountInfo) => void;
  setTransactions: (network: Mina.Networks, address: ChainAddress, transactions: Mina.TransactionBody[]) => void;
  getAccountInfo: (network: Mina.Networks, address: ChainAddress) => SingleAccountState;
  getTransactions: (network: Mina.Networks, address: ChainAddress) => Mina.TransactionBody[];
};

/**
 * Type representing the aggregated mutators for all accounts.
 * @typedef {Object} AccountStoreMutators
 */
export type AccountStoreMutators = {
  addAccount: (network: Mina.Networks, address: ChainAddress) => void;
  removeAccount: (network: Mina.Networks, address: ChainAddress) => void;
} & SingleAccountMutators;
