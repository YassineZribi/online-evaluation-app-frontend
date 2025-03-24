import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { requestLogin } from '../redux/actions/userActionCreators'
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';

function Login() {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.feedback);
  const emailRef = useRef()
  const passwordRef = useRef()
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(requestLogin(emailRef.current.value, passwordRef.current.value))
  }
  return (
    <div className='min-h-[calc(80vh-var(--navbar-height))] grid align content-center'>
      <h1 className="mb-5 text-4xl italic text-center font-semibold leading-none tracking-tight text-gray-900 dark:text-white">Se connecter</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 max-w-md mx-auto">
          <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
          <input ref={emailRef} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:outline-blue-500" placeholder="john.doe@company.com" required />
        </div>
        <div className="mb-3 max-w-md mx-auto">
          <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Password</label>
          <input ref={passwordRef} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:outline-blue-500" placeholder="•••••••••" required />
        </div>
        <button type="submit" disabled={loading} className="text-white block mt-6 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full mx-auto max-w-md px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          {loading ? <Spinner className='w-5 h-5 mx-auto' /> : 'Submit'}
        </button>
        <Link to="/register" className="block text-end text-sm w-full mx-auto max-w-md font-medium text-blue-600 dark:text-blue-500 hover:underline">Créer un compte</Link>
      </form>
    </div>
  )
}

export default Login
