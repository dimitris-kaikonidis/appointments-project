import Link from "next/link";
import styles from "./SearchResultsBox.module.scss";

export default function SearchResultsBox(props) {
    const { searchResults, requestStatus, focus } = props;

    return (
        <ul
            className={
                focus ? styles.searchResults : `${styles.searchResults} hidden`
            }
        >
            {searchResults.length === 0 && requestStatus ? (
                <p>No user found matching your search.</p>
            ) : null}
            {searchResults.map((business) => (
                <li key={business.id} className={styles.li}>
                    {!business ? null : (
                        <>
                            <Link href={business.name}>{business.name}</Link>
                        </>
                    )}
                </li>
            ))}
        </ul>
    );
}
