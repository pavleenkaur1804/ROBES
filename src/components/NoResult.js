import React from 'react';
import Image from 'next/image'

/* This Component is meant for Displaying an 
NO RESULTS ICON when we receive an empty response from the api*/
const NoResult = () => {
    return (
        <div
            className='flex items-center max-w-screen-lg justify-start min-h-screen'>
           <Image width={500} height={500}
            src="https://firebasestorage.googleapis.com/v0/b/project-1234-1a50f.appspot.com/o/Screenshot%202023-06-06%20at%206.10.37%20PM.png?alt=media&token=49e67601-3fa8-4d54-a5fa-8ce7cfc6cc31&_gl=1*1oy2jp9*_ga*MTM0MDY1NzUzOS4xNjgxNTU4Mjky*_ga_CW55HF8NVT*MTY4NjA1MjE2NC4zNC4xLjE2ODYwNTUzNTAuMC4wLjA."/>
        </div>

    );
};

export default NoResult;
