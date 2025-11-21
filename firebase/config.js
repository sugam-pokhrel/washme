// Firebase auth helper (light scaffolding)
// Add your Firebase config below or set via environment variables.
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously as firebaseSignInAnonymously,
  signInWithCredential,
  GoogleAuthProvider,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

let app;
let auth;
let db;

export function initFirebase(config) {
  if (!app) {
    console.log('initFirebase: initializing app for projectId=', config.projectId);
    app = initializeApp(config);
    auth = getAuth(app);
    try {
      db = getFirestore(app);
      console.log('initFirebase: firestore initialized');
    } catch (e) {
      console.warn('initFirebase: firestore init failed', e.message || e);
    }
  }
  return { app, auth };
}

export function getAuthInstance() {
  if (!auth) throw new Error('Firebase not initialized. Call initFirebase(config) first.');
  return auth;
}

export async function signInAnonymous() {
  const a = getAuthInstance();
  try {
    console.log('signInAnonymous: calling signInAnonymously');
    const result = await firebaseSignInAnonymously(a);
    console.log('signInAnonymous: success', result.user && result.user.uid);
    return result;
  } catch (err) {
    console.error('signInAnonymous: failed', err.code, err.message, err);
    throw err;
  }
}

export async function signInWithGoogleIdToken(idToken) {
  const a = getAuthInstance();
  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(a, credential);
}

export function onAuthStateChanged(cb) {
  const a = getAuthInstance();
  return firebaseOnAuthStateChanged(a, cb);
}

export async function signOut() {
  const a = getAuthInstance();
  return firebaseSignOut(a);
}

// Firestore helpers
export function getFirestoreInstance() {
  if (!db) throw new Error('Firestore not initialized. Call initFirebase(config) first.');
  return db;
}

export async function registerLaundry(payload) {
  const database = getFirestoreInstance();
  try {
    // Require authenticated user
    if (!auth || !auth.currentUser) throw new Error('Not authenticated');
    const ownerId = auth.currentUser.uid;
    const col = collection(database, 'laundries');
    const doc = await addDoc(col, { ...payload, ownerId, createdAt: new Date() });
    return { id: doc.id };
  } catch (err) {
    console.error('registerLaundry failed', err);
    throw err;
  }
}

export function subscribeToLaundries(onChange) {
  try {
    const database = getFirestoreInstance();
    const q = query(collection(database, 'laundries'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      onChange(items);
    });
  } catch (err) {
    console.error('subscribeToLaundries failed', err);
    // Return a no-op unsubscribe
    return () => {};
  }
}
