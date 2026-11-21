export type UserRole = "customer" | "merchant" | "admin";
export type UserStatus = "active" | "pending" | "suspended";
export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};
export type AuthResponse = { user: User };
export type RegisterInput = { fullName: string; email: string; phone?: string; password: string; role: "customer" | "merchant"; businessType?: "parts_store"|"garage"|"maintenance_center"|"motorcycle_workshop" };
