import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthenticatedSocket extends Socket {
  user?: JwtPayload;
}

const authenticateSocket = (
  socket: AuthenticatedSocket,
  next: (err?: ExtendedError) => void
): void => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    const error = new Error("Authentication token is required.");
    return next(error);
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    socket.user = decodedToken;
    next();
  } catch (error) {
    if (error instanceof Error) {
      const authError = new Error("Authentication failed.");
      next(authError);
    }
  }
};
export default authenticateSocket;
