import { Link } from "react-router-dom";

function Home() {
    return (
        <>
            <div>
                <Link to={"/register"}>Register</Link>
            </div>
        </>
    );
}
export default Home;
