/* eslint-disable */
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const xml = req.body; // whatever you send from client
  console.log(xml);
  try {
    const response = await fetch(
      "https://172.16.1.254/StarWebPRNT/SendMessage",
      {
        method: "POST",
        headers: { "Content-Type": "text/xml; charset=utf-8" },
        body: xml,
      }
    );

    const result = await response.text();
    res.status(response.status).send(result);
  } catch (err: any) {
    console.error("Print proxy error:", err);
    res.status(500).json({ error: err.message });
  }
}
