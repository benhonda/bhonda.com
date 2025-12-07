export type User = {
  id: string;
  email: string;
  name?: string | null;
  createdAt: Date;
  updatedAt: Date;
};