"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ucwords = function ucwords(string) {
  return string.toLowerCase().split(/[\s-_]+/).map(function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
};

var commands = [{
  'fn': 'build',
  'text': 'build all',
  'icon': 'industry',
  'watch': true
}, {
  'fn': 'css',
  'text': 'compile css',
  'icon': 'palette',
  'watch': true
}, {
  'fn': 'html',
  'text': 'publish templates',
  'icon': 'file',
  'watch': true
}, {
  'fn': 'js',
  'text': 'compile js',
  'icon': 'code',
  'watch': true
}, {
  'fn': 'images',
  'text': 'compress images',
  'icon': 'image',
  'watch': true
}, {
  'fn': 'favicon',
  'text': 'create favicon',
  'icon': 'dice-five',
  'watch': true
}, {
  'fn': 'fonts',
  'text': 'copy fonts',
  'icon': 'font',
  'watch': true
}, {
  'fn': 'zip',
  'text': 'zip assets',
  'icon': 'file-archive',
  'watch': false
}, {
  'fn': 'clean',
  'text': 'delete templates',
  'icon': 'minus-circle',
  'watch': false,
  'button': 'danger'
}];

var Container =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Container, _React$Component);

  function Container() {
    _classCallCheck(this, Container);

    return _possibleConstructorReturn(this, _getPrototypeOf(Container).apply(this, arguments));
  }

  _createClass(Container, [{
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "container"
      }, React.createElement(Header, null), React.createElement("div", {
        className: "row"
      }, React.createElement("div", {
        className: "col-12 col-sm-5 col-md-4 col-lg-3 col-xl-3 mt-2"
      }, React.createElement(Sidebar, null)), React.createElement("div", {
        className: "col-12 col-sm-6 col-md-6 offset-sm-1"
      }, React.createElement(TemplateForm, null), React.createElement(Heading, {
        size: "2",
        text: "Current Templates",
        style: "my-4"
      }), React.createElement(TemplateList, null))));
    }
  }]);

  return Container;
}(React.Component);

var Sidebar =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(Sidebar, _React$Component2);

  function Sidebar() {
    _classCallCheck(this, Sidebar);

    return _possibleConstructorReturn(this, _getPrototypeOf(Sidebar).apply(this, arguments));
  }

  _createClass(Sidebar, [{
    key: "render",
    value: function render() {
      return React.createElement("div", null, React.createElement(Heading, {
        size: "2",
        text: "Gulp Processes",
        style: "mb-4"
      }), React.createElement(GulpCommands, null));
    }
  }]);

  return Sidebar;
}(React.Component);

var GulpCommands =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(GulpCommands, _React$Component3);

  function GulpCommands(props) {
    var _this;

    _classCallCheck(this, GulpCommands);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GulpCommands).call(this, props));
    _this.state = {
      watching: null
    };
    return _this;
  }

  _createClass(GulpCommands, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var self = this;
      axios.post('http://localhost:3000/setup', {}).then(function (result) {
        self.setState({
          watching: result.data.watching
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      if (this.state.watching !== null) {
        return commands.map(function (data, index) {
          if (_this2.state.watching === true && data.watch === true) {
            return '';
          } else {
            return React.createElement(Button, {
              data: data,
              key: index
            });
          }
        });
      } else return '';
    }
  }]);

  return GulpCommands;
}(React.Component);

var Header =
/*#__PURE__*/
function (_React$Component4) {
  _inherits(Header, _React$Component4);

  function Header() {
    _classCallCheck(this, Header);

    return _possibleConstructorReturn(this, _getPrototypeOf(Header).apply(this, arguments));
  }

  _createClass(Header, [{
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "row"
      }, React.createElement("div", {
        className: "col-12 mt-3 mb-4"
      }, React.createElement(Heading, {
        size: "1",
        text: "{{ project_title }}"
      })));
    }
  }]);

  return Header;
}(React.Component);

