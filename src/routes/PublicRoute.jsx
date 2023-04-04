import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import OutsideLayout from '../layouts/OutsideLayout';

function PublicRoute() {
    const { isAuth } = useSelector(state => state.user);
    return (
        isAuth
        ? <Navigate to='/' />
        : <OutsideLayout><Outlet /></OutsideLayout>
    )
}

export default PublicRoute;