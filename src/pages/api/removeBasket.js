import { collection, deleteDoc, doc, getDocs, updateDoc, increment } from "firebase/firestore";
import { default as db } from '../../../firebase';

/* This Api handles Removing/Increasing Quantity of the Item */

export default async (req, res) => {
  try {
    const { email, product } = req.body;
    const userBasketRef = collection(db, "users");
    const usersDocRef = doc(userBasketRef, email);
    const basketsRef = collection(usersDocRef, "basket");
    const bucketRef = collection(db, "bucket");
    const querySnapshot1 = await getDocs(basketsRef);
    const allProductSKU = [];
    querySnapshot1.forEach((doc) => {
      try {
        const document = {
          SKU: doc.data().productSKU,
          quantity: doc.data().quantity,
          id: doc.id
        };
        allProductSKU.push(document);
      } catch (e) {
        console.log('e', e);
      }
    });

    const matchedProduct = allProductSKU.find((item) => item.SKU === product.SKU);

    if (matchedProduct) {
      const existingDocRef = doc(basketsRef, matchedProduct.id);
      
      if (matchedProduct.quantity > 1) {
        await updateDoc(existingDocRef, {
          quantity: increment(-1)
        });
        
       
        console.log(`SKU ${product.SKU} found, quantity decreased!`);
        res.status(200).send({ message: 'Product quantity decreased successfully!', data: matchedProduct });
      } else {
        try {
          const docRef = doc(bucketRef, matchedProduct.SKU);
          await updateDoc(docRef, {
            value: increment(-1)
          });

          await deleteDoc(existingDocRef);
        } catch (err) {
          console.log('err', err)
        }
        console.log(`SKU ${product.SKU} found, document deleted!`);
        res.status(200).send({ message: 'Product deleted from basket successfully!', data: matchedProduct });
      }
    } 
  } catch (err) {
    console.log('err', err)
  }
}