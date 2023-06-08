import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSession, getSession } from 'next-auth/react'
import { PlusIcon, ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/solid';
import { collection, doc, onSnapshot, getDocs, query, orderBy } from "firebase/firestore";
import { default as db } from '../../firebase';

function Profile({ originalArray }) {
    const { data: session } = useSession();
    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
        default: ""
    });
    const [addressArray, setAddressArray] = useState(originalArray);
    const [fillAddress, setfillAddress] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event);
        axios.post('/api/changeDefaultAddress', { session, defaultValue: event })
    };

    const fillAddressFunc = () => {
        setfillAddress(true)
    }

    const addAddress = (address) => {
        axios.post('/api/saveAddress', { session, address })
        setAddress({
            street: "",
            city: "",
            state: "",
            pincode: "",
            landmark: "",
            default: ""
        })
    }

    const removeAddress = (id) => {
        axios.post('/api/removeAddress', { session, id })
    }

    useEffect(() => {
        if (session) {
            const fetchAddress = async () => {
                try {
                    const userAddressRef = collection(db, "users");
                    const usersDocRef = doc(userAddressRef, session.user.email);
                    const addressRef = collection(usersDocRef, 'address');
                    onSnapshot(addressRef, (snapshot) => {
                        const array = []
                        snapshot.forEach((docs) => {
                            const data = {
                                id: docs.id,
                                ...docs.data()
                            };
                            array.push(data);
                        })

                        if (array.length) {
                            array.sort((a, b) => a.timestamp - b.timestamp);
                            setAddressArray(array)
                        }

                        setAddressArray((prevProduct) => {
                            let updatedProductArray = [...prevProduct];

                            snapshot.docChanges().forEach((change) => {
                                const docData = change.doc.data().default;
                                const id = change.doc.id
                                const data = {
                                    id: change.doc.id,
                                    ...change.doc.data()
                                }
                                console.log('data', data)
                                const matchingProductIndex = updatedProductArray.findIndex((item) => item.id === id);

                                if (matchingProductIndex !== -1) {
                                    const updatedProduct = { ...updatedProductArray[matchingProductIndex] };

                                    updatedProduct.default = docData

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
            fetchAddress();
        }
    }, [selectedOption]);
    return (
        <>
            <div
            className='font-mono m-5'
        >
            {session ? (
                <>
                    <div
                        className='text-wendge text-sm p-6 space-y-2'
                    >
                        <h1
                            className='font-black text-lg mb-7'
                        >Profile</h1>
                        <p>{`Name: ${session.user.name}`}</p>
                        <p>{`Email: ${session.user.email}`}</p>
                    </div>


                    <div
                        className='flex justify-center items-center mr-10 ml-8'
                    >  <h1
                        className=' text-wendge text-lg mt-1 ml-4 p-5'
                    >Saved Addresses</h1>

                    </div>
                    <div
                        className='ml-12 mr-12 space-y-2'
                    > {addressArray ? addressArray.map((option) => (
                        <div key={option.id}
                            className={`${option.default ? 'bg-gray-100' : 'bg-white'} rounded-md p-3 text-wendge`}
                        >
                            <div
                                className='flex'>
                                <p
                                    className='itlaic text-xs text-wendge ml-2 mb-2'
                                >{option.default ? "Default" : ""}</p>
                                <button
                                    className='ml-auto mr-1 mb-5'
                                    onClick={() => removeAddress(option.id)}>
                                    <TrashIcon
                                        className='h-4 w-4'
                                    />
                                </button>
                            </div>

                            <label className="inline-flex items-center ml-2 text-sm">
                                <input
                                    className="hidden"
                                    type="radio"
                                    name="option"
                                    value={option.id}
                                    checked={option.default}
                                    onChange={() => handleOptionChange(option.id)}
                                />
                                <span className="relative mr-6 flex p-2  items-center justify-center w-5 h-5 rounded-full border border-gray-300 bg-white">
                                    {option.default && <span className="absolute w-3 h-3 bg-wendge rounded-full"></span>}
                                </span>
                                {option.street}, {option.city}, {option.state}, {option.landmark}, {option.pincode}

                            </label>


                        </div>

                    )) : ""}

                        {fillAddress ?
                            <div
                                className='flex items-start'
                            >
                                <div
                                    className='mt-10 ml-8 mb-10 border-1 p-7 pr-5 rounded-2xl bg-gray-50'
                                >
                                    <div
                                        className='bg-gray-100 rounded-full h-7 w-7 flex items-center justify-center'
                                    >
                                        <ArrowLeftIcon
                                            onClick={() => setfillAddress(false)}
                                            className="h-4 w-4 cursor-pointer text-wendge text-extrabold"
                                        />
                                    </div>

                                    <form
                                        className='text-wendge ml-12 mr-12 mt-7 z-10 text-sm space-y-6 mb-6'
                                        onSubmit={() => {
                                            setfillAddress(false)
                                            addAddress(address)
                                        }}>
                                        <div
                                        >
                                            <h2
                                                className='mb-6 text-base'
                                            >Fill in the address below: </h2>
                                            <label
                                                className='text-sm'
                                                htmlFor="street">Street:</label>
                                            <input
                                                className='px-4 py-1 ml-8 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-1 focus:ring-wendge focus:border-wendge'
                                                type="text"
                                                id="street"
                                                name="street"
                                                value={address.street}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <label
                                                className='text-sm'
                                                htmlFor="city">City:</label>
                                            <input
                                                className='px-4 py-1 ml-11 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-1 focus:ring-wendge focus:border-wendge'
                                                type="text"
                                                id="city"
                                                name="city"
                                                value={address.city}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <label
                                                className='text-sm'
                                                htmlFor="state">State:</label>
                                            <input
                                                className='px-4 py-1 ml-9 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-1 focus:ring-wendge focus:border-wendge'
                                                type="text"
                                                id="state"
                                                name="state"
                                                value={address.state}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <label
                                                className='text-sm'
                                                htmlFor="landmark">Landmark:</label>
                                            <input
                                                className='px-4 py-1 ml-2 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-1 focus:ring-wendge focus:border-wendge'
                                                type="text"
                                                id="landmark"
                                                name="landmark"
                                                value={address.landmark}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <label
                                                className='text-sm'
                                                htmlFor="pincode">Pincode:</label>
                                            <input
                                                className='px-4 py-1 ml-5 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-1 focus:ring-wendge focus:border-wendge'
                                                type="text"
                                                id="pincode"
                                                name="pincode"
                                                value={address.pincode}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div
                                            className='flex justify-center items-center mt-2'
                                        >
                                            <button
                                                className='px-5 py-1 rounded-full bg-wendge text-gray-300'
                                                type="submit">Save Address</button>
                                        </div>

                                    </form>
                                </div>
                            </div>

                            : <div
                                className='flex ml-4 justify-start'
                            >
                                <button
                                    onClick={() => fillAddressFunc()}
                                    className='flex flex-row px-4 py-2 mt-3  bg-wendge items-center rounded-full'
                                >
                                    <PlusIcon
                                        className='h-3 w-3 font-black text-gray-200'
                                    />
                                    <p
                                        className='ml-1 text-sm font-mono text-gray-200'
                                    >Add Address</p>
                                </button>
                            </div>
                        }
                    </div>

                </>
            )
                : "Please Login"}
        </div>
        </>
        
    )
}

export default Profile

export async function getServerSideProps(context) {
    // Get the users logged in credentials
    const session = await getSession(context);
    if (!session) {
        return {
            props: {}
        }
    }
    const allAddress = []
    const userAddressRef = collection(db, "users");
    const usersDocRef = doc(userAddressRef, session?.user?.email);
    const addressRef = collection(usersDocRef, "address");

    const querySnapshot1 = await getDocs(query(addressRef, orderBy('timestamp', 'asc')));

    querySnapshot1.forEach((doc) => {
        try {
            const data = {
                id: doc.id,
                street: doc.data().street,
                city: doc.data().city,
                state: doc.data().state,
                landmark: doc.data().landmark,
                pincode: doc.data().pincode,
                default: doc.data().default,
            }
            allAddress.push(data)
        } catch (e) {
            console.log('e', e)
        }

    });

    return {
        props: {
            originalArray: allAddress
        },
    }
}
