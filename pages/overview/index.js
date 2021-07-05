import { useState, useEffect } from "react";
import { getSchedule } from "../../db/index";
import DatePicker from "react-datepicker";
import MultiSelect from "react-multi-select-component";
import Link from "next/link";
import { useRouter } from "next/router";
import { withIronSession } from "next-iron-session";
import { SESSION_SECRET } from "../../secrets.json";
import axios from "axios";
import Info from "../../components/Info/Info";
import WhiteBorder from "../../components/WhiteBorder/WhiteBorder";
import Requests from "../../components/Requests/Requests";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../../styles/Overview.module.scss";

export default function Overview(props) {
    const router = useRouter();
    const [startHr, setStartHr] = useState(
        (props.schedule && Date.parse(props.schedule.start)) ||
            new Date(0, 0, 0, 0)
    );
    const [finishHr, setFinishHr] = useState(
        (props.schedule && Date.parse(props.schedule.finish)) ||
            new Date(0, 0, 0, 23, 30)
    );
    const [selectedWeekDays, setSelectedWeekDays] = useState([]);
    const [selectedWeekDaysNums, setSelectedWeekDaysNums] = useState([]);
    const [scheduleVis, setScheduleVis] = useState(false);

    const weekdays = [
        { label: "Sunday", value: 0 },
        { label: "Monday", value: 1 },
        { label: "Tuesday", value: 2 },
        { label: "Wednesday", value: 3 },
        { label: "Thursday", value: 4 },
        { label: "Friday", value: 5 },
        { label: "Saturday", value: 6 },
    ];

    const overrideStrings = {
        allItemsAreSelected: "All days are selected.",
        clearSearch: "Clear Search",
        noOptions: "No options",
        selectAll: "Select All Days",
        selectSomeItems: "Select...",
    };

    const saveChanges = async () => {
        const schedule = {
            start: startHr,
            finish: finishHr,
            daysOff: selectedWeekDaysNums,
            id: props.user.id,
        };
        try {
            await axios.post("/api/schedule", schedule);
        } catch (error) {
            router.reload();
        }
    };

    useEffect(() => {
        if (selectedWeekDays.length) {
            const arr = [];
            selectedWeekDays.forEach((d) => arr.push(d.value));
            setSelectedWeekDaysNums(arr);
        } else setSelectedWeekDaysNums([]);
    }, [selectedWeekDays]);

    const logout = async () => await axios.post("/api/logout");
    const toggleVis = () => setScheduleVis(!scheduleVis);

    return (
        <>
            <div className={styles.info}></div>
            <div className={styles.logout} onClick={logout}>
                <WhiteBorder />
                <Link href="/">Logout</Link>
            </div>
            <div className={styles.toggle}>
                <p onClick={toggleVis}>Schedule</p>
                <WhiteBorder />
            </div>
            {scheduleVis && (
                <div className={styles.schedule}>
                    <div className={styles.arrowup}></div>
                    <div className={styles.times}>
                        <p>Working Hours Start:</p>
                        <DatePicker
                            selected={startHr}
                            onChange={(date) => setStartHr(date)}
                            showTimeSelect
                            showTimeSelectOnly
                            timeFormat="HH:mm"
                            dateFormat="HH:mm"
                        />
                    </div>
                    <div className={styles.times}>
                        <p>Working Hours Finish:</p>
                        <DatePicker
                            selected={finishHr}
                            onChange={(date) => setFinishHr(date)}
                            showTimeSelect
                            showTimeSelectOnly
                            timeFormat="HH:mm"
                            dateFormat="HH:mm"
                        />
                    </div>
                    <div className={styles.times}>
                        <p>Select Days-off:</p>
                        <MultiSelect
                            options={weekdays}
                            value={selectedWeekDays}
                            onChange={setSelectedWeekDays}
                            labelledBy="Select"
                            disableSearch
                            overrideStrings={overrideStrings}
                            className={styles.rmsc}
                        />
                    </div>
                    <button onClick={saveChanges}>Save</button>
                </div>
            )}
            <div className={styles.overview}>
                <Info user={props.user} />
                <div className={styles.actions}>
                    <Requests user={props.user} />
                </div>
            </div>
        </>
    );
}

export const getServerSideProps = withIronSession(
    async ({ req, res }) => {
        const user = req.session.get("user");

        if (!user) {
            return {
                redirect: {
                    destination: "/",
                },
            };
        } else {
            try {
                const result = await getSchedule(user.id);
                delete result.rows[0].created_at;
                return {
                    props: {
                        user,
                        schedule: { ...result.rows[0] },
                    },
                };
            } catch (error) {
                return {
                    props: { user },
                };
            }
        }
    },

    {
        password: SESSION_SECRET,
        cookieName: "user",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
        },
    }
);
