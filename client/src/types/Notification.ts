export default interface Notification {
  id: string;
  type: "success" | "error" | "alert";
  message: string;
}
