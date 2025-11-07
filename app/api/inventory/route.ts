import { NextResponse } from "next/server";
import fs from "fs";
import Papa from "papaparse";
import prisma from "@/lib/db/connection";

export async function GET() {
  try {
    let categories = [];
    const csvFile = fs.readFileSync("public/square.csv", "utf8");
    const results = Papa.parse(csvFile, { header: true, skipEmptyLines: true });

    const batchSize = 100;
    let processed = 0;

    for (let i = 0; i < results.data.length; i += batchSize) {
      const batch = results.data.slice(i, i + batchSize);

      await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          categories.push(itemData.category);
          /* return prisma.item.create({
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
          }); */
          // NextResponse.json({ ok: true });
        })
      );

      processed += batch.length;

      console.log(`Processed ${processed}/${results.data.length}`);
    }
    console.log([...new Set(categories)]);
    return NextResponse.json({ success: true, categories: categories });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
