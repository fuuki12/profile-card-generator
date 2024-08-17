"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Radar } from "react-chartjs-2";
import html2canvas from "html2canvas";
import { CopyToClipboard } from "react-copy-to-clipboard";
import useGitHubUserData from "../../hooks";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./styles";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);
const Profile: React.FC = () => {
  const [username, setUsername] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const { fetchUserData, userData, isLoading, error } = useGitHubUserData();
  const cardRef = useRef<HTMLDivElement | null>(null);

  const radarData = useMemo(
    () => ({
      labels: ["Repos", "Followers", "Following", "Gists"],
      datasets: [
        {
          label: "GitHub Stats",
          data: userData
            ? [
                userData.public_repos,
                userData.followers,
                userData.following,
                userData.public_gists,
              ]
            : [0, 0, 0, 0],
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 2,
        },
      ],
    }),
    [userData]
  );

  const captureCardAsImage = useCallback(
    async (
      ref: React.RefObject<HTMLDivElement>,
      width: number,
      height: number
    ): Promise<string> => {
      if (ref.current) {
        const canvas = await html2canvas(ref.current, {
          useCORS: true,
          width,
          height,
          scale: 2,
        });
        return canvas.toDataURL("image/png");
      }
      return "";
    },
    []
  );

  const generateEmbedCode = useCallback(async () => {
    const base64Image = await captureCardAsImage(cardRef, 460, 708);
    setEmbedCode(`
      <a href="https://github.com/${username}">
        <div style="width: 460px; padding: 20px; text-align: center; border: 1px solid #eaeaea; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <img src="${base64Image}" alt="GitHub Profile Card" style="width: 100%;" />
        </div>
      </a>
    `);
  }, [captureCardAsImage]);

  useEffect(() => {
    if (userData) {
      setTimeout(generateEmbedCode, 500);
    }
  }, [userData, generateEmbedCode]);

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="GitHub Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={styles.input}
      />
      <button
        type="button"
        onClick={() => fetchUserData(username)}
        style={styles.input}
        disabled={isLoading}
      >
        Generate
      </button>

      {isLoading && <p style={styles.loadingText}>Loading...</p>}
      {error && <p style={styles.errorText}>{error}</p>}

      {userData && (
        <>
          <div style={styles.card} ref={cardRef}>
            <img
              src={userData.avatar_url}
              alt={userData.name}
              style={styles.avatar}
            />
            <h2 style={styles.name}>{userData.name}</h2>
            <p style={styles.bio}>{userData.bio}</p>
            <div style={styles.radarChartContainer}>
              <Radar data={radarData} options={{ responsive: true }} />
            </div>
          </div>

          <div style={styles.embedContainer}>
            <h3>Embed Code</h3>
            <textarea readOnly value={embedCode} style={styles.textarea} />
            <CopyToClipboard text={embedCode}>
              <button style={styles.copyButton}>Copy to Clipboard</button>
            </CopyToClipboard>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
