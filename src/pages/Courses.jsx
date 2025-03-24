import React from 'react'
import { Link } from 'react-router-dom'
import courses from '../utils/courses'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

function CourseCard({ course }) {
    return (

        <Link to={`${course.slug}/${course.pages[0].id}`} className="relative flex flex-col mx-auto items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-2xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" src={course.card.imgUrl} alt="" />
            <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{course.card.title}</h5>
                <p className="mb-10 font-normal text-gray-700 dark:text-gray-400">{course.card.paragraph}</p>
            </div>
            <button className="absolute bottom-2 right-2 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Commencer <ArrowRightIcon className='w-4 h-4 ml-2 -mr-1' />
            </button>
        </Link>

    )
}

function Courses() {
    return (
        <div className='flex flex-col gap-5 py-5'>
            {
                courses.map((c, i) => <CourseCard key={i} course={c} />)
            }
        </div>
    )
}

export default Courses