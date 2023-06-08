import { collection, deleteDoc, doc, addDoc, getDocs, query, where, updateDoc, increment } from "firebase/firestore";
import { default as db } from '../../../firebase';

export default async (req, res) => {
  try {
    const { session } = req.body
    const allAddress = []
    const userAddressRef = collection(db, "users");
    const usersDocRef = doc(userAddressRef, session?.user?.email);
    const addressRef = collection(usersDocRef, "address");

    const querySnapshot1 = await getDocs(addressRef);
    querySnapshot1.forEach((doc) => {
      try {
        const data = {
            id: doc.id,
            street: doc.data().street,
            city: doc.data().city,
            state: doc.data().state,
            landmark: doc.data().landmark,
            pincode: doc.data().pincode,
            default: doc.data().default,
        }
        allAddress.push(data)
      } catch (e) {
        console.log('e', e)
      }

    });

    res.status(200).send({ message: 'Address Fetched Successfully!', data: allAddress })

  } catch (err) {
    console.log('err', err)
  }
}