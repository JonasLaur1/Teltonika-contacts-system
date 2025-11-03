import type Company from "@/types/Companies";
import { pb } from "./pocketbase";

export default {
  async getAdmins(page: number = 1, perPage: number = 9999999) {
    const result = await pb
      .collection("users")
      .getList(page, perPage, { sort: "-created" });

    return result;
  },

  async addAdmin(data: any) {
    try {
      const record = await pb.collection("users").create(data);
    } catch (error) {
      console.log(error)
      throw error;
    }
  },

  async deleteAdmin(id: string){
    try{
      await pb.collection('users').delete(id);
    }catch(error){
      console.log(error)
      throw error
    }
  },

  async addPermissions(permissions: any) {
    try {
      const record = await pb
        .collection("user_permissions")
        .create(permissions);
      return record;
    } catch (error) {
      throw error;
    }
  },


};
