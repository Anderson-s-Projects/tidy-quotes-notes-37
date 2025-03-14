
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
  folderId: string;
}

export interface Folder {
  id: string;
  name: string;
  icon?: string;
  parentId?: string;
  children?: Folder[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Quote {
  text: string;
  author: string;
  source?: string;
}
