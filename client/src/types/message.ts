export interface Message {
  id: string;
  type: "subtask" | "result";
  text: string;
  timestamp: Date | any;
}
