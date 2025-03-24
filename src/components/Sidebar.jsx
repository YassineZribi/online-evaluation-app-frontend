import { useRef } from 'react';
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRightOnRectangleIcon, ChartPieIcon, ChatBubbleBottomCenterTextIcon, Squares2X2Icon, UserIcon } from '@heroicons/react/24/outline'
import { logout } from '../redux/actions/userActionCreators';
import useOnClickOutside from '../utils/hooks/useOnClickOutside';
import courses from '../utils/courses';

function Sidebar({ showSidebarOnMobile, toggleSidebar }) {
  const dispatch = useDispatch()
  const { info } = useSelector(state => state.user);
  // Create a ref that we add to the element for which we want to detect outside clicks
  const ref = useRef();
  // Call hook passing in the ref and a function to call on outside click
  useOnClickOutside(ref, showSidebarOnMobile ? () => toggleSidebar() : () => null);

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <aside ref={ref} id="logo-sidebar" className={`fixed top-0 left-0 z-40 w-[var(--sidebar-width)] h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 ${showSidebarOnMobile ? 'translate-x-0' : 'md:translate-x-0'} dark:bg-gray-800 dark:border-gray-700`} aria-label="Sidebar">
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          <li>
            <Link to='/' className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <ChartPieIcon className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="ml-3">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to='/profile' className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <UserIcon className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="ml-3">Profil</span>
            </Link>
          </li>
          <li>
            <Link to={`/my-evaluations`} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <ChartPieIcon className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="ml-3">Évaluations</span>
            </Link>
          </li>
          {
            info.role == 'creator' && (
              <li>
                <Link to={`/my-templates`} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Squares2X2Icon className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="flex-1 ml-3 whitespace-nowrap">Templates</span>
                  <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">{1}</span>
                </Link>
              </li>
            )
          }
          <li>
            <button onClick={handleLogout} className="flex items-center w-full text-start p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <ArrowRightOnRectangleIcon className="rotate-180 flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="flex-1 ml-3 whitespace-nowrap">Log out</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar
