import React from 'react'
import { useSession, getSession } from 'next-auth/react'
import moment from 'moment';
import { default as db } from '../../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import Order from '../components/Order';

function Orders({ orders }) {
    console.log('orders', orders)
    const { data: session } = useSession();
    return (
        <div>
                <main className='max-w-screen-lg mx-auto p-10 font-sans'>
                    <h1 className='text-md text-wendge border-b mb-2 pb-1 border-wendge-800'>
                        Your Orders
                    </h1>
                    {session ?
                        (<h2
                            className='text-xs text-wendge'
                        >{orders ? orders.length : 0} Orders</h2>)
                        : (<h2
                            className='text-xs text-wendge'
                        >Please sign in to see the orders</h2>)}
                    <div className='mt-5 space-y-4'>
                        {orders?.map(({ id, amount, amountShipping, items, timestamp, images }) => (
                            <Order
                                key={id}
                                id={id}
                                amount={amount}
                                amountShipping={amountShipping}
                                items={items}
                                timestamp={timestamp}
                                images={images} />
                        ))}
                    </div>
                </main>

            </div>
    )
}

export default Orders

export async function getServerSideProps(context) {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    // Get the users logged in credentials
    const session = await getSession(context);
    
    if (!session) {
        return {
            props: {}
        }
    }

    const stripeOrders = await getDocs(query(
        collection(db, 'users', session.user.email, 'orders'),
        orderBy('timestamp', 'desc')
    ));
console.log('stripeOrders', stripeOrders)
    const orders = await Promise.all(
        stripeOrders.docs.map(async (order) => ({
            id: order.id,
            amount: order.data().amount,
            amountShipping: order.data().amount_shipping,
            images: order.data().images,
            timestamp: moment(order.data().timestamp.toDate()).unix(),
            items: (
                await stripe.checkout.sessions.listLineItems(
                    order.id, { limit: 100 }
                )
            ).data,
        }))
    )
console.log('orders', orders)
    return {
        props: {
            orders,
        }
    }

}
