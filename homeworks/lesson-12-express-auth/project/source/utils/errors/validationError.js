export class ValidationError extends Error {
    constructor(message, config) {
        super();
        const statusCode = config?.statusCode || 500;

        if (typeof statusCode !== 'number') {
            throw new Error('can not construct ValidationError due to arguments error');
        }

        if (!/^[1-5]{1}[0-9]{2}$/.test(statusCode)) {
            throw new Error(
                'statusCode in ValidationError should be a number in range from 100 to 599',
            );
        }

        const createErrorPart = (str) => str ? ` ${str}` : '';

        if (config) {
            this.message = `${new Date().toISOString()}${createErrorPart(config.method)}${config.originalUrl}${config.errors}${config.payload}\n`;
        } else {
            this.message = message;
        }

        Error.captureStackTrace(this, ValidationError);
        this.name = 'ValidationError';
        this.statusCode = statusCode;
    }
}
