# Testing Plan — Character Creation API

All tests are performed via Swagger UI at: `https://final-project-characters.onrender.com/api-docs/#/`

> **How to authorize in Swagger:**
> 1. Call `POST /auth/login` and copy the `token` value from the response.
> 2. Click the **Authorize 🔒** button at the top of the Swagger page.
> 3. Paste the token into the **Value** field and click **Authorize**.
> 4. All subsequent requests will include the token automatically.

---

## Seed Data Reference

| ID | Resource  | Details                                              |
|----|-----------|------------------------------------------------------|
| 1  | User      | admin — email: `admin@example.com`, role: ADMIN      |
| 2  | User      | alice — email: `alice@example.com`, role: USER       |
| 3  | User      | bob — email: `bob@example.com`, role: USER           |
| 1  | Class     | Warrior                                              |
| 2  | Class     | Mage                                                 |
| 3  | Class     | Rogue                                                |
| 4  | Class     | Paladin                                              |
| 1  | Item      | Iron Sword (weapon, tier 1)                          |
| 2  | Item      | Steel Sword (weapon, tier 2)                         |
| 3  | Item      | Leather Armor (armor, tier 1)                        |
| 4  | Item      | Chainmail (armor, tier 2)                            |
| 5  | Item      | Fireball Tome (spell, tier 2)                        |
| 6  | Item      | Health Potion (consumable, tier 1)                   |
| 1  | Character | Aragorn (alice's, Warrior, level 5) — has Iron Sword + Chainmail |
| 2  | Character | Gandalf (alice's, Mage, level 10) — has Fireball Tome |
| 3  | Character | Legolas (bob's, Rogue, level 4) — has Leather Armor  |

**Test Credentials:**
- Admin: `admin@example.com` / `Admin123!`
- Alice (regular user): `alice@example.com` / `User123!`
- Bob (regular user): `bob@example.com` / `User123!`

---

## 1. Auth Endpoints

### POST /auth/signup

**Access Control:** Public (no token required)

**Success Case (201):**
- Click **Try it out**
- Body: `{ "username": "testuser", "email": "testuser@example.com", "password": "Test123!" }`
- Click **Execute**
- Expect 201: `{ "id": 4, "username": "testuser", "email": "testuser@example.com", "role": "USER" }`

**400 Bad Request — missing field:**
- Body: `{ "username": "testuser2", "email": "testuser2@example.com" }` (omit password)
- Expect 400: `{ "error": "username, email, and password are required." }`

**409 Conflict — duplicate email:**
- Body: `{ "username": "uniquename", "email": "alice@example.com", "password": "Test123!" }`
- Expect 409: `{ "error": "Username or email already exists." }`

**409 Conflict — duplicate username:**
- Body: `{ "username": "alice", "email": "unique@example.com", "password": "Test123!" }`
- Expect 409: `{ "error": "Username or email already exists." }`

---

### POST /auth/login

**Access Control:** Public (no token required)

**Success Case (200):**
- Body: `{ "email": "alice@example.com", "password": "User123!" }`
- Expect 200: `{ "token": "<JWT string>" }`
- Copy the token and use the **Authorize 🔒** button

**400 Bad Request — missing field:**
- Body: `{ "email": "alice@example.com" }` (omit password)
- Expect 400: `{ "error": "email and password are required." }`

**401 Unauthorized — wrong password:**
- Body: `{ "email": "alice@example.com", "password": "WrongPassword!" }`
- Expect 401: `{ "error": "Invalid credentials." }`

**401 Unauthorized — user doesn't exist:**
- Body: `{ "email": "nobody@example.com", "password": "Test123!" }`
- Expect 401: `{ "error": "Invalid credentials." }`

---

## 2. Characters Endpoints

### POST /characters

**Access Control:** Any authenticated user

**Setup:** Log in as Alice (`alice@example.com` / `User123!`) and authorize.

**Success Case (201):**
- Body: `{ "name": "Thorin", "classId": 1 }`
- Expect 201: `{ "id": 4, "name": "Thorin", "level": 1, "classId": 1, "userId": 2 }`

**Success Case with explicit level (201):**
- Body: `{ "name": "Bilbo", "classId": 3, "level": 3 }`
- Expect 201 with `"level": 3`

**400 Bad Request — missing name:**
- Body: `{ "classId": 1 }`
- Expect 400: `{ "error": "name and classId are required." }`

**400 Bad Request — invalid classId:**
- Body: `{ "name": "BadChar", "classId": -5 }`
- Expect 400: `{ "error": "classId must be a positive integer." }`

**400 Bad Request — invalid level:**
- Body: `{ "name": "BadChar", "classId": 1, "level": 0 }`
- Expect 400: `{ "error": "level must be a positive integer." }`

**401 Unauthorized — no token:**
- Remove the JWT from Swagger Authorize, then execute
- Expect 401: `{ "error": "Authentication required. Please provide a Bearer token." }`

**404 Not Found — classId doesn't exist:**
- Body: `{ "name": "Ghost", "classId": 9999 }`
- Expect 404: `{ "error": "Class with id 9999 does not exist." }`

---

### GET /characters

**Access Control:** Any authenticated user (returns only their own characters)

**Success Case (200) — logged in as Alice:**
- Log in as Alice and authorize
- Expect 200 with array of 2 characters: Aragorn (id=1) and Gandalf (id=2)

**Success Case (200) — logged in as Bob:**
- Log in as Bob (`bob@example.com` / `User123!`) and authorize
- Expect 200 with array of 1 character: Legolas (id=3)

**401 Unauthorized:**
- Remove JWT from Swagger Authorize
- Expect 401

---

### GET /characters/{id}

**Access Control:** Owner of the character only

**Setup:** Log in as Alice and authorize.

**Success Case (200):**
- id: `1`
- Expect 200: character Aragorn with `"items"` array containing Iron Sword (id=1) and Chainmail (id=4)

**400 Bad Request — invalid ID:**
- id: `-1`
- Expect 400: `{ "error": "ID must be a positive integer." }`

**401 Unauthorized:**
- Remove JWT and try id: `1`
- Expect 401

**403 Forbidden — not owner:**
- Still logged in as Alice, id: `3` (Legolas, owned by Bob)
- Expect 403: `{ "error": "You do not own this character." }`

**404 Not Found:**
- id: `9999`
- Expect 404: `{ "error": "Character with id 9999 does not exist." }`

---

### PUT /characters/{id}

**Access Control:** Owner of the character only

**Setup:** Log in as Alice and authorize.

**Success Case (200) — rename:**
- id: `1`, Body: `{ "name": "Strider" }`
- Expect 200: `{ "id": 1, "name": "Strider", "level": 5, "classId": 1, "userId": 2 }`

**Success Case (200) — change class:**
- id: `1`, Body: `{ "classId": 2 }`
- Expect 200 with `"classId": 2`

**400 Bad Request — empty body:**
- id: `1`, Body: `{}`
- Expect 400: `{ "error": "No valid fields provided for update." }`

**400 Bad Request — invalid level:**
- id: `1`, Body: `{ "level": -3 }`
- Expect 400: `{ "error": "level must be a positive integer." }`

**401 Unauthorized:**
- Remove JWT, id: `1`
- Expect 401

**403 Forbidden — not owner:**
- Log in as Alice, id: `3` (Bob's character), Body: `{ "name": "Test" }`
- Expect 403

**404 Not Found:**
- id: `9999`, Body: `{ "name": "Ghost" }`
- Expect 404

---

### DELETE /characters/{id}

**Access Control:** Owner of the character only

**Setup:** Log in as Alice and authorize. Create a disposable character first:
- POST /characters with `{ "name": "TempChar", "classId": 1 }` and note the returned id.

**Success Case (200):**
- DELETE with the disposable character's id
- Expect 200 with the deleted character object

**400 Bad Request — invalid ID:**
- id: `0`
- Expect 400: `{ "error": "ID must be a positive integer." }`

**401 Unauthorized:**
- Remove JWT, id: `1`
- Expect 401

**403 Forbidden — not owner:**
- Log in as Alice, id: `3` (Bob's character)
- Expect 403

**404 Not Found:**
- id: `9999`
- Expect 404

---

### POST /characters/{id}/items

**Access Control:** Owner of the character only

**Setup:** Log in as Alice and authorize.

**Success Case (201):**
- id: `1`, Body: `{ "itemId": 6 }` (Health Potion not yet on Aragorn)
- Expect 201: `{ "characterId": 1, "itemId": 6 }`

**400 Bad Request — missing itemId:**
- id: `1`, Body: `{}`
- Expect 400: `{ "error": "itemId must be a positive integer." }`

**401 Unauthorized:**
- Remove JWT
- Expect 401

**403 Forbidden — not owner:**
- Log in as Alice, id: `3` (Bob's character), Body: `{ "itemId": 1 }`
- Expect 403

**404 Not Found — character doesn't exist:**
- id: `9999`, Body: `{ "itemId": 1 }`
- Expect 404

**404 Not Found — item doesn't exist:**
- id: `1`, Body: `{ "itemId": 9999 }`
- Expect 404

**409 Conflict — item already assigned:**
- id: `1`, Body: `{ "itemId": 1 }` (Iron Sword already on Aragorn)
- Expect 409: `{ "error": "Item is already assigned to this character." }`

---

### DELETE /characters/{id}/items/{itemId}

**Access Control:** Owner of the character only

**Setup:** Log in as Alice and authorize.

**Success Case (200):**
- id: `1`, itemId: `4` (remove Chainmail from Aragorn)
- Expect 200: `{ "characterId": 1, "itemId": 4 }`

**400 Bad Request — invalid id:**
- id: `-1`, itemId: `1`
- Expect 400

**401 Unauthorized:**
- Remove JWT
- Expect 401

**403 Forbidden — not owner:**
- Log in as Alice, id: `3` (Bob's character), itemId: `3`
- Expect 403

**404 Not Found — character doesn't exist:**
- id: `9999`, itemId: `1`
- Expect 404

**404 Not Found — item not assigned to character:**
- id: `1`, itemId: `2` (Steel Sword is not on Aragorn)
- Expect 404: `{ "error": "Item with id 2 is not assigned to this character." }`

---

## 3. Classes Endpoints

> Classes are a global catalog. Read operations require any authenticated JWT. Write operations require an **admin** JWT.

### POST /classes

**Access Control:** Admin only

**Setup:** Log in as Admin (`admin@example.com` / `Admin123!`) and authorize.

**Success Case (201):**
- Body: `{ "name": "Druid", "description": "A nature-wielding shapeshifter." }`
- Expect 201: `{ "id": 5, "name": "Druid", "description": "A nature-wielding shapeshifter." }`

**400 Bad Request — missing description:**
- Body: `{ "name": "Druid" }`
- Expect 400: `{ "error": "name and description are required." }`

**401 Unauthorized:**
- Remove JWT
- Expect 401

**403 Forbidden — regular user:**
- Log in as Alice and authorize, then attempt POST
- Expect 403: `{ "error": "Forbidden. Admin access required." }`

**409 Conflict — duplicate name:**
- Body: `{ "name": "Warrior", "description": "A duplicate." }`
- Expect 409: `{ "error": "A class named \"Warrior\" already exists." }`

---

### GET /classes

**Access Control:** Any authenticated user

**Setup:** Log in as Alice and authorize.

**Success Case (200):**
- Expect 200 with array of 4+ classes (Warrior, Mage, Rogue, Paladin)

**401 Unauthorized:**
- Remove JWT
- Expect 401

---

### GET /classes/{id}

**Access Control:** Any authenticated user

**Setup:** Log in as Alice and authorize.

**Success Case (200):**
- id: `1`
- Expect 200: `{ "id": 1, "name": "Warrior", "description": "A powerful melee fighter who excels in close combat." }`

**400 Bad Request:**
- id: `-5`
- Expect 400: `{ "error": "ID must be a positive integer." }`

**401 Unauthorized:**
- Remove JWT
- Expect 401

**404 Not Found:**
- id: `9999`
- Expect 404: `{ "error": "Class with id 9999 does not exist." }`

---

### PUT /classes/{id}

**Access Control:** Admin only

**Setup:** Log in as Admin and authorize.

**Success Case (200):**
- id: `1`, Body: `{ "description": "An updated melee fighter description." }`
- Expect 200: `{ "id": 1, "name": "Warrior", "description": "An updated melee fighter description." }`

**400 Bad Request — empty body:**
- id: `1`, Body: `{}`
- Expect 400: `{ "error": "No valid fields provided for update." }`

**401 Unauthorized:**
- Remove JWT
- Expect 401

**403 Forbidden — regular user:**
- Log in as Alice, attempt PUT on id: `1`
- Expect 403

**404 Not Found:**
- id: `9999`, Body: `{ "name": "Ghost" }`
- Expect 404

**409 Conflict — duplicate name:**
- id: `1`, Body: `{ "name": "Mage" }` (Mage already exists)
- Expect 409: `{ "error": "A class named \"Mage\" already exists." }`

---

### DELETE /classes/{id}

**Access Control:** Admin only

**Setup:** Log in as Admin and authorize. First create a disposable class:
- POST /classes with `{ "name": "TempClass", "description": "To be deleted." }` and note its id.

**Success Case (200):**
- DELETE with the disposable class id
- Expect 200 with the deleted class object

**401 Unauthorized:**
- Remove JWT
- Expect 401

**403 Forbidden — regular user:**
- Log in as Alice, attempt DELETE
- Expect 403

**404 Not Found:**
- id: `9999`
- Expect 404: `{ "error": "Class with id 9999 does not exist." }`

---

## 4. Items Endpoints

> Items are a global catalog. Read operations require any authenticated JWT. Write operations require an **admin** JWT.

### POST /items

**Access Control:** Admin only

**Setup:** Log in as Admin (`admin@example.com` / `Admin123!`) and authorize.

**Success Case (201):**
- Body: `{ "name": "Dragon Lance", "type": "weapon", "tier": 3 }`
- Expect 201: `{ "id": 7, "name": "Dragon Lance", "type": "weapon", "tier": 3 }`

**400 Bad Request — missing tier:**
- Body: `{ "name": "Orb", "type": "spell" }`
- Expect 400: `{ "error": "name, type, and tier are required." }`

**400 Bad Request — invalid type:**
- Body: `{ "name": "Mystery", "type": "invalid", "tier": 1 }`
- Expect 400: `{ "error": "type must be one of: weapon, armor, spell, consumable, accessory." }`

**400 Bad Request — invalid tier:**
- Body: `{ "name": "Orb", "type": "spell", "tier": 0 }`
- Expect 400: `{ "error": "tier must be a positive integer." }`

**401 Unauthorized:**
- Remove JWT
- Expect 401

**403 Forbidden — regular user:**
- Log in as Alice, attempt POST
- Expect 403

**409 Conflict — duplicate name:**
- Body: `{ "name": "Iron Sword", "type": "weapon", "tier": 1 }`
- Expect 409: `{ "error": "An item named \"Iron Sword\" already exists." }`

---

### GET /items

**Access Control:** Any authenticated user

**Setup:** Log in as Alice and authorize.

**Success Case (200):**
- Expect 200 with array of 6+ items

**401 Unauthorized:**
- Remove JWT
- Expect 401

---

### GET /items/{id}

**Access Control:** Any authenticated user

**Setup:** Log in as Alice and authorize.

**Success Case (200):**
- id: `1`
- Expect 200: `{ "id": 1, "name": "Iron Sword", "type": "weapon", "tier": 1 }`

**400 Bad Request:**
- id: `-10`
- Expect 400: `{ "error": "ID must be a positive integer." }`

**401 Unauthorized:**
- Remove JWT
- Expect 401

**404 Not Found:**
- id: `9999`
- Expect 404: `{ "error": "Item with id 9999 does not exist." }`

---

### PUT /items/{id}

**Access Control:** Admin only

**Setup:** Log in as Admin and authorize.

**Success Case (200):**
- id: `6`, Body: `{ "tier": 2 }`
- Expect 200: `{ "id": 6, "name": "Health Potion", "type": "consumable", "tier": 2 }`

**400 Bad Request — empty body:**
- id: `1`, Body: `{}`
- Expect 400: `{ "error": "No valid fields provided for update." }`

**400 Bad Request — invalid type:**
- id: `1`, Body: `{ "type": "garbage" }`
- Expect 400: `{ "error": "type must be one of: weapon, armor, spell, consumable, accessory." }`

**401 Unauthorized:**
- Remove JWT
- Expect 401

**403 Forbidden — regular user:**
- Log in as Alice, attempt PUT
- Expect 403

**404 Not Found:**
- id: `9999`, Body: `{ "tier": 1 }`
- Expect 404

**409 Conflict — duplicate name:**
- id: `1`, Body: `{ "name": "Steel Sword" }` (already exists)
- Expect 409: `{ "error": "An item named \"Steel Sword\" already exists." }`

---

### DELETE /items/{id}

**Access Control:** Admin only

**Setup:** Log in as Admin and authorize. First create a disposable item:
- POST /items with `{ "name": "TempItem", "type": "accessory", "tier": 1 }` and note its id.

**Success Case (200):**
- DELETE with the disposable item id
- Expect 200 with the deleted item object

**401 Unauthorized:**
- Remove JWT
- Expect 401

**403 Forbidden — regular user:**
- Log in as Alice, attempt DELETE
- Expect 403

**404 Not Found:**
- id: `9999`
- Expect 404: `{ "error": "Item with id 9999 does not exist." }`
