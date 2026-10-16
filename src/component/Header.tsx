import { useData } from "../store/zustand";

const Header = () => {
    const userCount = useData((state) => state.data.length);

    return <h1 className="text-lg font-semibold">Users: {userCount}</h1>;
};

export default Header;