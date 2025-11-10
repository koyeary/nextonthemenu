import Square from "square";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/connection";

export async function PATCH(req: NextRequest) {
  const { Client, Environment } = Square;

  const client = new Client({
    accessToken: process.env.PROD_SQ_ACCESS_TOKEN,
    environment:
      process.env.NODE_ENV === "production" ? "production" : "sandbox",
  });

  try {
    const body = await req.json();
    const {
      itemId, // Square catalog item ID
      name, // Item name
      description, // Item description
      price, // Price in cents (e.g., 1099 for $10.99)
      sku, // SKU
      available, // Boolean for availability
      variationId, // Variation ID if updating specific variation
    } = body;

    // Validate required fields
    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    // First, retrieve the current item to get its version
    const { result: retrieveResult } =
      await client.catalogApi.retrieveCatalogObject(itemId, true);

    if (!retrieveResult.object) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const currentItem = retrieveResult.object;
    const currentVersion = currentItem.version;

    // Build the update object
    const itemData: any = {
      type: "ITEM",
      id: itemId,
      version: currentVersion,
      itemData: {
        name: name || currentItem.itemData?.name,
        description:
          description !== undefined
            ? description
            : currentItem.itemData?.description,
        variations: currentItem.itemData?.variations,
      },
    };

    // Update variation if price, sku, or availability changed
    if (variationId && currentItem.itemData?.variations) {
      const variationIndex = currentItem.itemData.variations.findIndex(
        (v: any) => v.id === variationId
      );

      if (variationIndex !== -1) {
        const currentVariation =
          currentItem.itemData.variations[variationIndex];

        itemData.itemData.variations[variationIndex] = {
          ...currentVariation,
          type: "ITEM_VARIATION",
          id: variationId,
          itemVariationData: {
            ...currentVariation.itemVariationData,
            name: name || currentVariation.itemVariationData?.name,
            sku:
              sku !== undefined ? sku : currentVariation.itemVariationData?.sku,
            priceMoney:
              price !== undefined
                ? {
                    amount: BigInt(price),
                    currency: "USD",
                  }
                : currentVariation.itemVariationData?.priceMoney,
            availableForBooking:
              available !== undefined
                ? available
                : currentVariation.itemVariationData?.availableForBooking,
          },
        };
      }
    }

    // Update the item in Square
    const { result: updateResult } =
      await client.catalogApi.upsertCatalogObject({
        idempotencyKey: `${itemId}-${Date.now()}`,
        object: itemData,
      });

    return NextResponse.json({
      success: true,
      message: "Item updated successfully in Square",
      item: updateResult.catalogObject,
      idMappings: updateResult.idMappings,
    });
  } catch (error: any) {
    console.error("Error updating Square item:", error);

    // Handle Square API errors
    if (error.result) {
      return NextResponse.json(
        {
          error: "Square API error",
          details: error.result.errors || error.message,
        },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to update item in Square",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items } = body; // Array of items to update

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items array is required" },
        { status: 400 }
      );
    }

    const batches: any[] = [];

    for (const item of items) {
      const { itemId, name, description, price, variationId } = item;

      // Retrieve current version
      const { result } = await client.catalogApi.retrieveCatalogObject(
        itemId,
        true
      );

      if (result.object) {
        batches.push({
          type: "ITEM",
          id: itemId,
          version: result.object.version,
          itemData: {
            name: name || result.object.itemData?.name,
            description:
              description !== undefined
                ? description
                : result.object.itemData?.description,
            variations: result.object.itemData?.variations,
          },
        });
      }
    }

    // Batch upsert
    const { result: batchResult } =
      await client.catalogApi.batchUpsertCatalogObjects({
        idempotencyKey: `batch-${Date.now()}`,
        batches: [
          {
            objects: batches,
          },
        ],
      });

    return NextResponse.json({
      success: true,
      message: `${batches.length} items updated successfully`,
      objects: batchResult.objects,
      idMappings: batchResult.idMappings,
    });
  } catch (error: any) {
    console.error("Error batch updating Square items:", error);

    return NextResponse.json(
      {
        error: "Failed to batch update items",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
