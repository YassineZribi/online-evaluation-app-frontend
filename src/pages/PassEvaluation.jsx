import React from 'react'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { requestFailed } from '../redux/actions/feedbackActionCreators';
import Loader from '../components/Loader';
import { alertSuccess } from '../utils/feedback';
import Timer from '../components/Timer';

function PassEvaluation() {
    const { info } = useSelector(state => state.user);
    const { evalId } = useParams()
    const lsKey = `${info._id}-${evalId}`
    const dispatch = useDispatch()
    const [passEvaluation, setPassEvaluation] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    const handleSetResponse = (qstType, qstId, resId) => {
        console.log({ qstType, qstId, resId })
        setPassEvaluation(prev => {
            let responses

            if (qstType === 'radio')
                responses = [resId]
            else if (qstType === 'checkbox') {
                responses = [...prev.responses[qstId]];
                var index = responses.indexOf(resId);

                if (index === -1) {
                    responses.push(resId);
                } else {
                    responses.splice(index, 1);
                }
            }
            const newPassEvaluation = {
                ...prev,
                responses: {
                    ...prev.responses,
                    [qstId]: responses
                }
            }
            localStorage.setItem(lsKey, JSON.stringify(newPassEvaluation))
            return newPassEvaluation
        })
    }

    console.log(passEvaluation)

    useEffect(() => {
        async function getPassEvaluation() {
            try {
                const savedPassEvaluation = localStorage.getItem(lsKey)
                if (savedPassEvaluation)
                    setPassEvaluation(JSON.parse(savedPassEvaluation))
                else {
                    const res = await api.get(`/pass-evaluations/my/${info._id}/${evalId}`)
                    console.log(res.data)
                    setPassEvaluation(res.data)
                }
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await api.patch(`/pass-evaluations/${passEvaluation._id}`, passEvaluation)
            console.log(res.data)
            localStorage.removeItem(lsKey)
            alertSuccess("Réponses enregistrées !")
        } catch (err) {
            dispatch(requestFailed(err))
            setError(requestFailed(err).payload)
        }
    }

    if (isLoading)
        return <Loader />

    if (!isLoading && error)

        return <h2>{error}</h2>

    return (
        <div className='py-5 max-w-2xl mx-auto'>
            <Timer evaluation={passEvaluation.evaluation} />
            <h1 className="mb-5 text-3xl italic text-center font-semibold leading-none tracking-tight text-gray-900 dark:text-white">{passEvaluation.evaluation.title}</h1>

            <form onSubmit={handleSubmit}>
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
                    passEvaluation.evaluation.questions.map((question, i) => (
                        <div key={question._id} className="mb-3 relative block p-6 border border-gray-200 rounded-lg shadow bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
                            <h3 className='mb-3 text-blue-700 dark:text-blue-600'>Question {i + 1}:</h3>
                            <div className="mb-3 flex items-center gap-1">
                                {/* <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Titre</label> */}
                                <QuestionMarkCircleIcon className='w-5 h-5 relative top-[1px]' />
                                <p className="text-gray-900 dark:text-white">{question.title}</p>
                            </div>




                            {
                                question.answers.map((answer, j) => (
                                    <div key={answer._id} className="flex items-center gap-3 my-3">

                                        <input
                                            id={`option-${i}-${j}`}
                                            type={question.type}
                                            onChange={(e) => handleSetResponse(question.type, question._id, answer._id)}
                                            name={`question-${i}-${j}`}
                                            // value={j}
                                            className={`${question.type === 'radio'
                                                ? 'focus:ring-blue-300 dark:focus:bg-blue-600'
                                                : 'text-blue-600 bg-gray-100 rounded focus:ring-blue-500 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800'}`
                                                + ' ' + 'w-4 h-4 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 focus:ring-2'
                                            }
                                            checked={passEvaluation.responses[question._id].includes(answer._id)}
                                        />
                                        {
                                            <label htmlFor={`option-${i}-${j}`} className="block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{answer.text}</label>
                                        }


                                    </div>
                                ))
                            }



                            <div className='absolute top-5 right-5'>
                                <p className="text-gray-500 dark:text-gray-400">{question.points} point(s)</p>
                            </div>

                        </div>
                    ))
                }




                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Valider</button>
            </form>

        </div>
    )
}

export default PassEvaluation