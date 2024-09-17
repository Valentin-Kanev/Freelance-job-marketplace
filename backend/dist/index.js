"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./drizzle/db");
const schema_1 = require("./drizzle/schema");
const app = (0, express_1.default)();
const envPath = path_1.default.resolve(__dirname, "../config/.env");
dotenv_1.default.config({ path: envPath });
app.use(express_1.default.json());
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.db.insert(schema_1.User).values({
            name: "Valentin",
        });
        const user = yield db_1.db.query.User.findFirst();
        console.log(user);
    });
}
main();
exports.default = app;
