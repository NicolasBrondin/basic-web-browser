import {
  QMainWindow,
  QWidget,
  QLabel,
  FlexLayout,
  QPushButton,
  QLineEdit
} from '@nodegui/nodegui';
import { RequestHandler } from './RequestHandler';
import { HtmlParser } from './HtmlParser';
import { json } from 'stream/consumers';
import { HtmlRenderer } from './HtmlRenderer';

const requestHandler = new RequestHandler();
const htmlParser = new HtmlParser();

const win = new QMainWindow();
win.setWindowTitle("Basic Web Browser");
win.setFixedWidth(800);
win.setFixedHeight(600);

const centralWidget = new QWidget();
centralWidget.setObjectName("myroot");
const rootLayout = new FlexLayout();
centralWidget.setLayout(rootLayout);
const pageWidget = new QWidget();
pageWidget.setObjectName("mypage");
const pageLayout = new FlexLayout();
pageWidget.setLayout(pageLayout);
(pageWidget as any).xLayout = pageLayout;
const headerWidget = new QWidget();
headerWidget.setObjectName("myheader");
const headerLayout = new FlexLayout();
headerWidget.setLayout(headerLayout);
centralWidget.setStyleSheet(`
#myroot {
  
  flex: '1';
  height: '100%';
  width: '100%';
  align-items: 'stretch';
}
#myheader {
  flex-direction: 'row';
  
}
#mytextedit{
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


const htmlRenderer = new HtmlRenderer(pageWidget);

const button = new QPushButton();
button.setText("Go");

async function loadPage(url: string){
  const page = await requestHandler.requestUrl(url);
  //const test = "<html><head><title>Test</title></head><body><h1>Test</h1><p>Test</p></body></html>";
  const dom = htmlParser.parseHtmlDocumentFromText(page.content);
  const titleEl = dom.document.findNodeByName("title");
  if(titleEl){
    win.setWindowTitle(titleEl.value as string);
  }
  htmlRenderer.render(dom);
  /*if(h1){
    const label = new QLabel();
    label.setText(h1.value as string);
    pageLayout.addWidget(label);
  }*/

}

button.addEventListener('clicked', async () => {
  await loadPage(textEdit.text());
});

const textEdit = new QLineEdit();
textEdit.setObjectName("mytextedit");
textEdit.setText("http://info.cern.ch/hypertext/WWW/TheProject.html");

//headerLayout.addWidget(label);
rootLayout.addWidget(headerWidget);
rootLayout.addWidget(pageWidget);
headerLayout.addWidget(textEdit);
headerLayout.addWidget(button);
win.setCentralWidget(centralWidget);
win.setStyleSheet(
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
win.show();

(global as any).win = win;
