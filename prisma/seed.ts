import client from "@/lib/db/connection";
import { SquareClient, SquareEnvironment } from "square";
import { PrismaClient, Prisma } from "@prisma/client";

//SEED USERS
const users = [
  { name: "Kat Yeary", pin: "8085", role: "admin" },
  { name: "Agapios", pin: "1234", role: "admin" },
  { name: "Stavros", pin: "5678", role: "admin" },
  { name: "FOH", pin: "9101", role: "kitchen" },
];

const seedUsers = async () => {
  // Clear existing data
  await client.user.deleteMany();
  console.log("🗑️ Cleared existing users");

  try {
    await client.user.createMany({ data: users });

    console.log(`✅ Successfully seeded ${users.length} users`);
  } catch (error) {
    console.error("❌ Error seeding orders:", error);
    throw error;
  } finally {
    await client.$disconnect();
  }
};

//SEED ORDERS
const statuses = ["pending", "ready", "complete"] as const;
const sizes = ['7"', '8"', '10"', "QS", "HS", "FS"] as const;
const cakeTypes = [
  "Tres Leches",
  "Strawberry Shortcake",
  "Brooklyn Blackout",
  "Red Velvet",
  "Lemon Blueberry",
  "Vintage Heart Cake",
  "Vintage White Cake",
  "Chocolate Mousse Cake",
  "Fruit Napolean Cake",
  "Rainbow Cake",
  "Chocolate Fudge Cake",
  "Tiramisu",
  "Oreo Cake",
  "Salted Caramel Cake",
  "Carrot Cake",
  "Chocolate Layer Cake",
  "7 Layer Cake",
  "Peach Raspberry Cake",
  "Burnt Almond Cake",
  "Nutella Cake",
  "Black Forest Cake",
  "Coconut Cake",
  "Vanilla Bean Cake",
  "German Chocolate Cake",
  "Girl Gender Reveal",
  "Boy Gender Reveal",
  "Pink & Blue Rosette",
  "Girl or Boy",
] as const;

const firstNames = [
  "Alice",
  "Bob",
  "Catherine",
  "Daniel",
  "Ella",
  "Frank",
  "Grace",
  "Henry",
  "Isabella",
  "Jack",
] as const;

const lastNames = [
  "Johnson",
  "Smith",
  "Lee",
  "Perez",
  "Brown",
  "White",
  "Kim",
  "Lopez",
  "Green",
  "Wilson",
] as const;

const randomContact = (first: string, last: string): string => {
  if (Math.random() > 0.5) {
    return `${first.toLowerCase()}.${last.toLowerCase()}@example.com`;
  }
  return `(${Math.floor(Math.random() * 900 + 100)})-${Math.floor(
    Math.random() * 900 + 100
  )}-${Math.floor(Math.random() * 9000 + 1000)}`;
};

const randomPrice = (): number => {
  return Math.floor(Math.random() * 8000 + 100) / 100;
};

