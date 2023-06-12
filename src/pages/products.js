import { useEffect, useState } from "react";
import HeartSolidIcon from '@heroicons/react/24/solid/HeartIcon';
import HeartOutlineIcon from '@heroicons/react/24/outline/HeartIcon';
import { collection, doc, onSnapshot, getDocs, query, orderBy } from "firebase/firestore";
import { default as db } from '../../firebase';
import axios from "axios";
import Image from 'next/image'
import { useSession, getSession } from 'next-auth/react'
import SortSelector from "../components/SortSelector";
import ProductFilter from '../components/ProductFilter'
import { addItemToCollection } from "../utility/function";
import { SORTING } from '../../constants'
import NoResult from "../components/NoResult";
import { useRouter } from 'next/navigation';
import Loading from "../components/Loading";


const Products = ({ products, sizes, colors, priceRanges }) => {

    const { data: session } = useSession();
    const [product, setProduct] = useState(products);
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [displayFilteredProducts, setDisplayFilteredProducts] = useState(products)
    const [selectedSort, setSelectedSort] = useState('newProduct');
    const [loading, setLoading] = useState(true); // Add loading state
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const router = useRouter();

    const handleSortChange = event => {
        setSelectedSort(event.target.value);
    };

    const handleFilter = (filteredProducts) => {
        setFilteredProducts(filteredProducts);
        setDisplayFilteredProducts(filteredProducts)
    };


    useEffect(() => {
        /* For Realtime updates of collection count */
        if (session) {
            const fetchProducts = async () => {
                try {
                    setLoading(true); // Set loading state to true before making the API call
                    const products = []
                    const searchResponse = await axios.post(`/api/search`, {
                        selectedSort,
                        session
                    });
                    products.push(...searchResponse.data.docs)
                    setProduct(products)
                    setDisplayFilteredProducts(products)
                    const userCollectionRef = collection(db, "users");
                    const usersDocRef = doc(userCollectionRef, session.user.email);
                    const collectionRef = collection(usersDocRef, 'collection');
                    const unsubscribeCollection = onSnapshot(collectionRef, (snapshot) => {
                        setDisplayFilteredProducts((prevProduct) => {
                            const updatedProductArray = [...prevProduct];
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
                            return updatedProductArray;
                        })
                    });
                } catch (error) {
                    console.log('error', error)
                }
            };
            fetchProducts();
            setLoading(false); // Set loading state to true before making the API call
        }

    }, [session, selectedSort]);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 550);
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
        <div
            className='font-sans'
        >
            {loading === true ?
                <div
                    className="flex justify-center items-center"
                >
                    <Loading />
                </div>
                : (displayFilteredProducts && displayFilteredProducts.length ? <>
                    <div
                        className="flex">
                        <h1
                            className="block ml-5 text-gray-400 text-xs align-middle"
                        >{displayFilteredProducts && displayFilteredProducts.length ? `${displayFilteredProducts.length} products found` : ""}</h1>
                    </div>
                    <div className="flex">
                        <div className='grid sm: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-col-5 gap-1'>
                            {displayFilteredProducts.map((result) => (
                                <div
                                    className="cursor-pointer"
                                    key={result.SKU}
                                >
                                    <div className='flex flex-col p-11'>
                                        <Image
                                            className="cursor-pointer"

                                            onClick={() => {

                                                const encodeSearchQuery = encodeURI(result.SKU)

                                                router.push(`/product?q=${encodeSearchQuery}`);
                                            }
                                            }
                                            src={result.image[3]} height={200} width={222} alt={`${result.name}`} />
                                        <h1 className='my-3'>{result.name}</h1>
                                        <p className='text-xs my-2'>{`Color: ${result.color}`}</p>
                                        <p className='text-xs my-2'>{`Brand: ${result.brand}`}</p>
                                        <div
                                            className={`flex flex-row ${isSmallScreen === true ? 'space-x-23' : 'space-x-24'}`}
                                        >
                                            <div className='mb-3 text-xs my-1 mr-12 whitespace-nowrap'>
                                                {`₹ ${result.price}`}
                                            </div>
                                            <div className="flex">
                                                {result.collection === true ? <HeartSolidIcon
                                                    onClick={() =>
                                                        addItemToCollection(result, session)
                                                    }
                                                    className="h-7 cursor-pointer text-wendge" /> : <HeartOutlineIcon
                                                    onClick={
                                                        () => {
                                                            if (!session) router.push('/profile')
                                                            else {
                                                                addItemToCollection(result, session)
                                                            }
                                                        }

                                                    }
                                                    className="h-7 cursor-pointer text-wendge" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            ))}
                        </div>
                        <div
                        >
                            <SortSelector
                                sort={SORTING}
                                selectedSort={selectedSort}
                                onChange={handleSortChange} />
                            <ProductFilter
                                products={product}
                                onFilter={handleFilter}
                                colors={colors}
                                sizes={sizes}
                                priceRanges={priceRanges}
                            />
                        </div>
                    </div>
                </> : <div
                    className="flex justify-center items-center"
                >
                    <NoResult />
                </div>)}
        </div>
    );
};

