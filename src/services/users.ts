import { apiRequest } from "./api";
import type { User } from "../types/user";
export const usersService={me:()=>apiRequest<{user:User|null}>("/auth/me")};
