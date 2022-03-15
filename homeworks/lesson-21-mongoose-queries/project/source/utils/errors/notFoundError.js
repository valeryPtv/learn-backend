export class NotFoundError extends Error {
    constructor(message, config) {
        super();
        const statusCode = config?.statusCode || 404;

        if (typeof statusCode !== 'number') {
            throw new Error('can not construct NotFoundError due to arguments error');
        }

        if (!/^[1-5]{1}[0-9]{2}$/.test(statusCode)) {
            throw new Error(
                'statusCode in NotFoundError should be a number in range from 100 to 599',
            );
        }
        const createErrorPart = (str) => str ? ` ${str}` : '';

        if (config) {
            this.message = `${new Date().toISOString()}${createErrorPart(config.method)}:${config.originalUrl}\n`;
        } else {
            this.message = message;
        }

        Error.captureStackTrace(this, NotFoundError);
        this.name = 'NotFoundError';
        this.statusCode = statusCode;
    }
}
