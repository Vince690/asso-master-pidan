import "server-only";
import type { AppUser, Article, Member, Partner, SiteSettings } from "@/lib/types";
import { seedSettings } from "@/lib/seed";
import { getAdminDb } from "@/lib/firebase/admin";
import { filterArticles, sortMembers, type Store } from "./store";

/**
 * Store Firestore (SDK admin, côté serveur uniquement).
 * Collections : articles, members, partners, users (id = email), settings/site, messages.
 */

function col<T>(name: string) {
  const db = getAdminDb();
  const ref = db.collection(name);
  return {
    all: async () => (await ref.get()).docs.map((d) => d.data() as T),
    one: async (id: string) => {
      const snap = await ref.doc(id).get();
      return snap.exists ? (snap.data() as T) : null;
    },
    set: async (id: string, data: T) => {
      await ref.doc(id).set(data as FirebaseFirestore.DocumentData);
    },
    del: async (id: string) => {
      await ref.doc(id).delete();
    },
    ref,
  };
}

export const firestoreStore: Store = {
  articles: {
    list: async (q) => filterArticles(await col<Article>("articles").all(), q),
    get: (id) => col<Article>("articles").one(id),
    getBySlug: async (slug) => {
      const snap = await col<Article>("articles").ref.where("slug", "==", slug).limit(1).get();
      return snap.empty ? null : (snap.docs[0].data() as Article);
    },
    upsert: (a) => col<Article>("articles").set(a.id, a),
    delete: (id) => col<Article>("articles").del(id),
  },
  members: {
    list: async () => sortMembers(await col<Member>("members").all()),
    get: (id) => col<Member>("members").one(id),
    upsert: (m) => col<Member>("members").set(m.id, m),
    delete: (id) => col<Member>("members").del(id),
  },
  partners: {
    list: async () => (await col<Partner>("partners").all()).sort((a, b) => a.order - b.order),
    get: (id) => col<Partner>("partners").one(id),
    upsert: (p) => col<Partner>("partners").set(p.id, p),
    delete: (id) => col<Partner>("partners").del(id),
  },
  users: {
    list: () => col<AppUser>("users").all(),
    get: (email) => col<AppUser>("users").one(email.toLowerCase()),
    upsert: (u) => col<AppUser>("users").set(u.email.toLowerCase(), { ...u, email: u.email.toLowerCase() }),
    delete: (email) => col<AppUser>("users").del(email.toLowerCase()),
  },
  settings: {
    get: async () => (await col<SiteSettings>("settings").one("site")) ?? seedSettings,
    set: (s) => col<SiteSettings>("settings").set("site", s),
  },
};
