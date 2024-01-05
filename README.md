# basic-web-browser

**A basic implementation of a web browser built from scratch, for education purpose**

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer.

Make sure you have met the requirements listed here: https://docs.nodegui.org/docs/guides/getting-started#developer-environment

From your command line:

```bash
# Clone this repository
git clone https://github.com/NicolasBrondin/basic-web-browser
# Go into the repository
cd basic-web-browser
# Install dependencies
npm install
# Run the app
npm start
```

## Roadmap

- [x] Display a window
- [x] Send an http request
- [x] Parse and display web page title
- [x] Make HtmlParser case insensitive
- [x] Make HtmlParser to parse siblings
- [x] Start rendering elements on the page
- [x] Parse single elements
- [x] Make links clickable
- [x] Previous button
- [x] Handle https
- [x] Display images
- [ ] Handle 301 redirects
- [x] Fix page scroll
- [ ] Handle .. and . in urls
- [ ] Display images in the right size (and update viewport)
- [ ] Add tabs
- [x] Add pseudo-elements ::before and ::after
- [x] Render hr
- [x] Render ul
- [x] Render ol
- [x] Hide header
- [x] Hide script/style
- [x] Render nested lists
- [x] Make the <li> for <ol> index dynamic

## License

MIT

## Drafts


-- Widget -------------------------------------------
| [ ::before , ChildWidget , ::after ](WidgetLayout) |
-----------------------------------------------------

vv inside vv

-- ChildWidget -----------
| [<Empty>](ChildLayout) |
--------------------------

Widget has a direct reference to ChildLayout