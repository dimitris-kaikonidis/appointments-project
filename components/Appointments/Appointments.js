import { format, parse } from "date-fns";
import WhiteBorder from "../WhiteBorder/WhiteBorder";
import styles from "./Appointments.module.scss";

export default function Appointments({ bookings }) {
    const a = {};
    for (let i = 0; i < bookings.length; i++) {
        const time = format(new Date(bookings[i].date), "dd/MM/yy");

        if (a[time]) {
            a[time].push(bookings[i]);
        } else {
            a[time] = [bookings[i]];
        }
    }

    return (
        <div className={styles.bookings}>
            <h1>Appointments</h1>
            <div className={styles.date}>
                {Object.keys(a)
                    .sort(
                        (a, b) =>
                            parse(a, "dd/MM/yy", new Date()) -
                            parse(b, "dd/MM/yy", new Date())
                    )
                    .map((dateKey) => (
                        <ul key={dateKey}>
                            <h4>{dateKey}</h4>
                            {a[dateKey]
                                .sort(
                                    (a, b) =>
                                        new Date(a.date) - new Date(b.date)
                                )
                                .map((booking) => {
                                    if (booking.status !== "confirmed") return;
                                    return (
                                        <li key={booking.id}>
                                            <div className={styles.details}>
                                                <p>
                                                    Booking by {booking.name} at{" "}
                                                    {format(
                                                        new Date(booking.date),
                                                        "HH:mm"
                                                    )}
                                                </p>
                                                <p>Email: {booking.email}</p>
                                                <p>Phone: {booking.phone}</p>
                                            </div>
                                            <WhiteBorder />
                                            <p>{booking.code}</p>
                                        </li>
                                    );
                                })}
                        </ul>
                    ))}
            </div>
        </div>
    );
}
