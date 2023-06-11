import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { default as db } from '../../../firebase';

/* This Api handles Retrieving Basket of the Active User */

export default async (req, res) => {
    try {
        const allProductSKU = []
        let allProducts = []
        const { email, value } = req.body
        const userCollectionRef = collection(db, "users");
        const usersDocRef = doc(userCollectionRef, email);
        const collectionsRef = collection(usersDocRef, "basket");

        const querySnapshot1 = await getDocs(collectionsRef);

        querySnapshot1.forEach((doc) => {
            try {
                allProductSKU.push(doc.data().productSKU)

            } catch (e) {
                console.log('e', e)
            }

        });

        if (value === 2) {
            
    if(allProductSKU.length){
        const productsRef = collection(db, 'product');
        const searchQuery = query(productsRef, where('SKU', 'in', allProductSKU));
        const querySnapshot2 = await getDocs(searchQuery);
        querySnapshot2.forEach((doc) => {
            try {
                allProducts.push(doc.data())

            } catch (e) {
                console.log('e', e)
            }

        });
    } else {
        allProducts = []
    }
           
        }
        res.status(200).send({ message: 'Retrieved Successfully!', data: value === 1 ? allProductSKU: allProducts })
        // Resolve the Promise with the response data
    } catch (err) {
        console.log('err in retrieveBasket', err)
    }
}