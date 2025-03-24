import { useState, useRef } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { requestFailed } from '../redux/actions/feedbackActionCreators'
import { useEffect } from 'react'
import Loader from '../components/Loader'
import api from '../utils/api'
import ProfileImage from '../components/ProfileImage'
import { alertSuccess } from '../utils/feedback'
import useOnClickOutside from '../utils/hooks/useOnClickOutside'

function Chip({ user, handleRemove }) {
    return (
        <div
            className="max-w-[200px] my-[5px] flex h-[45px] cursor-pointer items-center rounded-[26px] bg-[#eceff1] px-[12px] py-0 text-[13px] font-normal normal-case leading-loose text-[#4f4f4f] shadow-none transition-[opacity] duration-300 ease-linear hover:!shadow-none active:bg-[#cacfd1] dark:bg-gray-600 dark:text-neutral-200">
            <div className='my-0 -ml-[12px] mr-[8px] h-[inherit] aspect-square text-lg'>
                <ProfileImage className='h-[inherit] w-[inherit]' user={user} />
            </div>
            <div className='grow flex flex-col text-truncate'>
                <span className='text-truncate relative top-1'>{user.firstName} {user.lastName}</span>
                <span className='text-truncate opacity-60 relative bottom-1'>{user.email}</span>
            </div>
            <span
                className="float-right cursor-pointer text-[16px] text-[#afafaf] opacity-[.53] transition-all duration-200 ease-in-out hover:text-[#8b8b8b] dark:text-neutral-400 dark:hover:text-neutral-100">
                <XMarkIcon className='w-4 h-4' onClick={() => handleRemove(user._id)} />
            </span>
        </div>
    )
}

function EvaluationSettings() {
    const { evalId } = useParams()
    const dispatch = useDispatch()
    const searchRef = useRef()
    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [evaluation, setEvaluation] = useState(null)
    const [notYetParticipants, setNotYetParticipants] = useState([])
    const handleChange = (e) => {
        setEvaluation(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    console.log(evaluation)

    const handleInput = async (e) => {
        const value = e.target.value.trim()
        if (value && !show) {
            setShow(true)
        }
        else if (!value && show) {
            setShow(false)
        }

        try {
            const res = await api.post(`/evaluations/participants/${evalId}`, { value })
            console.log(res.data)
            setNotYetParticipants(res.data.filter(u => evaluation.participants.findIndex(p => p._id === u._id) === -1))
        } catch (err) {
            dispatch(requestFailed(err))
            setError(requestFailed(err).payload)
        }
    }

    const handleClick = (user) => {
        setEvaluation(prev => ({
            ...prev,
            participants: [...prev.participants, user]
        }))
        setNotYetParticipants(prev => prev.filter(p => p._id !== user._id))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await api.patch(`/evaluations/${evalId}`, evaluation)
            console.log(res.data)
            alertSuccess("Modifications enregistrées !")
        } catch (err) {
            dispatch(requestFailed(err))
            setError(requestFailed(err).payload)
        }
    }

    // Create a ref that we add to the element for which we want to detect outside clicks
    const searchContainerRef = useRef();
    // Call hook passing in the ref and a function to call on outside click
    useOnClickOutside(searchContainerRef, show ? () => setShow(false) : () => null);

    const handleRemoveParticipant = (id) => {
        console.log(id)
        setEvaluation(prev => ({
            ...prev,
            participants: prev.participants.filter(p => p._id !== id)
        }))
    }

    useEffect(() => {
        async function loadTemplates() {
            try {
                const res = await api.get(`/evaluations/one/${evalId}`)
                console.log(res.data)
                setEvaluation(res.data)
            } catch (err) {
                dispatch(requestFailed(err))
                setError(requestFailed(err).payload)
            }
            finally {
                setIsLoading(false)
            }
        }
        loadTemplates()
    }, [])

    if (isLoading)
        return <Loader />

    if (!isLoading && error)

        return <h2>{error}</h2>

    return (
        <div className='py-5 max-w-2xl mx-auto'>
            <h1 className="mb-5 text-4xl italic text-center font-semibold leading-none tracking-tight text-gray-900 dark:text-white">Settings</h1>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date début</label>
                    <input type="datetime-local" id="startDate" name='startDate' value={evaluation.startDate} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Titre" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date fin</label>
                    <input type="datetime-local" id="endDate" name='endDate' value={evaluation.endDate} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Titre" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="default-search" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Participants</label>
                    <div className='flex gap-y-1 gap-x-3 flex-wrap'>
                        {
                            evaluation.participants.map(p => <Chip key={p._id} user={p} handleRemove={handleRemoveParticipant} />)
                        }
                    </div>
                    <div ref={searchContainerRef} className='relative'>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input ref={searchRef} type="search" onChange={handleInput} autoComplete='off' id="default-search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Rechercher..." />
                            <button type="button" onClick={() => { searchRef.current.value = ""; setShow(false) }} className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <XMarkIcon className='w-4 h-4' />
                            </button>
                        </div>
                        <div className={`${show ? 'visible' : 'invisible'} absolute w-full h-52 overflow-auto mt-[2px] text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}>
                            {
                                notYetParticipants.length
                                    ? (
                                        notYetParticipants.map(user => (
                                            <div onClick={() => handleClick(user)} key={user._id} className='px-4 py-2 flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer'>
                                                <ProfileImage user={user} />
                                                <div className='flex gap-1 flex-col text-truncate text-[13px] font-normal normal-case'>
                                                    <span className='text-truncate relative top-1'>{user.firstName} {user.lastName}</span>
                                                    <span className='text-truncate opacity-60 relative bottom-1'>{user.email}</span>
                                                </div>
                                            </div>
                                        ))
                                    )
                                    : (
                                        <p className='opacity-50 text-center mt-2'>Pas de participants !</p>
                                    )
                            }
                        </div>
                    </div>
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Enregistrer</button>
            </form>
        </div>
    )
}

export default EvaluationSettings