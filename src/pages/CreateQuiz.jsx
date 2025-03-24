import React, { useEffect, useReducer } from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DocumentDuplicateIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { displayBackdrop, requestFailed } from '../redux/actions/feedbackActionCreators';
import { useDispatch } from 'react-redux';
import api from '../utils/api';
import Loader from '../components/Loader';
import { debounce } from '../utils/debounce';
import { useRef } from 'react';


const processDbChange = debounce((name, value, qstId) => {
    (async function () {
        try {
            const res = await api.patch(`/questions/${qstId}`, { [name]: value })
            console.log(res.data)
        } catch (err) {
            dispatch(requestFailed(err))
        }
        finally {
            // setIsLoading(false)
        }
    })()
});

const processAnswerTextChange = debounce((name, value, ansId) => {
    (async function () {
        try {
            const res = await api.patch(`/answers/${ansId}`, { [name]: value })
            console.log(res.data)
        } catch (err) {
            dispatch(requestFailed(err))
        }
        finally {
            // setIsLoading(false)
        }
    })()
});

const processQuestionPrimaryFieldsChange = debounce((name, value, quizId) => {
    (async function () {
        try {
            const res = await api.patch(`/quizzes/${quizId}`, { [name]: value })
            console.log(res.data)
        } catch (err) {
            dispatch(requestFailed(err))
        }
        finally {
            // setIsLoading(false)
        }
    })()
});

const reducer = (state, action) => {
    switch (action.type) {
        case 'QUIZ_LOADED':
            return action.payload
        case 'UPDATE_QUIZ_PRIMARY_FIELDS': {
            const { name, value } = action.payload
            return {
                ...state,
                [name]: value
            }
        }
        case 'ADD_NEW_QUESTION': {
            const { newQuestion, newPos } = action.payload
            return {
                ...state,
                questions: [
                    ...state.questions.slice(0, newPos),
                    newQuestion,
                    ...state.questions.slice(newPos),
                ]
            }
        }
        case 'DUPLICATE_QUESTION': {
            const { newQuestion, newPos } = action.payload
            return {
                ...state,
                questions: [
                    ...state.questions.slice(0, newPos),
                    newQuestion,
                    ...state.questions.slice(newPos),
                ]
            }
        }
        case 'REMOVE_QUESTION': {
            const qstId = action.payload
            return {
                ...state,
                questions: state.questions.filter(q => q._id !== qstId)
            }
        }
        case 'UPDATE_QUESTION_POINTS':
        case 'UPDATE_QUESTION_TITLE': {
            const { name, value, qstId } = action.payload
            return {
                ...state,
                questions: state.questions.map(q => qstId === q._id ? { ...q, [name]: value } : q)
            }
        }
        case 'ADD_NEW_ANSWER': {
            const { newAnswer, qstId } = action.payload
            return {
                ...state,
                questions: state.questions.map(q => ({
                    ...q,
                    answers: qstId === q._id ? [...q.answers, newAnswer] : q.answers
                }))
            }
        }
        case 'REMOVE_ANSWER': {
            const { qstId, ansId } = action.payload
            return {
                ...state,
                questions: state.questions.map(q => ({
                    ...q,
                    answers: qstId === q._id ? q.answers.filter(r => ansId !== r._id) : q.answers
                }))
            }
        }
        case 'UPDATE_ANSWER_TEXT': {
            const { value, qstId, ansId } = action.payload
            return {
                ...state,
                questions: state.questions.map(q => (
                    qstId === q._id
                        ? { ...q, answers: q.answers.map(r => ansId === r._id ? { ...r, text: value } : r) }
                        : q
                ))
            }
        }
        case 'SET_VALID_ANSWER_CHECKBOX': {
            const { qstId, ansId } = action.payload
            return {
                ...state,
                questions: state.questions.map(q => (
                    qstId === q._id
                        ? { ...q, answers: q.answers.map(r => ansId === r._id ? { ...r, isValid: !r.isValid } : r) }
                        : q
                ))
            }
        }
        case 'SET_VALID_ANSWER_RADIO': {
            const { qstId, ansId } = action.payload
            return {
                ...state,
                questions: state.questions.map(q => (
                    qstId === q._id
                        ? { ...q, answers: q.answers.map(r => ({ ...r, isValid: ansId === r._id ? true : false })) }
                        : q
                ))
            }
        }
        case 'CHANGE_QUESTION_TYPE': {
            const { value, qstId } = action.payload
            return {
                ...state,
                questions: state.questions.map(q => (
                    qstId === q._id ? { ...q, type: value } : q
                ))
            }
        }
        case 'RESET_CHECKED_ANSWERS': {
            const qstId = action.payload
            return {
                ...state,
                questions: state.questions.map(q => (
                    qstId === q._id
                        ? { ...q, answers: q.answers.map(r => ({ ...r, isValid: false })) }
                        : q
                ))
            }
        }
        default:
            return state;
    }
}

