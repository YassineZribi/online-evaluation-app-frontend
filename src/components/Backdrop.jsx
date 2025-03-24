import React from 'react'
import Spinner from './Spinner'
import { useSelector } from 'react-redux';

function Backdrop() {
    const { backdrop } = useSelector(state => state.feedback);

  return (
    <div className={`z-50 fixed inset-0 flex items-center justify-center ${backdrop ? 'opacity-100' : 'opacity-0 invisible'} bg-black/50`} style={{transition: 'opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'}}>
        <Spinner className='w-7 h-7 mx-auto' />
    </div>
  )
}

export default Backdrop