import { Request, Response } from "express";

export interface FindAll {
  table: string;
  req?: Request;
  res: Response;
}
export interface FindField {
  table: string;
  param: string;
  field: string;
  req?: Request;
  res: Response;
}
export interface Post {
  table: string;
  insertData: object;
  key: string;
  req?: Request;
  res: Response;
}

export interface Put {
  table: string;
  updateData: any[]; // updateData[0]-object updateData[1]-string
  field: string;
  req?: Request;
  res: Response;
}

export interface Delete {
  table: string;
  field: string;
  param: string;
  req?: Request;
  res: Response;
}
