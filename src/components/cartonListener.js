// cartonListener.js

import { useEffect } from 'react';
import { collection, doc, onSnapshot } from "firebase/firestore";
import { default as db } from '../../firebase';

const useCartonListener = (session, setCartonTotal, setCartonItem, setCartonPrice) => {
    useEffect(() => {
        let unsubscribe;
        let unsubscribeProducts;
        const setupListener = async() => {
            if (session) {
                const productRef = collection(db, "product");
                const products = []
                unsubscribeProducts = onSnapshot(productRef, (snapshot) => {
                    snapshot.docs.map((doc) => {
                        doc.data()
                        products.push(doc.data())
                    }
                    );
                });
                const userCollectionRef = collection(db, 'users');
                const usersDocRef = doc(userCollectionRef, session.user.email);
                const collectionRef = collection(usersDocRef, 'basket');

                unsubscribe = onSnapshot(collectionRef, (snapshot) => {
                    const itemCount = snapshot.size;
                    setCartonTotal(itemCount);
                    if (setCartonItem && setCartonPrice) {
                        const items = []
                        snapshot.docs.map((doc) => {
                            items.push(doc.data())
                        });
                        const filteredItems = products
                            .filter((product) => items.some((item) => item.productSKU === product.SKU))
                            .map((product) => {
                                const item = items.find((item) => item.productSKU === product.SKU);
                                return {
                                    ...product,
                                    quantity: item.quantity,
                                    selectedSize: item.selectedSize,
                                 
                                };
                            });

                        setCartonItem(filteredItems);
                        const totalPrice = filteredItems.reduce((total, item) => total + item.price * item.quantity, 0)
                        setCartonPrice(totalPrice)
                    }
                });
            }
            
        };

        setupListener();

        return () => {
            if (unsubscribe) {
                unsubscribe();
                unsubscribeProducts()
            }
        };
    }, [session, setCartonTotal]);
};

export default useCartonListener;
