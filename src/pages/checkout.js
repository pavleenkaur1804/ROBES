/** This Component is responsible for rendering Carton Items that user (with an active session) has shortlisted for buying */
import React, { useState } from 'react'
import { useRouter } from 'next/router';
import Image from 'next/image'
import axios from 'axios';
import { useSession } from "next-auth/react"
import { loadStripe } from '@stripe/stripe-js'
import useCartonListener from '../components/cartonListener';
import { addItemToBasket, removeItemFromBasket } from "../utility/function"
import SizeSelector from "../components/SizeSelector";

const stripePromise = loadStripe(`${process.env.STRIPE_PUBLIC_KEY}`)

function Checkout() {
    const { data: session } = useSession()
    const [cartonItem, setCartonItem] = useState([]);
    const [cartonTotal, setCartonTotal] = useState(0)
    const [cartonPrice, setCartonPrice] = useState(0)
    useCartonListener(session, setCartonTotal, setCartonItem, setCartonPrice)
    const router = useRouter();

    const handleSizeChange = (item, size) => {
        const updatedCartonItem = cartonItem.map((cartonObject) => {
            if (cartonObject.SKU === item.SKU) {
                return { ...cartonObject, selectedSize: size };
            }
            return cartonObject;
        });
        setCartonItem(updatedCartonItem);
    };


    const createCheckoutSession = async (session) => {
        try {
            /* Creating stripe checkout session through stripe api & redirecting the user 
            to the checkoutSession via the url returned from stripe api */
            await stripePromise;
            const checkoutSession = await axios.post('/api/create-checkout-session', {
                items: cartonItem,
                email: session.user.email,
            })
            router.push(checkoutSession.data.url);
        } catch (err) {
            console.log('err', err)
        }
    }

    return (
        <div className='bg-white font-sans flex justify-center items-center'>{
            (cartonItem.length ?
                <main>
                    <div className='flex flex-col p-5 space-y-10 bg-white'>
                        <h1 className='text-md ml-5 mr-5 text-wendge'>
                            {cartonItem.length === 0 ? "" : "Shopping Cart"}
                        </h1>
                        <span
                            className='text-xs pb-5 ml-6 text-gray-400'
                        >{`${cartonItem.length !== 0 ? cartonItem.length : ""} ${cartonItem.length > 1 ? 'items' : (cartonItem.length !== 0 ? 'item' : "")}`}</span>
                        <div
                            className='flex flex-col space-y-2'
                        >
                            {cartonItem.map((item, i) => (
                                <div className="grid grid-cols-5 ml-6 mr-6">
                                    {/* In Summary: Creating a grid which should span across 5 columns
                               the outer element has a CSS class grid-cols-6,
                               which specifies that the grid should have 6 columns.
                               The first element inside the grid has the class col-span-3, 
                               indicating that it should span across 3 columns. 
                               The second  has col-span-2, indicating it spans 2 columns, and 
                               the third has col-span-1, meaning it spans only 1 column.*/}
                                    <Image src={item.image[3]} height={200} width={200} />
                                    <div className="text-sm col-span-3 mx-5 my-1">
                                        <p
                                            className='mb-2'
                                        >{item.name}</p>
                                        <div>
                                            <SizeSelector
                                                item={item}
                                                productId={item.SKU}
                                                className='text-sm'
                                                sizes={item.sizes}
                                                selectedSize={item.selectedSize}
                                                onChange={(size) => handleSizeChange(item, size)}
                                            />
                                        </div>
                                        <p
                                            className='mt-1'
                                        >{`$ ${item.price}`}</p>
                                    </div>
                                    <div className="text-sm flex flex-col space-y-2 mx-auto justify-self-end">
                                        <div

                                        > {<div className='flex flex-row space-x-2 ml-7'>
                                            <button
                                                onClick={() => removeItemFromBasket(item, session.user.email)}
                                                className='h-6 w-5 cursor-pointer rounded-md bg-wendge'><span className='text-white'>-</span> </button>
                                            <button
                                                className='h-6 w-5 cursor-pointer bg-white'
                                            >{item.quantity}</button>

                                            <button
                                                onClick={() =>
                                                    addItemToBasket(item, item.selectedSize, session)
                                                }
                                                className='h-6 w-5 cursor-pointer rounded-md bg-wendge'> <span className='text-white'>+</span></button>

                                        </div>}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                    <div className='text-sm flex flex-col space-y-5 justify-end items-center bg-white p-10 shadow-md'>
                        {cartonItem.length > 0 && (
                            <>
                                <h2 className='whitespace-nowrap'>
                                    Subtotal
                                    <span className='font-bold ml-2'>
                                        {`₹ ${cartonPrice}`}
                                    </span>
                                </h2>
                                <button
                                    role="link"
                                    disabled={!session}
                                    onClick={() => createCheckoutSession(session, cartonItem)}
                                    className={`button mt-0 rounded-full ${!session && 'from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed'}`}>
                                    {!session ? "Sign in to checkout" : "Proceed to checkout"}
                                </button>
                            </>
                        )}
                    </div>
                </main> : <div
                    className='flex flex-col justify-center items-center mt-10 mb-10 text-gray-500'
                >
                    <h1>Your Carton is Empty</h1>
                    <p
                        className='text-xs mt-6'
                    >Add The Items You Want To Buy!</p>
                    <Image
                        src="https://firebasestorage.googleapis.com/v0/b/project-1234-1a50f.appspot.com/o/Screenshot%202023-06-07%20at%203.34.00%20PM.png?alt=media&token=51a169e9-a36f-4e46-afc4-33864fb7dd24&_gl=1*102bvb2*_ga*MTM0MDY1NzUzOS4xNjgxNTU4Mjky*_ga_CW55HF8NVT*MTY4NjEzMjI3NS4zOC4xLjE2ODYxMzIzMDcuMC4wLjA."
                        height={300}
                        width={300}
                        alt='EMPTY ICON'
                    />
                </div>)
        }

        </div>
    )
}

export default Checkout
