import { collection, deleteDoc, doc, addDoc, getDocs, query, where, setDoc, updateDoc, increment } from "firebase/firestore";
import { default as db } from '../../../firebase';

export default async (req, res) => {
  try {
    let { session, productId, selectedSize, sizes } = req.body
    /* QUERING USER referenced Product SKU DATA
    Check if already present */
    console.log('session inside API updateSize', session)
    console.log('selected in API updateSize', selectedSize)
    if(selectedSize === undefined){
      selectedSize = sizes[0]
    }
    const userBasketRef = collection(db, "users");
    const usersDocRef = doc(userBasketRef, session?.user?.email);
    const basketsRef = collection(usersDocRef, "basket");
    const querySnapshot1 = await getDocs(basketsRef);
    const allProductSKU = []
    querySnapshot1.forEach((doc) => {
      try {
        console.log('doc.id inside API updateSize', doc.id)
        const document ={
            SKU: doc.data().productSKU,
            id: doc.id
        }
        console.log('document', document)
        allProductSKU.push(document)
      } catch (e) {
        console.log('e', e)
      }

    });
    const matchedProduct = allProductSKU.find((item) => item.SKU === productId);
    console.log('matchedProduct', matchedProduct)

    if (matchedProduct) {
      const existingDocRef = doc(basketsRef, matchedProduct.id);
      await updateDoc(existingDocRef, {
        selectedSize: selectedSize
      });
      res.status(200).send({ message: 'Size updated successfully!' });
    } 
  } catch (err) {
    console.log('err in update Size', err)
  }
}