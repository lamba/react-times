"use strict";

var articlesData,
    Times = React.createClass({
  displayName: "Times",


  propTypes: {
    pageTitle: React.PropTypes.string.isRequired,
    articles: React.PropTypes.object
  },

  getDefaultProps: function getDefaultProps() {
    var articles = { title: "Title1", body: "Body1", byline: "By Puneet Lamba", datetime: "8:50 AM ET" };
    return {
      pageTitle: "Top Stories",
      articles: null
    };
  },

  render: function render() {
    var i = 0;
    if (this.state.articles !== null) {
      return (
        //React.DOM.x is a convenience wrapper for React.createElement('x', ...)
        React.DOM.div(null, this._renderHeader(), this._renderHeaderNav(), this._renderPageTitle(), this._renderArticleTopSection(), this.state.articles.response.docs.map(this._renderArticlePromoFullWidth), this._renderPagination(), this._renderFooter())
      );
    } else {
      return null;
    }
  },

  getInitialState: function getInitialState() {
    return {
      pageTitle: this.props.pageTitle,
      articles: this.props.articles,
      page: 1
    };
  },

  componentDidMount: function componentDidMount() {
    this._fetch();
  },


  _fetch: function _fetch() {
    console.log("page=" + this.state.page);
    var self = this,
        url = '',
        queryString = '';
    url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
    queryString = '?' + 'api-key=933ec882c25c40c388ba892e07e4204c' + '&' + 'begin_date=20170622' + '&' + 'page=' + self.state.page;
    fetch(url + queryString).then(function (response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }
      // Examine the text in the response  
      response.json().then(function (data) {
        console.log(data);
        self.setState({ articles: self._processArticles(data) });
      });
    }).catch(function (err) {
      console.log('Fetch Error :-S', err);
    });
  },

  _next: function _next() {
    this.setState({ page: this.state.page + 1 }, this._fetch);
    //this._fetch();
  },

  _nextArrow: function _nextArrow() {
    var self = undefined;
    self.setState({ page: self.state.page + 1 }, function () {
      console.log("page=" + self.state.page);
    });
  },

  _processArticles: function _processArticles(data) {
    var articles = data;
    articles.topSectionIndex = 0;
    for (var i = 0; i < articles.response.docs.length; i++) {
      var article = articles.response.docs[i];
      var date = new Date(article.pub_date);
      var time = date.getHours() % 12 + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
      var am_pm = date.getHours() > 12 ? "PM" : "AM";
      var date_time = time + ' ' + am_pm + ' ET';
      var url = article.multimedia.length > 0 ? "https://nytimes.com/" + article.multimedia[0].url : "nyt.png";
      articles.response.docs[i].title = article.headline.main;
      articles.response.docs[i].body = article.lead_paragraph.substring(0, 320);
      articles.response.docs[i].bline = article.byline.original;
      articles.response.docs[i].date_time = date_time;
      articles.response.docs[i].url = url;
      articles.response.docs[i].key = article._id;
      if (url !== "nyt.png") {
        articles.topSectionIndex = i;
      };
    };
    return articles;
  },

  _somethingChanged: function _somethingChanged() {
    console.log("_somethingChanged");
    this.setState({
      pageTitle: "_somethingChanged"
    });
  },

  _backToNormal: function _backToNormal() {
    this.setState({
      pageTitle: "Top Stories"
    });
  },

  _renderHeader: function _renderHeader() {
    return React.DOM.div({ className: "header" }, React.DOM.p({ className: "header-text", key: "header-text" }, "THE TIMES"), React.DOM.input({ className: "search", key: "search", placeholder: "Search" }));
  },

  _renderHeaderNav: function _renderHeaderNav() {
    return React.DOM.ul({ className: "header-nav" }, React.DOM.li({ className: "header-nav-item", key: "home",
      onClick: this._backToNormal }, "Home"), React.DOM.li({ className: "header-nav-item", key: "world" }, "World"), React.DOM.li({ className: "header-nav-item", key: "us" }, "U.S."), React.DOM.li({ className: "header-nav-item", key: "poliics" }, "Politics"), React.DOM.li({ className: "header-nav-item", key: "ny" }, "N.Y."), React.DOM.li({ className: "header-nav-item", key: "more",
      onClick: this._somethingChanged }, "More"));
  },

  //enable jsx later maybe - it's harder to debug when babel changes the line numbers in the generated js
  // _renderPageTitle: function() {
  //   return (
  //     <div key="">
  //       <h2 className="page-title" key="page-title">
  //       </h2>
  //     </div>
  //   )
  // },

  _renderPageTitle: function _renderPageTitle() {
    return React.DOM.div({ className: "" }, React.DOM.h2({ className: "page-title", key: "page-title" }, this.state.pageTitle));
  },

  _renderArticleTopSection: function _renderArticleTopSection() {
    return React.DOM.div({ className: "article-top-section" }, this._renderArticlePromo23Width(this.state.articles.topSectionIndex), this._renderArticlePromo13(1), this._renderArticlePromo13(2));
  },

  _renderArticlePromo23Width: function _renderArticlePromo23Width(i) {
    return React.DOM.div({ className: "" }, React.DOM.div({ className: "article-promo-23-width", key: "article-promo-23-width" }, this._renderArticlePromo23WidthTop(i), this._renderArticlePromo23WidthBody(i)));
  },

  _renderArticlePromo23WidthTop: function _renderArticlePromo23WidthTop(i) {
    return React.DOM.div({ className: "article-promo-23-width-top" }, this._renderArticlePromo23WidthDetail(this.state.articles.response.docs[i].title, this.state.articles.response.docs[i].bline, this.state.articles.response.docs[i].date_time), this._renderImageSmall(this.state.articles.response.docs[i].url));
  },

  _renderArticlePromo23WidthDetail: function _renderArticlePromo23WidthDetail(title, byline, dateTime) {
    return React.DOM.div({ className: "article-promo-23-width-detail" }, this._renderArticlePromo23Title(title), this._renderArticlePromo23Byline(byline), this._renderArticlePromo23DateTime(dateTime));
  },

  _renderArticlePromo23WidthBody: function _renderArticlePromo23WidthBody(i) {
    return React.DOM.div({ className: "article-promo-23-body", key: "article-promo-23-body" }, this.state.articles.response.docs[i].body);
  },

  _renderArticlePromo13: function _renderArticlePromo13(i) {
    return React.DOM.div({ className: "article-promo-13", id: "a" }, this._renderArticlePromo13Title(this.state.articles.response.docs[i].title), this._renderArticlePromo13Byline(this.state.articles.response.docs[i].bline), this._renderArticlePromo13DateTime(this.state.articles.response.docs[i].date_time));
  },

  _renderArticlePromoFullWidth: function _renderArticlePromoFullWidth(article) {
    return React.DOM.div({ className: "" }, React.DOM.div({ className: "article-promo-full-width", key: article._id }, this._renderImageLarge(article.url), this._renderArticlePromoFullWidthDetail(article.title, article.body, article.bline, article.date_time)));
  },

  _renderArticlePromoFullWidthDetail: function _renderArticlePromoFullWidthDetail(title, body, byline, dateTime) {
    return React.DOM.div({ className: "article-promo-full-width-detail" }, this._renderTitle(title), this._renderBody(body), this._renderByline(byline), this._renderDateTime(dateTime));
  },

  _renderTitle: function _renderTitle(title) {
    return React.DOM.p({ className: "article-promo-title", key: title }, title);
  },

  _renderBody: function _renderBody(body) {
    return React.DOM.p({ className: "article-promo-body", key: body }, body);
  },

  _renderByline: function _renderByline(byline) {
    return React.DOM.p({ className: "byline", key: byline }, byline);
  },

  _renderDateTime: function _renderDateTime(dateTime) {
    return React.DOM.p({ className: "date-time", key: dateTime }, dateTime);
  },

  _renderArticlePromo23Byline: function _renderArticlePromo23Byline(byline) {
    return React.DOM.div({ className: "article-promo-23-byline", key: byline }, byline);
  },

  _renderArticlePromo23DateTime: function _renderArticlePromo23DateTime(dateTime) {
    return React.DOM.div({ className: "article-promo-23-date-time", key: dateTime }, dateTime);
  },

  _renderArticlePromo23Title: function _renderArticlePromo23Title(title) {
    return React.DOM.p({ className: "article-promo-23-title", key: title }, title);
  },

  _renderArticlePromo13Title: function _renderArticlePromo13Title(title) {
    return React.DOM.p({ className: "article-promo-13-title", key: title }, title);
  },

  _renderArticlePromo13Byline: function _renderArticlePromo13Byline(byline) {
    return React.DOM.p({ className: "article-promo-13-byline", key: byline }, byline);
  },

  _renderArticlePromo13DateTime: function _renderArticlePromo13DateTime(dateTime) {
    return React.DOM.p({ className: "article-promo-13-date-time", key: dateTime }, dateTime);
  },

  _renderImageLarge: function _renderImageLarge(url) {
    return React.DOM.div({ className: "image-large", key: url }, React.DOM.img({ src: url, className: "img-lg", key: url }));
  },

  _renderImageSmall: function _renderImageSmall(url) {
    return React.DOM.div({ className: "image-small", key: url }, React.DOM.img({ src: url, className: "img-sm", key: url }));
  },

  //jsx version for troubleshooting  
  // _renderPaginationJsx: function() {
  //   return (
  //     <div>
  //       <button className="next" type="Button" onClick={this._somethingChanged}>Next</button>
  //     </div>
  //   );
  // },

  _renderPagination: function _renderPagination() {
    return React.DOM.div({ className: "pagination" }, React.DOM.button({ className: "next", onClick: this._previous }, "Previous"), React.DOM.button({ className: "next", onClick: this._next }, "Next"));
  },

  _renderFooter: function _renderFooter() {
    return React.DOM.div({ className: "footer", key: "footer" }, "");
  }

});

var Ex = ReactDOM.render(React.createElement(Times), document.getElementById("app"));