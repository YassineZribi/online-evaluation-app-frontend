import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import InsideLayout from '../layouts/InsideLayout';

function PrivateRoute() {
    const { isAuth } = useSelector(state => state.user);
    return (
        isAuth
        ? <InsideLayout><Outlet /></InsideLayout>
        : <Navigate to='/login' />
    )
}

export default PrivateRoute;