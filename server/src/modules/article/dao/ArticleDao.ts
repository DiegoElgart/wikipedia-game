import {MongoArticle} from "./schema/MongoArticle";
import {Article} from "../domain/Article";
import {Metrics} from "../../common/util/Metrics";
import * as zlib from "zlib";
import {Link} from "../domain/Link";

const meteredMethod = Metrics.meteredMethod;


export class ArticleDao {

    @meteredMethod()
    async add(article: Article) {
        const zippedHTML = await zlib.gzipSync(article.cleanedHTML);
        const articleModel = new MongoArticle.model({
            handle: article.handle,
            pageId: article.pageId,
            title: article.title,
            compressedHTML: zippedHTML,
            links: article.links
        });
        const savedArticle = await articleModel.save();
        return MongoArticle.getArticle(savedArticle);
    }

    @meteredMethod()
    async getCount() {
        return MongoArticle.model.count()
            .exec();
    }

    @meteredMethod()
    async getByPosition(position: number) {
        const article = await MongoArticle.model.findOne()
            .skip(position);
        return MongoArticle.getArticle(article);
    }

    @meteredMethod()
    async getByHandle(handle: string) {
        const article = await MongoArticle.model.findOne(
            {
                handle: handle
            })
            .select("-cleanedHTML -links");
        if (article != null) {
            return MongoArticle.getArticle(article);
        }
    }

    @meteredMethod()
    async getCleanedHtml(id: string) {
        const articleDocument = await MongoArticle.model.findById(id)
            .select("compressedHTML")
            .exec();
        const article = await MongoArticle.getArticle(articleDocument);
        return article.cleanedHTML;
    }

    @meteredMethod()
    async getLinkByPosition(articleId: string, linkNumber: number) {
        const articleDocument = await MongoArticle.model.findOne(
            {
                _id: articleId
            })
            .slice("links", [+linkNumber, 1])
            .select("-compressedHTML")
            .exec();
        const article = await MongoArticle.getArticle(articleDocument);
        return <Link> article.links[0];
    }
}