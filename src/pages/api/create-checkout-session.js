import axios from 'axios';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

console.log('stripe', stripe)
export default async (req, res) => {
    try {
        console.log('entering Checkout')
        const { items, email } = req.body

        const transformedItems = items.map(item => ({
            description: item.descriprion,
            quantity: 1,
            price_data: {
                currency: "INR",
                product_data: {
                    name: item.name,
                    images: [item.image[3]],
                },
                unit_amount: item.price * 100,
            }
        }))
        console.log('transformedItems', transformedItems)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            // shipping_options: ['shr_1Mwl9pSJxRLy98VhcVoLmxMk'],
            shipping_address_collection: {
                allowed_countries: ['IN']
            },
            line_items: transformedItems,
            mode: 'payment',
            success_url: `${process.env.HOST}/success`,
            cancel_url: `${process.env.HOST}/checkout`,
            metadata: {
                email,
                images: JSON.stringify(items.map(item => item.image))
            }
        })
        console.log('session',session)
        console.log('sessionurl',session.url)
        res.status(200).json({ url: session.url })
    } catch (err) {
        console.log('err', err)
    }

}