import { useState } from "react";
import { useRouter } from 'next/router';
import axios from "axios";
import InputField from "../../components/InputField/InputField";
import NavToHome from "../../components/NavToHome/NavToHome";
import styles from "../../styles/Register.module.scss";

export default function Login() {
    const router = useRouter();
    const [inputs, setInputs] = useState({
        email: null,
        password: null
    });

    const handleInput = (target, value) => {
        setInputs({
            ...inputs,
            [target]: value
        });
    };

    const handleSubmit = async event => {
        event.preventDefault();
        try {
            await axios.post("/api/login", inputs);
            router.push("/overview");
        } catch (error) {
            router.reload();
        }
    };

    return (
        <div className={styles.container}>
            <NavToHome />
            <form className={styles.form} onSubmit={handleSubmit}>
                <h1>Login</h1>
                <InputField
                    name="email" type="email"
                    label="Email Address"
                    handleInput={handleInput}
                />
                <InputField
                    name="password" type="password"
                    label="Password"
                    handleInput={handleInput}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}