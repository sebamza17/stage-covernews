import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import BaseService from '../base-service/base.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Article } from './Article';
import { Category } from '../category/Category';
import { CategoryService } from '../category/category.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService extends BaseService {

  entity = 'article';

  public savedArticleIdList = [];

  // Define all service URLs
  urls = {
    getArticle: '/article/show/{{articleId}}',
    getArticleFull: '/article/showFull/{{articleId}}',
    getArticlesByCategory: '/article/category/{{categoryId}}',
    getLatestArticles: '/article/each/categories',
    getRelatedArticles: '/article/all',
    getArticlesByQuery: '/article/search/{{query}}',
    getArticlesByAuthor: '/article/author/{{authorId}}',
  };

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorage,
    private categoryService: CategoryService
  ) {
    super();
  }

  /**
   * Get a single article by its id
   * @param {string} articleId
   * @returns {Observable<Article>}
   */
  public getArticleById(articleId: string): Observable<Article> {
    let url = this.urls.getArticle;
    url = url.replace('{{articleId}}', articleId);
    return this.http.get<Article>(this.url(url));
  }

  /**
   * Get an article with all its data from a given id
   * @param {string} articleId
   * @returns {Promise<Article>}
   */
  public async getArticleFullById(articleId: string) {
    let url = this.urls.getArticleFull;
    url = url.replace('{{articleId}}', articleId);
    let article = await this.http.get<Article>(this.url(url)).toPromise();
    const categoryObject = await this.categoryService.getCategoryById(article.category);
    article.categoryObject = categoryObject;
    return article;
  }

  /**
   * Get all articles for a given category
   * @param categoryId
   * @returns {Observable<Article[]>}
   */
  public getArticlesByCategory(categoryId, options = null): Observable<Article[]> {
    let url = this.urls.getArticlesByCategory;
    url = url.replace('{{categoryId}}', categoryId);
    return this.http.get<Article[]>(this.url(url, options));
  }

  /**
   * Get articles from a given user string query
   * @param query
   * @param {any} options
   * @returns {Observable<Article[]>}
   */
  public getArticlesByQuery(query, options = null) {
    let url = this.urls.getArticlesByQuery;
    url = url.replace('{{query}}', encodeURIComponent(query));

    return this.http.get<Article[]>(this.url(url, options));
  }

  /**
   * Get latest articles
   * TODO: Change this URL to match the endpoint when ready
   * @param {number} limit
   * @param {number} skip
   * @returns {Observable<Article[]>}
   */
  public getLatestArticles(limit = 0, skip = 0) {

    let url = this.urls.getLatestArticles;

    if (limit > 0) {
      url += '?limit=' + limit;
    }
    if (skip > 0) {
      url += '?skip=' + skip;
    }

    return this.http.get<Article[]>(this.url(url));
  }

  /**
   * Get articles by an authorId
   * @param authorId
   * @param options
   */
  public getArticlesByAuthor(authorId: string, options = null) {
    return this.http.get<Article[]>(this.url(this.urls.getArticlesByAuthor.replace('{{authorId}}', authorId), options));
  }

  /**
   * Get related articles by articleId
   * @param articleId
   * @param options
   */
  public getRelatedArticles(articleId: string, options = null) {
    return this.http.get<Article[]>(this.url(this.urls.getRelatedArticles.replace('{{articleId}}', articleId), options));
  }

  /**
   * Get one article for each category that the user follows
   * @returns {Observable<Article[]>}
   */
  public getOneArticlesByEachFollowCategory(): Observable<Article[]> {
    return this.http.get<Article[]>(this.url('/article/following/categories'));
  }

  /**
   * Get one article for eache author that the user follows
   * @returns {Observable<Article[]>}
   */
  public getOneArticlesByEachFollowAuthor(): Observable<Article[]> {
    return this.http.get<Article[]>(this.url('/article/following/authors'));
  }

  /**
   * Toggles an article from LS article list
   * @param {Article} article
   * @returns {Promise<boolean>}
   */
  public async toggleArticleFromReadLater(article: Article) {

    // Get current article list, if none, creates an empty one
    let currentSavedArticleIdList = await this.localStorage.getItem('savedArticleIdList').toPromise();
    if (!currentSavedArticleIdList) {
      currentSavedArticleIdList = [];
      currentSavedArticleIdList.push(article._id);
      await this.localStorage.setItem('savedArticleIdList', currentSavedArticleIdList).toPromise();
      return true;
    }

    // If article is already on the list, remove it and save list, if not just save it and return
    if (currentSavedArticleIdList.includes(article._id)) {
      const articleIdIndex = currentSavedArticleIdList.indexOf(article._id);
      currentSavedArticleIdList.splice(articleIdIndex, 1);
      await this.localStorage.setItem('savedArticleIdList', currentSavedArticleIdList).toPromise();
      return false;
    } else {
      currentSavedArticleIdList.push(article._id);
      await this.localStorage.setItem('savedArticleIdList', currentSavedArticleIdList).toPromise();
      return true;
    }

  }

  /**
   * Check if an article is saved on read later list
   * @param {Article} article
   * @returns {Promise<boolean>}
   */
  public async isOnReadLaterList(article: Article) {
    const currentSavedArticleIdList = await this.localStorage.getItem('savedArticleIdList').toPromise();
    return currentSavedArticleIdList.indexOf(article._id) > -1;
  }

  /**
   * Returns the count of read later news from LS
   * @returns {Promise<any>}
   */
  public async getCountReadLaterArticles() {
    const articleIdList = await this.localStorage.getItem('savedArticleIdList').toPromise();
    if (!articleIdList) {
      return 0;
    }
    return articleIdList.length;
  }

  /**
   * Returns all articles marked as read later from LS and then from DB
   * @returns {Promise<any>}
   */
  public async getReadLaterArticles() {
    const articleIdList = await this.localStorage.getItem('savedArticleIdList').toPromise();

    if (articleIdList.length < 1) {
      return [];
    }

    const articleList = [];
    for (let i = 0; i < articleIdList.length; i++) {
      const article = await this.getArticleById(articleIdList[i]).toPromise();
      articleList.push(article);
    }
    return <Article[]>articleList;
  }

}
