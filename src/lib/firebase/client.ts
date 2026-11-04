"use client";

import { getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { firebaseClientConfig } from "./config";

function app() {
  return getApps()[0] ?? initializeApp(firebaseClientConfig);
}

export async function signInWithGoogle(): Promise<string> {
  const auth = getAuth(app());
  const result = await signInWithPopup(auth, new GoogleAuthProvider());
  return result.user.getIdToken();
}

export async function signInWithPassword(email: string, password: string): Promise<string> {
  const auth = getAuth(app());
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user.getIdToken();
}

export async function clientSignOut() {
  await signOut(getAuth(app()));
}
