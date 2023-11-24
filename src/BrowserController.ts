
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
    pageWidget?: QScrollArea;
    urlInput = new QLineEdit();
    constructor(){
        
      
      this.win.setFixedWidth(800);
      this.win.setFixedHeight(600);
      
      this.centralWidget.setObjectName("myroot");
      this.centralWidget.setLayout(this.rootLayout);
      const headerWidget = new QWidget();
      headerWidget.setObjectName("myheader");
      const headerLayout = new FlexLayout();
      headerWidget.setLayout(headerLayout);

      this.centralWidget.setStyleSheet(`
      #myroot {
        
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
      #mypage{
        flex: '1';
        background-color: 'white';
      }
      `);
      /*const label = new QLabel();
      label.setObjectName("mylabel");
      label.setText("Enter a url");*/
      
      
      this.api = new BrowserApi(this);
      this.htmlRenderer = new HtmlRenderer(this.api);
      const button = new QPushButton();
      button.setText("Go");
      
      button.addEventListener('clicked', async () => {
        await this.api.loadPage(this.urlInput.text());
      });
      
      this.urlInput.setObjectName("myurlInput");
      
      //headerLayout.addWidget(label);
      this.rootLayout.addWidget(headerWidget);
      headerLayout.addWidget(this.urlInput);
      headerLayout.addWidget(button);
      this.win.setCentralWidget(this.centralWidget);
      this.win.setStyleSheet(
        `
          #myroot {
            height: '100%';
            align-items: 'center';
            justify-content: 'center';
          }
          #mylabel {
            font-size: 16px;
            font-weight: bold;
            padding: 1;
          }
        `
      );
      
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
      this.urlInput.setText("http://info.cern.ch/hypertext/WWW/TheProject.html");
      this.setBrowserTitle("Basic Web Browser");
    }
}
