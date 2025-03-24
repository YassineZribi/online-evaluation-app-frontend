import { useContext } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'
import ThemeContext, {DARK_MODE} from '../contexts/ThemeContext'

function ThemeToggleBtn() {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <button onClick={toggleTheme} className={`inline-flex items-center justify-center w-10 h-10 p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600}`}>
            <span className="sr-only">Toggle theme</span>
            {
                theme == DARK_MODE ? <SunIcon className='w-6 h-6' /> : <MoonIcon className='w-5 h-5' />
            }
        </button>
    )
}

export default  ThemeToggleBtn
