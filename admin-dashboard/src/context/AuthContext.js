"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Check for admin claim
                const idTokenResult = await user.getIdTokenResult();
                if (idTokenResult.claims.role === 'ADMIN') {
                    setUser(user);
                    const userRef = ref(db, `users/${user.uid}`);
                    onValue(userRef, (snapshot) => {
                        setUserData(snapshot.val());
                        setLoading(false);
                    });
                } else {
                    // Not an admin
                    setUser(null);
                    setUserData(null);
                    setLoading(false);
                }
            } else {
                setUser(null);
                setUserData(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, userData, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
