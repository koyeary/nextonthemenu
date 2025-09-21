import client from "@/lib/db/connection";

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

// Execute seed function
const main = async (): Promise<void> => {
  await seedOrders();
  await seedUsers();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export default seedOrders;
