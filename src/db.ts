/**
 * Local recordings. Chunks are written to IndexedDB while recording, so a crash,
 * a dead battery or a closed tab does not lose the video: unfinished recordings
 * are rebuilt from their chunks the next time the app opens.
 */
export interface Recording {
  id?: number
  kind: 'video' | 'audio' | 'photo'
  mime: string
  createdAt: number
  blob: Blob
  /** false while recording (or interrupted); true once assembled. */
  done?: boolean
}

interface Chunk {
  recId: number
  seq: number
  blob: Blob
}

const DB_NAME = 'poligt'

const open = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 2)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains('rec')) db.createObjectStore('rec', { keyPath: 'id', autoIncrement: true })
      if (!db.objectStoreNames.contains('chunks')) {
        db.createObjectStore('chunks', { keyPath: ['recId', 'seq'] })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })

const wrap = <T>(req: IDBRequest<T>) =>
  new Promise<T>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })

const tx = async <T>(stores: string | string[], mode: IDBTransactionMode, fn: (t: IDBTransaction) => IDBRequest<T>) => {
  const db = await open()
  try {
    return await wrap(fn(db.transaction(stores, mode)))
  } finally {
    db.close()
  }
}

/** Start a recording: returns its id. */
export const beginRecording = (kind: 'video' | 'audio', mime: string) =>
  tx('rec', 'readwrite', (t) =>
    t.objectStore('rec').add({ kind, mime, createdAt: Date.now(), blob: new Blob([], { type: mime }), done: false } satisfies Recording),
  ).then((id) => Number(id))

/** Save a photo taken from the chat; it appears next to the recordings. */
export const savePhoto = (blob: Blob) =>
  tx('rec', 'readwrite', (t) =>
    t.objectStore('rec').add({ kind: 'photo', mime: blob.type || 'image/jpeg', createdAt: Date.now(), blob, done: true } satisfies Recording),
  ).then((id) => Number(id))

export const saveChunk = (recId: number, seq: number, blob: Blob) =>
  tx('chunks', 'readwrite', (t) => t.objectStore('chunks').put({ recId, seq, blob } satisfies Chunk))

const chunksOf = (recId: number) =>
  tx<Chunk[]>('chunks', 'readonly', (t) => t.objectStore('chunks').getAll(IDBKeyRange.bound([recId, 0], [recId, Infinity])))

/** Join the saved chunks into one blob, mark the recording done and drop the chunks. */
export async function finishRecording(recId: number) {
  const chunks = await chunksOf(recId)
  const rec = await tx<Recording | undefined>('rec', 'readonly', (t) => t.objectStore('rec').get(recId))
  if (!rec) return
  if (!chunks.length) {
    await deleteRecording(recId)
    return
  }
  const blob = new Blob(chunks.sort((a, b) => a.seq - b.seq).map((c) => c.blob), { type: rec.mime })
  await tx('rec', 'readwrite', (t) => t.objectStore('rec').put({ ...rec, blob, done: true }))
  await tx('chunks', 'readwrite', (t) => t.objectStore('chunks').delete(IDBKeyRange.bound([recId, 0], [recId, Infinity])))
}

/** Rebuild anything left unfinished by an interrupted session. */
export async function recoverInterrupted() {
  const all = await tx<Recording[]>('rec', 'readonly', (t) => t.objectStore('rec').getAll())
  let n = 0
  for (const r of all) {
    if (r.done === false && r.id !== undefined) {
      await finishRecording(r.id)
      n++
    }
  }
  return n
}

export const listRecordings = () =>
  tx<Recording[]>('rec', 'readonly', (t) => t.objectStore('rec').getAll()).then((all) => all.filter((r) => r.done !== false))

export async function deleteRecording(id: number) {
  await tx('chunks', 'readwrite', (t) => t.objectStore('chunks').delete(IDBKeyRange.bound([id, 0], [id, Infinity])))
  await tx('rec', 'readwrite', (t) => t.objectStore('rec').delete(id))
}

export const deleteDatabase = () =>
  new Promise<void>((resolve) => {
    const req = indexedDB.deleteDatabase(DB_NAME)
    req.onsuccess = req.onerror = req.onblocked = () => resolve()
  })
