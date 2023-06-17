import type {} from 'graphql'
import { GraphQLClient } from 'graphql-request'
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types'
import gql from 'graphql-tag'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  DateTime: { input: any; output: any }
  Long: { input: any; output: any }
  ObjectId: { input: any; output: any }
}

export type Block = {
  __typename?: 'Block'
  blockHeight?: Maybe<Scalars['Int']['output']>
  canonical?: Maybe<Scalars['Boolean']['output']>
  creator?: Maybe<Scalars['String']['output']>
  creatorAccount?: Maybe<BlockCreatorAccount>
  dateTime?: Maybe<Scalars['DateTime']['output']>
  protocolState?: Maybe<BlockProtocolState>
  receivedTime?: Maybe<Scalars['DateTime']['output']>
  snarkFees?: Maybe<Scalars['Long']['output']>
  snarkJobs?: Maybe<Array<Maybe<BlockSnarkJob>>>
  stateHash?: Maybe<Scalars['String']['output']>
  stateHashField?: Maybe<Scalars['String']['output']>
  transactions?: Maybe<BlockTransaction>
  txFees?: Maybe<Scalars['Long']['output']>
  winnerAccount?: Maybe<BlockWinnerAccount>
}

export type BlockCreatorAccount = {
  __typename?: 'BlockCreatorAccount'
  publicKey?: Maybe<Scalars['String']['output']>
}

export type BlockCreatorAccountInsertInput = {
  publicKey?: InputMaybe<Scalars['String']['input']>
}

export type BlockCreatorAccountQueryInput = {
  AND?: InputMaybe<Array<BlockCreatorAccountQueryInput>>
  OR?: InputMaybe<Array<BlockCreatorAccountQueryInput>>
  publicKey?: InputMaybe<Scalars['String']['input']>
  publicKey_exists?: InputMaybe<Scalars['Boolean']['input']>
  publicKey_gt?: InputMaybe<Scalars['String']['input']>
  publicKey_gte?: InputMaybe<Scalars['String']['input']>
  publicKey_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  publicKey_lt?: InputMaybe<Scalars['String']['input']>
  publicKey_lte?: InputMaybe<Scalars['String']['input']>
  publicKey_ne?: InputMaybe<Scalars['String']['input']>
  publicKey_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
}

