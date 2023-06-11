import { doc } from "firebase/firestore";
import { default as db } from '../../../firebase';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

/* This Api handles Retrieving Search of the Active User */

export default async (req, res) => {
    try {
        /* ORIGINAL*/
        let { selectedSort, session } = req.body;
        const { q, session2 } = req.body;

        if (session === undefined) {
            session = session2
        }

        let order = 'timestamp';
        let value = 'desc';

        if (req.body) {
            if (selectedSort === 'newToOld') {
                // Timestamp - 'desc'
                order = 'timestamp';
                value = 'desc';

            } else if (selectedSort === 'highToLow') {
                // Based on price - 'desc'
                order = 'price';
                value = 'desc';

            } else if (selectedSort === 'lowToHigh') {
                // Based on price - 'asce'
                order = 'price';
                value = 'asc';

            }
        }

        const all = []

        if (req.body.q == 1) {
            const prodRef = collection(db, "product");
            const querySnapshot = await getDocs(query(prodRef, where("price", "<", 700)));
            querySnapshot.forEach((doc) => {
                const product = doc.data();
                all.push(product)
            });
        } else if (req.body.q == 2) {
            const prodRef = collection(db, "product");
            const querySnapshot = await getDocs(query(prodRef, where("price", ">", 700), where("price", "<", 1200)));
            querySnapshot.forEach((doc) => {
                const product = doc.data();

                all.push(product)
            });
        } else if (req.body.q == 3) {
            const prodRef = collection(db, "product");
            const querySnapshot = await getDocs(query(prodRef, where("price", ">", 1200), where("price", "<", 1500)));
            querySnapshot.forEach((doc) => {
                const product = doc.data();

                all.push(product)
            });
        } else if (req.body.q == 4) {
            const prodRef = collection(db, "product");
            const querySnapshot = await getDocs(query(prodRef, where("price", ">", 1500), where("price", "<", 1800)));
            querySnapshot.forEach((doc) => {
                const product = doc.data();

                all.push(product)
            });
        } else {
            const qu = query(
                collection(db, "product"),
                orderBy(order, value),
            );

            const querySnapshot = await getDocs(qu);

            querySnapshot.forEach((doc) => {
                const product = doc.data();
                if (req.query) {
                    const regex = new RegExp(q, 'i'); // 'i' is for case-insensitive matching
                    if (product.name.match(regex)) {
                        all.push(product);
                    }
                } else if (req.body) {
                    all.push(product)
                }
            });
        }

        let arrayModifiedForBasket;
        if (session) {
            const userCollectionRef = collection(db, "users");
            const usersDocRef = doc(userCollectionRef, session.user.email || session2.user.email);
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
            
            const arrayModifiedForCollection = all.map(item => ({
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

        if (req.query.q !== '') {
            res.send({ docs: arrayModifiedForBasket || all })
        } else if (req.body.selectedSort || req.body.q) {
            res.send({ docs: arrayModifiedForBasket || all })
        } else if (req.body.q === undefined || req.body.q === null) {
            res.send({ docs: [] })
        } else {
            res.send({ docs: [] })
        }

    } catch (err) {
        console.log('err', err)
    }
}