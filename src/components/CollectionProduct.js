import { StarIcon } from "@heroicons/react/24/solid"
import Image from 'next/image'
import { useDispatch } from "react-redux"
import { addToBasket } from "../slices/basketSlice"
import { removeFromCollection } from '../slices/collectionSlice';
import { addItemToBasket, addItemToCollection } from "../utility/function";
import { useSession } from "next-auth/react"

function CollectionProduct({
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
    const item =  { SKU, name, rating, price,description, size,
    image, color, brand }
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
    // const removeItemFromCollection = () => {
    //     dispatch(removeFromCollection({ SKU }))
    // }
    return (<div className="grid grid-cols-5">
        <Image src={image[3]} height={200} width={200}  alt= {`${name}`} />
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

            <p className="text-xs my-2 line-clamp-3">{description}</p>
            <p>{`$ ${price}`}</p>
        </div>
        <div className="flex flex-col space-y-2 mx-auto justify-self-end">
            <button className="button bg-wendge rounded-full" onClick={addItemToBasket}>
                Add to Cart
            </button>
            <button className="button bg-wendge rounded-full" onClick={() => addItemToCollection(item, session)}>
                Remove from Collection
            </button>
        </div>
    </div>
    );

}

export default CollectionProduct;