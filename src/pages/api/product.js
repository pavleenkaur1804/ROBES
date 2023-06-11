import axios, { all } from 'axios';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { default as db } from '../../../firebase';
import { collection, query, where, getDocs, doc } from "firebase/firestore";

export default async (req, res) => {
    try {
        /* ORIGINAL*/
        const { q, session } = req.body;

        const findProduct = []
        const prodRef = collection(db, "product");
        const querySnapshot = await getDocs(query(prodRef, where("SKU", "==", q)));
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            findProduct.push(product)
        });

        let arrayModifiedForBasket

        if (session) {
            const userCollectionRef = collection(db, "users");
            const usersDocRef = doc(userCollectionRef, session.user.email);
            // Get a reference to the Firestore collection you want to monitor
            const collectionRef = collection(usersDocRef, 'collection');
            const querySnapshotCollection = await getDocs(collectionRef);
            const basketRef = collection(usersDocRef, 'basket');
            const querySnapshotBasket = await getDocs(basketRef);
            const allCollection = []
            const allBasket = []
            querySnapshotCollection.forEach((doc) => {
                try {
                    allCollection.push(doc.data())
                } catch (e) {
                    console.log('e', e)
                }

            });

            querySnapshotBasket.forEach((doc) => {
                try {
                    allBasket.push(doc.data())
                } catch (e) {
                    console.log('e', e)
                }

            });
            const arrayModifiedForCollection = findProduct.map(item => ({
                ...item,
                collection: allCollection.some(collectionItem => collectionItem.productSKU === item.SKU)
            }));

            arrayModifiedForBasket = arrayModifiedForCollection.map(obj => {
                const matchingItem = allBasket.find(item => item.productSKU === obj.SKU);
                const quantity = matchingItem ? matchingItem.quantity : 0;

                return {
                    ...obj,
                    quantity: quantity
                };
            });
        }

        console.log('findProduct', findProduct)
        console.log('arrayModifiedForBasket', arrayModifiedForBasket)

        if (req.query.q !== '') {
            res.send({ docs: session ? arrayModifiedForBasket : findProduct })
        } else {
            res.send({ docs: [] })
        }

    } catch (err) {
        console.log('err', err)
    }
}