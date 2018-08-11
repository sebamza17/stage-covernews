import { Category } from '../category/Category';

export class Article {
  _id: string;
  articleDate: Date;
  authorId: Number;
  authorName: string;
  canonical: string;
  category: string;
  content: string;
  crawlerId: string;
  createdAt: Date;
  image: string;
  isAuthorFixed: boolean;
  isFacebookScraped: boolean;
  isHome: boolean;
  isInCover: boolean;
  keywords: [string];
  newspaper: string;
  newspaperName: string;
  originalUrl: string;
  scrapedAt: Date;
  stats: boolean;
  title: string;
  watson: Object;
  categoryObject: Category;
  categoryName: string;
}