import { collection, deleteDoc, doc, addDoc, getDocs, query, where, setDoc, updateDoc, increment } from "firebase/firestore";
import { default as db } from '../../../firebase';

export default async (req, res) => {
  try {
    const { session, product, selectedSize } = req.body
    /* QUERING USER referenced Product SKU DATA
    Check if already present */
console.log('session', session)
    const userBasketRef = collection(db, "users");
    const usersDocRef = doc(userBasketRef, session?.user?.email);
    const basketsRef = collection(usersDocRef, "basket");
    const bucketRef = collection(db, "bucket");
    const docRef = doc(bucketRef, product.SKU);
    const querySnapshot1 = await getDocs(basketsRef);
    const allProductSKU = []
    querySnapshot1.forEach((doc) => {
      try {
        console.log('doc.id', doc.id)
        const document ={
            SKU: doc.data().productSKU,
            id: doc.id
        }
        allProductSKU.push(document)
      } catch (e) {
        console.log('e', e)
      }

    });
    const matchedProduct = allProductSKU.find((item) => item.SKU === product.SKU);
    console.log('matchedProduct', matchedProduct)

    if (matchedProduct) {
      const existingDocRef = doc(basketsRef, matchedProduct.id);
      await updateDoc(existingDocRef, {
        quantity: increment(1)
      });

      console.log(`SKU ${product.SKU} found, quantity increased!`);
      res.status(200).send({ message: 'Product quantity increased successfully!', data: matchedProduct });
    } else {
      console.log(`SKU ${product.SKU} not found, adding new product`);

      const basketRef = collection(usersDocRef, "basket");
      const data = {
        productSKU: product.SKU,
        selectedSize: product.size || product.sizes[0],
        quantity: 1
      };

      await addDoc(basketRef, data);
      
      await updateDoc(docRef, {
       value: increment(1)
      });

      console.log('data', data);
      res.status(200).send({ message: 'Product saved to basket Successfully!', data })
    }

  } catch (err) {
    console.log('err', err)
  }
}