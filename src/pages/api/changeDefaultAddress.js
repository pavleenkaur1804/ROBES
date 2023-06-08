import { collection, doc, updateDoc, getDocs } from "firebase/firestore";
import { default as db } from '../../../firebase';

export default async (req, res) => {
  try {
    const { session, defaultValue } = req.body
    const userAddressRef = collection(db, "users");
    const usersDocRef = doc(userAddressRef, session?.user?.email);
    const addressRef = collection(usersDocRef, "address");
    const querySnapshot1 = await getDocs(addressRef);
    querySnapshot1.forEach(async(element) => {
      try {
        const existingDocRef = doc(addressRef, element.id);
        if(element.id === defaultValue) {
          await updateDoc(existingDocRef, {
            default: true
          });
        } else {
          await updateDoc(existingDocRef, {
            default: false
          });
        }
      } catch (e) {
        console.log('e', e)
      }

    });

    res.status(200).send({ message: 'Updating Successfully!' })

  } catch (err) {
    console.log('err', err)
  }
}