import { StarIcon } from '@heroicons/react/24/solid'
import Image from 'next/dist/client/image'
import React from 'react'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addToBasket } from '../slices/basketSlice'
import { addToCollection } from '../slices/collectionSlice'

const MIN_RATING = 1
const MAX_RATING = 5

export default function Products({ id, title, price, description, category, image }) {

  const dispatch = useDispatch();
  const [rating, setRating] = useState(1);
  const [hasPrime, setHasPrime] = useState(true);

  const addItemToCollection = (item, size) => {
    const product = {
      SKU: item.SKU, name: item.name, price: item.price, image: item.image, brand: item.brand, color: item.color, size,
    }
    // Sending the product as an action to the redux store.... collection slice
    dispatch(addToCollection(product));
  }
  const addItemToBasket = () => {
    const product = {
      id, name, price, description, color, brand, image, rating,
    }
    // Sending the product as an action to the redux store.... basket slice
    dispatch(addToBasket(product));
  }
  useEffect(() => {
    setRating(
      Math.floor(Math.random() * (MAX_RATING - MIN_RATING + 1)) + MIN_RATING
    );
    setHasPrime(Math.random() < 0.5);
  }, []);
  // const [rating] = useState(
  //   Math.floor(Math.random()* (MAX_RATING - MIN_RATING + 1)) + MIN_RATING
  // )
  // const [hasPrime] = useState(Math.random() < 0.5)
  // Hydrating errors ---- due 
  /* If you're getting the hydrating errors (I'm currently before starting the Next Auth stage,
   so talking about finishing the home page UI) it is likely due to the rating and prime states. 
   From my reading I understand that the issue is that because the values (how many stars and is prime or not) 
   are randomly generate, we might get different results on the server than on the client, 
   which would lead to different UIs being rendered and thus this error (I am a beginner to SSR and 
   Next so take the way I am phrasing things and  describing the process with a grain of salt I still don't have a deep understanding of things).
   A solution that works for me, was instead of setting the random values directly to the states when initializing them, I have set them to absolute values 
   (set rating to 1 and prime to false) and then in a useEffect with an empty array (so we'd only run in once) I've changed these values with the randomization formulas Sonny provided).
   This way when the UI first renderd on the client, it is identical to how it was rendered on 
   the server (or something like that lol, remember that grain of salt).*/
  return (
    <div className='relative flex flex-col m-5 bg-white z-30 p-10'>
      <p className='absolute top-2 right-2 text-xs italic text-gray-400'>{category}</p>
      <Image src={image} height={200} width={200} objectFit="contain" />
      <h1 className='my-3'>{title}</h1>
      <div className='flex'>
        {Array(rating)
          .fill()
          .map((_, i) => (
            <StarIcon className='h-5 text-yellow-500' />
          ))}
      </div>

      <p className='text-xs my-2 line-clamp-2'>{description}</p>

      <div className='mb-5'>
        {`$ ${price}`}
      </div>

      {/* {hasPrime && (<div className='flex items-center space-x-2 -mt-5'>
          <img className='w-12' src='https://links.papareact.com/fdw' alt=''/>
          <p className='text-xs textgray-500'>FREE Next-day Delivery</p>
        </div>)} */}
      <div className="flex flex-col space-y-2">
        <button onClick={(item, size) => addItemToCollection} className='mt-auto button bg-wendge'>Add to Collection</button>
        <button onClick={(item, size) => addItemToBasket} className='mt-auto button bg-wendge'>Add to Basket</button>
      </div>
    </div>
  )
}
