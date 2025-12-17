import { NextResponse } from "next/server";
import fs from "fs";
import Papa from "papaparse";
import prisma from "@/lib/db/connection";
import { removeToStayOrGo } from "@/lib/utils/helpers";

export async function GET() {
  try {
    const items = await prisma.item.findMany({});

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Inventory fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { location } = await req.json();

    const locationFilter = location && location !== "all" ? { location } : {};

    const inventory = await prisma.item.findMany({
      select: {
        token: true,
        baseQuantity: true,
      },
    });

    const updatedItems = await Promise.all(
      inventory.map(async (item) => {
        const count = await prisma.order.count({
          where: {
            itemToken: item.token,
            status: { not: "completed" },
          },
        });

        return prisma.item.update({
          where: { token: item.token },
          data: {
            //add location array
            activeOrders: count,
            quantity: item.baseQuantity - count,
          },
        });
      })
    );

    return NextResponse.json({
      success: true,
      data: updatedItems,
    });
  } catch (error) {
    console.error("Inventory update error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { token, quantity } = await req.json();

    const updatedItem = await prisma.item.update({
      where: { token: token },
      data: { quantity },
    });

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
/* 
export async function POST() {
  try {
    let categories = [];
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
            locations: item["Locations"] ? item["Locations"].split(",") : [],
          };
          categories.push(itemData.category);
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
          NextResponse.json({ ok: true });
        })
      );

      processed += batch.length;

      console.log(`Processed ${processed}/${results.data.length}`);
    }

    const allStations = [...new Set(categories)].map((str) =>
      removeToStayOrGo(str)
    );

    console.log(allStations);
    return NextResponse.json({
      success: true,
      categories: allStations,
      tableData: results.data,
    });
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

export async function DELETE() {
  try {
    await prisma.item.deleteMany({});
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
 */
