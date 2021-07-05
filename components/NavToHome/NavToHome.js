import Link from "next/link";
import WhiteBorder from "../WhiteBorder/WhiteBorder";
import styles from "./NavToHome.module.scss";

export default function NavToHome() {
    return (
        <nav className={styles.nav}>
            <div className={styles.home}>
                <Link href="/">Home</Link>
            </div>
            <WhiteBorder />
        </nav>
    );
}
