import { Link } from "react-router-dom";

function HomePage() {
    return (
        <>
            <div>
                <Link to={"/register"}>Register</Link>
            </div>
        </>
    );
}
export default HomePage;
