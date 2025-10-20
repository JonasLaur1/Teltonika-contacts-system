import type Company from "@/types/Companies";
import axios from "axios";
import { pb } from "./pocketbase";

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
    itemsPerPage: number
  ) {
    const resultList = await pb
      .collection(`${currentCollection}`)
      .getList(currentPage, itemsPerPage);
    return resultList;
  },

  async deleteStructure(collectionName: string, itemId: string): Promise<void> {
    try {
      await pb.collection(collectionName).delete(itemId);
    } catch (error) {
      console.error(`Error deleting ${collectionName} item:`, error);
      throw error;
    }
  },
};
