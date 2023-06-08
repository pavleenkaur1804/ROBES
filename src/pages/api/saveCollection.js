import { collection, deleteDoc, doc, addDoc, getDocs, query, where, increment, updateDoc } from "firebase/firestore";
import { default as db } from '../../../firebase';

export default async (req, res) => {
  try {
    const { session, product } = req.body
    /* QUERING USER referenced Product SKU DATA
    Check if already present */

    const userCollectionRef = collection(db, "users");
    const usersDocRef = doc(userCollectionRef, session?.user?.email);
    const collectionsRef = collection(usersDocRef, "collection");

    const querySnapshot1 = await getDocs(collectionsRef);
    const allProductSKU = []
    querySnapshot1.forEach((doc) => {
      try {
        allProductSKU.push(doc.data().productSKU)
      } catch (e) {
        console.log('e', e)
      }

    });

    /* QUERING USER referenced Product SKU DATA */
    function binarySearch(arr, target) {
      let low = 0;
      let high = arr.length - 1;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const sku = arr[mid];

        if (sku === target) {
          return mid; // SKU found at index mid
        } else if (sku < target) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      return -1; // SKU not found
    }

    // Example usage

    // Sort the array before performing binary search
    allProductSKU.sort();
    const bucketRef = collection(db, "bucket");
    const docRef = doc(bucketRef, product.SKU);
    const index = binarySearch(allProductSKU, product.SKU);
    
    if (index !== -1) {
      console.log(`SKU ${product.SKU} found at index ${index}`);
      await updateDoc(docRef, {
        value: increment(-1)
      });
      /* Delete USER referenced Product SKU DATA */
      const usersCollectionRef = collection(db, "users");
      const userDocRef = doc(usersCollectionRef, session?.user?.email);
      const collectionRef = collection(userDocRef, "collection");

      // Assuming productSKU is the product ID you want to delete

      getDocs(query(collectionRef, where("productSKU", "==", product.SKU)))
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            deleteDoc(doc.ref)
              .then(() => {
                console.log("Document successfully deleted.");
              })
              .catch((error) => {
                console.error("Error deleting document: ", error);
              });
          } else {
            console.log("No matching documents found.");
          }
        })
        .catch((error) => {
          console.error("Error getting documents: ", error);
        });

      /* Delete USER referenced Product SKU DATA */

      res.status(200).send({ message: 'Product Removed Successfully!', data: { product: false } })
    } else {
      console.log(`SKU ${product.SKU} not found`);
      /* Add USER referenced Product SKU DATA */
      const usersCollectionRef = collection(db, "users");
      const userDocRef = doc(usersCollectionRef, session?.user?.email);
      const collectionRef = collection(userDocRef, "collection");

      const data = {
        // Specify the data(SKU & the required size by the user) for the new document
        productSKU: product.SKU,
      };

      addDoc(collectionRef, data)
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });

      try {
        await updateDoc(docRef, {
          value: increment(1)
        });
        console.log("Update successful");
      } catch (error) {
        console.error("Error updating document:", error);
      }

      /* Add USER referenced Product SKU DATA */
      res.status(200).send({ message: 'Product Saved Successfully!', data: { product: true } })
    }

  } catch (err) {
    console.log('err in saveCollection', err)
  }
}