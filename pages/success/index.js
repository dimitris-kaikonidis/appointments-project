import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Success() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        setTimeout(() => router.push("/"), 5000);
        setInterval(() => setCountdown(countdown - 1), 1000);
    });

    return (
        <div>
            <h1>Your booking has been succesfully submitted.</h1>
            <h2>
                You will receive a confirmation on your e-mail address or phone.
            </h2>
            <p>You will be redirected in {countdown}</p>
        </div>
    );
}
