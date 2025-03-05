export type News = {
  id: number;
  deleted?: boolean;
  type: NewsType;
  by: string;
  time: number;
  text?: string;
  dead?: boolean;
  parent?: number;
  poll?: number;
  kids?: number[];
  url?: string;
  score: number;
  title: string;
  parts?: number[];
  descendants: number;
};

export enum NewsType {
  story,
  comment,
  job,
  poll,
  pollopt,
}
