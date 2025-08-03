# Database SQL Scripts

This folder contains the database schema creation scripts for the Brand Halo application.

## Files

- `01_tables.sql` - Creates all required tables (brand_profiles, brand_voices)
- `02_indexes.sql` - Creates all indexes for performance optimization

## Usage

To set up the database schema, run these scripts in order:

1. First, run the table creation script:
   ```sql
   -- Execute contents of 01_tables.sql
   ```

2. Then, run the indexes creation script:
   ```sql
   -- Execute contents of 02_indexes.sql
   ```

## Notes

- All CREATE statements use `IF NOT EXISTS` to prevent errors if tables/indexes already exist
- These scripts are compatible with LibSQL/SQLite databases
- The application no longer automatically creates these database objects - they must be created manually using these scripts

## Migration

The database creation logic was previously handled automatically in `src/lib/db.ts`. This has been moved to these SQL files for better maintainability and deployment control.