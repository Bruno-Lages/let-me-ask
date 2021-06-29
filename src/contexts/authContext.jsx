/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import { auth, firebase } from '../config/firebase';

export const authContext = createContext({});
export function AuthContext(props) {
    const [user, setUser] = useState({});

    useEffect(() => {
    // eslint-disable-next-line no-shadow
        auth.onAuthStateChanged((user) => {
            if (user) {
                const { displayName, photoURL, uid } = user;

                if (!displayName || !photoURL) {
                    throw new Error('Missing informations from the Google account');
                }

                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL,
                });
            }
        });
    }, []);

    async function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);

        if (result.user) {
            const { displayName, photoURL, uid } = result.user;

            if (!displayName || !photoURL) {
                throw new Error('Missing informations from the Google account');
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL,
            });
        }
    }

    async function signOutWithGoogle() {
        await auth.signOut();
        setUser('');
    }

    return (
        <authContext.Provider value={{ user, signInWithGoogle, signOutWithGoogle }}>
            { /* eslint-disable-next-line react/destructuring-assignment */}
            {props.children}
        </authContext.Provider>
    );
}
