import { useSelector } from "react-redux";
import ProfileImage from "../components/ProfileImage"

function Profile() {
    const { info } = useSelector(state => state.user);
    return (
        <div className="pt-5">

            <div className="max-w-xl p-6 mx-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <ProfileImage className="w-[50%] aspect-square text-5xl sm:text-6xl mx-auto mb-5" user={info} />
                <div>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Informations générales</h5>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <tbody>
                                <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Nom
                                    </th>
                                    <td className="px-6 py-4 capitalize">
                                        {info.lastName}
                                    </td>
                                </tr>
                                <tr className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Prénom
                                    </th>
                                    <td className="px-6 py-4 capitalize">
                                        {info.firstName}
                                    </td>
                                </tr>
                                <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Email
                                    </th>
                                    <td className="px-6 py-4">
                                        {info.email}
                                    </td>
                                </tr>
                                <tr className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Rôle
                                    </th>
                                    <td className="px-6 py-4 capitalize">
                                        utilisateur
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default Profile