import fs from "fs";
import Papa from "papaparse";
import prisma from "@/lib/db/connection";

export async function POST() {
  try {
    const csvFile = fs.readFileSync("public/square.csv", "utf8");
    const results = Papa.parse(csvFile, { header: true, skipEmptyLines: true });

    const batchSize = 100;
    let processed = 0;

    for (let i = 0; i < results.data.length; i += batchSize) {
      const batch = results.data.slice(i, i + batchSize);

      await Promise.all(
        batch.map((item: any) => {
          // Only map the fields you want
          const itemData = {
            token: item["Token"] || "",
            itemName: item["Item Name"] || "",
            variationName: item["Variation Name"] || "",
            unitPrecision: item["Unit and Precision"] || "",
            sku: item["SKU"] || "",
            category: item["Reporting Category"] || "",
            reference: item["Reference Handle"] || "",
            quantity: parseInt(item["Quantity"]) || 0,
          };

          return prisma.item.create({
            data: {
              token: itemData.token,
              itemName: itemData.itemName,
              category: itemData.category,
              variationName: itemData.variationName,
              unitPrecision: itemData.unitPrecision,
              sku: itemData.sku,
              reference: itemData.reference,
              quantity: itemData.quantity,
            },
          });
        })
      );

      processed += batch.length;
      console.log(`Processed ${processed}/${results.data.length}`);
    }

    return Response.json({ success: true, count: results.data.length });
  } catch (error) {
    console.error("Import error:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
