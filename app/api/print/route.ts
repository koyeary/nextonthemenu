/* eslint-disable */
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { xml, token } = req.body;
  console.log(xml);

  const mainPrinter = ["KOWX5QT4MUBOYYGT5DDI7JWP", "NIFZSC3PBYZGNBWZ2NTZ67A2"];
  const secondaryPrinter = ["IZYXYXKPI2N36CR5LTONFTN7"];
  const ip = mainPrinter.find((id) => id === token)
    ? "172.16.1.254"
    : "localhost:8001";

  try {
    const response = await fetch(`https://${ip}/StarWebPRNT/SendMessage`, {
      method: "POST",
      headers: { "Content-Type": "text/xml; charset=utf-8" },
      body: xml,
    });

    const result = await response.text();
    res.status(response.status).send(result);
  } catch (err: any) {
    console.error("Print proxy error:", err);
    res.status(500).json({ error: err.message });
  }
}
