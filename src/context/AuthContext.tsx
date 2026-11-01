import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<boolean>;
  signInWithEmail: (email: string, pass: string) => Promise<boolean>;
  signUpWithEmail: (email: string, pass: string, name: string, phone?: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  signOutUser: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<boolean>;
  clearError: () => void;
  // Demo mode helpers for instant testing
  loginAsDemoCustomer: () => void;
  loginAsDemoAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BOOTSTRAP_ADMIN_EMAIL = 'somasina1999@gmail.com';
const LOCAL_PROFILE_KEY = 'scentcafe_cached_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_PROFILE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearError = () => setAuthError(null);

  // Sync profile to local storage for instant availability
  const setAndCacheProfile = (profile: UserProfile | null) => {
    setUserProfile(profile);
    if (profile) {
      try {
        localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.removeItem(LOCAL_PROFILE_KEY);
    }
  };

  // Check admin rights
  const evaluateAdminStatus = async (user: User | null, profileRole?: string) => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    if (user.email === BOOTSTRAP_ADMIN_EMAIL || profileRole === 'admin') {
      setIsAdmin(true);
      return;
    }

    try {
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (adminDoc.exists()) {
        setIsAdmin(true);
        return;
      }
    } catch {
      // In case admin collection check fails
    }
    setIsAdmin(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setCurrentUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const data = userSnap.data() as UserProfile;
            setAndCacheProfile(data);
            evaluateAdminStatus(firebaseUser, data.role);
          } else {
            // New user profile creation
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'ScentCafe Customer',
              phoneNumber: firebaseUser.phoneNumber || '',
              role: firebaseUser.email === BOOTSTRAP_ADMIN_EMAIL ? 'admin' : 'customer',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            setAndCacheProfile(newProfile);
            evaluateAdminStatus(firebaseUser, newProfile.role);
            await setDoc(userDocRef, newProfile).catch(() => {});
          }
        } catch {
          // If Firestore is still initializing or offline, build from Auth token
          const fallbackProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Valued Customer',
            role: firebaseUser.email === BOOTSTRAP_ADMIN_EMAIL ? 'admin' : 'customer',
          };
          setAndCacheProfile(fallbackProfile);
          evaluateAdminStatus(firebaseUser, fallbackProfile.role);
        }
      } else {
        // If not in demo mode, clear
        if (!userProfile?.uid.startsWith('demo_')) {
          setAndCacheProfile(null);
          setIsAdmin(false);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google Sign-In (ProvisionFirebase supports Google Sign-In with Popup)
  const signInWithGoogle = async (): Promise<boolean> => {
    setLoading(true);
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const profile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'ScentCafe Customer',
        role: user.email === BOOTSTRAP_ADMIN_EMAIL ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setAndCacheProfile(profile);
      evaluateAdminStatus(user, profile.role);

      await setDoc(doc(db, 'users', user.uid), profile, { merge: true }).catch(() => {});
      setLoading(false);
      return true;
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      setAuthError(err.message || 'Failed to sign in with Google');
      setLoading(false);
      return false;
    }
  };

  // Email and Password Sign In
  const signInWithEmail = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const user = res.user;
      evaluateAdminStatus(user);
      setLoading(false);
      return true;
    } catch (err: any) {
      console.warn('Sign in email error:', err);
      if (err.code === 'auth/operation-not-allowed') {
        setAuthError(
          'Email/Password provider is not yet enabled in your Firebase console. Please use Google Sign-In or quick Demo Mode, or enable Email/Password under Firebase Console > Authentication > Sign-in method.'
        );
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setAuthError('No account found with this email or incorrect password.');
      } else {
        setAuthError(err.message || 'Authentication failed. Please verify credentials.');
      }
      setLoading(false);
      return false;
    }
  };

  // Email and Password Registration
  const signUpWithEmail = async (
    email: string,
    pass: string,
    name: string,
    phone?: string
  ): Promise<boolean> => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const user = res.user;

      await updateProfile(user, { displayName: name });

      const profile: UserProfile = {
        uid: user.uid,
        email: user.email || email.trim(),
        displayName: name,
        phoneNumber: phone || '',
        role: user.email === BOOTSTRAP_ADMIN_EMAIL ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setAndCacheProfile(profile);
      evaluateAdminStatus(user, profile.role);
      await setDoc(doc(db, 'users', user.uid), profile).catch(() => {});

      setLoading(false);
      return true;
    } catch (err: any) {
      console.warn('Sign up error:', err);
      if (err.code === 'auth/operation-not-allowed') {
        setAuthError(
          'Email/Password sign-up requires activating the Email/Password provider in the Firebase Console (Authentication > Sign-in method). In the meantime, you can sign in directly with Google or test via instant Demo Mode.'
        );
      } else if (err.code === 'auth/email-already-in-use') {
        setAuthError('An account with this email address already exists. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setAuthError('Password should be at least 6 characters.');
      } else {
        setAuthError(err.message || 'Registration failed. Please check your inputs.');
      }
      setLoading(false);
      return false;
    }
  };

  // Password reset
  const resetPassword = async (email: string): Promise<boolean> => {
    setLoading(true);
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setLoading(false);
      return true;
    } catch (err: any) {
      console.warn('Password reset error:', err);
      if (err.code === 'auth/user-not-found') {
        setAuthError('No registered account was found with that email address.');
      } else {
        setAuthError(err.message || 'Could not send password reset email.');
      }
      setLoading(false);
      return false;
    }
  };

  // Sign out
  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
    setAndCacheProfile(null);
    setCurrentUser(null);
    setIsAdmin(false);
  };

  // Update profile
  const updateProfileData = async (data: Partial<UserProfile>): Promise<boolean> => {
    if (!userProfile) return false;
    const updated: UserProfile = {
      ...userProfile,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    setAndCacheProfile(updated);

    if (currentUser) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          ...data,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Firestore profile update notice:', err);
      }
    }
    return true;
  };

  // Instant Demo Profiles for friction-free evaluation
  const loginAsDemoCustomer = () => {
    const demo: UserProfile = {
      uid: 'demo_customer_thabo',
      email: 'thabo.molefe@example.co.za',
      displayName: 'Thabo Molefe',
      phoneNumber: '082 555 4921',
      role: 'customer',
      city: 'Johannesburg',
      province: 'Gauteng',
      address: '24 Jan Smuts Avenue, Rosebank',
      createdAt: new Date().toISOString(),
    };
    setAndCacheProfile(demo);
    setIsAdmin(false);
    clearError();
  };

  const loginAsDemoAdmin = () => {
    const demoAdmin: UserProfile = {
      uid: 'demo_admin_scentcafe',
      email: BOOTSTRAP_ADMIN_EMAIL,
      displayName: 'ScentCafe Administrator',
      phoneNumber: '011 555 0192',
      role: 'admin',
      city: 'Pretoria',
      province: 'Gauteng',
      createdAt: new Date().toISOString(),
    };
    setAndCacheProfile(demoAdmin);
    setIsAdmin(true);
    clearError();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        loading,
        authError,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        signOutUser,
        updateProfileData,
        clearError,
        loginAsDemoCustomer,
        loginAsDemoAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
