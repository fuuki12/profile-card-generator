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
import useGitHubUserData from "../hooks";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const styles = {
  container: {
    padding: "20px",
    textAlign: "center" as const,
    fontFamily: "'Comic Sans MS', cursive, sans-serif",
    backgroundColor: "#fff0f6",
    borderRadius: "20px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
    maxWidth: "500px",
    margin: "0 auto",
  },
  input: {
    padding: "12px",
    width: "80%",
    borderRadius: "30px",
    border: "2px solid #ffccff",
    outline: "none",
    marginBottom: "20px",
    fontSize: "16px",
    backgroundColor: "#fff0f6",
    color: "#cc00cc",
  },
  loadingText: {
    color: "#ff66cc",
  },
  errorText: {
    color: "red",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
    textAlign: "center" as const,
  },
  avatar: {
    width: "100px",
    borderRadius: "50%",
    border: "5px solid #ffccff",
    marginBottom: "15px",
  },
  name: {
    fontSize: "28px",
    color: "#ff66cc",
    marginBottom: "10px",
  },
  bio: {
    fontSize: "16px",
    color: "#fff",
    marginBottom: "20px",
    fontStyle: "italic",
  },
  radarChartContainer: {
    width: "100%",
    maxWidth: "400px",
    margin: "0 auto",
  },
  embedContainer: {
    marginTop: "20px",
    textAlign: "left" as const,
  },
  textarea: {
    width: "100%",
    height: "100px",
    fontSize: "12px",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontFamily: "monospace",
  },
  copyButton: {
    marginTop: "10px",
    padding: "10px 20px",
    borderRadius: "30px",
    border: "none",
    backgroundColor: "#ff66cc",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },
  ogpButton: {
    marginTop: "10px",
    padding: "10px 20px",
    borderRadius: "30px",
    border: "none",
    backgroundColor: "#ff99ff",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },
};

const Profile: React.FC = () => {
  const [username, setUsername] = useState("");
  const [ogpUrl, setOgpUrl] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const { fetchUserData, userData, isLoading, error } = useGitHubUserData();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const ogpRef = useRef<HTMLDivElement | null>(null);

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
          scale: 2, // Higher scale for better quality
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
      <div style="width: 460px; padding: 20px; text-align: center; border: 1px solid #eaeaea; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <img src="${base64Image}" alt="GitHub Profile Card" style="width: 100%;" />
      </div>
    `);
  }, [captureCardAsImage]);

  const generateOGPImage = useCallback(async () => {
    const ogpImage = await captureCardAsImage(ogpRef, 1200, 630);
    const link = document.createElement("a");
    link.href = ogpImage;
    link.download = `${username}_ogp.png`;
    link.click();
  }, [captureCardAsImage, username]);

  const generateOgpUrl = useCallback(async () => {
    if (userData) {
      const queryParams = new URLSearchParams({
        username: userData.login,
        avatarUrl: userData.avatar_url,
        bio: userData.bio || "",
        repos: userData.public_repos.toString(),
        followers: userData.followers.toString(),
        following: userData.following.toString(),
        gists: userData.public_gists.toString(),
      });
      const response = await fetch(
        `/api/generate-ogp?${queryParams.toString()}`
      );
      if (response.ok) {
        const ogpImageUrl = response.url;
        setOgpUrl(ogpImageUrl);
      } else {
        console.error("Failed to generate OGP image");
      }
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      setTimeout(generateEmbedCode, 500); // Increase delay to ensure chart renders fully
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
          <button onClick={generateOGPImage} style={styles.ogpButton}>
            Download OGP Image
          </button>

          <button onClick={generateOgpUrl} style={styles.ogpButton}>
            Generate OGP URL
          </button>

          {ogpUrl && (
            <div style={{ marginTop: "20px" }}>
              <h3>OGP Image URL</h3>
              <a href={ogpUrl} target="_blank" rel="noopener noreferrer">
                {ogpUrl}
              </a>
            </div>
          )}

          <div
            style={{
              ...styles.card,
              position: "absolute",
              left: "-9999px",
              top: "-9999px",
            }}
            ref={ogpRef}
          >
            <img
              src={userData.avatar_url}
              alt={userData.name}
              style={{ ...styles.avatar, width: "150px" }}
            />
            <h2 style={{ ...styles.name, fontSize: "36px" }}>
              {userData.name}
            </h2>
            <p style={{ ...styles.bio, fontSize: "20px" }}>{userData.bio}</p>
            <div style={styles.radarChartContainer}>
              <Radar data={radarData} options={{ responsive: true }} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
