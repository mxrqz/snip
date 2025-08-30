import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "../../../../momentum-9014e-firebase-adminsdk-fbsvc-67aabd46ec.json" with { type: "json" };
import type { ServiceAccount } from "firebase-admin/app";

const firebaseAdminConfig = {
  credential: cert(serviceAccount as ServiceAccount),
};

const app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];

const adminAuth = getAuth(app);
const db = getFirestore();

export { adminAuth, db }