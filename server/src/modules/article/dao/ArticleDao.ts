import {MongoArticle} from "./schema/MongoArticle";
import {Article} from "../domain/Article";

export class ArticleDao {
    addArticle = async (article: Article) => {
        const articleModel = new MongoArticle.model({
            handle: article.handle,
            pageId: article.pageId,
            title: article.title,
            raw: article.raw,
            cleanedHTML: article.cleanedHTML,
            links: article.links
        });
        const savedArticle = await articleModel.save();
        return MongoArticle.getArticle(savedArticle);
    }

    getArticleByHandle = async (handle: string) => {
        const article = await MongoArticle.model.findOne({handle: handle});
        if (article != null) {
            return MongoArticle.getArticle(article);
        }
    }
}