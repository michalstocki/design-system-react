"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DropdownNubbinPositions = exports.ListItemLabel = exports.ListItem = undefined;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRequiredIf = require("react-required-if");

var _reactRequiredIf2 = _interopRequireDefault(_reactRequiredIf);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _lodash = require("lodash.isfunction");

var _lodash2 = _interopRequireDefault(_lodash);

var _shortid = require("shortid");

var _shortid2 = _interopRequireDefault(_shortid);

var _dialog = require("../utilities/dialog");

var _dialog2 = _interopRequireDefault(_dialog);

var _menuList = require("../utilities/menu-list");

var _menuList2 = _interopRequireDefault(_menuList);

var _item = require("../utilities/menu-list/item");

var _item2 = _interopRequireDefault(_item);

var _itemLabel = require("../utilities/menu-list/item-label");

var _itemLabel2 = _interopRequireDefault(_itemLabel);

var _buttonTrigger = require("./button-trigger");

var _buttonTrigger2 = _interopRequireDefault(_buttonTrigger);

var _checkProps = require("./check-props");

var _checkProps2 = _interopRequireDefault(_checkProps);

var _docs = require("./docs.json");

var _docs2 = _interopRequireDefault(_docs);

var _event = require("../../utilities/event");

var _event2 = _interopRequireDefault(_event);

var _keyBuffer = require("../../utilities/key-buffer");

var _keyBuffer2 = _interopRequireDefault(_keyBuffer);

var _keyboardNavigate = require("../../utilities/keyboard-navigate");

var _keyboardNavigate2 = _interopRequireDefault(_keyboardNavigate);

var _keyCode = require("../../utilities/key-code");

var _keyCode2 = _interopRequireDefault(_keyCode);

var _constants = require("../../utilities/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var documentDefined = typeof document !== 'undefined'; // The overlay is an optional way to allow the dropdown to close on outside
// clicks even when those clicks are over areas that wouldn't normally fire
// click or touch events (for example, iframes). A single overlay is shared
// between all dropdowns in the app.

var overlay = documentDefined ? document.createElement('span') : {
  style: {}
};
overlay.style.top = 0;
overlay.style.left = 0;
overlay.style.width = '100%';
overlay.style.height = '100%';
overlay.style.position = 'absolute';
var currentOpenDropdown;
var DropdownNubbinPositions = ['top left', 'top', 'top right', 'bottom left', 'bottom', 'bottom right']; // # Keyboard Navigable mixin

var noop = function noop() {};

var itemIsSelectable = function itemIsSelectable(item) {
  return item.type !== 'header' && item.type !== 'divider' && !item.disabled;
};

var getNavigableItems = function getNavigableItems(items) {
  var navigableItems = [];
  navigableItems.indexes = [];
  navigableItems.keyBuffer = new _keyBuffer2.default();

  if (Array.isArray(items)) {
    items.forEach(function (item, index) {
      if (itemIsSelectable(item)) {
        navigableItems.push({
          index: index,
          text: "".concat(item.label).toLowerCase()
        });
        navigableItems.indexes.push(index);
      }
    });
  }

  return navigableItems;
};

function getMenu(componentRef) {
  return _reactDom2.default.findDOMNode(componentRef).querySelector('ul.dropdown__list'); // eslint-disable-line react/no-find-dom-node
}

function getMenuItem(menuItemId) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  var menuItem;

  if (menuItemId) {
    menuItem = context.getElementById(menuItemId);
  }

  return menuItem;
}
/*
* Dropdowns with nubbins have a different API from other Dialogs
*
* Dialog receives an alignment position and whether it has a nubbin. The nubbin position is inferred from the align.
* Dropdowns have a nubbinPosition which dictates the align, but in an inverse fashion which then gets inversed back by the Dialog.
*
* Since Dialog is the future API and we don't want to break backwards compatability, we currently map to the Dialog api here. Even if Dialog will map it again.
* TODO - deprecate nubbinPosition in favor for additional `align` values and a flag to show a nubbin.
*/


