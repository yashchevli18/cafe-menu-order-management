# Brew & Bean – Manual Test Cases

Use this checklist to verify every flow of the application, end to end. Fill in the **Result** column with ✅ / ❌ and a short note when something fails.

---

## 0. Test setup

| Item | Value |
| --- | --- |
| Backend | `cd backend && npm run dev`, which must log `MongoDB connected: …/brew_and_bean` |
| Frontend | `cd frontend && npm run dev`, which prints a `Local:` URL and one or more `Network:` URLs |
| Seed data | `cd backend && npm run seed` gives 26 items, including 1 unavailable (Mixed Berry Smoothie) |
| Desktop URL | http://localhost:5173 |
| Phone URL | `http://<your-PC-Wi-Fi-IP>:5173` (the **Wi-Fi** "Network" URL printed by Vite, e.g. `http://10.190.105.1:5173`) |
| Swagger | http://localhost:5000/api/docs, then click **Authorize** and paste `MANAGEMENT_API_KEY` from `backend/.env` |
| Test phone numbers | Valid: `9876543210`, `+91 98765 43210`. Invalid: `12345`, `5123456789` |

**Phone testing rules:**
- The phone must be on the **same Wi-Fi** as the PC (mobile data won't work).
- Print or display the QR codes from `/table-qr`. The URL field there must show the Wi-Fi address, **not** `localhost`.
- If the phone can't open the page, allow Node.js through Windows Firewall (see the README, section *Testing on a phone*).

---

## 1. Backend health & API documentation

| ID | Test case | Steps | Expected result | Result |
| --- | --- | --- | --- | --- |
| API-01 | Health check | Open http://localhost:5000/api/health | `{"success":true,"message":"Cafe API is running", … "database":"connected"}` | |
| API-02 | Swagger loads | Open http://localhost:5000/api/docs | Menu, Orders and Health sections list all 11 operations | |
| API-03 | Database name | Check the backend console on start-up | Shows `…mongodb.net/brew_and_bean` (not `/test`) | |
| API-04 | Unknown route | GET http://localhost:5000/api/unknown | 404 `{"success":false,"message":"Route not found…"}` | |
| API-05 | Atlas down / wrong URI | Put a wrong password in `MONGODB_URI` and restart | Server logs "Failed to start server" and exits; it doesn't run half-broken | |

## 2. Home page

| ID | Test case | Steps | Expected result | Result |
| --- | --- | --- | --- | --- |
| HOME-01 | Page renders | Open `/` | Navbar, hero, 8 featured items, 7 category tiles, About, "How it works" and footer are all visible | |
| HOME-02 | Featured items come from the DB | In Swagger, set `isFeatured=false` on one featured item, then refresh | That item disappears from the Featured section | |
| HOME-03 | Explore Menu | Click **Explore Menu** | Navigates to `/menu` | |
| HOME-04 | Category tile | Click **Pizza** tile | `/menu?category=Pizza` shows only pizzas, and the Pizza chip is active | |
| HOME-05 | Footer links | Click each footer link | Home, Menu, Track Order and Table QR Codes open correctly; social links open in a new tab | |
| HOME-06 | Mobile navbar | On a phone, tap ☰ | Menu opens with Home, Menu and Track Order, and closes after navigation | |

## 3. Menu: browse, search, filter, sort

| ID | Test case | Steps | Expected result | Result |
| --- | --- | --- | --- | --- |
| MENU-01 | Menu loads from API | Open `/menu` | Skeleton cards appear briefly, then 12 cards and "Showing 12 of 26 items" | |
| MENU-02 | Card content | Inspect any card | Image, name, description, category badge, ₹ price, availability badge and Add to Cart button are all present | |
| MENU-03 | Search (case-insensitive) | Type `LATTE` | Only latte items (Café Latte, Iced Caramel Latte) appear, and the URL contains `q=LATTE` | |
| MENU-04 | Search partial | Type `piz` | Only the 3 pizzas appear | |
| MENU-05 | No results | Type `zzzz` | "No matching items" state with a **Clear filters** button | |
| MENU-06 | Clear filters | Click **Clear filters** | Search box is emptied and all items return | |
| MENU-07 | Category filter | Click **Desserts** | Exactly 4 dessert cards appear | |
| MENU-08 | Category "All" | Click **All** | All items return (26 total, paginated) | |
| MENU-09 | Sort low → high | Select *Price: Low to High* | Prices are in ascending order | |
| MENU-10 | Sort high → low | Select *Price: High to Low* | Prices are in descending order | |
| MENU-11 | Combined | Category **Coffee**, sort *High to Low*, search `a` | Only coffee items containing "a", sorted by price descending | |
| MENU-12 | Pagination | On **All**, click **Next** | Page 2 of 3 with different items; **Previous** goes back | |
| MENU-13 | Filters survive refresh | Apply a category and sort, then press F5 | Same filters and results after reload | |
| MENU-14 | Unavailable item | Filter **Cold Drinks** | Mixed Berry Smoothie shows "Sold out", a greyed image and a disabled **Unavailable** button | |
| MENU-15 | Error state | Stop the backend, then refresh `/menu` | "We couldn't load the menu" with a **Try again** button. Start the backend and click **Try again**: the menu loads | |
| MENU-16 | Image fallback | In Swagger, set an item's `image` to `https://example.com/broken.jpg` | The card shows the beige coffee-cup placeholder instead of a broken image | |

## 4. Shopping cart

| ID | Test case | Steps | Expected result | Result |
| --- | --- | --- | --- | --- |
| CART-01 | Add item | Click **Add to Cart** on Cappuccino | Toast "…added to your order", navbar count 1, and the button turns into a − 1 + stepper | |
| CART-02 | Increase from card | Click **+** on the card | Count becomes 2 | |
| CART-03 | Decrease to remove | Click the trash/− icon at quantity 1 on the card | Item is removed from the cart | |
| CART-04 | Open drawer | Click **Cart** in the navbar | Drawer slides in with items, line totals, subtotal and total | |
| CART-05 | Quantity in drawer | Use + / − in the drawer | Line total and total update instantly; − is disabled at 1 | |
| CART-06 | Remove in drawer | Click × on an item | Item removed and totals recalculated | |
| CART-07 | Totals correct | Add Cappuccino ×2 (₹180) and Margherita ×1 (₹349) | Subtotal = Total = **₹709** | |
| CART-08 | Max quantity | Press + until 20 | + is disabled at 20; adding more shows "You can add up to 20…" | |
| CART-09 | Clear cart | Click **Clear cart**, then **Keep items** | Nothing removed. Repeat and click **Clear cart**: the cart is empty | |
| CART-10 | Persistence | Add items and refresh the browser | Cart items and count are still there | |
| CART-11 | Multi-tab sync | Open the site in two tabs and add an item in tab 1 | Tab 2's cart count updates | |
| CART-12 | Empty cart state | Open the drawer with no items | "Your cart is empty" with **Browse the menu** | |
| CART-13 | Close drawer | Press **Esc**, click outside, or click × | The drawer closes each time | |
| CART-14 | Mobile cart bar | On a phone, add an item on `/menu` | Floating "1 item · ₹… · View cart" bar appears at the bottom | |

## 5. QR code table ordering

| ID | Test case | Steps | Expected result | Result |
| --- | --- | --- | --- | --- |
| QR-01 | Generate codes | Open `/table-qr` on the PC | 8 QR cards (Tables 1–8); the URL field shows the **Wi-Fi IP**, not localhost | |
| QR-02 | Range | Set From 3, To 10 | 8 codes for tables 3–10 | |
| QR-03 | Range validation | Set From 10, To 2, or To 150 | Red validation message; Print button disabled | |
| QR-04 | Localhost warning | Change the URL to `http://localhost:5173` | Yellow warning "Phones can't open localhost" | |
| QR-05 | Download | Click **Download PNG** on Table 5 | `brew-and-bean-table-5.png` downloads | |
| QR-06 | **Scan with phone** | Scan the Table 5 QR with the phone camera | Browser opens `/menu?table=5`, the menu loads, and a toast says "You're ordering for Table 5" | |
| QR-07 | Table shown | After QR-06 | "Table 5" badge in the menu header (and navbar on larger screens) and in the cart drawer | |
| QR-08 | Table at checkout | Add items, then go to checkout | **Dine-in** preselected, Table number = 5, hint "Detected from the QR code" | |
| QR-09 | Table persists | Refresh any page in the same tab | Table 5 is still remembered | |
| QR-10 | Invalid table | Open `/menu?table=abc` or `/menu?table=999` | Error toast "Invalid table number…"; no table set | |
| QR-11 | Different table | Scan Table 2 after Table 5 | Table switches to 2 | |
| QR-12 | No QR (takeaway) | Open `/menu` in a new private window | No table badge; checkout defaults to **Takeaway** | |

## 6. Checkout & placing an order

| ID | Test case | Steps | Expected result | Result |
| --- | --- | --- | --- | --- |
| CHK-01 | Empty cart | Clear the cart and open `/checkout` | "Your cart is empty" with **Browse the menu**; no form | |
| CHK-02 | Required fields | Click **Place Order** with an empty form | "Please enter your name" and "Please enter your mobile number" | |
| CHK-03 | Name validation | Enter `A`, then `John123` | Errors: min 2 characters / letters only | |
| CHK-04 | Phone validation | Enter `12345`, then `5123456789` | "Enter a valid 10-digit Indian mobile number" | |
| CHK-05 | Phone formats accepted | Try `9876543210`, `+91 98765 43210`, `09876543210` | All accepted | |
| CHK-06 | Dine-in requires table | Select **Dine-in** and clear the table number | "Table number is required for dine-in orders" | |
| CHK-07 | Table range | Enter `0` or `101` | Range error (1–100) | |
| CHK-08 | Takeaway | Select **Takeaway** | Table field disappears; order can be placed without a table | |
| CHK-09 | Instructions limit | Type in Special instructions | Counter shows x/300; input stops at 300 | |
| CHK-10 | Order summary | View the right panel (or bottom on a phone) | Each item's image, name, price × qty, line total, subtotal and total | |
| CHK-11 | **Place order** | Fill valid data and click **Place Order** | Button shows "Placing your order…", toast "Order placed successfully!", redirect to confirmation | |
| CHK-12 | Cart cleared | After CHK-11 | Navbar cart count = 0 | |
| CHK-13 | Duplicate prevention | Double/triple-click **Place Order** quickly | Only **one** order is created (check `GET /orders` in Swagger) | |
| CHK-14 | Unavailable item at order time | Add Cappuccino, then in Swagger set it `isAvailable=false`, then place the order | Error "Some items in your order cannot be fulfilled" + **Remove unavailable items** button; the cart is kept | |
| CHK-15 | API down | Stop the backend and place an order | Error toast and inline message; cart is **not** cleared; works after restarting | |
| CHK-16 | No login needed | Whole flow | At no point is a login or registration requested | |

## 7. Order confirmation

| ID | Test case | Steps | Expected result | Result |
| --- | --- | --- | --- | --- |
| CONF-01 | Details shown | After placing an order | Success icon, "Thank you, <name>!", order number `BB-YYMMDD-XXXXX`, status **Pending**, customer, order type / table, masked phone (`******3210`), date, items, quantities and total | |
| CONF-02 | Copy order number | Click the copy icon | Icon turns into a ✓; the order number is in the clipboard | |
| CONF-03 | Refresh | Press F5 on the confirmation page | Same details still shown (same browser tab session) | |
| CONF-04 | Other browser | Open the confirmation URL in another browser | "Order details not available here" with a **Track this order** link (privacy) | |
| CONF-05 | Back to menu | Click **Back to menu** | Goes to `/menu` | |
| CONF-06 | Track button | Click **Track your order** | Opens tracking with the order number (and phone, in the same session) prefilled and the status loaded | |

## 8. Order tracking

| ID | Test case | Steps | Expected result | Result |
| --- | --- | --- | --- | --- |
| TRK-01 | Track own order | Enter the order number and phone used at checkout | Status progress bar, details, items and total | |
| TRK-02 | Lowercase order number | Enter the order number in lowercase | Still found | |
| TRK-03 | Wrong phone | Correct order number with a different valid phone | "No order matches this order number and phone number"; no data shown | |
| TRK-04 | Wrong format | Order number `XYZ` | Validation error "Order numbers look like BB-261115-AB3CD" | |
| TRK-05 | Status update | In Swagger, `PATCH /orders/{id}/status` with `{"status":"Preparing"}`, then click **Refresh** | Progress bar moves to **Preparing** | |
| TRK-06 | All statuses | Repeat TRK-05 with Confirmed → Ready → Completed | Each step highlights correctly | |
| TRK-07 | Cancelled | Set the status to `Cancelled` on another order | Red "Order cancelled" banner | |
| TRK-08 | Brute-force limit | Submit 21 wrong lookups within 10 minutes | 429 "Too many unsuccessful tracking attempts…" | |

## 9. Menu management API (Swagger / Postman)

Authorize in Swagger with `MANAGEMENT_API_KEY` first.

| ID | Test case | Steps | Expected result | Result |
| --- | --- | --- | --- | --- |
| MAPI-01 | List | GET `/menu?category=Coffee&sort=price_asc&page=1&limit=5` | 200; only coffee, ascending price, `meta.pagination` present | |
| MAPI-02 | Get by ID | GET `/menu/{id}` with a real ID | 200 with the item | |
| MAPI-03 | Invalid ID | GET `/menu/123` | 400 "Invalid menu item ID" | |
| MAPI-04 | Not found | GET `/menu/665f1c2ab3d4e5f6a7b8c9d0` | 404 "Menu item not found" | |
| MAPI-05 | Create | POST `/menu` with the Swagger example body | 201; item appears on the website menu | |
| MAPI-06 | Create validation | POST `/menu` with `{"name":"X","price":-5}` | 400 with field errors | |
| MAPI-07 | Duplicate name | POST the same name again | 409 "A record with this name already exists" | |
| MAPI-08 | Update | PUT `/menu/{id}` with `{"price":250,"isAvailable":false}` | 200; website shows the new price and "Sold out" | |
| MAPI-09 | Empty update | PUT `/menu/{id}` with `{}` | 400 "Provide at least one field to update…" | |
| MAPI-10 | Delete | DELETE `/menu/{id}` | 200; item gone from the website; old orders still show it | |
| MAPI-11 | No key | Click **Logout** in Authorize, then POST/PUT/DELETE | 401 "A valid management API key is required" | |
| MAPI-12 | Invalid JSON | POST `/menu` with raw body `{"name": bad` (Postman) | 400 "Request body contains invalid JSON" | |

## 10. Order management API

| ID | Test case | Steps | Expected result | Result |
| --- | --- | --- | --- | --- |
| OAPI-01 | Place via API | POST `/orders` with the Swagger example (use real menu IDs) | 201; `totalAmount` computed by the server | |
| OAPI-02 | **Price tampering** | Add `"price": 1` inside an item | Ignored; total uses the database price | |
| OAPI-03 | Unknown item | Use a random ObjectId as `menuItem` | 409 "Menu item no longer exists" | |
| OAPI-04 | Quantity rules | `quantity: 0`, `1.5`, `25` | 400 for each | |
| OAPI-05 | Injection | `"customerName": {"$gt": ""}` | 400 validation error | |
| OAPI-06 | List needs key | GET `/orders` without a key | 401 | |
| OAPI-07 | List orders | GET `/orders?status=Pending` with a key | 200; only Pending, newest first | |
| OAPI-08 | Get by ID | GET `/orders/{id}` with a key | 200; full record including the unmasked phone | |
| OAPI-09 | Invalid status | PATCH status `{"status":"Baking"}` | 400 with the allowed values listed | |
| OAPI-10 | Final status lock | Set `Completed`, then try `Pending` | 409 "Order is already Completed…" | |
| OAPI-11 | Order rate limit | Place 16 successful orders within 10 minutes from one IP | 16th returns 429 | |

## 11. Responsive & accessibility

| ID | Test case | Steps | Expected result | Result |
| --- | --- | --- | --- | --- |
| UI-01 | Phone (≈360–430 px) | Use every page on a phone | No sideways scrolling; buttons easy to tap; text readable | |
| UI-02 | Tablet (≈768 px) | DevTools → iPad | 2–3 column menu grid, layout intact | |
| UI-03 | Desktop (≥1280 px) | Full screen | 4-column menu grid; sticky order summary at checkout | |
| UI-04 | Keyboard | Use Tab, Enter and Esc only | All buttons reachable with a visible focus ring; Esc closes the drawer and modal | |
| UI-05 | 404 page | Open `/random-page` | Branded 404 with links to the Menu and Home | |
| UI-06 | Deep link refresh | Refresh on `/track-order` and `/checkout` | Page loads (no server 404) | |

## 12. Deployment (after Render + Vercel)

| ID | Test case | Steps | Expected result | Result |
| --- | --- | --- | --- | --- |
| DEP-01 | API live | Open `https://<render>.onrender.com/api/health` | 200 "Cafe API is running" (first hit may take ~50 s on the free plan) | |
| DEP-02 | Swagger live | Open `/api/docs` on Render | Loads and **Authorize** works with the production key | |
| DEP-03 | Frontend live | Open the Vercel URL | Menu loads from the Render API | |
| DEP-04 | CORS | Check the browser console on Vercel | No CORS errors (`CLIENT_URL` contains the Vercel URL) | |
| DEP-05 | SPA refresh | Refresh `/menu?table=3` and `/track-order` on Vercel | Pages load | |
| DEP-06 | Production QR | On the live `/table-qr`, URL = Vercel domain; scan with mobile data (Wi-Fi off) | Menu opens with the table detected | |
| DEP-07 | Prod security | POST `/api/menu` without a key on Render | 401 | |
| DEP-08 | Full order | Place, confirm and track an order on the live site | All steps work | |
