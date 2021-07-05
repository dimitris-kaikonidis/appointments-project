import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { parseISO, getDate, getYear, getMonth } from "date-fns";
import axios from "axios";
import Link from "next/link";
import DatePicker from "react-datepicker";
import Loading from "../../components/Loading/Loading";
import Info from "../../components/Info/Info";
import WhiteBorder from "../../components/WhiteBorder/WhiteBorder";
import InputField from "../../components/InputField/InputField";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../../styles/Business.module.scss";

export default function Business() {
    const router = useRouter();
    const [info, setInfo] = useState(null);
    const [booking, setBooking] = useState(null);
    const [booked, setBooked] = useState([]);
    const [bookedSpecificDay, setBookedSpecificDay] = useState([]);

    const filterWeekDays = (date) => {
        const day = date.getDay();
        return (
            day !== info.daysoff[0] &&
            day !== info.daysoff[1] &&
            day !== info.daysoff[2] &&
            day !== info.daysoff[3] &&
            day !== info.daysoff[4] &&
            day !== info.daysoff[5] &&
            day !== info.daysoff[6]
        );
    };

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(
                    `/api/${router.query.business}`
                );
                setInfo(response.data.info);
                const parsedBookings = response.data.bookings.map((booking) => {
                    const parsedBooking = parseISO(booking.date);
                    const year = getYear(parsedBooking);
                    const month = getMonth(parsedBooking);
                    const day = getDate(parsedBooking);
                    const date = new Date(year, month, day);
                    return { [date.valueOf()]: parsedBooking };
                });
                setBooked(parsedBookings);
            } catch (error) {
                router.push("/");
            }
        })();
    }, [router]);

    useEffect(() => {
        if (booking && booking.date) {
            const indexValue = new Date(booking.date);
            let arr = [];
            booked.filter((booking) => {
                if (booking[indexValue.valueOf()]) {
                    arr.push(booking[indexValue.valueOf()]);
                }
            });
            setBookedSpecificDay(arr);
        }
    }, [booking, booked]);

    const home = () => router.push("/");

    const handleInput = (target, value) => {
        setBooking({
            ...booking,
            [target]: value,
        });
    };

    const setBookingDate = (date) => setBooking({ ...booking, date });

    const book = async () => {
        const bookingDetails = {
            business_name: info.name,
            ...booking,
        };
        if (!bookingDetails.tel || !bookingDetails.email) return;
        try {
            await axios.post("/api/book", bookingDetails);
            router.push("/success");
        } catch (error) {
            router.reload();
        }
    };

    if (!info) return <Loading />;
    else {
        return (
            <>
                <div className={styles.home}>
                    <WhiteBorder />
                    <Link href="/">Home</Link>
                </div>
                <div className={styles.booking}>
                    <Info user={info} />
                    <div className={styles.details}>
                        <div className={styles.inputs}>
                            <div>
                                <InputField
                                    name="tel"
                                    type="tel"
                                    label="Phone Number"
                                    handleInput={handleInput}
                                />
                                <InputField
                                    name="email"
                                    type="email"
                                    label="Email"
                                    handleInput={handleInput}
                                />
                                <InputField
                                    name="name"
                                    label="Full Name (optional)"
                                    handleInput={handleInput}
                                />
                            </div>
                        </div>
                        <div className={styles.dates}>
                            <div>
                                <DatePicker
                                    selected={booking ? booking.date : null}
                                    onChange={setBookingDate}
                                    dateFormat="dd/MM yyyy"
                                    placeholderText="Select Date"
                                    minDate={new Date()}
                                    filterDate={filterWeekDays}
                                />
                            </div>
                            <div>
                                <DatePicker
                                    selected={booking ? booking.date : null}
                                    onChange={setBookingDate}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeFormat="HH:mm"
                                    dateFormat="HH:mm"
                                    placeholderText="Select Time"
                                    minTime={parseISO(info.start)}
                                    maxTime={parseISO(info.finish)}
                                    excludeTimes={bookedSpecificDay}
                                />
                            </div>
                        </div>
                    </div>
                    <button className={styles.button} onClick={book}>
                        Make Booking
                    </button>
                </div>
            </>
        );
    }
}
