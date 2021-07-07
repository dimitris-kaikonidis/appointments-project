import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Search from "../components/Search/Search";
import WhiteBorder from "../components/WhiteBorder/WhiteBorder";
import { withIronSession } from "next-iron-session";
import styles from "../styles/Home.module.scss";

const SESSION_SECRET = process.env.SESSION_SECRET;
//|| require("../secrets.json").SESSION_SECRET;

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Appointments</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <nav>
                    <div className={styles.login}>
                        <Link href="login">Login</Link>
                    </div>
                    <WhiteBorder />
                    <div className={styles.register}>
                        <Link href="register">Register your Business</Link>
                    </div>
                </nav>
                <h1>Book your appointment</h1>
                <Search />
            </main>
            <footer className={styles.footer}>
                <p>Booking App by Dimitris Kaikonidis</p>
                <div className={styles.github}>
                    <Link
                        href="https://github.com/dimitris-kaikonidis"
                        passHref
                    >
                        <Image
                            src="/assets/github.png"
                            width={30}
                            height={30}
                            alt="github"
                        />
                    </Link>
                </div>
            </footer>
        </div>
    );
}

export const getServerSideProps = withIronSession(
    async ({ req, res }) => {
        const user = req.session.get("user");

        if (user) {
            return {
                redirect: {
                    destination: "/overview",
                },
            };
        }

        return {
            props: {},
        };
    },
    {
        password: SESSION_SECRET,
        cookieName: "user",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
        },
    }
);