var DropdownToDialogNubbinMapping = {
  top: 'bottom',
  'top left': 'bottom left',
  'top right': 'bottom right',
  bottom: 'top',
  'bottom left': 'top left',
  'bottom right': 'top right'
};
var propTypes = {
  /**
   * Aligns the right or left side of the menu with the respective side of the trigger. This is not intended for use with `nubbinPosition`.
   */
  align: _propTypes2.default.oneOf(['left', 'right']),

  /**
   * This prop is passed onto the triggering `Button`. Text that is visually hidden but read aloud by screenreaders to tell the user what the icon means. You can omit this prop if you are using the `label` prop.
   */
  assistiveText: _propTypes2.default.object,

  /**
   * CSS classes to be added to triggering button.
   */
  buttonClassName: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object, _propTypes2.default.string]),

  /**
   * If true, button/icon is white. Meant for buttons or utility icons on dark backgrounds.
   */
  buttonInverse: _propTypes2.default.bool,

  /**
   * This prop is passed onto the triggering `Button`. Determines variant of the Button component that triggers dropdown.
   */
  buttonVariant: _propTypes2.default.oneOf(['base', 'neutral', 'brand', 'destructive', 'icon']),

  /**
   * If true, renders checkmark icon on the selected Menu Item.
   */
  checkmark: _propTypes2.default.bool,

  /**
   * By default, any children passed into this component will be rendered inside the dropdown menu. If you only need a standard menu, use `options`. If you need custom list items markup, use `listItemRenderer` and `options`. `children` with a `List` should _only_ used if you have a listbox and additional content.
   *
   * If you need to modify the trigger button, import the module `design-system-react/dropdown/button-trigger` and render a grandchild of the element type `Button`. Any `props` specified on that `Button` will be assigned to the trigger button. Any `id` prop or event hanlders (`onBlur`, `onClick`, etc.) set on the button grandchild will be overwritten by `MenuDropdown` to enable functionality and accessibility. A custom trigger child will not be considered content for the dropdown menu.
   *
   * **List as a child is an experimental API.** If you need custom content _and_ a list, import 'design-system-react/components/menu-list/list' and pass in `<List>`.
   * ```
   * <Dropdown>
   *   <Trigger>
   *   <Button iconCategory="utility" iconName="settings" />
   *   </Trigger>
   *   <div>Look ma! This is Custom Content.</div>
   *   <List options={[myArray]}/>
   * </Dropdown>
   * ```
   */
  children: _propTypes2.default.node,

  /**
   * CSS classes to be added to dropdown menu.
   */
  className: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object, _propTypes2.default.string]),

  /**
   * By default, these class names will be added to the absolutely-positioned `Dialog` component.
   */
  containerClassName: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object, _propTypes2.default.string]),

  /**
   * This prop is passed onto the triggering `Button`. Prevent dropdown menu from opening. Also applies disabled styling to trigger button.
   */
  disabled: _propTypes2.default.bool,

  /**
   * Prevents the dropdown from changing position based on the viewport/window. If set to true your dropdowns can extend outside the viewport _and_ overflow outside of a scrolling parent. If this happens, you might want to consider making the dropdowns contents scrollable to fit the menu on the screen. `hasStaticAlignment` disables this behavior and allows this component to extend beyond boundary elements. _Not tested._
   */
  hasStaticAlignment: _propTypes2.default.bool,

  /**
   * This prop is passed onto the triggering `Button`. Associates an icon button with another element on the page by changes the color of the SVG. Please reference <a href="http://www.lightningdesignsystem.com/components/buttons/#hint">Lightning Design System Buttons > Hint</a>.
   */
  hint: _propTypes2.default.bool,

  /**
   * Delay on menu closing in milliseconds.
   */
  hoverCloseDelay: _propTypes2.default.number,

  /**
   * Name of the icon category. Visit <a href="http://www.lightningdesignsystem.com/resources/icons">Lightning Design System Icons</a> to reference icon categories.
   */
  iconCategory: (0, _reactRequiredIf2.default)(_propTypes2.default.oneOf(['action', 'custom', 'doctype', 'standard', 'utility']), function (props) {
    return !!props.iconName;
  }),

  /**
   * Name of the icon. Visit <a href="http://www.lightningdesignsystem.com/resources/icons">Lightning Design System Icons</a> to reference icon names.
   */
  iconName: _propTypes2.default.string,

  /**
   * If omitted, icon position is centered.
   */
  iconPosition: _propTypes2.default.oneOf(['left', 'right']),

  /**
   * For icon variants, please reference <a href="http://www.lightningdesignsystem.com/components/buttons/#icon">Lightning Design System Icons</a>.
   */
  iconVariant: _propTypes2.default.oneOf(['bare', 'container', 'border', 'border-filled', 'small', 'more']),

  /**
   * Determines the size of the icon.
   */
  iconSize: _propTypes2.default.oneOf(['x-small', 'small', 'medium', 'large']),

  /**
   * A unique ID is needed in order to support keyboard navigation, ARIA support, and connect the dropdown to the triggering button.
   */
  id: _propTypes2.default.string,

  /**
   * Forces the dropdown to be open or closed. See controlled/uncontrolled callback/prop pattern for more on suggested use view [Concepts and Best Practices](https://github.com/salesforce-ux/design-system-react/blob/master/CONTRIBUTING.md#concepts-and-best-practices)
   */
  isOpen: _propTypes2.default.bool,

  /**
   * This prop is passed onto the triggering `Button`. Text within the trigger button.
   */
  label: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),

  /**
   * Custom element that overrides the default Menu Item component.
   */
  listItemRenderer: _propTypes2.default.func,

  /**
   * This prop is passed into the List for the menu. Pass null to make it the size of the content, or a string with an integer from here: https://www.lightningdesignsystem.com/components/menus/#flavor-dropdown-height
   */
  length: _propTypes2.default.oneOf([null, '5', '7', '10']),

  /**
   * Please select one of the following:
   * * `absolute` - (default) The dialog will use `position: absolute` and style attributes to position itself. This allows inverted placement or flipping of the dialog.
   * * `overflowBoundaryElement` - The dialog will overflow scrolling parents. Use on elements that are aligned to the left or right of their target and don't care about the target being within a scrolling parent. Typically this is a popover or tooltip. Dropdown menus can usually open up and down if no room exists. In order to achieve this a portal element will be created and attached to `body`. This element will render into that detached render tree.
   * * `relative` - No styling or portals will be used. Menus will be positioned relative to their triggers. This is a great choice for HTML snapshot testing.
   */
  menuPosition: _propTypes2.default.oneOf(['absolute', 'overflowBoundaryElement', 'relative']),

  /**
   * Style applied to menu element (that is the `.slds-dropdown` element)
   */
  menuStyle: _propTypes2.default.object,

  /**
   * Positions dropdown menu with a nubbin--that is the arrow notch. The placement options correspond to the placement of the nubbin. This is implemeted with CSS classes and is best used with a `Button` with "icon container" styling (`iconVariant="container"`). Use with `isInline` prop, since positioning is determined by CSS via absolute-relative positioning, and using an absolutely positioned menu will not position the menu correctly without manual offsets.
   */
  nubbinPosition: _propTypes2.default.oneOf(['top left', 'top', 'top right', 'bottom left', 'bottom', 'bottom right']),

  /**
   * Is only called when `openOn` is set to `hover` and when the triggering button loses focus.
   */
  onBlur: _propTypes2.default.func,

  /**
   * This prop is passed onto the triggering `Button`. Triggered when the trigger button is clicked.
   */
  onClick: _propTypes2.default.func,

  /**
   * Is only called when `openOn` is set to `hover` and when the triggering button gains focus.
   */
  onFocus: _propTypes2.default.func,

  /**
   * Determines if mouse hover or click opens or closes the dropdown menu. The default of `click` opens the menu on click, touch, or keyboard navigation and is highly recommended to comply with accessibility standards. The other options are `hover` which opens when the mouse enters the focusable area, and `hybrid` which causes the menu to open on clicking of the trigger, but closes the menu when the mouse leaves the menu and trigger area. If you are planning on using `hover` or `hybrid`, please pause a moment and reconsider.
   */
  openOn: _propTypes2.default.oneOf(['hover', 'click', 'hybrid']),

  /**
   * Called when a key pressed.
   */
  onKeyDown: _propTypes2.default.func,

  /**
   * Called when mouse clicks down on the trigger button.
   */
  onMouseDown: _propTypes2.default.func,

  /**
   * Called when mouse hovers over the trigger button. This is only called if `this.props.openOn` is set to `hover`.
   */
  onMouseEnter: _propTypes2.default.func,

  /**
   * Called when mouse hover leaves the trigger button. This is only called if `this.props.openOn` is set to `hover`.
   */
  onMouseLeave: _propTypes2.default.func,

  /**
   * Triggered when an item in the menu is clicked.
   */
  onSelect: _propTypes2.default.func,

  /**
   * Triggered when the dropdown is opened.
   */
  onOpen: _propTypes2.default.func,

  /**
   * Triggered when the dropdown is closed.
   */
  onClose: _propTypes2.default.func,

  /**
   * An array of menu item objects. `className` and `id` object keys are applied to the `li` DOM node. `divider` key can have a value of `top` or `bottom`. `rightIcon` and `leftIcon` are not actually `Icon` components, but prop objects that get passed to an `Icon` component. The `href` key will be added to the `a` and its default click event will be prevented. Here is a sample:
   * ```
   * [{
   *   className: 'custom-li-class',
   *     divider: 'bottom',
   *     label: 'A Header',
   *     type: 'header'
   *  }, {
   *     href: 'http://sfdc.co/',
   *     id: 'custom-li-id',
   *     label: 'Has a value',
   *   leftIcon: {
   *    name: 'settings',
   *    category: 'utility'
   *   },
   *   rightIcon: {
   *    name: 'settings',
   *    category: 'utility'
   *   },
   *     type: 'item',
   *     value: 'B0'
   *  }, {
   *   type: 'divider'
   * }]
   * ```
   */
  options: _propTypes2.default.array,

  /**
   * An object of CSS styles that are applied to the triggering button.
   */
  style: _propTypes2.default.object,

  /**
   * Write <code>"-1"</code> if you don't want the user to tab to the button.
   */
  tabIndex: _propTypes2.default.string,

  /**
   * If `true`, adds a transparent overlay when the menu is open to handle outside clicks. Allows clicks on iframes to be captured, but also forces a double-click to interact with other elements. If a function is passed, custom overlay logic may be defined by the app.
   */
  overlay: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.func]),

  /**
   * Current selected menu item.
   */
  value: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string, _propTypes2.default.array]),

  /**
   * This prop is passed onto the triggering `Button`. It creates a tooltip with the content of the `node` provided.
   */
  tooltip: _propTypes2.default.node,

  /**
   * CSS classes to be added to wrapping trigger `div` around the button.
   */
  triggerClassName: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object, _propTypes2.default.string]),

  /**
   * Whether this dropdown supports multi select.
   */
  multiple: _propTypes2.default.bool
};
var defaultProps = {
  align: 'left',
  hoverCloseDelay: 300,
  length: '5',
  menuPosition: 'absolute',
  openOn: 'click'
};
/**
 * The MenuDropdown component is a variant of the Lightning Design System Menu component. This component
 * may require a polyfill such as [classList](https://github.com/yola/classlist-polyfill) due to
 * [react-onclickoutside](https://github.com/Pomax/react-onclickoutside) if Internet Explorer 11
 * support is needed.
 *
 * This component is wrapped in a [higher order component to listen for clicks outside itself](https://github.com/kentor/react-click-outside) and thus requires use of `ReactDOM`.
 */

