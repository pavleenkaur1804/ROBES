import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { collection, doc, onSnapshot } from "firebase/firestore";
import { default as db } from '../../firebase';
import {  
    addItemToCollection, 
} from "../utility/function";
import HeartSolidIcon from '@heroicons/react/24/solid/HeartIcon';
import HeartOutlineIcon from '@heroicons/react/24/outline/HeartIcon';
import Loading from "../components/Loading";
import NoResult from "../components/NoResult";
import { useRouter } from 'next/navigation';

const Search = () => {
    const [searchResults, setSearchResults] = useState([]);
    const search = useSearchParams();
    const { data: session } = useSession();
    const searchQuery = search ? search.get("q") : null;
    const encodedSearchQuery = encodeURI(searchQuery || "");
    const router = useRouter();
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                setLoading(true); // Set loading state to true before making the API call
                const searchResponse = await axios.post(`/api/search`, {
                    q: encodedSearchQuery,
                    session2: session
                });
                console.log('sera', searchResponse)
                setSearchResults(searchResponse.data.docs);
                setLoading(false);
                const userCollectionRef = collection(db, "users");
                    const usersDocRef = doc(userCollectionRef, session.user.email);
                    const collectionRef = collection(usersDocRef, 'collection');
                    const userBasketRef = collection(db, "users");
                    const userDocRef = doc(userBasketRef, session.user.email);
                    const basketRef = collection(userDocRef, 'basket');
                    const unsubscribeCollection = onSnapshot(collectionRef, (snapshot) => {
                        setSearchResults((prevProduct) => {
                            const updatedProductArray = [...prevProduct];
                            console.log('before setfilte coll', prevProduct)
                            snapshot.docChanges().forEach((change) => {
                                const docData = change.doc.data();
                                const productSKU = docData.productSKU;

                                const matchingProductIndex = updatedProductArray.findIndex((item) => item.SKU === productSKU);

                                if (matchingProductIndex !== -1) {
                                    const updatedProduct = { ...updatedProductArray[matchingProductIndex] };

                                    updatedProduct.collection = change.type === "removed" ? false : true;

                                    updatedProductArray[matchingProductIndex] = updatedProduct;
                                }

                            });

                            console.log('after setfilte coll', updatedProductArray)
                            return updatedProductArray;
                        })
                    });

                    const unsubscribeBask = onSnapshot(basketRef, (snapshot) => {
                        setSearchResults((prevProduct) => {
                            const updatedProductArray = [...prevProduct];
                            console.log('before', prevProduct)
                            snapshot.docChanges().forEach((change) => {
                                console.log('changeed')
                                const docData = change.doc.data();
                                const productSKU = docData.productSKU;

                                const matchingProductIndex = updatedProductArray.findIndex((item) => item.SKU === productSKU);
                                console.log('docData', docData)
                                if (matchingProductIndex !== -1) {
                                    const updatedProduct = { ...updatedProductArray[matchingProductIndex] };

                                    updatedProduct.quantity = change.type === "removed" ? 0 : docData.quantity;

                                    updatedProductArray[matchingProductIndex] = updatedProduct;
                                }
                            });
                            console.log('after', updatedProductArray)
                            return updatedProductArray;
                        })
                    });

            } catch (error) {
              console.log('error', error)
            }
        };
        fetchSearchResults();
    }, [searchQuery]);

    return (
        <>
            <div
        className="flex justify-between">
        <h1
        className="block ml-6 text-gray-400 text-xs align-middle"
        >{searchResults.length ? `${searchResults.length} products found` : ""}</h1> 
        </div>
             <div
        className={searchResults.length ? 'grid sm: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-col-5 gap-1': 'flex justify-center items-center'}
        >
            {searchResults.length ? searchResults.map((result) => (
                <div
                    className="bg-gray-200"
                    key={result.SKU}
                    >
                    <div className='flex flex-col bg-white p-11'>
                        <Image
                          onClick={() => {
                            const encodeSearchQuery = encodeURI(result.SKU);
                            router.push(`/product?q=${encodeSearchQuery}`);
                          }} 
                        src={result.image[3]} height={200} width={200} objectFit="contain" />
                        <h1 className='my-3'>{result.name}</h1>
                        <p className='text-xs my-2'>{`Color: ${result.color}`}</p>
                       
                        <div
                                className="flex flex-row space-x-12"
                        >
                             <p className='text-xs my-2'>{`Brand: ${result.brand}`}</p>
                        </div>
                        <div
                        className="flex flex-row space-x-24"
                        >
                             <div className=' flex mb-5 text-xs my-2'>
                            {`$ ${result.price}`}
                        </div>
                        <div 
                             className="flex"
                             >
                            {result.collection === true ? <HeartSolidIcon
                                onClick={() => addItemToCollection(result, session)}
                                className="h-6 cursor-pointer text-wendge" /> : <HeartOutlineIcon
                                onClick={() => addItemToCollection(result, session)}
                                className="h-6 cursor-pointer text-wendge" />}
                            </div>
                        </div>            
                       
                    </div>
                </div>

            )) : (loading ? <Loading/>: <NoResult/>)}
        </div>
        </>
       
    );
};

export default Search;



