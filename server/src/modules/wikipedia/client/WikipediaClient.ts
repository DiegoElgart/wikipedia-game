import fetch from "node-fetch";
import {Article} from "../../article/domain/Article";
import {JSDOM} from "jsdom";
import {Link} from "../../article/domain/Link";
import {contains} from "class-validator";


export class WikipediaClient {

    getFeatureArticle = async (date: Date) => {
        const year = date.getFullYear();
        const month = this.getFormattedDayAndMonth(date.getMonth() + 1);
        const day = this.getFormattedDayAndMonth(date.getDate());
        const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${year}/${month}/${day}`;
        const response = await fetch(url);
        const responseJson = await response.json();
        const articleHandle = responseJson?.tfa?.title;
        if (!articleHandle) {
            throw new Error("Couldn't get feature article");
        }

        return articleHandle;
    }

    getArticle = async (articleHandle: string) => {
        const url = `https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${articleHandle}&prop=text`;
        const response = await fetch(url);
        const responseJson = await response.json();
        const pageId = responseJson.parse.pageid;
        const title = responseJson.parse.title;
        const raw = responseJson.parse.text["*"];
        const article = new Article(undefined, articleHandle, pageId, title, raw, undefined, []);

        this.prepareHTML(article);

        return article;
    }

    private getFormattedDayAndMonth = (dayOrMonth: number) => {
        return ("0" + dayOrMonth).slice(-2);
    }

    private prepareHTML = (article : Article) => {
        article.cleanedHTML = this.cleanHTML(article.raw);

        this.adjustLinks(article);
    }

    private cleanHTML = (raw : string) => {
        let cleanedHTML = raw;

        cleanedHTML = cleanedHTML.replace(new RegExp("\\n", "g"),"");
        cleanedHTML = cleanedHTML.replace(new RegExp("\\t", "g"),"");
        cleanedHTML = cleanedHTML.replace(new RegExp("\\\"", "g"),"\"");

        return cleanedHTML;
    }

    private adjustLinks = (article: Article) => {
        const doc = new JSDOM(article.cleanedHTML);
        const linkTags = doc?.window?.document?.querySelectorAll("a");
        const links :Link[] = [];
        const linksToRemove :HTMLAnchorElement[] = [];

        // TODO define and implement how clicking links will work. They should call a function that executes the call with cookies and required values
        linkTags.forEach((link, i) => {
            let url = link.href;

            if (url.startsWith("//") || url.startsWith("/w/") || url.startsWith("/wiki/File:")) {
                console.log(url + ": // or /w/ or /wiki/File:");
                linksToRemove.push(link);
            } else if (url.startsWith("/wiki/")) {
                // TODO fix how the actualhost is gotten
                // url = "http://localhost:4000/game/next" + "?" + "handle=" + url.replace("/wiki/", "") + "&link=" + i;
                url = url.replace("/wiki/", "");
                // link.href = url;
                link.href = `javascript:callServer(${i}, 'connect.sid=s%3A178uGwpN6JQ4pEB254u_cbVholpurA0B.bGJaNxgr2bnRAgzwf1nKcSmpYOSjrXUNsNWzvqpdfjs; Path=/; HttpOnly')`;
                links.push(new Link(i, url));
            } else if(url.startsWith("about:blank#")) {
                url = url.replace("about:blank#","#");
                link.href = url;
            } else {
                console.log("unmatched: " + url);
                linksToRemove.push(link);
            }
        });

        article.links = links;
        linksToRemove.forEach(link => {
            link.parentElement.removeChild(link);
        });
        const script =  doc.window.document.createElement("script");
        script.type = "text/javascript";
        script.innerHTML =
            "document.cookie='connect.sid=s%3A178uGwpN6JQ4pEB254u_cbVholpurA0B.bGJaNxgr2bnRAgzwf1nKcSmpYOSjrXUNsNWzvqpdfjs; Path=/;';\n" +
            "async function callServer(id, cookie) {console.log(id); console.log(cookie); console.log('http://localhost:4000/game/next?id=' + id);\n" +
            "await fetch('http://localhost:4000/game/next?id=' + id, {\n" +
            "    credentials: 'include',\n" +
            "    method: 'POST',\n" +
            "    headers: {\n" +
            "      'Content-Type': 'application/json',\n" +
            "    },\n" +
            "    mode: 'no-cors'\n" +
            "  });" +
            "}";
        const head = doc.window.document.getElementsByTagName("head")[0];
        head.appendChild(script);
        article.cleanedHTML = doc.serialize();
    }
}