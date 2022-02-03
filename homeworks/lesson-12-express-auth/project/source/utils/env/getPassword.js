// Instruments
import { ValidationError } from '../errors';

export const getPassword = () => {
    const { COOKIE_SECRET } = process.env;

    if (!COOKIE_SECRET) {
        throw new ValidationError('Environment variable COOKIE_SECRET should be specified');
    }

    const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(COOKIE_SECRET);

    if (!isValid) {
        throw new ValidationError(
            'Environment variable COOKIE_SECRET should have a minimum eight characters, at least one letter, one number and one special character',
        );
    }

    return COOKIE_SECRET;
};
