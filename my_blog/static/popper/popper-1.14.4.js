/ **！
 * @fileOverview Kickass库创建并在其参考元素附近放置poppers。
 * @version 1.14.4
 * @执照
 *版权所有（c）2016 Federico Zivolo和贡献者
 *
 *特此授予任何获得副本的人免费许可
 *此软件和相关文档文件（“软件”），以进行交易
 *在软件中没有限制，包括但不限于权利
 *使用，复制，修改，合并，发布，分发，再许可和/或出售
 *软件的副本，并允许软件所在的人员
 *提供这样做，但须符合以下条件：
 *
 *上述版权声明和本许可声明均应包含在内
 *本软件的副本或实质部分。
 *
 *本软件按“原样”提供，不提供任何形式的保证，明示或
 *暗示，包括但不限于适销性保证，
 *适合特定用途和不侵犯。在任何情况下都不应该
 *作者或版权所有者对任何索赔，损害或其他责任均有责任
 *无论是合同，侵权行为还是其他行为，由此产生的责任，
 *在软件之外或与之相关的软件或其中的使用或其他交易
 *软件。
 * /
（功能（全球，工厂）{
	typeof exports ==='object'&& typeof module！=='undefined'？module.exports = factory（）：
	typeof define ==='function'&& define.amd？define（工厂）：
	（global.Popper = factory（））;
}（this，（function（）{'use strict';

var isBrowser = typeof window！=='undefined'&& typeof document！=='undefined';

var longerTimeoutBrowsers = ['Edge'，'Trident'，'Firefox'];
var timeoutDuration = 0;
for（var i = 0; i <longTimeoutBrowsers.length; i + = 1）{
  if（isBrowser && navigator.userAgent.indexOf（longerTimeoutBrowsers [i]）> = 0）{
    timeoutDuration = 1;
    打破;
  }
}

function microtaskDebounce（fn）{
  var called = false;
  return function（）{
    if（called）{
      返回;
    }
    叫=真;
    window.Promise.resolve（）。then（function（）{
      叫=假;
      FN（）;
    }）;
  };
}

function taskDebounce（fn）{
  var scheduled = false;
  return function（）{
    if（！scheduled）{
      scheduled = true;
      setTimeout（function（）{
        scheduled = false;
        FN（）;
      }，timeoutDuration）;
    }
  };
}

var supportsMicroTasks = isBrowser && window.Promise;

/ **
*创建一个异步推迟的方法的去抖动版本
*但在尽可能短的时间内召集。
*
* @方法
* @memberof Popper.Utils
* @argument {Function} fn
* @returns {功能}
* /
var debounce = supportsMicroTasks？microtaskDebounce：taskDebounce;

/ **
 *检查给定变量是否为函数
 * @方法
 * @memberof Popper.Utils
 * @argument {Any} functionToCheck  - 要检查的变量
 * @returns {Boolean}回答：是一个函数吗？
 * /
function isFunction（functionToCheck）{
  var getType = {};
  return functionToCheck && getType.toString.call（functionToCheck）==='[object Function]';
}

/ **
 *获取给定元素的CSS计算属性
 * @方法
 * @memberof Popper.Utils
 * @argument {Eement}元素
 * @argument {String}属性
 * /
function getStyleComputedProperty（element，property）{
  if（element.nodeType！== 1）{
    return [];
  }
  //注意：这里有1个DOM访问权限
  var css = getComputedStyle（element，null）;
  归还财产？css [property]：css;
}

/ **
 *返回parentNode或元素的主机
 * @方法
 * @memberof Popper.Utils
 * @argument {Element}元素
 * @returns {Element}父母
 * /
function getParentNode（element）{
  if（element.nodeName ==='HTML'）{
    返回元素;
  }
  return element.parentNode || element.host;
}

/ **
 *返回给定元素的滚动父级
 * @方法
 * @memberof Popper.Utils
 * @argument {Element}元素
 * @returns {Element}滚动父级
 * /
function getScrollParent（element）{
  //返回正文，`getScroll`将注意从中获取正确的`scrollTop`
  if（！element）{
    return document.body;
  }

  switch（element.nodeName）{
    案例'HTML'：
    案件'BODY'：
      return element.ownerDocument.body;
    案例'#document'：
      return element.body;
  }

  // Firefox希望我们也检查`-x`和`-y`变体

  var _getStyleComputedProp = getStyleComputedProperty（element），
      overflow = _getStyleComputedProp.overflow，
      overflowX = _getStyleComputedProp.overflowX，
      overflowY = _getStyleComputedProp.overflowY;

  if（/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX））{
    返回元素;
  }

  return getScrollParent（getParentNode（element））;
}

var isIE11 = isBrowser && !!（window.MSInputMethodContext && document.documentMode）;
var isIE10 = isBrowser && / MSIE 10 / .test（navigator.userAgent）;

/ **
 *确定浏览器是否为Internet Explorer
 * @方法
 * @memberof Popper.Utils
 * @param {Number}版本要检查
 * @returns {Boolean} isIE
 * /
function isIE（version）{
  if（version === 11）{
    返回isIE11;
  }
  if（version === 10）{
    返回isIE10;
  }
  返回isIE11 || isIE10;
}

/ **
 *返回给定元素的偏移父级
 * @方法
 * @memberof Popper.Utils
 * @argument {Element}元素
 * @returns {Element}偏移父级
 * /
function getOffsetParent（element）{
  if（！element）{
    return document.documentElement;
  }

  var noOffsetParent = isIE（10）？document.body：null;

  //注意：这里有1个DOM访问权限
  var offsetParent = element.offsetParent;
  //跳过没有offsetParent的隐藏元素
  while（offsetParent === noOffsetParent && element.nextElementSibling）{
    offsetParent =（element = element.nextElementSibling）.offsetParent;
  }

  var nodeName = offsetParent && offsetParent.nodeName;

  if（！nodeName || nodeName ==='BODY'|| nodeName ==='HTML'）{
    返回元素？element.ownerDocument.documentElement：document.documentElement;
  }

  // .offsetParent将返回最接近的TD或TABLE以防万一
  //没有offsetParent，我讨厌这份工作......
  if（['TD'，'TABLE']。indexOf（offsetParent.nodeName）！== -1 && getStyleComputedProperty（offsetParent，'position'）==='static'）{
    return getOffsetParent（offsetParent）;
  }

  return offsetParent;
}

function isOffsetContainer（element）{
  var nodeName = element.nodeName;

  if（nodeName ==='BODY'）{
    返回false;
  }
  return nodeName ==='HTML'|| getOffsetParent（element.firstElementChild）=== element;
}

/ **
 *查找给定元素的根节点（document，shadowDOM root）
 * @方法
 * @memberof Popper.Utils
 * @argument {Element}节点
 * @returns {Element}根节点
 * /
function getRoot（node）{
  if（node.parentNode！== null）{
    return getRoot（node.parentNode）;
  }

  返回节点;
}

/ **
 *查找两个提供的节点共有的偏移父级
 * @方法
 * @memberof Popper.Utils
 * @argument {Element} element1
 * @argument {Element} element2
 * @returns {Element}公共偏移父级
 * /
function findCommonOffsetParent（element1，element2）{
  //如果由于任何原因未定义其中一个元素，则需要进行此检查以避免错误
  if（！element1 ||！element1.nodeType ||！element2 ||！element2.nodeType）{
    return document.documentElement;
  }

  //这里我们确保将“开始”作为DOM中首先出现的元素
  var order = element1.compareDocumentPosition（element2）＆Node.DOCUMENT_POSITION_FOLLOWING;
  var start = order？element1：element2;
  var end = order？element2：element1;

  //获取共同的祖先容器
  var range = document.createRange（）;
  range.setStart（start，0）;
  range.setEnd（end，0）;
  var commonAncestorContainer = range.commonAncestorContainer;

  //两个节点都在#document中

  if（element1！== commonAncestorContainer && element2！== commonAncestorContainer || start.contains（end））{
    if（isOffsetContainer（commonAncestorContainer））{
      return commonAncestorContainer;
    }

    return getOffsetParent（commonAncestorContainer）;
  }

  //其中一个节点在shadowDOM内，找到哪一个
  var element1root = getRoot（element1）;
  if（element1root.host）{
    return findCommonOffsetParent（element1root.host，element2）;
  } else {
    return findCommonOffsetParent（element1，getRoot（element2）.host）;
  }
}

/ **
 *获取给定边（左上角）中给定元素的滚动值
 * @方法
 * @memberof Popper.Utils
 * @argument {Element}元素
 * @argument {String} side`top`或`left`
 * @returns {number}滚动像素数量
 * /
function getScroll（element）{
  var side = arguments.length> 1 && arguments [1]！== undefined？争论[1]：'顶';

  var upperSide = side ==='top'？'scrollTop'：'scrollLeft';
  var nodeName = element.nodeName;

  if（nodeName ==='BODY'|| nodeName ==='HTML'）{
    var html = element.ownerDocument.documentElement;
    var scrollingElement = element.ownerDocument.scrollingElement || HTML;
    return scrollingElement [upperSide];
  }

  return element [upperSide];
}

/ *
 *从给定的rect对象求和或减去元素滚动值（左和上）
 * @方法
 * @memberof Popper.Utils
 * @param {Object} rect  - 要更改的Rect对象
 * @param {HTMLElement}元素 - 函数中的元素读取滚动值
 * @param {Boolean} subtract  - 如果要减去滚动值，则设置为true
 * @return {Object} rect  - 修饰符rect对象
 * /
function includeScroll（rect，element）{
  var subtract = arguments.length> 2 && arguments [2]！== undefined？参数[2]：false;

  var scrollTop = getScroll（element，'top'）;
  var scrollLeft = getScroll（element，'left'）;
  var modifier =减去？-1：1;
  rect.top + = scrollTop *修饰符;
  rect.bottom + = scrollTop * modifier;
  rect.left + = scrollLeft *修饰符;
  rect.right + = scrollLeft * modifier;
  返回矩形;
}

/ *
 *助手检测给定元素的边界
 * @方法
 * @memberof Popper.Utils
 * @param {CSSStyleDeclaration}样式
 *给定元素上的`getStyleComputedProperty`结果
 * @param {String} axis  - `x`或`y`
 * @return {number} border  - 给定轴的边框大小
 * /

function getBordersSize（styles，axis）{
  var sideA = axis ==='x'？'左'：'顶';
  var sideB = sideA ==='左'？'正确'：'底部';

  return parseFloat（styles ['border'+ sideA +'Width']，10）+ parseFloat（styles ['border'+ sideB +'Width']，10）;
}

function getSize（axis，body，html，computedStyle）{
  返回Math.max（body ['offset'+ axis]，body ['scroll'+ axis]，html ['client'+ axis]，html ['offset'+ axis]，html ['scroll'+ axis]， isIE（10）？parseInt（html ['offset'+ axis]）+ parseInt（computedStyle ['margin'+（axis ==='Height'？'Top'：'left'）]）+ parseInt（computedStyle [' margin'+（axis ==='Height'？'Bottom'：'right'）]）：0）;
}

function getWindowSizes（document）{
  var body = document.body;
  var html = document.documentElement;
  var computedStyle = isIE（10）&& getComputedStyle（html）;

  返回{
    height：getSize（'Height'，body，html，computedStyle），
    width：getSize（'Width'，body，html，computedStyle）
  };
}

var classCallCheck = function（instance，Constructor）{
  if（！（instance instanceof Constructor））{
    抛出新的TypeError（“不能将类称为函数”）;
  }
};

var createClass = function（）{
  function defineProperties（target，props）{
    for（var i = 0; i <props.length; i ++）{
      var descriptor = props [i];
      descriptor.enumerable = descriptor.enumerable || 假;
      descriptor.configurable = true;
      if（描述符中的“value”）descriptor.writable = true;
      Object.defineProperty（target，descriptor.key，descriptor）;
    }
  }

  return函数（Constructor，protoProps，staticProps）{
    if（protoProps）defineProperties（Constructor.prototype，protoProps）;
    if（staticProps）defineProperties（Constructor，staticProps）;
    return构造函数;
  };
}（）;





var defineProperty = function（obj，key，value）{
  if（键入obj）{
    Object.defineProperty（obj，key，{
      价值：价值，
      可枚举的：是的，
      可配置：true，
      可写的：真的
    }）;
  } else {
    obj [key] = value;
  }

  返回obj;
};

var _extends = Object.assign || function（target）{
  for（var i = 1; i <arguments.length; i ++）{
    var source = arguments [i];

    for（源代码中的var键）{
      if（Object.prototype.hasOwnProperty.call（source，key））{
        target [key] = source [key];
      }
    }
  }

  回归目标;
};

/ **
 *给定元素偏移量，生成类似于getBoundingClientRect的输出
 * @方法
 * @memberof Popper.Utils
 * @argument {Object}偏移量
 * @returns {Object} ClientRect就像输出一样
 * /
function getClientRect（offsets）{
  return _extends（{}，offsets，{
    右：offsets.left + offsets.width，
    bottom：offsets.top + offsets.height
  }）;
}

/ **
 *获取给定元素的边界客户端rect
 * @方法
 * @memberof Popper.Utils
 * @param {HTMLElement}元素
 * @return {Object}客户端rect
 * /
function getBoundingClientRect（element）{
  var rect = {};

  // IE10 10 FIX：请不要问，元素不是
  //在某些情况下在DOM中考虑过......
  //这在IE11的IE10兼容模式下不可重现
  尝试{
    if（isIE（10））{
      rect = element.getBoundingClientRect（）;
      var scrollTop = getScroll（element，'top'）;
      var scrollLeft = getScroll（element，'left'）;
      rect.top + = scrollTop;
      rect.left + = scrollLeft;
      rect.bottom + = scrollTop;
      rect.right + = scrollLeft;
    } else {
      rect = element.getBoundingClientRect（）;
    }
  } catch（e）{}

  var result = {
    左：rect.left，
    顶部：rect.top，
    width：rect.right  -  rect.left，
    height：rect.bottom  -  rect.top
  };

  //从大小中减去滚动条大小
  var sizes = element.nodeName ==='HTML'？getWindowSizes（element.ownerDocument）：{};
  var width = sizes.width || element.clientWidth || result.right  -  result.left;
  var height = sizes.height || element.clientHeight || result.bottom  -  result.top;

  var horizScrollbar = element.offsetWidth  -  width;
  var vertScrollbar = element.offsetHeight  -  height;

  //如果检测到假想的滚动条，我们必须确定它不是“边界”
  //出于性能原因，我们将此检查作为条件
  if（horizScrollbar || vertScrollbar）{
    var styles = getStyleComputedProperty（element）;
    horizScrollbar  -  = getBordersSize（styles，'x'）;
    vertScrollbar  -  = getBordersSize（styles，'y'）;

    result.width  -  = horizScrollbar;
    result.height  -  = vertScrollbar;
  }

  return getClientRect（result）;
}

function getOffsetRectRelativeToArbitraryNode（children，parent）{
  var fixedPosition = arguments.length> 2 && arguments [2]！== undefined？参数[2]：false;

  var isIE10 = isIE（10）;
  var isHTML = parent.nodeName ==='HTML';
  var childrenRect = getBoundingClientRect（children）;
  var parentRect = getBoundingClientRect（parent）;
  var scrollParent = getScrollParent（children）;

  var styles = getStyleComputedProperty（parent）;
  var borderTopWidth = parseFloat（styles.borderTopWidth，10）;
  var borderLeftWidth = parseFloat（styles.borderLeftWidth，10）;

  //如果父项是固定的，我们必须忽略偏移计算中的负滚动
  if（fixedPosition && isHTML）{
    parentRect.top = Math.max（parentRect.top，0）;
    parentRect.left = Math.max（parentRect.left，0）;
  }
  var offsets = getClientRect（{
    top：childrenRect.top  -  parentRect.top  -  borderTopWidth，
    left：childrenRect.left  -  parentRect.left  -  borderLeftWidth，
    width：childrenRect.width，
    身高：childrenRect.height
  }）;
  offsets.marginTop = 0;
  offsets.marginLeft = 0;

  //减去documentElement的边距，以防它被用作父级
  //我们只在HTML上执行此操作，因为它是唯一的行为元素
  //当边距应用于它时不同。保证金包括在内
  // documentElement的框，在其他情况下不是。
  if（！isIE10 && isHTML）{
    var marginTop = parseFloat（styles.marginTop，10）;
    var marginLeft = parseFloat（styles.marginLeft，10）;

    offsets.top  -  = borderTopWidth  -  marginTop;
    offsets.bottom  -  = borderTopWidth  -  marginTop;
    offsets.left  -  = borderLeftWidth  -  marginLeft;
    offsets.right  -  = borderLeftWidth  -  marginLeft;

    //附上marginTop和marginLeft，因为在某些情况下我们可能需要它们
    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }

  if（isIE10 &&！fixedPosition？parent.contains（scrollParent）：parent === scrollParent && scrollParent.nodeName！=='BODY'）{
    offsets = includeScroll（offsets，parent）;
  }

  返回抵消;
}

function getViewportOffsetRectRelativeToArtbitraryNode（element）{
  var excludeScroll = arguments.length> 1 && arguments [1]！== undefined？参数[1]：false;

  var html = element.ownerDocument.documentElement;
  var relativeOffset = getOffsetRectRelativeToArbitraryNode（element，html）;
  var width = Math.max（html.clientWidth，window.innerWidth || 0）;
  var height = Math.max（html.clientHeight，window.innerHeight || 0）;

  var scrollTop =！excludeScroll？getScroll（html）：0;
  var scrollLeft =！excludeScroll？getScroll（html，'left'）：0;

  var offset = {
    top：scrollTop  -  relativeOffset.top + relativeOffset.marginTop，
    left：scrollLeft  -  relativeOffset.left + relativeOffset.marginLeft，
    宽度：宽度，
    身高：身高
  };

  return getClientRect（offset）;
}

/ **
 *检查给定元素是固定的还是固定的父元素
 * @方法
 * @memberof Popper.Utils
 * @argument {Element}元素
 * @argument {Element} customContainer
 * @returns {Boolean}回答“isFixed？”
 * /
function isFixed（element）{
  var nodeName = element.nodeName;
  if（nodeName ==='BODY'|| nodeName ==='HTML'）{
    返回false;
  }
  if（getStyleComputedProperty（element，'position'）==='fixed'）{
    返回true;
  }
  return isFixed（getParentNode（element））;
}

/ **
 *查找已定义转换属性的元素的第一个父元素
 * @方法
 * @memberof Popper.Utils
 * @argument {Element}元素
 * @returns {Element}首先转换了parent或documentElement
 * /

function getFixedPositionOffsetParent（element）{
  //如果由于任何原因未定义其中一个元素，则需要进行此检查以避免错误
  if（！element ||！element.parentElement || isIE（））{
    return document.documentElement;
  }
  var el = element.parentElement;
  while（el && getStyleComputedProperty（el，'transform'）==='none'）{
    el = el.parentElement;
  }
  返回el || document.documentElement中;
}

/ **
 *计算边界限制并返回它们
 * @方法
 * @memberof Popper.Utils
 * @param {HTMLElement} popper
 * @param {HTMLElement}参考
 * @param {number}填充
 * @param {HTMLElement} boundaryElement  - 用于定义边界的元素
 * @param {Boolean} fixedPosition  - 处于固定位置模式
 * @returns {Object}边界的坐标
 * /
function getBoundaries（popper，reference，padding，boundariesElement）{
  var fixedPosition = arguments.length> 4 && arguments [4]！== undefined？争论[4]：错误;

  //注意：这里有1个DOM访问权限

  var boundary = {top：0，left：0};
  var offsetParent = fixedPosition？getFixedPositionOffsetParent（popper）：findCommonOffsetParent（popper，reference）;

  //处理视口大小写
  if（boundariesElement ==='viewport'）{
    boundary = getViewportOffsetRectRelativeToArtbitraryNode（offsetParent，fixedPosition）;
  } else {
    //根据用作边界的DOM元素处理其他情况
    var boundariesNode = void 0;
    if（bordersElement ==='scrollParent'）{
      boundariesNode = getScrollParent（getParentNode（reference））;
      if（bordersNode.nodeName ==='BODY'）{
        boundariesNode = popper.ownerDocument.documentElement;
      }
    } else if（boundariesElement ==='window'）{
      boundariesNode = popper.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }

    var offsets = getOffsetRectRelativeToArbitraryNode（boundariesNode，offsetParent，fixedPosition）;

    //对于HTML，我们需要一个不同的计算
    if（bordersNode.nodeName ==='HTML'&&！isFixed（offsetParent））{
      var _getWindowSizes = getWindowSizes（popper.ownerDocument），
          height = _getWindowSizes.height，
          width = _getWindowSizes.width;

      boundaries.top + = offsets.top  -  offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left + = offsets.left  -  offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      //对于所有其他DOM元素，这个很好
      boundary = offsets;
    }
  }

  //添加填充
  padding = padding || 0;
  var isPaddingNumber = typeof padding ==='number';
  boundary.left + = isPaddingNumber？padding：padding.left || 0;
  borders.top + = isPaddingNumber？padding：padding.top || 0;
  borders.right  -  = isPaddingNumber？padding：padding.right || 0;
  boundaries.bottom  -  = isPaddingNumber？padding：padding.bottom || 0;

  回归边界;
}

function getArea（_ref）{
  var width = _ref.width，
      height = _ref.height;

  返回宽度*高度;
}

/ **
 *实用程序用于将`auto`展示位置转换为展示位置
 * 可用空间。
 * @方法
 * @memberof Popper.Utils
 * @argument {Object} data  -  update方法生成的数据对象
 * @argument {Object}选项 - 修饰符配置和选项
 * @returns {Object}正确修改的数据对象
 * /
function computeAutoPlacement（placement，refRect，popper，reference，boundariesElement）{
  var padding = arguments.length> 5 && arguments [5]！== undefined？参数[5]：0;

  if（placement.indexOf（'auto'）=== -1）{
    返回安置;
  }

  var boundaries = getBoundaries（popper，reference，padding，bordersElement）;

  var rects = {
    最佳： {
      width：boundaries.width，
      height：refRect.top  -  borders.top
    }，
    对： {
      width：boundaries.right  -  refRect.right，
      高度：boundary.height
    }，
    底部：{
      width：boundaries.width，
      height：boundaries.bottom  -  refRect.bottom
    }，
    剩下： {
      width：refRect.left  -  boundaries.left，
      高度：boundary.height
    }
  };

  var sortedAreas = Object.keys（rects）.map（function（key）{
    return _extends（{
      关键：关键
    }，rects [key]，{
      area：getArea（rects [key]）
    }）;
  }）。sort（function（a，b）{
    返回b.area  -  a.area;
  }）;

  var filteredAreas = sortedAreas.filter（function（_ref2）{
    var width = _ref2.width，
        height = _ref2.height;
    返回宽度> = popper.clientWidth && height> = popper.clientHeight;
  }）;

  var computedPlacement = filteredAreas.length> 0？filteredAreas [0] .key：sortedAreas [0] .key;

  var variation = placement.split（' - '）[1];

  return computedPlacement +（变体？' - '+变化：''）;
}

/ **
 *获取参考元素的偏移量
 * @方法
 * @memberof Popper.Utils
 * @param {Object}状态
 * @param {Element} popper  -  popper元素
 * @param {Element}引用 - 引用元素（popper将与此相关）
 * @param {Element} fixedPosition  - 处于固定位置模式
 * @returns {Object}包含将应用于popper的偏移量的对象
 * /
function getReferenceOffsets（state，popper，reference）{
  var fixedPosition = arguments.length> 3 && arguments [3]！== undefined？arguments [3]：null;

  var commonOffsetParent = fixedPosition？getFixedPositionOffsetParent（popper）：findCommonOffsetParent（popper，reference）;
  return getOffsetRectRelativeToArbitraryNode（reference，commonOffsetParent，fixedPosition）;
}

/ **
 *获取给定元素的外部大小（偏移大小+边距）
 * @方法
 * @memberof Popper.Utils
 * @argument {Element}元素
 * @returns {Object}对象包含width和height属性
 * /
function getOuterSizes（element）{
  var styles = getComputedStyle（element）;
  var x = parseFloat（styles.marginTop）+ parseFloat（styles.marginBottom）;
  var y = parseFloat（styles.marginLeft）+ parseFloat（styles.marginRight）;
  var result = {
    width：element.offsetWidth + y，
    height：element.offsetHeight + x
  };
  返回结果;
}

/ **
 *得到给定的一个相反的位置
 * @方法
 * @memberof Popper.Utils
 * @argument {String}展示位置
 * @returns {String}翻转展示位置
 * /
function getOppositePlacement（placement）{
  var hash = {left：'right'，right：'left'，bottom：'top'，top：'bottom'};
  return placement.replace（/ left | right | bottom | top / g，function（matched）{
    return hash [matched];
  }）;
}

/ **
 *获得波普尔的抵消
 * @方法
 * @memberof Popper.Utils
 * @param {Object} position  - 将应用Popper的CSS位置
 * @param {HTMLElement} popper  -  popper元素
 * @param {Object} referenceOffsets  - 引用偏移量（popper将与此相关）
 * @param {String}展示位置 - 有效展示位置选项之一
 * @returns {Object} popperOffsets  - 包含将应用于popper的偏移量的对象
 * /
function getPopperOffsets（popper，referenceOffsets，placement）{
  placement = placement.split（' - '）[0];

  //获取popper节点大小
  var popperRect = getOuterSizes（popper）;

  //为我们的偏移对象添加位置，宽度和高度
  var popperOffsets = {
    width：popperRect.width，
    height：popperRect.height
  };

  //取决于popper的位置，我们必须略微区别地计算其偏移量
  var isHoriz = ['right'，'left']。indexOf（placement）！== -1;
  var mainSide = isHoriz？'左上方';
  var secondarySide = isHoriz？'left'：'top';
  var measurement = isHoriz？'高度宽度';
  var secondaryMeasurement =！isHoriz？'高度宽度';

  popperOffsets [mainSide] = referenceOffsets [mainSide] + referenceOffsets [measurement] / 2  -  popperRect [measurement] / 2;
  if（placement === secondarySide）{
    popperOffsets [secondarySide] = referenceOffsets [secondarySide]  -  popperRect [secondaryMeasurement];
  } else {
    popperOffsets [secondarySide] = referenceOffsets [getOppositePlacement（secondarySide）];
  }

  return popperOffsets;
}

/ **
 *模仿Array的`find`方法
 * @方法
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument道具
 * @argument值
 * @returns index或-1
 * /
function find（arr，check）{
  //如果支持，请使用本机查找
  if（Array.prototype.find）{
    return arr.find（check）;
  }

  //使用`filter`来获得`find`的相同行为
  return arr.filter（check）[0];
}

/ **
 *返回匹配对象的索引
 * @方法
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument道具
 * @argument值
 * @returns index或-1
 * /
function findIndex（arr，prop，value）{
  //如果支持，请使用本机findIndex
  if（Array.prototype.findIndex）{
    return arr.findIndex（function（cur）{
      return cur [prop] === value;
    }）;
  }

  //如果不支持`findIndex`，请使用`find` +`indexOf`
  var match = find（arr，function（obj）{
    return obj [prop] === value;
  }）;
  return arr.indexOf（match）;
}

/ **
 *循环修改器列表并按顺序运行它们，
 *然后他们每个人都会编辑数据对象。
 * @方法
 * @memberof Popper.Utils
 * @param {dataObject}数据
 * @param {Array}修饰符
 * @param {String} ends  - 用作限制器的可选修饰符名称
 * @returns {dataObject}
 * /
function runModifiers（修饰符，数据，结尾）{
  var modifiersToRun = ends === undefined？修饰符：modifiers.slice（0，findIndex（modifiers，'name'，ends））;

  modifiersToRun.forEach（function（modifier）{
    if（modifier ['function']）{
      // eslint-disable-line dot-notation
      console.warn（'``modifier.function`已弃用，请使用`modifier.fn`！'）;
    }
    var fn = modifier ['function'] || modifier.fn; // eslint-disable-line dot-notation
    if（modifier.enabled && isFunction（fn））{
      //向偏移添加属性以使其成为完整的clientRect对象
      //我们在每个修饰符之前执行此操作以确保前一个修饰符不会
      //弄乱这些价值观
      data.offsets.popper = getClientRect（data.offsets.popper）;
      data.offsets.reference = getClientRect（data.offsets.reference）;

      data = fn（数据，修饰符）;
    }
  }）;

  返回数据;
}

/ **
 *更新波普尔的位置，计算新的偏移和应用
 *新风格。<br />
 *由于性能原因，首选`scheduleUpdate`而不是`update`。
 * @方法
 * @memberof Popper
 * /
function update（）{
  //如果popper被破坏，请不要执行任何进一步的更新
  if（this.state.isDestroyed）{
    返回;
  }

  var data = {
    实例：这个，
    风格：{}，
    arrowStyles：{}，
    属性：{}，
    翻转：假，
    抵消：{}
  };

  //计算参考元素偏移量
  data.offsets.reference = getReferenceOffsets（this.state，this.popper，this.reference，this.options.positionFixed）;

  //计算自动展示位置，在数据对象中存储展示位置，
  //修饰符将能够根据需要编辑`placement`
  //并引用originalPlacement来了解原始值
  data.placement = computeAutoPlacement（this.options.placement，data.offsets.reference，this.popper，this.reference，this.options.modifiers.flip.boundariesElement，this.options.modifiers.flip.padding）;

  //将计算出的展示位置存储在`originalPlacement`中
  data.originalPlacement = data.placement;

  data.positionFixed = this.options.positionFixed;

  //计算popper偏移量
  data.offsets.popper = getPopperOffsets（this.popper，data.offsets.reference，data.placement）;

  data.offsets.popper.position = this.options.positionFixed？'固定'：'绝对';

  //运行修饰符
  data = runModifiers（this.modifiers，data）;

  //第一个`update`将调用`onCreate`回调
  //其他人将调用`onUpdate`回调
  if（！this.state.isCreated）{
    this.state.isCreated = true;
    this.options.onCreate（数据）;
  } else {
    this.options.onUpdate（数据）;
  }
}

/ **
 * Helper用于知道是否启用了给定的修饰符。
 * @方法
 * @memberof Popper.Utils
 * @returns {Boolean}
 * /
function isModifierEnabled（modifiers，modifierName）{
  return modifiers.some（function（_ref）{
    var name = _ref.name，
        enabled = _ref.enabled;
    return enabled && name === modifierName;
  }）;
}

/ **
 *获取带前缀的受支持属性名称
 * @方法
 * @memberof Popper.Utils
 * @argument {String}属性（camelCase）
 * @returns {String}前缀属性（camelCase或PascalCase，具体取决于供应商前缀）
 * /
function getSupportedPropertyName（property）{
  var prefixes = [false，'ms'，'Webkit'，'Moz'，'O'];
  var upperProp = property.charAt（0）.toUpperCase（）+ property.slice（1）;

  for（var i = 0; i <prefixes.length; i ++）{
    var prefix = prefixes [i];
    var toCheck =前缀？''+ prefix + upperProp：property;
    if（typeof document.body.style [toCheck]！=='undefined'）{
      返回检查;
    }
  }
  return null;
}

/ **
 *摧毁波普尔。
 * @方法
 * @memberof Popper
 * /
function destroy（）{
  this.state.isDestroyed = true;

  //仅当启用`applyStyle`修饰符时才触摸DOM
  if（isModifierEnabled（this.modifiers，'applyStyle'））{
    this.popper.removeAttribute（ '的x位置'）;
    this.popper.style.position ='';
    this.popper.style.top ='';
    this.popper.style.left ='';
    this.popper.style.right ='';
    this.popper.style.bottom ='';
    this.popper.style.willChange ='';
    this.popper.style [getSupportedPropertyName（'transform'）] ='';
  }

  this.disableEventListeners（）;

  //如果用户明确要求在destroy上删除，请删除popper
  //不要使用`remove`，因为IE11不支持它
  if（this.options.removeOnDestroy）{
    this.popper.parentNode.removeChild（this.popper）;
  }
  归还这个;
}

/ **
 *获取与元素关联的窗口
 * @argument {Element}元素
 * @returns {Window}
 * /
function getWindow（element）{
  var ownerDocument = element.ownerDocument;
  return ownerDocument？ownerDocument.defaultView：window;
}

function attachToScrollParents（scrollParent，event，callback，scrollParents）{
  var isBody = scrollParent.nodeName ==='BODY';
  var target = isBody？scrollParent.ownerDocument.defaultView：scrollParent;
  target.addEventListener（event，callback，{passive：true}）;

  if（！isBody）{
    attachToScrollParents（getScrollParent（target.parentNode），event，callback，scrollParents）;
  }
  scrollParents.push（目标）;
}

/ **
 *安装所需的事件监听器用于更新popper位置
 * @方法
 * @memberof Popper.Utils
 * @私人的
 * /
function setupEventListeners（reference，options，state，updateBound）{
  //在窗口上调整事件监听器的大小
  state.updateBound = updateBound;
  getWindow（reference）.addEventListener（'resize'，state.updateBound，{passive：true}）;

  //滚动父项上的滚动事件侦听器
  var scrollElement = getScrollParent（reference）;
  attachToScrollParents（scrollElement，'scroll'，state.updateBound，state.scrollParents）;
  state.scrollElement = scrollElement;
  state.eventsEnabled = true;

  返回状态;
}

/ **
 *它将添加调整大小/滚动事件并开始重新计算
 *触发时popper元素的位置。
 * @方法
 * @memberof Popper
 * /
function enableEventListeners（）{
  if（！this.state.eventsEnabled）{
    this.state = setupEventListeners（this.reference，this.options，this.state，this.scheduleUpdate）;
  }
}

/ **
 *删除用于更新popper位置的事件侦听器
 * @方法
 * @memberof Popper.Utils
 * @私人的
 * /
function removeEventListeners（reference，state）{
  //在窗口中删除resize事件侦听器
  getWindow（reference）.removeEventListener（'resize'，state.updateBound）;

  //删除滚动父项上的滚动事件监听器
  state.scrollParents.forEach（function（target）{
    target.removeEventListener（'scroll'，state.updateBound）;
  }）;

  //重置状态
  state.updateBound = null;
  state.scrollParents = [];
  state.scrollElement = null;
  state.eventsEnabled = false;
  返回状态;
}

/ **
 *它将删除调整大小/滚动事件，不会重新计算波普尔位置
 *当它们被触发时。它也不会再触发`onUpdate`回调，
 *除非你手动调用`update`方法。
 * @方法
 * @memberof Popper
 * /
function disableEventListeners（）{
  if（this.state.eventsEnabled）{
    cancelAnimationFrame（this.scheduleUpdate）;
    this.state = removeEventListeners（this.reference，this.state）;
  }
}

/ **
 *告知给定输入是否为数字
 * @方法
 * @memberof Popper.Utils
 * @param {*}输入检查
 * @return {Boolean}
 * /
function isNumeric（n）{
  return n！==''&&！isNaN（parseFloat（n））&& isFinite（n）;
}

/ **
 *将样式设置为给定的popper
 * @方法
 * @memberof Popper.Utils
 * @argument {Element}元素 - 要应用样式的元素
 * @argument {Object}样式
 *具有将应用于元素的属性和值列表的对象
 * /
function setStyles（element，styles）{
  Object.keys（styles）.forEach（function（prop）{
    var unit ='';
    //如果值为数字，则添加单位，并且是以下之一
    if（['width'，'height'，'top'，'right'，'bottom'，'left']。indexOf（prop）！== -1 && isNumeric（styles [prop]））{
      unit ='px';
    }
    element.style [prop] = styles [prop] + unit;
  }）;
}

/ **
 *将属性设置为给定的popper
 * @方法
 * @memberof Popper.Utils
 * @argument {Element}元素 - 要应用属性的元素
 * @argument {Object}样式
 *具有将应用于元素的属性和值列表的对象
 * /
function setAttributes（element，attributes）{
  Object.keys（attributes）.forEach（function（prop）{
    var value = attributes [prop];
    if（value！== false）{
      element.setAttribute（prop，attributes [prop]）;
    } else {
      element.removeAttribute（丙）;
    }
  }）;
}

/ **
 * @function
 * @memberof修饰符
 * @argument {Object} data  - `update`方法生成的数据对象
 * @argument {Object} data.styles  - 样式属性列表 - 要应用于popper元素的值
 * @argument {Object} data.attributes  - 属性属性列表 - 要应用于popper元素的值
 * @argument {Object}选项 - 修饰符配置和选项
 * @returns {Object}相同的数据对象
 * /
function applyStyle（data）{
  //`data.styles`中存在的任何属性都将应用于popper，
  //通过这种方式，我们可以让第三方修改器为其添加自定义样式
  //请注意，修饰符可以覆盖前面定义的属性
  //这个修饰符的行！
  setStyles（data.instance.popper，data.styles）;

  //`data.attributes`中存在的任何属性都将应用于popper，
  //它们将被设置为元素的HTML属性
  setAttributes（data.instance.popper，data.attributes）;

  //如果定义了arrowElement并且arrowStyles有一些属性
  if（data.arrowElement && Object.keys（data.arrowStyles）.length）{
    setStyles（data.arrowElement，data.arrowStyles）;
  }

  返回数据;
}

/ **
 *在其他所有内容之前设置x-placement属性，因为它可以使用
 *要为popper边距添加边距需要计算得到
 *正确的波普尔偏移量。
 * @方法
 * @memberof Popper.modifiers
 * @param {HTMLElement} reference  - 用于定位popper的引用元素
 * @param {HTMLElement} popper  - 用作popper的HTML元素
 * @param {Object}选项 -  Popper.js选项
 * /
function applyStyleOnLoad（reference，popper，options，modifierOptions，state）{
  //计算参考元素偏移量
  var referenceOffsets = getReferenceOffsets（state，popper，reference，options.positionFixed）;

  //计算自动展示位置，在数据对象中存储展示位置，
  //修饰符将能够根据需要编辑`placement`
  //并引用originalPlacement来了解原始值
  var placement = computeAutoPlacement（options.placement，referenceOffsets，popper，reference，options.modifiers.flip.boundariesElement，options.modifiers.flip.padding）;

  popper.setAttribute（'x-placement'，placement）;

  //之前将'position`应用于popper，因为
  //没有应用位置我们无法保证正确的计算
  setStyles（popper，{position：options.positionFixed？'fixed'：'absolute'}）;

  回报选项;
}

/ **
 * @function
 * @memberof修饰符
 * @argument {Object} data  - `update`方法生成的数据对象
 * @argument {Object}选项 - 修饰符配置和选项
 * @returns {Object}正确修改的数据对象
 * /
function computeStyle（data，options）{
  var x = options.x，
      y = options.y;
  var popper = data.offsets.popper;

  //在Popper.js v2中删除此旧版支持

  var legacyGpuAccelerationOption = find（data.instance.modifiers，function（modifier）{
    return modifier.name ==='applyStyle';
  }）gpuAcceleration;
  if（legacyGpuAccelerationOption！== undefined）{
    console.warn（'警告：'gpuAcceleration`选项移动到`computeStyle`修饰符，在将来的Popper.js版本中不支持！'）;
  }
  var gpuAcceleration = legacyGpuAccelerationOption！== undefined？legacyGpuAccelerationOption：options.gpuAcceleration;

  var offsetParent = getOffsetParent（data.instance.popper）;
  var offsetParentRect = getBoundingClientRect（offsetParent）;

  //样式
  var styles = {
    position：popper.position
  };

  //使用全像素整数避免模糊文本。
  //对于像素完美定位，顶部/底部更喜欢圆形
  //值，而left / right更喜欢floored值。
  var offsets = {
    left：Math.floor（popper.left），
    顶部：Math.round（popper.top），
    bottom：Math.round（popper.bottom），
    右：Math.floor（popper.right）
  };

  var sideA = x ==='bottom'？'top'：'bottom';
  var sideB = y ==='right'？'左右';

  //如果gpuAcceleration设置为“true”并且支持transform，
  //我们使用`translate3d`将位置应用于popper我们
  //如果需要，自动使用支持的前缀版本
  var prefixedProperty = getSupportedPropertyName（'transform'）;

  //现在，让我们退后一步，仔细看看这段代码（wtf？）
  //如果popper的内容一旦定位就会增长，那就是它
  //可能会因为新内容而导致popper错位
  //溢出其引用元素
  //为了避免这个问题，我们提供了两个允许的选项（x和y）
  //消费者定义偏移原点。
  //如果我们将一个popper放在一个引用元素的顶部，我们可以设置
  //`x`到`top`使popper朝顶部而不是顶部生长
  //它的底部
  var left = void 0，
      top = void 0;
  if（sideA ==='bottom'）{
    //当offsetParent为<html>时，定位相对于屏幕底部（不包括滚动条）
    //而不是html元素的底部
    if（offsetParent.nodeName ==='HTML'）{
      top = -offsetParent.clientHeight + offsets.bottom;
    } else {
      top = -offsetParentRect.height + offsets.bottom;
    }
  } else {
    top = offsets.top;
  }
  if（sideB ==='right'）{
    if（offsetParent.nodeName ==='HTML'）{
      left = -offsetParent.clientWidth + offsets.right;
    } else {
      left = -offsetParentRect.width + offsets.right;
    }
  } else {
    left = offsets.left;
  }
  if（gpuAcceleration && prefixedProperty）{
    styles [prefixedProperty] ='translate3d（'+ left +'px，'+ top +'px，0）';
    styles [sideA] = 0;
    styles [sideB] = 0;
    styles.willChange ='transform';
  } else {
    // othwerise，我们使用标准的`top`，`left`，`bottom`和`right`属性
    var invertTop = sideA ==='bottom'？-1：1;
    var invertLeft = sideB ==='right'？-1：1;
    styles [sideA] = top * invertTop;
    styles [sideB] = left * invertLeft;
    styles.willChange = sideA +'，'+ sideB;
  }

  //属性
  var attributes = {
    'x-placement'：data.placement
  };

  //更新`data`属性，样式和arrowStyles
  data.attributes = _extends（{}，attributes，data.attributes）;
  data.styles = _extends（{}，styles，data.styles）;
  data.arrowStyles = _extend（{}，data.offsets.arrow，data.arrowStyles）;

  返回数据;
}

/ **
 *助手曾经知道给定的修饰符是否来自另一个。<br />
 *它检查是否列出并启用了所需的修饰符。
 * @方法
 * @memberof Popper.Utils
 * @param {Array}修饰符 - 修饰符列表
 * @param {String} requesNameName  - 请求修饰符的名称
 * @param {String} requestedName  - 请求的修饰符的名称
 * @returns {Boolean}
 * /
function isModifierRequired（modifiers，requestedName，requestedName）{
  var requests = find（modifiers，function（_ref）{
    var name = _ref.name;
    返回名称=== requestsName;
  }）;

  var isRequired = !! requests && modifiers.some（function（modifier）{
    return modifier.name === requestedName && modifier.enabled && modifier.order <reques.order;
  }）;

  if（！isRequired）{
    var _requesting ='''+ requesName +''';
    var requested ='`'+ requestedName +'`';
    console.warn（'+ _requesting +'修饰符需要'request +'修饰符才能工作，请确保在'+ _requesting +'！'之前包含它）;
  }
  return isRequired;
}

/ **
 * @function
 * @memberof修饰符
 * @argument {Object} data  -  update方法生成的数据对象
 * @argument {Object}选项 - 修饰符配置和选项
 * @returns {Object}正确修改的数据对象
 * /
功能箭头（数据，选项）{
  var _data $ offsets $ arrow;

  //箭头取决于keepTogether以便工作
  if（！isModifierRequired（data.instance.modifiers，'arrow'，'keepTogether'））{
    返回数据;
  }

  var arrowElement = options.element;

  //如果arrowElement是一个字符串，假设它是一个CSS选择器
  if（typeof arrowElement ==='string'）{
    arrowElement = data.instance.popper.querySelector（arrowElement）;

    //如果未找到arrowElement，请不要运行修饰符
    if（！arrowElement）{
      返回数据;
    }
  } else {
    //如果arrowElement不是查询选择器，我们必须检查
    //提供的DOM节点是其popper节点的子节点
    if（！data.instance.popper.contains（arrowElement））{
      console.warn（'警告：`arrow.element`必须是其popper元素的子元素！'）;
      返回数据;
    }
  }

  var placement = data.placement.split（' - '）[0];
  var _data $ offsets = data.offsets，
      popper = _data $ offsets.popper，
      reference = _data $ offsets.reference;

  var isVertical = ['left'，'right'] .indexOf（placement）！== -1;

  var len = isVertical？'高度宽度';
  var sideCapitalized = isVertical？'左上方';
  var side = sideCapitalized.toLowerCase（）;
  var altSide = isVertical？'left'：'top';
  var opSide = isVertical？'bottom'：'right';
  var arrowElementSize = getOuterSizes（arrowElement）[len];

  //
  //扩展keepTogether行为，确保popper及其
  //引用有足够的像素
  //

  //顶部/左侧
  if（reference [opSide]  -  arrowElementSize <popper [side]）{
    data.offsets.popper [side]  -  = popper [side]  - （reference [opSide]  -  arrowElementSize）;
  }
  //底部/右侧
  if（reference [side] + arrowElementSize> popper [opSide]）{
    data.offsets.popper [side] + = reference [side] + arrowElementSize  -  popper [opSide];
  }
  data.offsets.popper = getClientRect（data.offsets.popper）;

  //计算popper的中心
  var center = reference [side] + reference [len] / 2  -  arrowElementSize / 2;

  //使用更新的popper偏移量计算sideValue
  //在帐户中使用popper保证金，因为我们没有此信息
  var css = getStyleComputedProperty（data.instance.popper）;
  var popperMarginSide = parseFloat（css ['margin'+ sideCapitalized]，10）;
  var popperBorderSide = parseFloat（css ['border'+ sideCapitalized +'Width']，10）;
  var sideValue = center  -  data.offsets.popper [side]  -  popperMarginSide  -  popperBorderSide;

  //防止arrowElement与其popper不连续放置
  sideValue = Math.max（Math.min（popper [len]  -  arrowElementSize，sideValue），0）;

  data.arrowElement = arrowElement;
  data.offsets.arrow =（_ data $ offsets $ arrow = {}，defineProperty（_data $ offsets $ arrow，side，Math.round（sideValue）），defineProperty（_data $ offsets $ arrow，altSide，''），_ data $偏移$箭头）;

  返回数据;
}

/ **
 *获得给定位置的相反位置变化
 * @方法
 * @memberof Popper.Utils
 * @argument {String}展示位置变体
 * @returns {String}翻转了展示位置变体
 * /
function getOppositeVariation（variation）{
  if（variation ==='end'）{
    返回'开始';
  } else if（variation ==='start'）{
    返回'结束';
  }
  回报变化;
}

/ **
 *被接受的展示位置列表，用作“展示位置”选项的值。<br />
 *有效的展示位置是：
 *  - `auto`
 *  - `top`
 *  - “正确”
 *  - `bottom`
 *  - `left`
 *
 *每个展示位置都可以与此列表有所不同：
 *  - `-start`
 *  - `-end`
 *
 *如果您将它们视为从左到右，则可以轻松解释变体
 *书面语言。水平（`top`和`bottom`），`start`左边和`end`
 *是对的。<br />
 *垂直（“左”和“右”），“开始”是顶部，“结束”是底部。
 *
 *一些有效的例子是：
 *  - `top-end`（在参考之上，右对齐）
 *  - “右开始”（在参考右侧，顶部对齐）
 *  - `bottom`（在底部，居中）
 *  - `auto-end`（在可用空间较多的一侧，对齐取决于放置）
 *
 * @静态的
 * @type {Array}
 * @enum {String}
 * @只读
 * @method展示位置
 * @memberof Popper
 * /
var placements = ['auto-start'，'auto'，'auto-end'，'top-start'，'top'，'top-end'，'right-start'，'right'，'right-end '，'底端'，'底部'，'底部开始'，'左端'，'左'，'左开'';

//摆脱`auto``auto-start`和`auto-end`
var validPlacements = placements.slice（3）;

/ **
 *给定初始展示位置，返回所有后续展示位置
 *顺时针（或逆时针）。
 *
 * @方法
 * @memberof Popper.Utils
 * @argument {String}展示位置 - 有效展示位置（接受变体）
 * @argument {Boolean} counter  - 设置为true以逆时针方向行走展示位置
 * @returns {Array}展示位置，包括其变体
 * /
顺时针（放置）{
  var counter = arguments.length> 1 && arguments [1]！== undefined？参数[1]：false;

  var index = validPlacements.indexOf（placement）;
  var arr = validPlacements.slice（index + 1）.concat（validPlacements.slice（0，index））;
  回程柜台？arr.reverse（）：arr;
}

var BEHAVIORS = {
  翻转：'翻转'，
  时钟：'顺时针'，
  COUNTERCLOCKWISE：'逆时针'
};

/ **
 * @function
 * @memberof修饰符
 * @argument {Object} data  -  update方法生成的数据对象
 * @argument {Object}选项 - 修饰符配置和选项
 * @returns {Object}正确修改的数据对象
 * /
功能翻转（数据，选项）{
  //如果启用了`inner`修饰符，我们就不能使用`flip`修饰符
  if（isModifierEnabled（data.instance.modifiers，'inner'））{
    返回数据;
  }

  if（data.flipped && data.placement === data.originalPlacement）{
    //似乎翻转试图循环，可能在任何可翻转的一侧没有足够的空间
    返回数据;
  }

  var boundaries = getBoundaries（data.instance.popper，data.instance.reference，options.padding，options.boundariesElement，data.positionFixed）;

  var placement = data.placement.split（' - '）[0];
  var placementOpposite = getOppositePlacement（placement）;
  var variation = data.placement.split（' - '）[1] || '';

  var flipOrder = [];

  switch（options.behavior）{
    案例BEHAVIORS.FLIP：
      flipOrder = [placement，placementOpposite];
      打破;
    案例BEHAVIORS.CLOCKWISE：
      flipOrder =顺时针（放置）;
      打破;
    案例BEHAVIORS.COUNTERCLOCKWISE：
      flipOrder =顺时针（placement，true）;
      打破;
    默认：
      flipOrder = options.behavior;
  }

  flipOrder.forEach（function（step，index）{
    if（placement！== step || flipOrder.length === index + 1）{
      返回数据;
    }

    placement = data.placement.split（' - '）[0];
    placementOpposite = getOppositePlacement（placement）;

    var popperOffsets = data.offsets.popper;
    var refOffsets = data.offsets.reference;

    //使用floor，因为引用偏移量可能包含我们在此不考虑的小数
    var floor = Math.floor;
    var overlapsRef = placement ==='left'&& floor（popperOffsets.right）> floor（refOffsets.left）|| placement ==='right'&& floor（popperOffsets.left）<floor（refOffsets.right）|| placement ==='top'&& floor（popperOffsets.bottom）> floor（refOffsets.top）|| placement ==='bottom'&& floor（popperOffsets.top）<floor（refOffsets.bottom）;

    var overflowsLeft = floor（popperOffsets.left）<floor（boundaries.left）;
    var overflowsRight = floor（popperOffsets.right）> floor（borders.right）;
    var overflowsTop = floor（popperOffsets.top）<floor（borders.top）;
    var overflowsBottom = floor（popperOffsets.bottom）> floor（borders.bottom）;

    var overflowsBoundaries = placement ==='left'&& overflowsLeft || placement ==='right'&& overflowsRight || placement ==='top'&& overflowsTop || placement ==='bottom'&& overflowsBottom;

    //如果需要，可以翻转变体
    var isVertical = ['top'，'bottom']。indexOf（placement）！== -1;
    var flippedVariation = !! options.flipVariations &&（isVertical && variation ==='start'&& overflowsLeft || isVertical && variation ==='end'&& overflowsRight ||！isVertical && variation ==='start'&& overflowsTop || ！isVertical && variation ==='end'&& overflowsBottom）;

    if（overlapsRef || overflowsBoundaries || flippedVariation）{
      //这个布尔值来检测任何翻转循环
      data.flipped = true;

      if（overlapsRef || overflowsBoundaries）{
        placement = flipOrder [index + 1];
      }

      if（flippedVariation）{
        variation = getOppositeVariation（变体）;
      }

      data.placement = placement +（变体？' - '+变化：''）;

      //这个对象包含`position`，我们想要保存它
      //我们将来可能添加的任何其他财产
      data.offsets.popper = _extend（{}，data.offsets.popper，getPopperOffsets（data.instance.popper，data.offsets.reference，data.placement））;

      data = runModifiers（data.instance.modifiers，data，'flip'）;
    }
  }）;
  返回数据;
}

/ **
 * @function
 * @memberof修饰符
 * @argument {Object} data  -  update方法生成的数据对象
 * @argument {Object}选项 - 修饰符配置和选项
 * @returns {Object}正确修改的数据对象
 * /
function keepTogether（data）{
  var _data $ offsets = data.offsets，
      popper = _data $ offsets.popper，
      reference = _data $ offsets.reference;

  var placement = data.placement.split（' - '）[0];
  var floor = Math.floor;
  var isVertical = ['top'，'bottom']。indexOf（placement）！== -1;
  var side = isVertical？'正确'：'底部';
  var opSide = isVertical？'left'：'top';
  var measurement = isVertical？'width'：'height';

  if（popper [side] <floor（reference [opSide]））{
    data.offsets.popper [opSide] = floor（reference [opSide]） -  popper [measurement];
  }
  if（popper [opSide]> floor（参考[side]））{
    data.offsets.popper [opSide] = floor（参考[side]）;
  }

  返回数据;
}

/ **
 *将包含值+单位的字符串转换为px值编号
 * @function
 * @memberof {modifiers~offset}
 * @私人的
 * @argument {String} str  - 值+单位字符串
 * @argument {String} measurement  - `height`或`width`
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @returns {Number | String}
 *像素值，如果没有提取值，则为原始字符串
 * /
function toValue（str，measurement，popperOffsets，referenceOffsets）{
  //从单位中分离值
  var split = str.match（/（（？：\  -  | \ +）？\ d * \。？\ d *）（。*）/）;
  var value = + split [1];
  var unit = split [2];

  //我猜，如果它不是数字，那么它就是算子
  if（！value）{
    返回str;
  }

  if（unit.indexOf（'％'）=== 0）{
    var element = void 0;
    开关（单位）{
      案例'％p'：
        element = popperOffsets;
        打破;
      案件 '％'：
      案例'％r'：
      默认：
        element = referenceOffsets;
    }

    var rect = getClientRect（element）;
    return rect [measurement] / 100 * value;
  } else if（unit ==='vh'|| unit ==='vw'）{
    //如果是vh或vw，我们根据视口计算大小
    var size = void 0;
    if（unit ==='vh'）{
      size = Math.max（document.documentElement.clientHeight，window.innerHeight || 0）;
    } else {
      size = Math.max（document.documentElement.clientWidth，window.innerWidth || 0）;
    }
    返回大小/ 100 *值;
  } else {
    //如果是一个显式的像素单位，我们摆脱单位并保持价值
    // if是隐式单位，它是px，我们只返回值
    回报值;
  }
}

/ **
 *解析`offset`字符串来推断`x`和`y`数字偏移。
 * @function
 * @memberof {modifiers~offset}
 * @私人的
 * @argument {String}偏移量
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @argument {String} basePlacement
 * @returns {Array}一个两个单元格的数组，其中包含x和y偏移量
 * /
function parseOffset（offset，popperOffsets，referenceOffsets，basePlacement）{
  var offsets = [0,0];

  //如果左侧或右侧放置并且索引为0，则使用高度，否则使用宽度
  //这样，第一个偏移量将使用轴，第二个偏移量将使用第二个偏移量
  //将使用另一个
  var useHeight = ['right'，'left']。indexOf（basePlacement）！== -1;

  //拆分偏移字符串以获取值和操作数的列表
  //正则表达式使用前面的加号或减号来表示值（+ 10，-20等）
  var fragments = offset.split（/（\ + | \  - ）/）。map（function（frag）{
    return frag.trim（）;
  }）;

  //检测偏移字符串是包含一对值还是单个值
  //它们可以用逗号或空格分隔
  var divider = fragments.indexOf（find（fragments，function（frag）{
    return frag.search（/，| \ s /）！== -1;
  }））;

  if（fragments [divider] && fragments [divider] .indexOf（'，'）=== -1）{
    console.warn（'不推荐使用空格分隔的偏移量，请改用逗号（，）。'）;
  }

  //如果找到了divider，我们将值列表和操作数分开
  //他们是由X和Y组成的。
  var splitRegex = / \ s *，\ s * | \ s + /;
  var ops = divider！== -1？[fragments.slice（0，divider）.concat（[fragments [divider] .split（splitRegex）[0]]），[fragments [divider] .split（splitRegex）[1]]。concat（fragments.slice（divider） + 1））]：[片段];

  //将单位的值转换为绝对像素以允许我们的计算
  ops = ops.map（function（op，index）{
    //大多数单位都依赖于波普尔的方向
    var measurement =（index === 1 ?! useHeight：useHeight）？'高度宽度';
    var mergeWithPrevious = false;
    回报
    //这会聚合任何不被视为运算符的`+`或`-`符号
    //例如：10 + +5 => [10，+，+ 5]
    .reduce（function（a，b）{
      if（a [a.length  -  1] ===''&& ['+'，' - '] .indexOf（b）！== -1）{
        a [a.length  -  1] = b;
        mergeWithPrevious = true;
        返回;
      } else if（mergeWithPrevious）{
        a [a.length  -  1] + = b;
        mergeWithPrevious = false;
        返回;
      } else {
        返回a.concat（b）;
      }
    }，[]）
    //这里我们将字符串值转换为数字值（以px为单位）
    .map（function（str）{
      return toValue（str，measurement，popperOffsets，referenceOffsets）;
    }）;
  }）;

  //循环通过偏移数组并执行操作
  ops.forEach（function（op，index）{
    op.forEach（function（frag，index2）{
      if（isNumeric（frag））{
        偏移[index] + = frag *（op [index2  -  1] ===' - '？ -  1：1）;
      }
    }）;
  }）;
  返回抵消;
}

/ **
 * @function
 * @memberof修饰符
 * @argument {Object} data  -  update方法生成的数据对象
 * @argument {Object}选项 - 修饰符配置和选项
 * @argument {Number | String} options.offset = 0
 *修饰符描述中描述的偏移值
 * @returns {Object}正确修改的数据对象
 * /
function offset（data，_ref）{
  var offset = _ref.offset;
  var placement = data.placement，
      _data $ offsets = data.offsets，
      popper = _data $ offsets.popper，
      reference = _data $ offsets.reference;

  var basePlacement = placement.split（' - '）[0];

  var offsets = void 0;
  if（isNumeric（+ offset））{
    offsets = [+ offset，0];
  } else {
    offsets = parseOffset（offset，popper，reference，basePlacement）;
  }

  if（basePlacement ==='left'）{
    popper.top + = offsets [0];
    popper.left  -  = offsets [1];
  } else if（basePlacement ==='right'）{
    popper.top + = offsets [0];
    popper.left + = offsets [1];
  } else if（basePlacement ==='top'）{
    popper.left + = offsets [0];
    popper.top  -  = offsets [1];
  } else if（basePlacement ==='bottom'）{
    popper.left + = offsets [0];
    popper.top + = offsets [1];
  }

  data.popper = popper;
  返回数据;
}

/ **
 * @function
 * @memberof修饰符
 * @argument {Object} data  - `update`方法生成的数据对象
 * @argument {Object}选项 - 修饰符配置和选项
 * @returns {Object}正确修改的数据对象
 * /
function preventOverflow（data，options）{
  var boundariesElement = options.boundariesElement || getOffsetParent（data.instance.popper）;

  //如果offsetParent是引用元素，我们真的很想
  //向上一步并使用下一个offsetParent作为参考
  //避免使这个修饰符完全无用并且看起来像破碎
  if（data.instance.reference === boundariesElement）{
    boundariesElement = getOffsetParent（bordersElement）;
  }

  //注意：DOM访问此处
  //重置popper的位置，以便排除文档大小
  // popper元素本身的大小
  var transformProp = getSupportedPropertyName（'transform'）;
  var popperStyles = data.instance.popper.style; //帮助缩小的任务
  var top = popperStyles.top，
      left = popperStyles.left，
      transform = popperStyles [transformProp];

  popperStyles.top ='';
  popperStyles.left ='';
  popperStyles [transformProp] ='';

  var boundaries = getBoundaries（data.instance.popper，data.instance.reference，options.padding，boundaryElement，data.positionFixed）;

  //注意：DOM访问此处
  //在计算偏移量后恢复原始样式属性
  popperStyles.top = top;
  popperStyles.left = left;
  popperStyles [transformProp] = transform;

  options.boundaries = boundary;

  var order = options.priority;
  var popper = data.offsets.popper;

  var check = {
    primary：function primary（placement）{
      var value = popper [placement];
      if（popper [placement] <borders [placement] &&！options.escapeWithReference）{
        value = Math.max（popper [placement]，boundary [placement]）;
      }
      return defineProperty（{}，placement，value）;
    }，
    secondary：function secondary（placement）{
      var mainSide = placement ==='right'？'left'：'top';
      var value = popper [mainSide];
      if（popper [placement]> boundary [placement] &&！options.escapeWithReference）{
        value = Math.min（popper [mainSide]，boundary [placement]  - （placement ==='right'？popper.width：popper.height））;
      }
      return defineProperty（{}，mainSide，value）;
    }
  };

  order.forEach（function（placement）{
    var side = ['left'，'top'] .indexOf（placement）！== -1？'primary'：'secondary';
    popper = _extends（{}，popper，check [side]（placement））;
  }）;

  data.offsets.popper = popper;

  返回数据;
}

/ **
 * @function
 * @memberof修饰符
 * @argument {Object} data  - `update`方法生成的数据对象
 * @argument {Object}选项 - 修饰符配置和选项
 * @returns {Object}正确修改的数据对象
 * /
功能转移（数据）{
  var placement = data.placement;
  var basePlacement = placement.split（' - '）[0];
  var shiftvariation = placement.split（' - '）[1];

  //如果指定了shift shiftvariation，则运行修饰符
  if（shiftvariation）{
    var _data $ offsets = data.offsets，
        reference = _data $ offsets.reference，
        popper = _data $ offsets.popper;

    var isVertical = ['bottom'，'top']。indexOf（basePlacement）！== -1;
    var side = isVertical？'left'：'top';
    var measurement = isVertical？'width'：'height';

    var shiftOffsets = {
      start：defineProperty（{}，side，reference [side]），
      end：defineProperty（{}，side，reference [side] + reference [measurement]  -  popper [measurement]）
    };

    data.offsets.popper = _extends（{}，popper，shiftOffsets [shiftvariation]）;
  }

  返回数据;
}

/ **
 * @function
 * @memberof修饰符
 * @argument {Object} data  -  update方法生成的数据对象
 * @argument {Object}选项 - 修饰符配置和选项
 * @returns {Object}正确修改的数据对象
 * /
function hide（data）{
  if（！isModifierRequired（data.instance.modifiers，'hide'，'preventOverflow'））{
    返回数据;
  }

  var refRect = data.offsets.reference;
  var bound = find（data.instance.modifiers，function（modifier）{
    return modifier.name ==='preventOverflow';
  }）边界;

  if（refRect.bottom <bound.top || refRect.left> bound.right || refRect.top> bound.bottom || refRect.right <bound.left）{
    //如果可见性没有改变，请避免不必要的DOM访问
    if（data.hide === true）{
      返回数据;
    }

    data.hide = true;
    data.attributes ['x-out-of-boundary'] ='';
  } else {
    //如果可见性没有改变，请避免不必要的DOM访问
    if（data.hide === false）{
      返回数据;
    }

    data.hide = false;
    data.attributes ['x-out-of-boundary'] = false;
  }

  返回数据;
}

/ **
 * @function
 * @memberof修饰符
 * @argument {Object} data  - `update`方法生成的数据对象
 * @argument {Object}选项 - 修饰符配置和选项
 * @returns {Object}正确修改的数据对象
 * /
function inner（data）{
  var placement = data.placement;
  var basePlacement = placement.split（' - '）[0];
  var _data $ offsets = data.offsets，
      popper = _data $ offsets.popper，
      reference = _data $ offsets.reference;

  var isHoriz = ['left'，'right']。indexOf（basePlacement）！== -1;

  var subtractLength = ['top'，'left']。indexOf（basePlacement）=== -1;

  波普尔[isHoriz？'left'：'top'] = reference [basePlacement]  - （subtractLength？popper [isHoriz？'width'：'height']：0）;

  data.placement = getOppositePlacement（placement）;
  data.offsets.popper = getClientRect（popper）;

  返回数据;
}

/ **
 *修改器功能，每个修改器都可以分配这种类型的功能
 *到它的`fn`属性。<br />
 *每次更新都会调用这些函数，这意味着您必须这样做
 *确保它们的性能足以避免性能瓶颈。
 *
 * @function ModifierFn
 * @argument {dataObject} data  - `update`方法生成的数据对象
 * @argument {Object}选项 - 修饰符配置和选项
 * @returns {dataObject}正确修改的数据对象
 * /

/ **
 *修饰符是用于改变poppers行为的插件。<br />
 * Popper.js使用一组9个修饰符来提供所有基本功能
 *图书馆需要。
 *
 *通常你不想覆盖`order`，`fn`和`onLoad`道具。
 *所有其他属性都是可以调整的配置。
 * @namespace修饰符
 * /
var modifiers = {
  / **
   *用于在其引用的开头或结尾处移动popper的修饰符
   *元素。<br />
   *它将读取`placement`属性的变化。<br />
   *它可以是`-end`或`-start`。
   * @memberof修饰符
   * @inner
   * /
  转移：{
    / ** @prop {number} order = 100  - 用于定义执行顺序的索引* /
    订单：100，
    / ** @prop {Boolean} enabled = true  - 是否启用修饰符* /
    启用：true，
    / ** @prop {ModifierFn} * /
    fn：转移
  }，

  / **
   *`offset`修饰符可以在你的轴上移动你的popper。
   *
   *它接受以下单位：
   *  - `px`或无单位，解释为像素
   *  - '％`或`％r`，相对于参考元素长度的百分比
   *  - '％p`，相对于popper元素长度的百分比
   *  - `vw`，CSS视口宽度单位
   *  - `vh`，CSS视口高度单位
   *
   *长度是指相对于popper位置的主轴。<br />
   *这意味着如果展示位置是“top”或“bottom”，则长度为
   *`width`。在“left”或“right”的情况下，它将是“height”。
   *
   *您可以提供单个值（如“Number”或“String”）或一对值
   *作为`String`除以逗号或一个（或多个）空格。<br />
   *后者是一种弃用的方法，因为它会导致混淆，并且会
   *在v2中删除。<br />
   *此外，它接受不同单位之间的加法和减法。
   *请注意，不支持乘法和除法。
   *
   *有效的例子是：
   *```
   * 10
   * '10％'
   * '10,10'
   * '10％，10'
   * '10 + 10％'
   * '10  -  5vh + 3％'
   *' -  10px + 5vh，5px  -  6％'
   *```
   *> ** NB **：如果您希望以可能使它们重叠的方式对偏移器应用偏移
   不幸的是，*>使用它们的引用元素，你必须禁用`flip`修饰符。
   *>您可以在[问题]（https://github.com/FezVrasta/popper.js/issues/373）上阅读更多相关内容。
   *
   * @memberof修饰符
   * @inner
   * /
  偏移量：{
    / ** @prop {number} order = 200  - 用于定义执行顺序的索引* /
    订单：200，
    / ** @prop {Boolean} enabled = true  - 是否启用修饰符* /
    启用：true，
    / ** @prop {ModifierFn} * /
    fn：偏移，
    / ** @prop {Number | String} offset = 0
     *修饰符描述中描述的偏移值
     * /
    偏移量：0
  }，

  / **
   *用于防止波普尔定位在边界外的修改器。
   *
   *存在一种情况，即引用本身不在边界内。<br />
   *我们可以说它已经“逃过了界限” - 或者只是“逃脱”。<br />
   *在这种情况下，我们需要决定popper是否应该：
   *
   *  - 与参考分离并保持“陷入”边界，或
   *  - 如果它应该忽略边界并“以其参考逃脱”
   *
   *当`escapeWithReference`设置为`true`并且引用完全时
   *在其边界之外，波普尔将溢出（或完全离开）
   *边界以保持附着到参考边缘。
   *
   * @memberof修饰符
   * @inner
   * /
  preventOverflow：{
    / ** @prop {number} order = 300  - 用于定义执行顺序的索引* /
    订单：300，
    / ** @prop {Boolean} enabled = true  - 是否启用修饰符* /
    启用：true，
    / ** @prop {ModifierFn} * /
    fn：preventOverflow，
    / **
     * @prop {Array} [priority = ['left'，'right'，'top'，'bottom']]
     *默认情况下，Popper将尝试防止这些优先级溢出，
     *然后，它可能会在`boundaryElement`的左侧和顶部溢出
     * /
    优先级：['left'，'right'，'top'，'bottom']，
    / **
     * @prop {number} padding = 5
     *用于定义边界之间最小距离的像素数量
     *和波普尔。这可以确保popper总是有一点填充
     *在其容器的边缘之间
     * /
    填充：5，
    / **
     * @prop {String | HTMLElement} boundaryElement ='scrollParent'
     *修饰符使用的边界。可以是`scrollParent`，`window`，
     *`viewport`或任何DOM元素。
     * /
    boundaryElement：'scrollParent'
  }，

  / **
   *修饰符用于确保引用及其popper保持彼此靠近
   *两者之间不留任何差距。箭头是特别有用的
   *已启用，您希望确保它指向其参考元素。
   *它只关心第一轴。你仍然可以拥有保证金的poppers
   *在popper和它的参考元素之间。
   * @memberof修饰符
   * @inner
   * /
  keepTogether：{
    / ** @prop {number} order = 400  - 用于定义执行顺序的索引* /
    订单：400，
    / ** @prop {Boolean} enabled = true  - 是否启用修饰符* /
    启用：true，
    / ** @prop {ModifierFn} * /
    fn：keepTogether
  }，

  / **
   *此修饰符用于移动要生成的popper的`arrowElement`
   *确定它位于参考元素和其popper元素之间。
   *它将读取`arrowElement`节点的外部大小以检测多少
   *需要连接像素。
   *
   *如果没有提供`arrowElement`，则无效。
   * @memberof修饰符
   * @inner
   * /
  arrow：{
    / ** @prop {number} order = 500  - 用于定义执行顺序的索引* /
    订单：500，
    / ** @prop {Boolean} enabled = true  - 是否启用修饰符* /
    启用：true，
    / ** @prop {ModifierFn} * /
    fn：箭头，
    / ** @prop {String | HTMLElement} element ='[x-arrow]' - 用作箭头的选择器或节点* /
    元素：'[x-arrow]'
  }，

  / **
   *用于在弹出窗口开始重叠时放置弹出窗口的位置的修改器
   *参考元素。
   *
   *之前需要`preventOverflow`修饰符才能工作。
   *
   * **注意：**此修饰符将中断当前更新周期
   *如果检测到需要翻转放置，请重新启动它。
   * @memberof修饰符
   * @inner
   * /
  翻转：{
    / ** @prop {number} order = 600  - 用于定义执行顺序的索引* /
    订单：600，
    / ** @prop {Boolean} enabled = true  - 是否启用修饰符* /
    启用：true，
    / ** @prop {ModifierFn} * /
    fn：翻转，
    / **
     * @prop {String | Array} behavior ='flip'
     *用于更改popper位置的行为。它可以是其中之一
     *`flip`，`顺时针`，`逆时针'或带有有效列表的数组
     *展示位置（可选的变体）
     * /
    行为：'翻转'，
    / **
     * @prop {number} padding = 5
     *如果popper碰到`boundaryElement`的边缘，它将会翻转
     * /
    填充：5，
    / **
     * @prop {String | HTMLElement} boundaryElement ='viewport'
     *将定义波普尔位置边界的元素。
     * popper永远不会被放置在定义的边界之外
     *（除非启用`keepTogether`）
     * /
    boundaryElement：'viewport'
  }，

  / **
   *用于使popper流向参考元素内部的修饰符。
   *默认情况下，禁用此修改器时，弹出窗口将放在外面
   *参考元素。
   * @memberof修饰符
   * @inner
   * /
  内心：{
    / ** @prop {number} order = 700  - 用于定义执行顺序的索引* /
    订单：700，
    / ** @prop {Boolean} enabled = false  - 修改器是否启用* /
    启用：false，
    / ** @prop {ModifierFn} * /
    fn：内心
  }，

  / **
   *修饰符用于在其引用元素位于其外部时隐藏该popper
   * popper边界。它将设置一个“x-out-of-boundary”属性
   *用于在引用时使用CSS选择器隐藏popper
   *超出界限。
   *
   *之前需要`preventOverflow`修饰符才能工作。
   * @memberof修饰符
   * @inner
   * /
  hide：{
    / ** @prop {number} order = 800  - 用于定义执行顺序的索引* /
    订单：800，
    / ** @prop {Boolean} enabled = true  - 是否启用修饰符* /
    启用：true，
    / ** @prop {ModifierFn} * /
    fn：隐藏
  }，

  / **
   *计算将应用于要获取的popper元素的样式
   *正确定位。
   *
   *请注意，此修饰符不会触及DOM，它只是准备样式
   *以便`applyStyle`修饰符可以应用它。这种分离很有用
   *如果您需要使用自定义实现替换`applyStyle`。
   *
   *此修饰符具有“850”作为“order”值以保持向后兼容性
   *使用以前版本的Popper.js。期待修饰符排序方法
   *在未来的主要版本库中进行更改。
   *
   * @memberof修饰符
   * @inner
   * /
  computeStyle：{
    / ** @prop {number} order = 850  - 用于定义执行顺序的索引* /
    订单：850，
    / ** @prop {Boolean} enabled = true  - 是否启用修饰符* /
    启用：true，
    / ** @prop {ModifierFn} * /
    fn：computeStyle，
    / **
     * @prop {Boolean} gpuAcceleration = true
     *如果为true，则使用CSS 3D转换来定位popper。
     *否则，它将使用`top`和`left`属性
     * /
    gpuAcceleration：true，
    / **
     * @prop {string} [x ='bottom']
     *固定X轴的位置（“底部”或“顶部”）。AKA X偏移原点。
     *如果您的波普尔应该朝着与“底部”不同的方向增长，请更改此项
     * /
    x：'bottom'，
    / **
     * @prop {string} [x ='left']
     *固定Y轴的位置（“左”或“右”）。AKA Y偏移原点。
     *如果您的popper应该朝着与'right`不同的方向增长，请更改此项
     * /
    y：'对'
  }，

  / **
   *将计算的样式应用于popper元素。
   *
   *所有DOM操作仅限于此修饰符。这在案件中很有用
   *您希望将Popper.js集成到框架或视图库中
   *想要将所有DOM操作委托给它。
   *
   *请注意，如果禁用此修饰符，则必须确保使用popper元素
   *在Popper.js完成其工作之前，其位置设置为“绝对”！
   *
   *只需禁用此修改器并定义自己的修改器即可实现所需效果。
   *
   * @memberof修饰符
   * @inner
   * /
  applyStyle：{
    / ** @prop {number} order = 900  - 用于定义执行顺序的索引* /
    订单：900，
    / ** @prop {Boolean} enabled = true  - 是否启用修饰符* /
    启用：true，
    / ** @prop {ModifierFn} * /
    fn：applyStyle，
    / ** @prop {Function} * /
    onLoad：applyStyleOnLoad，
    / **
     *自版本1.10.0以来@deprecated，属性移动到`computeStyle`修饰符
     * @prop {Boolean} gpuAcceleration = true
     *如果为true，则使用CSS 3D转换来定位popper。
     *否则，它将使用`top`和`left`属性
     * /
    gpuAcceleration：未定义
  }
};

/ **
 *`dataObject`是一个包含Popper.js使用的所有信息的对象。
 *此对象传递给修饰符以及`onCreate`和`onUpdate`回调。
 * @name dataObject
 * @property {Object} data.instance Popper.js实例
 * @property {String} data.placement应用于popper的放置
 * @property {String} data.originalPlacement最初在init上定义的放置
 * @property {Boolean} data.flipped如果popper已被翻转修饰符翻转，则为真
 * @property {Boolean} data.hide如果引用元素超出边界，则为true，有助于知道何时隐藏popper
 * @property {HTMLElement} data.arrowElement用作箭头修改器箭头的节点
 * @property {Object} data.styles此处定义的任何CSS属性都将应用于popper。它期望JavaScript命名法（例如`marginBottom`）
 * @property {Object} data.arrowStyles此处定义的任何CSS属性都将应用于popper箭头。它期望JavaScript命名法（例如`marginBottom`）
 * @property {Object} data.boundaries popper边界的偏移量
 * @property {Object} data.offsets popper，reference和arrow元素的度量
 * @property {Object} data.offsets.popper`top`，`left`，`width`，`height`值
 * @property {Object} data.offsets.reference`top`，`left`，`width`，`height`值
 * @property {Object} data.offsets.arrow]`top`和`left`偏移，其中只有一个与0不同
 * /

/ **
 *为Popper.js构造函数提供的默认选项。<br />
 *可以使用Popper.js的`options`参数覆盖这些。<br />
 *要覆盖选项，只需传递具有相同选项的对象即可
 *`options`对象的结构，作为第3个参数。例如：
 *```
 *新波普尔（参考，流行，{
 *修饰符：{
 * preventOverflow：{enabled：false}
 *}
 *}）
 *```
 * @type {Object}
 * @静态的
 * @memberof Popper
 * /
var Defaults = {
  / **
   *波普尔的位置。
   * @prop {Popper.placements} placement ='bottom'
   * /
  放置：'底部'，

  / **
   *如果您希望popper将其自定位于“固定”模式，请将此设置为true
   * @prop {Boolean} positionFixed = false
   * /
  positionFixed：false，

  / **
   *是否最初启用事件（调整大小，滚动）。
   * @prop {Boolean} eventsEnabled = true
   * /
  eventsEnabled：true，

  / **
   *如果你想在什么时候自动删除popper，设置为true
   *你调用`destroy`方法。
   * @prop {Boolean} removeOnDestroy = false
   * /
  removeOnDestroy：false，

  / **
   *创建popper时调用回调。<br />
   *默认情况下，它设置为no-op。<br />
   *使用`data.instance`访问Popper.js实例。
   * @prop {onCreate}
   * /
  onCreate：function onCreate（）{}，

  / **
   *更新popper时调用回调。不调用此回调
   *关于popper的初始化/创建，但仅限于后续
   *更新。<br />
   *默认情况下，它设置为no-op。<br />
   *使用`data.instance`访问Popper.js实例。
   * @prop {onUpdate}
   * /
  onUpdate：function onUpdate（）{}，

  / **
   *用于在将偏移应用于popper之前修改偏移量的修饰符列表。
   *它们提供了Popper.js的大部分功能。
   * @prop {modifiers}
   * /
  修饰符：修饰符
};

/ **
 * @callback onCreate
 * @param {dataObject}数据
 * /

/ **
 * @callback onUpdate
 * @param {dataObject}数据
 * /

//实用工具
// 方法
var Popper = function（）{
  / **
   *创建一个新的Popper.js实例。
   * @class Popper
   * @param {HTMLElement|referenceObject} reference - The reference element used to position the popper
   * @param {HTMLElement} popper - The HTML element used as the popper
   * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
   * @return {Object} instance - The generated Popper.js instance
   */
  function Popper(reference, popper) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Popper);

    this.scheduleUpdate = function () {
      return requestAnimationFrame(_this.update);
    };

    // make update() debounced, so that it only runs at most once-per-tick
    this.update = debounce(this.update.bind(this));

    // with {} we create a new object with the options inside it
    this.options = _extends({}, Popper.Defaults, options);

    // init state
    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: []
    };

    // get reference and popper elements (allow jQuery wrappers)
    this.reference = reference && reference.jquery ? reference[0] : reference;
    this.popper = popper && popper.jquery ? popper[0] : popper;

    // Deep merge modifiers options
    this.options.modifiers = {};
    Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
      _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
    });

    // Refactoring modifiers' list (Object => Array)
    this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
      return _extends({
        name: name
      }, _this.options.modifiers[name]);
    })
    // sort the modifiers by order
    .sort(function (a, b) {
      return a.order - b.order;
    });

    // modifiers have the ability to execute arbitrary code when Popper.js get inited
    // such code is executed in the same order of its modifier
    // they could add new properties to their options configuration
    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
    this.modifiers.forEach(function (modifierOptions) {
      if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
      }
    });

    // fire the first update to position the popper in the right place
    this.update();

    var eventsEnabled = this.options.eventsEnabled;
    if (eventsEnabled) {
      // setup event listeners, they will take care of update the position in specific situations
      this.enableEventListeners();
    }

    this.state.eventsEnabled = eventsEnabled;
  }

  // We can't use class properties because they don't get listed in the
  // class prototype and break stuff like Sinon stubs


  createClass(Popper, [{
    key: 'update',
    value: function update$$1() {
      return update.call(this);
    }
  }, {
    key: 'destroy',
    value: function destroy$$1() {
      return destroy.call(this);
    }
  }, {
    key: 'enableEventListeners',
    value: function enableEventListeners$$1() {
      return enableEventListeners.call(this);
    }
  }, {
    key: 'disableEventListeners',
    value: function disableEventListeners$$1() {
      return disableEventListeners.call(this);
    }

    /**
     * Schedules an update. It will run on the next UI update available.
     * @method scheduleUpdate
     * @memberof Popper
     */


    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * Due to the high instability of the methods contained in Utils, we can't
     * guarantee them to follow semver. Use them at your own risk!
     * @static
     * @private
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */

  }]);
  return Popper;
}();

/**
 * The `referenceObject` is an object that provides an interface compatible with Popper.js
 * and lets you use it as replacement of a real DOM node.<br />
 * You can use this method to position a popper relatively to a set of coordinates
 * in case you don't have a DOM node to use as reference.
 *
 * ```
 * new Popper(referenceObject, popperNode);
 * ```
 *
 * NB: This feature isn't supported in Internet Explorer 10.
 * @name referenceObject
 * @property {Function} data.getBoundingClientRect
 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
 * @property {number} data.clientWidth
 * An ES6 getter that will return the width of the virtual reference element.
 * @property {number} data.clientHeight
 * An ES6 getter that will return the height of the virtual reference element.
 */


Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
Popper.placements = placements;
Popper.Defaults = Defaults;

return Popper;

})));
//# sourceMappingURL=popper.js.map