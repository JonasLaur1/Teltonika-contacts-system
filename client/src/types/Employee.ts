import type { RecordModel } from "pocketbase";
import type Company from "./Companies";
import type Department from "./Department";
import type Division from "./Division";
import type Group from "./Group";
import type Office from "./Office";

export default interface Employee {
  id: string
  name: string;
  surname: string;
  position: string;
  phone_number: string;
  email: string;
  company_id: string;
  office_id: string;
  division_id: string;
  department_id?: string;
  group_id?: string;
  photo?: File | string;
  created_at: Date;
  updated_at: Date;
  expand:{
    office_id: Office
    company_id: Company
    division_id: Division
    department_id: Department
    group_id: Group
  }
  collectionId: string; 
}
