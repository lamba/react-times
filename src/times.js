var 
  articlesData,
  Times = React.createClass({

  propTypes: {
    pageTitle: React.PropTypes.string.isRequired,
    articles: React.PropTypes.object,
  },
  
  getDefaultProps: function() {
    return {
      pageTitle: "Top Stories",
      articles: null,
    };
  },
  
  render: function() {
    var i = 0;
    if (this.state.articles !== null) {
      return (
          //React.DOM.x is a convenience wrapper for React.createElement('x', ...)
          React.DOM.div(null, 
            this._renderHeader(),
            this._renderHeaderNav(),
            this._renderMessage(),
            this._renderPageTitle(),
            this._renderArticleTopSection(),
            this.state.articles.response.docs.map(this._renderArticlePromoFullWidth),
            this._renderPagination(),
            this._renderFooter()
          )
      )            
    } else {
      return null
    }
  },
  
  getInitialState: function() {
    return {
      pageTitle: this.props.pageTitle,
      articles: null,
      page: 1,
      enablePrevious: false,
      enableNext: true,
      fq: null,
      activeMenu: 'Home',
      q: null,
      message: '',
      error: false,
    };
  },

  componentDidMount() {
    this._fetch();
  },

  _fetch: function() {
    window.scrollTo(0, 0);
    if (this.state.page > 1) {
      this.setState({enablePrevious:true});
    } else {
      this.setState({enablePrevious:false});
    };
    var 
      self = this,
      url = '',
      date = new Date(),
      mm,
      dd,
      yyyy,
      queryString = '';
    //looks like the date is being set back a few days to fetch enough results to make search useful
    //but need to change logic so that default articles displayed are the latest ones
    date.setDate(date.getDate() - 0); 
    yyyy = '' + date.getFullYear();
    mm = date.getMonth()+1;
    if (mm < 10) {mm = '0' + mm};
    dd = date.getDate();
    if (dd < 10) {dd = '0' + dd};
    date = yyyy + mm + dd;
    url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
    queryString = '?'
//      + 'api-key=933ec882c25c40c388ba892e07e4204c' 
      + 'api-key=BsCTvz25ZwQn0jJXTl9JjWu3DWQKKiHH' //updated march 2020
      + '&'
      + 'begin_date=' + date
      + '&'
      + 'page=' + self.state.page;
    if (self.state.fq !== null) {
      queryString = queryString
      + '&'
      + 'fq=section_name:("' + self.state.fq + '")';
    };
    if (self.state.q !== null) {
      queryString = queryString
      + '&'
      + 'q=' + self.state.q;
    };
    fetch(url + queryString)
      .then(  
        function(response) {  
          if (response.status !== 200) {  
            console.log('Looks like there was a problem. Status Code: ' +  response.status);  
            return;  
          }
          // Examine the text in the response  
          response.json().then(function(data) {  
            console.log(data);  
            //self.setState({articles: self._processArticles(data)});
            if (data.response.docs.length === 0) {
              //if no results due to typo in search string etc, reset to initial state
              if (self.state.q !== null) {
                self.setState({
                  message: 'No search results found for: ' + self.state.q,
                  error: true,
                  enableNext: false,
                });                
              } else {
                self.setState({
                  message: 'No more results found.',
                  enableNext: false,
                });
              }
            } else {
              self.setState({
                articles: self._processArticles(data),
                message: (self.state.q !== null ? 'Search results for: ' + self.state.q : '')
              });
            };
          });  
        }  
      )  
      .catch(function(err) {  
        console.log('Fetch Error :-S', err);  
        self.setState({articles: null});
      });
  },

  _next: function() {
    this.setState({
      page: this.state.page + 1
    }, this._fetch);
  },

  _previous: function() {
    this.setState({
      page: this.state.page - 1,
      enableNext: true,
      error: false,
    }, this._fetch);
  },

  _processArticles: function(data) {
    const articles = data;
    articles.topSectionIndex = 0;
    for (var i = 0; i < articles.response.docs.length; i++) {
      const article = articles.response.docs[i];
      const date = (new Date(article.pub_date));
      let year = '' + date.getFullYear();
      year = year.substring(2,4);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const time = (date.getHours() % 12) + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
      const am_pm = (date.getHours() > 12 ? "p" : "a");
      const date_time = month + '/' + day + ' ' + time + am_pm;
      const url = (article.multimedia.length > 0 ? "https://nytimes.com/" + article.multimedia[0].url : "nyt.png");
      articles.response.docs[i].title = article.headline.main;
      articles.response.docs[i].body = (article.snippet !== undefined ? article.snippet.substring(0, 310) : '');
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
  
  _renderHeader: function() {
    return (
      React.DOM.div(
        {className: "header"}, 
        React.DOM.p({className: "header-text", key: "header-text"}, "THE NEW YORK TIMES"),
        React.DOM.p({className: "header-subtext", key: "header-subtext"}, "Written Using REACT By Puneet Lamba, © Inventica.com, 2017"),
        React.DOM.input({className: "search", key: "search", placeholder: "Search", onKeyDown: this._search})
      )
    )
  },

  _search: function(event) {
    if (event.keyCode === 13) {
      this.setState({
        q:event.target.value,
        page:1,
        error: false,
      }, this._fetch);
      event.target.value = null;
    };
  },

  _isActive: function(item) {
    return (this.state.activeMenu === item ? "header-nav-item active" : "header-nav-item");
  },
  
  _setFq: function(filter) {
    this.setState({
      fq: (filter === "Home" ? null : filter),
      activeMenu: filter,
      pageTitle: (filter === "Home" ? "Top Stories" : filter),  
      q: null,      
      page: 1,
      message: '',
      enableNext: true,
      error: false,
    }, this._fetch);
  },

  _renderHeaderNav: function() {
    return (
      React.DOM.ul(
        {className: "header-nav"},    
        React.DOM.li({className: this._isActive("Home"), key: "Home", 
          onClick: this._setFq.bind(this, "Home")}, "Home"),
        React.DOM.li({className: this._isActive("World"), key: "World", 
          onClick: this._setFq.bind(this, "World")}, "World"),
        React.DOM.li({className: this._isActive("U.S."), key: "U.S.", 
          onClick: this._setFq.bind(this, "U.S.")}, "U.S."),
        React.DOM.li({className: this._isActive("Style"), key: "Style", 
          onClick: this._setFq.bind(this, "Style")}, "Style"),
        React.DOM.li({className: this._isActive("Sports"), key: "Sports", 
          onClick: this._setFq.bind(this, "Sports")}, "Sports"),
        React.DOM.li({className: this._isActive("Opinion"), key: "Opinion", 
          onClick: this._setFq.bind(this, "Opinion")}, "Opinion"),
        React.DOM.li({className: this._isActive("Business"), key: "Business", 
          onClick: this._setFq.bind(this, "Business")}, "Business"),
        React.DOM.li({className: this._isActive("Technology"), key: "Technology", 
          onClick: this._setFq.bind(this, "Technology")}, "Technology")
      )
    )
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

  _renderPageTitle: function() {
    return (
      React.DOM.div({className: ""},
        React.DOM.h2({className: "page-title", key: "page-title"}, this.state.pageTitle)
      )
    )
  },

  _renderMessage: function() {
    return (
      React.DOM.div({className: ""},
        React.DOM.p({className: "message" + (this.state.error ? " error" : ""), key: "message"}, this.state.message)
      )
    )
  },

  _renderArticleTopSection: function() {
    return (
      React.DOM.div({className: "article-top-section"}, 
        this._renderArticlePromo23Width(this.state.articles.topSectionIndex),
        ((this.state.articles.response.docs.length > 1) ? this._renderArticlePromo13(1) : null),
        ((this.state.articles.response.docs.length > 2) ? this._renderArticlePromo13(2) : null)
      )
    )
  },
  
  _renderArticlePromo23Width: function(i) {
    return (
      React.DOM.div({className: ""}, 
        React.DOM.div({className: "article-promo-23-width", key: "article-promo-23-width"}, 
          this._renderArticlePromo23WidthTop(i),
          this._renderArticlePromo23WidthBody(i)
        )
      )
    )
  },
  
  _renderArticlePromo23WidthTop: function(i) {
    return (
      React.DOM.div({className: "article-promo-23-width-top"}, 
        this._renderArticlePromo23WidthDetail(
          this.state.articles.response.docs[i].title, 
          this.state.articles.response.docs[i].bline, 
          this.state.articles.response.docs[i].date_time
        ),
        this._renderImageSmall(this.state.articles.response.docs[i].url)
      )
    )
  },
  
  _renderArticlePromo23WidthDetail: function(title, byline, dateTime) {
    return (
      React.DOM.div({className: "article-promo-23-width-detail"}, 
        this._renderArticlePromo23Title(title),
        this._renderArticlePromo23Byline(byline),
        this._renderArticlePromo23DateTime(dateTime)
      )
    )
  },
  
  _renderArticlePromo23WidthBody: function(i) {
    return (
      React.DOM.div({className: "article-promo-23-body", key: "article-promo-23-body"}, 
        this.state.articles.response.docs[i].body
      )
    )
  },
  
  _renderArticlePromo13: function(i) {
    return (
      React.DOM.div({className: "article-promo-13", id: "a"}, 
          this._renderArticlePromo13Title(this.state.articles.response.docs[i].title), 
          this._renderArticlePromo13Byline(this.state.articles.response.docs[i].bline), 
          this._renderArticlePromo13DateTime(this.state.articles.response.docs[i].date_time)
      )
    )
  },
  
  _renderArticlePromoFullWidth: function(article) {
    return (
      React.DOM.div({className: ""}, 
        React.DOM.div({className: "article-promo-full-width", key: article._id}, 
          this._renderImageLarge(article.url),
          this._renderArticlePromoFullWidthDetail(
            article.title,
            article.body,
            article.bline,
            article.date_time
          )
        )
      )
    )            
  },
    
  _renderArticlePromoFullWidthDetail: function(title, body, byline, dateTime) {
    return (
      React.DOM.div({className: "article-promo-full-width-detail"}, 
        this._renderTitle(title),
        this._renderBody(body),
        this._renderByline(byline),
        this._renderDateTime(dateTime)
      )
    )
  },
  
  _renderTitle: function(title) {
    return (
      React.DOM.p({className: "article-promo-title", key: title}, title)
    )
  },
  
  _renderBody: function(body) {
    return (
      React.DOM.p({className: "article-promo-body", key: body}, body)
    )
  },
  
  _renderByline: function(byline) {
    return (
      React.DOM.p({className: "byline", key: byline}, byline)
    )
  },
  
  _renderDateTime: function(dateTime) {
    return (
      React.DOM.p({className: "date-time", key: dateTime}, dateTime)
    )
  },
  
  _renderArticlePromo23Byline: function(byline) {
    return (
      React.DOM.div({className: "article-promo-23-byline", key: byline}, byline)
    )
  },
  
  _renderArticlePromo23DateTime: function(dateTime) {
    return (
      React.DOM.div({className: "article-promo-23-date-time", key: dateTime}, dateTime)
    )
  },
  
  _renderArticlePromo23Title: function(title) {
    return (
      React.DOM.p({className: "article-promo-23-title", key: title}, title)
    )
  },
  
  _renderArticlePromo13Title: function(title) {
    return (
      React.DOM.p({className: "article-promo-13-title", key: title}, title)
    )
  },
  
  _renderArticlePromo13Byline: function(byline) {
    return (
      React.DOM.p({className: "article-promo-13-byline", key: byline}, byline)
    )
  },
  
  _renderArticlePromo13DateTime: function(dateTime) {
    return (
      React.DOM.p({className: "article-promo-13-date-time", key: dateTime}, dateTime)
    )
  },
  
  _renderImageLarge: function(url) {
    return (
      React.DOM.div({className: "image-large", key: url}, 
        React.DOM.img({src: url, className: "img-lg", key: url})
      )
    )
  },
  
  _renderImageSmall: function(url) {
    return (
      React.DOM.div({className: "image-small", key: url}, 
        React.DOM.img({src: url, className: "img-sm", key: url})
      )
    )
  },

  _renderPagination: function() {
    return (
      React.DOM.div({className: "pagination"},
        React.DOM.button({className: "next", disabled: !this.state.enablePrevious, onClick: this._previous}, "Previous"),
        React.DOM.button({className: "pageNumber", disabled: true}, "Page " + this.state.page),
        React.DOM.button({className: "next", disabled: !this.state.enableNext, onClick: this._next}, "Next")
      )
    );
  },
  
  _renderFooter: function() {
    return (
      React.DOM.div({className: "footer", key: "footer"}, "")
    )
  }
  
});
      
var Ex = ReactDOM.render(
  React.createElement(Times),
  document.getElementById("app")
);
