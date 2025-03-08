import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Ayah, Surah } from './types';

interface QuranDB extends DBSchema {
  ayahs: {
    key: string;
    value: Ayah;
    indexes: { 'by-surah': number };
  };
  surahs: {
    key: number;
    value: Surah;
  };
  bookmarks: {
    key: string;
    value: {
      id: string;
      surahNumber: number;
      ayahNumber: number;
      timestamp: number;
    };
  };
  audioCache: {
    key: string;
    value: {
      url: string;
      blob: Blob;
      timestamp: number;
    };
  };
}

class OfflineStorage {
  private db: IDBPDatabase<QuranDB> | null = null;

  async init() {
    this.db = await openDB<QuranDB>('quran-app', 1, {
      upgrade(db) {
        // Ayahs store with surah index
        const ayahStore = db.createObjectStore('ayahs', { keyPath: 'surahNumber' });
        ayahStore.createIndex('by-surah', 'surahNumber');

        // Surahs store
        db.createObjectStore('surahs', { keyPath: 'number' });

        // Bookmarks store
        db.createObjectStore('bookmarks', { keyPath: 'id' });

        // Audio cache store
        db.createObjectStore('audioCache', { keyPath: 'url' });
      },
    });
  }

  async saveAyah(ayah: Ayah) {
    if (!this.db) await this.init();
    const key = `${ayah.surahName}-${ayah.ayahNo}`;
    await this.db!.put('ayahs', ayah, key);
  }

  async getAyah(surahNumber: number, ayahNumber: number) {
    if (!this.db) await this.init();
    const key = `${surahNumber}-${ayahNumber}`;
    return await this.db!.get('ayahs', key);
  }

  async saveSurah(surah: Surah) {
    if (!this.db) await this.init();
    await this.db!.put('surahs', surah);
  }

  async getSurah(number: number) {
    if (!this.db) await this.init();
    return await this.db!.get('surahs', number);
  }

  async saveBookmark(surahNumber: number, ayahNumber: number) {
    if (!this.db) await this.init();
    const id = `${surahNumber}-${ayahNumber}`;
    await this.db!.put('bookmarks', {
      id,
      surahNumber,
      ayahNumber,
      timestamp: Date.now(),
    });
  }

  async getBookmarks() {
    if (!this.db) await this.init();
    return await this.db!.getAll('bookmarks');
  }

  async saveAudio(url: string, blob: Blob) {
    if (!this.db) await this.init();
    await this.db!.put('audioCache', {
      url,
      blob,
      timestamp: Date.now(),
    });
  }

  async getAudio(url: string) {
    if (!this.db) await this.init();
    return await this.db!.get('audioCache', url);
  }

  async clearOldCache(maxAge: number = 7 * 24 * 60 * 60 * 1000) {
    if (!this.db) await this.init();
    const now = Date.now();
    const tx = this.db!.transaction('audioCache', 'readwrite');
    const store = tx.objectStore('audioCache');
    const keys = await store.getAllKeys();
    
    for (const key of keys) {
      const item = await store.get(key);
      if (item && now - item.timestamp > maxAge) {
        await store.delete(key);
      }
    }
  }
}

export const offlineStorage = new OfflineStorage();
