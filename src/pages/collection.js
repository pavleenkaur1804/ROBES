/* This Component is responsible for rendering the collection of 
user whose session is currently active 
*/

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import axios from 'axios';
import { useSession } from "next-auth/react"
import Loading from '../components/Loading';
import { addItemToBasket, addItemToCollection } from "../utility/function";
import SizeSelector from "../components/SizeSelector";

function Collection() {
    const { data: session } = useSession()
    const [loading, setLoading] = useState()
    const [items, setItems] = useState([]);
    const [refresh, setRefresh] = useState();
    const [warning, setWarning] = useState(false)
    const handleSizeChange = (item, size) => {
        /* This updates the size in the local state: items
        In summary, the handleSizeChange function is responsible 
        for updating the size of a specific item in a carton.
        It retrieves the current items, finds the item with a matching SKU, 
        updates its size, and then updates the state with the modified items array. */
        const updatedBasketItem = items.map((itemObject) => {
            if (itemObject.SKU === item.SKU) {
                return { ...itemObject, selectedSize: size };
            }
            return itemObject;
        });
        setItems(updatedBasketItem);
    };

    useEffect(() => {
        /* For Retrieving the items from the collection of the user of whose session is active */
        if (session) {
            const fetchCollection = async () => {
                try {
                    setLoading(true)
                    const products = []
                    const searchResponse = await axios.post(`/api/retrieveCollection`, {
                        session,
                        value: 2
                    });
                    products.push(...searchResponse.data.data)
                    setItems(products)
                    setLoading(false)

                } catch (error) {
                    console.error(error);
                }
            };
            fetchCollection();

        }

    }, [refresh]);

    return (
        <div className={`${loading === true ? 'flex justify-center items-center font-sans' : ''}`}>{
            loading === true ? (<Loading />) : (items.length !== 0 ? <main
            >
                <div className='flex flex-col p-5 space-y-5 bg-white'>
                    <h1 className='text-md ml-5 text-wendge'>
                        {items.length === 0 ? "" : "Your Collection"}
                    </h1>
                    <span
                        className='text-xs pb-5 ml-6 text-gray-400'
                    >{`${items.length !== 0 ? items.length : ""} ${items.length > 1 ? 'items' : (items.length !== 0 ? 'item' : "")}`}</span>
                    <div
                    className='p-2'
                    >
                        {items.map((item) => (
                            <div
                            key={item.SKU} 
                            className="grid grid-cols-5 ml-5 mr-5 p-2 mb-2"
                            >
                                <Image 
                                src={item.image[3]} 
                                height={170} 
                                width={200} 
                                alt={`${item.name}`} 
                                />
                                <div className="col-span-3 mx-5 p-1">
                                    <p>{item.name}</p>
                                    <p className="text-xs my-2">{item.color}</p>
                                    <p className="text-xs my-2">{item.brand}</p>
                                    <p className="text-xs my-2 text-wendge">{`$ ${item.price}`}</p>
                                    <div>
                                        <SizeSelector
                                            item={item}
                                            productId={item.SKU}
                                            className='text-sm'
                                            sizes={item.sizes}
                                            selectedSize={item.selectedSize}
                                            onChange={(size) => 
                                                {
                                                    if(warning=== true){
                                                        setWarning(false)
                                                    }
                                                    handleSizeChange(item, size)
                                                }
                                            }
                                        />
                                    </div>
                                    {warning===true ?  <p
                                 className="text-xs my-2 text-wendge"
                                >Please select a size!</p> : <></>}
                                </div>
                                <div className="flex flex-col space-y-3 mx-auto justify-self-end">
                                    <button className="button bg-wendge rounded-full text-xs" onClick={async () => {
                                        if(!session) router.push('/profile')
                                        else {
                                            if (item.selectedSize === undefined) {
                                                setWarning(true)
                                            } else {
                                                await addItemToCollection(item, session)
                                                addItemToBasket(item, item.selectedSize, session)
                                                setRefresh(Math.random())
                                            }
                                        }
                                    }
                                    }>
                                        Add to Carton
                                    </button>
                                    <button className="button bg-wendge rounded-full text-xs" onClick={async () => {
                                        await addItemToCollection(item, session)
                                        setRefresh(Math.random())
                                    }

                                    }>
                                        Remove from Collection
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main> : <div
                className='flex flex-col justify-center items-center mt-10 mb-10 text-gray-500'
            >
                <h1>Your Collection is Empty</h1>
                <p
                    className='text-xs mt-6'
                >Add The Items That you Wish To Save For Future Buying!</p>
                <Image
                    src="https://firebasestorage.googleapis.com/v0/b/project-1234-1a50f.appspot.com/o/Screenshot%202023-06-08%20at%201.32.08%20PM.png?alt=media&token=aecc86f6-a6b4-4ef9-9b23-2bd9832dee55&_gl=1*1mjcwms*_ga*MTM0MDY1NzUzOS4xNjgxNTU4Mjky*_ga_CW55HF8NVT*MTY4NjIxMTA3Mi40MS4xLjE2ODYyMTE0MTUuMC4wLjA."
                    height={300}
                    width={300}
                    alt={'EMPTY ICON'}
                />
            </div>)
        }
        </div>
    )
}

export default Collection
