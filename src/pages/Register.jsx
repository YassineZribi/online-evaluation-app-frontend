import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { requestLogin, requestRegister } from '../redux/actions/userActionCreators'
import Spinner from '../components/Spinner';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const dispatch = useDispatch()
    const { loading } = useSelector(state => state.feedback);
    const navigate = useNavigate()
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'participant'
    })

    const handleChange = (e) => {
        setUser(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const confirmPasswordRef = useRef('')
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(confirmPasswordRef.current)
        if (user.password == confirmPasswordRef.current.value) {
            console.log(user)
            dispatch(requestRegister(user, navigate))
        }
        else {
            window.alert("mots de passe différents")
        }
    }
    return (
        <div className='min-h-[calc(80vh-var(--navbar-height))] grid align content-center'>
            <h1 className="mb-5 text-4xl italic text-center font-semibold leading-none tracking-tight text-gray-900 dark:text-white">Créer un compte</h1>
            <form onSubmit={handleSubmit}>
                <div className='grid gap-3 md:grid-cols-2 max-w-md mx-auto'>
                    <div className="mb-3">
                        <label htmlFor="lastName" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Nom</label>
                        <input value={user.lastName} onChange={handleChange} type="text" id="lastName" name='lastName' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:outline-blue-500" placeholder="Doe" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="firstName" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Prénom</label>
                        <input value={user.firstName} onChange={handleChange} type="text" id="firstName" name='firstName' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:outline-blue-500" placeholder="John" required />
                    </div>
                </div>
                <div className="mb-3 max-w-md mx-auto">
                    <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input value={user.email} onChange={handleChange} type="email" id="email" name='email' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:outline-blue-500" placeholder="john.doe@company.com" required />
                </div>


                <fieldset className="mb-5 max-w-md mx-auto">
                    <legend className="sr-only">role</legend>
                    <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Rôle</label>
                    <div className='flex gap-28 justify-center'>
                        <div className="flex items-center">
                            <input onChange={handleChange} id="country-option-1" type="radio" name="role" value="participant" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600" checked={user.role == 'participant'} />
                            <label htmlFor="country-option-1" className="block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                Candidat
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input onChange={handleChange} id="country-option-2" type="radio" name="role" value="creator" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600" checked={user.role == 'creator'} />
                            <label htmlFor="country-option-2" className="block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                Créateur
                            </label>
                        </div>
                    </div>
                </fieldset>

                <div className='grid gap-3 md:grid-cols-2 max-w-md mx-auto'>
                    <div className="mb-3">
                        <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Mot de passe</label>
                        <input value={user.password} onChange={handleChange} type="password" id="password" name='password' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:outline-blue-500" placeholder="•••••••••" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Confirmer mot de passe</label>
                        <input ref={confirmPasswordRef} type="password" id="confirmPassword" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:outline-blue-500" placeholder="•••••••••" required />
                    </div>
                </div>
                <button type="submit" disabled={loading} className="text-white block mt-3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full mx-auto max-w-md px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    {loading ? <Spinner className='w-5 h-5 mx-auto' /> : 'Submit'}
                </button>
                <Link to="/login" className="block text-end text-sm w-full mx-auto max-w-md font-medium text-blue-600 dark:text-blue-500 hover:underline">Se connecter</Link>
            </form>
        </div>
    )
}

export default Register
