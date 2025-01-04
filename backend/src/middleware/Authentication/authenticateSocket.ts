import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthenticatedSocket extends Socket {
  user?: JwtPayload; // Extend the socket object to include user info
}

const authenticateSocket = (
  socket: AuthenticatedSocket,
  next: (err?: ExtendedError) => void
): void => {
  const token = socket.handshake.auth?.token; // Extract token from handshake auth
  console.log("Token received in handshake:", token);

  if (!token) {
    const error = new Error("Authentication token is required.");
    console.error("Authentication token is required.");
    return next(error);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as JwtPayload; // Verify token
    socket.user = decoded; // Attach user info to the socket object
    console.log("Token verified successfully:", decoded);
    next(); // Continue to the next middleware or connection
  } catch (error) {
    if (error instanceof Error) {
      console.error("Socket authentication failed:", error.message);
    } else {
      console.error("Socket authentication failed:", error);
    }
    const authError = new Error("Authentication failed.");
    next(authError);
  }
};

export default authenticateSocket;
