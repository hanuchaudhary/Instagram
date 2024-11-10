import { atom } from "recoil";

export type Message = {
  message: string;
  senderId: string;
  receiverId: string;
};

export const currentMessagesState = atom<Message[]>({
  key: "currentMessagesState",
  default: [],
});
