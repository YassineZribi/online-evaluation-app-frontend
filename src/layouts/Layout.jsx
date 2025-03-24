import { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

import resolveConfig from 'tailwindcss/resolveConfig'
import myConfig from '../../tailwind.config'
import useWindowSize from '../utils/hooks/useWindowSize'
import { useSelector } from 'react-redux'
import ThemeContext, {DARK_MODE} from '../contexts/ThemeContext'

const tailwindConfig = resolveConfig(myConfig)

function Layout({children}) {
  const [showSidebarOnMobile, setShowSidebarOnMobile] = useState(false)
  const { theme } = useContext(ThemeContext);
  const { isAuth } = useSelector(state => state.user);
  const {width} = useWindowSize()

  const toggleSidebar = () => {
    setShowSidebarOnMobile(prev => !prev)
  }
  
  return (
    <>
        <Navbar toggleSidebar={toggleSidebar} showSidebarOnMobile={showSidebarOnMobile} />
        {isAuth ? <Sidebar showSidebarOnMobile={showSidebarOnMobile} toggleSidebar={toggleSidebar} /> : null}
        <main id='main-content' className={`mt-[var(--navbar-height)] dark:bg-gray-900 dark:text-gray-300 ${isAuth ? 'md:ml-[var(--sidebar-width)]' : ''} ${(showSidebarOnMobile && isAuth && width < parseInt(tailwindConfig.theme.screens.md)) ? `${theme === DARK_MODE ? 'before:bg-white/20' : 'before:bg-black/50'} before:pointer-events-auto` : "before:pointer-events-none"}`}>
          <div className="container max-w-6xl mx-auto px-2">
            {children}
          </div>
        </main>
    </>
  )
}

export default Layout