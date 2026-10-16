import { Link, Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
    return (
        <div>
            <nav className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
                <div className="flex gap-4">
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                </div>
                <Header />
            </nav>
            <Outlet />
        </div>
    )
}

export default Layout;