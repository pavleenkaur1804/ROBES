import { useEffect, useState } from "react";
import HeartSolidIcon from '@heroicons/react/24/solid/HeartIcon';
import HeartOutlineIcon from '@heroicons/react/24/outline/HeartIcon';
import { useSearchParams } from "next/navigation";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { default as db } from '../../firebase';
import axios from "axios";
import { useSession } from 'next-auth/react'
import SizeSelector from "../components/sizeSelector";
import { addItemToBasket, addItemToCollection, removeItemFromBasket } from "../utility/function";
import NetworkErrorBoundary from '../components/NetworkErrorBoundary';
import NoResult from "../components/NoResult";
import Loading from "../components/Loading";
import Banner from "../components/Banner";


const Product = () => {
 
    const { data: session } = useSession();
    const [displayProduct, setDisplayProduct] = useState([])
    // const [selectedSize, setSelectedSize] = useState('Small');
    const [loading, setLoading] = useState(true); // Add loading state
    const search = useSearchParams()
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const searchQuery = search ? search.get("q") : null;
    const encodedSearchQuery = encodeURI(searchQuery || "");
    const handleSizeChange = (item, size) => {
        /* This updates the size in the local state: displayProduct */
        console.log('item inside handleSizeChange inside product', item)
        console.log('size inside handleSizeChange inside product', size)
        const updatedBasketItem = displayProduct.map((basketItem) => {
          if (basketItem.SKU === item.SKU) {
            return { ...basketItem, selectedSize: size };
          }
          return basketItem;
        });
        setDisplayProduct(updatedBasketItem);
      };

    useEffect(() => {
        /* For Realtime updates of collection count */
        
        if (session) {
            const fetchProducts = async () => {
                try {
                    setLoading(true); // Set loading state to true before making the API call
                    const products = []
                    const searchResponse = await axios.post(`/api/product`, {
                        q: encodedSearchQuery,
                        session
                    });
                    products.push(...searchResponse.data.docs)
                    console.log('searchresponse.data.docs', searchResponse.data.docs)
                    console.log('products', products)
                    setDisplayProduct(products)
                    const userCollectionRef = collection(db, "users");
                    const usersDocRef = doc(userCollectionRef, session.user.email);
                    // // Get a reference to the Firestore collection you want to monitor
                    const collectionRef = collection(usersDocRef, 'collection');
                    const userBasketRef = collection(db, "users");
                    const userDocRef = doc(userBasketRef, session.user.email);
                    // Get a reference to the Firestore collection you want to monitor
                    const basketRef = collection(userDocRef, 'basket');
                    const unsubscribeCollection = onSnapshot(collectionRef, (snapshot) => {
                        setDisplayProduct((prevProduct) => {
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
                        setDisplayProduct((prevProduct) => {
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
                                    updatedProduct.selectedSize = docData.selectedSize || docData.sizes[0];

                                    updatedProductArray[matchingProductIndex] = updatedProduct;
                                }
                            });
                            console.log('after', updatedProductArray)
                            return updatedProductArray;
                        })
           
                    });
                    setLoading(false); // Set loading state to true before making the API call
                } catch (error) {
                   console.log('error', error)
                }
            };
            fetchProducts();
           
        }

    }, []);
    useEffect(() => {
        const handleResize = () => {
          setIsSmallScreen(window.innerWidth <= 550);
          setIsLargeScreen(window.innerWidth >= 1173);
        };
      
        // Call the handleResize function initially to set the initial value of isSmallScreen
        handleResize();
      
        // Add event listener for window resize and call handleResize function on resize
        window.addEventListener('resize', handleResize);
      
        // Clean up event listener on component unmount
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
      
    return (
        <NetworkErrorBoundary>
            <div className='flex justify-center items-center p-6 font-mono'>
                {displayProduct.length ?  
                <div className={`flex ${isSmallScreen ? 'flex-col justify-center items-center' : 'flex-row'}`}
                        key={displayProduct[0].SKU}
                        >
                            <div
                           
                            >
                            <Banner
                            className={`flex ${isSmallScreen ? 'p-8': 'p-7'}`}  
                            images={displayProduct[0].image} 
                            height={isSmallScreen ? 300: 400} 
                            width={isSmallScreen? 400: 800} />
                            </div>
                             
                        <div className={`flex flex-col bg-white p-7 ${isSmallScreen ? 'flex-col justify-start ml-10' : 'flex-row'}`}>
                            <h1 className='text-2xl mb-2'>{displayProduct[0].name}</h1>
                            <p className='text-sm my-2'>{`Color: ${displayProduct[0].color}`}</p>
                            <p className='text-sm my-2'>{`Brand: ${displayProduct[0].brand}`}</p>
                            <div>
                                <p
                                className='text-sm my-2'
                                >Select a size:</p>
                                <SizeSelector 
                                    item={displayProduct[0]}
                                    productId={displayProduct[0].SKU}
                                    className='text-sm'
                                    sizes={displayProduct[0].sizes}
                                    selectedSize={displayProduct[0].selectedSize}
                                    onChange={(size) => handleSizeChange(displayProduct[0], size)}
                                />
                                <p
                                 className="text-sm my-2"
                                >You selected: {displayProduct[0].selectedSize}</p>
                            </div>
                            <p className='text-sm my-2'>{`Description: ${displayProduct[0].description}`}</p>
                            <div className='mb-5 text-sm my-2'>
                                {`$ ${displayProduct[0].price}`}
                            </div>
                            <div
                            className="flex flex-row items-center space-x-5"
                            >
                            <div className="flex">
                                {displayProduct[0].collection === true ? <HeartSolidIcon
                                    onClick={() => addItemToCollection(displayProduct[0], session)}
                                    className="h-7 cursor-pointer text-wendge" /> : <HeartOutlineIcon
                                    onClick={() => addItemToCollection(displayProduct[0], session)}
                                    className="h-7 cursor-pointer text-wendge" />}
                            </div>
                            <div

                            > {displayProduct[0].quantity < 1 ?
                                <button
                                    onClick={() => addItemToBasket(displayProduct[0], displayProduct[0].selectedSize, session)}
                                    className='mt-auto button rounded-full text-sm'>Add to Basket</button> :
                                <div className='flex flex-row space-x-2 ml-7'>
                                    {/* <div> */}
                                    <button
                                        onClick={() => removeItemFromBasket(displayProduct[0], session)}
                                        className='h-6 w-5 cursor-pointer rounded-md bg-wendge'><span className='text-white'>-</span> </button>
                                    {/* </div> */}
                                    <button
                                        className='h-6 w-5 cursor-pointer bg-white'
                                    >{displayProduct[0].quantity}</button>

                                    <button
                                        onClick={() =>
                                            addItemToBasket(displayProduct[0], selectedSize, session)
                                        }
                                        className='h-6 w-5 cursor-pointer rounded-md bg-wendge'> <span className='text-white'>+</span></button>

                                </div>}</div>
                            </div>
                          
                        </div>
                    </div> : (loading ? <Loading/> : <NoResult/>)}
            </div>
        </NetworkErrorBoundary>
    );
};

export default Product;