export type BlockCreatorAccountUpdateInput = {
  publicKey?: InputMaybe<Scalars['String']['input']>
  publicKey_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type BlockInsertInput = {
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  canonical?: InputMaybe<Scalars['Boolean']['input']>
  creator?: InputMaybe<Scalars['String']['input']>
  creatorAccount?: InputMaybe<BlockCreatorAccountInsertInput>
  dateTime?: InputMaybe<Scalars['DateTime']['input']>
  protocolState?: InputMaybe<BlockProtocolStateInsertInput>
  receivedTime?: InputMaybe<Scalars['DateTime']['input']>
  snarkJobs?: InputMaybe<Array<InputMaybe<BlockSnarkJobInsertInput>>>
  stateHash?: InputMaybe<Scalars['String']['input']>
  stateHashField?: InputMaybe<Scalars['String']['input']>
  transactions?: InputMaybe<BlockTransactionInsertInput>
  winnerAccount?: InputMaybe<BlockWinnerAccountInsertInput>
}

export type BlockProtocolState = {
  __typename?: 'BlockProtocolState'
  blockchainState?: Maybe<BlockProtocolStateBlockchainState>
  consensusState?: Maybe<BlockProtocolStateConsensusState>
  previousStateHash?: Maybe<Scalars['String']['output']>
}

export type BlockProtocolStateBlockchainState = {
  __typename?: 'BlockProtocolStateBlockchainState'
  date?: Maybe<Scalars['Long']['output']>
  snarkedLedgerHash?: Maybe<Scalars['String']['output']>
  stagedLedgerHash?: Maybe<Scalars['String']['output']>
  utcDate?: Maybe<Scalars['Long']['output']>
}

export type BlockProtocolStateBlockchainStateInsertInput = {
  date?: InputMaybe<Scalars['Long']['input']>
  snarkedLedgerHash?: InputMaybe<Scalars['String']['input']>
  stagedLedgerHash?: InputMaybe<Scalars['String']['input']>
  utcDate?: InputMaybe<Scalars['Long']['input']>
}

export type BlockProtocolStateBlockchainStateQueryInput = {
  AND?: InputMaybe<Array<BlockProtocolStateBlockchainStateQueryInput>>
  OR?: InputMaybe<Array<BlockProtocolStateBlockchainStateQueryInput>>
  date?: InputMaybe<Scalars['Long']['input']>
  date_exists?: InputMaybe<Scalars['Boolean']['input']>
  date_gt?: InputMaybe<Scalars['Long']['input']>
  date_gte?: InputMaybe<Scalars['Long']['input']>
  date_in?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>
  date_lt?: InputMaybe<Scalars['Long']['input']>
  date_lte?: InputMaybe<Scalars['Long']['input']>
  date_ne?: InputMaybe<Scalars['Long']['input']>
  date_nin?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>
  snarkedLedgerHash?: InputMaybe<Scalars['String']['input']>
  snarkedLedgerHash_exists?: InputMaybe<Scalars['Boolean']['input']>
  snarkedLedgerHash_gt?: InputMaybe<Scalars['String']['input']>
  snarkedLedgerHash_gte?: InputMaybe<Scalars['String']['input']>
  snarkedLedgerHash_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']['input']>>
  >
  snarkedLedgerHash_lt?: InputMaybe<Scalars['String']['input']>
  snarkedLedgerHash_lte?: InputMaybe<Scalars['String']['input']>
  snarkedLedgerHash_ne?: InputMaybe<Scalars['String']['input']>
  snarkedLedgerHash_nin?: InputMaybe<
    Array<InputMaybe<Scalars['String']['input']>>
  >
  stagedLedgerHash?: InputMaybe<Scalars['String']['input']>
  stagedLedgerHash_exists?: InputMaybe<Scalars['Boolean']['input']>
  stagedLedgerHash_gt?: InputMaybe<Scalars['String']['input']>
  stagedLedgerHash_gte?: InputMaybe<Scalars['String']['input']>
  stagedLedgerHash_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']['input']>>
  >
  stagedLedgerHash_lt?: InputMaybe<Scalars['String']['input']>
  stagedLedgerHash_lte?: InputMaybe<Scalars['String']['input']>
  stagedLedgerHash_ne?: InputMaybe<Scalars['String']['input']>
  stagedLedgerHash_nin?: InputMaybe<
    Array<InputMaybe<Scalars['String']['input']>>
  >
  utcDate?: InputMaybe<Scalars['Long']['input']>
  utcDate_exists?: InputMaybe<Scalars['Boolean']['input']>
  utcDate_gt?: InputMaybe<Scalars['Long']['input']>
  utcDate_gte?: InputMaybe<Scalars['Long']['input']>
  utcDate_in?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>
  utcDate_lt?: InputMaybe<Scalars['Long']['input']>
  utcDate_lte?: InputMaybe<Scalars['Long']['input']>
  utcDate_ne?: InputMaybe<Scalars['Long']['input']>
  utcDate_nin?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>
}

export type BlockProtocolStateBlockchainStateUpdateInput = {
  date?: InputMaybe<Scalars['Long']['input']>
  date_unset?: InputMaybe<Scalars['Boolean']['input']>
  snarkedLedgerHash?: InputMaybe<Scalars['String']['input']>
  snarkedLedgerHash_unset?: InputMaybe<Scalars['Boolean']['input']>
  stagedLedgerHash?: InputMaybe<Scalars['String']['input']>
  stagedLedgerHash_unset?: InputMaybe<Scalars['Boolean']['input']>
  utcDate?: InputMaybe<Scalars['Long']['input']>
  utcDate_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type BlockProtocolStateConsensusState = {
  __typename?: 'BlockProtocolStateConsensusState'
  blockHeight?: Maybe<Scalars['Int']['output']>
  blockchainLength?: Maybe<Scalars['Int']['output']>
  epoch?: Maybe<Scalars['Int']['output']>
  epochCount?: Maybe<Scalars['Int']['output']>
  hasAncestorInSameCheckpointWindow?: Maybe<Scalars['Boolean']['output']>
  lastVrfOutput?: Maybe<Scalars['String']['output']>
  minWindowDensity?: Maybe<Scalars['Int']['output']>
  nextEpochData?: Maybe<BlockProtocolStateConsensusStateNextEpochDatum>
  slot?: Maybe<Scalars['Int']['output']>
  slotSinceGenesis?: Maybe<Scalars['Int']['output']>
  stakingEpochData?: Maybe<BlockProtocolStateConsensusStateStakingEpochDatum>
  totalCurrency?: Maybe<Scalars['Float']['output']>
}

export type BlockProtocolStateConsensusStateInsertInput = {
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  blockchainLength?: InputMaybe<Scalars['Int']['input']>
  epoch?: InputMaybe<Scalars['Int']['input']>
  epochCount?: InputMaybe<Scalars['Int']['input']>
  hasAncestorInSameCheckpointWindow?: InputMaybe<Scalars['Boolean']['input']>
  lastVrfOutput?: InputMaybe<Scalars['String']['input']>
  minWindowDensity?: InputMaybe<Scalars['Int']['input']>
  nextEpochData?: InputMaybe<BlockProtocolStateConsensusStateNextEpochDatumInsertInput>
  slot?: InputMaybe<Scalars['Int']['input']>
  slotSinceGenesis?: InputMaybe<Scalars['Int']['input']>
  stakingEpochData?: InputMaybe<BlockProtocolStateConsensusStateStakingEpochDatumInsertInput>
  totalCurrency?: InputMaybe<Scalars['Float']['input']>
}

export type BlockProtocolStateConsensusStateNextEpochDatum = {
  __typename?: 'BlockProtocolStateConsensusStateNextEpochDatum'
  epochLength?: Maybe<Scalars['Int']['output']>
  ledger?: Maybe<BlockProtocolStateConsensusStateNextEpochDatumLedger>
  lockCheckpoint?: Maybe<Scalars['String']['output']>
  seed?: Maybe<Scalars['String']['output']>
  startCheckpoint?: Maybe<Scalars['String']['output']>
}

export type BlockProtocolStateConsensusStateNextEpochDatumInsertInput = {
  epochLength?: InputMaybe<Scalars['Int']['input']>
  ledger?: InputMaybe<BlockProtocolStateConsensusStateNextEpochDatumLedgerInsertInput>
  lockCheckpoint?: InputMaybe<Scalars['String']['input']>
  seed?: InputMaybe<Scalars['String']['input']>
  startCheckpoint?: InputMaybe<Scalars['String']['input']>
}

export type BlockProtocolStateConsensusStateNextEpochDatumLedger = {
  __typename?: 'BlockProtocolStateConsensusStateNextEpochDatumLedger'
  hash?: Maybe<Scalars['String']['output']>
  totalCurrency?: Maybe<Scalars['Float']['output']>
}

export type BlockProtocolStateConsensusStateNextEpochDatumLedgerInsertInput = {
  hash?: InputMaybe<Scalars['String']['input']>
  totalCurrency?: InputMaybe<Scalars['Float']['input']>
}

export type BlockProtocolStateConsensusStateNextEpochDatumLedgerQueryInput = {
  AND?: InputMaybe<
    Array<BlockProtocolStateConsensusStateNextEpochDatumLedgerQueryInput>
  >
  OR?: InputMaybe<
    Array<BlockProtocolStateConsensusStateNextEpochDatumLedgerQueryInput>
  >
  hash?: InputMaybe<Scalars['String']['input']>
  hash_exists?: InputMaybe<Scalars['Boolean']['input']>
  hash_gt?: InputMaybe<Scalars['String']['input']>
  hash_gte?: InputMaybe<Scalars['String']['input']>
  hash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  hash_lt?: InputMaybe<Scalars['String']['input']>
  hash_lte?: InputMaybe<Scalars['String']['input']>
  hash_ne?: InputMaybe<Scalars['String']['input']>
  hash_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  totalCurrency?: InputMaybe<Scalars['Float']['input']>
  totalCurrency_exists?: InputMaybe<Scalars['Boolean']['input']>
  totalCurrency_gt?: InputMaybe<Scalars['Float']['input']>
  totalCurrency_gte?: InputMaybe<Scalars['Float']['input']>
  totalCurrency_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
  totalCurrency_lt?: InputMaybe<Scalars['Float']['input']>
  totalCurrency_lte?: InputMaybe<Scalars['Float']['input']>
  totalCurrency_ne?: InputMaybe<Scalars['Float']['input']>
  totalCurrency_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
}

export type BlockProtocolStateConsensusStateNextEpochDatumLedgerUpdateInput = {
  hash?: InputMaybe<Scalars['String']['input']>
  hash_unset?: InputMaybe<Scalars['Boolean']['input']>
  totalCurrency?: InputMaybe<Scalars['Float']['input']>
  totalCurrency_inc?: InputMaybe<Scalars['Float']['input']>
  totalCurrency_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type BlockProtocolStateConsensusStateNextEpochDatumQueryInput = {
  AND?: InputMaybe<
    Array<BlockProtocolStateConsensusStateNextEpochDatumQueryInput>
  >
  OR?: InputMaybe<
    Array<BlockProtocolStateConsensusStateNextEpochDatumQueryInput>
  >
  epochLength?: InputMaybe<Scalars['Int']['input']>
  epochLength_exists?: InputMaybe<Scalars['Boolean']['input']>
  epochLength_gt?: InputMaybe<Scalars['Int']['input']>
  epochLength_gte?: InputMaybe<Scalars['Int']['input']>
  epochLength_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  epochLength_lt?: InputMaybe<Scalars['Int']['input']>
  epochLength_lte?: InputMaybe<Scalars['Int']['input']>
  epochLength_ne?: InputMaybe<Scalars['Int']['input']>
  epochLength_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  ledger?: InputMaybe<BlockProtocolStateConsensusStateNextEpochDatumLedgerQueryInput>
  ledger_exists?: InputMaybe<Scalars['Boolean']['input']>
  lockCheckpoint?: InputMaybe<Scalars['String']['input']>
  lockCheckpoint_exists?: InputMaybe<Scalars['Boolean']['input']>
  lockCheckpoint_gt?: InputMaybe<Scalars['String']['input']>
  lockCheckpoint_gte?: InputMaybe<Scalars['String']['input']>
  lockCheckpoint_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  lockCheckpoint_lt?: InputMaybe<Scalars['String']['input']>
  lockCheckpoint_lte?: InputMaybe<Scalars['String']['input']>
  lockCheckpoint_ne?: InputMaybe<Scalars['String']['input']>
  lockCheckpoint_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  seed?: InputMaybe<Scalars['String']['input']>
  seed_exists?: InputMaybe<Scalars['Boolean']['input']>
  seed_gt?: InputMaybe<Scalars['String']['input']>
  seed_gte?: InputMaybe<Scalars['String']['input']>
  seed_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  seed_lt?: InputMaybe<Scalars['String']['input']>
  seed_lte?: InputMaybe<Scalars['String']['input']>
  seed_ne?: InputMaybe<Scalars['String']['input']>
  seed_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  startCheckpoint?: InputMaybe<Scalars['String']['input']>
  startCheckpoint_exists?: InputMaybe<Scalars['Boolean']['input']>
  startCheckpoint_gt?: InputMaybe<Scalars['String']['input']>
  startCheckpoint_gte?: InputMaybe<Scalars['String']['input']>
  startCheckpoint_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  startCheckpoint_lt?: InputMaybe<Scalars['String']['input']>
  startCheckpoint_lte?: InputMaybe<Scalars['String']['input']>
  startCheckpoint_ne?: InputMaybe<Scalars['String']['input']>
  startCheckpoint_nin?: InputMaybe<
    Array<InputMaybe<Scalars['String']['input']>>
  >
}

export type BlockProtocolStateConsensusStateNextEpochDatumUpdateInput = {
  epochLength?: InputMaybe<Scalars['Int']['input']>
  epochLength_inc?: InputMaybe<Scalars['Int']['input']>
  epochLength_unset?: InputMaybe<Scalars['Boolean']['input']>
  ledger?: InputMaybe<BlockProtocolStateConsensusStateNextEpochDatumLedgerUpdateInput>
  ledger_unset?: InputMaybe<Scalars['Boolean']['input']>
  lockCheckpoint?: InputMaybe<Scalars['String']['input']>
  lockCheckpoint_unset?: InputMaybe<Scalars['Boolean']['input']>
  seed?: InputMaybe<Scalars['String']['input']>
  seed_unset?: InputMaybe<Scalars['Boolean']['input']>
  startCheckpoint?: InputMaybe<Scalars['String']['input']>
  startCheckpoint_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type BlockProtocolStateConsensusStateQueryInput = {
  AND?: InputMaybe<Array<BlockProtocolStateConsensusStateQueryInput>>
  OR?: InputMaybe<Array<BlockProtocolStateConsensusStateQueryInput>>
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  blockHeight_exists?: InputMaybe<Scalars['Boolean']['input']>
  blockHeight_gt?: InputMaybe<Scalars['Int']['input']>
  blockHeight_gte?: InputMaybe<Scalars['Int']['input']>
  blockHeight_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  blockHeight_lt?: InputMaybe<Scalars['Int']['input']>
  blockHeight_lte?: InputMaybe<Scalars['Int']['input']>
  blockHeight_ne?: InputMaybe<Scalars['Int']['input']>
  blockHeight_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  blockchainLength?: InputMaybe<Scalars['Int']['input']>
  blockchainLength_exists?: InputMaybe<Scalars['Boolean']['input']>
  blockchainLength_gt?: InputMaybe<Scalars['Int']['input']>
  blockchainLength_gte?: InputMaybe<Scalars['Int']['input']>
  blockchainLength_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  blockchainLength_lt?: InputMaybe<Scalars['Int']['input']>
  blockchainLength_lte?: InputMaybe<Scalars['Int']['input']>
  blockchainLength_ne?: InputMaybe<Scalars['Int']['input']>
  blockchainLength_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  epoch?: InputMaybe<Scalars['Int']['input']>
  epochCount?: InputMaybe<Scalars['Int']['input']>
  epochCount_exists?: InputMaybe<Scalars['Boolean']['input']>
  epochCount_gt?: InputMaybe<Scalars['Int']['input']>
  epochCount_gte?: InputMaybe<Scalars['Int']['input']>
  epochCount_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  epochCount_lt?: InputMaybe<Scalars['Int']['input']>
  epochCount_lte?: InputMaybe<Scalars['Int']['input']>
  epochCount_ne?: InputMaybe<Scalars['Int']['input']>
  epochCount_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  epoch_exists?: InputMaybe<Scalars['Boolean']['input']>
  epoch_gt?: InputMaybe<Scalars['Int']['input']>
  epoch_gte?: InputMaybe<Scalars['Int']['input']>
  epoch_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  epoch_lt?: InputMaybe<Scalars['Int']['input']>
  epoch_lte?: InputMaybe<Scalars['Int']['input']>
  epoch_ne?: InputMaybe<Scalars['Int']['input']>
  epoch_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  hasAncestorInSameCheckpointWindow?: InputMaybe<Scalars['Boolean']['input']>
  hasAncestorInSameCheckpointWindow_exists?: InputMaybe<
    Scalars['Boolean']['input']
  >
  hasAncestorInSameCheckpointWindow_ne?: InputMaybe<Scalars['Boolean']['input']>
  lastVrfOutput?: InputMaybe<Scalars['String']['input']>
  lastVrfOutput_exists?: InputMaybe<Scalars['Boolean']['input']>
  lastVrfOutput_gt?: InputMaybe<Scalars['String']['input']>
  lastVrfOutput_gte?: InputMaybe<Scalars['String']['input']>
  lastVrfOutput_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  lastVrfOutput_lt?: InputMaybe<Scalars['String']['input']>
  lastVrfOutput_lte?: InputMaybe<Scalars['String']['input']>
  lastVrfOutput_ne?: InputMaybe<Scalars['String']['input']>
  lastVrfOutput_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  minWindowDensity?: InputMaybe<Scalars['Int']['input']>
  minWindowDensity_exists?: InputMaybe<Scalars['Boolean']['input']>
  minWindowDensity_gt?: InputMaybe<Scalars['Int']['input']>
  minWindowDensity_gte?: InputMaybe<Scalars['Int']['input']>
  minWindowDensity_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  minWindowDensity_lt?: InputMaybe<Scalars['Int']['input']>
  minWindowDensity_lte?: InputMaybe<Scalars['Int']['input']>
  minWindowDensity_ne?: InputMaybe<Scalars['Int']['input']>
  minWindowDensity_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  nextEpochData?: InputMaybe<BlockProtocolStateConsensusStateNextEpochDatumQueryInput>
  nextEpochData_exists?: InputMaybe<Scalars['Boolean']['input']>
  slot?: InputMaybe<Scalars['Int']['input']>
  slotSinceGenesis?: InputMaybe<Scalars['Int']['input']>
  slotSinceGenesis_exists?: InputMaybe<Scalars['Boolean']['input']>
  slotSinceGenesis_gt?: InputMaybe<Scalars['Int']['input']>
  slotSinceGenesis_gte?: InputMaybe<Scalars['Int']['input']>
  slotSinceGenesis_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  slotSinceGenesis_lt?: InputMaybe<Scalars['Int']['input']>
  slotSinceGenesis_lte?: InputMaybe<Scalars['Int']['input']>
  slotSinceGenesis_ne?: InputMaybe<Scalars['Int']['input']>
  slotSinceGenesis_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  slot_exists?: InputMaybe<Scalars['Boolean']['input']>
  slot_gt?: InputMaybe<Scalars['Int']['input']>
  slot_gte?: InputMaybe<Scalars['Int']['input']>
  slot_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  slot_lt?: InputMaybe<Scalars['Int']['input']>
  slot_lte?: InputMaybe<Scalars['Int']['input']>
  slot_ne?: InputMaybe<Scalars['Int']['input']>
  slot_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  stakingEpochData?: InputMaybe<BlockProtocolStateConsensusStateStakingEpochDatumQueryInput>
  stakingEpochData_exists?: InputMaybe<Scalars['Boolean']['input']>
  totalCurrency?: InputMaybe<Scalars['Float']['input']>
  totalCurrency_exists?: InputMaybe<Scalars['Boolean']['input']>
  totalCurrency_gt?: InputMaybe<Scalars['Float']['input']>
  totalCurrency_gte?: InputMaybe<Scalars['Float']['input']>
  totalCurrency_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
  totalCurrency_lt?: InputMaybe<Scalars['Float']['input']>
  totalCurrency_lte?: InputMaybe<Scalars['Float']['input']>
  totalCurrency_ne?: InputMaybe<Scalars['Float']['input']>
  totalCurrency_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
}

export type BlockProtocolStateConsensusStateStakingEpochDatum = {
  __typename?: 'BlockProtocolStateConsensusStateStakingEpochDatum'
  epochLength?: Maybe<Scalars['Int']['output']>
  ledger?: Maybe<BlockProtocolStateConsensusStateStakingEpochDatumLedger>
  lockCheckpoint?: Maybe<Scalars['String']['output']>
  seed?: Maybe<Scalars['String']['output']>
  startCheckpoint?: Maybe<Scalars['String']['output']>
}

export type BlockProtocolStateConsensusStateStakingEpochDatumInsertInput = {
  epochLength?: InputMaybe<Scalars['Int']['input']>
  ledger?: InputMaybe<BlockProtocolStateConsensusStateStakingEpochDatumLedgerInsertInput>
  lockCheckpoint?: InputMaybe<Scalars['String']['input']>
  seed?: InputMaybe<Scalars['String']['input']>
  startCheckpoint?: InputMaybe<Scalars['String']['input']>
}

export type BlockProtocolStateConsensusStateStakingEpochDatumLedger = {
  __typename?: 'BlockProtocolStateConsensusStateStakingEpochDatumLedger'
  hash?: Maybe<Scalars['String']['output']>
  totalCurrency?: Maybe<Scalars['Float']['output']>
}

export type BlockProtocolStateConsensusStateStakingEpochDatumLedgerInsertInput =
  {
    hash?: InputMaybe<Scalars['String']['input']>
    totalCurrency?: InputMaybe<Scalars['Float']['input']>
  }

export type BlockProtocolStateConsensusStateStakingEpochDatumLedgerQueryInput =
  {
    AND?: InputMaybe<
      Array<BlockProtocolStateConsensusStateStakingEpochDatumLedgerQueryInput>
    >
    OR?: InputMaybe<
      Array<BlockProtocolStateConsensusStateStakingEpochDatumLedgerQueryInput>
    >
    hash?: InputMaybe<Scalars['String']['input']>
    hash_exists?: InputMaybe<Scalars['Boolean']['input']>
    hash_gt?: InputMaybe<Scalars['String']['input']>
    hash_gte?: InputMaybe<Scalars['String']['input']>
    hash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
    hash_lt?: InputMaybe<Scalars['String']['input']>
    hash_lte?: InputMaybe<Scalars['String']['input']>
    hash_ne?: InputMaybe<Scalars['String']['input']>
    hash_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
    totalCurrency?: InputMaybe<Scalars['Float']['input']>
    totalCurrency_exists?: InputMaybe<Scalars['Boolean']['input']>
    totalCurrency_gt?: InputMaybe<Scalars['Float']['input']>
    totalCurrency_gte?: InputMaybe<Scalars['Float']['input']>
    totalCurrency_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
    totalCurrency_lt?: InputMaybe<Scalars['Float']['input']>
    totalCurrency_lte?: InputMaybe<Scalars['Float']['input']>
    totalCurrency_ne?: InputMaybe<Scalars['Float']['input']>
    totalCurrency_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
  }

export type BlockProtocolStateConsensusStateStakingEpochDatumLedgerUpdateInput =
  {
    hash?: InputMaybe<Scalars['String']['input']>
    hash_unset?: InputMaybe<Scalars['Boolean']['input']>
    totalCurrency?: InputMaybe<Scalars['Float']['input']>
    totalCurrency_inc?: InputMaybe<Scalars['Float']['input']>
    totalCurrency_unset?: InputMaybe<Scalars['Boolean']['input']>
  }

export type BlockProtocolStateConsensusStateStakingEpochDatumQueryInput = {
  AND?: InputMaybe<
    Array<BlockProtocolStateConsensusStateStakingEpochDatumQueryInput>
  >
  OR?: InputMaybe<
    Array<BlockProtocolStateConsensusStateStakingEpochDatumQueryInput>
  >
  epochLength?: InputMaybe<Scalars['Int']['input']>
  epochLength_exists?: InputMaybe<Scalars['Boolean']['input']>
  epochLength_gt?: InputMaybe<Scalars['Int']['input']>
  epochLength_gte?: InputMaybe<Scalars['Int']['input']>
  epochLength_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  epochLength_lt?: InputMaybe<Scalars['Int']['input']>
  epochLength_lte?: InputMaybe<Scalars['Int']['input']>
  epochLength_ne?: InputMaybe<Scalars['Int']['input']>
  epochLength_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  ledger?: InputMaybe<BlockProtocolStateConsensusStateStakingEpochDatumLedgerQueryInput>
  ledger_exists?: InputMaybe<Scalars['Boolean']['input']>
  lockCheckpoint?: InputMaybe<Scalars['String']['input']>
  lockCheckpoint_exists?: InputMaybe<Scalars['Boolean']['input']>
  lockCheckpoint_gt?: InputMaybe<Scalars['String']['input']>
  lockCheckpoint_gte?: InputMaybe<Scalars['String']['input']>
  lockCheckpoint_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  lockCheckpoint_lt?: InputMaybe<Scalars['String']['input']>
  lockCheckpoint_lte?: InputMaybe<Scalars['String']['input']>
  lockCheckpoint_ne?: InputMaybe<Scalars['String']['input']>
  lockCheckpoint_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  seed?: InputMaybe<Scalars['String']['input']>
  seed_exists?: InputMaybe<Scalars['Boolean']['input']>
  seed_gt?: InputMaybe<Scalars['String']['input']>
  seed_gte?: InputMaybe<Scalars['String']['input']>
  seed_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  seed_lt?: InputMaybe<Scalars['String']['input']>
  seed_lte?: InputMaybe<Scalars['String']['input']>
  seed_ne?: InputMaybe<Scalars['String']['input']>
  seed_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  startCheckpoint?: InputMaybe<Scalars['String']['input']>
  startCheckpoint_exists?: InputMaybe<Scalars['Boolean']['input']>
  startCheckpoint_gt?: InputMaybe<Scalars['String']['input']>
  startCheckpoint_gte?: InputMaybe<Scalars['String']['input']>
  startCheckpoint_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  startCheckpoint_lt?: InputMaybe<Scalars['String']['input']>
  startCheckpoint_lte?: InputMaybe<Scalars['String']['input']>
  startCheckpoint_ne?: InputMaybe<Scalars['String']['input']>
  startCheckpoint_nin?: InputMaybe<
    Array<InputMaybe<Scalars['String']['input']>>
  >
}

export type BlockProtocolStateConsensusStateStakingEpochDatumUpdateInput = {
  epochLength?: InputMaybe<Scalars['Int']['input']>
  epochLength_inc?: InputMaybe<Scalars['Int']['input']>
  epochLength_unset?: InputMaybe<Scalars['Boolean']['input']>
  ledger?: InputMaybe<BlockProtocolStateConsensusStateStakingEpochDatumLedgerUpdateInput>
  ledger_unset?: InputMaybe<Scalars['Boolean']['input']>
  lockCheckpoint?: InputMaybe<Scalars['String']['input']>
  lockCheckpoint_unset?: InputMaybe<Scalars['Boolean']['input']>
  seed?: InputMaybe<Scalars['String']['input']>
  seed_unset?: InputMaybe<Scalars['Boolean']['input']>
  startCheckpoint?: InputMaybe<Scalars['String']['input']>
  startCheckpoint_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type BlockProtocolStateConsensusStateUpdateInput = {
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  blockHeight_inc?: InputMaybe<Scalars['Int']['input']>
  blockHeight_unset?: InputMaybe<Scalars['Boolean']['input']>
  blockchainLength?: InputMaybe<Scalars['Int']['input']>
  blockchainLength_inc?: InputMaybe<Scalars['Int']['input']>
  blockchainLength_unset?: InputMaybe<Scalars['Boolean']['input']>
  epoch?: InputMaybe<Scalars['Int']['input']>
  epochCount?: InputMaybe<Scalars['Int']['input']>
  epochCount_inc?: InputMaybe<Scalars['Int']['input']>
  epochCount_unset?: InputMaybe<Scalars['Boolean']['input']>
  epoch_inc?: InputMaybe<Scalars['Int']['input']>
  epoch_unset?: InputMaybe<Scalars['Boolean']['input']>
  hasAncestorInSameCheckpointWindow?: InputMaybe<Scalars['Boolean']['input']>
  hasAncestorInSameCheckpointWindow_unset?: InputMaybe<
    Scalars['Boolean']['input']
  >
  lastVrfOutput?: InputMaybe<Scalars['String']['input']>
  lastVrfOutput_unset?: InputMaybe<Scalars['Boolean']['input']>
  minWindowDensity?: InputMaybe<Scalars['Int']['input']>
  minWindowDensity_inc?: InputMaybe<Scalars['Int']['input']>
  minWindowDensity_unset?: InputMaybe<Scalars['Boolean']['input']>
  nextEpochData?: InputMaybe<BlockProtocolStateConsensusStateNextEpochDatumUpdateInput>
  nextEpochData_unset?: InputMaybe<Scalars['Boolean']['input']>
  slot?: InputMaybe<Scalars['Int']['input']>
  slotSinceGenesis?: InputMaybe<Scalars['Int']['input']>
  slotSinceGenesis_inc?: InputMaybe<Scalars['Int']['input']>
  slotSinceGenesis_unset?: InputMaybe<Scalars['Boolean']['input']>
  slot_inc?: InputMaybe<Scalars['Int']['input']>
  slot_unset?: InputMaybe<Scalars['Boolean']['input']>
  stakingEpochData?: InputMaybe<BlockProtocolStateConsensusStateStakingEpochDatumUpdateInput>
  stakingEpochData_unset?: InputMaybe<Scalars['Boolean']['input']>
  totalCurrency?: InputMaybe<Scalars['Float']['input']>
  totalCurrency_inc?: InputMaybe<Scalars['Float']['input']>
  totalCurrency_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type BlockProtocolStateInsertInput = {
  blockchainState?: InputMaybe<BlockProtocolStateBlockchainStateInsertInput>
  consensusState?: InputMaybe<BlockProtocolStateConsensusStateInsertInput>
  previousStateHash?: InputMaybe<Scalars['String']['input']>
}

export type BlockProtocolStateQueryInput = {
  AND?: InputMaybe<Array<BlockProtocolStateQueryInput>>
  OR?: InputMaybe<Array<BlockProtocolStateQueryInput>>
  blockchainState?: InputMaybe<BlockProtocolStateBlockchainStateQueryInput>
  blockchainState_exists?: InputMaybe<Scalars['Boolean']['input']>
  consensusState?: InputMaybe<BlockProtocolStateConsensusStateQueryInput>
  consensusState_exists?: InputMaybe<Scalars['Boolean']['input']>
  previousStateHash?: InputMaybe<Scalars['String']['input']>
  previousStateHash_exists?: InputMaybe<Scalars['Boolean']['input']>
  previousStateHash_gt?: InputMaybe<Scalars['String']['input']>
  previousStateHash_gte?: InputMaybe<Scalars['String']['input']>
  previousStateHash_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']['input']>>
  >
  previousStateHash_lt?: InputMaybe<Scalars['String']['input']>
  previousStateHash_lte?: InputMaybe<Scalars['String']['input']>
  previousStateHash_ne?: InputMaybe<Scalars['String']['input']>
  previousStateHash_nin?: InputMaybe<
    Array<InputMaybe<Scalars['String']['input']>>
  >
}

export type BlockProtocolStateUpdateInput = {
  blockchainState?: InputMaybe<BlockProtocolStateBlockchainStateUpdateInput>
  blockchainState_unset?: InputMaybe<Scalars['Boolean']['input']>
  consensusState?: InputMaybe<BlockProtocolStateConsensusStateUpdateInput>
  consensusState_unset?: InputMaybe<Scalars['Boolean']['input']>
  previousStateHash?: InputMaybe<Scalars['String']['input']>
  previousStateHash_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type BlockQueryInput = {
  AND?: InputMaybe<Array<BlockQueryInput>>
  OR?: InputMaybe<Array<BlockQueryInput>>
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  blockHeight_exists?: InputMaybe<Scalars['Boolean']['input']>
  blockHeight_gt?: InputMaybe<Scalars['Int']['input']>
  blockHeight_gte?: InputMaybe<Scalars['Int']['input']>
  blockHeight_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  blockHeight_lt?: InputMaybe<Scalars['Int']['input']>
  blockHeight_lte?: InputMaybe<Scalars['Int']['input']>
  blockHeight_ne?: InputMaybe<Scalars['Int']['input']>
  blockHeight_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  canonical?: InputMaybe<Scalars['Boolean']['input']>
  canonical_exists?: InputMaybe<Scalars['Boolean']['input']>
  canonical_ne?: InputMaybe<Scalars['Boolean']['input']>
  creator?: InputMaybe<Scalars['String']['input']>
  creatorAccount?: InputMaybe<BlockCreatorAccountQueryInput>
  creatorAccount_exists?: InputMaybe<Scalars['Boolean']['input']>
  creator_exists?: InputMaybe<Scalars['Boolean']['input']>
  creator_gt?: InputMaybe<Scalars['String']['input']>
  creator_gte?: InputMaybe<Scalars['String']['input']>
  creator_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  creator_lt?: InputMaybe<Scalars['String']['input']>
  creator_lte?: InputMaybe<Scalars['String']['input']>
  creator_ne?: InputMaybe<Scalars['String']['input']>
  creator_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  dateTime?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_exists?: InputMaybe<Scalars['Boolean']['input']>
  dateTime_gt?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_gte?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>
  dateTime_lt?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_lte?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_ne?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>
  protocolState?: InputMaybe<BlockProtocolStateQueryInput>
  protocolState_exists?: InputMaybe<Scalars['Boolean']['input']>
  receivedTime?: InputMaybe<Scalars['DateTime']['input']>
  receivedTime_exists?: InputMaybe<Scalars['Boolean']['input']>
  receivedTime_gt?: InputMaybe<Scalars['DateTime']['input']>
  receivedTime_gte?: InputMaybe<Scalars['DateTime']['input']>
  receivedTime_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>
  receivedTime_lt?: InputMaybe<Scalars['DateTime']['input']>
  receivedTime_lte?: InputMaybe<Scalars['DateTime']['input']>
  receivedTime_ne?: InputMaybe<Scalars['DateTime']['input']>
  receivedTime_nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>
  snarkJobs?: InputMaybe<Array<InputMaybe<BlockSnarkJobQueryInput>>>
  snarkJobs_exists?: InputMaybe<Scalars['Boolean']['input']>
  snarkJobs_in?: InputMaybe<Array<InputMaybe<BlockSnarkJobQueryInput>>>
  snarkJobs_nin?: InputMaybe<Array<InputMaybe<BlockSnarkJobQueryInput>>>
  stateHash?: InputMaybe<Scalars['String']['input']>
  stateHashField?: InputMaybe<Scalars['String']['input']>
  stateHashField_exists?: InputMaybe<Scalars['Boolean']['input']>
  stateHashField_gt?: InputMaybe<Scalars['String']['input']>
  stateHashField_gte?: InputMaybe<Scalars['String']['input']>
  stateHashField_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  stateHashField_lt?: InputMaybe<Scalars['String']['input']>
  stateHashField_lte?: InputMaybe<Scalars['String']['input']>
  stateHashField_ne?: InputMaybe<Scalars['String']['input']>
  stateHashField_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  stateHash_exists?: InputMaybe<Scalars['Boolean']['input']>
  stateHash_gt?: InputMaybe<Scalars['String']['input']>
  stateHash_gte?: InputMaybe<Scalars['String']['input']>
  stateHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  stateHash_lt?: InputMaybe<Scalars['String']['input']>
  stateHash_lte?: InputMaybe<Scalars['String']['input']>
  stateHash_ne?: InputMaybe<Scalars['String']['input']>
  stateHash_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  transactions?: InputMaybe<BlockTransactionQueryInput>
  transactions_exists?: InputMaybe<Scalars['Boolean']['input']>
  winnerAccount?: InputMaybe<BlockWinnerAccountQueryInput>
  winnerAccount_exists?: InputMaybe<Scalars['Boolean']['input']>
}

export type BlockSnarkJob = {
  __typename?: 'BlockSnarkJob'
  blockHeight?: Maybe<Scalars['Int']['output']>
  blockStateHash?: Maybe<Scalars['String']['output']>
  dateTime?: Maybe<Scalars['DateTime']['output']>
  fee?: Maybe<Scalars['Int']['output']>
  prover?: Maybe<Scalars['String']['output']>
  workIds?: Maybe<Array<Maybe<Scalars['Int']['output']>>>
}

export type BlockSnarkJobInsertInput = {
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  blockStateHash?: InputMaybe<Scalars['String']['input']>
  dateTime?: InputMaybe<Scalars['DateTime']['input']>
  fee?: InputMaybe<Scalars['Int']['input']>
  prover?: InputMaybe<Scalars['String']['input']>
  workIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
}

export type BlockSnarkJobQueryInput = {
  AND?: InputMaybe<Array<BlockSnarkJobQueryInput>>
  OR?: InputMaybe<Array<BlockSnarkJobQueryInput>>
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  blockHeight_exists?: InputMaybe<Scalars['Boolean']['input']>
  blockHeight_gt?: InputMaybe<Scalars['Int']['input']>
  blockHeight_gte?: InputMaybe<Scalars['Int']['input']>
  blockHeight_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  blockHeight_lt?: InputMaybe<Scalars['Int']['input']>
  blockHeight_lte?: InputMaybe<Scalars['Int']['input']>
  blockHeight_ne?: InputMaybe<Scalars['Int']['input']>
  blockHeight_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  blockStateHash?: InputMaybe<Scalars['String']['input']>
  blockStateHash_exists?: InputMaybe<Scalars['Boolean']['input']>
  blockStateHash_gt?: InputMaybe<Scalars['String']['input']>
  blockStateHash_gte?: InputMaybe<Scalars['String']['input']>
  blockStateHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  blockStateHash_lt?: InputMaybe<Scalars['String']['input']>
  blockStateHash_lte?: InputMaybe<Scalars['String']['input']>
  blockStateHash_ne?: InputMaybe<Scalars['String']['input']>
  blockStateHash_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  dateTime?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_exists?: InputMaybe<Scalars['Boolean']['input']>
  dateTime_gt?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_gte?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>
  dateTime_lt?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_lte?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_ne?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>
  fee?: InputMaybe<Scalars['Int']['input']>
  fee_exists?: InputMaybe<Scalars['Boolean']['input']>
  fee_gt?: InputMaybe<Scalars['Int']['input']>
  fee_gte?: InputMaybe<Scalars['Int']['input']>
  fee_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  fee_lt?: InputMaybe<Scalars['Int']['input']>
  fee_lte?: InputMaybe<Scalars['Int']['input']>
  fee_ne?: InputMaybe<Scalars['Int']['input']>
  fee_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  prover?: InputMaybe<Scalars['String']['input']>
  prover_exists?: InputMaybe<Scalars['Boolean']['input']>
  prover_gt?: InputMaybe<Scalars['String']['input']>
  prover_gte?: InputMaybe<Scalars['String']['input']>
  prover_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  prover_lt?: InputMaybe<Scalars['String']['input']>
  prover_lte?: InputMaybe<Scalars['String']['input']>
  prover_ne?: InputMaybe<Scalars['String']['input']>
  prover_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  workIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  workIds_exists?: InputMaybe<Scalars['Boolean']['input']>
  workIds_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  workIds_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
}

export type BlockSnarkJobUpdateInput = {
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  blockHeight_inc?: InputMaybe<Scalars['Int']['input']>
  blockHeight_unset?: InputMaybe<Scalars['Boolean']['input']>
  blockStateHash?: InputMaybe<Scalars['String']['input']>
  blockStateHash_unset?: InputMaybe<Scalars['Boolean']['input']>
  dateTime?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_unset?: InputMaybe<Scalars['Boolean']['input']>
  fee?: InputMaybe<Scalars['Int']['input']>
  fee_inc?: InputMaybe<Scalars['Int']['input']>
  fee_unset?: InputMaybe<Scalars['Boolean']['input']>
  prover?: InputMaybe<Scalars['String']['input']>
  prover_unset?: InputMaybe<Scalars['Boolean']['input']>
  workIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  workIds_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export enum BlockSortByInput {
  BlockheightAsc = 'BLOCKHEIGHT_ASC',
  BlockheightDesc = 'BLOCKHEIGHT_DESC',
  CreatorAsc = 'CREATOR_ASC',
  CreatorDesc = 'CREATOR_DESC',
  DatetimeAsc = 'DATETIME_ASC',
  DatetimeDesc = 'DATETIME_DESC',
  ReceivedtimeAsc = 'RECEIVEDTIME_ASC',
  ReceivedtimeDesc = 'RECEIVEDTIME_DESC',
  StatehashfieldAsc = 'STATEHASHFIELD_ASC',
  StatehashfieldDesc = 'STATEHASHFIELD_DESC',
  StatehashAsc = 'STATEHASH_ASC',
  StatehashDesc = 'STATEHASH_DESC'
}

export type BlockTransaction = {
  __typename?: 'BlockTransaction'
  coinbase?: Maybe<Scalars['Long']['output']>
  coinbaseReceiverAccount?: Maybe<BlockTransactionCoinbaseReceiverAccount>
  feeTransfer?: Maybe<Array<Maybe<BlockTransactionFeeTransfer>>>
  userCommands?: Maybe<Array<Maybe<BlockTransactionUserCommand>>>
}

export type BlockTransactionCoinbaseReceiverAccount = {
  __typename?: 'BlockTransactionCoinbaseReceiverAccount'
  publicKey?: Maybe<Scalars['String']['output']>
}

export type BlockTransactionCoinbaseReceiverAccountInsertInput = {
  publicKey?: InputMaybe<Scalars['String']['input']>
}

export type BlockTransactionCoinbaseReceiverAccountQueryInput = {
  AND?: InputMaybe<Array<BlockTransactionCoinbaseReceiverAccountQueryInput>>
  OR?: InputMaybe<Array<BlockTransactionCoinbaseReceiverAccountQueryInput>>
  publicKey?: InputMaybe<Scalars['String']['input']>
  publicKey_exists?: InputMaybe<Scalars['Boolean']['input']>
  publicKey_gt?: InputMaybe<Scalars['String']['input']>
  publicKey_gte?: InputMaybe<Scalars['String']['input']>
  publicKey_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  publicKey_lt?: InputMaybe<Scalars['String']['input']>
  publicKey_lte?: InputMaybe<Scalars['String']['input']>
  publicKey_ne?: InputMaybe<Scalars['String']['input']>
  publicKey_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
}

export type BlockTransactionCoinbaseReceiverAccountUpdateInput = {
  publicKey?: InputMaybe<Scalars['String']['input']>
  publicKey_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type BlockTransactionFeeTransfer = {
  __typename?: 'BlockTransactionFeeTransfer'
  fee?: Maybe<Scalars['Long']['output']>
  recipient?: Maybe<Scalars['String']['output']>
  type?: Maybe<Scalars['String']['output']>
}

export type BlockTransactionFeeTransferInsertInput = {
  fee?: InputMaybe<Scalars['Long']['input']>
  recipient?: InputMaybe<Scalars['String']['input']>
  type?: InputMaybe<Scalars['String']['input']>
}

export type BlockTransactionFeeTransferQueryInput = {
  AND?: InputMaybe<Array<BlockTransactionFeeTransferQueryInput>>
  OR?: InputMaybe<Array<BlockTransactionFeeTransferQueryInput>>
  fee?: InputMaybe<Scalars['Long']['input']>
  fee_exists?: InputMaybe<Scalars['Boolean']['input']>
  fee_gt?: InputMaybe<Scalars['Long']['input']>
  fee_gte?: InputMaybe<Scalars['Long']['input']>
  fee_in?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>
  fee_lt?: InputMaybe<Scalars['Long']['input']>
  fee_lte?: InputMaybe<Scalars['Long']['input']>
  fee_ne?: InputMaybe<Scalars['Long']['input']>
  fee_nin?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>
  recipient?: InputMaybe<Scalars['String']['input']>
  recipient_exists?: InputMaybe<Scalars['Boolean']['input']>
  recipient_gt?: InputMaybe<Scalars['String']['input']>
  recipient_gte?: InputMaybe<Scalars['String']['input']>
  recipient_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  recipient_lt?: InputMaybe<Scalars['String']['input']>
  recipient_lte?: InputMaybe<Scalars['String']['input']>
  recipient_ne?: InputMaybe<Scalars['String']['input']>
  recipient_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  type?: InputMaybe<Scalars['String']['input']>
  type_exists?: InputMaybe<Scalars['Boolean']['input']>
  type_gt?: InputMaybe<Scalars['String']['input']>
  type_gte?: InputMaybe<Scalars['String']['input']>
  type_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  type_lt?: InputMaybe<Scalars['String']['input']>
  type_lte?: InputMaybe<Scalars['String']['input']>
  type_ne?: InputMaybe<Scalars['String']['input']>
  type_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
}

export type BlockTransactionFeeTransferUpdateInput = {
  fee?: InputMaybe<Scalars['Long']['input']>
  fee_unset?: InputMaybe<Scalars['Boolean']['input']>
  recipient?: InputMaybe<Scalars['String']['input']>
  recipient_unset?: InputMaybe<Scalars['Boolean']['input']>
  type?: InputMaybe<Scalars['String']['input']>
  type_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type BlockTransactionInsertInput = {
  coinbase?: InputMaybe<Scalars['Long']['input']>
  coinbaseReceiverAccount?: InputMaybe<BlockTransactionCoinbaseReceiverAccountInsertInput>
  feeTransfer?: InputMaybe<
    Array<InputMaybe<BlockTransactionFeeTransferInsertInput>>
  >
  userCommands?: InputMaybe<
    Array<InputMaybe<BlockTransactionUserCommandInsertInput>>
  >
}

export type BlockTransactionQueryInput = {
  AND?: InputMaybe<Array<BlockTransactionQueryInput>>
  OR?: InputMaybe<Array<BlockTransactionQueryInput>>
  coinbase?: InputMaybe<Scalars['Long']['input']>
  coinbaseReceiverAccount?: InputMaybe<BlockTransactionCoinbaseReceiverAccountQueryInput>
  coinbaseReceiverAccount_exists?: InputMaybe<Scalars['Boolean']['input']>
  coinbase_exists?: InputMaybe<Scalars['Boolean']['input']>
  coinbase_gt?: InputMaybe<Scalars['Long']['input']>
  coinbase_gte?: InputMaybe<Scalars['Long']['input']>
  coinbase_in?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>
  coinbase_lt?: InputMaybe<Scalars['Long']['input']>
  coinbase_lte?: InputMaybe<Scalars['Long']['input']>
  coinbase_ne?: InputMaybe<Scalars['Long']['input']>
  coinbase_nin?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>
  feeTransfer?: InputMaybe<
    Array<InputMaybe<BlockTransactionFeeTransferQueryInput>>
  >
  feeTransfer_exists?: InputMaybe<Scalars['Boolean']['input']>
  feeTransfer_in?: InputMaybe<
    Array<InputMaybe<BlockTransactionFeeTransferQueryInput>>
  >
  feeTransfer_nin?: InputMaybe<
    Array<InputMaybe<BlockTransactionFeeTransferQueryInput>>
  >
  userCommands?: InputMaybe<
    Array<InputMaybe<BlockTransactionUserCommandQueryInput>>
  >
  userCommands_exists?: InputMaybe<Scalars['Boolean']['input']>
  userCommands_in?: InputMaybe<
    Array<InputMaybe<BlockTransactionUserCommandQueryInput>>
  >
  userCommands_nin?: InputMaybe<
    Array<InputMaybe<BlockTransactionUserCommandQueryInput>>
  >
}

export type BlockTransactionUpdateInput = {
  coinbase?: InputMaybe<Scalars['Long']['input']>
  coinbaseReceiverAccount?: InputMaybe<BlockTransactionCoinbaseReceiverAccountUpdateInput>
  coinbaseReceiverAccount_unset?: InputMaybe<Scalars['Boolean']['input']>
  coinbase_unset?: InputMaybe<Scalars['Boolean']['input']>
  feeTransfer?: InputMaybe<
    Array<InputMaybe<BlockTransactionFeeTransferUpdateInput>>
  >
  feeTransfer_unset?: InputMaybe<Scalars['Boolean']['input']>
  userCommands?: InputMaybe<
    Array<InputMaybe<BlockTransactionUserCommandUpdateInput>>
  >
  userCommands_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type BlockTransactionUserCommand = {
  __typename?: 'BlockTransactionUserCommand'
  amount?: Maybe<Scalars['Float']['output']>
  blockHeight?: Maybe<Scalars['Int']['output']>
  blockStateHash?: Maybe<Scalars['String']['output']>
  dateTime?: Maybe<Scalars['DateTime']['output']>
  failureReason?: Maybe<Scalars['String']['output']>
  fee?: Maybe<Scalars['Float']['output']>
  feePayer?: Maybe<BlockTransactionUserCommandFeePayer>
  feeToken?: Maybe<Scalars['Int']['output']>
  from?: Maybe<Scalars['String']['output']>
  fromAccount?: Maybe<BlockTransactionUserCommandFromAccount>
  hash?: Maybe<Scalars['String']['output']>
  id?: Maybe<Scalars['String']['output']>
  isDelegation?: Maybe<Scalars['Boolean']['output']>
  kind?: Maybe<Scalars['String']['output']>
  memo?: Maybe<Scalars['String']['output']>
  nonce?: Maybe<Scalars['Int']['output']>
  receiver?: Maybe<BlockTransactionUserCommandReceiver>
  source?: Maybe<BlockTransactionUserCommandSource>
  to?: Maybe<Scalars['String']['output']>
  toAccount?: Maybe<BlockTransactionUserCommandToAccount>
  token?: Maybe<Scalars['Int']['output']>
}

export type BlockTransactionUserCommandFeePayer = {
  __typename?: 'BlockTransactionUserCommandFeePayer'
  token?: Maybe<Scalars['Int']['output']>
}

export type BlockTransactionUserCommandFeePayerInsertInput = {
  token?: InputMaybe<Scalars['Int']['input']>
}

export type BlockTransactionUserCommandFeePayerQueryInput = {
  AND?: InputMaybe<Array<BlockTransactionUserCommandFeePayerQueryInput>>
  OR?: InputMaybe<Array<BlockTransactionUserCommandFeePayerQueryInput>>
  token?: InputMaybe<Scalars['Int']['input']>
  token_exists?: InputMaybe<Scalars['Boolean']['input']>
  token_gt?: InputMaybe<Scalars['Int']['input']>
  token_gte?: InputMaybe<Scalars['Int']['input']>
  token_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  token_lt?: InputMaybe<Scalars['Int']['input']>
  token_lte?: InputMaybe<Scalars['Int']['input']>
  token_ne?: InputMaybe<Scalars['Int']['input']>
  token_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
}

export type BlockTransactionUserCommandFeePayerUpdateInput = {
  token?: InputMaybe<Scalars['Int']['input']>
  token_inc?: InputMaybe<Scalars['Int']['input']>
  token_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type BlockTransactionUserCommandFromAccount = {
  __typename?: 'BlockTransactionUserCommandFromAccount'
  token?: Maybe<Scalars['Int']['output']>
}

export type BlockTransactionUserCommandFromAccountInsertInput = {
  token?: InputMaybe<Scalars['Int']['input']>
}

export type BlockTransactionUserCommandFromAccountQueryInput = {
  AND?: InputMaybe<Array<BlockTransactionUserCommandFromAccountQueryInput>>
  OR?: InputMaybe<Array<BlockTransactionUserCommandFromAccountQueryInput>>
  token?: InputMaybe<Scalars['Int']['input']>
  token_exists?: InputMaybe<Scalars['Boolean']['input']>
  token_gt?: InputMaybe<Scalars['Int']['input']>
  token_gte?: InputMaybe<Scalars['Int']['input']>
  token_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  token_lt?: InputMaybe<Scalars['Int']['input']>
  token_lte?: InputMaybe<Scalars['Int']['input']>
  token_ne?: InputMaybe<Scalars['Int']['input']>
  token_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
}

export type BlockTransactionUserCommandFromAccountUpdateInput = {
  token?: InputMaybe<Scalars['Int']['input']>
  token_inc?: InputMaybe<Scalars['Int']['input']>
  token_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type BlockTransactionUserCommandInsertInput = {
  amount?: InputMaybe<Scalars['Float']['input']>
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  blockStateHash?: InputMaybe<Scalars['String']['input']>
  dateTime?: InputMaybe<Scalars['DateTime']['input']>
  failureReason?: InputMaybe<Scalars['String']['input']>
  fee?: InputMaybe<Scalars['Float']['input']>
  feePayer?: InputMaybe<BlockTransactionUserCommandFeePayerInsertInput>
  feeToken?: InputMaybe<Scalars['Int']['input']>
  from?: InputMaybe<Scalars['String']['input']>
  fromAccount?: InputMaybe<BlockTransactionUserCommandFromAccountInsertInput>
  hash?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  isDelegation?: InputMaybe<Scalars['Boolean']['input']>
  kind?: InputMaybe<Scalars['String']['input']>
  memo?: InputMaybe<Scalars['String']['input']>
  nonce?: InputMaybe<Scalars['Int']['input']>
  receiver?: InputMaybe<BlockTransactionUserCommandReceiverInsertInput>
  source?: InputMaybe<BlockTransactionUserCommandSourceInsertInput>
  to?: InputMaybe<Scalars['String']['input']>
  toAccount?: InputMaybe<BlockTransactionUserCommandToAccountInsertInput>
  token?: InputMaybe<Scalars['Int']['input']>
}

export type BlockTransactionUserCommandQueryInput = {
  AND?: InputMaybe<Array<BlockTransactionUserCommandQueryInput>>
  OR?: InputMaybe<Array<BlockTransactionUserCommandQueryInput>>
  amount?: InputMaybe<Scalars['Float']['input']>
  amount_exists?: InputMaybe<Scalars['Boolean']['input']>
  amount_gt?: InputMaybe<Scalars['Float']['input']>
  amount_gte?: InputMaybe<Scalars['Float']['input']>
  amount_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
  amount_lt?: InputMaybe<Scalars['Float']['input']>
  amount_lte?: InputMaybe<Scalars['Float']['input']>
  amount_ne?: InputMaybe<Scalars['Float']['input']>
  amount_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  blockHeight_exists?: InputMaybe<Scalars['Boolean']['input']>
  blockHeight_gt?: InputMaybe<Scalars['Int']['input']>
  blockHeight_gte?: InputMaybe<Scalars['Int']['input']>
  blockHeight_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  blockHeight_lt?: InputMaybe<Scalars['Int']['input']>
  blockHeight_lte?: InputMaybe<Scalars['Int']['input']>
  blockHeight_ne?: InputMaybe<Scalars['Int']['input']>
  blockHeight_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  blockStateHash?: InputMaybe<Scalars['String']['input']>
  blockStateHash_exists?: InputMaybe<Scalars['Boolean']['input']>
  blockStateHash_gt?: InputMaybe<Scalars['String']['input']>
  blockStateHash_gte?: InputMaybe<Scalars['String']['input']>
  blockStateHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  blockStateHash_lt?: InputMaybe<Scalars['String']['input']>
  blockStateHash_lte?: InputMaybe<Scalars['String']['input']>
  blockStateHash_ne?: InputMaybe<Scalars['String']['input']>
  blockStateHash_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  dateTime?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_exists?: InputMaybe<Scalars['Boolean']['input']>
  dateTime_gt?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_gte?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>
  dateTime_lt?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_lte?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_ne?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>
  failureReason?: InputMaybe<Scalars['String']['input']>
  failureReason_exists?: InputMaybe<Scalars['Boolean']['input']>
  failureReason_gt?: InputMaybe<Scalars['String']['input']>
  failureReason_gte?: InputMaybe<Scalars['String']['input']>
  failureReason_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  failureReason_lt?: InputMaybe<Scalars['String']['input']>
  failureReason_lte?: InputMaybe<Scalars['String']['input']>
  failureReason_ne?: InputMaybe<Scalars['String']['input']>
  failureReason_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  fee?: InputMaybe<Scalars['Float']['input']>
  feePayer?: InputMaybe<BlockTransactionUserCommandFeePayerQueryInput>
  feePayer_exists?: InputMaybe<Scalars['Boolean']['input']>
  feeToken?: InputMaybe<Scalars['Int']['input']>
  feeToken_exists?: InputMaybe<Scalars['Boolean']['input']>
  feeToken_gt?: InputMaybe<Scalars['Int']['input']>
  feeToken_gte?: InputMaybe<Scalars['Int']['input']>
  feeToken_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  feeToken_lt?: InputMaybe<Scalars['Int']['input']>
  feeToken_lte?: InputMaybe<Scalars['Int']['input']>
  feeToken_ne?: InputMaybe<Scalars['Int']['input']>
  feeToken_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  fee_exists?: InputMaybe<Scalars['Boolean']['input']>
  fee_gt?: InputMaybe<Scalars['Float']['input']>
  fee_gte?: InputMaybe<Scalars['Float']['input']>
  fee_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
  fee_lt?: InputMaybe<Scalars['Float']['input']>
  fee_lte?: InputMaybe<Scalars['Float']['input']>
  fee_ne?: InputMaybe<Scalars['Float']['input']>
  fee_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
  from?: InputMaybe<Scalars['String']['input']>
  fromAccount?: InputMaybe<BlockTransactionUserCommandFromAccountQueryInput>
  fromAccount_exists?: InputMaybe<Scalars['Boolean']['input']>
  from_exists?: InputMaybe<Scalars['Boolean']['input']>
  from_gt?: InputMaybe<Scalars['String']['input']>
  from_gte?: InputMaybe<Scalars['String']['input']>
  from_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  from_lt?: InputMaybe<Scalars['String']['input']>
  from_lte?: InputMaybe<Scalars['String']['input']>
  from_ne?: InputMaybe<Scalars['String']['input']>
  from_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  hash?: InputMaybe<Scalars['String']['input']>
  hash_exists?: InputMaybe<Scalars['Boolean']['input']>
  hash_gt?: InputMaybe<Scalars['String']['input']>
  hash_gte?: InputMaybe<Scalars['String']['input']>
  hash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  hash_lt?: InputMaybe<Scalars['String']['input']>
  hash_lte?: InputMaybe<Scalars['String']['input']>
  hash_ne?: InputMaybe<Scalars['String']['input']>
  hash_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  id?: InputMaybe<Scalars['String']['input']>
  id_exists?: InputMaybe<Scalars['Boolean']['input']>
  id_gt?: InputMaybe<Scalars['String']['input']>
  id_gte?: InputMaybe<Scalars['String']['input']>
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  id_lt?: InputMaybe<Scalars['String']['input']>
  id_lte?: InputMaybe<Scalars['String']['input']>
  id_ne?: InputMaybe<Scalars['String']['input']>
  id_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  isDelegation?: InputMaybe<Scalars['Boolean']['input']>
  isDelegation_exists?: InputMaybe<Scalars['Boolean']['input']>
  isDelegation_ne?: InputMaybe<Scalars['Boolean']['input']>
  kind?: InputMaybe<Scalars['String']['input']>
  kind_exists?: InputMaybe<Scalars['Boolean']['input']>
  kind_gt?: InputMaybe<Scalars['String']['input']>
  kind_gte?: InputMaybe<Scalars['String']['input']>
  kind_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  kind_lt?: InputMaybe<Scalars['String']['input']>
  kind_lte?: InputMaybe<Scalars['String']['input']>
  kind_ne?: InputMaybe<Scalars['String']['input']>
  kind_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  memo?: InputMaybe<Scalars['String']['input']>
  memo_exists?: InputMaybe<Scalars['Boolean']['input']>
  memo_gt?: InputMaybe<Scalars['String']['input']>
  memo_gte?: InputMaybe<Scalars['String']['input']>
  memo_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  memo_lt?: InputMaybe<Scalars['String']['input']>
  memo_lte?: InputMaybe<Scalars['String']['input']>
  memo_ne?: InputMaybe<Scalars['String']['input']>
  memo_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  nonce?: InputMaybe<Scalars['Int']['input']>
  nonce_exists?: InputMaybe<Scalars['Boolean']['input']>
  nonce_gt?: InputMaybe<Scalars['Int']['input']>
  nonce_gte?: InputMaybe<Scalars['Int']['input']>
  nonce_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  nonce_lt?: InputMaybe<Scalars['Int']['input']>
  nonce_lte?: InputMaybe<Scalars['Int']['input']>
  nonce_ne?: InputMaybe<Scalars['Int']['input']>
  nonce_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  receiver?: InputMaybe<BlockTransactionUserCommandReceiverQueryInput>
  receiver_exists?: InputMaybe<Scalars['Boolean']['input']>
  source?: InputMaybe<BlockTransactionUserCommandSourceQueryInput>
  source_exists?: InputMaybe<Scalars['Boolean']['input']>
  to?: InputMaybe<Scalars['String']['input']>
  toAccount?: InputMaybe<BlockTransactionUserCommandToAccountQueryInput>
  toAccount_exists?: InputMaybe<Scalars['Boolean']['input']>
  to_exists?: InputMaybe<Scalars['Boolean']['input']>
  to_gt?: InputMaybe<Scalars['String']['input']>
  to_gte?: InputMaybe<Scalars['String']['input']>
  to_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  to_lt?: InputMaybe<Scalars['String']['input']>
  to_lte?: InputMaybe<Scalars['String']['input']>
  to_ne?: InputMaybe<Scalars['String']['input']>
  to_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  token?: InputMaybe<Scalars['Int']['input']>
  token_exists?: InputMaybe<Scalars['Boolean']['input']>
  token_gt?: InputMaybe<Scalars['Int']['input']>
  token_gte?: InputMaybe<Scalars['Int']['input']>
  token_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  token_lt?: InputMaybe<Scalars['Int']['input']>
  token_lte?: InputMaybe<Scalars['Int']['input']>
  token_ne?: InputMaybe<Scalars['Int']['input']>
  token_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
}

export type BlockTransactionUserCommandReceiver = {
  __typename?: 'BlockTransactionUserCommandReceiver'
  publicKey?: Maybe<Scalars['String']['output']>
}

export type BlockTransactionUserCommandReceiverInsertInput = {
  publicKey?: InputMaybe<Scalars['String']['input']>
}

export type BlockTransactionUserCommandReceiverQueryInput = {
  AND?: InputMaybe<Array<BlockTransactionUserCommandReceiverQueryInput>>
  OR?: InputMaybe<Array<BlockTransactionUserCommandReceiverQueryInput>>
  publicKey?: InputMaybe<Scalars['String']['input']>
  publicKey_exists?: InputMaybe<Scalars['Boolean']['input']>
  publicKey_gt?: InputMaybe<Scalars['String']['input']>
  publicKey_gte?: InputMaybe<Scalars['String']['input']>
  publicKey_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  publicKey_lt?: InputMaybe<Scalars['String']['input']>
  publicKey_lte?: InputMaybe<Scalars['String']['input']>
  publicKey_ne?: InputMaybe<Scalars['String']['input']>
  publicKey_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
}

export type BlockTransactionUserCommandReceiverUpdateInput = {
  publicKey?: InputMaybe<Scalars['String']['input']>
  publicKey_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type BlockTransactionUserCommandSource = {
  __typename?: 'BlockTransactionUserCommandSource'
  publicKey?: Maybe<Scalars['String']['output']>
}

export type BlockTransactionUserCommandSourceInsertInput = {
  publicKey?: InputMaybe<Scalars['String']['input']>
}

export type BlockTransactionUserCommandSourceQueryInput = {
  AND?: InputMaybe<Array<BlockTransactionUserCommandSourceQueryInput>>
  OR?: InputMaybe<Array<BlockTransactionUserCommandSourceQueryInput>>
  publicKey?: InputMaybe<Scalars['String']['input']>
  publicKey_exists?: InputMaybe<Scalars['Boolean']['input']>
  publicKey_gt?: InputMaybe<Scalars['String']['input']>
  publicKey_gte?: InputMaybe<Scalars['String']['input']>
  publicKey_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  publicKey_lt?: InputMaybe<Scalars['String']['input']>
  publicKey_lte?: InputMaybe<Scalars['String']['input']>
  publicKey_ne?: InputMaybe<Scalars['String']['input']>
  publicKey_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
}

export type BlockTransactionUserCommandSourceUpdateInput = {
  publicKey?: InputMaybe<Scalars['String']['input']>
  publicKey_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type BlockTransactionUserCommandToAccount = {
  __typename?: 'BlockTransactionUserCommandToAccount'
  token?: Maybe<Scalars['Int']['output']>
}

export type BlockTransactionUserCommandToAccountInsertInput = {
  token?: InputMaybe<Scalars['Int']['input']>
}

export type BlockTransactionUserCommandToAccountQueryInput = {
  AND?: InputMaybe<Array<BlockTransactionUserCommandToAccountQueryInput>>
  OR?: InputMaybe<Array<BlockTransactionUserCommandToAccountQueryInput>>
  token?: InputMaybe<Scalars['Int']['input']>
  token_exists?: InputMaybe<Scalars['Boolean']['input']>
  token_gt?: InputMaybe<Scalars['Int']['input']>
  token_gte?: InputMaybe<Scalars['Int']['input']>
  token_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  token_lt?: InputMaybe<Scalars['Int']['input']>
  token_lte?: InputMaybe<Scalars['Int']['input']>
  token_ne?: InputMaybe<Scalars['Int']['input']>
  token_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
}

export type BlockTransactionUserCommandToAccountUpdateInput = {
  token?: InputMaybe<Scalars['Int']['input']>
  token_inc?: InputMaybe<Scalars['Int']['input']>
  token_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type BlockTransactionUserCommandUpdateInput = {
  amount?: InputMaybe<Scalars['Float']['input']>
  amount_inc?: InputMaybe<Scalars['Float']['input']>
  amount_unset?: InputMaybe<Scalars['Boolean']['input']>
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  blockHeight_inc?: InputMaybe<Scalars['Int']['input']>
  blockHeight_unset?: InputMaybe<Scalars['Boolean']['input']>
  blockStateHash?: InputMaybe<Scalars['String']['input']>
  blockStateHash_unset?: InputMaybe<Scalars['Boolean']['input']>
  dateTime?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_unset?: InputMaybe<Scalars['Boolean']['input']>
  failureReason?: InputMaybe<Scalars['String']['input']>
  failureReason_unset?: InputMaybe<Scalars['Boolean']['input']>
  fee?: InputMaybe<Scalars['Float']['input']>
  feePayer?: InputMaybe<BlockTransactionUserCommandFeePayerUpdateInput>
  feePayer_unset?: InputMaybe<Scalars['Boolean']['input']>
  feeToken?: InputMaybe<Scalars['Int']['input']>
  feeToken_inc?: InputMaybe<Scalars['Int']['input']>
  feeToken_unset?: InputMaybe<Scalars['Boolean']['input']>
  fee_inc?: InputMaybe<Scalars['Float']['input']>
  fee_unset?: InputMaybe<Scalars['Boolean']['input']>
  from?: InputMaybe<Scalars['String']['input']>
  fromAccount?: InputMaybe<BlockTransactionUserCommandFromAccountUpdateInput>
  fromAccount_unset?: InputMaybe<Scalars['Boolean']['input']>
  from_unset?: InputMaybe<Scalars['Boolean']['input']>
  hash?: InputMaybe<Scalars['String']['input']>
  hash_unset?: InputMaybe<Scalars['Boolean']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  id_unset?: InputMaybe<Scalars['Boolean']['input']>
  isDelegation?: InputMaybe<Scalars['Boolean']['input']>
  isDelegation_unset?: InputMaybe<Scalars['Boolean']['input']>
  kind?: InputMaybe<Scalars['String']['input']>
  kind_unset?: InputMaybe<Scalars['Boolean']['input']>
  memo?: InputMaybe<Scalars['String']['input']>
  memo_unset?: InputMaybe<Scalars['Boolean']['input']>
  nonce?: InputMaybe<Scalars['Int']['input']>
  nonce_inc?: InputMaybe<Scalars['Int']['input']>
  nonce_unset?: InputMaybe<Scalars['Boolean']['input']>
  receiver?: InputMaybe<BlockTransactionUserCommandReceiverUpdateInput>
  receiver_unset?: InputMaybe<Scalars['Boolean']['input']>
  source?: InputMaybe<BlockTransactionUserCommandSourceUpdateInput>
  source_unset?: InputMaybe<Scalars['Boolean']['input']>
  to?: InputMaybe<Scalars['String']['input']>
  toAccount?: InputMaybe<BlockTransactionUserCommandToAccountUpdateInput>
  toAccount_unset?: InputMaybe<Scalars['Boolean']['input']>
  to_unset?: InputMaybe<Scalars['Boolean']['input']>
  token?: InputMaybe<Scalars['Int']['input']>
  token_inc?: InputMaybe<Scalars['Int']['input']>
  token_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type BlockUpdateInput = {
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  blockHeight_inc?: InputMaybe<Scalars['Int']['input']>
  blockHeight_unset?: InputMaybe<Scalars['Boolean']['input']>
  canonical?: InputMaybe<Scalars['Boolean']['input']>
  canonical_unset?: InputMaybe<Scalars['Boolean']['input']>
  creator?: InputMaybe<Scalars['String']['input']>
  creatorAccount?: InputMaybe<BlockCreatorAccountUpdateInput>
  creatorAccount_unset?: InputMaybe<Scalars['Boolean']['input']>
  creator_unset?: InputMaybe<Scalars['Boolean']['input']>
  dateTime?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_unset?: InputMaybe<Scalars['Boolean']['input']>
  protocolState?: InputMaybe<BlockProtocolStateUpdateInput>
  protocolState_unset?: InputMaybe<Scalars['Boolean']['input']>
  receivedTime?: InputMaybe<Scalars['DateTime']['input']>
  receivedTime_unset?: InputMaybe<Scalars['Boolean']['input']>
  snarkJobs?: InputMaybe<Array<InputMaybe<BlockSnarkJobUpdateInput>>>
  snarkJobs_unset?: InputMaybe<Scalars['Boolean']['input']>
  stateHash?: InputMaybe<Scalars['String']['input']>
  stateHashField?: InputMaybe<Scalars['String']['input']>
  stateHashField_unset?: InputMaybe<Scalars['Boolean']['input']>
  stateHash_unset?: InputMaybe<Scalars['Boolean']['input']>
  transactions?: InputMaybe<BlockTransactionUpdateInput>
  transactions_unset?: InputMaybe<Scalars['Boolean']['input']>
  winnerAccount?: InputMaybe<BlockWinnerAccountUpdateInput>
  winnerAccount_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type BlockWinnerAccount = {
  __typename?: 'BlockWinnerAccount'
  balance?: Maybe<BlockWinnerAccountBalance>
  publicKey?: Maybe<Scalars['String']['output']>
}

export type BlockWinnerAccountBalance = {
  __typename?: 'BlockWinnerAccountBalance'
  blockHeight?: Maybe<Scalars['Int']['output']>
  liquid?: Maybe<Scalars['Int']['output']>
  locked?: Maybe<Scalars['Long']['output']>
  stateHash?: Maybe<Scalars['String']['output']>
  total?: Maybe<Scalars['Long']['output']>
  unknown?: Maybe<Scalars['Long']['output']>
}

export type BlockWinnerAccountBalanceInsertInput = {
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  liquid?: InputMaybe<Scalars['Int']['input']>
  locked?: InputMaybe<Scalars['Long']['input']>
  stateHash?: InputMaybe<Scalars['String']['input']>
  total?: InputMaybe<Scalars['Long']['input']>
  unknown?: InputMaybe<Scalars['Long']['input']>
}

export type BlockWinnerAccountBalanceQueryInput = {
  AND?: InputMaybe<Array<BlockWinnerAccountBalanceQueryInput>>
  OR?: InputMaybe<Array<BlockWinnerAccountBalanceQueryInput>>
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  blockHeight_exists?: InputMaybe<Scalars['Boolean']['input']>
  blockHeight_gt?: InputMaybe<Scalars['Int']['input']>
  blockHeight_gte?: InputMaybe<Scalars['Int']['input']>
  blockHeight_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  blockHeight_lt?: InputMaybe<Scalars['Int']['input']>
  blockHeight_lte?: InputMaybe<Scalars['Int']['input']>
  blockHeight_ne?: InputMaybe<Scalars['Int']['input']>
  blockHeight_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  liquid?: InputMaybe<Scalars['Int']['input']>
  liquid_exists?: InputMaybe<Scalars['Boolean']['input']>
  liquid_gt?: InputMaybe<Scalars['Int']['input']>
  liquid_gte?: InputMaybe<Scalars['Int']['input']>
  liquid_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  liquid_lt?: InputMaybe<Scalars['Int']['input']>
  liquid_lte?: InputMaybe<Scalars['Int']['input']>
  liquid_ne?: InputMaybe<Scalars['Int']['input']>
  liquid_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  locked?: InputMaybe<Scalars['Long']['input']>
  locked_exists?: InputMaybe<Scalars['Boolean']['input']>
  locked_gt?: InputMaybe<Scalars['Long']['input']>
  locked_gte?: InputMaybe<Scalars['Long']['input']>
  locked_in?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>
  locked_lt?: InputMaybe<Scalars['Long']['input']>
  locked_lte?: InputMaybe<Scalars['Long']['input']>
  locked_ne?: InputMaybe<Scalars['Long']['input']>
  locked_nin?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>
  stateHash?: InputMaybe<Scalars['String']['input']>
  stateHash_exists?: InputMaybe<Scalars['Boolean']['input']>
  stateHash_gt?: InputMaybe<Scalars['String']['input']>
  stateHash_gte?: InputMaybe<Scalars['String']['input']>
  stateHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  stateHash_lt?: InputMaybe<Scalars['String']['input']>
  stateHash_lte?: InputMaybe<Scalars['String']['input']>
  stateHash_ne?: InputMaybe<Scalars['String']['input']>
  stateHash_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  total?: InputMaybe<Scalars['Long']['input']>
  total_exists?: InputMaybe<Scalars['Boolean']['input']>
  total_gt?: InputMaybe<Scalars['Long']['input']>
  total_gte?: InputMaybe<Scalars['Long']['input']>
  total_in?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>
  total_lt?: InputMaybe<Scalars['Long']['input']>
  total_lte?: InputMaybe<Scalars['Long']['input']>
  total_ne?: InputMaybe<Scalars['Long']['input']>
  total_nin?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>
  unknown?: InputMaybe<Scalars['Long']['input']>
  unknown_exists?: InputMaybe<Scalars['Boolean']['input']>
  unknown_gt?: InputMaybe<Scalars['Long']['input']>
  unknown_gte?: InputMaybe<Scalars['Long']['input']>
  unknown_in?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>
  unknown_lt?: InputMaybe<Scalars['Long']['input']>
  unknown_lte?: InputMaybe<Scalars['Long']['input']>
  unknown_ne?: InputMaybe<Scalars['Long']['input']>
  unknown_nin?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>
}

export type BlockWinnerAccountBalanceUpdateInput = {
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  blockHeight_inc?: InputMaybe<Scalars['Int']['input']>
  blockHeight_unset?: InputMaybe<Scalars['Boolean']['input']>
  liquid?: InputMaybe<Scalars['Int']['input']>
  liquid_inc?: InputMaybe<Scalars['Int']['input']>
  liquid_unset?: InputMaybe<Scalars['Boolean']['input']>
  locked?: InputMaybe<Scalars['Long']['input']>
  locked_unset?: InputMaybe<Scalars['Boolean']['input']>
  stateHash?: InputMaybe<Scalars['String']['input']>
  stateHash_unset?: InputMaybe<Scalars['Boolean']['input']>
  total?: InputMaybe<Scalars['Long']['input']>
  total_unset?: InputMaybe<Scalars['Boolean']['input']>
  unknown?: InputMaybe<Scalars['Long']['input']>
  unknown_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type BlockWinnerAccountInsertInput = {
  balance?: InputMaybe<BlockWinnerAccountBalanceInsertInput>
  publicKey?: InputMaybe<Scalars['String']['input']>
}

export type BlockWinnerAccountQueryInput = {
  AND?: InputMaybe<Array<BlockWinnerAccountQueryInput>>
  OR?: InputMaybe<Array<BlockWinnerAccountQueryInput>>
  balance?: InputMaybe<BlockWinnerAccountBalanceQueryInput>
  balance_exists?: InputMaybe<Scalars['Boolean']['input']>
  publicKey?: InputMaybe<Scalars['String']['input']>
  publicKey_exists?: InputMaybe<Scalars['Boolean']['input']>
  publicKey_gt?: InputMaybe<Scalars['String']['input']>
  publicKey_gte?: InputMaybe<Scalars['String']['input']>
  publicKey_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  publicKey_lt?: InputMaybe<Scalars['String']['input']>
  publicKey_lte?: InputMaybe<Scalars['String']['input']>
  publicKey_ne?: InputMaybe<Scalars['String']['input']>
  publicKey_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
}

export type BlockWinnerAccountUpdateInput = {
  balance?: InputMaybe<BlockWinnerAccountBalanceUpdateInput>
  balance_unset?: InputMaybe<Scalars['Boolean']['input']>
  publicKey?: InputMaybe<Scalars['String']['input']>
  publicKey_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type DelegationTotal = {
  __typename?: 'DelegationTotal'
  countDelegates?: Maybe<Scalars['Int']['output']>
  totalDelegated?: Maybe<Scalars['Float']['output']>
}

export type DeleteManyPayload = {
  __typename?: 'DeleteManyPayload'
  deletedCount: Scalars['Int']['output']
}

export type Feetransfer = {
  __typename?: 'Feetransfer'
  blockHeight?: Maybe<Scalars['Int']['output']>
  blockStateHash?: Maybe<Block>
  canonical?: Maybe<Scalars['Boolean']['output']>
  dateTime?: Maybe<Scalars['DateTime']['output']>
  fee?: Maybe<Scalars['Int']['output']>
  recipient?: Maybe<Scalars['String']['output']>
  type?: Maybe<Scalars['String']['output']>
}

export type FeetransferBlockStateHashRelationInput = {
  create?: InputMaybe<BlockInsertInput>
  link?: InputMaybe<Scalars['String']['input']>
}

export type FeetransferInsertInput = {
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  blockStateHash?: InputMaybe<FeetransferBlockStateHashRelationInput>
  canonical?: InputMaybe<Scalars['Boolean']['input']>
  dateTime?: InputMaybe<Scalars['DateTime']['input']>
  fee?: InputMaybe<Scalars['Int']['input']>
  recipient?: InputMaybe<Scalars['String']['input']>
  type?: InputMaybe<Scalars['String']['input']>
}

export type FeetransferQueryInput = {
  AND?: InputMaybe<Array<FeetransferQueryInput>>
  OR?: InputMaybe<Array<FeetransferQueryInput>>
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  blockHeight_exists?: InputMaybe<Scalars['Boolean']['input']>
  blockHeight_gt?: InputMaybe<Scalars['Int']['input']>
  blockHeight_gte?: InputMaybe<Scalars['Int']['input']>
  blockHeight_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  blockHeight_lt?: InputMaybe<Scalars['Int']['input']>
  blockHeight_lte?: InputMaybe<Scalars['Int']['input']>
  blockHeight_ne?: InputMaybe<Scalars['Int']['input']>
  blockHeight_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  blockStateHash?: InputMaybe<BlockQueryInput>
  blockStateHash_exists?: InputMaybe<Scalars['Boolean']['input']>
  canonical?: InputMaybe<Scalars['Boolean']['input']>
  canonical_exists?: InputMaybe<Scalars['Boolean']['input']>
  canonical_ne?: InputMaybe<Scalars['Boolean']['input']>
  dateTime?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_exists?: InputMaybe<Scalars['Boolean']['input']>
  dateTime_gt?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_gte?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>
  dateTime_lt?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_lte?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_ne?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>
  fee?: InputMaybe<Scalars['Int']['input']>
  fee_exists?: InputMaybe<Scalars['Boolean']['input']>
  fee_gt?: InputMaybe<Scalars['Int']['input']>
  fee_gte?: InputMaybe<Scalars['Int']['input']>
  fee_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  fee_lt?: InputMaybe<Scalars['Int']['input']>
  fee_lte?: InputMaybe<Scalars['Int']['input']>
  fee_ne?: InputMaybe<Scalars['Int']['input']>
  fee_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  recipient?: InputMaybe<Scalars['String']['input']>
  recipient_exists?: InputMaybe<Scalars['Boolean']['input']>
  recipient_gt?: InputMaybe<Scalars['String']['input']>
  recipient_gte?: InputMaybe<Scalars['String']['input']>
  recipient_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  recipient_lt?: InputMaybe<Scalars['String']['input']>
  recipient_lte?: InputMaybe<Scalars['String']['input']>
  recipient_ne?: InputMaybe<Scalars['String']['input']>
  recipient_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  type?: InputMaybe<Scalars['String']['input']>
  type_exists?: InputMaybe<Scalars['Boolean']['input']>
  type_gt?: InputMaybe<Scalars['String']['input']>
  type_gte?: InputMaybe<Scalars['String']['input']>
  type_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  type_lt?: InputMaybe<Scalars['String']['input']>
  type_lte?: InputMaybe<Scalars['String']['input']>
  type_ne?: InputMaybe<Scalars['String']['input']>
  type_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
}

export enum FeetransferSortByInput {
  BlockheightAsc = 'BLOCKHEIGHT_ASC',
  BlockheightDesc = 'BLOCKHEIGHT_DESC',
  BlockstatehashAsc = 'BLOCKSTATEHASH_ASC',
  BlockstatehashDesc = 'BLOCKSTATEHASH_DESC',
  DatetimeAsc = 'DATETIME_ASC',
  DatetimeDesc = 'DATETIME_DESC',
  FeeAsc = 'FEE_ASC',
  FeeDesc = 'FEE_DESC',
  RecipientAsc = 'RECIPIENT_ASC',
  RecipientDesc = 'RECIPIENT_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC'
}

export type FeetransferUpdateInput = {
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  blockHeight_inc?: InputMaybe<Scalars['Int']['input']>
  blockHeight_unset?: InputMaybe<Scalars['Boolean']['input']>
  blockStateHash?: InputMaybe<FeetransferBlockStateHashRelationInput>
  blockStateHash_unset?: InputMaybe<Scalars['Boolean']['input']>
  canonical?: InputMaybe<Scalars['Boolean']['input']>
  canonical_unset?: InputMaybe<Scalars['Boolean']['input']>
  dateTime?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_unset?: InputMaybe<Scalars['Boolean']['input']>
  fee?: InputMaybe<Scalars['Int']['input']>
  fee_inc?: InputMaybe<Scalars['Int']['input']>
  fee_unset?: InputMaybe<Scalars['Boolean']['input']>
  recipient?: InputMaybe<Scalars['String']['input']>
  recipient_unset?: InputMaybe<Scalars['Boolean']['input']>
  type?: InputMaybe<Scalars['String']['input']>
  type_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type InsertManyPayload = {
  __typename?: 'InsertManyPayload'
  insertedIds: Array<Maybe<Scalars['ObjectId']['output']>>
}

export type Mutation = {
  __typename?: 'Mutation'
  deleteManyBlocks?: Maybe<DeleteManyPayload>
  deleteManyFeetransfers?: Maybe<DeleteManyPayload>
  deleteManyNextstakes?: Maybe<DeleteManyPayload>
  deleteManySnarks?: Maybe<DeleteManyPayload>
  deleteManyStakes?: Maybe<DeleteManyPayload>
  deleteManyTransactions?: Maybe<DeleteManyPayload>
  deleteOneBlock?: Maybe<Block>
  deleteOneFeetransfer?: Maybe<Feetransfer>
  deleteOneNextstake?: Maybe<Nextstake>
  deleteOneSnark?: Maybe<Snark>
  deleteOneStake?: Maybe<Stake>
  deleteOneTransaction?: Maybe<Transaction>
  insertManyBlocks?: Maybe<InsertManyPayload>
  insertManyFeetransfers?: Maybe<InsertManyPayload>
  insertManyNextstakes?: Maybe<InsertManyPayload>
  insertManySnarks?: Maybe<InsertManyPayload>
  insertManyStakes?: Maybe<InsertManyPayload>
  insertManyTransactions?: Maybe<InsertManyPayload>
  insertOneBlock?: Maybe<Block>
  insertOneFeetransfer?: Maybe<Feetransfer>
  insertOneNextstake?: Maybe<Nextstake>
  insertOneSnark?: Maybe<Snark>
  insertOneStake?: Maybe<Stake>
  insertOneTransaction?: Maybe<Transaction>
  replaceOneBlock?: Maybe<Block>
  replaceOneFeetransfer?: Maybe<Feetransfer>
  replaceOneNextstake?: Maybe<Nextstake>
  replaceOneSnark?: Maybe<Snark>
  replaceOneStake?: Maybe<Stake>
  replaceOneTransaction?: Maybe<Transaction>
  updateManyBlocks?: Maybe<UpdateManyPayload>
  updateManyFeetransfers?: Maybe<UpdateManyPayload>
  updateManyNextstakes?: Maybe<UpdateManyPayload>
  updateManySnarks?: Maybe<UpdateManyPayload>
  updateManyStakes?: Maybe<UpdateManyPayload>
  updateManyTransactions?: Maybe<UpdateManyPayload>
  updateOneBlock?: Maybe<Block>
  updateOneFeetransfer?: Maybe<Feetransfer>
  updateOneNextstake?: Maybe<Nextstake>
  updateOneSnark?: Maybe<Snark>
  updateOneStake?: Maybe<Stake>
  updateOneTransaction?: Maybe<Transaction>
  upsertOneBlock?: Maybe<Block>
  upsertOneFeetransfer?: Maybe<Feetransfer>
  upsertOneNextstake?: Maybe<Nextstake>
  upsertOneSnark?: Maybe<Snark>
  upsertOneStake?: Maybe<Stake>
  upsertOneTransaction?: Maybe<Transaction>
}

export type MutationDeleteManyBlocksArgs = {
  query?: InputMaybe<BlockQueryInput>
}

export type MutationDeleteManyFeetransfersArgs = {
  query?: InputMaybe<FeetransferQueryInput>
}

export type MutationDeleteManyNextstakesArgs = {
  query?: InputMaybe<NextstakeQueryInput>
}

export type MutationDeleteManySnarksArgs = {
  query?: InputMaybe<SnarkQueryInput>
}

export type MutationDeleteManyStakesArgs = {
  query?: InputMaybe<StakeQueryInput>
}

export type MutationDeleteManyTransactionsArgs = {
  query?: InputMaybe<TransactionQueryInput>
}

export type MutationDeleteOneBlockArgs = {
  query: BlockQueryInput
}

export type MutationDeleteOneFeetransferArgs = {
  query: FeetransferQueryInput
}

export type MutationDeleteOneNextstakeArgs = {
  query: NextstakeQueryInput
}

export type MutationDeleteOneSnarkArgs = {
  query: SnarkQueryInput
}

export type MutationDeleteOneStakeArgs = {
  query: StakeQueryInput
}

export type MutationDeleteOneTransactionArgs = {
  query: TransactionQueryInput
}

export type MutationInsertManyBlocksArgs = {
  data: Array<BlockInsertInput>
}

export type MutationInsertManyFeetransfersArgs = {
  data: Array<FeetransferInsertInput>
}

export type MutationInsertManyNextstakesArgs = {
  data: Array<NextstakeInsertInput>
}

export type MutationInsertManySnarksArgs = {
  data: Array<SnarkInsertInput>
}

export type MutationInsertManyStakesArgs = {
  data: Array<StakeInsertInput>
}

export type MutationInsertManyTransactionsArgs = {
  data: Array<TransactionInsertInput>
}

export type MutationInsertOneBlockArgs = {
  data: BlockInsertInput
}

export type MutationInsertOneFeetransferArgs = {
  data: FeetransferInsertInput
}

export type MutationInsertOneNextstakeArgs = {
  data: NextstakeInsertInput
}

export type MutationInsertOneSnarkArgs = {
  data: SnarkInsertInput
}

export type MutationInsertOneStakeArgs = {
  data: StakeInsertInput
}

export type MutationInsertOneTransactionArgs = {
  data: TransactionInsertInput
}

export type MutationReplaceOneBlockArgs = {
  data: BlockInsertInput
  query?: InputMaybe<BlockQueryInput>
}

export type MutationReplaceOneFeetransferArgs = {
  data: FeetransferInsertInput
  query?: InputMaybe<FeetransferQueryInput>
}

export type MutationReplaceOneNextstakeArgs = {
  data: NextstakeInsertInput
  query?: InputMaybe<NextstakeQueryInput>
}

export type MutationReplaceOneSnarkArgs = {
  data: SnarkInsertInput
  query?: InputMaybe<SnarkQueryInput>
}

export type MutationReplaceOneStakeArgs = {
  data: StakeInsertInput
  query?: InputMaybe<StakeQueryInput>
}

export type MutationReplaceOneTransactionArgs = {
  data: TransactionInsertInput
  query?: InputMaybe<TransactionQueryInput>
}

export type MutationUpdateManyBlocksArgs = {
  query?: InputMaybe<BlockQueryInput>
  set: BlockUpdateInput
}

export type MutationUpdateManyFeetransfersArgs = {
  query?: InputMaybe<FeetransferQueryInput>
  set: FeetransferUpdateInput
}

export type MutationUpdateManyNextstakesArgs = {
  query?: InputMaybe<NextstakeQueryInput>
  set: NextstakeUpdateInput
}

export type MutationUpdateManySnarksArgs = {
  query?: InputMaybe<SnarkQueryInput>
  set: SnarkUpdateInput
}

export type MutationUpdateManyStakesArgs = {
  query?: InputMaybe<StakeQueryInput>
  set: StakeUpdateInput
}

export type MutationUpdateManyTransactionsArgs = {
  query?: InputMaybe<TransactionQueryInput>
  set: TransactionUpdateInput
}

export type MutationUpdateOneBlockArgs = {
  query?: InputMaybe<BlockQueryInput>
  set: BlockUpdateInput
}

export type MutationUpdateOneFeetransferArgs = {
  query?: InputMaybe<FeetransferQueryInput>
  set: FeetransferUpdateInput
}

export type MutationUpdateOneNextstakeArgs = {
  query?: InputMaybe<NextstakeQueryInput>
  set: NextstakeUpdateInput
}

export type MutationUpdateOneSnarkArgs = {
  query?: InputMaybe<SnarkQueryInput>
  set: SnarkUpdateInput
}

export type MutationUpdateOneStakeArgs = {
  query?: InputMaybe<StakeQueryInput>
  set: StakeUpdateInput
}

export type MutationUpdateOneTransactionArgs = {
  query?: InputMaybe<TransactionQueryInput>
  set: TransactionUpdateInput
}

export type MutationUpsertOneBlockArgs = {
  data: BlockInsertInput
  query?: InputMaybe<BlockQueryInput>
}

export type MutationUpsertOneFeetransferArgs = {
  data: FeetransferInsertInput
  query?: InputMaybe<FeetransferQueryInput>
}

export type MutationUpsertOneNextstakeArgs = {
  data: NextstakeInsertInput
  query?: InputMaybe<NextstakeQueryInput>
}

export type MutationUpsertOneSnarkArgs = {
  data: SnarkInsertInput
  query?: InputMaybe<SnarkQueryInput>
}

export type MutationUpsertOneStakeArgs = {
  data: StakeInsertInput
  query?: InputMaybe<StakeQueryInput>
}

export type MutationUpsertOneTransactionArgs = {
  data: TransactionInsertInput
  query?: InputMaybe<TransactionQueryInput>
}

export type NextDelegationTotal = {
  __typename?: 'NextDelegationTotal'
  countDelegates?: Maybe<Scalars['Int']['output']>
  totalDelegated?: Maybe<Scalars['Float']['output']>
}

export type Nextstake = {
  __typename?: 'Nextstake'
  balance?: Maybe<Scalars['Float']['output']>
  delegate?: Maybe<Scalars['String']['output']>
  ledgerHash?: Maybe<Scalars['String']['output']>
  nextDelegationTotals?: Maybe<NextDelegationTotal>
  nonce?: Maybe<Scalars['Int']['output']>
  permissions?: Maybe<NextstakePermission>
  pk?: Maybe<Scalars['String']['output']>
  public_key?: Maybe<Scalars['String']['output']>
  receipt_chain_hash?: Maybe<Scalars['String']['output']>
  timing?: Maybe<NextstakeTiming>
  token?: Maybe<Scalars['Int']['output']>
  voting_for?: Maybe<Scalars['String']['output']>
}

export type NextstakeInsertInput = {
  balance?: InputMaybe<Scalars['Float']['input']>
  delegate?: InputMaybe<Scalars['String']['input']>
  ledgerHash?: InputMaybe<Scalars['String']['input']>
  nonce?: InputMaybe<Scalars['Int']['input']>
  permissions?: InputMaybe<NextstakePermissionInsertInput>
  pk?: InputMaybe<Scalars['String']['input']>
  public_key?: InputMaybe<Scalars['String']['input']>
  receipt_chain_hash?: InputMaybe<Scalars['String']['input']>
  timing?: InputMaybe<NextstakeTimingInsertInput>
  token?: InputMaybe<Scalars['Int']['input']>
  voting_for?: InputMaybe<Scalars['String']['input']>
}

export type NextstakePermission = {
  __typename?: 'NextstakePermission'
  edit_state?: Maybe<Scalars['String']['output']>
  send?: Maybe<Scalars['String']['output']>
  set_delegate?: Maybe<Scalars['String']['output']>
  set_permissions?: Maybe<Scalars['String']['output']>
  set_verification_key?: Maybe<Scalars['String']['output']>
  stake?: Maybe<Scalars['Boolean']['output']>
}

export type NextstakePermissionInsertInput = {
  edit_state?: InputMaybe<Scalars['String']['input']>
  send?: InputMaybe<Scalars['String']['input']>
  set_delegate?: InputMaybe<Scalars['String']['input']>
  set_permissions?: InputMaybe<Scalars['String']['input']>
  set_verification_key?: InputMaybe<Scalars['String']['input']>
  stake?: InputMaybe<Scalars['Boolean']['input']>
}

export type NextstakePermissionQueryInput = {
  AND?: InputMaybe<Array<NextstakePermissionQueryInput>>
  OR?: InputMaybe<Array<NextstakePermissionQueryInput>>
  edit_state?: InputMaybe<Scalars['String']['input']>
  edit_state_exists?: InputMaybe<Scalars['Boolean']['input']>
  edit_state_gt?: InputMaybe<Scalars['String']['input']>
  edit_state_gte?: InputMaybe<Scalars['String']['input']>
  edit_state_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  edit_state_lt?: InputMaybe<Scalars['String']['input']>
  edit_state_lte?: InputMaybe<Scalars['String']['input']>
  edit_state_ne?: InputMaybe<Scalars['String']['input']>
  edit_state_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  send?: InputMaybe<Scalars['String']['input']>
  send_exists?: InputMaybe<Scalars['Boolean']['input']>
  send_gt?: InputMaybe<Scalars['String']['input']>
  send_gte?: InputMaybe<Scalars['String']['input']>
  send_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  send_lt?: InputMaybe<Scalars['String']['input']>
  send_lte?: InputMaybe<Scalars['String']['input']>
  send_ne?: InputMaybe<Scalars['String']['input']>
  send_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  set_delegate?: InputMaybe<Scalars['String']['input']>
  set_delegate_exists?: InputMaybe<Scalars['Boolean']['input']>
  set_delegate_gt?: InputMaybe<Scalars['String']['input']>
  set_delegate_gte?: InputMaybe<Scalars['String']['input']>
  set_delegate_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  set_delegate_lt?: InputMaybe<Scalars['String']['input']>
  set_delegate_lte?: InputMaybe<Scalars['String']['input']>
  set_delegate_ne?: InputMaybe<Scalars['String']['input']>
  set_delegate_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  set_permissions?: InputMaybe<Scalars['String']['input']>
  set_permissions_exists?: InputMaybe<Scalars['Boolean']['input']>
  set_permissions_gt?: InputMaybe<Scalars['String']['input']>
  set_permissions_gte?: InputMaybe<Scalars['String']['input']>
  set_permissions_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  set_permissions_lt?: InputMaybe<Scalars['String']['input']>
  set_permissions_lte?: InputMaybe<Scalars['String']['input']>
  set_permissions_ne?: InputMaybe<Scalars['String']['input']>
  set_permissions_nin?: InputMaybe<
    Array<InputMaybe<Scalars['String']['input']>>
  >
  set_verification_key?: InputMaybe<Scalars['String']['input']>
  set_verification_key_exists?: InputMaybe<Scalars['Boolean']['input']>
  set_verification_key_gt?: InputMaybe<Scalars['String']['input']>
  set_verification_key_gte?: InputMaybe<Scalars['String']['input']>
  set_verification_key_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']['input']>>
  >
  set_verification_key_lt?: InputMaybe<Scalars['String']['input']>
  set_verification_key_lte?: InputMaybe<Scalars['String']['input']>
  set_verification_key_ne?: InputMaybe<Scalars['String']['input']>
  set_verification_key_nin?: InputMaybe<
    Array<InputMaybe<Scalars['String']['input']>>
  >
  stake?: InputMaybe<Scalars['Boolean']['input']>
  stake_exists?: InputMaybe<Scalars['Boolean']['input']>
  stake_ne?: InputMaybe<Scalars['Boolean']['input']>
}

export type NextstakePermissionUpdateInput = {
  edit_state?: InputMaybe<Scalars['String']['input']>
  edit_state_unset?: InputMaybe<Scalars['Boolean']['input']>
  send?: InputMaybe<Scalars['String']['input']>
  send_unset?: InputMaybe<Scalars['Boolean']['input']>
  set_delegate?: InputMaybe<Scalars['String']['input']>
  set_delegate_unset?: InputMaybe<Scalars['Boolean']['input']>
  set_permissions?: InputMaybe<Scalars['String']['input']>
  set_permissions_unset?: InputMaybe<Scalars['Boolean']['input']>
  set_verification_key?: InputMaybe<Scalars['String']['input']>
  set_verification_key_unset?: InputMaybe<Scalars['Boolean']['input']>
  stake?: InputMaybe<Scalars['Boolean']['input']>
  stake_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type NextstakeQueryInput = {
  AND?: InputMaybe<Array<NextstakeQueryInput>>
  OR?: InputMaybe<Array<NextstakeQueryInput>>
  balance?: InputMaybe<Scalars['Float']['input']>
  balance_exists?: InputMaybe<Scalars['Boolean']['input']>
  balance_gt?: InputMaybe<Scalars['Float']['input']>
  balance_gte?: InputMaybe<Scalars['Float']['input']>
  balance_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
  balance_lt?: InputMaybe<Scalars['Float']['input']>
  balance_lte?: InputMaybe<Scalars['Float']['input']>
  balance_ne?: InputMaybe<Scalars['Float']['input']>
  balance_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
  delegate?: InputMaybe<Scalars['String']['input']>
  delegate_exists?: InputMaybe<Scalars['Boolean']['input']>
  delegate_gt?: InputMaybe<Scalars['String']['input']>
  delegate_gte?: InputMaybe<Scalars['String']['input']>
  delegate_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  delegate_lt?: InputMaybe<Scalars['String']['input']>
  delegate_lte?: InputMaybe<Scalars['String']['input']>
  delegate_ne?: InputMaybe<Scalars['String']['input']>
  delegate_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  ledgerHash?: InputMaybe<Scalars['String']['input']>
  ledgerHash_exists?: InputMaybe<Scalars['Boolean']['input']>
  ledgerHash_gt?: InputMaybe<Scalars['String']['input']>
  ledgerHash_gte?: InputMaybe<Scalars['String']['input']>
  ledgerHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  ledgerHash_lt?: InputMaybe<Scalars['String']['input']>
  ledgerHash_lte?: InputMaybe<Scalars['String']['input']>
  ledgerHash_ne?: InputMaybe<Scalars['String']['input']>
  ledgerHash_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  nonce?: InputMaybe<Scalars['Int']['input']>
  nonce_exists?: InputMaybe<Scalars['Boolean']['input']>
  nonce_gt?: InputMaybe<Scalars['Int']['input']>
  nonce_gte?: InputMaybe<Scalars['Int']['input']>
  nonce_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  nonce_lt?: InputMaybe<Scalars['Int']['input']>
  nonce_lte?: InputMaybe<Scalars['Int']['input']>
  nonce_ne?: InputMaybe<Scalars['Int']['input']>
  nonce_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  permissions?: InputMaybe<NextstakePermissionQueryInput>
  permissions_exists?: InputMaybe<Scalars['Boolean']['input']>
  pk?: InputMaybe<Scalars['String']['input']>
  pk_exists?: InputMaybe<Scalars['Boolean']['input']>
  pk_gt?: InputMaybe<Scalars['String']['input']>
  pk_gte?: InputMaybe<Scalars['String']['input']>
  pk_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  pk_lt?: InputMaybe<Scalars['String']['input']>
  pk_lte?: InputMaybe<Scalars['String']['input']>
  pk_ne?: InputMaybe<Scalars['String']['input']>
  pk_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  public_key?: InputMaybe<Scalars['String']['input']>
  public_key_exists?: InputMaybe<Scalars['Boolean']['input']>
  public_key_gt?: InputMaybe<Scalars['String']['input']>
  public_key_gte?: InputMaybe<Scalars['String']['input']>
  public_key_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  public_key_lt?: InputMaybe<Scalars['String']['input']>
  public_key_lte?: InputMaybe<Scalars['String']['input']>
  public_key_ne?: InputMaybe<Scalars['String']['input']>
  public_key_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  receipt_chain_hash?: InputMaybe<Scalars['String']['input']>
  receipt_chain_hash_exists?: InputMaybe<Scalars['Boolean']['input']>
  receipt_chain_hash_gt?: InputMaybe<Scalars['String']['input']>
  receipt_chain_hash_gte?: InputMaybe<Scalars['String']['input']>
  receipt_chain_hash_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']['input']>>
  >
  receipt_chain_hash_lt?: InputMaybe<Scalars['String']['input']>
  receipt_chain_hash_lte?: InputMaybe<Scalars['String']['input']>
  receipt_chain_hash_ne?: InputMaybe<Scalars['String']['input']>
  receipt_chain_hash_nin?: InputMaybe<
    Array<InputMaybe<Scalars['String']['input']>>
  >
  timing?: InputMaybe<NextstakeTimingQueryInput>
  timing_exists?: InputMaybe<Scalars['Boolean']['input']>
  token?: InputMaybe<Scalars['Int']['input']>
  token_exists?: InputMaybe<Scalars['Boolean']['input']>
  token_gt?: InputMaybe<Scalars['Int']['input']>
  token_gte?: InputMaybe<Scalars['Int']['input']>
  token_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  token_lt?: InputMaybe<Scalars['Int']['input']>
  token_lte?: InputMaybe<Scalars['Int']['input']>
  token_ne?: InputMaybe<Scalars['Int']['input']>
  token_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  voting_for?: InputMaybe<Scalars['String']['input']>
  voting_for_exists?: InputMaybe<Scalars['Boolean']['input']>
  voting_for_gt?: InputMaybe<Scalars['String']['input']>
  voting_for_gte?: InputMaybe<Scalars['String']['input']>
  voting_for_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  voting_for_lt?: InputMaybe<Scalars['String']['input']>
  voting_for_lte?: InputMaybe<Scalars['String']['input']>
  voting_for_ne?: InputMaybe<Scalars['String']['input']>
  voting_for_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
}

export enum NextstakeSortByInput {
  BalanceAsc = 'BALANCE_ASC',
  BalanceDesc = 'BALANCE_DESC',
  DelegateAsc = 'DELEGATE_ASC',
  DelegateDesc = 'DELEGATE_DESC',
  LedgerhashAsc = 'LEDGERHASH_ASC',
  LedgerhashDesc = 'LEDGERHASH_DESC',
  NonceAsc = 'NONCE_ASC',
  NonceDesc = 'NONCE_DESC',
  PkAsc = 'PK_ASC',
  PkDesc = 'PK_DESC',
  PublicKeyAsc = 'PUBLIC_KEY_ASC',
  PublicKeyDesc = 'PUBLIC_KEY_DESC',
  ReceiptChainHashAsc = 'RECEIPT_CHAIN_HASH_ASC',
  ReceiptChainHashDesc = 'RECEIPT_CHAIN_HASH_DESC',
  TokenAsc = 'TOKEN_ASC',
  TokenDesc = 'TOKEN_DESC',
  VotingForAsc = 'VOTING_FOR_ASC',
  VotingForDesc = 'VOTING_FOR_DESC'
}

export type NextstakeTiming = {
  __typename?: 'NextstakeTiming'
  cliff_amount?: Maybe<Scalars['Float']['output']>
  cliff_time?: Maybe<Scalars['Int']['output']>
  initial_minimum_balance?: Maybe<Scalars['Float']['output']>
  vesting_increment?: Maybe<Scalars['Float']['output']>
  vesting_period?: Maybe<Scalars['Int']['output']>
}

export type NextstakeTimingInsertInput = {
  cliff_amount?: InputMaybe<Scalars['Float']['input']>
  cliff_time?: InputMaybe<Scalars['Int']['input']>
  initial_minimum_balance?: InputMaybe<Scalars['Float']['input']>
  vesting_increment?: InputMaybe<Scalars['Float']['input']>
  vesting_period?: InputMaybe<Scalars['Int']['input']>
}

export type NextstakeTimingQueryInput = {
  AND?: InputMaybe<Array<NextstakeTimingQueryInput>>
  OR?: InputMaybe<Array<NextstakeTimingQueryInput>>
  cliff_amount?: InputMaybe<Scalars['Float']['input']>
  cliff_amount_exists?: InputMaybe<Scalars['Boolean']['input']>
  cliff_amount_gt?: InputMaybe<Scalars['Float']['input']>
  cliff_amount_gte?: InputMaybe<Scalars['Float']['input']>
  cliff_amount_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
  cliff_amount_lt?: InputMaybe<Scalars['Float']['input']>
  cliff_amount_lte?: InputMaybe<Scalars['Float']['input']>
  cliff_amount_ne?: InputMaybe<Scalars['Float']['input']>
  cliff_amount_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
  cliff_time?: InputMaybe<Scalars['Int']['input']>
  cliff_time_exists?: InputMaybe<Scalars['Boolean']['input']>
  cliff_time_gt?: InputMaybe<Scalars['Int']['input']>
  cliff_time_gte?: InputMaybe<Scalars['Int']['input']>
  cliff_time_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  cliff_time_lt?: InputMaybe<Scalars['Int']['input']>
  cliff_time_lte?: InputMaybe<Scalars['Int']['input']>
  cliff_time_ne?: InputMaybe<Scalars['Int']['input']>
  cliff_time_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  initial_minimum_balance?: InputMaybe<Scalars['Float']['input']>
  initial_minimum_balance_exists?: InputMaybe<Scalars['Boolean']['input']>
  initial_minimum_balance_gt?: InputMaybe<Scalars['Float']['input']>
  initial_minimum_balance_gte?: InputMaybe<Scalars['Float']['input']>
  initial_minimum_balance_in?: InputMaybe<
    Array<InputMaybe<Scalars['Float']['input']>>
  >
  initial_minimum_balance_lt?: InputMaybe<Scalars['Float']['input']>
  initial_minimum_balance_lte?: InputMaybe<Scalars['Float']['input']>
  initial_minimum_balance_ne?: InputMaybe<Scalars['Float']['input']>
  initial_minimum_balance_nin?: InputMaybe<
    Array<InputMaybe<Scalars['Float']['input']>>
  >
  vesting_increment?: InputMaybe<Scalars['Float']['input']>
  vesting_increment_exists?: InputMaybe<Scalars['Boolean']['input']>
  vesting_increment_gt?: InputMaybe<Scalars['Float']['input']>
  vesting_increment_gte?: InputMaybe<Scalars['Float']['input']>
  vesting_increment_in?: InputMaybe<
    Array<InputMaybe<Scalars['Float']['input']>>
  >
  vesting_increment_lt?: InputMaybe<Scalars['Float']['input']>
  vesting_increment_lte?: InputMaybe<Scalars['Float']['input']>
  vesting_increment_ne?: InputMaybe<Scalars['Float']['input']>
  vesting_increment_nin?: InputMaybe<
    Array<InputMaybe<Scalars['Float']['input']>>
  >
  vesting_period?: InputMaybe<Scalars['Int']['input']>
  vesting_period_exists?: InputMaybe<Scalars['Boolean']['input']>
  vesting_period_gt?: InputMaybe<Scalars['Int']['input']>
  vesting_period_gte?: InputMaybe<Scalars['Int']['input']>
  vesting_period_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  vesting_period_lt?: InputMaybe<Scalars['Int']['input']>
  vesting_period_lte?: InputMaybe<Scalars['Int']['input']>
  vesting_period_ne?: InputMaybe<Scalars['Int']['input']>
  vesting_period_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
}

export type NextstakeTimingUpdateInput = {
  cliff_amount?: InputMaybe<Scalars['Float']['input']>
  cliff_amount_inc?: InputMaybe<Scalars['Float']['input']>
  cliff_amount_unset?: InputMaybe<Scalars['Boolean']['input']>
  cliff_time?: InputMaybe<Scalars['Int']['input']>
  cliff_time_inc?: InputMaybe<Scalars['Int']['input']>
  cliff_time_unset?: InputMaybe<Scalars['Boolean']['input']>
  initial_minimum_balance?: InputMaybe<Scalars['Float']['input']>
  initial_minimum_balance_inc?: InputMaybe<Scalars['Float']['input']>
  initial_minimum_balance_unset?: InputMaybe<Scalars['Boolean']['input']>
  vesting_increment?: InputMaybe<Scalars['Float']['input']>
  vesting_increment_inc?: InputMaybe<Scalars['Float']['input']>
  vesting_increment_unset?: InputMaybe<Scalars['Boolean']['input']>
  vesting_period?: InputMaybe<Scalars['Int']['input']>
  vesting_period_inc?: InputMaybe<Scalars['Int']['input']>
  vesting_period_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type NextstakeUpdateInput = {
  balance?: InputMaybe<Scalars['Float']['input']>
  balance_inc?: InputMaybe<Scalars['Float']['input']>
  balance_unset?: InputMaybe<Scalars['Boolean']['input']>
  delegate?: InputMaybe<Scalars['String']['input']>
  delegate_unset?: InputMaybe<Scalars['Boolean']['input']>
  ledgerHash?: InputMaybe<Scalars['String']['input']>
  ledgerHash_unset?: InputMaybe<Scalars['Boolean']['input']>
  nonce?: InputMaybe<Scalars['Int']['input']>
  nonce_inc?: InputMaybe<Scalars['Int']['input']>
  nonce_unset?: InputMaybe<Scalars['Boolean']['input']>
  permissions?: InputMaybe<NextstakePermissionUpdateInput>
  permissions_unset?: InputMaybe<Scalars['Boolean']['input']>
  pk?: InputMaybe<Scalars['String']['input']>
  pk_unset?: InputMaybe<Scalars['Boolean']['input']>
  public_key?: InputMaybe<Scalars['String']['input']>
  public_key_unset?: InputMaybe<Scalars['Boolean']['input']>
  receipt_chain_hash?: InputMaybe<Scalars['String']['input']>
  receipt_chain_hash_unset?: InputMaybe<Scalars['Boolean']['input']>
  timing?: InputMaybe<NextstakeTimingUpdateInput>
  timing_unset?: InputMaybe<Scalars['Boolean']['input']>
  token?: InputMaybe<Scalars['Int']['input']>
  token_inc?: InputMaybe<Scalars['Int']['input']>
  token_unset?: InputMaybe<Scalars['Boolean']['input']>
  voting_for?: InputMaybe<Scalars['String']['input']>
  voting_for_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type Query = {
  __typename?: 'Query'
  block?: Maybe<Block>
  blocks: Array<Maybe<Block>>
  feetransfer?: Maybe<Feetransfer>
  feetransfers: Array<Maybe<Feetransfer>>
  nextstake?: Maybe<Nextstake>
  nextstakes: Array<Maybe<Nextstake>>
  snark?: Maybe<Snark>
  snarks: Array<Maybe<Snark>>
  stake?: Maybe<Stake>
  stakes: Array<Maybe<Stake>>
  transaction?: Maybe<Transaction>
  transactions: Array<Maybe<Transaction>>
}

export type QueryBlockArgs = {
  query?: InputMaybe<BlockQueryInput>
}

export type QueryBlocksArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  query?: InputMaybe<BlockQueryInput>
  sortBy?: InputMaybe<BlockSortByInput>
}

export type QueryFeetransferArgs = {
  query?: InputMaybe<FeetransferQueryInput>
}

export type QueryFeetransfersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  query?: InputMaybe<FeetransferQueryInput>
  sortBy?: InputMaybe<FeetransferSortByInput>
}

export type QueryNextstakeArgs = {
  query?: InputMaybe<NextstakeQueryInput>
}

export type QueryNextstakesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  query?: InputMaybe<NextstakeQueryInput>
  sortBy?: InputMaybe<NextstakeSortByInput>
}

export type QuerySnarkArgs = {
  query?: InputMaybe<SnarkQueryInput>
}

export type QuerySnarksArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  query?: InputMaybe<SnarkQueryInput>
  sortBy?: InputMaybe<SnarkSortByInput>
}

export type QueryStakeArgs = {
  query?: InputMaybe<StakeQueryInput>
}

export type QueryStakesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  query?: InputMaybe<StakeQueryInput>
  sortBy?: InputMaybe<StakeSortByInput>
}

export type QueryTransactionArgs = {
  query?: InputMaybe<TransactionQueryInput>
}

export type QueryTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  query?: InputMaybe<TransactionQueryInput>
  sortBy?: InputMaybe<TransactionSortByInput>
}

export type Snark = {
  __typename?: 'Snark'
  block?: Maybe<Block>
  blockHeight?: Maybe<Scalars['Int']['output']>
  canonical?: Maybe<Scalars['Boolean']['output']>
  dateTime?: Maybe<Scalars['DateTime']['output']>
  fee?: Maybe<Scalars['Float']['output']>
  prover?: Maybe<Scalars['String']['output']>
  workIds?: Maybe<Array<Maybe<Scalars['Int']['output']>>>
}

export type SnarkBlockStateHashRelationInput = {
  create?: InputMaybe<BlockInsertInput>
  link?: InputMaybe<Scalars['String']['input']>
}

export type SnarkInsertInput = {
  block?: InputMaybe<SnarkBlockStateHashRelationInput>
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  canonical?: InputMaybe<Scalars['Boolean']['input']>
  dateTime?: InputMaybe<Scalars['DateTime']['input']>
  fee?: InputMaybe<Scalars['Float']['input']>
  prover?: InputMaybe<Scalars['String']['input']>
  workIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
}

export type SnarkQueryInput = {
  AND?: InputMaybe<Array<SnarkQueryInput>>
  OR?: InputMaybe<Array<SnarkQueryInput>>
  block?: InputMaybe<BlockQueryInput>
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  blockHeight_exists?: InputMaybe<Scalars['Boolean']['input']>
  blockHeight_gt?: InputMaybe<Scalars['Int']['input']>
  blockHeight_gte?: InputMaybe<Scalars['Int']['input']>
  blockHeight_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  blockHeight_lt?: InputMaybe<Scalars['Int']['input']>
  blockHeight_lte?: InputMaybe<Scalars['Int']['input']>
  blockHeight_ne?: InputMaybe<Scalars['Int']['input']>
  blockHeight_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  block_exists?: InputMaybe<Scalars['Boolean']['input']>
  canonical?: InputMaybe<Scalars['Boolean']['input']>
  canonical_exists?: InputMaybe<Scalars['Boolean']['input']>
  canonical_ne?: InputMaybe<Scalars['Boolean']['input']>
  dateTime?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_exists?: InputMaybe<Scalars['Boolean']['input']>
  dateTime_gt?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_gte?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>
  dateTime_lt?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_lte?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_ne?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>
  fee?: InputMaybe<Scalars['Float']['input']>
  fee_exists?: InputMaybe<Scalars['Boolean']['input']>
  fee_gt?: InputMaybe<Scalars['Float']['input']>
  fee_gte?: InputMaybe<Scalars['Float']['input']>
  fee_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
  fee_lt?: InputMaybe<Scalars['Float']['input']>
  fee_lte?: InputMaybe<Scalars['Float']['input']>
  fee_ne?: InputMaybe<Scalars['Float']['input']>
  fee_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
  prover?: InputMaybe<Scalars['String']['input']>
  prover_exists?: InputMaybe<Scalars['Boolean']['input']>
  prover_gt?: InputMaybe<Scalars['String']['input']>
  prover_gte?: InputMaybe<Scalars['String']['input']>
  prover_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  prover_lt?: InputMaybe<Scalars['String']['input']>
  prover_lte?: InputMaybe<Scalars['String']['input']>
  prover_ne?: InputMaybe<Scalars['String']['input']>
  prover_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  workIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  workIds_exists?: InputMaybe<Scalars['Boolean']['input']>
  workIds_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  workIds_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
}

export enum SnarkSortByInput {
  BlockheightAsc = 'BLOCKHEIGHT_ASC',
  BlockheightDesc = 'BLOCKHEIGHT_DESC',
  BlockstatehashAsc = 'BLOCKSTATEHASH_ASC',
  BlockstatehashDesc = 'BLOCKSTATEHASH_DESC',
  DatetimeAsc = 'DATETIME_ASC',
  DatetimeDesc = 'DATETIME_DESC',
  FeeAsc = 'FEE_ASC',
  FeeDesc = 'FEE_DESC',
  ProverAsc = 'PROVER_ASC',
  ProverDesc = 'PROVER_DESC'
}

export type SnarkUpdateInput = {
  block?: InputMaybe<SnarkBlockStateHashRelationInput>
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  blockHeight_inc?: InputMaybe<Scalars['Int']['input']>
  blockHeight_unset?: InputMaybe<Scalars['Boolean']['input']>
  block_unset?: InputMaybe<Scalars['Boolean']['input']>
  canonical?: InputMaybe<Scalars['Boolean']['input']>
  canonical_unset?: InputMaybe<Scalars['Boolean']['input']>
  dateTime?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_unset?: InputMaybe<Scalars['Boolean']['input']>
  fee?: InputMaybe<Scalars['Float']['input']>
  fee_inc?: InputMaybe<Scalars['Float']['input']>
  fee_unset?: InputMaybe<Scalars['Boolean']['input']>
  prover?: InputMaybe<Scalars['String']['input']>
  prover_unset?: InputMaybe<Scalars['Boolean']['input']>
  workIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  workIds_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type Stake = {
  __typename?: 'Stake'
  balance?: Maybe<Scalars['Float']['output']>
  chainId?: Maybe<Scalars['String']['output']>
  delegate?: Maybe<Scalars['String']['output']>
  delegationTotals?: Maybe<DelegationTotal>
  epoch?: Maybe<Scalars['Int']['output']>
  ledgerHash?: Maybe<Scalars['String']['output']>
  nonce?: Maybe<Scalars['Int']['output']>
  permissions?: Maybe<StakePermission>
  pk?: Maybe<Scalars['String']['output']>
  public_key?: Maybe<Scalars['String']['output']>
  receipt_chain_hash?: Maybe<Scalars['String']['output']>
  timing?: Maybe<StakeTiming>
  token?: Maybe<Scalars['Int']['output']>
  voting_for?: Maybe<Scalars['String']['output']>
}

export type StakeInsertInput = {
  balance?: InputMaybe<Scalars['Float']['input']>
  chainId?: InputMaybe<Scalars['String']['input']>
  delegate?: InputMaybe<Scalars['String']['input']>
  epoch?: InputMaybe<Scalars['Int']['input']>
  ledgerHash?: InputMaybe<Scalars['String']['input']>
  nonce?: InputMaybe<Scalars['Int']['input']>
  permissions?: InputMaybe<StakePermissionInsertInput>
  pk?: InputMaybe<Scalars['String']['input']>
  public_key?: InputMaybe<Scalars['String']['input']>
  receipt_chain_hash?: InputMaybe<Scalars['String']['input']>
  timing?: InputMaybe<StakeTimingInsertInput>
  token?: InputMaybe<Scalars['Int']['input']>
  voting_for?: InputMaybe<Scalars['String']['input']>
}

export type StakePermission = {
  __typename?: 'StakePermission'
  edit_state?: Maybe<Scalars['String']['output']>
  send?: Maybe<Scalars['String']['output']>
  set_delegate?: Maybe<Scalars['String']['output']>
  set_permissions?: Maybe<Scalars['String']['output']>
  set_verification_key?: Maybe<Scalars['String']['output']>
  stake?: Maybe<Scalars['Boolean']['output']>
}

export type StakePermissionInsertInput = {
  edit_state?: InputMaybe<Scalars['String']['input']>
  send?: InputMaybe<Scalars['String']['input']>
  set_delegate?: InputMaybe<Scalars['String']['input']>
  set_permissions?: InputMaybe<Scalars['String']['input']>
  set_verification_key?: InputMaybe<Scalars['String']['input']>
  stake?: InputMaybe<Scalars['Boolean']['input']>
}

export type StakePermissionQueryInput = {
  AND?: InputMaybe<Array<StakePermissionQueryInput>>
  OR?: InputMaybe<Array<StakePermissionQueryInput>>
  edit_state?: InputMaybe<Scalars['String']['input']>
  edit_state_exists?: InputMaybe<Scalars['Boolean']['input']>
  edit_state_gt?: InputMaybe<Scalars['String']['input']>
  edit_state_gte?: InputMaybe<Scalars['String']['input']>
  edit_state_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  edit_state_lt?: InputMaybe<Scalars['String']['input']>
  edit_state_lte?: InputMaybe<Scalars['String']['input']>
  edit_state_ne?: InputMaybe<Scalars['String']['input']>
  edit_state_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  send?: InputMaybe<Scalars['String']['input']>
  send_exists?: InputMaybe<Scalars['Boolean']['input']>
  send_gt?: InputMaybe<Scalars['String']['input']>
  send_gte?: InputMaybe<Scalars['String']['input']>
  send_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  send_lt?: InputMaybe<Scalars['String']['input']>
  send_lte?: InputMaybe<Scalars['String']['input']>
  send_ne?: InputMaybe<Scalars['String']['input']>
  send_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  set_delegate?: InputMaybe<Scalars['String']['input']>
  set_delegate_exists?: InputMaybe<Scalars['Boolean']['input']>
  set_delegate_gt?: InputMaybe<Scalars['String']['input']>
  set_delegate_gte?: InputMaybe<Scalars['String']['input']>
  set_delegate_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  set_delegate_lt?: InputMaybe<Scalars['String']['input']>
  set_delegate_lte?: InputMaybe<Scalars['String']['input']>
  set_delegate_ne?: InputMaybe<Scalars['String']['input']>
  set_delegate_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  set_permissions?: InputMaybe<Scalars['String']['input']>
  set_permissions_exists?: InputMaybe<Scalars['Boolean']['input']>
  set_permissions_gt?: InputMaybe<Scalars['String']['input']>
  set_permissions_gte?: InputMaybe<Scalars['String']['input']>
  set_permissions_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  set_permissions_lt?: InputMaybe<Scalars['String']['input']>
  set_permissions_lte?: InputMaybe<Scalars['String']['input']>
  set_permissions_ne?: InputMaybe<Scalars['String']['input']>
  set_permissions_nin?: InputMaybe<
    Array<InputMaybe<Scalars['String']['input']>>
  >
  set_verification_key?: InputMaybe<Scalars['String']['input']>
  set_verification_key_exists?: InputMaybe<Scalars['Boolean']['input']>
  set_verification_key_gt?: InputMaybe<Scalars['String']['input']>
  set_verification_key_gte?: InputMaybe<Scalars['String']['input']>
  set_verification_key_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']['input']>>
  >
  set_verification_key_lt?: InputMaybe<Scalars['String']['input']>
  set_verification_key_lte?: InputMaybe<Scalars['String']['input']>
  set_verification_key_ne?: InputMaybe<Scalars['String']['input']>
  set_verification_key_nin?: InputMaybe<
    Array<InputMaybe<Scalars['String']['input']>>
  >
  stake?: InputMaybe<Scalars['Boolean']['input']>
  stake_exists?: InputMaybe<Scalars['Boolean']['input']>
  stake_ne?: InputMaybe<Scalars['Boolean']['input']>
}

export type StakePermissionUpdateInput = {
  edit_state?: InputMaybe<Scalars['String']['input']>
  edit_state_unset?: InputMaybe<Scalars['Boolean']['input']>
  send?: InputMaybe<Scalars['String']['input']>
  send_unset?: InputMaybe<Scalars['Boolean']['input']>
  set_delegate?: InputMaybe<Scalars['String']['input']>
  set_delegate_unset?: InputMaybe<Scalars['Boolean']['input']>
  set_permissions?: InputMaybe<Scalars['String']['input']>
  set_permissions_unset?: InputMaybe<Scalars['Boolean']['input']>
  set_verification_key?: InputMaybe<Scalars['String']['input']>
  set_verification_key_unset?: InputMaybe<Scalars['Boolean']['input']>
  stake?: InputMaybe<Scalars['Boolean']['input']>
  stake_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type StakeQueryInput = {
  AND?: InputMaybe<Array<StakeQueryInput>>
  OR?: InputMaybe<Array<StakeQueryInput>>
  balance?: InputMaybe<Scalars['Float']['input']>
  balance_exists?: InputMaybe<Scalars['Boolean']['input']>
  balance_gt?: InputMaybe<Scalars['Float']['input']>
  balance_gte?: InputMaybe<Scalars['Float']['input']>
  balance_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
  balance_lt?: InputMaybe<Scalars['Float']['input']>
  balance_lte?: InputMaybe<Scalars['Float']['input']>
  balance_ne?: InputMaybe<Scalars['Float']['input']>
  balance_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
  chainId?: InputMaybe<Scalars['String']['input']>
  chainId_exists?: InputMaybe<Scalars['Boolean']['input']>
  chainId_gt?: InputMaybe<Scalars['String']['input']>
  chainId_gte?: InputMaybe<Scalars['String']['input']>
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  chainId_lt?: InputMaybe<Scalars['String']['input']>
  chainId_lte?: InputMaybe<Scalars['String']['input']>
  chainId_ne?: InputMaybe<Scalars['String']['input']>
  chainId_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  delegate?: InputMaybe<Scalars['String']['input']>
  delegate_exists?: InputMaybe<Scalars['Boolean']['input']>
  delegate_gt?: InputMaybe<Scalars['String']['input']>
  delegate_gte?: InputMaybe<Scalars['String']['input']>
  delegate_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  delegate_lt?: InputMaybe<Scalars['String']['input']>
  delegate_lte?: InputMaybe<Scalars['String']['input']>
  delegate_ne?: InputMaybe<Scalars['String']['input']>
  delegate_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  epoch?: InputMaybe<Scalars['Int']['input']>
  epoch_exists?: InputMaybe<Scalars['Boolean']['input']>
  epoch_gt?: InputMaybe<Scalars['Int']['input']>
  epoch_gte?: InputMaybe<Scalars['Int']['input']>
  epoch_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  epoch_lt?: InputMaybe<Scalars['Int']['input']>
  epoch_lte?: InputMaybe<Scalars['Int']['input']>
  epoch_ne?: InputMaybe<Scalars['Int']['input']>
  epoch_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  ledgerHash?: InputMaybe<Scalars['String']['input']>
  ledgerHash_exists?: InputMaybe<Scalars['Boolean']['input']>
  ledgerHash_gt?: InputMaybe<Scalars['String']['input']>
  ledgerHash_gte?: InputMaybe<Scalars['String']['input']>
  ledgerHash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  ledgerHash_lt?: InputMaybe<Scalars['String']['input']>
  ledgerHash_lte?: InputMaybe<Scalars['String']['input']>
  ledgerHash_ne?: InputMaybe<Scalars['String']['input']>
  ledgerHash_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  nonce?: InputMaybe<Scalars['Int']['input']>
  nonce_exists?: InputMaybe<Scalars['Boolean']['input']>
  nonce_gt?: InputMaybe<Scalars['Int']['input']>
  nonce_gte?: InputMaybe<Scalars['Int']['input']>
  nonce_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  nonce_lt?: InputMaybe<Scalars['Int']['input']>
  nonce_lte?: InputMaybe<Scalars['Int']['input']>
  nonce_ne?: InputMaybe<Scalars['Int']['input']>
  nonce_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  permissions?: InputMaybe<StakePermissionQueryInput>
  permissions_exists?: InputMaybe<Scalars['Boolean']['input']>
  pk?: InputMaybe<Scalars['String']['input']>
  pk_exists?: InputMaybe<Scalars['Boolean']['input']>
  pk_gt?: InputMaybe<Scalars['String']['input']>
  pk_gte?: InputMaybe<Scalars['String']['input']>
  pk_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  pk_lt?: InputMaybe<Scalars['String']['input']>
  pk_lte?: InputMaybe<Scalars['String']['input']>
  pk_ne?: InputMaybe<Scalars['String']['input']>
  pk_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  public_key?: InputMaybe<Scalars['String']['input']>
  public_key_exists?: InputMaybe<Scalars['Boolean']['input']>
  public_key_gt?: InputMaybe<Scalars['String']['input']>
  public_key_gte?: InputMaybe<Scalars['String']['input']>
  public_key_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  public_key_lt?: InputMaybe<Scalars['String']['input']>
  public_key_lte?: InputMaybe<Scalars['String']['input']>
  public_key_ne?: InputMaybe<Scalars['String']['input']>
  public_key_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  receipt_chain_hash?: InputMaybe<Scalars['String']['input']>
  receipt_chain_hash_exists?: InputMaybe<Scalars['Boolean']['input']>
  receipt_chain_hash_gt?: InputMaybe<Scalars['String']['input']>
  receipt_chain_hash_gte?: InputMaybe<Scalars['String']['input']>
  receipt_chain_hash_in?: InputMaybe<
    Array<InputMaybe<Scalars['String']['input']>>
  >
  receipt_chain_hash_lt?: InputMaybe<Scalars['String']['input']>
  receipt_chain_hash_lte?: InputMaybe<Scalars['String']['input']>
  receipt_chain_hash_ne?: InputMaybe<Scalars['String']['input']>
  receipt_chain_hash_nin?: InputMaybe<
    Array<InputMaybe<Scalars['String']['input']>>
  >
  timing?: InputMaybe<StakeTimingQueryInput>
  timing_exists?: InputMaybe<Scalars['Boolean']['input']>
  token?: InputMaybe<Scalars['Int']['input']>
  token_exists?: InputMaybe<Scalars['Boolean']['input']>
  token_gt?: InputMaybe<Scalars['Int']['input']>
  token_gte?: InputMaybe<Scalars['Int']['input']>
  token_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  token_lt?: InputMaybe<Scalars['Int']['input']>
  token_lte?: InputMaybe<Scalars['Int']['input']>
  token_ne?: InputMaybe<Scalars['Int']['input']>
  token_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  voting_for?: InputMaybe<Scalars['String']['input']>
  voting_for_exists?: InputMaybe<Scalars['Boolean']['input']>
  voting_for_gt?: InputMaybe<Scalars['String']['input']>
  voting_for_gte?: InputMaybe<Scalars['String']['input']>
  voting_for_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  voting_for_lt?: InputMaybe<Scalars['String']['input']>
  voting_for_lte?: InputMaybe<Scalars['String']['input']>
  voting_for_ne?: InputMaybe<Scalars['String']['input']>
  voting_for_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
}

export enum StakeSortByInput {
  BalanceAsc = 'BALANCE_ASC',
  BalanceDesc = 'BALANCE_DESC',
  ChainidAsc = 'CHAINID_ASC',
  ChainidDesc = 'CHAINID_DESC',
  DelegateAsc = 'DELEGATE_ASC',
  DelegateDesc = 'DELEGATE_DESC',
  EpochAsc = 'EPOCH_ASC',
  EpochDesc = 'EPOCH_DESC',
  LedgerhashAsc = 'LEDGERHASH_ASC',
  LedgerhashDesc = 'LEDGERHASH_DESC',
  NonceAsc = 'NONCE_ASC',
  NonceDesc = 'NONCE_DESC',
  PkAsc = 'PK_ASC',
  PkDesc = 'PK_DESC',
  PublicKeyAsc = 'PUBLIC_KEY_ASC',
  PublicKeyDesc = 'PUBLIC_KEY_DESC',
  ReceiptChainHashAsc = 'RECEIPT_CHAIN_HASH_ASC',
  ReceiptChainHashDesc = 'RECEIPT_CHAIN_HASH_DESC',
  TokenAsc = 'TOKEN_ASC',
  TokenDesc = 'TOKEN_DESC',
  VotingForAsc = 'VOTING_FOR_ASC',
  VotingForDesc = 'VOTING_FOR_DESC'
}

export type StakeTiming = {
  __typename?: 'StakeTiming'
  cliff_amount?: Maybe<Scalars['Float']['output']>
  cliff_time?: Maybe<Scalars['Int']['output']>
  initial_minimum_balance?: Maybe<Scalars['Float']['output']>
  timed_epoch_end?: Maybe<Scalars['Boolean']['output']>
  timed_in_epoch?: Maybe<Scalars['Boolean']['output']>
  timed_weighting?: Maybe<Scalars['Float']['output']>
  untimed_slot?: Maybe<Scalars['Int']['output']>
  vesting_increment?: Maybe<Scalars['Float']['output']>
  vesting_period?: Maybe<Scalars['Int']['output']>
}

export type StakeTimingInsertInput = {
  cliff_amount?: InputMaybe<Scalars['Float']['input']>
  cliff_time?: InputMaybe<Scalars['Int']['input']>
  initial_minimum_balance?: InputMaybe<Scalars['Float']['input']>
  timed_epoch_end?: InputMaybe<Scalars['Boolean']['input']>
  timed_in_epoch?: InputMaybe<Scalars['Boolean']['input']>
  timed_weighting?: InputMaybe<Scalars['Float']['input']>
  untimed_slot?: InputMaybe<Scalars['Int']['input']>
  vesting_increment?: InputMaybe<Scalars['Float']['input']>
  vesting_period?: InputMaybe<Scalars['Int']['input']>
}

export type StakeTimingQueryInput = {
  AND?: InputMaybe<Array<StakeTimingQueryInput>>
  OR?: InputMaybe<Array<StakeTimingQueryInput>>
  cliff_amount?: InputMaybe<Scalars['Float']['input']>
  cliff_amount_exists?: InputMaybe<Scalars['Boolean']['input']>
  cliff_amount_gt?: InputMaybe<Scalars['Float']['input']>
  cliff_amount_gte?: InputMaybe<Scalars['Float']['input']>
  cliff_amount_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
  cliff_amount_lt?: InputMaybe<Scalars['Float']['input']>
  cliff_amount_lte?: InputMaybe<Scalars['Float']['input']>
  cliff_amount_ne?: InputMaybe<Scalars['Float']['input']>
  cliff_amount_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
  cliff_time?: InputMaybe<Scalars['Int']['input']>
  cliff_time_exists?: InputMaybe<Scalars['Boolean']['input']>
  cliff_time_gt?: InputMaybe<Scalars['Int']['input']>
  cliff_time_gte?: InputMaybe<Scalars['Int']['input']>
  cliff_time_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  cliff_time_lt?: InputMaybe<Scalars['Int']['input']>
  cliff_time_lte?: InputMaybe<Scalars['Int']['input']>
  cliff_time_ne?: InputMaybe<Scalars['Int']['input']>
  cliff_time_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  initial_minimum_balance?: InputMaybe<Scalars['Float']['input']>
  initial_minimum_balance_exists?: InputMaybe<Scalars['Boolean']['input']>
  initial_minimum_balance_gt?: InputMaybe<Scalars['Float']['input']>
  initial_minimum_balance_gte?: InputMaybe<Scalars['Float']['input']>
  initial_minimum_balance_in?: InputMaybe<
    Array<InputMaybe<Scalars['Float']['input']>>
  >
  initial_minimum_balance_lt?: InputMaybe<Scalars['Float']['input']>
  initial_minimum_balance_lte?: InputMaybe<Scalars['Float']['input']>
  initial_minimum_balance_ne?: InputMaybe<Scalars['Float']['input']>
  initial_minimum_balance_nin?: InputMaybe<
    Array<InputMaybe<Scalars['Float']['input']>>
  >
  timed_epoch_end?: InputMaybe<Scalars['Boolean']['input']>
  timed_epoch_end_exists?: InputMaybe<Scalars['Boolean']['input']>
  timed_epoch_end_ne?: InputMaybe<Scalars['Boolean']['input']>
  timed_in_epoch?: InputMaybe<Scalars['Boolean']['input']>
  timed_in_epoch_exists?: InputMaybe<Scalars['Boolean']['input']>
  timed_in_epoch_ne?: InputMaybe<Scalars['Boolean']['input']>
  timed_weighting?: InputMaybe<Scalars['Float']['input']>
  timed_weighting_exists?: InputMaybe<Scalars['Boolean']['input']>
  timed_weighting_gt?: InputMaybe<Scalars['Float']['input']>
  timed_weighting_gte?: InputMaybe<Scalars['Float']['input']>
  timed_weighting_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
  timed_weighting_lt?: InputMaybe<Scalars['Float']['input']>
  timed_weighting_lte?: InputMaybe<Scalars['Float']['input']>
  timed_weighting_ne?: InputMaybe<Scalars['Float']['input']>
  timed_weighting_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
  untimed_slot?: InputMaybe<Scalars['Int']['input']>
  untimed_slot_exists?: InputMaybe<Scalars['Boolean']['input']>
  untimed_slot_gt?: InputMaybe<Scalars['Int']['input']>
  untimed_slot_gte?: InputMaybe<Scalars['Int']['input']>
  untimed_slot_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  untimed_slot_lt?: InputMaybe<Scalars['Int']['input']>
  untimed_slot_lte?: InputMaybe<Scalars['Int']['input']>
  untimed_slot_ne?: InputMaybe<Scalars['Int']['input']>
  untimed_slot_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  vesting_increment?: InputMaybe<Scalars['Float']['input']>
  vesting_increment_exists?: InputMaybe<Scalars['Boolean']['input']>
  vesting_increment_gt?: InputMaybe<Scalars['Float']['input']>
  vesting_increment_gte?: InputMaybe<Scalars['Float']['input']>
  vesting_increment_in?: InputMaybe<
    Array<InputMaybe<Scalars['Float']['input']>>
  >
  vesting_increment_lt?: InputMaybe<Scalars['Float']['input']>
  vesting_increment_lte?: InputMaybe<Scalars['Float']['input']>
  vesting_increment_ne?: InputMaybe<Scalars['Float']['input']>
  vesting_increment_nin?: InputMaybe<
    Array<InputMaybe<Scalars['Float']['input']>>
  >
  vesting_period?: InputMaybe<Scalars['Int']['input']>
  vesting_period_exists?: InputMaybe<Scalars['Boolean']['input']>
  vesting_period_gt?: InputMaybe<Scalars['Int']['input']>
  vesting_period_gte?: InputMaybe<Scalars['Int']['input']>
  vesting_period_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  vesting_period_lt?: InputMaybe<Scalars['Int']['input']>
  vesting_period_lte?: InputMaybe<Scalars['Int']['input']>
  vesting_period_ne?: InputMaybe<Scalars['Int']['input']>
  vesting_period_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
}

export type StakeTimingUpdateInput = {
  cliff_amount?: InputMaybe<Scalars['Float']['input']>
  cliff_amount_inc?: InputMaybe<Scalars['Float']['input']>
  cliff_amount_unset?: InputMaybe<Scalars['Boolean']['input']>
  cliff_time?: InputMaybe<Scalars['Int']['input']>
  cliff_time_inc?: InputMaybe<Scalars['Int']['input']>
  cliff_time_unset?: InputMaybe<Scalars['Boolean']['input']>
  initial_minimum_balance?: InputMaybe<Scalars['Float']['input']>
  initial_minimum_balance_inc?: InputMaybe<Scalars['Float']['input']>
  initial_minimum_balance_unset?: InputMaybe<Scalars['Boolean']['input']>
  timed_epoch_end?: InputMaybe<Scalars['Boolean']['input']>
  timed_epoch_end_unset?: InputMaybe<Scalars['Boolean']['input']>
  timed_in_epoch?: InputMaybe<Scalars['Boolean']['input']>
  timed_in_epoch_unset?: InputMaybe<Scalars['Boolean']['input']>
  timed_weighting?: InputMaybe<Scalars['Float']['input']>
  timed_weighting_inc?: InputMaybe<Scalars['Float']['input']>
  timed_weighting_unset?: InputMaybe<Scalars['Boolean']['input']>
  untimed_slot?: InputMaybe<Scalars['Int']['input']>
  untimed_slot_inc?: InputMaybe<Scalars['Int']['input']>
  untimed_slot_unset?: InputMaybe<Scalars['Boolean']['input']>
  vesting_increment?: InputMaybe<Scalars['Float']['input']>
  vesting_increment_inc?: InputMaybe<Scalars['Float']['input']>
  vesting_increment_unset?: InputMaybe<Scalars['Boolean']['input']>
  vesting_period?: InputMaybe<Scalars['Int']['input']>
  vesting_period_inc?: InputMaybe<Scalars['Int']['input']>
  vesting_period_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type StakeUpdateInput = {
  balance?: InputMaybe<Scalars['Float']['input']>
  balance_inc?: InputMaybe<Scalars['Float']['input']>
  balance_unset?: InputMaybe<Scalars['Boolean']['input']>
  chainId?: InputMaybe<Scalars['String']['input']>
  chainId_unset?: InputMaybe<Scalars['Boolean']['input']>
  delegate?: InputMaybe<Scalars['String']['input']>
  delegate_unset?: InputMaybe<Scalars['Boolean']['input']>
  epoch?: InputMaybe<Scalars['Int']['input']>
  epoch_inc?: InputMaybe<Scalars['Int']['input']>
  epoch_unset?: InputMaybe<Scalars['Boolean']['input']>
  ledgerHash?: InputMaybe<Scalars['String']['input']>
  ledgerHash_unset?: InputMaybe<Scalars['Boolean']['input']>
  nonce?: InputMaybe<Scalars['Int']['input']>
  nonce_inc?: InputMaybe<Scalars['Int']['input']>
  nonce_unset?: InputMaybe<Scalars['Boolean']['input']>
  permissions?: InputMaybe<StakePermissionUpdateInput>
  permissions_unset?: InputMaybe<Scalars['Boolean']['input']>
  pk?: InputMaybe<Scalars['String']['input']>
  pk_unset?: InputMaybe<Scalars['Boolean']['input']>
  public_key?: InputMaybe<Scalars['String']['input']>
  public_key_unset?: InputMaybe<Scalars['Boolean']['input']>
  receipt_chain_hash?: InputMaybe<Scalars['String']['input']>
  receipt_chain_hash_unset?: InputMaybe<Scalars['Boolean']['input']>
  timing?: InputMaybe<StakeTimingUpdateInput>
  timing_unset?: InputMaybe<Scalars['Boolean']['input']>
  token?: InputMaybe<Scalars['Int']['input']>
  token_inc?: InputMaybe<Scalars['Int']['input']>
  token_unset?: InputMaybe<Scalars['Boolean']['input']>
  voting_for?: InputMaybe<Scalars['String']['input']>
  voting_for_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type Transaction = {
  __typename?: 'Transaction'
  amount?: Maybe<Scalars['Float']['output']>
  block?: Maybe<Block>
  blockHeight?: Maybe<Scalars['Int']['output']>
  canonical?: Maybe<Scalars['Boolean']['output']>
  dateTime?: Maybe<Scalars['DateTime']['output']>
  failureReason?: Maybe<Scalars['String']['output']>
  fee?: Maybe<Scalars['Float']['output']>
  feePayer?: Maybe<TransactionFeePayer>
  feeToken?: Maybe<Scalars['Int']['output']>
  from?: Maybe<Scalars['String']['output']>
  fromAccount?: Maybe<TransactionFromAccount>
  hash?: Maybe<Scalars['String']['output']>
  id?: Maybe<Scalars['String']['output']>
  isDelegation?: Maybe<Scalars['Boolean']['output']>
  kind?: Maybe<Scalars['String']['output']>
  memo?: Maybe<Scalars['String']['output']>
  nonce?: Maybe<Scalars['Int']['output']>
  receiver?: Maybe<TransactionReceiver>
  source?: Maybe<TransactionSource>
  to?: Maybe<Scalars['String']['output']>
  toAccount?: Maybe<TransactionToAccount>
  token?: Maybe<Scalars['Int']['output']>
}

export type TransactionBlockStateHashRelationInput = {
  create?: InputMaybe<BlockInsertInput>
  link?: InputMaybe<Scalars['String']['input']>
}

export type TransactionFeePayer = {
  __typename?: 'TransactionFeePayer'
  token?: Maybe<Scalars['Int']['output']>
}

export type TransactionFeePayerInsertInput = {
  token?: InputMaybe<Scalars['Int']['input']>
}

export type TransactionFeePayerQueryInput = {
  AND?: InputMaybe<Array<TransactionFeePayerQueryInput>>
  OR?: InputMaybe<Array<TransactionFeePayerQueryInput>>
  token?: InputMaybe<Scalars['Int']['input']>
  token_exists?: InputMaybe<Scalars['Boolean']['input']>
  token_gt?: InputMaybe<Scalars['Int']['input']>
  token_gte?: InputMaybe<Scalars['Int']['input']>
  token_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  token_lt?: InputMaybe<Scalars['Int']['input']>
  token_lte?: InputMaybe<Scalars['Int']['input']>
  token_ne?: InputMaybe<Scalars['Int']['input']>
  token_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
}

export type TransactionFeePayerUpdateInput = {
  token?: InputMaybe<Scalars['Int']['input']>
  token_inc?: InputMaybe<Scalars['Int']['input']>
  token_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type TransactionFromAccount = {
  __typename?: 'TransactionFromAccount'
  token?: Maybe<Scalars['Int']['output']>
}

export type TransactionFromAccountInsertInput = {
  token?: InputMaybe<Scalars['Int']['input']>
}

export type TransactionFromAccountQueryInput = {
  AND?: InputMaybe<Array<TransactionFromAccountQueryInput>>
  OR?: InputMaybe<Array<TransactionFromAccountQueryInput>>
  token?: InputMaybe<Scalars['Int']['input']>
  token_exists?: InputMaybe<Scalars['Boolean']['input']>
  token_gt?: InputMaybe<Scalars['Int']['input']>
  token_gte?: InputMaybe<Scalars['Int']['input']>
  token_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  token_lt?: InputMaybe<Scalars['Int']['input']>
  token_lte?: InputMaybe<Scalars['Int']['input']>
  token_ne?: InputMaybe<Scalars['Int']['input']>
  token_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
}

export type TransactionFromAccountUpdateInput = {
  token?: InputMaybe<Scalars['Int']['input']>
  token_inc?: InputMaybe<Scalars['Int']['input']>
  token_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type TransactionInsertInput = {
  amount?: InputMaybe<Scalars['Float']['input']>
  block?: InputMaybe<TransactionBlockStateHashRelationInput>
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  canonical?: InputMaybe<Scalars['Boolean']['input']>
  dateTime?: InputMaybe<Scalars['DateTime']['input']>
  failureReason?: InputMaybe<Scalars['String']['input']>
  fee?: InputMaybe<Scalars['Float']['input']>
  feePayer?: InputMaybe<TransactionFeePayerInsertInput>
  feeToken?: InputMaybe<Scalars['Int']['input']>
  from?: InputMaybe<Scalars['String']['input']>
  fromAccount?: InputMaybe<TransactionFromAccountInsertInput>
  hash?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  isDelegation?: InputMaybe<Scalars['Boolean']['input']>
  kind?: InputMaybe<Scalars['String']['input']>
  memo?: InputMaybe<Scalars['String']['input']>
  nonce?: InputMaybe<Scalars['Int']['input']>
  receiver?: InputMaybe<TransactionReceiverInsertInput>
  source?: InputMaybe<TransactionSourceInsertInput>
  to?: InputMaybe<Scalars['String']['input']>
  toAccount?: InputMaybe<TransactionToAccountInsertInput>
  token?: InputMaybe<Scalars['Int']['input']>
}

export type TransactionQueryInput = {
  AND?: InputMaybe<Array<TransactionQueryInput>>
  OR?: InputMaybe<Array<TransactionQueryInput>>
  amount?: InputMaybe<Scalars['Float']['input']>
  amount_exists?: InputMaybe<Scalars['Boolean']['input']>
  amount_gt?: InputMaybe<Scalars['Float']['input']>
  amount_gte?: InputMaybe<Scalars['Float']['input']>
  amount_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
  amount_lt?: InputMaybe<Scalars['Float']['input']>
  amount_lte?: InputMaybe<Scalars['Float']['input']>
  amount_ne?: InputMaybe<Scalars['Float']['input']>
  amount_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
  block?: InputMaybe<BlockQueryInput>
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  blockHeight_exists?: InputMaybe<Scalars['Boolean']['input']>
  blockHeight_gt?: InputMaybe<Scalars['Int']['input']>
  blockHeight_gte?: InputMaybe<Scalars['Int']['input']>
  blockHeight_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  blockHeight_lt?: InputMaybe<Scalars['Int']['input']>
  blockHeight_lte?: InputMaybe<Scalars['Int']['input']>
  blockHeight_ne?: InputMaybe<Scalars['Int']['input']>
  blockHeight_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  block_exists?: InputMaybe<Scalars['Boolean']['input']>
  canonical?: InputMaybe<Scalars['Boolean']['input']>
  canonical_exists?: InputMaybe<Scalars['Boolean']['input']>
  canonical_ne?: InputMaybe<Scalars['Boolean']['input']>
  dateTime?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_exists?: InputMaybe<Scalars['Boolean']['input']>
  dateTime_gt?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_gte?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>
  dateTime_lt?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_lte?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_ne?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>
  failureReason?: InputMaybe<Scalars['String']['input']>
  failureReason_exists?: InputMaybe<Scalars['Boolean']['input']>
  failureReason_gt?: InputMaybe<Scalars['String']['input']>
  failureReason_gte?: InputMaybe<Scalars['String']['input']>
  failureReason_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  failureReason_lt?: InputMaybe<Scalars['String']['input']>
  failureReason_lte?: InputMaybe<Scalars['String']['input']>
  failureReason_ne?: InputMaybe<Scalars['String']['input']>
  failureReason_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  fee?: InputMaybe<Scalars['Float']['input']>
  feePayer?: InputMaybe<TransactionFeePayerQueryInput>
  feePayer_exists?: InputMaybe<Scalars['Boolean']['input']>
  feeToken?: InputMaybe<Scalars['Int']['input']>
  feeToken_exists?: InputMaybe<Scalars['Boolean']['input']>
  feeToken_gt?: InputMaybe<Scalars['Int']['input']>
  feeToken_gte?: InputMaybe<Scalars['Int']['input']>
  feeToken_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  feeToken_lt?: InputMaybe<Scalars['Int']['input']>
  feeToken_lte?: InputMaybe<Scalars['Int']['input']>
  feeToken_ne?: InputMaybe<Scalars['Int']['input']>
  feeToken_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  fee_exists?: InputMaybe<Scalars['Boolean']['input']>
  fee_gt?: InputMaybe<Scalars['Float']['input']>
  fee_gte?: InputMaybe<Scalars['Float']['input']>
  fee_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
  fee_lt?: InputMaybe<Scalars['Float']['input']>
  fee_lte?: InputMaybe<Scalars['Float']['input']>
  fee_ne?: InputMaybe<Scalars['Float']['input']>
  fee_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>
  from?: InputMaybe<Scalars['String']['input']>
  fromAccount?: InputMaybe<TransactionFromAccountQueryInput>
  fromAccount_exists?: InputMaybe<Scalars['Boolean']['input']>
  from_exists?: InputMaybe<Scalars['Boolean']['input']>
  from_gt?: InputMaybe<Scalars['String']['input']>
  from_gte?: InputMaybe<Scalars['String']['input']>
  from_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  from_lt?: InputMaybe<Scalars['String']['input']>
  from_lte?: InputMaybe<Scalars['String']['input']>
  from_ne?: InputMaybe<Scalars['String']['input']>
  from_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  hash?: InputMaybe<Scalars['String']['input']>
  hash_exists?: InputMaybe<Scalars['Boolean']['input']>
  hash_gt?: InputMaybe<Scalars['String']['input']>
  hash_gte?: InputMaybe<Scalars['String']['input']>
  hash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  hash_lt?: InputMaybe<Scalars['String']['input']>
  hash_lte?: InputMaybe<Scalars['String']['input']>
  hash_ne?: InputMaybe<Scalars['String']['input']>
  hash_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  id?: InputMaybe<Scalars['String']['input']>
  id_exists?: InputMaybe<Scalars['Boolean']['input']>
  id_gt?: InputMaybe<Scalars['String']['input']>
  id_gte?: InputMaybe<Scalars['String']['input']>
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  id_lt?: InputMaybe<Scalars['String']['input']>
  id_lte?: InputMaybe<Scalars['String']['input']>
  id_ne?: InputMaybe<Scalars['String']['input']>
  id_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  isDelegation?: InputMaybe<Scalars['Boolean']['input']>
  isDelegation_exists?: InputMaybe<Scalars['Boolean']['input']>
  isDelegation_ne?: InputMaybe<Scalars['Boolean']['input']>
  kind?: InputMaybe<Scalars['String']['input']>
  kind_exists?: InputMaybe<Scalars['Boolean']['input']>
  kind_gt?: InputMaybe<Scalars['String']['input']>
  kind_gte?: InputMaybe<Scalars['String']['input']>
  kind_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  kind_lt?: InputMaybe<Scalars['String']['input']>
  kind_lte?: InputMaybe<Scalars['String']['input']>
  kind_ne?: InputMaybe<Scalars['String']['input']>
  kind_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  memo?: InputMaybe<Scalars['String']['input']>
  memo_exists?: InputMaybe<Scalars['Boolean']['input']>
  memo_gt?: InputMaybe<Scalars['String']['input']>
  memo_gte?: InputMaybe<Scalars['String']['input']>
  memo_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  memo_lt?: InputMaybe<Scalars['String']['input']>
  memo_lte?: InputMaybe<Scalars['String']['input']>
  memo_ne?: InputMaybe<Scalars['String']['input']>
  memo_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  nonce?: InputMaybe<Scalars['Int']['input']>
  nonce_exists?: InputMaybe<Scalars['Boolean']['input']>
  nonce_gt?: InputMaybe<Scalars['Int']['input']>
  nonce_gte?: InputMaybe<Scalars['Int']['input']>
  nonce_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  nonce_lt?: InputMaybe<Scalars['Int']['input']>
  nonce_lte?: InputMaybe<Scalars['Int']['input']>
  nonce_ne?: InputMaybe<Scalars['Int']['input']>
  nonce_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  receiver?: InputMaybe<TransactionReceiverQueryInput>
  receiver_exists?: InputMaybe<Scalars['Boolean']['input']>
  source?: InputMaybe<TransactionSourceQueryInput>
  source_exists?: InputMaybe<Scalars['Boolean']['input']>
  to?: InputMaybe<Scalars['String']['input']>
  toAccount?: InputMaybe<TransactionToAccountQueryInput>
  toAccount_exists?: InputMaybe<Scalars['Boolean']['input']>
  to_exists?: InputMaybe<Scalars['Boolean']['input']>
  to_gt?: InputMaybe<Scalars['String']['input']>
  to_gte?: InputMaybe<Scalars['String']['input']>
  to_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  to_lt?: InputMaybe<Scalars['String']['input']>
  to_lte?: InputMaybe<Scalars['String']['input']>
  to_ne?: InputMaybe<Scalars['String']['input']>
  to_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  token?: InputMaybe<Scalars['Int']['input']>
  token_exists?: InputMaybe<Scalars['Boolean']['input']>
  token_gt?: InputMaybe<Scalars['Int']['input']>
  token_gte?: InputMaybe<Scalars['Int']['input']>
  token_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  token_lt?: InputMaybe<Scalars['Int']['input']>
  token_lte?: InputMaybe<Scalars['Int']['input']>
  token_ne?: InputMaybe<Scalars['Int']['input']>
  token_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
}

export type TransactionReceiver = {
  __typename?: 'TransactionReceiver'
  publicKey?: Maybe<Scalars['String']['output']>
}

export type TransactionReceiverInsertInput = {
  publicKey?: InputMaybe<Scalars['String']['input']>
}

export type TransactionReceiverQueryInput = {
  AND?: InputMaybe<Array<TransactionReceiverQueryInput>>
  OR?: InputMaybe<Array<TransactionReceiverQueryInput>>
  publicKey?: InputMaybe<Scalars['String']['input']>
  publicKey_exists?: InputMaybe<Scalars['Boolean']['input']>
  publicKey_gt?: InputMaybe<Scalars['String']['input']>
  publicKey_gte?: InputMaybe<Scalars['String']['input']>
  publicKey_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  publicKey_lt?: InputMaybe<Scalars['String']['input']>
  publicKey_lte?: InputMaybe<Scalars['String']['input']>
  publicKey_ne?: InputMaybe<Scalars['String']['input']>
  publicKey_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
}

export type TransactionReceiverUpdateInput = {
  publicKey?: InputMaybe<Scalars['String']['input']>
  publicKey_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export enum TransactionSortByInput {
  AmountAsc = 'AMOUNT_ASC',
  AmountDesc = 'AMOUNT_DESC',
  BlockheightAsc = 'BLOCKHEIGHT_ASC',
  BlockheightDesc = 'BLOCKHEIGHT_DESC',
  BlockstatehashAsc = 'BLOCKSTATEHASH_ASC',
  BlockstatehashDesc = 'BLOCKSTATEHASH_DESC',
  DatetimeAsc = 'DATETIME_ASC',
  DatetimeDesc = 'DATETIME_DESC',
  FailurereasonAsc = 'FAILUREREASON_ASC',
  FailurereasonDesc = 'FAILUREREASON_DESC',
  FeetokenAsc = 'FEETOKEN_ASC',
  FeetokenDesc = 'FEETOKEN_DESC',
  FeeAsc = 'FEE_ASC',
  FeeDesc = 'FEE_DESC',
  FromAsc = 'FROM_ASC',
  FromDesc = 'FROM_DESC',
  HashAsc = 'HASH_ASC',
  HashDesc = 'HASH_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  KindAsc = 'KIND_ASC',
  KindDesc = 'KIND_DESC',
  MemoAsc = 'MEMO_ASC',
  MemoDesc = 'MEMO_DESC',
  NonceAsc = 'NONCE_ASC',
  NonceDesc = 'NONCE_DESC',
  TokenAsc = 'TOKEN_ASC',
  TokenDesc = 'TOKEN_DESC',
  ToAsc = 'TO_ASC',
  ToDesc = 'TO_DESC'
}

export type TransactionSource = {
  __typename?: 'TransactionSource'
  publicKey?: Maybe<Scalars['String']['output']>
}

export type TransactionSourceInsertInput = {
  publicKey?: InputMaybe<Scalars['String']['input']>
}

export type TransactionSourceQueryInput = {
  AND?: InputMaybe<Array<TransactionSourceQueryInput>>
  OR?: InputMaybe<Array<TransactionSourceQueryInput>>
  publicKey?: InputMaybe<Scalars['String']['input']>
  publicKey_exists?: InputMaybe<Scalars['Boolean']['input']>
  publicKey_gt?: InputMaybe<Scalars['String']['input']>
  publicKey_gte?: InputMaybe<Scalars['String']['input']>
  publicKey_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  publicKey_lt?: InputMaybe<Scalars['String']['input']>
  publicKey_lte?: InputMaybe<Scalars['String']['input']>
  publicKey_ne?: InputMaybe<Scalars['String']['input']>
  publicKey_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
}

export type TransactionSourceUpdateInput = {
  publicKey?: InputMaybe<Scalars['String']['input']>
  publicKey_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type TransactionToAccount = {
  __typename?: 'TransactionToAccount'
  token?: Maybe<Scalars['Int']['output']>
}

export type TransactionToAccountInsertInput = {
  token?: InputMaybe<Scalars['Int']['input']>
}

export type TransactionToAccountQueryInput = {
  AND?: InputMaybe<Array<TransactionToAccountQueryInput>>
  OR?: InputMaybe<Array<TransactionToAccountQueryInput>>
  token?: InputMaybe<Scalars['Int']['input']>
  token_exists?: InputMaybe<Scalars['Boolean']['input']>
  token_gt?: InputMaybe<Scalars['Int']['input']>
  token_gte?: InputMaybe<Scalars['Int']['input']>
  token_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  token_lt?: InputMaybe<Scalars['Int']['input']>
  token_lte?: InputMaybe<Scalars['Int']['input']>
  token_ne?: InputMaybe<Scalars['Int']['input']>
  token_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
}

export type TransactionToAccountUpdateInput = {
  token?: InputMaybe<Scalars['Int']['input']>
  token_inc?: InputMaybe<Scalars['Int']['input']>
  token_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type TransactionUpdateInput = {
  amount?: InputMaybe<Scalars['Float']['input']>
  amount_inc?: InputMaybe<Scalars['Float']['input']>
  amount_unset?: InputMaybe<Scalars['Boolean']['input']>
  block?: InputMaybe<TransactionBlockStateHashRelationInput>
  blockHeight?: InputMaybe<Scalars['Int']['input']>
  blockHeight_inc?: InputMaybe<Scalars['Int']['input']>
  blockHeight_unset?: InputMaybe<Scalars['Boolean']['input']>
  block_unset?: InputMaybe<Scalars['Boolean']['input']>
  canonical?: InputMaybe<Scalars['Boolean']['input']>
  canonical_unset?: InputMaybe<Scalars['Boolean']['input']>
  dateTime?: InputMaybe<Scalars['DateTime']['input']>
  dateTime_unset?: InputMaybe<Scalars['Boolean']['input']>
  failureReason?: InputMaybe<Scalars['String']['input']>
  failureReason_unset?: InputMaybe<Scalars['Boolean']['input']>
  fee?: InputMaybe<Scalars['Float']['input']>
  feePayer?: InputMaybe<TransactionFeePayerUpdateInput>
  feePayer_unset?: InputMaybe<Scalars['Boolean']['input']>
  feeToken?: InputMaybe<Scalars['Int']['input']>
  feeToken_inc?: InputMaybe<Scalars['Int']['input']>
  feeToken_unset?: InputMaybe<Scalars['Boolean']['input']>
  fee_inc?: InputMaybe<Scalars['Float']['input']>
  fee_unset?: InputMaybe<Scalars['Boolean']['input']>
  from?: InputMaybe<Scalars['String']['input']>
  fromAccount?: InputMaybe<TransactionFromAccountUpdateInput>
  fromAccount_unset?: InputMaybe<Scalars['Boolean']['input']>
  from_unset?: InputMaybe<Scalars['Boolean']['input']>
  hash?: InputMaybe<Scalars['String']['input']>
  hash_unset?: InputMaybe<Scalars['Boolean']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  id_unset?: InputMaybe<Scalars['Boolean']['input']>
  isDelegation?: InputMaybe<Scalars['Boolean']['input']>
  isDelegation_unset?: InputMaybe<Scalars['Boolean']['input']>
  kind?: InputMaybe<Scalars['String']['input']>
  kind_unset?: InputMaybe<Scalars['Boolean']['input']>
  memo?: InputMaybe<Scalars['String']['input']>
  memo_unset?: InputMaybe<Scalars['Boolean']['input']>
  nonce?: InputMaybe<Scalars['Int']['input']>
  nonce_inc?: InputMaybe<Scalars['Int']['input']>
  nonce_unset?: InputMaybe<Scalars['Boolean']['input']>
  receiver?: InputMaybe<TransactionReceiverUpdateInput>
  receiver_unset?: InputMaybe<Scalars['Boolean']['input']>
  source?: InputMaybe<TransactionSourceUpdateInput>
  source_unset?: InputMaybe<Scalars['Boolean']['input']>
  to?: InputMaybe<Scalars['String']['input']>
  toAccount?: InputMaybe<TransactionToAccountUpdateInput>
  toAccount_unset?: InputMaybe<Scalars['Boolean']['input']>
  to_unset?: InputMaybe<Scalars['Boolean']['input']>
  token?: InputMaybe<Scalars['Int']['input']>
  token_inc?: InputMaybe<Scalars['Int']['input']>
  token_unset?: InputMaybe<Scalars['Boolean']['input']>
}

export type UpdateManyPayload = {
  __typename?: 'UpdateManyPayload'
  matchedCount: Scalars['Int']['output']
  modifiedCount: Scalars['Int']['output']
}

export type TransactionQueryVariables = Exact<{
  hash: Scalars['String']['input']
}>

export type TransactionQuery = {
  __typename?: 'Query'
  transaction?: {
    __typename?: 'Transaction'
    amount?: number | null
    blockHeight?: number | null
    dateTime?: any | null
    failureReason?: string | null
    fee?: number | null
    from?: string | null
    hash?: string | null
    isDelegation?: boolean | null
    kind?: string | null
    to?: string | null
    token?: number | null
  } | null
}

export type TransactionsQueryVariables = Exact<{
  address: Scalars['String']['input']
}>

export type TransactionsQuery = {
  __typename?: 'Query'
  transactions: Array<{
    __typename?: 'Transaction'
    amount?: number | null
    to?: string | null
    token?: number | null
    kind?: string | null
    isDelegation?: boolean | null
    hash?: string | null
    from?: string | null
    fee?: number | null
    failureReason?: string | null
    dateTime?: any | null
    blockHeight?: number | null
  } | null>
}

export const TransactionDocument = gql`
  query Transaction($hash: String!) {
    transaction(query: { hash: $hash }) {
      amount
      blockHeight
      dateTime
      failureReason
      fee
      from
      hash
      isDelegation
      kind
      to
      token
    }
  }
`
export const TransactionsDocument = gql`
  query Transactions($address: String!) {
    transactions(query: { from: $address, OR: { to: $address } }) {
      amount
      to
      token
      kind
      isDelegation
      hash
      from
      fee
      failureReason
      dateTime
      blockHeight
    }
  }
`

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string
) => Promise<T>

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType
) => action()

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper
) {
  return {
    Transaction(
      variables: TransactionQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<TransactionQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<TransactionQuery>(TransactionDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders
          }),
        'Transaction',
        'query'
      )
    },
    Transactions(
      variables: TransactionsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<TransactionsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<TransactionsQuery>(TransactionsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders
          }),
        'Transactions',
        'query'
      )
    }
  }
}
export type Sdk = ReturnType<typeof getSdk>
