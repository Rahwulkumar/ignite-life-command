/**
 * Environment variable validation and type-safe access
 */

function getEnvVar(key: string): string {
  const value = import.meta.env[key];
  if (!value || value === "") {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
        `Please check your .env file and ensure ${key} is set.\n` +
        `See .env.example for required variables.`
    );
  }
  return value;
}

function getOptionalEnvVar(key: string, defaultValue = ""): string {
  return import.meta.env[key] || defaultValue;
}

export const env = {
  // API Configuration (Required)
  API_URL: getEnvVar("VITE_API_URL"),

  // Optional
  NODE_ENV: getOptionalEnvVar("NODE_ENV", "development"),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const;

function validateEnvironment(): void {
  const requiredVars = ["VITE_API_URL"];
  const missing = requiredVars.filter((key) => !import.meta.env[key]);
  if (missing.length > 0) {
    console.error(
      "❌ Missing required environment variables:\n" +
        missing.map((key) => `  - ${key}`).join("\n") +
        "\n\nPlease check your .env file. See .env.example for reference."
    );
  }
}

validateEnvironment();

export type Env = typeof env;
