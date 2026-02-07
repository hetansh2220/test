import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import type { UserProfile } from "@/types/user";
import type { Transaction } from "@/types/transaction";
import type { Budget } from "@/types/budget";
import type { Bill } from "@/types/bill";
import type { Challenge, CheckIn } from "@/types/challenge";

// ─── User Profile ───────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() } as UserProfile;
}

export async function createUserProfile(uid: string, data: Omit<UserProfile, "uid" | "createdAt" | "updatedAt">) {
  await setDoc(doc(db, "users", uid), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

// ─── Transactions ───────────────────────────────────────────────

export async function getTransactions(uid: string, month: string): Promise<Transaction[]> {
  const [year, mo] = month.split("-").map(Number);
  const startOfMonth = new Date(year, mo - 1, 1);
  const endOfMonth = new Date(year, mo, 0, 23, 59, 59);

  const q = query(
    collection(db, "users", uid, "transactions"),
    where("date", ">=", Timestamp.fromDate(startOfMonth)),
    where("date", "<=", Timestamp.fromDate(endOfMonth)),
    orderBy("date", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Transaction);
}

export async function addTransaction(uid: string, data: Omit<Transaction, "id" | "createdAt">) {
  // Strip undefined values — Firestore rejects them
  const cleanData: Record<string, any> = { createdAt: Timestamp.now() };
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) cleanData[key] = value;
  }
  return addDoc(collection(db, "users", uid, "transactions"), cleanData);
}

export async function deleteTransaction(uid: string, transactionId: string) {
  await deleteDoc(doc(db, "users", uid, "transactions", transactionId));
}

// ─── Budget ─────────────────────────────────────────────────────

export async function getBudget(uid: string, month: string): Promise<Budget | null> {
  const snap = await getDoc(doc(db, "users", uid, "budgets", month));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Budget;
}

export async function setBudget(uid: string, month: string, data: Omit<Budget, "id" | "createdAt" | "updatedAt">) {
  await setDoc(doc(db, "users", uid, "budgets", month), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

export async function updateBudget(uid: string, month: string, data: Partial<Budget>) {
  await updateDoc(doc(db, "users", uid, "budgets", month), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

// ─── Bills ──────────────────────────────────────────────────────

export async function getBills(uid: string): Promise<Bill[]> {
  const q = query(
    collection(db, "users", uid, "bills"),
    orderBy("dueDate", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Bill);
}

export async function addBill(uid: string, data: Omit<Bill, "id" | "createdAt">) {
  const cleanData: Record<string, any> = { createdAt: Timestamp.now() };
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) cleanData[key] = value;
  }
  return addDoc(collection(db, "users", uid, "bills"), cleanData);
}

export async function updateBill(uid: string, billId: string, data: Partial<Bill>) {
  const cleanData: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) cleanData[key] = value;
  }
  await updateDoc(doc(db, "users", uid, "bills", billId), cleanData);
}

export async function deleteBill(uid: string, billId: string) {
  await deleteDoc(doc(db, "users", uid, "bills", billId));
}

// ─── Challenges ─────────────────────────────────────────────────

export async function getChallenges(uid: string): Promise<Challenge[]> {
  const q = query(
    collection(db, "users", uid, "challenges"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Challenge);
}

export async function addChallenge(uid: string, data: Omit<Challenge, "id" | "createdAt">) {
  return addDoc(collection(db, "users", uid, "challenges"), {
    ...data,
    createdAt: Timestamp.now(),
  });
}

export async function updateChallenge(uid: string, challengeId: string, data: Partial<Challenge>) {
  const cleanData: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) cleanData[key] = value;
  }
  await updateDoc(doc(db, "users", uid, "challenges", challengeId), cleanData);
}

export async function addCheckIn(uid: string, challengeId: string, checkIn: CheckIn, newSavedAmount: number) {
  const challengeRef = doc(db, "users", uid, "challenges", challengeId);
  const snap = await getDoc(challengeRef);
  if (!snap.exists()) return;

  const existing = snap.data();
  const checkIns = [...(existing.checkIns || []), checkIn];

  await updateDoc(challengeRef, {
    checkIns,
    savedAmount: newSavedAmount,
    status: newSavedAmount >= existing.targetAmount ? "completed" : "active",
  });
}
