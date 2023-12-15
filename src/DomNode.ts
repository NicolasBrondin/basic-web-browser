import { FlexLayout, ImageConversionFlag, QImage, QImageFormat, QLabel, QPixmap, QWidget, WidgetEventTypes } from "@nodegui/nodegui";
import { HTMLElement, Node, TextNode } from "node-html-parser";
import BrowserApi from "./BrowserApi";

export class DomNode {
    
    element: Node;

    constructor(el: Node){
        this.element = el;
    }
    addChildNode(node: DomNode) {
        this.element.childNodes.push(node.element);
    }

    getTagName(){
        return (this.element as HTMLElement).tagName?.toLowerCase();
    }

    getAttribute(key: string){
        const keys = Object.keys((this.element as HTMLElement).attributes || {});
        const found = keys.find((k)=> k.toLowerCase() === key.toLowerCase());
        if(!found){
            return null;
        }
        return (this.element as HTMLElement).attributes[found];
    }
    
    findNodeByName(name: string) : DomNode | undefined {
        for (const child of this.element.childNodes) {
            const domNode = new DomNode(child as HTMLElement);
            if(domNode.getTagName() == name){
                return domNode;
            }
        }
        for (const child of this.element.childNodes)
        {
            const domNode = new DomNode(child as HTMLElement);
            const el = domNode.findNodeByName(name);
            
            if(el){
                return el;
            }
        }
    }

    render(browserApi: BrowserApi): QWidget{
        //console.log("[NODE] "+this.getTagName());

        /* Create Widget */
        const widget = new QWidget();
        widget.setObjectName("debug");
        const layout = new FlexLayout();
        widget.setInlineStyle("flex-direction: row;");
        
        widget.setLayout(layout);

        if(this.element instanceof TextNode){
            const label = new QLabel();
            label.setText(this.element.textContent);
            layout.addWidget(label);
            return widget;
        }

        let pseudoBefore = new QWidget();
        const pseudoAfter = new QWidget();
        pseudoBefore.setObjectName("before");
        pseudoAfter.setObjectName("after");
        

        
        let childWidget : QWidget|QLabel = new QWidget();
        const childLayout = new FlexLayout();
        if(this.getTagName() === "a"){

            childWidget.setObjectName("a");
            childWidget.setStyleSheet(`#a * {
                color: blue;
                text-decoration: underline;
            }`);
            
            childWidget.addEventListener(WidgetEventTypes.MouseButtonRelease, () => {
               console.log("[DEBUG] LINK CLICKED");
               console.log((this.element as HTMLElement).attributes);
               const url = this.getAttribute("href") || "";
               browserApi.loadPage(url);
            });
        } else if(this.getTagName() === "li"){
            if(this.element.parentNode.tagName.toLowerCase() === "ul"){
                pseudoBefore.setStyleSheet(`
                    width: 6px;
                    height: 6px;
                    background-color: #000000;
                    border-radius: 3px;
                `);
                pseudoBefore.resize(5,5);
            } else {
                pseudoBefore = new QLabel();
                (pseudoBefore as QLabel).setText("1.");
            }

        } else if(this.getTagName() === "hr"){

            childWidget.setObjectName("hr");
            childWidget.setInlineStyle(`
                border-bottom-color: grey;
                border-bottom-width: 1px;
                border-bottom-style: solid;
                flex: 1;
            `);
            //childWidget.setFixedHeight(10);
            widget.setFixedHeight(1);
            
        } else if(this.getTagName() === "img"){
            childWidget = new QLabel();
            browserApi.loadImage(this.getAttribute("src") as string, (buffer: Buffer)=>{
                
                childWidget.setObjectName("image");
                const qImage = new QImage();
                qImage.loadFromData(buffer);
                const pixelMap = QPixmap.fromImage(qImage, ImageConversionFlag.AutoColor);
                widget.setObjectName("debug");
                (childWidget as QLabel).setPixmap(pixelMap);

                
                childWidget.setInlineStyle("height: 50px;");
                childWidget.setFixedHeight(50);
                widget.setFixedHeight(50);
                
                //childWidget.setFixedSize(pixelMap.width(), pixelMap.height()); //[To-Do] : Not working
                //widget.setFixedSize(pixelMap.width(), pixelMap.height()); //[To-Do] : Not working
                //browserApi.getDocumentWidget().adjustSize();
                
                
                /*console.log("[DEBUG] Label", imageWidget.width(), imageWidget.height());
                console.log("[DEBUG] QImage", qImage.width(), qImage.height());
                console.log("[DEBUG] QPixmap", pixelMap.width(), pixelMap.height());*/
                //childWidget.resize(pixelMap.width(), pixelMap.height());
            });
            
            /*request({ method: "GET", uri: this.getAttribute("src") as string }, function (error:any, response:any, body) {


                
                if (!error && response.statusCode == 200) {
                    //const data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
                    console.log("[IMAGE] Loaded" + body);
                    
                    
                } else {
                    console.error(response?.statusCode, error, response);
                }
            });*/
            
        }
        

        layout.addWidget(pseudoBefore);
        layout.addWidget(childWidget);
        try {
            childWidget.setLayout(childLayout);
            //childWidget.setStyleSheet("flex-direction: 'column';");
        } catch(e){
            console.warn(e);
        }
        (widget as any).childLayout = childLayout;

        /*widget.setStyleSheet(``);*/
        /*if(this.attributes.style.display == "none"){
            widget.hide();
        }
        if(this.attributes.style.height){
            // Doesn't work, still taking space
            widget.setFixedHeight(parseInt(this.attributes.style.height, 10));
        }*/
        
        layout.addWidget(pseudoAfter);
        return widget;
    }
}