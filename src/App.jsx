import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import PrivateRoute from './routes/PrivateRoute'
import PublicRoute from './routes/PublicRoute'
import Login from './pages/Login'
import CustomRoute from './routes/CustomRoute'
import Layout from './layouts/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { requestLoadUser } from './redux/actions/userActionCreators'
import { useEffect } from 'react'
import Loader from './components/Loader'
import Courses from './pages/Courses'
import CoursePage from './pages/CoursePage'
import Profile from './pages/Profile'
import CreateQuiz from './pages/CreateQuiz'
import Templates from './pages/Templates'
import Evaluations from './pages/Evaluations'
import Backdrop from './components/Backdrop'
import EvaluationSettings from './pages/EvaluationSettings'
import PassEvaluation from './pages/PassEvaluation'
import ParticipantsResponses from './pages/ParticipantsResponses'
import DetailsEvaluationResponses from './pages/DetailsEvaluationResponses'
import Register from './pages/Register'

function App() {
  const dispatch = useDispatch()
  const { pageLoading } = useSelector(state => state.feedback);
  const { isAuth } = useSelector(state => state.user);
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (token)
      dispatch(requestLoadUser(token))
  }, [])

  if (token && pageLoading && !isAuth)
    return <Loader />

  return (
    <div className="app">
      <Layout>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path='profile' element={<Profile />} />
            <Route path='courses' element={<Courses />} />
            <Route path='my-evaluations' element={<Evaluations />} />
            <Route path='my-templates' element={<Templates />} />
            <Route path='update-template/:quizId' element={<CreateQuiz />} />
            <Route path='pass-evaluation/:evalId' element={<PassEvaluation />} />
            <Route path='settings/:evalId' element={<EvaluationSettings />} />
            <Route path='courses/:courseSlug/:pageId' element={<CoursePage />} />
            <Route path='participants-responses/:evalId' element={<ParticipantsResponses />} />
            <Route path='participant-response/:evalId/:userId' element={<DetailsEvaluationResponses />} />
          </Route>

          <Route element={<PublicRoute />}>
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
          </Route>

          <Route element={<CustomRoute />}>
            <Route path='/' element={<Home />} />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>

      </Layout>
      <Backdrop />
    </div>
  )
}

export default App
