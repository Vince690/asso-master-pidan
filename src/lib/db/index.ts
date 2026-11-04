import "server-only";
import type { Store } from "./store";
import { isFirebaseConfigured } from "@/lib/firebase/config";

let store: Store | null = null;

/** Retourne le store actif : Firestore si Firebase est configuré, sinon le fichier JSON local. */
export async function db(): Promise<Store> {
  if (store) return store;
  if (isFirebaseConfigured()) {
    const { firestoreStore } = await import("./firestore");
    store = firestoreStore;
  } else {
    const { localStore } = await import("./local");
    store = localStore;
  }
  return store;
}

export type { Store } from "./store";
