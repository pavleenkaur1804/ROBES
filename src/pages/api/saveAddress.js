import { collection, deleteDoc, doc, addDoc, getDocs, query, where, updateDoc, increment } from "firebase/firestore";
import { default as db } from '../../../firebase';

export default async (req, res) => {
  try {
    const { session, address } = req.body
    console.log('address', address)
    const allAddress = []
    const userAddressRef = collection(db, "users");
    const usersDocRef = doc(userAddressRef, session?.user?.email);
    const addressRef = collection(usersDocRef, "address");

    const querySnapshot1 = await getDocs(addressRef);
    querySnapshot1.forEach((doc) => {
      try {
        allAddress.push(doc.data())
      } catch (e) {
        console.log('e', e)
      }

    });

    // if(allAddress.length > 4){
    //    res.status(400).send({message: 'Address Limit Exceeded!'})
    // }

    /* Add USER referenced Address DATA */
    // const usersCollectionRef = collection(db, "users");
    // const userDocRef = doc(usersCollectionRef, session?.user?.email);
    // const collectionRef = collection(userDocRef, "address");

    const data = {
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode, 
      landmark: address.landmark,
      default: (!allAddress.length ? true : false),
      timestamp: Date.now()
    };

    addDoc(addressRef, data)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
    /* Add USER referenced Address DATA */

  } catch (err) {
    console.log('err', err)
  }
}