function CreateQuiz() {
    const dispatch = useDispatch()
    const { quizId } = useParams()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [totalPoints, setTotalPoints] = useState(0)
    const [quiz, dispatchQuiz] = useReducer(reducer, null)

    useEffect(() => {
        async function loadQuiz() {
            try {
                const res = await api.get(`/quizzes/quiz/${quizId}`)
                console.log(res.data)
                dispatchQuiz({ type: 'QUIZ_LOADED', payload: res.data })
            } catch (err) {
                dispatch(requestFailed(err))
            }
            finally {
                setIsLoading(false)
            }
        }
        loadQuiz()
    }, [])

    const resetValidAnswers = (qstId) => {
        dispatchQuiz({ type: 'RESET_CHECKED_ANSWERS', payload: qstId })
    }

    const handleChangeQuestionType = async (value, qstId) => {

        try {
            const res = await api.patch(`/questions/${qstId}`, { type: value })
            console.log(res.data)
            dispatchQuiz({ type: 'CHANGE_QUESTION_TYPE', payload: { value, qstId } })
            resetValidAnswers(qstId)
        } catch (err) {
            dispatch(requestFailed(err))
        }
        finally {
            // setIsLoading(false)
        }
    }

    const handleSetValidAnswer = async (QstType, qstId, ansId) => {
        try {
            const res = await api.patch(`/answers/${qstId}/${ansId}?type=${QstType}`)
            console.log(res.data)
            if (QstType === 'radio')
                dispatchQuiz({ type: 'SET_VALID_ANSWER_RADIO', payload: { qstId, ansId } })
            else
                dispatchQuiz({ type: 'SET_VALID_ANSWER_CHECKBOX', payload: { qstId, ansId } })
        } catch (err) {
            dispatch(requestFailed(err))
        }
    }

    const handleUpdateAnswerText = (value, qstId, ansId) => {
        dispatchQuiz({ type: 'UPDATE_ANSWER_TEXT', payload: { value, qstId, ansId } })
        processAnswerTextChange('text', value, ansId);
    }

    const handleAddNewAnswer = async (qstId) => {
        try {
            const res = await api.post(`/answers/${qstId}`)
            console.log(res.data)
            dispatchQuiz({ type: 'ADD_NEW_ANSWER', payload: { newAnswer: res.data.answer, qstId } })
        } catch (err) {
            dispatch(requestFailed(err))
        }
        finally {
            // setIsLoading(false)
        }
    }

    const handleRemoveResponse = async (qstId, ansId) => {
        try {
            const res = await api.delete(`/answers/${ansId}`)
            console.log(res.data)
            dispatchQuiz({ type: 'REMOVE_ANSWER', payload: { qstId, ansId } })
        } catch (err) {
            dispatch(requestFailed(err))
        }
        finally {
            // setIsLoading(false)
        }
    }

    const handleUpdateQuestionPoints = (e, qstId) => {
        const name = e.target.name
        const value = Number(e.target.value)
        dispatchQuiz({ type: 'UPDATE_QUESTION_POINTS', payload: { name, value, qstId } })
        processDbChange(name, value, qstId);
    }

    const handleAddNewQuestion = async (newPos) => {
        try {
            const res = await api.post(`/questions/${quizId}?at=${newPos}`)
            console.log(res.data)
            dispatchQuiz({ type: 'ADD_NEW_QUESTION', payload: { newQuestion: res.data.question, newPos } })
        } catch (err) {
            dispatch(requestFailed(err))
        }
        finally {
            // setIsLoading(false)
        }
    }
    const handleDuplicateQuestion = async (newPos) => {
        const prevQuestion = { ...quiz.questions[newPos - 1] }
        delete prevQuestion._id

        try {
            const res = await api.post(`/questions/${quizId}?at=${newPos}`, prevQuestion)
            console.log(res.data)
            //dispatchQuiz({ type: 'ADD_NEW_QUESTION', payload: { newQuestion: res.data.question, newPos } })
            dispatchQuiz({ type: 'DUPLICATE_QUESTION', payload: { newQuestion: res.data.question, newPos } })
        } catch (err) {
            dispatch(requestFailed(err))
        }
        finally {
            // setIsLoading(false)
        }
    }

    const handleRemoveQuestion = async (qstId) => {
        try {
            const res = await api.delete(`/questions/${qstId}`)
            console.log(res.data)
            dispatchQuiz({ type: 'REMOVE_QUESTION', payload: qstId })
        } catch (err) {
            dispatch(requestFailed(err))
        }
        finally {
            // setIsLoading(false)
        }
    }

    const handleUpdateQuestionTitle = async (e, qstId) => {
        const { name, value } = e.target
        dispatchQuiz({ type: 'UPDATE_QUESTION_TITLE', payload: { name, value, qstId } })
        processDbChange(name, value, qstId);
    }

    const handleUpdateQuizPrimaryFields = async (e) => {
        const { name, value } = e.target
        dispatchQuiz({ type: 'UPDATE_QUIZ_PRIMARY_FIELDS', payload: { name, value } })
        processQuestionPrimaryFieldsChange(name, value, quizId);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(displayBackdrop(true))
            const res = await api.post(`/evaluations/${quiz._id}`)
            console.log(res.data)
            navigate(`/my-evaluations`)
        } catch (err) {
            dispatch(requestFailed(err))
        }
        finally {
            dispatch(displayBackdrop(false))
        }
    }

    useEffect(() => {
        if (!quiz) return
        const total = quiz.questions.reduce((accumulator, currentValue) => accumulator + currentValue.points,
            0)
        console.log(total)
        setTotalPoints(total)
    }, [quiz])

    if (isLoading)
        return <Loader />

    if (!isLoading && !quiz)

        return <h2>une erreur est survenue</h2>

    return (
        <div className='py-5 max-w-2xl mx-auto'>
            <h3 className="fixed top-20 right-5 mb-1 text-3xl italic text-center font-semibold leading-none tracking-tight text-blue-800 dark:text-blue-300 z-10">{totalPoints} points</h3>

            <h1 className="mb-5 text-4xl italic text-center font-semibold leading-none tracking-tight text-gray-900 dark:text-white">Quiz</h1>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Titre</label>
                    <input type="text" id="title" name='title' value={quiz.title} onChange={(e) => handleUpdateQuizPrimaryFields(e)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Titre" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                    <textarea id="description" name='description' value={quiz.description} onChange={(e) => handleUpdateQuizPrimaryFields(e)} rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Description"></textarea>
                </div>

                <div className="mb-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Questions</label>
                </div>

                {
                    quiz.questions.map((question, i) => (
                        <div key={question._id} className="mb-3 relative block p-6 border border-gray-200 rounded-lg shadow bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
                            <h3 className='mb-3'>Question {i + 1}</h3>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="w-full mb-3 group">
                                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Titre</label>
                                    <input type="text" id="title" value={question.title} onChange={(e) => handleUpdateQuestionTitle(e, question._id)} name='title' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Titre de question" required />
                                </div>
                                <div className="w-full mb-3 group">
                                    <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type de question</label>
                                    <select id="countries" value={question.type} onChange={(e) => handleChangeQuestionType(e.target.value, question._id)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value={'radio'}>Choix unique</option>
                                        <option value={'checkbox'}>Choix multiple</option>
                                    </select>
                                </div>
                            </div>

                            {
                                question.answers.map((answer, j) => (
                                    <div key={answer._id} className="flex items-center gap-3 my-3">
                                        {
                                            <>
                                                <input
                                                    id={`option-${i}-${j}`}
                                                    type={question.type}
                                                    onChange={(e) => handleSetValidAnswer(question.type, question._id, answer._id)}
                                                    name={`question-${i}-${j}`}
                                                    value={j}
                                                    className={`${question.type === 'radio'
                                                        ? 'focus:ring-blue-300 dark:focus:bg-blue-600'
                                                        : 'text-blue-600 bg-gray-100 rounded focus:ring-blue-500 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800'}`
                                                        + ' ' + 'w-4 h-4 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 focus:ring-2'
                                                    }
                                                    checked={answer.isValid}
                                                />
                                                {
                                                    true
                                                        ? (
                                                            <>
                                                                <input type="text" id="small-input" value={answer.text} placeholder='Nouv. réponse' onChange={(e) => handleUpdateAnswerText(e.target.value, question._id, answer._id)} className="block max-w-xs p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                                                {
                                                                    question.answers.length > 1 && (
                                                                        <XMarkIcon onClick={(e) => handleRemoveResponse(question._id, answer._id)} className='-ml-2 w-4 h-4 text-gray-500 hover:text-gray-600 dark:text-gray-500 hover:dark:text-gray-400 cursor-pointer' />
                                                                    )
                                                                }
                                                            </>
                                                        )
                                                        : <label htmlFor={`option-${i}-${j}`} className="block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{answer.text}</label>
                                                }
                                            </>
                                        }

                                    </div>
                                ))
                            }

                            <div className="inline-flex items-center cursor-pointer" onClick={() => handleAddNewAnswer(question._id)}>
                                <PlusIcon className='w-5 h-5 text-gray-400 dark:text-gray-500 cursor-pointer' />
                                <span className="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500 cursor-pointer">Nouvelle réponse</span>
                            </div>

                            <div className='absolute bottom-5 right-5'>
                                <button type="button" onClick={(e) => handleAddNewQuestion(i + 1)} className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-1.5 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                                    <PlusIcon className='w-4 h-4' />
                                    <span className="sr-only">Icon description</span>
                                </button>
                                <button type="button" onClick={(e) => handleDuplicateQuestion(i + 1)} className="text-gray-900 border border-gray-800 hover:bg-gray-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm p-1.5 text-center inline-flex items-center mr-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">
                                    <DocumentDuplicateIcon className='w-4 h-4' />
                                    <span className="sr-only">Icon description</span>
                                </button>
                                <button type="button" onClick={(e) => handleRemoveQuestion(question._id)} className="text-red-700 border border-red-700 hover:bg-red-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-1.5 text-center inline-flex items-center mr-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                                    <TrashIcon className='w-4 h-4' />
                                    <span className="sr-only">Icon description</span>
                                </button>
                            </div>

                            <div className='absolute top-5 right-5'>
                                <input type="number" id="small-input" value={question.points} name='points' step={"0.25"} onChange={(e) => handleUpdateQuestionPoints(e, question._id)} className="block w-[65px] p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>

                        </div>
                    ))
                }



                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Créer une nouvelle session</button>
            </form>

        </div>
    )
}

export default CreateQuiz