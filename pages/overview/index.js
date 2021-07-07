import { useState, useEffect } from "react";
import { getSchedule, getRequests, getBookingsBusiness } from "../../db/index";
import DatePicker from "react-datepicker";
import MultiSelect from "react-multi-select-component";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import { withIronSession } from "next-iron-session";
import axios from "axios";
import Info from "../../components/Info/Info";
import WhiteBorder from "../../components/WhiteBorder/WhiteBorder";
import Requests from "../../components/Requests/Requests";
import Appointments from "../../components/Appointments/Appointments";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../../styles/Overview.module.scss";

const SESSION_SECRET =
    process.env.SESSION_SECRET || require("../../secrets.json").SESSION_SECRET;

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
    const [requestsVis, setRequestsVis] = useState(false);

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
    const toggleSchedule = () => {
        setRequestsVis(false);
        setScheduleVis(!scheduleVis);
    };
    const toggleRequests = () => {
        setScheduleVis(false);
        setRequestsVis(!requestsVis);
    };

    return (
        <>
            <div className={styles.info}></div>
            <div className={styles.logout} onClick={logout}>
                <WhiteBorder />
                <Link href="/">Logout</Link>
            </div>
            <div className={styles.toggle}>
                <p onClick={toggleSchedule}>Schedule</p>
                <WhiteBorder />
                <p onClick={toggleRequests}>Requests</p>
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
            {requestsVis && (
                <div className={styles.requests}>
                    <div className={styles.arrowup}></div>
                    <Requests requests={props.requests} />
                </div>
            )}
            <div className={styles.overview}>
                <Info user={props.user} />
                <Appointments bookings={props.bookings} />
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
                const scheduleResult = await getSchedule(user.id);
                delete scheduleResult.rows[0].created_at;

                const requestResult = await getRequests(user.name);
                const requests = requestResult.rows.map((request) => {
                    const time = format(
                        new Date(request.created_at),
                        "HH:mm dd/MM/yy"
                    );
                    request.created_at = time;
                    return request;
                });

                const bookingsResult = await getBookingsBusiness(user.name);
                const bookings = bookingsResult.rows.map((booking) => {
                    const time = format(
                        new Date(booking.created_at),
                        "HH:mm dd/MM/yy"
                    );
                    booking.created_at = time;
                    return booking;
                });

                return {
                    props: {
                        user,
                        schedule: { ...scheduleResult.rows[0] },
                        requests,
                        bookings,
                    },
                };
            } catch (error) {
                console.log(error);
                return {
                    props: { user, schedule: {}, requests: [], bookings: [] },
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
