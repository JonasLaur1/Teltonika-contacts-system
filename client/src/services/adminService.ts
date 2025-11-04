import type Company from "@/types/Companies";
import { pb } from "./pocketbase";
import type User from "@/types/User";
import type { ListResult } from "pocketbase";

export default {
  async getAdmins(
    page: number = 1,
    perPage: number = 9999999
  ): Promise<ListResult<User>> {
    const result = await pb
      .collection("users")
      .getList(page, perPage, { sort: "-created" });

    return result as ListResult<User>;
  },

  async addAdmin(data: Record<string, any>): Promise<void> {
    try {
      await pb.collection("users").create(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async deleteAdmin(id: string): Promise<void> {
    try {
      await pb.collection("users").delete(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async updateAdmin(id: string, data: Record<string, any>): Promise<void> {
    try {
      await pb.collection("users").update(id, data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async addPermissions(permissions: Record<string, any>): Promise<any> {
    try {
      const record = await pb
        .collection("user_permissions")
        .create(permissions);
      return record;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async updatePermissions(
    id: string,
    permissions: Record<string, any>
  ): Promise<void> {
    try {
      await pb.collection("user_permissions").update(id, permissions);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
