import { ArrowRightIcon, PlusIcon, ClockIcon, UsersIcon } from "@heroicons/react/24/outline"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useParams } from 'react-router-dom'
import { displayBackdrop, requestFailed } from "../redux/actions/feedbackActionCreators"
import api from "../utils/api"
import Loader from "../components/Loader"
import useTimer from "../utils/hooks/useTimer"
import useEvaluationTimer from "../utils/hooks/useEvaluationtimer"

const months = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre'
];

const formatDate = (d) => {
    const date = new Date(d)
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    let hours = date.getHours()
    if (hours < 10)
        hours = '0' + hours
    let minutes = date.getMinutes()
    if (minutes < 10)
        minutes = '0' + minutes
    return `${day} ${months[month]} ${year}, ${hours}:${minutes}`
}

function TemplateCard({ evaluation, user }) {
    const { startInfos, endInfos } = useEvaluationTimer(evaluation.startDate, evaluation.endDate, new Date())
    const { isAuth, info } = useSelector(state => state.user);

    console.log(startInfos)
    console.log('end', endInfos)
    return (

        <div className="w-full relative flex flex-col mx-auto bg-gray-100 border border-gray-200 rounded-lg shadow dark:border-gray-700 dark:bg-gray-800">
            {/* <img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" src={course.card.imgUrl} alt="" /> */}
            <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{evaluation.title || 'Nouvelle evaluation'}</h5>
                <p className="mb-4 font-normal text-gray-700 dark:text-gray-400">{evaluation.description || 'Pas de description'}</p>
                <div className="flex justify-between bg-gray-200 dark:bg-gray-700 p-2 rounded-md">
                    <div>
                        <p className="mb-1 font-normal text-gray-700 dark:text-gray-400 flex items-center gap-1"><ClockIcon className="h-5 w-5 text-green-600" /> Début: {evaluation.startDate ? formatDate(evaluation.startDate) : 'N/A'}</p>
                        <p className="mb-1 font-normal text-gray-700 dark:text-gray-400 flex items-center gap-1"><ClockIcon className="h-5 w-5 text-red-600" /> Fin: {evaluation.endDate ? formatDate(evaluation.endDate) : 'N/A'}</p>
                    </div>
                    <p className="mt-2 mb-1 font-normal text-gray-700 dark:text-gray-400 flex items-center gap-1"><UsersIcon className="h-5 w-5 text-blue-600" /> {evaluation.participants.length} participant(s)</p>
                </div>
            </div>
            <div className="flex justify-between mx-4 mb-2">
                <div className="opacity-50 flex items-center">
                    {
                        (evaluation.startDate === '' && evaluation.endDate === '')
                            ? <p>N'a pas encore commencée.</p>
                            : (
                                <>
                                    <p>{(startInfos.evaluationStart && endInfos.evaluationEnd) ? 'Terminée' : ''}</p>
                                    <p> {(startInfos.evaluationStart && !endInfos.evaluationEnd) ? `En cours. Temps restant: ${endInfos.hours}h:${endInfos.minutes}m:${endInfos.seconds}s` : ''} </p>
                                    <p> {(!startInfos.evaluationStart) ? `Commence dans ${startInfos.hours}h:${startInfos.minutes}m:${startInfos.seconds}s` : ''} </p>
                                </>
                            )
                    }

                </div>

                <div className="flex justify-end items-center gap-2">
                    {
                        user.role == 'creator' && (
                            <Link to={`/participants-responses/${evaluation._id}`} className={`${((startInfos.evaluationStart && endInfos.evaluationEnd) && !(evaluation.startDate === '' && evaluation.endDate === '')) ? '' : 'dark:opacity-50 blur-[0.5px] opacity-70 pointer-events-none'} inline-flex items-center px-3 py-2 text-sm font-medium text-center rounded-lg text-blue-700 border border-blue-700 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-gray-900 dark:focus:ring-blue-800`}>
                                Réponses des participants
                            </Link>
                        )
                    }
                    {
                        (user.role == 'participant' && startInfos.evaluationStart && endInfos.evaluationEnd) && ( // participant-response/:evalId/:userId
                            <Link to={`/participant-response/${evaluation._id}/${info._id}`} className={`${((startInfos.evaluationStart && endInfos.evaluationEnd) && !(evaluation.startDate === '' && evaluation.endDate === '')) ? '' : 'dark:opacity-50 blur-[0.5px] opacity-70 pointer-events-none'} inline-flex items-center px-3 py-2 text-sm font-medium text-center rounded-lg text-blue-700 border border-blue-700 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-gray-900 dark:focus:ring-blue-800`}>
                                Mon résultat
                            </Link>
                        )
                    }
                    {
                        user.role == 'participant' && (
                            <Link to={`/pass-evaluation/${evaluation._id}`} className={`${((startInfos.evaluationStart && endInfos.evaluationEnd) || (!startInfos.evaluationStart)) ? 'dark:opacity-50 blur-[0.5px] opacity-70 pointer-events-none' : ''} inline-flex items-center px-3 py-2 text-sm font-medium text-center rounded-lg text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}>
                                Passer l'évaluation
                            </Link>
                        )
                    }
                    {
                        user.role == 'creator' && (
                            <Link to={`/settings/${evaluation._id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center rounded-lg text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Configuration
                            </Link>
                        )
                    }
                </div>
            </div>
        </div>

    )
}

function Templates() {
    const { info } = useSelector(state => state.user);
    const dispatch = useDispatch()
    const [evaluations, setEvaluations] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function loadTemplates() {
            try {
                const res = await api.get(`/evaluations/${info._id}`)
                console.log(res.data)
                setEvaluations(res.data)
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
        <div className="py-5 md:max-w-2xl mx-auto">
            <h1 className="mb-5 text-4xl italic text-center font-semibold leading-none tracking-tight text-gray-900 dark:text-white">Evaluations</h1>

            <div className="flex flex-col gap-5 py-5">
                {
                    evaluations.length
                        ? evaluations.map((e, i) => <TemplateCard key={i} evaluation={e} user={info} />)
                        : <p>Pas de evaluations à afficher.</p>
                }
            </div>
        </div>
    )
}

export default Templates
