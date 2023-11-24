import { FlexLayout, QScrollArea } from "@nodegui/nodegui";
import BrowserController from "./BrowserController";

export default class BrowserApi{

    private controller: BrowserController;

    constructor(controller: BrowserController){
        this.controller = controller;
    }
    async loadPage(url: string){
        const page = await this.controller.requestHandler.requestUrl(url);
        this.controller.setUrl(page.url);
        //const test = "<html><head><title>Test</title></head><body><h1>Test</h1><p>Test</p></body></html>";
        const dom = this.controller.htmlParser.parseHtmlDocumentFromText(page.content);
        if(!dom.document) return;
        const titleEl = dom.document.findNodeByName("title");
        console.log("[TITLE] ", titleEl);
        if(titleEl){
            this.controller.setBrowserTitle(titleEl.element.text as string);
        }
        this.controller.htmlRenderer.render(dom);
      
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
}