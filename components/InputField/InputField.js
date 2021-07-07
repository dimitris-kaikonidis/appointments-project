import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import styles from "./InputField.module.scss";

export default function InputField(props) {
    const [state, setState] = useState({ [props.name]: "" });

    const handleChange = (event) =>
        setState({ [props.name]: event.target.value });
    useEffect(() => props.handleInput(props.name, state[props.name]), [state]);

    const { name, type, value, label, loading, handleBlur, handleFocus } =
        props;

    return (
        <div className={styles.inputField}>
            <input
                id={name}
                name={name}
                type={type || "text"}
                value={value}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            <span
                id="empty"
                className={`${styles.span} ${
                    state[name]
                        ? `${styles.full} ${styles.empty}`
                        : styles.empty
                }`}
            >
                {label}
            </span>
            <div className={styles.loading}>
                {loading ? <Loading type="input" /> : ""}
            </div>
        </div>
    );
}
