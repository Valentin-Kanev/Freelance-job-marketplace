"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const userManagment_1 = __importDefault(require("./routes/userManagment"));
const profiles_1 = __importDefault(require("./routes/profiles"));
const jobs_1 = __importDefault(require("./routes/jobs"));
const applications_1 = __importDefault(require("./routes/applications"));
const reviews_1 = __importDefault(require("./routes/reviews"));
const chat_1 = __importDefault(require("./routes/chat"));
const socket_1 = require("./socket.io/socket");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const corsOptions = {
    origin: "http://localhost:3001",
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
const envPath = path_1.default.resolve(__dirname, "../config/.env");
dotenv_1.default.config({ path: envPath });
app.use(express_1.default.json());
app.use(userManagment_1.default);
app.use("/applications", applications_1.default);
app.use(profiles_1.default);
app.use("/reviews", reviews_1.default);
app.use("/profiles", reviews_1.default);
app.use(jobs_1.default);
app.use(chat_1.default);
const io = (0, socket_1.initializeSocket)(server);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
