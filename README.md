# Character Creation API
 
A REST API for creating and managing game characters. Users can build characters by selecting a class and equipping items from a shared catalog.
 
## Live Links
 
- **API Base URL:** `https://final-project-characters.onrender.com`
- **API Documentation (Swagger UI):** `https://final-project-characters.onrender.com/api-docs`
- **Repository:** `https://github.com/aedgert2/final-project-template`
## Tech Stack
 
- **Runtime:** Node.js (ESM)
- **Framework:** Express
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT + bcrypt
- **Docs:** Swagger UI (OpenAPI 3.0)
## Local Setup
 
### 1. Install dependencies
```bash
npm install
```
 
### 2. Configure environment
Create a `.env` file in the project root:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/character_creation"
JWT_SECRET="your-super-secret-key-change-in-production"
PORT=3000
```
 
### 3. Run database migrations
```bash
npx prisma migrate dev --name init
```
 
### 4. Seed the database
```bash
node prisma/seed.js
```
 
### 5. Start the server
```bash
npm run dev
```
 
The API will be available at `http://localhost:3000` and docs at `http://localhost:3000/api-docs`.
 
## Seed Credentials
 
| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@example.com      | Admin123!  |
| User  | alice@example.com      | User123!   |
| User  | bob@example.com        | User123!   |
 
## Resources
 
| Resource   | Description                              | Write Access    |
|------------|------------------------------------------|-----------------|
| Auth       | Signup / Login                           | Public          |
| Characters | CRUD for user's characters + item equip  | Owner only      |
| Classes    | Character class catalog                  | Admin only      |
| Items      | Equippable item catalog                  | Admin only      |
 