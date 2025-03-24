import React from 'react'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { QuestionMarkCircleIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { requestFailed } from '../redux/actions/feedbackActionCreators';
import Loader from '../components/Loader';
import { alertSuccess } from '../utils/feedback';

function DetailsEvaluationResponses() {
    const { info } = useSelector(state => state.user);
    const { evalId, userId } = useParams()
    const dispatch = useDispatch()
    const [passEvaluation, setPassEvaluation] = useState(null)
    const [points, setPoints] = useState({
        evaluation: 0,
        participant: 0
    })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    console.log(passEvaluation)

    useEffect(() => {
        async function getPassEvaluation() {
            try {
                const res = await api.get(`/pass-evaluations/participant-result/${evalId}/${userId}`)
                console.log(res.data)
                setPassEvaluation(res.data)
                const evaluationPoints = res.data.evaluation.questions.reduce((accumulator, qst) => accumulator + qst.points, 0)
                console.log(evaluationPoints)
                let participantPoints = 0;
                res.data.evaluation.questions.forEach(q => {
                    const answersIds = q.answers.filter(a => a.isValid).map(a => a._id).toSorted().toString()
                    const participantResponsesIds = res.data.responses[q._id].toSorted().toString()
                    if (answersIds == participantResponsesIds)
                        participantPoints += q.points
        
                    console.log(participantPoints)
                })
                setPoints(prev => ({
                    ...prev,
                    evaluation: evaluationPoints,
                    participant: participantPoints
                }))
            } catch (err) {
                dispatch(requestFailed(err))
                setError(requestFailed(err).payload)
            }
            finally {
                setIsLoading(false)
            }
        }
        getPassEvaluation()
    }, [])

    if (isLoading)
        return <Loader />

    if (!isLoading && error)

        return <h2>{error}</h2>

    if (!isLoading && !passEvaluation)
        return <h2>Pas de données concernant ce candidat !</h2>

    return (
        <div className='py-5 max-w-2xl mx-auto'>
            <h3 className="fixed top-20 right-5 mb-1 text-3xl italic text-center font-semibold leading-none tracking-tight text-blue-800 dark:text-blue-300 z-10">{points.participant}/{points.evaluation}</h3>
            <h1 className="mb-1 text-3xl italic text-center font-semibold leading-none tracking-tight text-gray-900 dark:text-white">{passEvaluation.evaluation.title}</h1>
            <p className="mb-5 text-center text-xl text-gray-500 dark:text-gray-400">Réponses de {passEvaluation.user.firstName} {passEvaluation.user.lastName} ({passEvaluation.user.email})</p>
            <form onSubmit={null}>
                {/* <div className="mb-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Titre</label>
                    <p className="mb-3 text-lg text-gray-500 md:text-xl dark:text-gray-400">Deliver great service experiences fast.</p>
                </div> */}
                <div className="mb-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                    <p className="text-gray-500 dark:text-gray-400">{passEvaluation.evaluation.description}</p>
                </div>

                <div className="mb-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Questions</label>
                </div>




                {
                    passEvaluation.evaluation.questions.map((question, i) => {
                        const answersIds = question.answers.filter(a => a.isValid).map(a => a._id).toSorted().toString()
                        const participantResponsesIds = passEvaluation.responses[question._id].toSorted().toString()
                        const validResponses = answersIds == participantResponsesIds;
                        
                        return (
                            <div key={question._id} className="mb-3 relative block p-6 border border-gray-200 rounded-lg shadow bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                <h3 className='mb-3 text-blue-700 dark:text-blue-600'>Question {i + 1}:</h3>
                                <div className="mb-3 flex items-center gap-1">
                                    {/* <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Titre</label> */}
                                    <QuestionMarkCircleIcon className='w-5 h-5 relative top-[1px]' />
                                    <p className="text-gray-900 dark:text-white">{question.title}</p>
                                </div>




                                {
                                    question.answers.map((answer, j) => {
                                        const isItsChoice = passEvaluation.responses[question._id].includes(answer._id)
                                        
                                        return (
                                            <div key={answer._id} className={`flex items-center gap-3 my-3 relative rounded-sm ${isItsChoice ? (answer.isValid ? 'bg-green-700/50' : 'bg-red-700/50') : ''}`}>
                                                {
                                                    (isItsChoice || answer.isValid) && (
                                                        <span className='absolute -left-5'>
                                                            {
                                                                (answer.isValid)
                                                                    ? (!isItsChoice && <CheckIcon className="h-4 w-4 text-green-600" />)
                                                                    : <XMarkIcon className="h-4 w-4 text-red-600" />
                                                            }
                                                        </span>
                                                    )
                                                }
                                                <input
                                                    id={`option-${i}-${j}`}
                                                    type={question.type}
                                                    onChange={(e) => null}
                                                    name={`question-${i}-${j}`}
                                                    // value={j}
                                                    className={`${question.type === 'radio'
                                                        ? 'focus:ring-blue-300 dark:focus:bg-blue-600'
                                                        : 'text-blue-600 bg-gray-100 rounded focus:ring-blue-500 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800'}`
                                                        + ' ' + 'w-4 h-4 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 opacity-50'
                                                    }
                                                    checked={isItsChoice}
                                                />
                                                {
                                                    <label htmlFor={`option-${i}-${j}`} className="block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{answer.text}</label>
                                                }


                                            </div>
                                        )
                                    })
                                }



                                <div className='absolute top-5 right-5'>
                                    <p className={`text-gray-500 dark:text-gray-400 ${validResponses ? '' : 'line-through decoration-red-600/60 decoration-2 opacity-60'}`}>{question.points} point(s)</p>
                                </div>

                            </div>
                        )
                    })
                }

            </form>

        </div>
    )
}

export default DetailsEvaluationResponses