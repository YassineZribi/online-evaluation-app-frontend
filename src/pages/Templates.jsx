import { ArrowRightIcon, PlusIcon } from "@heroicons/react/24/outline"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useParams } from 'react-router-dom'
import { displayBackdrop, requestFailed } from "../redux/actions/feedbackActionCreators"
import api from "../utils/api"
import Loader from "../components/Loader"

function TemplateCard({ template }) {
    const navigate = useNavigate()
    const {info} = useSelector(state => state.user);
    const dispatch = useDispatch()
    const handleCreateEvaluation = async () => {
        try {
            dispatch(displayBackdrop(true))
            const res = await api.post(`/evaluations/${template._id}`)
            console.log(res.data)
            navigate(`/my-evaluations`)
        } catch (err) {
            dispatch(requestFailed(err))
        }
        finally {
            dispatch(displayBackdrop(false))
        }
    }
    return (

        <div className="w-full relative flex flex-col mx-auto bg-gray-100 border border-gray-200 rounded-lg shadow dark:border-gray-700 dark:bg-gray-800">
            {/* <img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" src={course.card.imgUrl} alt="" /> */}
            <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{template.title || 'Nouvelle template'}</h5>
                <p className="mb-10 font-normal text-gray-700 dark:text-gray-400">{template.description || 'Pas de description'}</p>
            </div>
            <div className="mx-2 mb-2 flex justify-end gap-2">
                <button onClick={handleCreateEvaluation} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center rounded-lg text-blue-700 border border-blue-700 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-gray-900 dark:focus:ring-blue-800">
                    Créer une évaluation
                </button>
                <Link to={`/update-template/${template._id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center rounded-lg text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Modifier le template <ArrowRightIcon className='w-4 h-4 ml-2 -mr-1' />
                </Link>
            </div>
        </div>

    )
}

function Templates() {
    const {info} = useSelector(state => state.user);
    const dispatch = useDispatch()
    const [templates, setTemplates] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function loadTemplates() {
            try {
                const res = await api.get(`/quizzes/${info._id}`)
                console.log(res.data)
                setTemplates(res.data)
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

    const handleAddNewtemplate = async () => {
        try {
            dispatch(displayBackdrop(true))
            const res = await api.post(`/quizzes/${info._id}`)
            console.log(res.data)
            setTemplates(prev => [...prev, res.data.quiz])
        } catch (err) {
            dispatch(requestFailed(err))
        }
        finally {
            dispatch(displayBackdrop(false))
        }
    }

    if (isLoading)
        return <Loader />

    if (!isLoading && error)

        return <h2>{error}</h2>

    return (
        <div className="py-5 md:max-w-2xl mx-auto">
            <h1 className="mb-5 text-4xl italic text-center font-semibold leading-none tracking-tight text-gray-900 dark:text-white">Templates</h1>

            <div className="flex flex-col gap-5 py-5">
                {
                    templates.length
                        ? templates.map((t, i) => <TemplateCard key={i} template={t} />)
                        : <p>Pas de templates à afficher.</p>
                }
            </div>
            <button onClick={handleAddNewtemplate} type="button" className="fixed bottom-5 right-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <PlusIcon className="w-8 h-8" fill="currentColor" />
                <span className="sr-only">Icon description</span>
            </button>
        </div>
    )
}

export default Templates
