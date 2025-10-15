import type Company from "@/types/Companies";
import axios from "axios";
import {pb} from "./pocketbase"

export default {
  async getCompanies(): Promise<Company[]> {
    try {
      const records = await pb.collection(`companies`).getFullList<Company>({
        sort: "-created",
      });
      return records;
    } catch (error) {
      throw error;
    }
  },

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
};
