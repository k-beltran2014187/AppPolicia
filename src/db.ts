export interface Recording {
  id?: number
  kind: 'video' | 'audio'
  mime: string
  createdAt: number
  blob: Blob
}

const open = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open('poligt', 1)
    req.onupgradeneeded = () => req.result.createObjectStore('rec', { keyPath: 'id', autoIncrement: true })
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })

const run = async <T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>) => {
  const db = await open()
  return new Promise<T>((resolve, reject) => {
    const req = fn(db.transaction('rec', mode).objectStore('rec'))
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export const saveRecording = (r: Recording) => run('readwrite', (s) => s.add(r))
export const listRecordings = () => run<Recording[]>('readonly', (s) => s.getAll())
export const deleteRecording = (id: number) => run('readwrite', (s) => s.delete(id))
