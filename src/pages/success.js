import React from 'react';
import { useRouter } from 'next/router';

function success() {
    const router = useRouter()
    return (
        <div className='bg-white h-screen font-sans justify-center flex items-start'>
            <main className='max-w-screen-lg mx-auto'>
               <div className='flex flex-col p-10 bg-white'>
               <div className='flex items-center space-x-2 mb-5'>
                  <h1 className='text-lg text-wendge font-semibold'>
                    Thank you, your order has been confirmed!
                  </h1>
                </div>
                <p
                className='text-xs text-wendge'
                >
                 Thank You for shopping with us, We'll send a confirmation once your 
                 item has shipped. If you would like to check the status of 
                 order(s) please press the link below    
                </p>
                <button 
                onClick={()=> router.push('/orders')}
                className='button w-100 mt-8 rounded-full'>Go to my orders</button>
               </div>
            </main>
        </div>
    )
}

export default success
