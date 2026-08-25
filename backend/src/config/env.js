const requiredEnvironmentVariables = ["DATABASE_URL"];

export function validateEnvironment() {
  const missingVariables = requiredEnvironmentVariables.filter(
    (variable) => !process.env[variable],
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(", ")}`,
    );
  }

  const databaseUrl = process.env.DATABASE_URL;
  const isLocalDatabase = databaseUrl.startsWith("file:");

  if (!isLocalDatabase && !process.env.DATABASE_AUTH_TOKEN) {
    throw new Error(
      "DATABASE_AUTH_TOKEN is required when using a remote databases",
    );
  }
}
