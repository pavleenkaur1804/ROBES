import { doc, deleteDoc } from "firebase/firestore";
import { default as db } from '../../../firebase';

/* This Api handles Removing Address of the User */

export default async (req, res) => {
  try {
       const { session, id } = req.body
       /* Delete USER referenced Product SKU DATA */
       const userDocRef = doc(db, 'users', session.user.email);
       const addressDocRef = doc(userDocRef, 'address', id);
   
       await deleteDoc(addressDocRef);
       console.log('Address deleted successfully');

    res.status(200).send({ message: 'Address Removed Successfully!', })

  } catch (err) {
    console.log('err', err)
  }
}