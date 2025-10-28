import type Company from "@/types/Companies";
import { pb } from "./pocketbase";

export default {
  async getAdmins(page: number = 1, perPage: number = 9999999) {
    const result = await pb
      .collection("users")
      .getList(page, perPage, { sort: "-created" });

      return result
  },};
