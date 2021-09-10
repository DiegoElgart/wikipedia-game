import {WikipediaClient} from "../../wikipedia/client/WikipediaClient";
import {ArticleDao} from "../dao/ArticleDao";

export class ArticleService {
    wikipediaClient: WikipediaClient;
    articleDao : ArticleDao;

    constructor() {
        this.wikipediaClient = new WikipediaClient();
        this.articleDao = new ArticleDao();
    }

    getTodaysFeatureArticle = async () => {
        const featureArticleHandle = await this.getFeatureArticle(new Date());

        return this.getArticleByHandle(featureArticleHandle);
    }

    getFeatureArticle = async (date: Date) => {
        return await this.wikipediaClient.getFeatureArticle(date);
    }

    getArticleByHandle = async (handle : string) => {
        let article = await this.articleDao.getArticleByHandle(handle);
        if (!article) {
            article = await this.wikipediaClient.getArticle(handle);
            article = await this.articleDao.addArticle(article);
        }
        return article;
    }

}