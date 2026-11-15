import env from '../config/env.js';

const BASE = process.env.API_BASE_URL || `http://localhost:${env.port}/api`;
const KEY = env.managementApiKey;
let pass = 0, fail = 0;

const call = async (method, path, { body, key, raw } = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  if (key) headers['x-api-key'] = key;
  const res = await fetch(BASE + path, { method, headers, body: raw ?? (body ? JSON.stringify(body) : undefined) });
  const json = await res.json().catch(() => null);
  return { status: res.status, json };
};
const check = (name, cond, extra) => {
  if (cond) { pass++; console.log('PASS', name); }
  else { fail++; console.log('FAIL', name, extra !== undefined ? JSON.stringify(extra).slice(0, 400) : ''); }
};

for (const leftover of (await call('GET', '/menu?search=Test%20Hazelnut')).json.data) {
  await call('DELETE', '/menu/' + leftover._id, { key: KEY });
}

let r = await call('GET', '/health');
check('health', r.status === 200 && r.json.message === 'Cafe API is running', r.json);

r = await call('GET', '/menu?limit=100');
check('list menu', r.status === 200 && r.json.data.length >= 15 && r.json.meta.pagination.total >= 15, r.json);
const all = r.json.data;

r = await call('GET', '/menu?search=LATTE');
check('search case-insensitive', r.json.data.length >= 2 && r.json.data.every(i => /latte/i.test(i.name)), r.json.data.map(i => i.name));

r = await call('GET', '/menu?search=' + encodeURIComponent('.*('));
check('search regex-safe', r.status === 200 && r.json.data.length === 0, r.json);

r = await call('GET', '/menu?category=pizza&sort=price_desc');
const prices = r.json.data.map(i => i.price);
check('category filter + canonical', r.json.data.every(i => i.category === 'Pizza') && r.json.data.length === 3, r.json);
check('sort price desc', prices.every((p, i) => i === 0 || prices[i - 1] >= p), prices);

r = await call('GET', '/menu?sort=price_asc&limit=100');
const asc = r.json.data.map(i => i.price);
check('sort price asc', asc.every((p, i) => i === 0 || asc[i - 1] <= p), asc);

r = await call('GET', '/menu?page=2&limit=5');
check('pagination', r.json.data.length === 5 && r.json.meta.pagination.page === 2 && r.json.meta.pagination.hasPrevPage, r.json.meta);

r = await call('GET', '/menu?featured=true');
check('featured filter', r.json.data.length > 0 && r.json.data.every(i => i.isFeatured), r.json.data.length);

r = await call('GET', '/menu?category=Sushi');
check('invalid category 400', r.status === 400 && r.json.success === false && r.json.errors[0].field === 'category', r.json);

r = await call('GET', '/menu?limit=abc');
check('invalid limit 400', r.status === 400, r.json);

r = await call('GET', '/menu/' + all[0]._id);
check('get by id', r.status === 200 && r.json.data._id === all[0]._id, r.json);

r = await call('GET', '/menu/not-an-id');
check('invalid id 400', r.status === 400 && r.json.errors[0].field === 'id', r.json);

r = await call('GET', '/menu/665f1c2ab3d4e5f6a7b8c9d0');
check('menu not found 404', r.status === 404, r.json);

