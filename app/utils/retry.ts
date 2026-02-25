/**
 * Retry a function multiple times if it fails
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000
): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;

            // Don't retry on certain errors
            if (error instanceof Error) {
                if (error.message.includes('API key') ||
                    error.message.includes('Unauthorized') ||
                    error.message.includes('quota')) {
                    throw error; // Don't retry auth/quota errors
                }
            }

            if (attempt < maxRetries) {
                const delay = initialDelay * Math.pow(2, attempt - 1);
                console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    throw lastError || new Error('Max retries exceeded');
}