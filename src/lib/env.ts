/**
 * Environment variable validation and type-safe access
 * 
 * This module ensures all required environment variables are present
 * and provides type-safe access to them throughout the application.
 * 
 * @throws {Error} If any required environment variable is missing
 */

/**
 * Validates and retrieves an environment variable
 * @param key - The environment variable key
 * @returns The environment variable value
 * @throws {Error} If the environment variable is not set
 */
function getEnvVar(key: string): string {
    const value = import.meta.env[key];

    if (!value || value === '') {
        throw new Error(
            `Missing required environment variable: ${key}\n` +
            `Please check your .env file and ensure ${key} is set.\n` +
            `See .env.example for required variables.`
        );
    }

    return value;
}

/**
 * Validates and retrieves an optional environment variable
 * @param key - The environment variable key
 * @param defaultValue - Default value if not set
 * @returns The environment variable value or default
 */
function getOptionalEnvVar(key: string, defaultValue: string = ''): string {
    return import.meta.env[key] || defaultValue;
}

/**
 * Type-safe environment variables
 * All required variables are validated on module load
 */
export const env = {
    // Supabase Configuration (Required)
    SUPABASE_URL: getEnvVar('VITE_SUPABASE_URL'),
    SUPABASE_PUBLISHABLE_KEY: getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY'),
    SUPABASE_PROJECT_ID: getEnvVar('VITE_SUPABASE_PROJECT_ID'),

    // Optional Configuration
    NODE_ENV: getOptionalEnvVar('NODE_ENV', 'development'),

    // Helper methods
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    mode: import.meta.env.MODE,
} as const;

/**
 * Validates all required environment variables are present
 * Called automatically when this module is imported
 */
function validateEnvironment(): void {
    const requiredVars = [
        'VITE_SUPABASE_URL',
        'VITE_SUPABASE_PUBLISHABLE_KEY',
        'VITE_SUPABASE_PROJECT_ID',
    ];

    const missing = requiredVars.filter(key => !import.meta.env[key]);

    if (missing.length > 0) {
        console.error(
            '❌ Missing required environment variables:\n' +
            missing.map(key => `  - ${key}`).join('\n') +
            '\n\nPlease check your .env file. See .env.example for reference.'
        );
    } else if (env.isDevelopment) {

    }
}

// Validate on module load
validateEnvironment();

// Type export for use in other files
export type Env = typeof env;
