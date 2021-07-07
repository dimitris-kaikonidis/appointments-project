import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import InputField from "../../components/InputField/InputField";
import NavToHome from "../../components/NavToHome/NavToHome";
import styles from "../../styles/Register.module.scss";

export default function Register() {
    const router = useRouter();
    const [inputs, setInputs] = useState({
        name: null,
        email: null,
        phone: null,
        password: null,
    });

    const handleInput = (target, value) => {
        setInputs({
            ...inputs,
            [target]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { name, email, phone, password } = inputs;
        if (!name || !email || !phone || !password) return;
        else {
            try {
                await axios.post("/api/register", inputs);
                router.push("/overview");
            } catch (error) {
                router.reload();
            }
        }
    };

    return (
        <div className={styles.container}>
            <NavToHome />
            <form className={styles.form} onSubmit={handleSubmit}>
                <h1>Register</h1>
                <InputField
                    name="name"
                    label="Name of your Business"
                    handleInput={handleInput}
                />
                <InputField
                    name="email"
                    type="email"
                    label="Email Address"
                    handleInput={handleInput}
                />
                <InputField
                    name="phone"
                    type="tel"
                    label="Contact Number"
                    handleInput={handleInput}
                />
                <InputField
                    name="password"
                    type="password"
                    label="Password"
                    handleInput={handleInput}
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
