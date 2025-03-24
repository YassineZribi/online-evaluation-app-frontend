import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom'
import { logout } from '../redux/actions/userActionCreators';
import useOnClickOutside from '../utils/hooks/useOnClickOutside';
import ThemeToggleBtn from './ThemeToggleBtn';
import ProfileImage from './ProfileImage';
import logo from '../assets/logo.svg'

function Navbar({ showSidebarOnMobile, toggleSidebar }) {
  const [dropdownIsOpen, toggleDropdown] = useState(false)
  const location = useLocation()
  const dispatch = useDispatch()
  const { isAuth, info } = useSelector(state => state.user);

  const handleLogout = () => {
    dispatch(logout())
  }

  const dropdownRef = useRef();
  // Call hook passing in the ref and a function to call on outside click
  useOnClickOutside(dropdownRef, () => dropdownIsOpen ? toggleDropdown(false) : null);
  return (
    <nav className="fixed h-[var(--navbar-height)] top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 h-full py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center justify-start">
            {
              isAuth ? (
                <button onClick={toggleSidebar} className={`inline-flex mr-2 items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 ${showSidebarOnMobile ? 'pointer-events-none' : ''}`}>
                  <span className="sr-only">Open sidebar</span>
                  <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                  </svg>
                </button>
              ) : null
            }
            <Link to='/' className="flex md:mr-24">
              <img src={logo} className="h-10 mr-2" alt="FlowBite Logo" />
              <span className="self-center italic text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">EvaQuiz</span>
            </Link>
          </div>
          <div className="flex items-center">
            {
              !isAuth && (
                <Link to={location.pathname == "/login" ? "/register" :"/login"} className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-full font-medium mr-3">{location.pathname == "/login" ? "Créer un compte" : "Se connecter"}</Link>
              )
            }
            <ThemeToggleBtn />
            {
              isAuth ? (
                <div className="flex items-center ml-3 relative">
                  <div>
                    <button onClick={() => toggleDropdown(prev => !prev)} type="button" className={`flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 ${dropdownIsOpen ? 'pointer-events-none' : ''}`} aria-expanded="false" data-dropdown-toggle="dropdown-user">
                      <span className="sr-only">Open user menu</span>
                      <ProfileImage user={info} />
                    </button>
                  </div>
                  <div ref={dropdownRef} className={`z-50 ${dropdownIsOpen ? '' : 'hidden'} shadow-md absolute top-[100%] right-0 mt-2 mb-4 text-base list-none bg-white divide-y divide-gray-100 rounded dark:bg-gray-700 dark:divide-gray-600`} id="dropdown-user">
                    <div className="px-4 py-3" role="none">
                      <p className="text-sm text-gray-900 dark:text-white" role="none">
                        {info.firstName} {info.lastName}
                      </p>
                      <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                        {info.email}
                      </p>
                    </div>
                    <ul className="py-1" role="none">
                      <li>
                        <Link to='/' className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Dashboard</Link>
                      </li>
                      <li>
                        <Link to='/profile' className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Profil</Link>
                      </li>
                      <li>
                        <button onClick={handleLogout} className="block px-4 py-2 text-sm w-full text-start text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Sign out</button>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : null
            }
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
