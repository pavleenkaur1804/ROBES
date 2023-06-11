import { collection, doc, addDoc, getDocs } from "firebase/firestore";
import { default as db } from '../../../firebase';

/* This Api handles Saves Address of the Active User */

export default async (req, res) => {
  try {
    const { session, address } = req.body
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


  } catch (err) {
    console.log('err', err)
  }
}