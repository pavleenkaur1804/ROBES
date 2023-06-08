import axios from 'axios';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { writeBatch, doc } from "firebase/firestore";
import { default as db } from '../../../firebase';
import { collection, query, where, getDocs, orderBy, addDoc, setDoc } from "firebase/firestore";

export default async (req, res) => {
    try {
        // console.log('AT THE API')
        // Get a new write batch

        /* ORIGINAL*/
        let { selectedSort, session } = req.body;
        console.log('session', session)
        // console.log('selectedSort', selectedSort)
        const { q, session2 } = req.body;
        console.log('q', q)
        if(session === undefined){
            session = session2
        }
        
        console.log('sesion2', session2)
        let searchQuery;
        // if (searchQuery) {
        //     searchQuery = q.trim()
        // }


        let order = 'timestamp';
        let value = 'desc';
        const items = [];
        if (req.body) {

            if (selectedSort === 'trending') {
                // Trending would be calculated based on the present in cart & in collection & highest bought - generating a score
                // items.push(orderBy(''))

            } else if (selectedSort === 'bestSeller') {
                // Best Seller would be calculated based on the how many people purchased it.

            } else if (selectedSort === 'newToOld') {
                // Timestamp - 'desc'
                order = 'timestamp';
                value = 'desc';

            } else if (selectedSort === 'highToLow') {
                // Based on price - 'desc'
                order = 'price';
                value = 'desc';

            } else if (selectedSort === 'lowToHigh') {
                // Based on price - 'asce'
                order = 'price';
                value = 'asc';

            }
        }
        const all = []
        if (req.body.q == 1) {
            console.log('inside q=1')
            const prodRef = collection(db, "product");
            const querySnapshot = await getDocs(query(prodRef, where("price", "<", 700)));
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " =>>>>>> ", doc.data());
                // all.push(doc.data())
                const product = doc.data();
    console.log('prod', product)
                    all.push(product)
            });
        } else if(req.body.q == 2){
            console.log('inside q=2')
            const prodRef = collection(db, "product");
            const querySnapshot = await getDocs(query(prodRef, where("price", ">", 700), where("price", "<", 1200)));
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " =>>>>>> ", doc.data());
                // all.push(doc.data())
                const product = doc.data();
    
                    all.push(product)
            });
        } else if (req.body.q == 3){
            console.log('inside q=3')
            const prodRef = collection(db, "product");
            const querySnapshot = await getDocs(query(prodRef, where("price", ">", 1200), where("price", "<", 1500)));
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " =>>>>>> ", doc.data());
                // all.push(doc.data())
                const product = doc.data();
    
                    all.push(product)
            });
        } else if (req.body.q == 4){
            console.log('inside q=4')
            const prodRef = collection(db, "product");
            const querySnapshot = await getDocs(query(prodRef, where("price", ">", 1500), where("price", "<", 1800)));
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " =>>>>>> ", doc.data());
                // all.push(doc.data())
                const product = doc.data();
    
                    all.push(product)
            });
        } else {
            const qu = query(
                collection(db, "product"),
                orderBy(order, value),
            );
    
            const querySnapshot = await getDocs(qu);
            
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " =>>>>>> ", doc.data());
                // all.push(doc.data())
                const product = doc.data();
                if (req.query) {
                    const regex = new RegExp(q, 'i'); // 'i' is for case-insensitive matching
                    if (product.name.match(regex)) {
                        all.push(product);
                    }
                } else if (req.body) {
                    all.push(product)
                }
            });
        }
        
        let arrayModifiedForBasket;
        if(session){
            const userCollectionRef = collection(db, "users");
            const usersDocRef = doc(userCollectionRef, session.user.email || session2.user.email);
            // Get a reference to the Firestore collection you want to monitor
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
            const arrayModifiedForCollection = all.map(item => ({
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
       
        console.log('all', all)
        console.log('arrayModifiedForBasket', arrayModifiedForBasket )
        if (req.query.q !== '') {
            console.log("req.query.q !== ''")
            res.send({ docs: arrayModifiedForBasket || all })
        } else if (req.body.selectedSort || req.body.q) {
            console.log("req.body.selectedSort || req.body.q")
            res.send({ docs: arrayModifiedForBasket || all })
        } else if(req.body.q === undefined || req.body.q === null){
            console.log("req.body.q === undefined || req.body.q === null")
            res.send({ docs: [] })
        } else {
            console.log("else")
            res.send({ docs: [] })
        }
        /* For Debugging */
        // res.send({ docs: all })
        /* ORIGINAL*/

        /* ADD DATA */
        // const batch = writeBatch(db);
        // const womenShirts = [
        //     {
        //       "SKU": "WS071031",
        //       "price": 1550,
        //       "color": "Blush Pink",
        //       "sizes": ["S", "M", "L"],
        //       "description": "This blush pink party shirt is perfect for a feminine and romantic look. Embellished with delicate lace and ruffles, it's a charming choice.",
        //       "name": "Blush Pink Lace Party Shirt",
        //       "images": [
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Blush+Pink+Shirt+Front",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Blush+Pink+Shirt+Back",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Blush+Pink+Shirt+Side"
        //       ],
        //       "brand": "Romantic Ruffles",
        //       "fabric": "Chiffon",
        //       "washing_instructions": "Dry clean only",
        //       "pattern": "Solid",
        //       "length": "Regular",
        //       "timestamp": 1665139200000
        //     },
        //     {
        //       "SKU": "WS071032",
        //       "price": 1600,
        //       "color": "Silver",
        //       "sizes": ["S", "M", "L"],
        //       "description": "This silver party shirt is perfect for a glamorous and trendy look. Embellished with metallic sequins and fringes, it's a showstopper.",
        //       "name": "Silver Sequin Fringe Party Shirt",
        //       "images": [
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Silver+Shirt+Front",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Silver+Shirt+Back",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Silver+Shirt+Side"
        //       ],
        //       "brand": "Sparkle & Shine",
        //       "fabric": "Polyester",
        //       "washing_instructions": "Dry clean only",
        //       "pattern": "Solid",
        //       "length": "Regular",
        //       "timestamp": 1665225600000
        //     },
        //     {
        //       "SKU": "WS071033",
        //       "price": 1650,
        //       "color": "Rose Gold",
        //       "sizes": ["M", "L", "XL"],
        //       "description": "This rose gold party shirt is perfect for a glamorous and feminine look. Embellished with shimmering beads and sequins, it's a statement piece.",
        //       "name": "Rose Gold Beaded Party Shirt",
        //       "images": [
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Rose+Gold+Shirt+Front",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Rose+Gold+Shirt+Back",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Rose+Gold+Shirt+Side"
        //       ],
        //       "brand": "Dazzling Diva",
        //       "fabric": "Silk",
        //       "washing_instructions": "Dry clean only",
        //       "pattern": "Solid",
        //       "length": "Long",
        //       "timestamp": 1665312000000
        //     },
        //     {
        //       "SKU": "WS071034",
        //       "price": 1700,
        //       "color": "Emerald Green",
        //       "sizes": ["S", "M", "L"],
        //       "description": "This emerald green party shirt is perfect for a bold and stylish look. Embellished with intricate beading and sequins, it's a head-turner.",
        //       "name": "Emerald Green Beaded Party Shirt",
        //       "images": [
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Emerald+Green+Shirt+Front",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Emerald+Green+Shirt+Back",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Emerald+Green+Shirt+Side"
        //       ],
        //       "brand": "Glamour Queen",
        //       "fabric": "Velvet",
        //       "washing_instructions": "Dry clean only",
        //       "pattern": "Solid",
        //       "length": "Regular",
        //       "timestamp": 1665398400000
        //     },
        //     {
        //       "SKU": "WS071035",
        //       "price": 1750,
        //       "color": "Navy Blue",
        //       "sizes": ["M", "L", "XL"],
        //       "description": "This navy blue party shirt is perfect for a sophisticated and elegant look. Embellished with shimmering sequins and beads, it's a timeless choice.",
        //       "name": "Navy Blue Sequin Party Shirt",
        //       "images": [
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Navy+Blue+Shirt+Front",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Navy+Blue+Shirt+Back",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Navy+Blue+Shirt+Side"
        //       ],
        //       "brand": "Elegant Enchantments",
        //       "fabric": "Silk",
        //       "washing_instructions": "Dry clean only",
        //       "pattern": "Solid",
        //       "length": "Long",
        //       "timestamp": 1665484800000
        //     },
        //     {
        //       "SKU": "WS071036",
        //       "price": 1800,
        //       "color": "Gold",
        //       "sizes": ["S", "M", "L"],
        //       "description": "This gold party shirt is perfect for a luxurious and elegant look. Embellished with shimmering beads and crystals, it's a statement piece.",
        //       "name": "Gold Beaded Party Shirt",
        //       "images": [
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Gold+Shirt+Front",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Gold+Shirt+Back",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Gold+Shirt+Side"
        //       ],
        //       "brand": "Extravaganza",
        //       "fabric": "Silk",
        //       "washing_instructions": "Dry clean only",
        //       "pattern": "Solid",
        //       "length": "Long",
        //       "timestamp": 1665571200000
        //     },
        //     {
        //       "SKU": "WS071037",
        //       "price": 1550,
        //       "color": "Blush Pink",
        //       "sizes": ["S", "M", "L"],
        //       "description": "This blush pink party shirt is perfect for a feminine and romantic look. Embellished with delicate lace and ruffles, it's a charming choice.",
        //       "name": "Blush Pink Lace Party Shirt",
        //       "images": [
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Blush+Pink+Shirt+Front",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Blush+Pink+Shirt+Back",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Blush+Pink+Shirt+Side"
        //       ],
        //       "brand": "Enchanting Elegance",
        //       "fabric": "Chiffon",
        //       "washing_instructions": "Dry clean only",
        //       "pattern": "Solid",
        //       "length": "Regular",
        //       "timestamp": 1665657600000
        //     },
        //     {
        //       "SKU": "WS071038",
        //       "price": 1600,
        //       "color": "Silver",
        //       "sizes": ["S", "M", "L"],
        //       "description": "This silver party shirt is perfect for a glamorous and trendy look. Embellished with metallic sequins and fringes, it's a showstopper.",
        //       "name": "Silver Sequin Fringe Party Shirt",
        //       "images": [
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Silver+Shirt+Front",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Silver+Shirt+Back",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Silver+Shirt+Side"
        //       ],
        //       "brand": "Glamourous Sparkles",
        //       "fabric": "Polyester",
        //       "washing_instructions": "Dry clean only",
        //       "pattern": "Solid",
        //       "length": "Regular",
        //       "timestamp": 1665744000000
        //     },
        //     {
        //       "SKU": "WS071039",
        //       "price": 1650,
        //       "color": "Rose Gold",
        //       "sizes": ["M", "L", "XL"],
        //       "description": "This rose gold party shirt is perfect for a glamorous and feminine look. Embellished with shimmering beads and sequins, it's a statement piece.",
        //       "name": "Rose Gold Beaded Party Shirt",
        //       "images": [
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Rose+Gold+Shirt+Front",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Rose+Gold+Shirt+Back",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Rose+Gold+Shirt+Side"
        //       ],
        //       "brand": "Radiant Splendor",
        //       "fabric": "Silk",
        //       "washing_instructions": "Dry clean only",
        //       "pattern": "Solid",
        //       "length": "Long",
        //       "timestamp": 1665830400000
        //     },
        //     {
        //       "SKU": "WS071040",
        //       "price": 1700,
        //       "color": "Emerald Green",
        //       "sizes": ["S", "M", "L"],
        //       "description": "This emerald green party shirt is perfect for a bold and stylish look. Embellished with intricate beading and sequins, it's a head-turner.",
        //       "name": "Emerald Green Beaded Party Shirt",
        //       "images": [
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Emerald+Green+Shirt+Front",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Emerald+Green+Shirt+Back",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Emerald+Green+Shirt+Side"
        //       ],
        //       "brand": "Dazzling Delights",
        //       "fabric": "Velvet",
        //       "washing_instructions": "Dry clean only",
        //       "pattern": "Solid",
        //       "length": "Regular",
        //       "timestamp": 1665916800000
        //     },
        //     {
        //       "SKU": "WS071041",
        //       "price": 1750,
        //       "color": "Navy Blue",
        //       "sizes": ["M", "L", "XL"],
        //       "description": "This navy blue party shirt is perfect for a sophisticated and elegant look. Embellished with shimmering sequins and beads, it's a timeless choice.",
        //       "name": "Navy Blue Sequin Party Shirt",
        //       "images": [
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Navy+Blue+Shirt+Front",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Navy+Blue+Shirt+Back",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Navy+Blue+Shirt+Side"
        //       ],
        //       "brand": "Elegant Essence",
        //       "fabric": "Silk",
        //       "washing_instructions": "Dry clean only",
        //       "pattern": "Solid",
        //       "length": "Long",
        //       "timestamp": 1666003200000
        //     },
        //     {
        //       "SKU": "WS071042",
        //       "price": 1800,
        //       "color": "Gold",
        //       "sizes": ["S", "M", "L"],
        //       "description": "This gold party shirt is perfect for a luxurious and elegant look. Embellished with shimmering beads and crystals, it's a statement piece.",
        //       "name": "Gold Beaded Party Shirt",
        //       "images": [
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Gold+Shirt+Front",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Gold+Shirt+Back",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Gold+Shirt+Side"
        //       ],
        //       "brand": "Glimmering Glam",
        //       "fabric": "Silk",
        //       "washing_instructions": "Dry clean only",
        //       "pattern": "Solid",
        //       "length": "Long",
        //       "timestamp": 1666089600000
        //     }
        //   ];
          
        // const womenShirts = [
        //     {
        //       "SKU": "WS071025",
        //       "price": 1550,
        //       "color": "Olive Green",
        //       "sizes": ["XS", "S", "M"],
        //       "description": "This olive green shirt is perfect for a casual yet stylish look. Made with soft fabric, it's comfortable and versatile.",
        //       "name": "Olive Green Casual Shirt",
        //       "images": [
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Olive+Green+Shirt+Front",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Olive+Green+Shirt+Back",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Olive+Green+Shirt+Side"
        //       ],
        //       "brand": "Chic Boutique",
        //       "fabric": "Cotton",
        //       "washing_instructions": "Machine wash cold, tumble dry low",
        //       "pattern": "Striped",
        //       "length": "Long"
        //     },
        //     {
        //       "SKU": "WS071026",
        //       "price": 1600,
        //       "color": "Cornflower Blue",
        //       "sizes": ["S", "M", "L"],
        //       "description": "This cornflower blue shirt is a timeless classic. Made with high-quality fabric, it's comfortable and easy to style.",
        //       "name": "Cornflower Blue Classic Shirt",
        //       "images": [
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Cornflower+Blue+Shirt+Front",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Cornflower+Blue+Shirt+Back",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Cornflower+Blue+Shirt+Side"
        //       ],
        //       "brand": "Elegant Essentials",
        //       "fabric": "Silk",
        //       "washing_instructions": "Dry clean only",
        //       "pattern": "Checked",
        //       "length": "Regular"
        //     },
        //     {
        //       "SKU": "WS071027",
        //       "price": 1650,
        //       "color": "Taupe",
        //       "sizes": ["M", "L", "XL"],
        //       "description": "This taupe shirt is perfect for a sophisticated look. Made with luxurious fabric, it's comfortable and elegant.",
        //       "name": "Taupe Sophisticated Shirt",
        //       "images": [
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Taupe+Shirt+Front",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Taupe+Shirt+Back",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Taupe+Shirt+Side"
        //       ],
        //       "brand": "Sophisticate",
        //       "fabric": "Polyester",
        //       "washing_instructions": "Machine wash cold, gentle cycle",
        //       "pattern": "Printed",
        //       "length": "Long"
        //     },
        //     {
        //       "SKU": "WS071028",
        //       "price": 1700,
        //       "color": "Coffee Brown",
        //       "sizes": ["S", "M", "L"],
        //       "description": "This coffee brown shirt is perfect for a cozy and relaxed look. Made with soft fabric, it's comfortable and versatile.",
        //       "name": "Coffee Brown Relaxed Shirt",
        //       "images": [
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Coffee+Brown+Shirt+Front",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Coffee+Brown+Shirt+Back",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Coffee+Brown+Shirt+Side"
        //       ],
        //       "brand": "Casual Comfort",
        //       "fabric": "Modal",
        //       "washing_instructions": "Machine wash cold, tumble dry low",
        //       "pattern": "Floral",
        //       "length": "Regular"
        //     },
        //     {
        //       "SKU": "WS071029",
        //       "price": 1750,
        //       "color": "Mauve",
        //       "sizes": ["XS", "S", "M"],
        //       "description": "This mauve shirt is perfect for a feminine and graceful look. Made with lightweight fabric, it's comfortable and stylish.",
        //       "name": "Mauve Elegant Shirt",
        //       "images": [
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Mauve+Shirt+Front",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Mauve+Shirt+Back",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Mauve+Shirt+Side"
        //       ],
        //       "brand": "Graceful Glam",
        //       "fabric": "Viscose",
        //       "washing_instructions": "Machine wash cold, line dry",
        //       "pattern": "Embroidered",
        //       "length": "Long"
        //     }
        //     // Add more products here...
        //   ];
          
        // const womenShirts = [
        //     {
        //       "SKU": "WS071020",
        //       "price": 1600,
        //       "color": "Beaded Black",
        //       "sizes": ["XS", "S", "M"],
        //       "description": "This beaded black party shirt will make you stand out from the crowd. With intricate beadwork and a chic design, it's perfect for a glamorous night.",
        //       "name": "Beaded Black Party Shirt",
        //       "images": [
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Beaded+Black+Shirt+Front",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Beaded+Black+Shirt+Back",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Beaded+Black+Shirt+Side"
        //       ],
        //       "brand": "Glamorize",
        //       "fabric": "Polyester",
        //       "washing_instructions": "Machine wash cold, gentle cycle",
        //       "pattern": "Solid",
        //       "length": "Regular"
        //     },
        //     {
        //       "SKU": "WS071021",
        //       "price": 1650,
        //       "color": "Shimmer Rose",
        //       "sizes": ["S", "M", "L"],
        //       "description": "This shimmer rose party shirt will make you shine with elegance. With a subtle shimmer effect and a flattering silhouette, it's perfect for a special occasion.",
        //       "name": "Shimmer Rose Party Shirt",
        //       "images": [
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Shimmer+Rose+Shirt+Front",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Shimmer+Rose+Shirt+Back",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Shimmer+Rose+Shirt+Side"
        //       ],
        //       "brand": "Radiant",
        //       "fabric": "Silk",
        //       "washing_instructions": "Dry clean only",
        //       "pattern": "Solid",
        //       "length": "Regular"
        //     },
        //     {
        //       "SKU": "WS071022",
        //       "price": 1700,
        //       "color": "Embellished Purple",
        //       "sizes": ["M", "L", "XL"],
        //       "description": "This embellished purple party shirt will make heads turn. With stunning embellishments and a captivating color, it's perfect for a glamorous night.",
        //       "name": "Embellished Purple Party Shirt",
        //       "images": [
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Embellished+Purple+Shirt+Front",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Embellished+Purple+Shirt+Back",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Embellished+Purple+Shirt+Side"
        //       ],
        //       "brand": "Enchanté",
        //       "fabric": "Velvet",
        //       "washing_instructions": "Hand wash only",
        //       "pattern": "Solid",
        //       "length": "Regular"
        //     },
        //     {
        //       "SKU": "WS071023",
        //       "price": 1750,
        //       "color": "Sheer Blue",
        //       "sizes": ["S", "M", "L"],
        //       "description": "This sheer blue party shirt will give you an ethereal look. With delicate sheer fabric and a dreamy color, it's perfect for a romantic evening.",
        //       "name": "Sheer Blue Party Shirt",
        //       "images": [
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Sheer+Blue+Shirt+Front",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Sheer+Blue+Shirt+Back",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Sheer+Blue+Shirt+Side"
        //       ],
        //       "brand": "Mystique",
        //       "fabric": "Chiffon",
        //       "washing_instructions": "Hand wash cold, line dry",
        //       "pattern": "Solid",
        //       "length": "Regular"
        //     },
        //     {
        //       "SKU": "WS071024",
        //       "price": 1800,
        //       "color": "Shimmer Gold",
        //       "sizes": ["M", "L", "XL"],
        //       "description": "This shimmer gold party shirt will make you sparkle like a star. With a metallic shimmer effect and a glamorous design, it's perfect for a festive celebration.",
        //       "name": "Shimmer Gold Party Shirt",
        //       "images": [
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Shimmer+Gold+Shirt+Front",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Shimmer+Gold+Shirt+Back",
        //         "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Shimmer+Gold+Shirt+Side"
        //       ],
        //       "brand": "Glamourama",
        //       "fabric": "Lurex",
        //       "washing_instructions": "Machine wash cold, delicate cycle",
        //       "pattern": "Solid",
        //       "length": "Regular"
        //     },
        //     // Add more products here...
        //   ];
          
        // const womenShirts = [
        //     {
        //       "SKU": "WS071001",
        //       "price": 18.99,
        //       "color": "Peach",
        //       "sizes": ["XS", "S", "M"],
        //       "description": "This peach shirt is perfect for a fresh and vibrant look. Made with comfortable fabric, it's versatile and stylish.",
        //       "name": "Peach Casual Shirt",
        //       "image": "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Peach+Shirt",
        //       "brand": "ABC Shirts"
        //     },
        //     {
        //       "SKU": "WS071002",
        //       "price": 16.49,
        //       "color": "Olive",
        //       "sizes": ["M", "L", "XL"],
        //       "description": "This olive shirt adds a touch of sophistication to your outfit. Made with soft and breathable fabric, it's comfortable and trendy.",
        //       "name": "Olive Button-Up Shirt",
        //       "image": "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Olive+Shirt",
        //       "brand": "XYZ Shirts"
        //     },
        //     {
        //       "SKU": "WS071003",
        //       "price": 17.99,
        //       "color": "Cornflower Blue",
        //       "sizes": ["S", "L", "XXL"],
        //       "description": "This cornflower blue shirt is perfect for a casual and relaxed look. Made with lightweight fabric, it's comfortable and easy to wear.",
        //       "name": "Cornflower Blue Casual Shirt",
        //       "image": "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Cornflower+Blue+Shirt",
        //       "brand": "ABC Shirts"
        //     },
        //     {
        //       "SKU": "WS071004",
        //       "price": 19.99,
        //       "color": "Coral",
        //       "sizes": ["M", "XL", "XXXL"],
        //       "description": "This coral shirt adds a pop of color to your wardrobe. Made with high-quality fabric, it's comfortable and fashionable.",
        //       "name": "Coral V-Neck Shirt",
        //       "image": "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Coral+Shirt",
        //       "brand": "XYZ Shirts"
        //     },
        //     {
        //       "SKU": "WS071005",
        //       "price": 18.49,
        //       "color": "Emerald Green",
        //       "sizes": ["S", "M", "XXL"],
        //       "description": "This emerald green shirt brings a touch of nature to your style. Made with soft and breathable fabric, it's perfect for any occasion.",
        //       "name": "Emerald Green Casual Shirt",
        //       "image": "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Emerald+Green+Shirt",
        //       "brand": "ABC Shirts"
        //     },
        //     {
        //       "SKU": "WS071006",
        //       "price": 17.99,
        //       "color": "Royal Blue",
        //       "sizes": ["XS", "L", "XL"],
        //       "description": "This royal blue shirt adds a touch of elegance to your outfit. Made with comfortable fabric, it's versatile and stylish.",
        //       "name": "Royal Blue Button-Up Shirt",
        //       "image": "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Royal+Blue+Shirt",
        //       "brand": "XYZ Shirts"
        //     },
        //     {
        //       "SKU": "WS071007",
        //       "price": 16.99,
        //       "color": "Taupe",
        //       "sizes": ["S", "M", "XXXL"],
        //       "description": "This taupe shirt is perfect for a neutral and sophisticated look. Made with high-quality fabric, it's comfortable and versatile.",
        //       "name": "Taupe Everyday Shirt",
        //       "image": "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Taupe+Shirt",
        //       "brand": "ABC Shirts"
        //     },
        //     {
        //       "SKU": "WS071008",
        //       "price": 18.99,
        //       "color": "Coffee",
        //       "sizes": ["XS", "L", "XXL"],
        //       "description": "This coffee shirt is perfect for a warm and cozy look. Made with soft fabric, it's comfortable and easy to style.",
        //       "name": "Coffee Casual Shirt",
        //       "image": "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Coffee+Shirt",
        //       "brand": "XYZ Shirts"
        //     },
        //     {
        //       "SKU": "WS071009",
        //       "price": 19.49,
        //       "color": "Lilac",
        //       "sizes": ["S", "XL", "XXXL"],
        //       "description": "This lilac shirt is perfect for a soft and delicate look. Made with comfortable fabric, it's versatile and easy to style.",
        //       "name": "Lilac Elegant Shirt",
        //       "image": "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Lilac+Shirt",
        //       "brand": "ABC Shirts"
        //     },
        //     {
        //       "SKU": "WS071010",
        //       "price": 16.99,
        //       "color": "Lavender",
        //       "sizes": ["M", "L", "XXL"],
        //       "description": "This lavender shirt adds a touch of elegance to your outfit. Made with soft and breathable fabric, it's comfortable and stylish.",
        //       "name": "Lavender Everyday Shirt",
        //       "image": "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Lavender+Shirt",
        //       "brand": "XYZ Shirts"
        //     },
        //     {
        //       "SKU": "WS071011",
        //       "price": 17.49,
        //       "color": "Peach",
        //       "sizes": ["S", "M", "XL"],
        //       "description": "This peach shirt is perfect for a fresh and vibrant look. Made with comfortable fabric, it's versatile and stylish.",
        //       "name": "Peach Button-Up Shirt",
        //       "image": "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Peach+Shirt",
        //       "brand": "ABC Shirts"
        //     },
        //     {
        //       "SKU": "WS071012",
        //       "price": 15.99,
        //       "color": "Emerald Green",
        //       "sizes": ["XS", "L", "XXXL"],
        //       "description": "This emerald green shirt brings a touch of nature to your style. Made with soft and breathable fabric, it's perfect for any occasion.",
        //       "name": "Emerald Green Elegant Shirt",
        //       "image": "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Emerald+Green+Shirt",
        //       "brand": "XYZ Shirts"
        //     },
        //     {
        //       "SKU": "WS071013",
        //       "price": 18.99,
        //       "color": "Cornflower Blue",
        //       "sizes": ["S", "M", "XXL"],
        //       "description": "This cornflower blue shirt is perfect for a casual and relaxed look. Made with lightweight fabric, it's comfortable and easy to wear.",
        //       "name": "Cornflower Blue Casual Shirt",
        //       "image": "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Cornflower+Blue+Shirt",
        //       "brand": "ABC Shirts"
        //     },
        //     {
        //       "SKU": "WS071014",
        //       "price": 19.49,
        //       "color": "Coral",
        //       "sizes": ["XS", "L", "XL"],
        //       "description": "This coral shirt adds a pop of color to your wardrobe. Made with high-quality fabric, it's comfortable and fashionable.",
        //       "name": "Coral V-Neck Shirt",
        //       "image": "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Coral+Shirt",
        //       "brand": "XYZ Shirts"
        //     },
        //     {
        //       "SKU": "WS071015",
        //       "price": 17.99,
        //       "color": "Royal Blue",
        //       "sizes": ["M", "XXL", "XXXL"],
        //       "description": "This royal blue shirt adds a touch of elegance to your outfit. Made with comfortable fabric, it's versatile and stylish.",
        //       "name": "Royal Blue Casual Shirt",
        //       "image": "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Royal+Blue+Shirt",
        //       "brand": "ABC Shirts"
        //     },
        //     {
        //       "SKU": "WS071016",
        //       "price": 16.99,
        //       "color": "Taupe",
        //       "sizes": ["S", "M", "L"],
        //       "description": "This taupe shirt is perfect for a neutral and sophisticated look. Made with high-quality fabric, it's comfortable and versatile.",
        //       "name": "Taupe Everyday Shirt",
        //       "image": "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Taupe+Shirt",
        //       "brand": "XYZ Shirts"
        //     },
        //     {
        //       "SKU": "WS071017",
        //       "price": 18.49,
        //       "color": "Coffee",
        //       "sizes": ["XS", "L", "XL"],
        //       "description": "This coffee shirt is perfect for a warm and cozy look. Made with soft fabric, it's comfortable and easy to style.",
        //       "name": "Coffee Casual Shirt",
        //       "image": "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Coffee+Shirt",
        //       "brand": "ABC Shirts"
        //     },
        //     {
        //       "SKU": "WS071018",
        //       "price": 19.99,
        //       "color": "Lilac",
        //       "sizes": ["S", "M", "XXL"],
        //       "description": "This lilac shirt is perfect for a soft and delicate look. Made with comfortable fabric, it's versatile and easy to style.",
        //       "name": "Lilac Elegant Shirt",
        //       "image": "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Lilac+Shirt",
        //       "brand": "XYZ Shirts"
        //     },
        //     {
        //       "SKU": "WS071019",
        //       "price": 17.99,
        //       "color": "Lavender",
        //       "sizes": ["M", "L", "XXXL"],
        //       "description": "This lavender shirt adds a touch of elegance to your outfit. Made with soft and breathable fabric, it's comfortable and stylish.",
        //       "name": "Lavender Everyday Shirt",
        //       "image": "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Lavender+Shirt",
        //       "brand": "ABC Shirts"
        //     },
        //     {
        //       "SKU": "WS071020",
        //       "price": 16.99,
        //       "color": "Peach",
        //       "sizes": ["S", "XL", "XXL"],
        //       "description": "This peach shirt is perfect for a fresh and vibrant look. Made with comfortable fabric, it's versatile and stylish.",
        //       "name": "Peach Button-Up Shirt",
        //       "image": "https://dummyimage.com/300x300/e6e6fa/000000.png&text=Peach+Shirt",
        //       "brand": "XYZ Shirts"
        //     }
        //   ];
          
        // const womenShirts = [
        //     {
        //       "SKU": "WS041",
        //       "price": 14.99,
        //       "color": "Black",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This black plus-size shirt is perfect for everyday wear. Made with comfortable fabric, it's versatile and easy to style.",
        //       "name": "Black Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/000000/ffffff.png&text=Black+Shirt",
        //       "brand": "ABC Shirts"
        //     },
        //     {
        //       "SKU": "WS042",
        //       "price": 11.99,
        //       "color": "White",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This white plus-size shirt is a wardrobe essential. Made with soft and breathable fabric, it's comfortable and easy to mix and match.",
        //       "name": "White Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/ffffff/000000.png&text=White+Shirt",
        //       "brand": "XYZ Shirts"
        //     },
        //     {
        //       "SKU": "WS043",
        //       "price": 12.99,
        //       "color": "Blue",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This blue plus-size shirt is great for relaxed outings. Made with lightweight fabric, it's comfortable and perfect for warm weather.",
        //       "name": "Blue Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/0000ff/ffffff.png&text=Blue+Shirt",
        //       "brand": "PQR Shirts"
        //     },
        //     {
        //       "SKU": "WS044",
        //       "price": 13.99,
        //       "color": "Pink",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This pink plus-size shirt adds a touch of femininity to any outfit. Made with soft and stretchy fabric, it's comfortable and stylish.",
        //       "name": "Pink Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/ff00ff/ffffff.png&text=Pink+Shirt",
        //       "brand": "ABC Shirts"
        //     },
        //     {
        //       "SKU": "WS045",
        //       "price": 12.49,
        //       "color": "Green",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This green plus-size shirt is perfect for a nature-inspired look. Made with eco-friendly fabric, it's comfortable and sustainable.",
        //       "name": "Green Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/00ff00/ffffff.png&text=Green+Shirt",
        //       "brand": "XYZ Shirts"
        //     },
        //     {
        //       "SKU": "WS046",
        //       "price": 11.99,
        //       "color": "Yellow",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This vibrant yellow plus-size shirt adds a pop of color to any outfit. Made with lightweight fabric, it's comfortable and cheerful.",
        //       "name": "Yellow Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/ffff00/000000.png&text=Yellow+Shirt",
        //       "brand": "PQR Shirts"
        //     },
        //     {
        //       "SKU": "WS047",
        //       "price": 13.99,
        //       "color": "Red",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This red plus-size shirt is perfect for making a bold statement. Made with soft and durable fabric, it's comfortable and eye-catching.",
        //       "name": "Red Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/ff0000/ffffff.png&text=Red+Shirt",
        //       "brand": "ABC Shirts"
        //     },
        //     {
        //       "SKU": "WS048",
        //       "price": 12.99,
        //       "color": "Purple",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This purple plus-size shirt adds a touch of elegance to your look. Made with high-quality fabric, it's comfortable and stylish.",
        //       "name": "Purple Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/800080/ffffff.png&text=Purple+Shirt",
        //       "brand": "XYZ Shirts"
        //     },
        //     {
        //       "SKU": "WS049",
        //       "price": 13.99,
        //       "color": "Orange",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This orange plus-size shirt is perfect for a vibrant and energetic look. Made with breathable fabric, it's comfortable and lively.",
        //       "name": "Orange Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/ffa500/ffffff.png&text=Orange+Shirt",
        //       "brand": "PQR Shirts"
        //     },
        //     {
        //       "SKU": "WS050",
        //       "price": 11.99,
        //       "color": "Navy",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This navy plus-size shirt is a versatile piece for any wardrobe. Made with soft and durable fabric, it's comfortable and easy to style.",
        //       "name": "Navy Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/000080/ffffff.png&text=Navy+Shirt",
        //       "brand": "ABC Shirts"
        //     },
        //     {
        //       "SKU": "WS051",
        //       "price": 12.99,
        //       "color": "Grey",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This grey plus-size shirt is a timeless classic. Made with soft and comfortable fabric, it's easy to wear and style.",
        //       "name": "Grey Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/808080/ffffff.png&text=Grey+Shirt",
        //       "brand": "XYZ Shirts"
        //     },
        //     {
        //       "SKU": "WS052",
        //       "price": 14.99,
        //       "color": "Burgundy",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This burgundy plus-size shirt adds a touch of sophistication to your outfit. Made with high-quality fabric, it's comfortable and stylish.",
        //       "name": "Burgundy Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/800000/ffffff.png&text=Burgundy+Shirt",
        //       "brand": "PQR Shirts"
        //     },
        //     {
        //       "SKU": "WS053",
        //       "price": 11.99,
        //       "color": "Teal",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This teal plus-size shirt is perfect for a refreshing and unique look. Made with comfortable fabric, it's suitable for any occasion.",
        //       "name": "Teal Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/008080/ffffff.png&text=Teal+Shirt",
        //       "brand": "ABC Shirts"
        //     },
        //     {
        //       "SKU": "WS054",
        //       "price": 13.99,
        //       "color": "Yellow",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This yellow plus-size shirt adds a cheerful touch to your outfit. Made with lightweight fabric, it's comfortable and vibrant.",
        //       "name": "Yellow Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/ffff00/000000.png&text=Yellow+Shirt",
        //       "brand": "XYZ Shirts"
        //     },
        //     {
        //       "SKU": "WS055",
        //       "price": 10.99,
        //       "color": "Green",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This green plus-size shirt is perfect for a casual and relaxed look. Made with soft and breathable fabric, it's comfortable and easy to wear.",
        //       "name": "Green Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/008000/ffffff.png&text=Green+Shirt",
        //       "brand": "PQR Shirts"
        //     },
        //     {
        //       "SKU": "WS056",
        //       "price": 12.99,
        //       "color": "Turquoise",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This turquoise plus-size shirt adds a pop of color to your wardrobe. Made with high-quality fabric, it's comfortable and eye-catching.",
        //       "name": "Turquoise Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/40e0d0/ffffff.png&text=Turquoise+Shirt",
        //       "brand": "ABC Shirts"
        //     },
        //     {
        //       "SKU": "WS057",
        //       "price": 11.99,
        //       "color": "Pink",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This pink plus-size shirt is perfect for a feminine and charming look. Made with lightweight fabric, it's comfortable and stylish.",
        //       "name": "Pink Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/ff1493/ffffff.png&text=Pink+Shirt",
        //       "brand": "XYZ Shirts"
        //     },
        //     {
        //       "SKU": "WS058",
        //       "price": 13.99,
        //       "color": "Red",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This red plus-size shirt adds a bold and confident touch to your outfit. Made with high-quality fabric, it's comfortable and stylish.",
        //       "name": "Red Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/ff0000/ffffff.png&text=Red+Shirt",
        //       "brand": "PQR Shirts"
        //     },
        //     {
        //       "SKU": "WS059",
        //       "price": 10.99,
        //       "color": "Navy",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This navy plus-size shirt is a versatile piece for any occasion. Made with soft and durable fabric, it's comfortable and easy to style.",
        //       "name": "Navy Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/000080/ffffff.png&text=Navy+Shirt",
        //       "brand": "ABC Shirts"
        //     },
        //     {
        //       "SKU": "WS060",
        //       "price": 12.99,
        //       "color": "Grey",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This grey plus-size shirt is a classic and timeless choice. Made with soft and comfortable fabric, it's easy to wear and style.",
        //       "name": "Grey Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/808080/ffffff.png&text=Grey+Shirt",
        //       "brand": "XYZ Shirts"
        //     },
        //     {
        //       "SKU": "WS061",
        //       "price": 14.99,
        //       "color": "Black",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This black plus-size shirt is a wardrobe essential. Made with comfortable fabric, it's versatile and easy to mix and match.",
        //       "name": "Black Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/000000/ffffff.png&text=Black+Shirt",
        //       "brand": "PQR Shirts"
        //     },
        //     {
        //       "SKU": "WS062",
        //       "price": 11.99,
        //       "color": "White",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This white plus-size shirt is perfect for a clean and polished look. Made with soft and breathable fabric, it's comfortable and stylish.",
        //       "name": "White Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/ffffff/000000.png&text=White+Shirt",
        //       "brand": "ABC Shirts"
        //     },
        //     {
        //       "SKU": "WS063",
        //       "price": 12.99,
        //       "color": "Blue",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This blue plus-size shirt is great for a casual and relaxed look. Made with lightweight fabric, it's comfortable and perfect for warm weather.",
        //       "name": "Blue Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/0000ff/ffffff.png&text=Blue+Shirt",
        //       "brand": "XYZ Shirts"
        //     },
        //     {
        //       "SKU": "WS064",
        //       "price": 13.99,
        //       "color": "Purple",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This purple plus-size shirt adds a touch of elegance to your outfit. Made with soft and stretchy fabric, it's comfortable and stylish.",
        //       "name": "Purple Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/800080/ffffff.png&text=Purple+Shirt",
        //       "brand": "PQR Shirts"
        //     },
        //     {
        //       "SKU": "WS065",
        //       "price": 12.49,
        //       "color": "Pink",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This pink plus-size shirt adds a feminine touch to any outfit. Made with comfortable fabric, it's stylish and versatile.",
        //       "name": "Pink Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/ff1493/ffffff.png&text=Pink+Shirt",
        //       "brand": "ABC Shirts"
        //     },
        //     {
        //       "SKU": "WS066",
        //       "price": 11.99,
        //       "color": "Green",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This green plus-size shirt is perfect for a fresh and vibrant look. Made with soft and breathable fabric, it's comfortable and eye-catching.",
        //       "name": "Green Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/008000/ffffff.png&text=Green+Shirt",
        //       "brand": "XYZ Shirts"
        //     },
        //     {
        //       "SKU": "WS067",
        //       "price": 13.99,
        //       "color": "Orange",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This orange plus-size shirt adds a pop of color to your outfit. Made with high-quality fabric, it's comfortable and stylish.",
        //       "name": "Orange Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/ffa500/ffffff.png&text=Orange+Shirt",
        //       "brand": "PQR Shirts"
        //     },
        //     {
        //       "SKU": "WS068",
        //       "price": 10.99,
        //       "color": "Yellow",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This yellow plus-size shirt is perfect for a cheerful and vibrant look. Made with lightweight fabric, it's comfortable and eye-catching.",
        //       "name": "Yellow Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/ffff00/000000.png&text=Yellow+Shirt",
        //       "brand": "ABC Shirts"
        //     },
        //     {
        //       "SKU": "WS069",
        //       "price": 12.99,
        //       "color": "Red",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This red plus-size shirt adds a bold and confident touch to your outfit. Made with comfortable fabric, it's stylish and versatile.",
        //       "name": "Red Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/ff0000/ffffff.png&text=Red+Shirt",
        //       "brand": "XYZ Shirts"
        //     },
        //     {
        //       "SKU": "WS070",
        //       "price": 11.99,
        //       "color": "Blue",
        //       "sizes": ["XL", "XXL", "XXXL"],
        //       "description": "This blue plus-size shirt is great for a casual and relaxed look. Made with soft and breathable fabric, it's comfortable and easy to wear.",
        //       "name": "Blue Plus-Size Shirt",
        //       "image": "https://dummyimage.com/300x300/0000ff/ffffff.png&text=Blue+Shirt",
        //       "brand": "PQR Shirts"
        //     }
        //   ]
        // const womenShirts = [
        //         {
        //           "SKU": "WS021",
        //           "price": 8.99,
        //           "color": "Black",
        //           "sizes": ["S", "M"],
        //           "description": "This simple black shirt is perfect for everyday wear. Made with comfortable fabric, it's versatile and easy to style.",
        //           "name": "Black Everyday Shirt",
        //           "image": "https://dummyimage.com/300x300/000000/ffffff.png&text=Black+Shirt",
        //           "brand": "ABC Shirts"
        //         },
        //         {
        //           "SKU": "WS022",
        //           "price": 7.99,
        //           "color": "White",
        //           "sizes": ["S", "L"],
        //           "description": "This basic white shirt is a wardrobe essential. Made with soft and breathable fabric, it's comfortable and easy to mix and match.",
        //           "name": "White Basic Shirt",
        //           "image": "https://dummyimage.com/300x300/ffffff/000000.png&text=White+Shirt",
        //           "brand": "XYZ Shirts"
        //         },
        //         {
        //           "SKU": "WS023",
        //           "price": 6.99,
        //           "color": "Blue",
        //           "sizes": ["M", "L"],
        //           "description": "This casual blue shirt is great for relaxed outings. Made with lightweight fabric, it's comfortable and perfect for warm weather.",
        //           "name": "Blue Casual Shirt",
        //           "image": "https://dummyimage.com/300x300/0000ff/ffffff.png&text=Blue+Shirt",
        //           "brand": "PQR Shirts"
        //         },
        //         {
        //           "SKU": "WS024",
        //           "price": 9.99,
        //           "color": "Pink",
        //           "sizes": ["S", "M", "L"],
        //           "description": "This pink shirt adds a touch of femininity to any outfit. Made with soft and stretchy fabric, it's comfortable and stylish.",
        //           "name": "Pink Feminine Shirt",
        //           "image": "https://dummyimage.com/300x300/ff00ff/ffffff.png&text=Pink+Shirt",
        //           "brand": "ABC Shirts"
        //         },
        //         {
        //           "SKU": "WS025",
        //           "price": 8.49,
        //           "color": "Green",
        //           "sizes": ["M", "L"],
        //           "description": "This green shirt is perfect for a nature-inspired look. Made with eco-friendly fabric, it's comfortable and sustainable.",
        //           "name": "Green Eco-Shirt",
        //           "image": "https://dummyimage.com/300x300/00ff00/ffffff.png&text=Green+Shirt",
        //           "brand": "XYZ Shirts"
        //         },
        //         {
        //           "SKU": "WS026",
        //           "price": 7.99,
        //           "color": "Yellow",
        //           "sizes": ["S", "M"],
        //           "description": "This vibrant yellow shirt adds a pop of color to any outfit. Made with lightweight fabric, it's comfortable and cheerful.",
        //           "name": "Yellow Vibrant Shirt",
        //           "image": "https://dummyimage.com/300x300/ffff00/000000.png&text=Yellow+Shirt",
        //           "brand": "PQR Shirts"
        //         },
        //         {
        //           "SKU": "WS027",
        //           "price": 9.99,
        //           "color": "Red",
        //           "sizes": ["L", "XL"],
        //           "description": "This red shirt is perfect for making a bold statement. Made with soft and durable fabric, it's comfortable and eye-catching.",
        //           "name": "Red Statement Shirt",
        //           "image": "https://dummyimage.com/300x300/ff0000/ffffff.png&text=Red+Shirt",
        //           "brand": "ABC Shirts"
        //         },
        //         {
        //           "SKU": "WS028",
        //           "price": 6.99,
        //           "color": "Purple",
        //           "sizes": ["S", "L"],
        //           "description": "This purple shirt adds a touch of elegance to your look. Made with high-quality fabric, it's comfortable and stylish.",
        //           "name": "Purple Elegant Shirt",
        //           "image": "https://dummyimage.com/300x300/800080/ffffff.png&text=Purple+Shirt",
        //           "brand": "XYZ Shirts"
        //         },
        //         {
        //           "SKU": "WS029",
        //           "price": 9.99,
        //           "color": "Orange",
        //           "sizes": ["M", "L"],
        //           "description": "This orange shirt is perfect for a vibrant and energetic look. Made with breathable fabric, it's comfortable and lively.",
        //           "name": "Orange Energetic Shirt",
        //           "image": "https://dummyimage.com/300x300/ffa500/ffffff.png&text=Orange+Shirt",
        //           "brand": "PQR Shirts"
        //         },
        //         {
        //           "SKU": "WS030",
        //           "price": 7.99,
        //           "color": "Navy",
        //           "sizes": ["S", "M"],
        //           "description": "This navy shirt is a versatile piece for any wardrobe. Made with soft and durable fabric, it's comfortable and easy to style.",
        //           "name": "Navy Versatile Shirt",
        //           "image": "https://dummyimage.com/300x300/000080/ffffff.png&text=Navy+Shirt",
        //           "brand": "ABC Shirts"
        //         },
        //         {
        //           "SKU": "WS031",
        //           "price": 6.99,
        //           "color": "Grey",
        //           "sizes": ["L", "XL"],
        //           "description": "This grey shirt is a timeless classic. Made with soft and comfortable fabric, it's easy to wear and style.",
        //           "name": "Grey Classic Shirt",
        //           "image": "https://dummyimage.com/300x300/808080/ffffff.png&text=Grey+Shirt",
        //           "brand": "XYZ Shirts"
        //         },
        //         {
        //           "SKU": "WS032",
        //           "price": 8.99,
        //           "color": "Burgundy",
        //           "sizes": ["S", "M"],
        //           "description": "This burgundy shirt adds a touch of sophistication to your outfit. Made with high-quality fabric, it's comfortable and stylish.",
        //           "name": "Burgundy Sophisticated Shirt",
        //           "image": "https://dummyimage.com/300x300/800000/ffffff.png&text=Burgundy+Shirt",
        //           "brand": "PQR Shirts"
        //         },
        //         {
        //           "SKU": "WS033",
        //           "price": 7.99,
        //           "color": "Teal",
        //           "sizes": ["M", "L"],
        //           "description": "This teal shirt is perfect for a refreshing and unique look. Made with comfortable fabric, it's suitable for any occasion.",
        //           "name": "Teal Refreshing Shirt",
        //           "image": "https://dummyimage.com/300x300/008080/ffffff.png&text=Teal+Shirt",
        //           "brand": "ABC Shirts"
        //         },
        //         {
        //           "SKU": "WS034",
        //           "price": 9.99,
        //           "color": "Yellow",
        //           "sizes": ["S", "L"],
        //           "description": "This yellow shirt adds a cheerful touch to your outfit. Made with lightweight fabric, it's comfortable and vibrant.",
        //           "name": "Yellow Cheerful Shirt",
        //           "image": "https://dummyimage.com/300x300/ffff00/000000.png&text=Yellow+Shirt",
        //           "brand": "XYZ Shirts"
        //         },
        //         {
        //           "SKU": "WS035",
        //           "price": 6.99,
        //           "color": "Green",
        //           "sizes": ["M", "XL"],
        //           "description": "This green shirt is perfect for a casual and relaxed look. Made with soft and breathable fabric, it's comfortable and easy to wear.",
        //           "name": "Green Casual Shirt",
        //           "image": "https://dummyimage.com/300x300/008000/ffffff.png&text=Green+Shirt",
        //           "brand": "PQR Shirts"
        //         },
        //         {
        //           "SKU": "WS036",
        //           "price": 8.99,
        //           "color": "Turquoise",
        //           "sizes": ["S", "L"],
        //           "description": "This turquoise shirt adds a pop of color to your wardrobe. Made with high-quality fabric, it's comfortable and eye-catching.",
        //           "name": "Turquoise Colorful Shirt",
        //           "image": "https://dummyimage.com/300x300/40e0d0/ffffff.png&text=Turquoise+Shirt",
        //           "brand": "ABC Shirts"
        //         },
        //         {
        //           "SKU": "WS037",
        //           "price": 7.99,
        //           "color": "Pink",
        //           "sizes": ["M", "XL"],
        //           "description": "This pink shirt is perfect for a feminine and charming look. Made with lightweight fabric, it's comfortable and stylish.",
        //           "name": "Pink Feminine Shirt",
        //           "image": "https://dummyimage.com/300x300/ff1493/ffffff.png&text=Pink+Shirt",
        //           "brand": "XYZ Shirts"
        //         },
        //         {
        //           "SKU": "WS038",
        //           "price": 9.99,
        //           "color": "Red",
        //           "sizes": ["S", "L"],
        //           "description": "This red shirt adds a bold and confident touch to your outfit. Made with high-quality fabric, it's comfortable and stylish.",
        //           "name": "Red Confident Shirt",
        //           "image": "https://dummyimage.com/300x300/ff0000/ffffff.png&text=Red+Shirt",
        //           "brand": "PQR Shirts"
        //         },
        //         {
        //           "SKU": "WS039",
        //           "price": 6.99,
        //           "color": "Navy",
        //           "sizes": ["M", "XL"],
        //           "description": "This navy shirt is a versatile piece for any wardrobe. Made with soft and durable fabric, it's comfortable and easy to style.",
        //           "name": "Navy Everyday Shirt",
        //           "image": "https://dummyimage.com/300x300/000080/ffffff.png&text=Navy+Shirt",
        //           "brand": "ABC Shirts"
        //         },
        //         {
        //           "SKU": "WS040",
        //           "price": 8.99,
        //           "color": "Grey",
        //           "sizes": ["S", "L"],
        //           "description": "This grey shirt is a timeless classic. Made with soft and comfortable fabric, it's easy to wear and style.",
        //           "name": "Grey Classic Shirt",
        //           "image": "https://dummyimage.com/300x300/808080/ffffff.png&text=Grey+Shirt",
        //           "brand": "XYZ Shirts"
        //         }
        // ]
        // const womenShirts = [
        //         {
        //           "SKU": "WS001",
        //           "price": 29.99,
        //           "color": "Blue",
        //           "sizes": ["S", "M", "L"],
        //           "description": "This stylish blue shirt is perfect for casual outings. Made with high-quality cotton, it's comfortable to wear and easy to care for.",
        //           "name": "Blue Casual Shirt",
        //           "image": "https://dummyimage.com/300x300/0000ff/ffffff.png&text=Blue+Shirt",
        //           "brand": "ABC Shirts"
        //         },
        //         {
        //           "SKU": "WS002",
        //           "price": 39.99,
        //           "color": "White",
        //           "sizes": ["S", "M", "L", "XL"],
        //           "description": "This elegant white shirt is perfect for formal occasions. Made with premium quality cotton, it's comfortable and breathable.",
        //           "name": "White Formal Shirt",
        //           "image": "https://dummyimage.com/300x300/ffffff/000000.png&text=White+Shirt",
        //           "brand": "XYZ Shirts"
        //         },
        //         {
        //           "SKU": "WS003",
        //           "price": 24.99,
        //           "color": "Green",
        //           "sizes": ["S", "M", "L"],
        //           "description": "This trendy green shirt is perfect for a day out with friends. Made with soft and durable fabric, it's easy to wear and style.",
        //           "name": "Green Trendy Shirt",
        //           "image": "https://dummyimage.com/300x300/00ff00/ffffff.png&text=Green+Shirt",
        //           "brand": "PQR Shirts"
        //         },
        //         {
        //           "SKU": "WS004",
        //           "price": 44.99,
        //           "color": "Red",
        //           "sizes": ["S", "M", "L", "XL"],
        //           "description": "This classic red shirt is perfect for any occasion. Made with premium quality fabric, it's comfortable and stylish.",
        //           "name": "Red Classic Shirt",
        //           "image": "https://dummyimage.com/300x300/ff0000/ffffff.png&text=Red+Shirt",
        //           "brand": "ABC Shirts"
        //         },
        //         {
        //           "SKU": "WS005",
        //           "price": 19.99,
        //           "color": "Yellow",
        //           "sizes": ["S", "M"],
        //           "description": "This cheerful yellow shirt is perfect for a summer day. Made with lightweight and breathable fabric, it's comfortable and fun to wear.",
        //           "name": "Yellow Summer Shirt",
        //           "image": "https://dummyimage.com/300x300/ffff00/000000.png&text=Yellow+Shirt",
        //           "brand": "XYZ Shirts"
        //         },
        //         {
        //           "SKU": "WS006",
        //           "price": 34.99,
        //           "color": "Pink",
        //           "sizes": ["M", "L", "XL"],
        //           "description": "This stylish pink shirt is perfect for a night out. Made with high-quality fabric, it's comfortable and trendy.",
        //           "name": "Pink Night Out Shirt",
        //           "image": "https://dummyimage.com/300x300/ff00ff/ffffff.png&text=Pink+Shirt",
        //           "brand": "PQR Shirts"
        //         },
        //         {
        //             "SKU": "WS007",
        //             "price": 28.99,
        //             "color": "Black",
        //             "sizes": ["S", "L", "XL"],
        //             "description": "This classic black shirt is perfect for any occasion. Made with soft and durable fabric, it's comfortable and versatile.",
        //             "name": "Black Classic Shirt",
        //             "image": "https://dummyimage.com/300x300/000000/ffffff.png&text=Black+Shirt",
        //             "brand": "ABC Shirts"
        //           },
        //           {
        //             "SKU": "WS008",
        //             "price": 36.99,
        //             "color": "Purple",
        //             "sizes": ["S", "M", "L"],
        //             "description": "This trendy purple shirt is perfect for a day out with friends. Made with high-quality fabric, it's comfortable and stylish.",
        //             "name": "Purple Trendy Shirt",
        //             "image": "https://dummyimage.com/300x300/800080/ffffff.png&text=Purple+Shirt",
        //             "brand": "XYZ Shirts"
        //           },
        //           {
        //             "SKU": "WS009",
        //             "price": 22.99,
        //             "color": "Orange",
        //             "sizes": ["M", "L", "XL"],
        //             "description": "This bright orange shirt is perfect for adding some color to your outfit. Made with lightweight fabric, it's comfortable and fun to wear.",
        //             "name": "Orange Fun Shirt",
        //             "image": "https://dummyimage.com/300x300/ffa500/ffffff.png&text=Orange+Shirt",
        //             "brand": "PQR Shirts"
        //           },
        //           {
        //             "SKU": "WS010",
        //             "price": 31.99,
        //             "color": "Navy",
        //             "sizes": ["S", "M", "L", "XL"],
        //             "description": "This classic navy shirt is a wardrobe staple. Made with high-quality fabric, it's comfortable and versatile.",
        //             "name": "Navy Classic Shirt",
        //             "image": "https://dummyimage.com/300x300/000080/ffffff.png&text=Navy+Shirt",
        //             "brand": "ABC Shirts"
        //           },
        //           {
        //             "SKU": "WS011",
        //             "price": 25.99,
        //             "color": "Grey",
        //             "sizes": ["S", "M", "L"],
        //             "description": "This simple grey shirt is perfect for a casual day out. Made with soft and comfortable fabric, it's easy to wear and style.",
        //             "name": "Grey Casual Shirt",
        //             "image": "https://dummyimage.com/300x300/808080/ffffff.png&text=Grey+Shirt",
        //             "brand": "XYZ Shirts"
        //           },
        //           {
        //             "SKU": "WS012",
        //             "price": 47.99,
        //             "color": "Burgundy",
        //             "sizes": ["S", "M", "L", "XL"],
        //             "description": "This elegant burgundy shirt is perfect for formal events. Made with premium quality fabric, it's comfortable and stylish.",
        //             "name": "Burgundy Formal Shirt",
        //             "image": "https://dummyimage.com/300x300/800000/ffffff.png&text=Burgundy+Shirt",
        //             "brand": "PQR Shirts"
        //           },
        //           {
        //             "SKU": "WS013",
        //             "price": 33.99,
        //             "color": "Teal",
        //             "sizes": ["M", "L", "XL"],
        //             "description": "This stylish teal shirt is perfect for a night out. Made with high-quality fabric, it's comfortable and eye-catching.",
        //             "name": "Teal Night Out Shirt",
        //             "image": "https://dummyimage.com/300x300/008080/ffffff.png&text=Teal+Shirt",
        //             "brand": "ABC Shirts"
        //           },
        //           {
        //             "SKU": "WS014",
        //             "price": 19.99,
        //             "color": "Yellow",
        //             "sizes": ["S", "M"],
        //             "description": "This bright yellow shirt is perfect for a sunny day. Made with lightweight fabric, it's comfortable and cheerful.",
        //             "name": "Yellow Sunny Shirt",
        //             "image": "https://dummyimage.com/300x300/ffff00/000000.png&text=Yellow+Shirt",
        //             "brand": "XYZ Shirts"
        //           },
        //           {
        //             "SKU": "WS015",
        //             "price": 42.99,
        //             "color": "Magenta",
        //             "sizes": ["L", "XL"],
        //             "description": "This elegant magenta shirt is perfect for a special occasion. Made with premium quality fabric, it's comfortable and sophisticated.",
        //             "name": "Magenta Special Occasion Shirt",
        //             "image": "https://dummyimage.com/300x300/ff00ff/ffffff.png&text=Magenta+Shirt",
        //             "brand": "PQR Shirts"
        //           },
        //           {
        //             "SKU": "WS016",
        //             "price": 27.99,
        //             "color": "Green",
        //             "sizes": ["S", "M", "L"],
        //             "description": "This classic green shirt is perfect for a casual day out. Made with soft and comfortable fabric, it's easy to wear and style.",
        //             "name": "Green Casual Shirt",
        //             "image": "https://dummyimage.com/300x300/008000/ffffff.png&text=Green+Shirt",
        //             "brand": "ABC Shirts"
        //           },
        //           {
        //             "SKU": "WS017",
        //             "price": 39.99,
        //             "color": "Turquoise",
        //             "sizes": ["M", "L", "XL"],
        //             "description": "This unique turquoise shirt is perfect for making a statement. Made with high-quality fabric, it's comfortable and eye-catching.",
        //             "name": "Turquoise Statement Shirt",
        //             "image": "https://dummyimage.com/300x300/40e0d0/ffffff.png&text=Turquoise+Shirt",
        //             "brand": "XYZ Shirts"
        //           },
        //           {
        //             "SKU": "WS018",
        //             "price": 23.99,
        //             "color": "Pink",
        //             "sizes": ["S", "M"],
        //             "description": "This cute pink shirt is perfect for a fun day out. Made with lightweight fabric, it's comfortable and playful.",
        //             "name": "Pink Fun Shirt",
        //             "image": "https://dummyimage.com/300x300/ff1493/ffffff.png&text=Pink+Shirt",
        //             "brand": "PQR Shirts"
        //           },
        //           {
        //             "SKU": "WS019",
        //             "price": 45.99,
        //             "color": "Red",
        //             "sizes": ["M", "L", "XL"],
        //             "description": "This stunning red shirt is perfect for a formal occasion. Made with high-quality fabric, it's comfortable and stylish.",
        //             "name": "Red Formal Shirt",
        //             "image": "https://dummyimage.com/300x300/ff0000/ffffff.png&text=Red+Shirt",
        //             "brand": "ABC Shirts"
        //           },
        //           {
        //             "SKU": "WS020",
        //             "price": 29.99,
        //             "color": "Navy",
        //             "sizes": ["S", "M", "L", "XL"],
        //             "description": "This classic navy shirt is perfect for a versatile wardrobe. Made with soft and durable fabric, it's comfortable and easy to style.",
        //             "name": "Navy Everyday Shirt",
        //             "image": "https://dummyimage.com/300x300/000080/ffffff.png&text=Navy+Shirt",
        //             "brand": "XYZ Shirts"
        //           }                
        //   ];

        // womenShirts.map(async (item)=> {
        //     const nycRef = doc(db, "product", `${item.SKU}`);
        //     batch.set(nycRef, item);
        //   });

        // const result = await batch.commit();
        // console.log('result', result)
        // res.status(200).send({data:"HELLO"})
        /* ADD DATA */

        /* UPDATE to ALL PRODUCTS */

        // // Get a reference to the Firestore collection
        // const collectionRef = collection(db, 'product');

        // // Get all documents in the collection
        // const querySnapshot = await getDocs(collectionRef);

        // // Create a batched write operation
        // const batch = writeBatch(db);

        // // Iterate over the documents and update or set each one
        // querySnapshot.forEach((doc) => {
        //   const docRef = doc.ref;
        //   batch.update(docRef, { clickedCount: 0 });
        //   // OR
        //   // batch.set(docRef, { /* fields to set */ }, { merge: true });
        // });

        // // Commit the batched write operation
        // await batch.commit();

        /* UPDATE to ALL PRODUCTS */

    } catch (err) {
        console.log('err', err)
    }
}