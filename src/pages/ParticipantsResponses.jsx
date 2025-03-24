import { ArrowRightIcon, PlusIcon, ClockIcon, UsersIcon, DocumentTextIcon } from "@heroicons/react/24/outline"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useParams } from 'react-router-dom'
import { displayBackdrop, requestFailed } from "../redux/actions/feedbackActionCreators"
import api from "../utils/api"
import Loader from "../components/Loader"


function ParticipantResponse({ evaluation, participant, passEvaluations }) {
    const isPresent = passEvaluations.find(pe => pe.user == participant._id)
    const evaluationPoints = evaluation.questions.reduce((accumulator, qst) => accumulator + qst.points, 0)
    let participantPoints = 0;
    if (isPresent) {
        const participantResponses = isPresent.responses;
        evaluation.questions.forEach(q => {
            const answersIds = q.answers.filter(a => a.isValid).map(a => a._id).toSorted().toString()
            const participantResponsesIds = participantResponses[q._id].toSorted().toString()
            if (answersIds == participantResponsesIds)
                participantPoints += q.points

            //console.log(answersIds)
        })
        console.log(participantPoints)
    }
    return (

        <div className="w-full relative flex flex-col mx-auto bg-gray-100 border border-gray-200 rounded-lg shadow dark:border-gray-700 dark:bg-gray-800">
            {/* <img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" src={course.card.imgUrl} alt="" /> */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-2 p-4 leading-normal">
                <div>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{participant.firstName} {participant.lastName}</h5>
                    <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{participant.email}</p>
                </div>
                <div>
                    <p className="mb-2 font-normal text-gray-700 dark:text-gray-400 flex items-center gap-1"><span className={`block h-4 w-4 ${isPresent ? 'bg-green-600' : 'bg-red-600'} rounded-full`} /> {isPresent ? 'Présent(e)' : 'Absent(e)'}</p>
                    <p className="mb-2 font-normal text-gray-700 dark:text-gray-400 flex items-center gap-1"><DocumentTextIcon className="h-5 w-5 text-blue-600" /> Note: {participantPoints}/{evaluationPoints}</p>
                </div>
                <div className="flex justify-end gap-2">
                    <Link to={`/participant-response/${evaluation._id}/${participant._id}`} className={`${isPresent ? '' : 'opacity-60 pointer-events-none'} inline-flex items-center px-3 py-2 text-sm font-medium text-center rounded-lg text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}>
                        Détails des réponses
                    </Link>
                </div>

            </div>
        </div>

    )
}

function ParticipantsResponses() {
    const { info } = useSelector(state => state.user);
    const { evalId } = useParams()
    const dispatch = useDispatch()
    const [evaluation, setEvaluation] = useState(null)
    const [passEvaluations, setPassEvaluations] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function load() {
            try {
                const res = await api.get(`/pass-evaluations/participants-results/${evalId}`)
                console.log(res.data)
                setEvaluation(res.data.evaluation)
                setPassEvaluations(res.data.passEvaluations)
            } catch (err) {
                dispatch(requestFailed(err))
                setError(requestFailed(err).payload)
            }
            finally {
                setIsLoading(false)
            }
        }
        load()
    }, [])

    if (isLoading)
        return <Loader />

    if (!isLoading && error)

        return <h2>{error}</h2>

    return (
        <div className="py-5 md:max-w-2xl mx-auto">
            <h1 className="mb-5 text-4xl italic text-center font-semibold leading-none tracking-tight text-gray-900 dark:text-white">Réponses</h1>

            <div className="flex flex-col gap-5 py-5">
                {
                    evaluation.participants.length
                        ? evaluation.participants.map((p, i) => <ParticipantResponse key={i} participant={p} evaluation={evaluation} passEvaluations={passEvaluations} />)
                        : <p>Pas de notes de participants à afficher.</p>
                }
            </div>
        </div>
    )
}

export default ParticipantsResponses
