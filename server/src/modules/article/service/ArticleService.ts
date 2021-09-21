import {WikipediaClient} from "../../wikipedia/client/WikipediaClient";
import {ArticleDao} from "../dao/ArticleDao";
import {Article} from "../domain/Article";

export class ArticleService {
    wikipediaClient: WikipediaClient;
    articleDao : ArticleDao;

    constructor() {
        this.wikipediaClient = new WikipediaClient();
        this.articleDao = new ArticleDao();
    }


    async getArticleByHandle(handle : string) {
        // First look in the db if there, go to wikipedia.
        let article = await this.articleDao.getByHandle(handle);

        if (!article) {
            article = await this.wikipediaClient.getByHandle(handle);
            article = await this.articleDao.add(article);
        }

        return article;
    }

    async getCleanedHTML(article: Article) {
        let cleanedHTML = article.cleanedHTML;

        if (!cleanedHTML) {
            cleanedHTML = await this.articleDao.getCleanedHtml(article.id);
        }

        return cleanedHTML;
    }

    async getLink(article : Article, linkNumber: number) {
        return await this.articleDao.getLinkByPosition(article.id, linkNumber);
    }

    async getTodaysFeatureArticle() {
        const featureArticleHandle = await this.getFeatureArticleHandleByDate(new Date());

        return this.getArticleByHandle(featureArticleHandle);
    }

    async getRandomArticleFromDownloaded() {
        const articlesCount = await this.articleDao.getCount();

        const randomArticlePosition = Math.floor(Math.random() * articlesCount);

        return this.articleDao.getByPosition(randomArticlePosition);
    }

    async getEasyArticle() {
        const easyArticles = ["Canada", "Israel", "Mexico", "Argentina", "Lebanon", "Brazil", "Holland"];

        const randomArrayPosition = Math.floor(Math.random() * easyArticles.length);

        return this.getArticleByHandle(easyArticles[randomArrayPosition]);
    }

    private async getFeatureArticleHandleByDate(date: Date) {
        return await this.wikipediaClient.getFeatureArticleHandleByDate(date);
    }
}