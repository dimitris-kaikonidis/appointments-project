import axios from "axios";
import { format } from "date-fns";
import Image from "next/image";
import WhiteBorder from "../WhiteBorder/WhiteBorder";
import styles from "./Requests.module.scss";

export default function Requests({ requests, changeVis }) {
    const confirm = (id) => {
        changeVis();
        try {
            axios.post("/api/requests", { id, status: "confirmed" });
        } catch (error) {
            location.reload();
        }
    };

    const reject = (id) => {
        changeVis();
        try {
            axios.post("/api/requests", { id, status: "rejected" });
        } catch (error) {
            location.reload();
        }
    };

    return (
        <div className={styles.requests}>
            <div>
                <h1>Pending Requests</h1>
                <ul>
                    {requests.map((request) => {
                        if (request.status !== "pending") return;
                        const time = format(
                            new Date(request.created_at),
                            "HH:mm dd/MM/yy"
                        );
                        return (
                            <li key={request.id}>
                                <div className={styles.details}>
                                    <p>
                                        Request by {request.name} - {time}
                                    </p>
                                    <div>
                                        <p>Email: {request.email}</p>
                                        <p>Phone: {request.phone}</p>
                                    </div>
                                </div>
                                <WhiteBorder />
                                <div className={styles.actions}>
                                    {request.status === "pending" ? (
                                        <>
                                            <p
                                                onClick={() =>
                                                    confirm(request.id)
                                                }
                                            >
                                                Confirm ✔️
                                            </p>
                                            <p
                                                onClick={() =>
                                                    reject(request.id)
                                                }
                                            >
                                                Reject &nbsp;&nbsp;&nbsp;❌
                                            </p>
                                        </>
                                    ) : (
                                        <div>
                                            <Image
                                                src="/assets/confirmed.png"
                                                width={30}
                                                height={30}
                                                alt="confirmed"
                                            />
                                        </div>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
