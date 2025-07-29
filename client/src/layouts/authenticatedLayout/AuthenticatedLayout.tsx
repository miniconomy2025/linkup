import { Outlet } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';

const AuthenticatedLayout = () => {
    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </>
    );
};

export default AuthenticatedLayout;