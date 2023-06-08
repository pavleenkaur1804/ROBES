import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';

function NetworkErrorBoundary({ children }) {
//   const [isConnecting, setIsConnecting] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleNetworkError = (event) => {
      const error = event.reason;

      if (error.code === 14 && error.message === '14 UNAVAILABLE: read ETIMEDOUT') {
        setHasError(true);
      }
    };

    // Simulating connection delay for demonstration purposes
    // const connectToDatabase = () => {
    //   setTimeout(() => {
    //     setIsConnecting(false);
    //   }, 1000);
    // };

    // connectToDatabase();

    window.addEventListener('unhandledrejection', handleNetworkError);

    return () => {
      window.removeEventListener('unhandledrejection', handleNetworkError);
    };
  }, []);

    // if (isConnecting) {
    //     // Render a loading or connecting component here
    //     return <div
    //         className='flex justify-center items-center'
    //     ><Loading /></div>;
    // }

  if (hasError) {
    // Render your custom error component here
    return <div className='flex justify-center items-center'>
        <p>Network error occurred. Please try again later.</p>
        </div>;
  }

  return children;
}

export default NetworkErrorBoundary;
