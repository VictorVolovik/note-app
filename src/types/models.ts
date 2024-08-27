export type Note = {
  id: number;
  content: string;
  tags: string[];
};

export type DB = {
  notes: Note[];
};
