import { FlexLayout, QLabel, QLayout, QScrollArea, QWidget } from "@nodegui/nodegui";
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
        //const html = `<html><head><title>A very simple webpage</title></head><body> <ul><li style="font-size: 14px; color: red;">Hello World</li></ul> </body></html>`.replace(/\n|\r/gmi, "" );
        const html = page.content.replace(/\n|\r/gmi, "" );
        const dom = this.controller.htmlParser.parseHtmlDocumentFromText(html);
        console.log("[DEBUG] Raw : ", html);
        console.log("[DEBUG] Tree: ", dom.toString());
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

    getDocumentWidget(){
        //console.log("[DEBUG] Document: ", (this.controller.pageWidget?.children() as any));
        return (this.controller.pageWidget as any)?.xWidget as QWidget;
    }

    createNewPage(){
        console.log("[DEBUG] Page - Creating new page...");
        if(this.getDocumentWidget()){
            this.getDocumentWidget().delete();
            (this.controller.pageWidget as any).xWidget = undefined;
        }
        // Create document (page root child)
        const documentWidget = new QWidget();
        const documentLayout = new FlexLayout();
        documentWidget.setLayout(documentLayout);
        documentWidget.setObjectName("document");
        (documentWidget as any).childLayout = documentLayout; // Hack because .getLayout doesn't exist

        // (Re)Create page
        //this.controller.pageWidget = new QScrollArea(documentWidget);
        //this.controller.pageWidget.setObjectName("page");
        //this.controller.rootLayout.addWidget(this.controller.pageWidget);
        
        //this.controller.pageWidget.setWidgetResizable(true);
        //this.controller.pageWidget.setScro
        this.controller.pageWidget.setWidget(documentWidget);
        (this.controller.pageWidget as any).xWidget = documentWidget;
        
        
        /*const pageLayout = new FlexLayout();
        pageLayout.addWidget(documentWidget);
        (this.controller.pageWidget as any).xLayout = documentWidget;
        (this.controller.pageWidget as any).setLayout(pageLayout);*/
        /*const q = new QLabel();
        q.setText("test");
        documentLayout.addWidget(q);*/

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