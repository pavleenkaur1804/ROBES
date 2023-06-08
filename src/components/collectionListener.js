// collectionListener.js

import { useEffect } from 'react';
import { collection, doc, onSnapshot } from "firebase/firestore";
import { default as db } from '../../firebase';

const useCollectionListener = (session, setCollectionTotal) => {
    useEffect(() => {
        let unsubscribe;

        const setupListener = async () => {
            if (session) {
                const userCollectionRef = collection(db, 'users');
                const usersDocRef = doc(userCollectionRef, session.user.email);
                const collectionRef = collection(usersDocRef, 'collection');

                unsubscribe = onSnapshot(collectionRef, (snapshot) => {
                    const itemCount = snapshot.size;
                    setCollectionTotal(itemCount);
                });
            }
        };

        setupListener();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [session, setCollectionTotal]);
};

export default useCollectionListener;
