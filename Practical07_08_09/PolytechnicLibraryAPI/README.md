## Dependencies

| Package           | Purpose                     |
| ----------------- | --------------------------- |
| express           | Web framework               |
| mssql             | Microsoft SQL Server driver |
| bcryptjs          | Password hashing            |
| jsonwebtoken      | JWT authentication          |
| joi               | Request validation          |
| dotenv            | Environment variables       |
| swagger-autogen   | Generates the Swagger spec  |
| swagger-ui-express| Serves the Swagger UI       |
| jest (dev)        | Unit testing                |
| nodemon (dev)     | Development server reload   |

## Setup

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Run `sql/create_tables.sql` in SSMS. 

3. Create a `.env` file with the following:

   ```
   PORT=3000
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_SERVER=localhost
   DB_DATABASE=polytechnic_library_db
   DB_PORT=1433
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=3600s
   ```

4. Start the server:

   ```bash
   npm start
   ```

   Use `npm run dev` to start it with nodemon.

## Unit tests

```bash
npm test
```

## API documentation

Regenerate the Swagger spec after changing any route:

```bash
npm run swagger
```

With the server running, the full endpoint documentation is at
<http://localhost:3000/api-docs>.
