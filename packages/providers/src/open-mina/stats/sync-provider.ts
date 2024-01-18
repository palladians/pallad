interface LedgerInfo {
  hash: string | null
  fetch_hashes_start: number | null
  fetch_hashes_end: number | null
  fetch_accounts_start: number | null
  fetch_accounts_end: number | null
  fetch_parts_start: number | null
  fetch_parts_end: number | null
  reconstruct_start: number | null
  reconstruct_end: number | null
}

interface EpochInfo {
  snarked: LedgerInfo
  staged: LedgerInfo
}

interface StatsSyncData {
  kind: string
  best_tip_received: number
  synced: null
  ledgers: {
    staking_epoch: EpochInfo
    next_epoch: EpochInfo
    root: null
  }
  blocks: Array<{
    global_slot: number
    height: number
    hash: string
    pred_hash: string
    status: string
    fetch_start: number | null
    fetch_end: number | null
    apply_start: number | null
    apply_end: number | null
  }>
}

type StatsSyncResponse = Array<StatsSyncData>

export async function localNodeSyncStats(
  url: string,
  queryParams?: string | ''
): Promise<StatsSyncResponse> {
  try {
    const response = await fetch(`${url}/stats/sync${queryParams}`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data: StatsSyncResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching stats sync data:', error)
    throw error
  }
}
