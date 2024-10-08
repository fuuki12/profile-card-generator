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
  loadingText: { color: "#ff66cc" },
  errorText: { color: "red" },
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
  radarChartContainer: { maxWidth: "400px", margin: "0 auto" },
  embedContainer: { marginTop: "20px", textAlign: "left" as const },
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
};
export default styles;
