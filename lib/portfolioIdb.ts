import { openDB, type IDBPDatabase } from "idb";
import type { FidelityPosition, PortfolioData } from "./types";

const DB_NAME = "wmm-portfolios";
const DB_VERSION = 2;
const STORE_META = "portfolioMeta" as const;
const STORE_PAYLOAD = "portfolioPayload" as const;
const LEGACY_STORE = "portfolios" as const;

/** Library / ordering / summary fields (small). */
export interface PortfolioMetaRow {
  id: string;
  name: string;
  sourceFileName: string;
  uploadedAt: string;
  lastViewedAt: string;
  positionCount: number;
  totalValue?: number;
}

/** Positions + server dashboard blob (large). */
export interface PortfolioPayloadRow {
  id: string;
  positions: FidelityPosition[];
  portfolioData: PortfolioData | null;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function splitLegacyPortfolioRow(
  row: unknown
): { meta: PortfolioMetaRow; payload: PortfolioPayloadRow } | null {
  if (!row || typeof row !== "object") {
    return null;
  }
  const o = row as Record<string, unknown>;
  if (
    typeof o.id !== "string" ||
    typeof o.name !== "string" ||
    typeof o.sourceFileName !== "string" ||
    typeof o.uploadedAt !== "string" ||
    typeof o.lastViewedAt !== "string" ||
    !Array.isArray(o.positions)
  ) {
    return null;
  }
  const positions = o.positions as FidelityPosition[];
  const portfolioData =
    o.portfolioData && typeof o.portfolioData === "object"
      ? (o.portfolioData as PortfolioData)
      : null;
  const positionCount =
    typeof o.positionCount === "number" ? o.positionCount : positions.length;
  return {
    meta: {
      id: o.id,
      name: o.name,
      sourceFileName: o.sourceFileName,
      uploadedAt: o.uploadedAt,
      lastViewedAt: o.lastViewedAt,
      positionCount,
      totalValue: typeof o.totalValue === "number" ? o.totalValue : undefined,
    },
    payload: {
      id: o.id,
      positions,
      portfolioData,
    },
  };
}

export function getPortfolioDB(): Promise<IDBPDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("indexedDB not available"));
  }
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      async upgrade(db, oldVersion, _newVersion, transaction) {
        if (oldVersion >= 2) {
          return;
        }

        db.createObjectStore(STORE_META, { keyPath: "id" });
        db.createObjectStore(STORE_PAYLOAD, { keyPath: "id" });

        if (oldVersion === 1 && db.objectStoreNames.contains(LEGACY_STORE)) {
          const legacy = transaction.objectStore(LEGACY_STORE);
          const metaStore = transaction.objectStore(STORE_META);
          const payloadStore = transaction.objectStore(STORE_PAYLOAD);
          let cursor = await legacy.openCursor();
          while (cursor) {
            const split = splitLegacyPortfolioRow(cursor.value);
            if (split) {
              metaStore.put(split.meta);
              payloadStore.put(split.payload);
            }
            cursor = await cursor.continue();
          }
          db.deleteObjectStore(LEGACY_STORE);
        }
      },
    });
  }
  return dbPromise;
}

export function resetPortfolioDbConnectionForTests(): void {
  dbPromise = null;
}

export async function deletePortfolioDatabaseForTests(): Promise<void> {
  if (dbPromise) {
    try {
      (await dbPromise).close();
    } catch {
      /* ignore */
    }
  }
  dbPromise = null;
  if (typeof indexedDB === "undefined") {
    return;
  }
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function idbGetAllPortfolioMeta(): Promise<PortfolioMetaRow[]> {
  const db = await getPortfolioDB();
  return db.getAll(STORE_META);
}

export async function idbGetAllPortfolioPayload(): Promise<PortfolioPayloadRow[]> {
  const db = await getPortfolioDB();
  return db.getAll(STORE_PAYLOAD);
}

export async function idbGetPortfolioMeta(
  id: string
): Promise<PortfolioMetaRow | undefined> {
  const db = await getPortfolioDB();
  return db.get(STORE_META, id);
}

export async function idbGetPortfolioPayload(
  id: string
): Promise<PortfolioPayloadRow | undefined> {
  const db = await getPortfolioDB();
  return db.get(STORE_PAYLOAD, id);
}

/** One transaction: read meta + payload, write both (or neither if missing). */
export async function idbMutatePortfolioRows(
  id: string,
  update: (rows: {
    meta: PortfolioMetaRow;
    payload: PortfolioPayloadRow;
  }) => { meta: PortfolioMetaRow; payload: PortfolioPayloadRow }
): Promise<boolean> {
  const db = await getPortfolioDB();
  const tx = db.transaction([STORE_META, STORE_PAYLOAD], "readwrite");
  const metaStore = tx.objectStore(STORE_META);
  const payloadStore = tx.objectStore(STORE_PAYLOAD);
  const metaRow = await metaStore.get(id);
  const payloadRow = await payloadStore.get(id);
  if (!metaRow || !payloadRow) {
    await tx.done;
    return false;
  }
  const { meta, payload } = update({ meta: metaRow, payload: payloadRow });
  await metaStore.put(meta);
  await payloadStore.put(payload);
  await tx.done;
  return true;
}

export async function idbMutatePortfolioMeta(
  id: string,
  update: (meta: PortfolioMetaRow) => PortfolioMetaRow
): Promise<boolean> {
  const db = await getPortfolioDB();
  const tx = db.transaction(STORE_META, "readwrite");
  const meta = await tx.store.get(id);
  if (!meta) {
    await tx.done;
    return false;
  }
  await tx.store.put(update(meta));
  await tx.done;
  return true;
}

export async function idbApplyPortfolioSplitDelta(
  deleteIds: string[],
  metasToPut: PortfolioMetaRow[],
  payloadsToPut: PortfolioPayloadRow[]
): Promise<void> {
  if (deleteIds.length === 0 && metasToPut.length === 0 && payloadsToPut.length === 0) {
    return;
  }
  const db = await getPortfolioDB();
  const tx = db.transaction([STORE_META, STORE_PAYLOAD], "readwrite");
  const metaStore = tx.objectStore(STORE_META);
  const payloadStore = tx.objectStore(STORE_PAYLOAD);
  for (const id of deleteIds) {
    await metaStore.delete(id);
    await payloadStore.delete(id);
  }
  for (const m of metasToPut) {
    await metaStore.put(m);
  }
  for (const p of payloadsToPut) {
    await payloadStore.put(p);
  }
  await tx.done;
}

export async function idbClearAllPortfolios(): Promise<void> {
  const db = await getPortfolioDB();
  const tx = db.transaction([STORE_META, STORE_PAYLOAD], "readwrite");
  await tx.objectStore(STORE_META).clear();
  await tx.objectStore(STORE_PAYLOAD).clear();
  await tx.done;
}
