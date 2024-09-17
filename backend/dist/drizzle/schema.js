"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.User = (0, pg_core_1.pgTable)("user", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull(),
});