var TemplateForm =
/*#__PURE__*/
function (_React$Component5) {
  _inherits(TemplateForm, _React$Component5);

  function TemplateForm(props) {
    var _this3;

    _classCallCheck(this, TemplateForm);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(TemplateForm).call(this, props));
    _this3.templateName = '';
    _this3.updateInput = _this3.updateInput.bind(_assertThisInitialized(_this3));
    _this3.handleSubmit = _this3.handleSubmit.bind(_assertThisInitialized(_this3));
    _this3["default"] = 'create';
    _this3.spinner = React.createElement("i", {
      className: "fas fa-fw fa-spinner fa-spin"
    }, " ");
    _this3.state = {
      icon: _this3["default"]
    };
    return _this3;
  }

  _createClass(TemplateForm, [{
    key: "updateInput",
    value: function updateInput() {
      this.templateName = event.target.value;
    }
  }, {
    key: "updateIcon",
    value: function updateIcon(icon) {
      this.setState({
        icon: icon
      });
      console.log(icon);
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit() {
      var self = this;
      self.updateIcon(this.spinner);
      $.ajax({
        url: 'http://localhost:3000/create',
        method: 'POST',
        dataType: 'json',
        data: {
          'command': this.templateName
        },
        success: function success(result) {
          if (result.status === 200) {
            toastr["success"](result.success);
          } else if (result.status === 400) {
            toastr["error"](result.error);
          }

          self.updateIcon(self["default"]);
        },
        error: function error(result) {
          toastr["error"](result.success);
          self.updateIcon(self["default"]);
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "pb-3"
      }, React.createElement(Heading, {
        text: "Create New Template",
        style: "mb-4"
      }), React.createElement("div", {
        className: "input-group mb-2"
      }, React.createElement("input", {
        onChange: this.updateInput,
        type: "text",
        className: "form-control form-control-sm",
        id: "template",
        name: "template",
        placeholder: "enter name without .html"
      }), React.createElement("div", {
        className: "input-group-append"
      }, React.createElement("button", {
        onClick: this.handleSubmit,
        className: "btn btn-sm btn-info ml-2"
      }, this.state.icon))));
    }
  }]);

  return TemplateForm;
}(React.Component);

var TemplateList =
/*#__PURE__*/
function (_React$Component6) {
  _inherits(TemplateList, _React$Component6);

  function TemplateList(props) {
    var _this4;

    _classCallCheck(this, TemplateList);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(TemplateList).call(this, props));
    _this4.state = {
      names: 'There are currently no templates'
    };
    return _this4;
  }

  _createClass(TemplateList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var self = this;
      axios.post('http://localhost:3000/names', {}).then(function (result) {
        if (result.data.length) self.setState({
          names: result.data
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var names = this.state.names;

      if (_typeof(names) === "object") {
        return names.map(function (name, index) {
          return React.createElement(PageLink, {
            name: name,
            key: index
          });
        });
      } else {
        return React.createElement("p", null, names);
      }
    }
  }]);

  return TemplateList;
}(React.Component);

var PageLink =
/*#__PURE__*/
function (_React$Component7) {
  _inherits(PageLink, _React$Component7);

  function PageLink() {
    _classCallCheck(this, PageLink);

    return _possibleConstructorReturn(this, _getPrototypeOf(PageLink).apply(this, arguments));
  }

  _createClass(PageLink, [{
    key: "render",
    value: function render() {
      var href = this.props.name + ".html";
      return React.createElement("a", {
        key: this.props.index,
        className: "list-group-item list-group-item-action",
        href: href
      }, ucwords(this.props.name));
    }
  }]);

  return PageLink;
}(React.Component);

var Heading =
/*#__PURE__*/
function (_React$Component8) {
  _inherits(Heading, _React$Component8);

  function Heading() {
    _classCallCheck(this, Heading);

    return _possibleConstructorReturn(this, _getPrototypeOf(Heading).apply(this, arguments));
  }

  _createClass(Heading, [{
    key: "render",
    value: function render() {
      var HeadingTag = "h".concat(this.props.size ? this.props.size : 2);
      return React.createElement(HeadingTag, {
        className: this.props.style
      }, this.props.text);
    }
  }]);

  return Heading;
}(React.Component);

var Button =
/*#__PURE__*/
function (_React$Component9) {
  _inherits(Button, _React$Component9);

  function Button(props) {
    var _this5;

    _classCallCheck(this, Button);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(Button).call(this, props));
    _this5.updateIcon = _this5.updateIcon.bind(_assertThisInitialized(_this5));
    _this5["default"] = _this5.props.data.icon;
    _this5.spinner = 'spinner fa-spin';
    _this5.state = {
      icon: _this5["default"]
    };
    return _this5;
  }

  _createClass(Button, [{
    key: "updateIcon",
    value: function updateIcon(icon) {
      this.setState({
        icon: icon
      });
    }
  }, {
    key: "buttonClicked",
    value: function buttonClicked(command) {
      var self = this;
      self.updateIcon(this.spinner);
      axios.post('http://localhost:3000/send', {
        'command': command
      }).then(function (result) {
        self.updateIcon(self["default"]);

        if (result.status === 200) {
          toastr["success"](result.data.success);
        }
      })["catch"](function (error) {
        toastr["error"]('oops');
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("button", {
        key: this.props.index,
        onClick: this.buttonClicked.bind(this, this.props.data.fn),
        className: 'btn btn-sm btn-block mb-3 text-left btn-' + (this.props.data.button ? this.props.data.button : 'light')
      }, React.createElement("i", {
        className: 'fa fa-fw mx-2 fa-' + this.state.icon
      }, " "), this.props.data.text);
    }
  }]);

  return Button;
}(React.Component);

ReactDOM.render(React.createElement(Container, null), document.getElementById('app'));