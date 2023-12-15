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
        const html = `<html><head><title>A very simple webpage</title></head><body bgcolor=FFFFFF><h1>A very simple webpage. This is an "h1" level header.</h1><h2>This is a level h2 header.</h2><h6>This is a level h6 header.  Pretty small!</h6><p>This is a standard paragraph.</p><p align=center>Now I've aligned it in the center of the screen.</p><p align=right>Now aligned to the right</p><p><b>Bold text</b></p><p><strong>Strongly emphasized text</strong>  Can you tell the difference vs. bold?</p><p><i>Italics</i></p><p><em>Emphasized text</em>  Just like Italics!</p><p>Here is a pretty picture: <img src=example/prettypicture.jpg alt="Pretty Picture"></p><p>Same thing, aligned differently to the paragraph: <img align=top src=example/prettypicture.jpg alt="Pretty Picture"></p><hr><h2>How about a nice ordered list!</h2><ol><li>This little piggy went to market<li>This little piggy went to SB228 class<li>This little piggy went to an expensive restaurant in Downtown Palo Alto<li>This little piggy ate too much at Indian Buffet.<li>This little piggy got lost</ol><h2>Unordered list</h2><ul><li>First element<li>Second element<li>Third element</ul><hr><h2>Nested Lists!</h2><ul><li>Things to to today:<ol><li>Walk the dog<li>Feed the cat<li>Mow the lawn</ol><li>Things to do tomorrow:<ol><li>Lunch with mom<li>Feed the hamster<li>Clean kitchen</ol></ul><p>And finally, how about some <a href=http://www.yahoo.com/>Links?</a></p><p>Or let's just link to <a href=../../index.html>another page on this server</a></p><p>Remember, you can view the HTMl code from this or any other page by using the "View Page Source" command of your browser.</p></body></html>`.replace(/\n|\r/gmi, "" );
        //const html = page.content.replace(/\n|\r/gmi, "" );
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