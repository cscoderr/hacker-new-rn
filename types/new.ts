export type News = {
  by: string;
  descendants: number;
  id: number;
  kids?: number[];
  score: number;
  time: number;
  text?: string;
  title: string;
  type: Type;
  url?: string;
};

enum Type {
  story,
  comment,
}
