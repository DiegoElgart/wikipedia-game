import fetch from "node-fetch";
import {Article} from "../../article/domain/Article";
import {JSDOM} from "jsdom";
import {Link} from "../../article/domain/Link";
import * as _ from "lodash";
import {Metrics} from "../../common/util/Metrics";
import {GameLanguage} from "../../game/domain/GameLanguage";

const meteredMethod = Metrics.meteredMethod;

export class WikipediaClient {


    async getByHandle(articleHandle: string) {
        // TODO implement different game languages
        const url = `https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${articleHandle}&prop=text`;

        const response = await fetch(url);
        const responseJson = await response.json();

        const pageId = responseJson.parse.pageid;
        const title = responseJson.parse.title;
        const raw = responseJson.parse.text["*"];

        // Remove unnecesary character from HTNL
        const cleanedHTML = await this.cleanHTML(raw);

        let article = new Article(undefined, articleHandle, pageId, title, raw, cleanedHTML, []);

        // Adjust links to point to our server. Remove links outside wikipedia. Remove sections
        // Will set final cleanedHMTL and list of links
        article = await this.fixLinksAndCleanUp(article);

        return article;
    }

    getFeatureArticleHandleByDate = async (date: Date) => {
        const year = date.getFullYear();
        const month = this.getMonth(date);
        const day = this.getDay(date);

        // TODO fix to work with different game languages
        // Spanish not returning tfa article
        // const url = `https://api.wikimedia.org/feed/v1/wikipedia/${gameLanguage}/featured/${year}/${month}/${day}`;
        const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${year}/${month}/${day}`;

        const response = await fetch(url);
        const responseJson = await response.json();


        const articleHandle = responseJson?.tfa?.title;
        if (!articleHandle) {
            throw new Error("Couldn't get feature article");
        }

        return articleHandle;
    }

    @meteredMethod()
    private cleanHTML(raw : string) {
        let cleanedHTML = raw;

        cleanedHTML = cleanedHTML.replace(new RegExp("\\n", "g"),"");
        cleanedHTML = cleanedHTML.replace(new RegExp("\\t", "g"),"");
        cleanedHTML = cleanedHTML.replace(new RegExp("\\\"", "g"),"\"");

        return cleanedHTML;
    }

    @meteredMethod()
    private async fixLinksAndCleanUp (article: Article) {
        // Generate DOM Elements from the text HTML
        const doc = new JSDOM(article.cleanedHTML);

        // Remove unnecessary sections
        const references = doc?.window?.document?.getElementsByClassName("reflist");
        for(let i = 0; i < references.length; i++) {
            references[i].parentElement.removeChild(references[i]);
        }

        
        // Get all document links
        const linkTags = doc?.window?.document?.querySelectorAll("a");

        const wikiApiPattern = new RegExp("^/wiki/");
        const internalPageRedirectLink = new RegExp("^about:blank#"); // href:"about:blank#section2" to href:"#section2"


        // split Links into WikiApi links and the rest
        const isLinkToWikiApi = _.groupBy(Array.from(linkTags), link => wikiApiPattern.test(link.href));

        let linksToAddToArticle :Link[] = [];
        // WikiApiLinks
        if (isLinkToWikiApi["true"]) {
            // Generate list of valid WikiApiLinks (the ones that will be added to the article)
            linksToAddToArticle = isLinkToWikiApi["true"].map((link, i) => new Link(i, link.href));
            // Modify links links to point to our server
            isLinkToWikiApi["true"].forEach((link, i) => link.href = `javascript:callServer(${i})`);
        }


        if (isLinkToWikiApi["false"]) {
            // split Links into internalPageRedirectLink (will be ignored) and Links to be removed
            const isInternalPageRedirectLink = _.groupBy(isLinkToWikiApi["false"], link => internalPageRedirectLink.test(link.href));
            if(isInternalPageRedirectLink["false"]) {
                isInternalPageRedirectLink["false"].forEach((link) => link.parentElement.removeChild(link));
            }
        }

        // Set links list to article
        article.links = linksToAddToArticle;

        // Generate final html
        article.cleanedHTML = doc.serialize();

        return article;
    }

    // If month is single digit, add a 0 at the beginning
    private getMonth = (date: Date) => {
        const month = date.getMonth() + 1;
        return ("0" + month).slice(-2);
    }

    // If day is single digit, add a 0 at the beginning
    private getDay = (date: Date) => {
        const day = date.getDate();
        return ("0" + day).slice(-2);
    }
}