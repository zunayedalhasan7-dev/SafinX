import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  isAdmin: boolean;
  isSeller: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isSeller: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setUser(firebaseUser);
        
        if (firebaseUser) {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          const isAdminEmail = firebaseUser.email === 'xpzunayed@gmail.com';
          const targetRole = isAdminEmail ? 'admin' : 'buyer';

          if (userDoc.exists()) {
            const data = userDoc.data();
            // Sync role if it's the admin email but role isn't admin, 
            // OR if it's NOT the admin email but role IS admin (security fallback)
            if ((isAdminEmail && data.role !== 'admin') || (!isAdminEmail && data.role === 'admin')) {
              await setDoc(userDocRef, { ...data, role: targetRole }, { merge: true });
              setProfile({ ...data, role: targetRole });
            } else {
              setProfile(data);
            }
          } else {
            // Create default profile for new user
            const newProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || 'User',
              photoURL: firebaseUser.photoURL || '',
              role: targetRole,
              createdAt: serverTimestamp(),
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          }
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    loading,
    isAdmin: user?.email === 'xpzunayed@gmail.com',
    isSeller: user?.email === 'xpzunayed@gmail.com', // Only the specific admin email can act as seller/admin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
