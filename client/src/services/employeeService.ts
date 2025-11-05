import { type ListResult } from "pocketbase";
import type Employee from "@/types/Employee";
import { FILTER_MAPPING } from "@/constants/filters";
import { pb } from "./pocketbase";

type Filters = {
  company: string | null;
  office: string | null;
  division: string | null;
  department: string | null;
  group: string | null;
};

export default {
  async getEmployees(
    currentPage: number,
    itemsPerPage: number,
    searchValue: string,
    filters?: Filters
  ): Promise<[ListResult<Employee>, number]> {
    try {
      let filterParts = [];

      if (searchValue) {
        filterParts.push(
          `(name~"${searchValue}" || surname~"${searchValue}" || email~"${searchValue}" || phone_number~"${searchValue}" || position~"${searchValue}")`
        );
      }

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          const filterName = FILTER_MAPPING[key as keyof typeof FILTER_MAPPING];
          if (value && filterName) {
            filterParts.push(`${filterName} = "${value}"`);
          }
        });
      }

      const finalFilter = filterParts.join(" && ");

      const records = await pb
        .collection("employees")
        .getList<Employee>(currentPage, itemsPerPage, {
          sort: "-created",
          expand: "office_id,company_id,division_id,department_id,group_id",
          filter: finalFilter,
        });

      if (records.totalPages < currentPage) {
        currentPage = records.totalPages;
      }
      return [records, currentPage];
    } catch (error) {
      throw error;
    }
  },

  async getEmployeeById(id: string): Promise<Employee> {
    try {
      const record = await pb.collection("employees").getOne<Employee>(id, {
        expand: "office_id,company_id,division_id,department_id,group_id",
      });
      return record;
    } catch (error) {
      throw error;
    }
  },

  async deleteEmployee(id: string): Promise<void> {
    try {
      await pb.collection("employees").delete(id);
    } catch (error) {
      throw error;
    }
  },
};
