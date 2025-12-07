import { atom } from "nanostores";

export const exampleDialogState = atom<{
  open: boolean;
  title: string;
  description: string;
} | null>(null);
