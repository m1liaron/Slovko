

### Database

Run sql files in database

Option A — Use psql directly
In terminal:
```bash
psql postgresql://user:password@host:5432/database_name -f db migrations/001_init.sql

Or with local Docker:
docker exec -i database-db psql -U postgres -d database < db/migrations/001_init.sql
```
This executes your SQL file inside the database.