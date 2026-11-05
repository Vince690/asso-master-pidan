import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { AppUser, Article, Member, Partner, SiteSettings } from "@/lib/types";
import { seedArticles, seedMembers, seedPartners, seedSettings, seedUsers } from "@/lib/seed";
import { filterArticles, sortMembers, type Store } from "./store";

/**
 * Store de démonstration : un fichier JSON dans `.local-data/` (ignoré par git).
 * Il est créé à partir des données de démonstration au premier lancement et persiste
 * les modifications faites depuis l'espace admin, sans aucun service externe.
 */

interface Snapshot {
  articles: Article[];
  members: Member[];
  partners: Partner[];
  users: AppUser[];
  settings: SiteSettings;
}

const DIR = path.join(process.cwd(), ".local-data");
const FILE = path.join(DIR, "db.json");
const IMAGES = path.join(DIR, "images");
const EXT: Record<string, string> = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" };

let cache: Snapshot | null = null;
let writing: Promise<void> = Promise.resolve();

async function load(): Promise<Snapshot> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(FILE, "utf8");
    cache = JSON.parse(raw) as Snapshot;
  } catch {
    cache = {
      articles: seedArticles,
      members: seedMembers,
      partners: seedPartners,
      users: seedUsers,
      settings: seedSettings,
    };
    await persist(cache);
  }
  return cache;
}

async function persist(snapshot: Snapshot) {
  cache = snapshot;
  writing = writing.then(async () => {
    await fs.mkdir(DIR, { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(snapshot, null, 2), "utf8");
  });
  await writing;
}

async function mutate(fn: (s: Snapshot) => void) {
  const s = await load();
  fn(s);
  await persist(s);
}

function upsertIn<T>(list: T[], item: T, key: (x: T) => string) {
  const i = list.findIndex((x) => key(x) === key(item));
  if (i === -1) list.push(item);
  else list[i] = item;
}

export const localStore: Store = {
  articles: {
    list: async (q) => filterArticles((await load()).articles, q),
    get: async (id) => (await load()).articles.find((a) => a.id === id) ?? null,
    getBySlug: async (slug) => (await load()).articles.find((a) => a.slug === slug) ?? null,
    upsert: (article) => mutate((s) => upsertIn(s.articles, article, (a) => a.id)),
    delete: (id) => mutate((s) => void (s.articles = s.articles.filter((a) => a.id !== id))),
  },
  members: {
    list: async () => sortMembers((await load()).members),
    get: async (id) => (await load()).members.find((m) => m.id === id) ?? null,
    upsert: (member) => mutate((s) => upsertIn(s.members, member, (m) => m.id)),
    delete: (id) => mutate((s) => void (s.members = s.members.filter((m) => m.id !== id))),
  },
  partners: {
    list: async () => [...(await load()).partners].sort((a, b) => a.order - b.order),
    get: async (id) => (await load()).partners.find((p) => p.id === id) ?? null,
    upsert: (partner) => mutate((s) => upsertIn(s.partners, partner, (p) => p.id)),
    delete: (id) => mutate((s) => void (s.partners = s.partners.filter((p) => p.id !== id))),
  },
  users: {
    list: async () => [...(await load()).users],
    get: async (email) => (await load()).users.find((u) => u.email === email.toLowerCase()) ?? null,
    upsert: (user) => mutate((s) => upsertIn(s.users, { ...user, email: user.email.toLowerCase() }, (u) => u.email)),
    delete: (email) => mutate((s) => void (s.users = s.users.filter((u) => u.email !== email.toLowerCase()))),
  },
  settings: {
    get: async () => (await load()).settings,
    set: (settings) => mutate((s) => void (s.settings = settings)),
  },
  images: {
    get: async (id) => {
      for (const [type, ext] of Object.entries(EXT)) {
        try {
          const buf = await fs.readFile(path.join(IMAGES, `${id}.${ext}`));
          const { birthtime } = await fs.stat(path.join(IMAGES, `${id}.${ext}`));
          return { id, type, data: buf.toString("base64"), createdAt: birthtime.toISOString() };
        } catch {
          /* essai suivant */
        }
      }
      return null;
    },
    put: async (image) => {
      await fs.mkdir(IMAGES, { recursive: true });
      await fs.writeFile(path.join(IMAGES, `${image.id}.${EXT[image.type] ?? "bin"}`), Buffer.from(image.data, "base64"));
    },
  },
};
