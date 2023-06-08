import React from 'react';
import { useRouter } from 'next/router';

function success() {
    const router = useRouter()
    return (
        <div className='bg-gray-100 h-screen'>
            <main className='max-w-screen-lg mx-auto'>
               <div className='flex flex-col p-10 bg-white'>
               <div className='flex items-center space-x-2 mb-5'>
                  <h1 className='text-3xl'>
                    Thank you, your order has been confirmed!
                  </h1>
                </div>
                <p>
                 Thank You for shopping with us, We'll send a confirmation once your 
                 item has shipped. If you would like to check the status of 
                 order(s) please press the link below    
                </p>
                <button 
                onClick={()=> router.push('/orders')}
                className='button mt-8'>Go to my orders</button>
               </div>
            </main>
        </div>
    )
}

export default success
