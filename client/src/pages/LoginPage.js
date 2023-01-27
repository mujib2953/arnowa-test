import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils";
import { postData } from "../utils/apis";
import storage from "../utils/storage";

const LoginPage = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
    });

    useEffect(() => {
        const token = getToken();

        if (token)
            navigate("/home");
    }, [navigate]);

    const onSubmit = async (e) => {
        e.preventDefault();

        const response = await postData("/login", formData);

        if (response.token) {
            storage.setItem("token", response.token);
            storage.setItem("user", response.user);
            storage.setItem("sessions", response.sessions);
            storage.setItem("start_time", Date.now());

            navigate("/home");
        }
    };

    const onInputChange = ({ target: { value, name } }) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <>
            <div className="page login-page">
                <h2>Login</h2>
                <form onSubmit={onSubmit}>
                    <div>
                        <input
                            type="text"
                            placeholder="Name"
                            name="name"
                            value={formData.name}
                            onChange={onInputChange}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="E-mail"
                            name="email"
                            value={formData.email}
                            onChange={onInputChange}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Mobile No."
                            name="mobile"
                            value={formData.mobile}
                            onChange={onInputChange}
                            required
                        />
                    </div>

                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    );
};

export default LoginPage;
