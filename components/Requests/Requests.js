import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import Image from "next/image";
import WhiteBorder from "../WhiteBorder/WhiteBorder";
import styles from "./Requests.module.scss";

export default function Requests() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const call = async () => {
            try {
                const response = await axios.get("/api/requests");
                setRequests(response.data);
            } catch (error) {
                setRequests([]);
            }
        };
        call();
        setInterval(call, 30000);
    }, []);

    const confirm = (id) => {
        try {
            axios.post("/api/requests", { id, status: "confirmed" });
        } catch (error) {
            location.reload();
        }
        const updatedStatus = requests.map((request) => {
            if (request.id === id) {
                return { ...request, status: "confirmed" };
            } else return request;
        });
        setRequests(updatedStatus);
    };

    const reject = (id) => {
        try {
            axios.post("/api/requests", { id, status: "rejected" });
        } catch (error) {
            location.reload();
        }
        const updatedStatus = requests.filter((request) => request.id !== id);
        setRequests(updatedStatus);
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
            <WhiteBorder />
            <div>
                <h1>Confirmed Requests</h1>
                <ul>
                    {requests.map((request) => {
                        if (request.status !== "confirmed") return;
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
                                    <p>{request.code}</p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
