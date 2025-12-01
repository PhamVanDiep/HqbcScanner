export class DateTimeUtils {
    static formatDate(dateString: string, locale: string = 'vi-VN'): string {
        const date = new Date(dateString);
        return date.toLocaleDateString(locale, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    }

    // Format date to Instant (ISO 8601 with timezone)
    static formatToInstant(date: Date = new Date()): string {
        return date.toISOString(); // Returns: "2024-01-15T10:30:00.000Z"
    }
}