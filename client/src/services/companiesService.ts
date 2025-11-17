import type Company from "@/types/Companies";
import { pb } from "./pocketbase";

export default {
    async getCompanies(
    page: number = 1,
    perPage: number = 9999999,
    nameFilter?: string
  ): Promise<{ items: Company[]; totalPages: number; totalItems: number }> {
    try {
      let filter;
      if (nameFilter) {
        filter = `name = "${nameFilter}"`;
      }
      const result = await pb
        .collection(`companies`)
        .getList<Company>(page, perPage, {
          sort: "-created",
          ...(filter && { filter }),
        });
      return {
        items: result.items,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
      };
    } catch (error) {
      throw error;
    }
  },

  async updateCompany(id: string, newName: string) {
    try {
      const record = await pb
        .collection("companies")
        .update(id, { name: newName });
    } catch (error) {
      throw error;
    }
  },

  async createCompany(name: string) {
    try {
      await pb.collection("companies").create({ name });
    } catch (error) {
      throw error
    }
  },

  async deleteCompany(id: string){
    try{
        await pb.collection('companies').delete(id);
    }catch(error){
        throw error
    }
  }
};
