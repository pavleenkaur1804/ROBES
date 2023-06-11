import { buffer } from 'micro';
import * as admin from 'firebase-admin';
import removeBasket from './removeBasket'
import { collection, doc, getDocs } from "firebase/firestore";
import { default as db } from '../../../firebase';

// Secure a connection to firebase from the backend
const serviceAccount = require('../../../permissions.json')

const app = !admin.apps.length ? admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
}) : admin.app();

// Establish connection to stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

const fulfillOrder = async (session, items, res) => {
    console.log('session.total_details.amount_shipping', session.total_details.amount_shipping)
    console.log('session.amount_total', session.amount_total)
    console.log('session.metadata.images', session.metadata.images)
    console.log('admin.firestore.FieldValue.serverTimestamp()', admin.firestore.FieldValue.serverTimestamp())
    console.log('items', items)

    try {
        for (let i = 0; i < items.length; i++) {
            console.log('inside For')
            await removeBasket({
                body: {
                    email: session.metadata.email,
                    product: items[i]
                }
            }, res);
        }
    } catch (error) {
        console.log('error in for loop remove basket', error)
    }
   
   
    return app
        .firestore()
        .collection('users')
        .doc(session.metadata.email)
        .collection('orders').doc(session.id).set({
            amount: session.amount_total / 100,
            amount_shipping: session.total_details.amount_shipping / 100,
            images: JSON.parse(session.metadata.images),
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            console.log(`SUCCESS: Order ${session.id} had been added to the DB`)
        })
        .catch((err)=> console.log('err', err))
}

export default async (req, res) => {
    if (req.method === 'POST') {
        const requestBuffer = await buffer(req);
        const payload = requestBuffer.toString();
        const sig = req.headers["stripe-signature"];

        let event;

        //  Verify that the vent posted came from stripe
        try {
            event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
        } catch (err) {
            console.log('ERROR', err.message);
            return res.status(400).send(`Webhook error: ${err.message}`)
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const items = []
            const userCollectionRef = collection(db, "users");
            const usersDocRef = doc(userCollectionRef, session.metadata.email);
            const collectionsRef = collection(usersDocRef, "basket");
    
            const querySnapshot1 = await getDocs(collectionsRef);
    
            querySnapshot1.forEach((doc) => {
                try {
                    const document = {
                        SKU: doc.data().productSKU,
                        ...doc.data()
                    }
                    items.push(document)
    
                } catch (e) {
                    console.log('e', e)
                }
    
            });
         
            //   fulfill the order ...
            console.log('response', items)
            return fulfillOrder(session, items, res)
                .then(() => res.status(200))
                .catch((err) => res.status(400).send(`Webhook Error: ${err.message}`))
        }
    }
}

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true
    }
}