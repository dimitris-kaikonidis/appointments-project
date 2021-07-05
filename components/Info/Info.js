import styles from "./Info.module.scss";

export default function Info({ user }) {
    const { name, email, phone } = user;
    return (
        <div className={styles.overview}>
            <div className={styles.info}>
                <h1>{name}</h1>
                <div>
                    <h4>Email: {email}</h4>
                    <h4>Contact Number: {phone}</h4>
                </div>
            </div>
        </div>
    );
}
