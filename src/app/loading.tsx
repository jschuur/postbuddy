'use client';

import ScaleLoader from 'react-spinners/ScaleLoader';

export default function Loading() {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <ScaleLoader color='#36d7b7' />
      <p className='text-gray-500 text-sm font-light mt-2'>Loading...</p>
    </div>
  );
}
