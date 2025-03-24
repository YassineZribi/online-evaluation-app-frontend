import { useSelector } from "react-redux";
import ThemeContext, { DARK_MODE } from '../contexts/ThemeContext'
import { Link } from 'react-router-dom'
import imageDashboardLight from '../assets/img-dashboard-light.png'
import imageDashboardDark from '../assets/img-dashboard-dark.png'
import { useContext } from "react";

function Home() {
  const { isAuth, info } = useSelector(state => state.user);
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <section className={`py-12 ${isAuth ? 'px-5' : ''}`}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="dark:text-white">
              <h1 className="text-4xl font-bold mb-4">Créez des évaluations en ligne</h1>
              <p className="text-lg mb-6">Notre plateforme vous permet de créer des quiz personnalisés et de les assigner à vos participants.</p>
              <Link to={isAuth ? (info.role == 'creator' ? '/my-templates' : '/my-evaluations') : '/login'} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium">Commencer maintenant</Link>
            </div>
            <div className="flex justify-center">
              <img src={theme === DARK_MODE ? imageDashboardDark : imageDashboardLight} alt="Illustration de l'évaluation en ligne" className="h-auto max-h-96 rounded-md" />
            </div>
          </div>
        </div>
      </section>

      <section className={`dark:bg-gray-800 bg-gray-100 py-12 px-5 rounded-t-[20px]`}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 dark:text-white mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              <h2 className="text-2xl font-bold dark:text-white mb-2">Facile à utiliser</h2>
              <p className="dark:text-gray-300">Notre plateforme a une interface intuitive qui vous permet de créer et gérer facilement vos évaluations.</p>
            </div>
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" style={{transform: 'rotate(45deg)'}} className="h-12 w-12 dark:text-white mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <h2 className="text-2xl font-bold dark:text-white mb-2">Flexibilité de personnalisation</h2>
              <p className="dark:text-gray-300">Vous pouvez personnaliser les évaluations en ajoutant des questions, des options de réponse et des règles de notation selon vos besoins.</p>
            </div>
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 dark:text-white mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold dark:text-white mb-2">Suivi et analyse</h2>
              <p className="dark:text-gray-300">Obtenez des résultats détaillés de chaque évaluation et exportez-les au format CSV ou Excel pour une analyse ultérieure.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`bg-gray-100 dark:bg-gray-800 py-12 px-5`}>
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Témoignages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <img src="/profil-images/1.jpg" alt="Photo du témoin 1" className="rounded-full h-14 w-14 mr-4" />
                <p className="text-gray-800 dark:text-gray-200 font-bold">Mario</p>
              </div>
              <p className="text-gray-600 dark:text-gray-300">"J'ai trouvé la plateforme d'évaluation en ligne très conviviale et facile à utiliser. Elle m'a permis de créer rapidement des quiz interactifs pour mes étudiants."</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <img src="/profil-images/2.jpg" alt="Photo du témoin 2" className="rounded-full h-14 w-14 mr-4" />
                <p className="text-gray-800 dark:text-gray-200 font-bold">Jean</p>
              </div>
              <p className="text-gray-600 dark:text-gray-300">"Grâce à cette plateforme, j'ai pu évaluer les connaissances de mes candidats de manière efficace et obtenir des résultats précis en un rien de temps. Je la recommande vivement."</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <img src="/profil-images/3.jpg" alt="Photo du témoin 3" className="rounded-full h-14 w-14 mr-4" />
                  <p className="text-gray-800 dark:text-gray-200 font-bold">Sophie</p>
              </div>
              <p className="text-gray-600 dark:text-gray-300">"La plateforme d'évaluation en ligne a transformé ma manière d'enseigner. Mes étudiants sont plus engagés et motivés lorsqu'ils passent les quiz. Je suis ravie de l'utiliser."</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <img src="/profil-images/4.jpg" alt="Photo du témoin 4" className="rounded-full h-14 w-14 mr-4" />
                  <p className="text-gray-800 dark:text-gray-200 font-bold">Thomas</p>
              </div>
              <p className="text-gray-600 dark:text-gray-300">"En tant que candidat, j'ai trouvé l'expérience de passer des évaluations en ligne sur cette plateforme très fluide. Les questions étaient claires et le système a généré des résultats instantanés."</p>
            </div>
          </div>
        </div>
      </section>

      <footer className={`dark:bg-gray-800 bg-gray-100 py-8 px-5`}>
        <div className="container mx-auto">
          <p className="text-center text-gray-500">© {new Date().getFullYear()} <i>EvaQuiz</i>. Tous droits réservés.</p>
        </div>
      </footer>
    </>
  )
}

export default Home