var MenuDropdown =
/*#__PURE__*/
function (_React$Component) {
  _inherits(MenuDropdown, _React$Component);

  function MenuDropdown() {
    var _ref;

    var _temp, _this;

    _classCallCheck(this, MenuDropdown);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _possibleConstructorReturn(_this, (_temp = _this = _possibleConstructorReturn(this, (_ref = MenuDropdown.__proto__ || Object.getPrototypeOf(MenuDropdown)).call.apply(_ref, [this].concat(args))), Object.defineProperty(_assertThisInitialized(_this), "state", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: {
        focusedIndex: -1,
        selectedIndex: -1,
        selectedIndices: []
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "getId", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value() {
        return _this.props.id || _this.generatedId;
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "getIsOpen", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value() {
        return !!(typeof _this.props.isOpen === 'boolean' ? _this.props.isOpen : _this.state.isOpen);
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "getIndexByValue", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(_value, options) {
        var foundIndex = -1;

        if (options && options.length) {
          options.some(function (element, index) {
            if (element && element.value === _value) {
              foundIndex = index;
              return true;
            }

            return false;
          });
        }

        return foundIndex;
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "getValueByIndex", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(index) {
        return _this.props.options[index];
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "getListItemRenderer", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value() {
        return _this.props.listItemRenderer ? _this.props.listItemRenderer : _itemLabel2.default;
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "getListItemId", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(index) {
        var menuItemId;

        if (index !== undefined) {
          var menuId = (0, _lodash2.default)(_this.getId) ? _this.getId() : _this.props.id;
          menuItemId = "".concat(menuId, "-item-").concat(index);
        }

        return menuItemId;
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "setFocus", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value() {
        if (!_this.isHover && !_this.isUnmounting && _this.trigger) {
          _reactDom2.default.findDOMNode(_this.trigger).focus(); // eslint-disable-line react/no-find-dom-node

        }
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "getMenu", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value() {
        return _reactDom2.default.findDOMNode(_this.list);
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "getMenuItem", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(index) {
        if (index !== undefined && _this.listItems) {
          return _reactDom2.default.findDOMNode(_this.listItems[index]); // eslint-disable-line react/no-find-dom-node
        }

        return undefined;
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "setCurrentSelectedIndices", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(nextProps) {
        if (_this.props.multiple !== true) {
          _this.setState({
            selectedIndex: _this.getIndexByValue(nextProps.value, nextProps.options)
          });
        } else {
          var values = [];
          var currentIndices = [];

          if (!Array.isArray(nextProps.value)) {
            values.push(nextProps.value);
          } else {
            values = nextProps.value;
          }

          values = values.filter(function (value) {
            return _this.getIndexByValue(value, nextProps.options) !== -1;
          });
          currentIndices = values.map(function (value) {
            return _this.getIndexByValue(value, nextProps.options);
          });

          _this.setState({
            selectedIndices: currentIndices
          });
        }
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "saveRefToTrigger", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(trigger) {
        _this.trigger = trigger;

        if (!_this.state.triggerRendered) {
          _this.setState({
            triggerRendered: true
          });
        }
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "saveRefToTriggerContainer", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(triggerContainer) {
        _this.triggerContainer = triggerContainer;
        if (!_this.trigger) _this.trigger = triggerContainer;
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "saveRefToList", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(list) {
        _this.list = list;
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "saveRefToListItem", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(listItem, index) {
        if (!_this.listItems) {
          _this.listItems = {};
        }

        _this.listItems[index] = listItem;

        if (index === _this.state.focusedIndex) {
          _this.handleKeyboardFocus(_this.state.focusedIndex);
        }
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "handleClose", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value() {
        var isOpen = _this.getIsOpen();

        if (isOpen) {
          if (currentOpenDropdown === _assertThisInitialized(_this)) {
            currentOpenDropdown = undefined;
          }

          _this.setState({
            isOpen: false
          });

          _this.isHover = false;

          if (_this.props.onClose) {
            _this.props.onClose();
          }
        }
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "handleOpen", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value() {
        var isOpen = _this.getIsOpen();

        if (!isOpen) {
          if (currentOpenDropdown && (0, _lodash2.default)(currentOpenDropdown.handleClose)) {
            currentOpenDropdown.handleClose();
          }

          currentOpenDropdown = _assertThisInitialized(_this);

          _this.setState({
            isOpen: true
          });

          if (_this.props.onOpen) {
            _this.props.onOpen();
          }
        }
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "handleMouseEnter", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(event) {
        var isOpen = _this.getIsOpen();

        _this.isHover = true;

        if (!isOpen && _this.props.openOn === 'hover') {
          _this.handleOpen();
        } else {
          // we want this clear when openOn is hover or hybrid
          clearTimeout(_this.isClosing);
        }

        if (_this.props.onMouseEnter) {
          _this.props.onMouseEnter(event);
        }
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "handleMouseLeave", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(event) {
        var isOpen = _this.getIsOpen();

        if (isOpen) {
          _this.isClosing = setTimeout(function () {
            _this.handleClose();
          }, _this.props.hoverCloseDelay);
        }

        if (_this.props.onMouseLeave) {
          _this.props.onMouseLeave(event);
        }
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "handleClick", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(event) {
        var isOpen = _this.getIsOpen();

        if (!isOpen) {
          _this.handleOpen();

          _this.setFocus();
        } else {
          _this.handleClose();
        }

        if (_this.props.onClick) {
          _this.props.onClick(event);
        }
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "handleFocus", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(event) {
        var isOpen = _this.getIsOpen();

        if (!isOpen) {
          _this.handleOpen();
        }

        if (_this.props.onFocus) {
          _this.props.onFocus(event);
        }
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "handleClickCustomContent", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value() {
        _this.setFocus();

        _this.handleClose();

        if (_this.props.onSelect) {
          _this.props.onSelect();
        }
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "handleSelect", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(index) {
        if (!_this.props.multiple) {
          _this.setState({
            selectedIndex: index
          });

          _this.handleClose();

          _this.setFocus();
        } else if (_this.props.multiple && _this.state.selectedIndices.indexOf(index) === -1) {
          var currentIndices = _this.state.selectedIndices.concat(index);

          _this.setState({
            selectedIndices: currentIndices
          });
        } else if (_this.props.multiple) {
          var deselectIndex = _this.state.selectedIndices.indexOf(index);

          var currentSelected = _this.state.selectedIndices;
          currentSelected.splice(deselectIndex, 1);

          _this.setState({
            selectedIndices: currentSelected
          });
        }

        if (_this.props.onSelect) {
          var option = _this.getValueByIndex(index);

          _this.props.onSelect(option, {
            option: option,
            optionIndex: index
          });
        }
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "handleKeyDown", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(event) {
        if (event.keyCode) {
          if (event.keyCode === _keyCode2.default.ENTER || event.keyCode === _keyCode2.default.SPACE || event.keyCode === _keyCode2.default.DOWN || event.keyCode === _keyCode2.default.UP) {
            _event2.default.trap(event);
          }

          if (event.keyCode !== _keyCode2.default.TAB) {
            var isOpen = _this.getIsOpen();

            _this.handleKeyboardNavigate({
              event: event,
              isOpen: isOpen,
              key: event.key,
              keyCode: event.keyCode,
              onSelect: _this.handleSelect,
              target: event.target,
              toggleOpen: _this.toggleOpen
            });
          } else {
            _this.handleCancel();
          }

          if (_this.props.onKeyDown) {
            _this.props.onKeyDown(event);
          }
        }
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "handleCancel", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value() {
        _this.setFocus();

        _this.handleClose();
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "handleClickOutside", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value() {
        _this.handleClose();
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "handleKeyboardNavigate", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(_ref2) {
        var event = _ref2.event,
            _ref2$isOpen = _ref2.isOpen,
            isOpen = _ref2$isOpen === void 0 ? true : _ref2$isOpen,
            keyCode = _ref2.keyCode,
            _ref2$onFocus = _ref2.onFocus,
            onFocus = _ref2$onFocus === void 0 ? _this.handleKeyboardFocus : _ref2$onFocus,
            onSelect = _ref2.onSelect,
            target = _ref2.target,
            _ref2$toggleOpen = _ref2.toggleOpen,
            toggleOpen = _ref2$toggleOpen === void 0 ? noop : _ref2$toggleOpen;
        (0, _keyboardNavigate2.default)({
          componentContext: _assertThisInitialized(_this),
          currentFocusedIndex: _this.state.focusedIndex,
          event: event,
          isOpen: isOpen,
          keyCode: keyCode,
          navigableItems: _this.navigableItems,
          onFocus: onFocus,
          onSelect: onSelect,
          target: target,
          toggleOpen: toggleOpen
        });
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "handleKeyboardFocus", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(focusedIndex) {
        if (_this.state.focusedIndex !== focusedIndex) {
          _this.setState({
            focusedIndex: focusedIndex
          });
        }

        var menu = (0, _lodash2.default)(_this.getMenu) ? _this.getMenu() : getMenu(_assertThisInitialized(_this));
        var menuItem = (0, _lodash2.default)(_this.getMenuItem) ? _this.getMenuItem(focusedIndex, menu) : getMenuItem(_this.getListItemId(focusedIndex));

        if (menuItem) {
          _this.focusMenuItem(menuItem);

          _this.scrollToMenuItem(menu, menuItem);
        }
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "focusMenuItem", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(menuItem) {
        menuItem.getElementsByTagName('a')[0].focus();
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "scrollToMenuItem", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(menu, menuItem) {
        if (menu && menuItem) {
          var menuHeight = menu.offsetHeight;
          var menuTop = menu.scrollTop;
          var menuItemTop = menuItem.offsetTop - menu.offsetTop;

          if (menuItemTop < menuTop) {
            menu.scrollTop = menuItemTop;
          } else {
            var menuBottom = menuTop + menuHeight + menu.offsetTop;
            var menuItemBottom = menuItemTop + menuItem.offsetHeight + menu.offsetTop;

            if (menuItemBottom > menuBottom) {
              menu.scrollTop = menuItemBottom - menuHeight - menu.offsetTop;
            }
          }
        }
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "toggleOpen", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value() {
        var isOpen = _this.getIsOpen();

        _this.setFocus();

        if (isOpen) {
          _this.handleClose();
        } else {
          _this.handleOpen();
        }
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "renderDefaultMenuContent", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(customListProps) {
        return _react2.default.createElement(_menuList2.default, _extends({
          key: "".concat(_this.getId(), "-dropdown-list"),
          checkmark: _this.props.checkmark,
          getListItemId: _this.getListItemId,
          itemRefs: _this.saveRefToListItem,
          itemRenderer: _this.getListItemRenderer(),
          onCancel: _this.handleCancel,
          onSelect: _this.handleSelect,
          options: _this.props.options,
          ref: _this.saveRefToList,
          selectedIndex: !_this.props.multiple ? _this.state.selectedIndex : undefined,
          selectedIndices: _this.props.multiple ? _this.state.selectedIndices : undefined,
          triggerId: _this.getId(),
          length: _this.props.length
        }, customListProps));
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "renderMenuContent", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(customContent) {
        var customContentWithListPropInjection = []; // Dropdown can take a Trigger component as a child and then return it as the parent DOM element.

        _react2.default.Children.forEach(customContent, function (child) {
          if (child && child.type.displayName === _constants.LIST) {
            customContentWithListPropInjection.push(_this.renderDefaultMenuContent(child.props));
          } else if (child) {
            var clonedCustomContent = _react2.default.cloneElement(child, {
              onClick: _this.handleClickCustomContent,
              key: _shortid2.default.generate()
            });

            customContentWithListPropInjection.push(clonedCustomContent);
          }
        });

        if (customContentWithListPropInjection.length === 0) {
          customContentWithListPropInjection = null;
        }

        return customContentWithListPropInjection || _this.renderDefaultMenuContent();
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "renderDialog", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(customContent, isOpen, outsideClickIgnoreClass) {
        var align = 'bottom';
        var hasNubbin = false;
        var positionClassName = '';

        if (_this.props.nubbinPosition) {
          hasNubbin = true;
          align = DropdownToDialogNubbinMapping[_this.props.nubbinPosition];
        } else if (_this.props.align) {
          align = "bottom ".concat(_this.props.align);
        }

        var positions = DropdownToDialogNubbinMapping[align].split(' ');
        positionClassName = (0, _classnames2.default)(positions.map(function (position) {
          return "slds-dropdown_".concat(position);
        })); // FOR BACKWARDS COMPATIBILITY

        var menuPosition = _this.props.isInline ? 'relative' : _this.props.menuPosition; // eslint-disable-line react/prop-types

        return isOpen ? _react2.default.createElement(_dialog2.default, {
          align: align,
          className: (0, _classnames2.default)(_this.props.containerClassName),
          closeOnTabKey: true,
          contentsClassName: (0, _classnames2.default)('slds-dropdown', 'ignore-react-onclickoutside', _this.props.className, positionClassName),
          context: _this.context,
          hasNubbin: hasNubbin,
          hasStaticAlignment: _this.props.hasStaticAlignment,
          inheritWidthOf: _this.props.inheritTargetWidth ? 'target' : 'none',
          offset: _this.props.offset,
          onClose: _this.handleClose,
          onKeyDown: _this.handleKeyDown,
          onMouseEnter: _this.props.openOn === 'hover' ? _this.handleMouseEnter : null,
          onMouseLeave: _this.props.openOn === 'hover' ? _this.handleMouseLeave : null,
          outsideClickIgnoreClass: outsideClickIgnoreClass,
          position: menuPosition,
          style: _this.props.menuStyle,
          onRequestTargetElement: function onRequestTargetElement() {
            return _this.trigger;
          }
        }, _this.renderMenuContent(customContent)) : null;
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "renderOverlay", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(isOpen) {
        if ((0, _lodash2.default)(overlay) && documentDefined) {
          overlay(isOpen, overlay);
        } else if (_this.props.overlay && isOpen && !_this.overlay && documentDefined) {
          _this.overlay = overlay;
          document.querySelector('body').appendChild(_this.overlay);
        } else if (!isOpen && _this.overlay && _this.overlay.parentNode) {
          _this.overlay.parentNode.removeChild(_this.overlay);

          _this.overlay = undefined;
        }
      }
    }), _temp));
  }

  _createClass(MenuDropdown, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      // `checkProps` issues warnings to developers about properties (similar to React's built in development tools)
      (0, _checkProps2.default)(_constants.MENU_DROPDOWN, this.props, _docs2.default);
      this.generatedId = _shortid2.default.generate();
      this.setCurrentSelectedIndices(this.props);
      this.navigableItems = getNavigableItems(this.props.options);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps, prevProps) {
      if (prevProps.value !== nextProps.value) {
        this.setCurrentSelectedIndices(nextProps);
      }

      if (prevProps.isOpen !== nextProps.isOpen) {
        this.setFocus();
      }

      if (nextProps.options) {
        this.navigableItems = getNavigableItems(nextProps.options);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (currentOpenDropdown === this) {
        currentOpenDropdown = undefined;
      }

      this.isUnmounting = true;
      this.renderOverlay(false);
    }
  }, {
    key: "render",
    value: function render() {
      // Dropdowns are used by other components. The default trigger is a button, but some other components use `li` elements. The following allows `MenuDropdown` to be extended by providing a child component with the displayName of `DropdownTrigger`.
      var CurrentTrigger = _buttonTrigger2.default;
      var CustomTriggerChildProps = {}; // Child elements that do not have the display name of the value of `MENU_DROPDOWN_TRIGGER` in `components/constants.js` will be considered custom content and rendered in the popover.

      var customContent = []; // Dropdown can take a Trigger component as a child and then return it as the parent DOM element.

      _react2.default.Children.forEach(this.props.children, function (child) {
        if (child && child.type.displayName === _constants.MENU_DROPDOWN_TRIGGER) {
          // `CustomTriggerChildProps` is not used by the default button Trigger, but by other triggers
          CustomTriggerChildProps = child.props;
          CurrentTrigger = child.type;
        } else {
          customContent.push(child);
        }
      });

      if (customContent.length === 0) {
        customContent = null;
      }

      var outsideClickIgnoreClass = "ignore-click-".concat(this.getId());
      var isOpen = !this.props.disabled && this.getIsOpen() && !!this.trigger;
      this.renderOverlay(isOpen);
      /* Below are three sections of props:
       - The first are the props that may be given by the dropdown component. These may get deprecated in the future.
       - The next set of props (`CustomTriggerChildProps`) are props that can be overwritten by the end developer.
       - The final set are props that should not be overwritten, since they are ones that tie the trigger to the dropdown menu.
      */

      return _react2.default.createElement(CurrentTrigger, _extends({
        "aria-haspopup": true,
        assistiveText: this.props.assistiveText,
        className: (0, _classnames2.default)(outsideClickIgnoreClass, this.props.buttonClassName),
        disabled: this.props.disabled,
        hint: this.props.hint,
        iconCategory: this.props.iconCategory,
        iconName: this.props.iconName,
        iconPosition: this.props.iconPosition,
        iconSize: this.props.iconSize,
        iconVariant: this.props.iconVariant,
        id: this.getId(),
        inverse: this.props.buttonInverse,
        isOpen: isOpen,
        label: this.props.label,
        menu: this.renderDialog(customContent, isOpen, outsideClickIgnoreClass),
        onBlur: this.props.onBlur,
        onClick: this.props.openOn === 'click' || this.props.openOn === 'hybrid' ? this.handleClick : this.props.onClick,
        onFocus: this.props.openOn === 'hover' ? this.handleFocus : null,
        onKeyDown: this.handleKeyDown,
        onMouseDown: this.props.onMouseDown,
        onMouseEnter: this.props.openOn === 'hover' || this.props.openOn === 'hybrid' ? this.handleMouseEnter : null,
        onMouseLeave: this.props.openOn === 'hover' || this.props.openOn === 'hybrid' ? this.handleMouseLeave : null,
        openOn: this.props.openOn,
        ref: this.saveRefToTriggerContainer,
        style: this.props.style,
        tabIndex: this.props.tabIndex || (isOpen ? '-1' : '0'),
        tooltip: this.props.tooltip,
        triggerClassName: this.props.triggerClassName,
        triggerRef: this.saveRefToTrigger,
        variant: this.props.buttonVariant
      }, CustomTriggerChildProps));
    }
  }]);

  return MenuDropdown;
}(_react2.default.Component);

Object.defineProperty(MenuDropdown, "displayName", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _constants.MENU_DROPDOWN
});
MenuDropdown.contextTypes = {
  iconPath: _propTypes2.default.string
};
MenuDropdown.propTypes = propTypes;
MenuDropdown.defaultProps = defaultProps;
exports.default = MenuDropdown;
exports.ListItem = _item2.default;
exports.ListItemLabel = _itemLabel2.default;
exports.DropdownNubbinPositions = DropdownNubbinPositions;