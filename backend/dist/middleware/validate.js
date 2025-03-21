"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => (req, res, next) => {
    const validationResult = schema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({
            success: false,
            message: validationResult.error.errors[0].message,
            errors: validationResult.error.errors,
        });
    }
    next();
};
exports.validate = validate;
