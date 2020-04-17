import { User } from "./types";

export interface TokenData {
  id: string;
}

export type Context {
  user: User | null
  req:Express.Request
  res:Express.Response
}