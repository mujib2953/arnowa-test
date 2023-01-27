import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSessionStartDateTime, getSessoionDuration } from "../utils";
import { postData } from "../utils/apis";
import storage from "../utils/storage";

const HomePage = () => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [message, setMessasge] = useState("");
    const [sessions, setSessions] = useState(null);

    const onLogout = async () => {
        await postData("/logout", null, true);
        storage.clearAll();
        navigate("/login");
    };

    const onMessageFormSubmit = async (e) => {
        e.preventDefault();

        const response = await postData("/savemessage", { message }, true);

        const newSession = sessions.map(s => {
            if (s._id === response.data.sessionId) {
                s.messages.push(response.data);
            }
            return s;
        });

        setSessions(newSession);
        setMessasge("");
        storage.setItem("sessions", newSession, true);
    };

    const getMessageRows = () => {
        const elements = [];
        let index = 0;

        for (let s of sessions) {

            index++;

            if (s.messages.length > 0) {
                elements.push(
                    <tr key={index}>
                        <td>{index}</td>
                        <td rowSpan={s.messages.length}>{getSessionStartDateTime(s.startTime)}</td>
                        <td rowSpan={s.messages.length}>
                            {!s.active ? getSessoionDuration(s.startTime, s.endTime) : "Current Session"}
                        </td>
                        <td rowSpan={s.messages.length}>{s.active ? "Active" : "Inactive"}</td>
                        <td>{s.messages[0].message}</td>
                    </tr>
                );

                for (let m = 1; m < s.messages.length; m++) {
                    const data = s.messages[m];
                    index++;
                    elements.push(
                        <tr key={index}>
                            <td>{index}</td>
                            <td>{data.message}</td>
                        </tr>
                    );
                }
            } else {

                elements.push(
                    <tr key={index}>
                        <td>{index}</td>
                        <td>{getSessionStartDateTime(s.startTime)}</td>
                        <td>
                            {!s.active ? getSessoionDuration(s.startTime, s.endTime) : "Current Session"}
                        </td>
                        <td>{s.active ? "Active" : "Inactive"}</td>
                        <td></td>
                    </tr>
                );
            }
        }

        return elements;
    };

    // * For Auto Logout
    useEffect(() => {

        /*
            * Interval after every 5sec, we are checking valid/active session
            ? Will 5 second is good approach? like time should be less or any other aproach should be used
        */
        const _interval = setInterval(() => {
            const startTime = storage.getItem("start_time");
            const diff = Date.now() - Number(startTime);
            const SESSION_TIMEOUT_TIME = 5; // * 5 as 5 minutes

            if (diff >= SESSION_TIMEOUT_TIME * 60 * 1000) {
                clearInterval(_interval);
                onLogout();
            }
        }, 5000);

        return () => {
            if (_interval)
                clearInterval(_interval);
        }

    });

    useEffect(() => {
        if (!storage.isItem("token")) {
            navigate("/login");
        } else {
            console.log("Read from storage ...");
            setUser(JSON.parse(storage.getItem("user")));
            setSessions(JSON.parse(storage.getItem("sessions")));
        }
    }, [navigate]);

    if (!user)
        return (
            <></>
        );

    return (
        <div className="page home-page">

            <div className="header">
                <h2>Welcome ... {user.name} !!!</h2>
                <button onClick={onLogout}>Logout</button>
            </div>

            <form onSubmit={onMessageFormSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="Enter your message"
                        value={message}
                        onChange={({ target: { value } }) => setMessasge(value)}
                    />
                </div>

                <button type="submit">Save Message</button>
            </form>

            <div className="timestamps">
                <table>
                    <thead>
                        <tr>
                            <th>Sr. No.</th>
                            <th>Session Start Time</th>
                            <th>Session Duration</th>
                            <th>Session Status</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* <tr>
                            <td>1</td>
                            <td>Jan 2, 2023 11:30:11 IST</td>
                            <td>4 minutes</td>
                            <td>Test Message</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Jan 2, 2023 11:30:11 IST</td>
                            <td>4 minutes</td>
                            <td rowSpan={2}>Test Message</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Jan 2, 2023 11:30:11 IST</td>
                            <td>4 minutes</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Jan 2, 2023 11:30:11 IST</td>
                            <td>4 minutes</td>
                            <td>Test Message</td>
                        </tr> */}

                        {
                            getMessageRows()
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HomePage;