export default Products;

export async function getServerSideProps(context) {
    // Get the users logged in credentials
    const session = await getSession(context);
    // get products from firebase db
    const products = await getDocs(query(
        collection(db, 'product'),
        orderBy('timestamp', 'desc')
    ));

    const allProducts = []

    products.forEach((doc) => {
        try {
            allProducts.push(doc.data())
        } catch (error) {
            console.log('error', error)
        }

    });
    const colorSet = new Set();
    const priceSet = []

    allProducts.forEach(item => {
        if (item.color) {
            colorSet.add(item.color);
        }
        if (item.price) {
            priceSet.push(item.price)
        }
    });

    const colorArray = [...colorSet];
    const availableSizes = Array.from(new Set(allProducts.flatMap(item => item.sizes)));
    let productsWithoutTimestamp;
    let arrayModifiedForBasket;
    if (session) {
        const userCollectionRef = collection(db, "users");
        const usersDocRef = doc(userCollectionRef, session.user.email);
        const collectionRef = collection(usersDocRef, 'collection');
        const querySnapshotCollection = await getDocs(collectionRef);
        const basketRef = collection(usersDocRef, 'basket');
        const querySnapshotBasket = await getDocs(basketRef);
        const allCollection = []
        const allBasket = []

        querySnapshotCollection.forEach((doc) => {
            try {
                allCollection.push(doc.data())
            } catch (e) {
                console.log('e', e)
            }

        });

        querySnapshotBasket.forEach((doc) => {
            try {
                allBasket.push(doc.data())
            } catch (e) {
                console.log('e', e)
            }

        });

        const arrayModifiedForCollection = allProducts.map(item => ({
            ...item,
            collection: allCollection.some(collectionItem => collectionItem.productSKU === item.SKU)
        }));

        arrayModifiedForBasket = arrayModifiedForCollection.map(obj => {
            const matchingItem = allBasket.find(item => item.productSKU === obj.SKU);
            const quantity = matchingItem ? matchingItem.quantity : 0;

            return {
                ...obj,
                quantity: quantity
            };
        });

    }
    console.log('arrayModifiedForBAsket', arrayModifiedForBasket)
    // Remove the timestamp property from each object in the products array
    productsWithoutTimestamp = session ? arrayModifiedForBasket.map(({ timestamp, ...rest }) => rest) : allProducts.map(({ timestamp, ...rest }) => rest)

    return {
        props: {
            products: productsWithoutTimestamp,
            sizes: availableSizes,
            colors: colorArray,
            priceRanges: {
                min: Math.min(...priceSet),
                max: Math.max(...priceSet)
            },
        }
    }
}

