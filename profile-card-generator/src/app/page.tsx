import Image from "next/image";
import styles from "./page.module.css";
import { Profile } from "@/features/ProfileCard/components";

export default function Home() {
  return (
    <main className={styles.main}>
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h1>GitHub Profile Card Generator</h1>
        <Profile />
      </div>
    </main>
  );
}
