const { useEffect } = require("react");
const { useNavigate } = require("react-router-dom");
const { getToken } = require("../utils");

const LandingPage = () => {

    const naviagte = useNavigate();

    useEffect(() => {

        const token = getToken();
        const path = token ? "/home" : "/login";

        naviagte(path);

    });

    return (
        <></>
    );

};

export default LandingPage;
