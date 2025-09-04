import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { title, message, url } = req.body;

  if (!title || !message || !url) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  const ONE_SIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
  const ONE_SIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;

  const body = {
    app_id: ONE_SIGNAL_APP_ID,
    headings: { en: title },
    contents: { en: message },
    included_segments: ["All"], // 全ユーザーに通知
    url: url
  };

  try {
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${ONE_SIGNAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send notification", error: err });
  }
}
