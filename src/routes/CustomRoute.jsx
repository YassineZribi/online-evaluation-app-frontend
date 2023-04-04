import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import InsideLayout from '../layouts/InsideLayout';
import OutsideLayout from '../layouts/OutsideLayout';

function CustomRoute() {
    const { isAuth } = useSelector(state => state.user);
    return (
        isAuth
        ? <InsideLayout><Outlet /></InsideLayout>
        : <OutsideLayout><Outlet /></OutsideLayout>
    )
}

export default CustomRoute;