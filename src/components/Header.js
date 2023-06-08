import { useState, useEffect } from 'react'
import useCollectionListener from './collectionListener';
import useCartonListener from './cartonListener';
import Image from "next/image";
import ArrowRightOnRectangleIcon from '@heroicons/react/24/outline/ArrowRightOnRectangleIcon'
import UserPlusIcon from '@heroicons/react/24/outline/UserPlusIcon';
import ArchiveBoxIcon from '@heroicons/react/24/solid/ArchiveBoxIcon';
import StarIcon from '@heroicons/react/24/solid/HeartIcon';
import ListBulletIcon from '@heroicons/react/24/solid/ListBulletIcon';
import QueueListIcon from '@heroicons/react/24/solid/QueueListIcon';
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation';
import { selectBasketItems } from "../slices/basketSlice";
import { useSelector } from "react-redux";
import { query } from 'firebase/firestore';
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon';
import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';

function Header() {

    const { data: session } = useSession()
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const router = useRouter();
    const basketItems = useSelector(selectBasketItems);
    const [collectionTotal, setCollectionTotal] = useState(0);
    const [cartonTotal, setCartonTotal] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [expanded, setExpanded] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    useCollectionListener(session, setCollectionTotal);
    useCartonListener(session, setCartonTotal);
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 570);
        };

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Initial check for screen size
        handleResize();

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="overflow-x-hidden min-w-0 font-mono">
            {/* Header code */}
            <header
                className='sticky top-0 p-4 bg-white min-w-0 overflow-x-hidden'
                onMouseLeave={() => setDropdownOpen(false)}>
                {/* Top NavBar*/}
                <div className="flex items-center bg-white space-x-4 ">
                    <div className={`mt-2 flex items-center ${setIsSmallScreen ? 'mr-auto' : 'flex-grow'}`}>
                        {!expanded && (<Image
                            onClick={() => router.push('/')}
                            key={Math.random()}
                            src='https://hope-faith-12345678.s3.us-west-2.amazonaws.com/Robes+Logo.png'
                            width={90}
                            height={40}
                            className="cursor-pointer ml-auto"
                            alt=""
                        />)}
                    </div>
                    {/* Search Bar */}
                    {expanded ? (
                        <form className="flex flex-grow"
                        >
                            <div>

                            </div>
                            <button
                                onClick={() => setExpanded(false)}
                                className="mr-2 rounded-full bg-gray-100"
                            >
                                <ArrowLeftIcon className="h-4 w-4 cursor-pointer mr-3 ml-3 text-wendge text-extrabold" />
                            </button>
                            <input
                                type="search"
                                value={searchQuery}
                                placeholder="Search...."
                                onChange={(event) => {
                                    setSearchQuery(event.target.value)
                                    const encodeSearchQuery = encodeURI(event.target.value)
                                    if (event.target.value !== '' && event.target.value !== null) {
                                        router.push(`/search?q=${encodeSearchQuery}`);
                                    } else if (event.target.value === '') {
                                        setExpanded(false)
                                        router.push('/');

                                    }
                                }
                                }
                                className="flex-grow p-2.5 rounded-full border-2 border-wendge focus:outline-none focus:border-wendge text-sm bg-transparent text-black"
                            />
                        </form>
                    ) : (

                        !isSmallScreen ? <>
                            <input
                                type="search"
                                value={searchQuery}
                                placeholder="Search...."
                                onChange={(event) => {
                                    setSearchQuery(event.target.value)
                                    const encodeSearchQuery = encodeURI(event.target.value)
                                    if (event.target.value !== '' && event.target.value !== null) {
                                        router.push(`/search?q=${encodeSearchQuery}`);
                                    } else if (event.target.value === '') {
                                        router.push('/');
                                    }
                                }
                                }
                                className="flex-grow p-2.5 rounded-full border-2 border-wendge focus:outline-none focus:border-wendge text-sm bg-transparent text-black"
                            />
                        </> : <button
                            onClick={() => setExpanded(true)}
                            className="p-1 rounded-lg text-black"
                        >
                            <MagnifyingGlassIcon className="h-5 w-5" />
                        </button>



                    )}

                    {!expanded && (<div className="text-white flex items-center text-xs space-x-6 justify-end">
                        <div onClick={() => session && router.push('/orders')} className="relative link flex flex-col items-center">
                            <ListBulletIcon
                                className='h-8 text-black'
                            />
                            <p className="hidden md:inline font-bold md:text-xs mt-2 text-wendge">Orders</p>
                        </div>
                        <div onClick={() => router.push('/collection')} className="relative link flex flex-col items-center">
                            <StarIcon
                                className='h-8 text-black'
                            />
                            <span className="absolute top-0 right-0 md:right-10 h-4 w-4 bg-wendge  text-gray-200 text-center rounded-full fold-bold" >
                                {collectionTotal}
                            </span>
                            <p className="hidden md:inline font-bold md:text-xs text-wendge mt-2">Collection</p>
                        </div>
                        <div onClick={() => router.push('/checkout')} className="relative link flex flex-col items-center">
                            <ArchiveBoxIcon
                                className="h-8 text-black" />
                            <span className="absolute top-0 right-0 md:right-7 h-4 w-4 bg-wendge text-gray-200 text-center rounded-full fold-bold" >
                                {cartonTotal}
                            </span>
                            <p className="hidden md:inline font-bold md:text-xs mt-2 text-wendge">Carton</p>
                        </div>
                        <div
                            onClick={!session ? signIn : () => setDropdownOpen(true)}
                            className="relative"
                            onMouseEnter={() => setDropdownOpen(true)}
                        >
                            <div
                                className="flex flex-row items-center space-x-2 cursor-pointer link">
                                {!session ? (
                                    <div
                                        onClick={signIn}
                                        className="flex justify-center items-center w-12 h-12 bg-wendge text-white font-bold text-lg rounded-full">
                                        <UserPlusIcon height={33} width={33} />
                                    </div>
                                ) : (

                                    <a
                                        href="/profile"
                                        className="block w-12 h-12 rounded-full overflow-hidden cursor-pointer">
                                        <div
                                            className="flex justify-center items-center w-full h-full bg-wendge text-gray-200 text-lg rounded-full">
                                            {session ? session.user.name.substring(0, 1).toUpperCase() : ""}
                                        </div>
                                    </a>
                                )}
                            </div>
                            {session && dropdownOpen && (
                                <div
                                
                                    onMouseEnter={() => setDropdownOpen(true)}
                                    onMouseLeave={() => setDropdownOpen(false)}
                                    className="absolute top-15 right-0 w-26 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-100">
                                    <div className="flex flex-col items-center justify-between" role="none">
                                        <p className='text-wendge text-extrabold text-md cursor-pointer'></p>
                                        <div className='flex flex-row'>
                                            <div className="flex items-center">
                                                <ArrowRightOnRectangleIcon className="h-6 w-6 text-wendge" />
                                            </div>
                                            <div>
                                                <a
                                                    onClick={signOut}
                                                    href="#"
                                                    className="block px-3 py-2 text-sm text-bold text-wendge hover:bg-gray-100 hover:text-gray-900"
                                                    role="menuitem"
                                                    tabIndex="-1"
                                                    id="menu-item-0"
                                                >
                                                    Logout
                                                </a>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            )}
                        </div>

                    </div>)}

                </div>
                {/* Bottom Nav*/}
                <div className="bg-wendge mt-5 h-[2px]"></div>
                <div className="flex items-center space-x-3 p-0.5 mt-0.5 pl-2  text-gray-900 text-sm">
                    <p
                        onClick={() => router.push('/products')}
                        className="link flex items-center mt-1 text-wendge outline:none font-bold text-sm">
                        Products
                    </p>
                </div>
            </header>
        </div>

    )
}

export default Header
