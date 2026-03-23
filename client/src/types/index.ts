export type User = {
  id: string;
  username: string;
  email: string;
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  authorId: string;
  createdAt: string;
};
