export function formatSalaryRange(min: number, max: number, currency: string = 'USD'): string {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    return `${formatter.format(min)} - ${formatter.format(max)}`;
}

export function getPriorityColor(priority: 'high' | 'medium' | 'low'): string {
    const colors = {
        high: 'bg-red-100 text-red-700 border-red-200',
        medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        low: 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[priority];
}

export function calculateProgress(current: number, target: number): number {
    if (target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
}

export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}