var Times = React.createClass({

  propTypes: {
    pageTitle: React.PropTypes.string.isRequired,
  },
  
  getDefaultProps: function() {
    return {
      pageTitle: "Top Stories",
    };
  },
  
  render: function() {
    return (
      //React.DOM.x is a convenience wrapper for React.createElement('x', ...)
      React.DOM.div(null, 
        this._renderHeader(),
        this._renderHeaderNav(),
        this._renderPageTitle(),
        this._renderArticleTopSection(),
        this._renderArticlePromoFullWidth("Title1","Body1","By Puneet Lamba","8:50 AM ET"),
        this._renderArticlePromoFullWidth("Title2","Body2","By Roger Federer","8:50 AM ET"),
        this._renderArticlePromoFullWidth("Title3","Body3","By Durga Nagalla","8:50 AM ET"),
        this._renderArticlePromoFullWidth("Title5","Body5","By Puneet Lamba","8:50 AM ET"),
        this._renderArticlePromoFullWidth("Title6","Body6","By Bjorn Borg","8:50 AM ET"),
        this._renderArticlePromoFullWidth("Title7","Body7","By John McEnroe","8:50 AM ET"),
        this._renderArticlePromoFullWidth("Title8","Body8","By Steffi Graf","8:50 AM ET"),
        this._renderFooter()
      )
    )            
  },
  
  componentDidMount() {
    var 
      proxyUrl = 'https://cors-anywhere.herokuapp.com/',
      targetUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json"

    fetch(proxyUrl + targetUrl, {
      params: {
        'api-key':"933ec882c25c40c388ba892e07e4204c",
      },
      headers: {
        'Access-Control-Allow-Origin':'*',
      }
    })
      .then((response) => {
        console.log(response.data);
      });
  },

  getInitialState: function() {
    return {
      pageTitle: this.props.pageTitle,
    };
  },

  _somethingChanged: function() {
    this.setState({
      pageTitle: "_somethingChanged",        
    });
  },

  _backToNormal: function() {
    this.setState({
      pageTitle: "Top Stories",        
    });
  },

  _renderHeader: function() {
    return (
      React.DOM.div(
        {className: "header"}, 
        React.DOM.p({className: "header-text", key: "header-text"}, "THE TIMES"),
        React.DOM.input({className: "search", key: "search", placeholder: "Search"})
      )
    )
  },
  
  _renderHeaderNav: function() {
    return (
      React.DOM.ul(
        {className: "header-nav"},    
        //should be changed to a list, potentially sourced from a database  
        React.DOM.li({className: "header-nav-item", key: "home", 
          onClick: this._backToNormal}, "Home"),
        React.DOM.li({className: "header-nav-item", key: "world"}, "World"),
        React.DOM.li({className: "header-nav-item", key: "us"}, "U.S."),
        React.DOM.li({className: "header-nav-item", key: "poliics"}, "Politics"),
        React.DOM.li({className: "header-nav-item", key: "ny"}, "N.Y."),
        React.DOM.li({className: "header-nav-item", key: "more",
          onClick: this._somethingChanged}, "More")
      )
    )
  },
  
  _renderPageTitle: function() {
    return (
      <div key="">
        <h2 className="page-title" key="page-title">
        </h2>
      </div>
    )
  },

  _renderArticleTopSection: function() {
    return (
      React.DOM.div({className: "article-top-section"}, 
        this._renderArticlePromo23Width("Title4","Body4","By Michael Jordan","8:50 AM ET"),
        this._renderArticlePromo13("Title9","By Jimmy Page", "8:50 AM ET"),
        this._renderArticlePromo13("Title10","By John Lennon", "8:50 AM ET")
      )
    )
  },
  
  _renderArticlePromo23Width: function(title, body, byline, dateTime) {
    return (
      React.DOM.div({className: ""}, 
        React.DOM.div({className: "article-promo-23-width", key: "article-promo-23-width"}, 
          this._renderArticlePromo23WidthTop(title, byline, dateTime),
          this._renderArticlePromo23WidthBody(body)
        )
      )
    )
  },
  
  _renderArticlePromo23WidthTop: function(title, byline, dateTime) {
    return (
      React.DOM.div({className: "article-promo-23-width-top"}, 
        this._renderArticlePromo23WidthDetail(title, byline, dateTime),
        this._renderImageSmall()
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
  
  _renderArticlePromo23WidthBody: function(body) {
    return (
      React.DOM.div({className: "article-promo-23-body", key: "article-promo-23-body"}, body)
    )
  },
  
  _renderArticlePromo13: function(title, byline, dateTime) {
    return (
      React.DOM.div({className: "article-promo-13", id: "a"}, 
        this._renderArticlePromoTitle(title),
        this._renderByline(byline),
        this._renderDateTime(dateTime)
      )
    )
  },
  
  _renderArticlePromoFullWidth: function(title, body, byline, dateTime) {
    return (
      React.DOM.div({className: ""}, 
        React.DOM.div({className: "article-promo-full-width", key: "article-promo-full-width"}, 
          this._renderImageLarge(),
          this._renderArticlePromoFullWidthDetail(title, body, byline, dateTime)
        )
      )
    )
  },
  
  _renderArticlePromoFullWidthDetail: function(title, body, byline, dateTime) {
    return (
      React.DOM.div({className: "article-promo-full-width-detail"}, 
        this._renderArticlePromoTitle(title),
        this._renderArticlePromoBodyText(body),
        this._renderByline(byline),
        this._renderDateTime(dateTime)
      )
    )
  },
  
  _renderArticlePromo23Byline: function(byline) {
    return (
      React.DOM.div({className: "article-promo-23-byline", key: "article-promo-23-byline"}, byline)
    )
  },
  
  _renderArticlePromo23DateTime: function(dateTime) {
    return (
      React.DOM.div({className: "article-promo-23-date-time", key: "article-promo-23-date-time"}, dateTime)
    )
  },
  
  _renderByline: function(byline) {
    return (
      React.DOM.p({className: "byline", key: "byline"}, byline)
    )
  },
  
  _renderDateTime: function(dateTime) {
    return (
      React.DOM.p({className: "date-time", key: "dateTime"}, dateTime)
    )
  },
  
  _renderArticlePromoTitle: function(title) {
    return (
      React.DOM.p({className: "article-promo-title", key: "article-promo-title"}, title)
    )
  },
  
  _renderArticlePromo23Title: function(title) {
    return (
      React.DOM.p({className: "article-promo-23-title", key: "article-promo-23-title"}, title)
    )
  },
  
  _renderArticlePromoBodyText: function(body) {
    return (
      React.DOM.p({className: "article-promo-body", key: "article-promo-body"}, body)
    )
  },
  
  _renderImageLarge: function() {
    return (
      React.DOM.div({className: "image-large", key: "image-large"}, "image-large")
    )
  },
  
  _renderImageSmall: function() {
    return (
      React.DOM.div({className: "image-small", key: "image-small"}, "image-small")
    )
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