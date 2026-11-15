import env, { assertRequiredEnv } from '../config/env.js';
import { connectDB, disconnectDB } from '../config/db.js';
import Menu from '../models/Menu.js';

const image = (photoId) => `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=800&q=75`;

const menuItems = [
  {
    name: 'Classic Cappuccino',
    description: 'Double espresso topped with velvety steamed milk and a thick crown of microfoam.',
    category: 'Coffee',
    price: 180,
    image: image('1572442388796-11668a67e53d'),
    isFeatured: true,
  },
  {
    name: 'Café Latte',
    description: 'Smooth espresso with silky steamed milk, finished with hand-poured latte art.',
    category: 'Coffee',
    price: 190,
    image: image('1541167760496-1628856ab772'),
  },
  {
    name: 'Flat White',
    description: 'A ristretto-based Australian classic with a thin, glossy layer of microfoam.',
    category: 'Coffee',
    price: 200,
    image: image('1485808191679-5f86510681a2'),
  },
  {
    name: 'Caramel Macchiato',
    description: 'Vanilla-kissed milk marked with espresso and finished with buttery caramel drizzle.',
    category: 'Coffee',
    price: 240,
    image: image('1534778101976-62847782c213'),
    isFeatured: true,
  },
  {
    name: 'Americano',
    description: 'Freshly pulled espresso lengthened with hot water for a clean, bold cup.',
    category: 'Coffee',
    price: 150,
    image: image('1514432324607-a09d9b4aefdd'),
  },
  {
    name: 'Masala Chai',
    description: 'Assam tea simmered with milk, ginger, cardamom and our house spice blend.',
    category: 'Tea',
    price: 120,
    image: image('1544787219-7f47ccb76574'),
    isFeatured: true,
  },
  {
    name: 'Darjeeling First Flush',
    description: 'Delicate, floral single-estate Darjeeling served by the pot. Best enjoyed without milk.',
    category: 'Tea',
    price: 160,
    image: image('1564890369478-c89ca6d9cde9'),
  },
  {
    name: 'Chamomile Honey Tea',
    description: 'Calming chamomile flowers steeped with a touch of wild forest honey.',
    category: 'Tea',
    price: 150,
    image: image('1597318181409-cf64d0b5d8a2'),
  },
  {
    name: 'Iced Caramel Latte',
    description: 'Espresso poured over chilled milk and ice with house-made caramel syrup.',
    category: 'Cold Drinks',
    price: 230,
    image: image('1461023058943-07fcbe16d735'),
    isFeatured: true,
  },
  {
    name: 'Classic Cold Coffee',
    description: 'Thick, creamy blended cold coffee with a hint of chocolate, the way Indians love it.',
    category: 'Cold Drinks',
    price: 190,
    image: image('1517701604599-bb29b565090c'),
  },
  {
    name: 'Virgin Mojito',
    description: 'Fresh mint, lime and soda muddled over crushed ice. Bright and refreshing.',
    category: 'Cold Drinks',
    price: 170,
    image: image('1513558161293-cdaf765ed2fd'),
  },
  {
    name: 'Lemon Iced Tea',
    description: 'Slow-brewed black tea shaken with fresh lemon and a hint of mint.',
    category: 'Cold Drinks',
    price: 150,
    image: image('1556679343-c7306c1976bc'),
  },
  {
    name: 'Mixed Berry Smoothie',
    description: 'Strawberries, blueberries and banana blended with yoghurt and a drizzle of honey.',
    category: 'Cold Drinks',
    price: 220,
    image: image('1622597467836-f3285f2131b8'),
    isAvailable: false,
  },
  {
    name: 'Margherita Pizza',
    description: 'San Marzano tomato sauce, fresh mozzarella and basil on a hand-stretched sourdough base.',
    category: 'Pizza',
    price: 349,
    image: image('1574071318508-1cdbab80d002'),
    isFeatured: true,
  },
  {
    name: 'Farmhouse Veggie Pizza',
    description: 'Bell peppers, mushrooms, sweet corn, olives and red onion with a three-cheese blend.',
    category: 'Pizza',
    price: 399,
    image: image('1565299624946-b28f40a0ae38'),
  },
  {
    name: 'Tandoori Paneer Pizza',
    description: 'Tandoor-spiced paneer, onions and capsicum with a smoky mint-mayo swirl.',
    category: 'Pizza',
    price: 429,
    image: image('1594007654729-407eedc4be65'),
  },
  {
    name: 'Classic Veg Burger',
    description: 'Crispy vegetable patty, lettuce, tomato, cheddar and our signature burger sauce.',
    category: 'Burgers',
    price: 199,
    image: image('1571091718767-18b5b1457add'),
  },
  {
    name: 'Double Cheese Smash Burger',
    description: 'Two smashed chicken patties, double cheddar, caramelised onions and pickles.',
    category: 'Burgers',
    price: 329,
    image: image('1568901346375-23c9450c58cd'),
    isFeatured: true,
  },
  {
    name: 'Crispy Chicken Burger',
    description: 'Buttermilk fried chicken, creamy slaw and chipotle mayo in a toasted brioche bun.',
    category: 'Burgers',
    price: 279,
    image: image('1606755962773-d324e0a13086'),
  },
  {
    name: 'Club Sandwich',
    description: 'Triple-decker with grilled chicken, egg, lettuce, tomato and cheese on toasted bread.',
    category: 'Sandwiches',
    price: 259,
    image: image('1553909489-cd47e0907980'),
    isFeatured: true,
  },
  {
    name: 'Grilled Cheese Sandwich',
    description: 'Golden, buttery sourdough loaded with melted cheddar and mozzarella.',
    category: 'Sandwiches',
    price: 179,
    image: image('1528735602780-2552fd46c7af'),
  },
  {
    name: 'Pesto Paneer Panini',
    description: 'Basil pesto, grilled paneer, sun-dried tomatoes and rocket pressed in ciabatta.',
    category: 'Sandwiches',
    price: 229,
    image: image('1481070414801-51fd732d7184'),
  },
  {
    name: 'Classic Tiramisu',
    description: 'Espresso-soaked ladyfingers layered with mascarpone cream and dusted with cocoa.',
    category: 'Desserts',
    price: 260,
    image: image('1571877227200-a0d98ea607e9'),
    isFeatured: true,
  },
  {
    name: 'Belgian Chocolate Cake',
    description: 'Rich, moist chocolate sponge layered with Belgian chocolate ganache.',
    category: 'Desserts',
    price: 220,
    image: image('1578985545062-69928b1d9587'),
  },
  {
    name: 'Fudge Brownie',
    description: 'Dense, gooey dark chocolate brownie. Ask for a scoop of vanilla ice cream on top.',
    category: 'Desserts',
    price: 160,
    image: image('1606313564200-e75d5e30476c'),
  },
  {
    name: 'Blueberry Cheesecake',
    description: 'Creamy baked New York cheesecake on a buttery biscuit base, topped with blueberry compote.',
    category: 'Desserts',
    price: 280,
    image: image('1533134242443-d4fd215305ad'),
  },
];

const seedMenu = async () => {
  assertRequiredEnv();
  await connectDB({ retry: false });
  await Menu.syncIndexes();

  const operations = menuItems.map((item) => ({
    updateOne: {
      filter: { name: item.name },
      update: { $set: { isAvailable: true, isFeatured: false, ...item } },
      upsert: true,
      collation: { locale: 'en', strength: 2 },
    },
  }));

  const result = await Menu.bulkWrite(operations);
  const total = await Menu.countDocuments();

  console.log(`Seed complete (${env.nodeEnv}):`);
  console.log(`  new items inserted:          ${result.upsertedCount}`);
  console.log(`  existing items refreshed:    ${result.matchedCount}`);
  console.log(`  total menu items in database: ${total}`);
};

seedMenu()
  .catch((error) => {
    console.error('Seeding failed:', error.name);
    process.exitCode = 1;
  })
  .finally(() => disconnectDB());
