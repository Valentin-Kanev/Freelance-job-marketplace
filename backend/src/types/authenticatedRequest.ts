import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest<
  Body = any,
  Params = Record<string, any>,
  Query = Record<string, any>
> extends Request<Params, any, Body, Query> {
  user: JwtPayload;
}
