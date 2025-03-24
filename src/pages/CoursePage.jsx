import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowSmallRightIcon, ArrowSmallLeftIcon } from '@heroicons/react/24/outline'

import courses from '../utils/courses'

function Button({ children, ...rest }) {
    return (
        <button {...rest} className={`text-blue-700 disabled:text-gray-400 rounded-lg hover:bg-gray-100 disabled:hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-200 font-medium text-sm px-5 py-2.5 text-center inline-flex items-center dark:text-gray-400 disabled:dark:text-gray-600 dark:hover:bg-gray-700 disabled:dark:hover:bg-transparent dark:focus:ring-gray-600}`}>
            {children}
        </button>
    )
}

function CoursePage() {
    const { courseSlug, pageId } = useParams()
    const navigate = useNavigate();
    const course = courses.find(c => c.slug === courseSlug)
    const coursePage = course.pages.find(p => p.id === pageId)
    const coursePageIndex = course.pages.findIndex(p => p.id === pageId)
    const handleGoToPrevPage = () => {
        navigate(`/courses/${course.slug}/${course.pages[coursePageIndex - 1].id}`)
    }
    const handleGoToNextPage = () => {
        navigate(`/courses/${course.slug}/${course.pages[coursePageIndex + 1].id}`)
    }
    const prevNextBtns = (
        <div className='flex items-center justify-between py-4'>
            <Button onClick={handleGoToPrevPage} disabled={coursePageIndex === 0}>
                <ArrowSmallLeftIcon className="w-5 h-5 mr-2 -ml-1" />
                Précédent
            </Button>
            <span> {coursePageIndex + 1} / {course.pages.length} </span>
            <Button onClick={handleGoToNextPage} disabled={coursePageIndex === course.pages.length - 1}>
                Suivant
                <ArrowSmallRightIcon className="w-5 h-5 ml-2 -mr-1" />
            </Button>
        </div>
    )
    return (
        <div className='max-w-4xl  mx-auto '>
            {prevNextBtns}
            <h2 className="mb-4 text-2xl text-center font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">{course.card.title}</h2>
            <p className="mb-6 text-2xl italic font-normal text-center text-gray-500 sm:px-16 xl:px-48 dark:text-gray-400">{coursePageIndex + 1}. {coursePage.title}</p>
            <video className='w-full mx-auto mb-5' controls src={coursePage.videoUrl} poster={coursePage.thumbnail}></video>
            {coursePage.content}
            <br />
            {prevNextBtns}
        </div>
    )
}

export default CoursePage