import Head from "next/head";
import { useEffect, useState } from "react";
import { collection, doc, getDocs, query, orderBy, onSnapshot } from "firebase/firestore";
import { default as db } from '../../firebase';
import Image from 'next/image'
import { FILTER } from '../../constants'
import { useRouter } from 'next/navigation';
import HeartSolidIcon from '@heroicons/react/24/solid/HeartIcon';
import HeartOutlineIcon from '@heroicons/react/24/outline/HeartIcon';
import { useSession, getSession } from 'next-auth/react'
import { addItemToCollection } from "../utility/function";

export default function Home({ rankProducts }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [productRank, setProductRank] = useState(rankProducts)
  useEffect(() => {
    /* For Realtime updates of collection count */
    if (session) {
      const fetchProducts = async () => {
        try {
          const userCollectionRef = collection(db, "users");
          const usersDocRef = doc(userCollectionRef, session.user.email);
          const collectionRef = collection(usersDocRef, 'collection');
          const unsubscribeCollection = onSnapshot(collectionRef, (snapshot) => {
            setProductRank((prevProduct) => {
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
          console.error(error);
        }
      };
      fetchProducts();

    }

  }, []);

  return (
    <div className="bg-white font-sans">
        <Head>
          <title>ROBES</title>
        </Head>
        <div
          className="flex flex-col p-10"
        >
          <div
            className="flex flex-col"
          >
            <Image
              src='https://firebasestorage.googleapis.com/v0/b/project-1234-1a50f.appspot.com/o/Screenshot%202023-06-06%20at%2011.42.31%20AM.png?alt=media&token=f29b9b6c-a7c6-490d-9cec-97d9c4b1ebb2&_gl=1*1bvaund*_ga*MTM0MDY1NzUzOS4xNjgxNTU4Mjky*_ga_CW55HF8NVT*MTY4NjAzMDc0MC4zMi4xLjE2ODYwMzMyOTMuMC4wLjA.'
              height={10}
              width={1700}
              alt='Banner'
            />
            <div
              className="flex flex-row bg-black"
            >
              <div
              >
                <Image
                  onClick={() => {
                    const encodeSearchQuery = encodeURI(FILTER.LESSTHAN700);
                    router.push(`/search?q=${encodeSearchQuery}`);
                  }}
                  src="https://firebasestorage.googleapis.com/v0/b/project-1234-1a50f.appspot.com/o/Screenshot%202023-06-06%20at%2011.59.01%20AM.png?alt=media&token=d40082af-4869-42f3-b3f8-60b700682de2&_gl=1*gbjy7m*_ga*MTM0MDY1NzUzOS4xNjgxNTU4Mjky*_ga_CW55HF8NVT*MTY4NjAzMDc0MC4zMi4xLjE2ODYwMzMyNjEuMC4wLjA."
                  height={150}
                  width={450}
                  alt='Banner'
                />
              </div>

              <div
                onClick={() => {
                  const encodeSearchQuery = encodeURI(FILTER.LESSTHAN1200)
                  router.push(`/search?q=${encodeSearchQuery}`);

                }
                }
              >
                <Image
                  src='https://firebasestorage.googleapis.com/v0/b/project-1234-1a50f.appspot.com/o/Screenshot%202023-06-06%20at%2012.02.53%20PM.png?alt=media&token=70f652a2-c1ae-48ee-b113-8b63eafa5e88&_gl=1*15wn4mb*_ga*MTM0MDY1NzUzOS4xNjgxNTU4Mjky*_ga_CW55HF8NVT*MTY4NjAzMDc0MC4zMi4xLjE2ODYwMzMyMjYuMC4wLjA.'
                  height={150}
                  width={450}
                  alt='Banner'
                />
              </div>
              <div
                className=""
                onClick={() => {
                  const encodeSearchQuery = encodeURI(FILTER.LESSTHAN1800)
                  router.push(`/search?q=${encodeSearchQuery}`);

                }
                }
              >
                <Image
                  src='https://firebasestorage.googleapis.com/v0/b/project-1234-1a50f.appspot.com/o/Screenshot%202023-06-06%20at%2011.38.38%20AM.png?alt=media&token=d0560895-f83d-4407-8498-1d702c299aae&_gl=1*ue1bw4*_ga*MTM0MDY1NzUzOS4xNjgxNTU4Mjky*_ga_CW55HF8NVT*MTY4NjAzMDc0MC4zMi4xLjE2ODYwMzI4MjAuMC4wLjA.'
                  height={150}
                  width={550}
                  alt='Banner'
                />
              </div>
            </div>

            <div
              className=""
            >
              <div
                className=""
                onClick={() => {
                  const encodeSearchQuery = encodeURI(FILTER.LESSTHAN1500)
                  router.push(`/search?q=${encodeSearchQuery}`);
                }
                }
              >
                <Image
                  src='https://firebasestorage.googleapis.com/v0/b/project-1234-1a50f.appspot.com/o/Screenshot%202023-06-06%20at%2011.59.07%20AM.png?alt=media&token=6ccf7940-5148-45d9-aa85-10b8d4a97e00&_gl=1*1x2tt6w*_ga*MTM0MDY1NzUzOS4xNjgxNTU4Mjky*_ga_CW55HF8NVT*MTY4NjAzMDc0MC4zMi4xLjE2ODYwMzMxMTYuMC4wLjA.'
                  height={100}
                  width={1700}
                  alt='Banner'
                />
              </div>
            </div>

          </div>
          {productRank.length? <div
            className="p-10 bg-gray-100"
          >
            <h1
              className="text-2xl"
            >Top Ranking Shirts</h1>
            {productRank.length ? productRank.slice(0, 10).map((item) => (
              <div
              key={item.SKU} 
              className="flex flex-row items-center mt-7 mr-2">
              <div className="flex">
                <Image
                  className="cursor-pointer"
                  onClick={() => {
                    const encodeSearchQuery = encodeURI(item.SKU);
                    router.push(`/product?q=${encodeSearchQuery}`);
                  }}
                  src={item.image[3]}
                  width={30}
                  height={30}
                  alt={`${item.name}`}
                />
              </div>
              <p className="ml-2 flex-grow">{item.name}</p>
              <div className="ml-2">
                {item.collection === true ? (
                  <HeartSolidIcon
                    onClick={() => addItemToCollection(item, session)}
                    className="h-7 cursor-pointer text-wendge"
                  />
                ) : (
                  <HeartOutlineIcon
                    onClick={
                      ()=>{
                        if(!session) router.push('/profile')
                        else {
                          addItemToCollection(item, session)
                        }
                      }
                    }
                    className="h-7 cursor-pointer text-wendge"
                  />
                )}
              </div>
            </div>
            )) : <></>}</div>: <></>}
        </div>
      </div>

  );
}

export async function getServerSideProps(context) {
  // get products from firebase db
  const session = await getSession(context);
  /* This is wonderful feature which gives a ranking to the products based
   on the fact that they are present in the active users basket or collection */
  const products = await getDocs(query(
    collection(db, 'product'),
    orderBy('timestamp', 'desc')
  ));
  const allProducts = []
  products.forEach((doc) => {
    try {
      allProducts.push(doc.data())
    } catch (e) {
      console.log('e', e)
    }

  });

  const bucketRef = collection(db, "bucket");
  const bucketSnapshot = await getDocs(bucketRef);
  const array = [];

  bucketSnapshot.forEach((doc) => {
    if(doc.data().value > 0){
      const data = {
        id: doc.id,
        value: doc.data().value
      };
      array.push(data);
    }
    
  });

  let arrayModifiedForBucket;
  let arrayModifiedForBasket;
  let productsWithoutTimestamp;
  if (array.length) {
    arrayModifiedForBucket = allProducts.map(obj => {
      const matchingItem = array.find(item => item.id === obj.SKU);
      if (typeof matchingItem === 'undefined') {
        return null; // Skip the object if matchingItem is undefined
      }
    
      const value = matchingItem.value || 0;

      return {
        ...obj,
        value: value
      };
    }).filter(obj => obj !== null);

    arrayModifiedForBucket.sort((a, b) => b.value - a.value);

    if (session) {
      const userCollectionRef = collection(db, "users");
      const usersDocRef = doc(userCollectionRef, session.user.email);      // Get a reference to the Firestore collection you want to monitor
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
      const arrayModifiedForCollection = arrayModifiedForBucket.map(item => ({
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
    const presentArray = session ? arrayModifiedForBasket : arrayModifiedForBucket;
    // Remove the timestamp property from each object in the products array
    productsWithoutTimestamp = presentArray.map(({ timestamp, ...rest }) => rest);
  }

  
  
  return {
    props: {
      rankProducts: productsWithoutTimestamp ? productsWithoutTimestamp: []
    }
  }
}