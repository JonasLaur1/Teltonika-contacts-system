import type Company from "@/types/Companies";
import axios from "axios";
import { pb } from "./pocketbase";
import type Office from "@/types/Office";
import type Department from "@/types/Department";
import type Division from "@/types/Division";
import type Group from "@/types/Group";

export default {
  async getLowerStructures(
    parentName: string,
    structureType: string,
    relationshipId: string,
    preLastParam: string,
    lastParam: string
  ): Promise<any[]> {
    try {
      const url = `/base_url/api/collections/${parentName}/records/${relationshipId}?expand=${structureType}(${preLastParam}).${lastParam}`;
      const response = await axios.get(url);
      const expandKey = `${structureType}(${preLastParam})`;
      return response.data.expand[expandKey].flatMap(
        (item: any) => item.expand[lastParam]
      );
    } catch (error) {
      console.error(`Error fetching from ${structureType}:`, error);
      return [];
    }
  },

  async getStructures(
    currentCollection: string,
    currentPage: number,
    itemsPerPage: number,
    nameFilter?: string
  ) {
    try {
      let filter;
      if (nameFilter) {
        filter = `name = "${nameFilter}"`;
      }

      const resultList = await pb
        .collection(`${currentCollection}`)
        .getList(currentPage, itemsPerPage, {
          sort: "-created",
          ...(filter && { filter }),
        });
      return resultList;
    } catch (error) {
      throw error;
    }
  },

  async deleteStructure(collectionName: string, itemId: string): Promise<void> {
    try {
      await pb.collection(collectionName).delete(itemId);
    } catch (error) {
      console.error(`Error deleting ${collectionName} item:`, error);
      throw error;
    }
  },

  async createStructure(
    type: string,
    data: Office | Department | Division | Group
  ): Promise<any> {
    const record = await pb.collection(`${type}`).create(data);
    return record;
  },

  async updateStructure(collectionName:string, id: string, data: Office | Department | Division | Group){
    try{
      const record = await pb.collection(collectionName).update(id, data);
    } catch(error){
      console.log(error)
      throw error
    }
  },

  async linkStructures(type: string, data: Record<string, any>) {
    try {
      const record = await pb.collection(type).create(data);
      console.log("Linked successfully:", record);
      return record;
    } catch (error: any) {
      console.error(`Failed to link in ${type}:`, error?.message || error);
      throw error;
    }
  },
};