const newItem = { name: 'Test Hazelnut Latte', description: 'Espresso with steamed milk and hazelnut syrup.', category: 'coffee', price: 240, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800' };
r = await call('POST', '/menu', { body: newItem });
check('create without key 401', r.status === 401, r.json);
r = await call('POST', '/menu', { body: newItem, key: 'wrong' });
check('create wrong key 401', r.status === 401, r.json);
r = await call('POST', '/menu', { body: { name: 'X' }, key: KEY });
check('create validation 400', r.status === 400 && r.json.errors.length >= 3, r.json);
r = await call('POST', '/menu', { body: { ...newItem, price: -5 }, key: KEY });
check('create negative price 400', r.status === 400 && r.json.errors.some(e => e.field === 'price'), r.json);
r = await call('POST', '/menu', { body: { ...newItem, isAvailable: 'maybe' }, key: KEY });
check('create bad boolean 400', r.status === 400, r.json);
r = await call('POST', '/menu', { body: { ...newItem, _id: '665f1c2ab3d4e5f6a7b8c9d0', hacked: true }, key: KEY });
check('create 201 + canonical category', r.status === 201 && r.json.data.category === 'Coffee' && !('hacked' in r.json.data) && r.json.data._id !== '665f1c2ab3d4e5f6a7b8c9d0', r.json);
const createdId = r.json.data?._id;
r = await call('POST', '/menu', { body: { ...newItem, name: 'test HAZELNUT latte' }, key: KEY });
check('duplicate name 409', r.status === 409, r.json);

r = await call('PUT', '/menu/' + createdId, { body: {}, key: KEY });
check('update empty 400', r.status === 400, r.json);
r = await call('PUT', '/menu/' + createdId, { body: { price: 250, isAvailable: false }, key: KEY });
check('update 200', r.status === 200 && r.json.data.price === 250 && r.json.data.isAvailable === false && r.json.data.name === newItem.name, r.json);

r = await call('POST', '/menu', { raw: '{"name": bad json', key: KEY });
check('invalid JSON 400', r.status === 400 && /invalid JSON/i.test(r.json.message), r.json);

const avail = all.filter(i => i.isAvailable);
const unavailable = all.find(i => !i.isAvailable);
const order = {
  customerName: 'Aarav Sharma', phone: '+91 98765 43210', orderType: 'dine-in', tableNumber: '5',
  specialInstructions: '  Less sugar  ',
  items: [
    { menuItem: avail[0]._id, quantity: 2, price: 1 },
    { menuItem: avail[1]._id, quantity: 1 },
    { menuItem: avail[0]._id, quantity: 1 },
  ],
};
r = await call('POST', '/orders', { body: { ...order, phone: '12345' } });
check('order bad phone 400', r.status === 400 && r.json.errors.some(e => e.field === 'phone'), r.json);
r = await call('POST', '/orders', { body: { ...order, tableNumber: undefined } });
check('dine-in needs table 400', r.status === 400 && r.json.errors.some(e => e.field === 'tableNumber'), r.json);
r = await call('POST', '/orders', { body: { ...order, items: [] } });
check('empty items 400', r.status === 400, r.json);
r = await call('POST', '/orders', { body: { ...order, items: [{ menuItem: avail[0]._id, quantity: 0 }] } });
check('zero quantity 400', r.status === 400, r.json);
r = await call('POST', '/orders', { body: { ...order, items: [{ menuItem: avail[0]._id, quantity: 1.5 }] } });
check('fractional quantity 400', r.status === 400, r.json);
r = await call('POST', '/orders', { body: { ...order, items: [{ menuItem: unavailable._id, quantity: 1 }] } });
check('unavailable item 409', r.status === 409 && /unavailable/.test(r.json.errors[0].message), r.json);
r = await call('POST', '/orders', { body: { ...order, items: [{ menuItem: '665f1c2ab3d4e5f6a7b8c9d0', quantity: 1 }] } });
check('nonexistent item 409', r.status === 409, r.json);
r = await call('POST', '/orders', { body: { ...order, customerName: { $gt: '' } } });
check('operator injection rejected', r.status === 400, r.json);

r = await call('POST', '/orders', { body: order });
const expected = avail[0].price * 3 + avail[1].price;
check('create order 201', r.status === 201 && r.json.message === 'Order placed successfully', r.json);
const placed = r.json.data;
check('server-side total', placed.totalAmount === expected && placed.subtotal === expected, { got: placed.totalAmount, expected });
check('merged lines', placed.items.length === 2 && placed.items[0].quantity === 3, placed.items);
check('order number format', /^BB-\d{6}-[A-Z0-9]{5}$/.test(placed.orderNumber), placed.orderNumber);
check('phone masked in response', placed.phone === '******3210', placed.phone);
check('table number stored', placed.tableNumber === 5 && placed.status === 'Pending' && placed.specialInstructions === 'Less sugar', placed);

r = await call('POST', '/orders', { body: { ...order, orderType: 'takeaway', tableNumber: 9, phone: '9123456789' } });
check('takeaway ignores table', r.status === 201 && r.json.data.tableNumber === null, r.json);

r = await call('GET', `/orders/track?orderNumber=${placed.orderNumber.toLowerCase()}&phone=9876543210`);
check('track ok', r.status === 200 && r.json.data.orderNumber === placed.orderNumber && !('_id' in r.json.data), r.json);
r = await call('GET', `/orders/track?orderNumber=${placed.orderNumber}&phone=9123456789`);
check('track wrong phone 404', r.status === 404, r.json);
r = await call('GET', `/orders/track?orderNumber=XYZ&phone=9876543210`);
check('track bad number 400', r.status === 400, r.json);

r = await call('GET', '/orders');
check('list orders needs key', r.status === 401, r.json);
r = await call('GET', '/orders?status=pending&limit=5', { key: KEY });
check('list orders', r.status === 200 && r.json.data.every(o => o.status === 'Pending'), r.json);
const fullOrder = r.json.data.find(o => o.orderNumber === placed.orderNumber);
r = await call('GET', '/orders/' + fullOrder._id);
check('get order needs key', r.status === 401, r.json);
r = await call('GET', '/orders/' + fullOrder._id, { key: KEY });
check('get order by id', r.status === 200 && r.json.data.phone === '9876543210', r.json);

r = await call('PATCH', `/orders/${fullOrder._id}/status`, { body: { status: 'Baking' }, key: KEY });
check('bad status 400', r.status === 400, r.json);
r = await call('PATCH', `/orders/${fullOrder._id}/status`, { body: { status: 'preparing' } });
check('status needs key', r.status === 401, r.json);
r = await call('PATCH', `/orders/${fullOrder._id}/status`, { body: { status: 'preparing' }, key: KEY });
check('status update', r.status === 200 && r.json.data.status === 'Preparing', r.json);
r = await call('PATCH', `/orders/${fullOrder._id}/status`, { body: { status: 'Completed' }, key: KEY });
r = await call('PATCH', `/orders/${fullOrder._id}/status`, { body: { status: 'Pending' }, key: KEY });
check('final status locked 409', r.status === 409, r.json);

r = await call('DELETE', '/menu/' + createdId);
check('delete needs key', r.status === 401, r.json);
r = await call('DELETE', '/menu/' + createdId, { key: KEY });
check('delete 200', r.status === 200, r.json);
r = await call('DELETE', '/menu/' + createdId, { key: KEY });
check('delete again 404', r.status === 404, r.json);

r = await call('GET', '/nope');
check('unknown route 404', r.status === 404 && r.json.success === false, r.json);

console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
