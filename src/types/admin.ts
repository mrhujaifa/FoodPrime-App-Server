export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: "ADMIN" | "USER" | "PROVIDER";
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
  address: string | null;
  phone: string | null;
  providerName: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}
