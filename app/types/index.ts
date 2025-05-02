export type Locale = "en" | "ar";
export interface ISection {
  _id: string;
  title: {
    en: string;
    ar: string;
  };
}
export interface IBlog {
  _id: string;
  title: {
    en: string;
    ar: string;
  };
  slug: string;
  sections: ISection[];
  createdAt: Date;
  updatedAt: Date;
}
