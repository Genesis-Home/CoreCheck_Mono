/**
 * Loads apps/api/.env into process.env when the file exists (local
 * development). Deployed environments set real environment variables instead.
 * Import this first in every entry point.
 */
try {
  process.loadEnvFile();
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
}
