import { collection, deleteDoc, doc, getDocs, updateDoc, increment } from "firebase/firestore";
import { default as db } from '../../../firebase';

export default async (req, res) => {
  try {
    const { session, product } = req.body;
    console.log('session', session)
    console.log('product', product)
    const userBasketRef = collection(db, "users");
    const usersDocRef = doc(userBasketRef, session?.user?.email);
    const basketsRef = collection(usersDocRef, "basket");
    const bucketRef = collection(db, "bucket");
    const querySnapshot1 = await getDocs(basketsRef);
    const allProductSKU = [];
    querySnapshot1.forEach((doc) => {
      try {
        console.log('doc.id', doc.id);
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
    console.log('matchedProduct', matchedProduct);

    if (matchedProduct) {
      const existingDocRef = doc(basketsRef, matchedProduct.id);
      
      if (matchedProduct.quantity > 1) {
        await updateDoc(existingDocRef, {
          quantity: increment(-1)
        });
        
       
        console.log(`SKU ${product.SKU} found, quantity decreased!`);
        res.status(200).send({ message: 'Product quantity decreased successfully!', data: matchedProduct });
      } else {
        await deleteDoc(existingDocRef);

        const docRef = doc(bucketRef, product.SKU);
        await updateDoc(docRef, {
            value: increment(-1)
          });
        console.log(`SKU ${product.SKU} found, document deleted!`);
        res.status(200).send({ message: 'Product deleted from basket successfully!', data: matchedProduct });
      }
    } 
  } catch (err) {
    console.log('err', err)
  }
}