import { Outlet } from 'react-router-dom';
import Navbar from '../assets/Navbar';
export default function Layout() {
    return (
        <>
            <header>
                <Navbar />
            </header>
            <main>
                <Outlet />
            </main>
            <footer>
                footer
            </footer>
        </>
    )
}