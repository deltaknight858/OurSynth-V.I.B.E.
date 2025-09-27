
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  User
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const googleProvider = new GoogleAuthProvider();

export const authService = {
  async loginWithEmail(email: string, password: string, rememberMe: boolean) {
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  },

  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  },

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  async logout() {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  getCurrentUser(): User | null {
    return auth.currentUser;
  }
};
