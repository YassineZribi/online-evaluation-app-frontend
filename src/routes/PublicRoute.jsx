import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


function PublicRoute() {
    const { isAuth } = useSelector(state => state.user);
    return (
        isAuth
        ? <Navigate to='/' />
        : <Outlet />
    )
}

export default PublicRoute;