const getRandomElement = <T>(array: readonly T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedOrders = async (): Promise<void> => {
  try {
    console.log("🌱 Starting seed process...");

    // Clear existing data
    await client.order.deleteMany();
    console.log("🗑️  Cleared existing orders");

    // Generate seed data
    const orders = [];

    for (let i = 0; i < 50; i++) {
      const orderId = `order_${Math.random().toString(36).substring(2, 10)}`;
      const first = getRandomElement(firstNames);
      const last = getRandomElement(lastNames);
      const customerName = `${first} ${last}`;
      const items = getRandomElement(cakeTypes);
      const size = getRandomElement(sizes);
      const status = getRandomElement(statuses);
      const quantity = Math.floor(Math.random() * 5) + 1;
      const price = randomPrice();

      const notesOptions: (string | null)[] = [
        null,
        "Extra frosting",
        "No nuts",
        "Gluten-free",
        "Birthday message",
      ];
      const notes = getRandomElement(notesOptions);
      const contact = randomContact(first, last);
      const due = new Date(
        Date.now() + Math.floor(Math.random() * 7 + 1) * 24 * 60 * 60 * 1000
      );

      orders.push({
        orderId,
        due,
        status,
        items,
        size,
        notes,
        quantity,
        price,
        customerName,
        contact,
      });
    }

    // Insert all orders
    await client.order.createMany({
      data: orders,
    });

    await seedUsers();

    console.log(`✅ Successfully seeded ${orders.length} orders`);
  } catch (error) {
    console.error("❌ Error seeding orders:", error);
    throw error;
  } finally {
    await client.$disconnect();
  }
};
interface SquareItemResponse {
  type: string;
  id: string;
  updated_at: string;
  created_at: string;
  version: number;
  is_deleted: boolean;
  present_at_all_locations: boolean;
  present_at_location_ids?: string[];
  item_data: {
    name: string;
    description?: string;
    is_taxable: boolean;
    tax_ids?: string[];
    variations: Array<{
      type: string;
      id: string;
      updated_at: string;
      created_at: string;
      version: number;
      is_deleted: boolean;
      present_at_all_locations: boolean;
      present_at_location_ids?: string[];
      item_variation_data: {
        item_id: string;
        name: string;
        sku?: string;
        ordinal: number;
        pricing_type: string;
        price_money?: {
          amount: number;
          currency: string;
        };
        inventory_alert_type?: string;
        sellable: boolean;
        stockable: boolean;
        track_inventory?: boolean;
        measurement_unit_id?: string;
        channels?: string[];
        image_ids?: string[];
        item_option_values?: Array<{
          item_option_id: string;
          item_option_value_id: string;
        }>;
      };
    }>;
    product_type: string;
    skip_modifier_screen: boolean;
    ecom_available: boolean;
    ecom_visibility: string;
    description_html?: string;
    description_plaintext?: string;
    is_archived: boolean;
    image_ids?: string[];
    ecom_image_uris?: string[];
    channels?: string[];
    categories?: Array<{
      id: string;
      ordinal: number;
    }>;
    reporting_category?: {
      id: string;
      ordinal: number;
    };
    modifier_list_info?: Array<{
      modifier_list_id: string;
      min_selected_modifiers?: number;
      max_selected_modifiers?: number;
      enabled: boolean;
      hidden_from_customer: boolean;
      ordinal: number;
      allow_quantities?: string;
      is_conversational?: string;
    }>;
    item_options?: Array<{
      item_option_id: string;
    }>;
    is_alcoholic: boolean;
  };
}

interface SquareCatalogResponse {
  items: SquareItemResponse[];
}

export async function importSquareItemsSimple(squareResponse: unknown) {
  const itemsToCreate: Prisma.ItemCreateManyInput[] = [];

  for (const squareItems of squareResponse.items) {
    for (const item of squareItems) {
      console.log(item.itemData.variations);
      itemsToCreate.push({
        id: item.id,
        name: item.itemData.name,
        price: 0,
        quantity: 0,
      });
    }
    // Process each variation as a separate item
    /*     for (const variation of itemData.variations) {
      const varData = variation.item_variation_data;

      // Combine item name with variation name if it exists
      const fullName = varData.name
        ? `${itemData.name} - ${varData.name}`
        : itemData.name;

      // Convert Square price (cents) to decimal dollars
      const price = varData.price_money
        ? new Prisma.Decimal(varData.price_money.amount / 100)
        : new Prisma.Decimal(0);

      itemsToCreate.push({
        id: parseInt(variation.id.replace(/\D/g, "").slice(0, 9)) || 0,
        name: fullName,
        price: price,
        quantity: 0, // Default quantity, update as needed
      });
    } */
  }

  try {
    // Use createMany for efficient bulk insert
    const result = await client.item.createMany({
      data: itemsToCreate,
      skipDuplicates: true, // Skip items that already exist
    });

    console.log(`Successfully imported ${result.count} items`);
    return result;
  } catch (error) {
    console.error("Error importing items:", error);
    throw error;
  }
}

// Alternative: Upsert items one by one (slower but handles updates)
export async function upsertSquareItems(squareResponse: SquareCatalogResponse) {
  let imported = 0;
  let updated = 0;

  for (const squareItem of squareResponse.items) {
    console.log(squareItem);
    const itemData = squareItem.item_data;

    for (const variation of itemData.variations) {
      const varData = variation.item_variation_data;

      const fullName = varData.name
        ? `${itemData.name} - ${varData.name}`
        : itemData.name;

      const price = varData.price_money
        ? new Prisma.Decimal(varData.price_money.amount / 100)
        : new Prisma.Decimal(0);

      const itemId = parseInt(variation.id.replace(/\D/g, "").slice(0, 9)) || 0;

      try {
        const result = await client.item.upsert({
          where: { id: itemId },
          update: {
            name: fullName,
            price: price,
          },
          create: {
            id: itemId,
            name: fullName,
            price: price,
            quantity: 0,
          },
        });

        if (result) {
          updated++;
        }
      } catch (error) {
        console.error(`Failed to import item ${itemId}:`, error);
      }
    }
  }

  console.log(`Imported/Updated ${updated} items`);
  return { count: updated };
}
// Execute seed function
const main = async (): Promise<void> => {
  const squareClient = new SquareClient({
    environment: SquareEnvironment.Production,
    token: "EAAAl3lrZICR1xCW2cGj40QfmNj3fNeZkEvoxLs9fV2R0oI3gBqgEu1pBwrRjo1V",
  });
  const squareData = await squareClient.catalog.searchItems({});
  const items = squareData.map((item) => item.itemData.variations);
  console.log(items);
  //await importSquareItemsSimple(squareData.items);
  //await seedOrders();
  //await seedUsers();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export default seedOrders;
