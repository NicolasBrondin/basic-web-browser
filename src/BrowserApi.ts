import { FlexLayout, QScrollArea } from "@nodegui/nodegui";
import BrowserController from "./BrowserController";
import r from 'request';
const request = r.defaults({ encoding: null });

export default class BrowserApi{

    private controller: BrowserController;

    constructor(controller: BrowserController){
        this.controller = controller;
    }
    async loadPage(url: string){
        const page = await this.controller.requestHandler.requestUrl(url);
        this.controller.setUrl(page.url);
        this.controller.requestHandler.getHistory().push(page.url);
        //const test = "<html><head><title>Test Title</title></head><body><h1>Test h1</h1><p>Test paragraph</p><img src=\"https://histoireparlesfemmes.files.wordpress.com/2013/02/ada-lovelace.jpg\"/></body></html>";
        //const dom = this.controller.htmlParser.parseHtmlDocumentFromText(test);
        const dom = this.controller.htmlParser.parseHtmlDocumentFromText(page.content.replace(/\n|\r/gmi, "" ));
        //console.log(dom.toString());
        if(!dom.document) return;
        const titleEl = dom.document.findNodeByName("title");
        //console.log("[TITLE] ", titleEl);
        if(titleEl){
            this.controller.setBrowserTitle(titleEl.element.text as string);
        }
        this.controller.htmlRenderer.render(dom);
      
    }

    async loadPreviousPage(){
        const history = this.controller.requestHandler.getHistory();
        if(history.length > 1){
            history.pop();
            const previousPage = history.pop();
            this.loadPage(previousPage as string);
        }
    }

    getPageWidget(){
        return this.controller.pageWidget;
    }

    createNewPage(){
        if(this.controller.pageWidget){
            this.controller.pageWidget.delete();
            this.controller.pageWidget = undefined;
        }
      this.controller.pageWidget = new QScrollArea();
      this.controller.pageWidget.setObjectName("mypage");
      const pageLayout = new FlexLayout();
      this.controller.pageWidget.setLayout(pageLayout);
      (this.controller.pageWidget as any).xLayout = pageLayout;
      
      this.controller.rootLayout.addWidget(this.controller.pageWidget);
    }

    loadImage(url: string, cb: any){
        const absoluteUrl = this.controller.requestHandler.parseAbsoluteUrl(url);
        
        console.log("[IMAGE] Loading:" + absoluteUrl);
        request({ method: "GET", uri: absoluteUrl, headers: {"Content-Type": "image/jpeg"} }, function (error:any, response:any, body) {

            if (!error && response.statusCode == 200) {
                //const data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
                //console.log("[IMAGE] Loaded" + body);
                cb(Buffer.from(body));
            } else {
                console.error(response?.statusCode, error, response);
            }
        });
    }
}