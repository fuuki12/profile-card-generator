import { createCanvas, loadImage } from "canvas";
// import { Chart, ChartConfiguration } from "chart.js";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, avatarUrl, bio, repos, followers, following, gists } =
    req.query;

  if (
    !username ||
    !avatarUrl ||
    !bio ||
    !repos ||
    !followers ||
    !following ||
    !gists
  ) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  // クエリパラメータを数値に変換
  const repoCount = Number(repos);
  const followerCount = Number(followers);
  const followingCount = Number(following);
  const gistsCount = Number(gists);

  // キャンバスの作成
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // 背景色を設定
  ctx.fillStyle = "#ffe6f2"; // パステルピンク
  ctx.fillRect(0, 0, width, height);

  // アバター画像の描画
  const avatar = await loadImage(avatarUrl as string);
  ctx.drawImage(avatar, 50, 215, 200, 200);

  // ユーザー名の描画
  ctx.font = "bold 48px Arial";
  ctx.fillStyle = "#ff66cc";
  ctx.fillText(username as string, 280, 290);

  // BIOの描画
  ctx.font = "italic 32px Arial";
  ctx.fillStyle = "#666";
  ctx.fillText(bio as string, 280, 350, 800); // 最大幅800px

  // // レーダーチャートの設定
  // const radarCanvas = createCanvas(400, 400);
  // const radarCtx = radarCanvas.getContext("2d");

  // const chartConfig: ChartConfiguration = {
  //   type: "radar",
  //   data: {
  //     labels: ["Repos", "Followers", "Following", "Gists"],
  //     datasets: [
  //       {
  //         label: "GitHub Stats",
  //         data: [repoCount, followerCount, followingCount, gistsCount],
  //         backgroundColor: "rgba(255, 99, 132, 0.2)",
  //         borderColor: "rgba(255, 99, 132, 1)",
  //         borderWidth: 2,
  //       },
  //     ],
  //   },
  //   options: {
  //     responsive: false,
  //     scales: {
  //       r: {
  //         angleLines: {
  //           display: false,
  //         },
  //         suggestedMin: 0,
  //         suggestedMax:
  //           Math.max(repoCount, followerCount, followingCount, gistsCount) *
  //           1.2,
  //       },
  //     },
  //     plugins: {
  //       legend: {
  //         display: false,
  //       },
  //     },
  //   },
  // };

  // // レーダーチャートを描画
  // new Chart(radarCanvas as any, chartConfig);

  // // レーダーチャートをOGP画像に描画
  // const chartImage = await loadImage(radarCanvas.toDataURL());
  // ctx.drawImage(chartImage, 780, 115, 400, 400);

  // OGP画像をPNG形式で出力
  const imageBuffer = canvas.toBuffer("image/png");
  res.setHeader("Content-Type", "image/png");
  res.status(200).send(imageBuffer);
}
