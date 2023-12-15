
import {
    QMainWindow,
    QWidget,
    FlexLayout,
    QPushButton,
    QLineEdit,
    QScrollArea
  } from '@nodegui/nodegui';
  import { RequestHandler } from './RequestHandler';
  import { HtmlParser } from './HtmlParser';
  import { HtmlRenderer } from './HtmlRenderer';
import BrowserApi from './BrowserApi';
  

export default class BrowserController {
    win = new QMainWindow();
    requestHandler = new RequestHandler();
    htmlParser = new HtmlParser();
    htmlRenderer: HtmlRenderer;
    api: BrowserApi;

    centralWidget = new QWidget();
    rootLayout = new FlexLayout();
    pageWidget = new QScrollArea();
    urlInput = new QLineEdit();
    previousButton = new QPushButton();
    constructor(){
        
      
      this.win.setMinimumWidth(600);
      this.win.setMinimumHeight(400);

      setTimeout(()=>{
        this.win.setMinimumWidth(0);
        this.win.setMinimumHeight(0);
      }, 1000);
      
      this.centralWidget.setObjectName("myroot");
      this.centralWidget.setLayout(this.rootLayout);
      const headerWidget = new QWidget();

      headerWidget.setObjectName("myheader");
      const headerLayout = new FlexLayout();
      headerWidget.setLayout(headerLayout);

      this.pageWidget.setObjectName("page");

      /*const label = new QLabel();
      label.setObjectName("mylabel");
      label.setText("Enter a url");*/
      
      
      this.api = new BrowserApi(this);
      this.htmlRenderer = new HtmlRenderer(this.api);
      this.previousButton.setText("<");
      this.previousButton.addEventListener('clicked', async () => {
        await this.api.loadPreviousPage();
      });
      const button = new QPushButton();
      button.setText("Go");
      
      button.addEventListener('clicked', async () => {
        await this.api.loadPage(this.urlInput.text());
      });
      
      this.urlInput.setObjectName("myurlInput");
      
      //headerLayout.addWidget(label);
      this.rootLayout.addWidget(headerWidget);
      this.rootLayout.addWidget(this.pageWidget)
      headerLayout.addWidget(this.previousButton);
      headerLayout.addWidget(this.urlInput);
      headerLayout.addWidget(button);
      this.win.setCentralWidget(this.centralWidget);
      this.win.setStyleSheet(`
        #myroot {
          height: '100%';
          align-items: 'center';
          justify-content: 'center';
          flex: '1';
          height: '100%';
          width: '100%';
          align-items: 'stretch';
        }

        #myheader {
          flex-direction: 'row';
          
        }
        #myurlInput{
          flex: '1';
        }

        #page{
          background-color: 'white';
          border-color: red;
          border-width: 2px;
          border-style: solid;
          flex: '1';
          width: '100%';
        }
        
        #document{
          background-color: 'white';
          /*border-color: blue;
          border-width: 2px;
          border-style: solid;*/
        }

        #mylabel {
          font-size: 16px;
          font-weight: bold;
          padding: 1;
        }
        #image {
          /*border: 1px solid yellow;*/
        }
        #widget {
          /*border: 1px solid grey;*/
        }
        #debug {
          border: 1px solid red;
        }
      `);
      
    }

    setUrl(title: string){
      this.urlInput.setText(title);
    }

    setBrowserTitle(title: string){
      this.win.setWindowTitle(title);
    }
  
    start(){
      this.win.show();
      (global as any).win = this.win;
      //this.urlInput.setText("http://info.cern.ch/hypertext/WWW/TheProject.html");
      this.urlInput.setText("https://web.ics.purdue.edu/~gchopra/class/public/pages/webdesign/05_simple.html");
      this.setBrowserTitle("Basic Web Browser");
      this.api.createNewPage(); //blank
    }
}
