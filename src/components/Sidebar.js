import Navbar from "../components/Navbar"
import Searchbar from "../components/Searchbar"
import Chats from "../components/Chats"

const Sidebar = () => {
    return <>
        <div className="sidebar">
            <Navbar />
            <Searchbar />
            <Chats />
        </div>
    </>
}

export default Sidebar;
