import { StarIcon } from "@heroicons/react/24/solid"
import Image from 'next/image'
import { useDispatch } from "react-redux"
// import { addToBasket, removeFromBasket } from "../slices/basketSlice"
import { addItemToBasket, removeItemFromBasket } from "../utility/function"
import { useSession } from "next-auth/react"
function CheckoutProduct({
    SKU,
    name,
    rating,
    price,
    description,
    size,
    image,
    color,
    brand,
}) {
    const dispatch = useDispatch()
    const { data: session } = useSession()
    const item = {
        SKU,
        name,
        rating,
        price,
        description,
        size,
        image,
        color,
        brand,
        quantity,
        selectedSize
    }

    // const addItemToBasket = () => {
    //     const product = {
    //         SKU,
    //         name,
    //         rating,
    //         price,
    //         description,
    //         size,
    //         image,
    //         color,
    //         brand,
    //     }
    //     // push item size into redux
    //     dispatch(addToBasket(product))
    // }
    // const removeItemFromBasket = () => {
    //     dispatch(removeFromBasket({ SKU }))
    // }
    return (<div className="grid grid-cols-5">
        <Image src={image} height={200} width={200} objectFit="contain" />
        <div className="col-span-3 mx-5">
            <p>{name}</p>
            <p>{size}</p>
            {/* <div className="flex">
                {Array(rating)
                    .fill()
                    .map((_, i) => (
                        <StarIcon key={i} className="h-5 text-yellow-500" />

                    ))}
            </div> */}

            {/* <p className="text-xs my-2 line-clamp-3">{description}</p> */}
            <p>{`$ ${price}`}</p>
        </div>
        <div className="flex flex-col space-y-2 mx-auto justify-self-end">
            <div

            > {quantity < 1 ?
                <button
                    onClick={() => addItemToBasket(item, selectedSize, session)}
                    className='mt-auto button rounded-full text-sm'>Add to Basket</button> :
                <div className='flex flex-row space-x-2 ml-7'>
                    {/* <div> */}
                    <button
                        onClick={() => removeItemFromBasket(item, session)}
                        className='h-6 w-5 cursor-pointer rounded-md bg-wendge'><span className='text-white'>-</span> </button>
                    {/* </div> */}
                    <button
                        className='h-6 w-5 cursor-pointer bg-white'
                    >{quantity}</button>

                    <button
                        onClick={() =>
                            addItemToBasket(item, selectedSize, session)
                        }
                        className='h-6 w-5 cursor-pointer rounded-md bg-wendge'> <span className='text-white'>+</span></button>

                </div>}</div>
        </div>
    </div>
    );

}
export default CheckoutProduct;