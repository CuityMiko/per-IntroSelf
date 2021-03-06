// JavaScript---变量、作用域？
// ================================================================================
// 基本类型与引用类型
//
// --------------------------------------------------------------------------------
// ECMAScript的的变量有两种类型：
// 基本类型（值类型）：简单数据段
// 引用类型：多个值构成的对象
// 在变量赋值结束后，解析器必须知道这个变量时基本数据类型还是引用类型，需要注意的是string在js中是值类型。
//
// --------------------------------------------------------------------------------
// 复制的差异
// 值类型的复制会在内存中创建副本，所以彼此间不会影响，但是引用类型只是将变量的引用复制，其指向的仍然是一个对象，会相互影响：
var a = {};
    a.a = 6;
var b = a;
    b.a = 66;
alert(a.a);//66

// --------------------------------------------------------------------------------
// 执行环境与作用域
// 执行环境（execution）是javascript中非常重要的一个概念。
// 执行环境定义了变量或者函数有权限访问其他数据，决定了他们各自的行为。
// 每一个执行环境都有一个与之关联的变量对象（variable object），环境中定义的所有变量和函数都保存到这个对象中，虽然代码无法访问，但是解析器会用到他。
// 在web浏览器中window对象便是我们的全局执行环境（最外围的执行环境，宿主不同便有差异，比如node.js可能就不一样），因此所有全局变量和函数都是作为window对象的属性或者方法创建的。
//
// --------------------------------------------------------------------------------
// 销毁
// 某个执行环境中的所有代码执行完毕，该环境便销毁，变量对象中的属性和函数也就完蛋了（闭包会让情况有所不同）。
//
// --------------------------------------------------------------------------------
// 函数作用域
// 每个函数都有自己的“作用域”范围（执行环境），当执行流进入一个函数时，函数的环境就会进入一个环境栈中，在函数执行完毕后，栈会将其环境弹出，控制权又重新交回之前的环境。ECMAScript程序的执行流就是这个机制在控制。
//
// --------------------------------------------------------------------------------
// 作用域链
// 当代码在一个环境中执行时会创建变量对象（variable object），并且该对象拥有一个作用域链，作用域链的用途是保证对执行环境有权限访问的所有变量与函数的有序访问。作用域的最前端便是当前执行代码所在环境的变量对象，若这个变量时函数，就将其活动对象（activation object）作为变量对象，活动对象最开始只包含一个变量arguments，整个作用域链会一直向上延伸直到window，这里上一个经典的例子：

var color = 'blue';
function changeColor() {
    var anotherColor = 'red';
    function swapColor() {
        var tmpColor = anotherColor;
        anotherColor = color;
        color = tmpColor;
    }
    swapColor();
}
changeColor();

// 以上代码涉及三个执行环境（execution context）：
// ① 全局环境
// ② changeColor 局部环境
// ③ swapColor 局部环境
// 全局变量中有一个color和一个函数changeColor;
// changeColor中有一个anotherColor变量和swapColor函数;
// swapColor函数中有tmpColor，但是他可以访问以上所有的变量;
// 我们看到三个框了，内部环境可以通过作用域链访问所有外部环境，但是外部环境不能访问内部的，js中只有函数能产生局部作用域。

// --------------------------------------------------------------------------------
// 延长作用域链
// 有些语句可以在作用域链顶端临时增加一个变量对象，该变量对象会在代码执行后被移除，以下情况会引起作用域链加长：
// ① try-catch的catch块
// ② with语句
// 这两个语句都会在作用域链前端增加一个变量对象，对with语句来说，会将指定对象添加到作用域链中，对catch来说，会创建一个新的变量对象，其中包含被抛出的错误对象的声明。

function buildUrl() {
    var q = '?p=true';
    with (location) {
        var url = href + q;
    }
    return url;
}
// 在此with语句接收的是location对象，因此其变量对象就包含了location对象的属性和方法，而且被放到作用域链的前端了，我们的href就是有意义的了，相当于location.href。

// --------------------------------------------------------------------------------
// 闭包
// 作用域链与闭包在一起后情况又会有所不同，在此我们再来看看闭包是什么：
// 闭包是指有权限访问另一个函数作用域中变量的函数,在函数内部创建函数，使用到了外部的变量，并且将此函数返回，就形成了闭包。
// 我认为闭包产生的原因是因为想私有化变量，但是提供一个对外的访问接口，所以提出了闭包的概念
function Klass() {
    var name;
    var getName = function () {
        return name;
    };
    var setName = function (n) {
        name = n;
    };
    return { getName: getName, setName: setInterval };
}

// 比如这个应用，是比较常见的，name应该是私有的，但是我们要将其接口公布出来。
// 这里，当Klass被调用了，即使他返回了，但是内部函数仍然可以访问name变量，内部函数包含了外部Klass函数的作用域，我们来理一理这个东西：

// 当某个函数调用时会创建一个执行环境（execution context）以及相关的作用域链；
// 然后，使用arguments和其它命名参数的值来初始化函数的活动对象（activation object）；
// 在作用域链中，外部函数的活动对象始终处于第二位，可能还有第三位第四位。。。
// 在函数执行过程中，为了读取和写入变量的值，就需要在作用域链中查找变量

function compare(v1, v2) {
    if (v1 < v2) {
        return -1;
    } else if (v1 > v2) {
        return 1;
    } else {
        return 0;
    }
}
var r = compare(5， 10);
//
// 1 以上定义了compare函数，然后在全局下调用了他，第一次调用时，会创建this、arguments、v1、v2的活动对象。
// 2 全局执行环境的变量this、r、compare在compare执行环境作用域链的第二位;
// 3 后台的每一个执行环境都有一个表示变量的对象——变量对象;
// 4 全局环境的变量对象始终都在，像compare这种局部变量的变量对象只在函数执行时候存在;
// 5 在创建compare函数时，会创建一个预先包含全局变量的作用域链，这个作用域链被保存在内部的[[Scope]]属性中;
// 6 当调用compare函数时，会为函数创建一个执行环境，然后复制函数的[[Scope]]属性中的对象构建新的执行环境的作用域链;
// 7 为此又有一个活动对象（在此作为变量对象使用）被创建并推入执行环境作用域链的最前端。
//
// 上例中，对于compare执行环境而言，其作用域链包含两个变量对象：
// 1 本地活动对象
// 2 全局变量对象
//
// 一般来说，函数执行完毕后，局部活动对象就会被销毁，内存中仅保存全局作用域，但是闭包让情况有所转变：
// 1 在函数内部定义的函数将会包含函数（外部函数）的活动对象添加到它自己的作用域链中;
// 2 所以在Klass内部定义的getName与setName的作用域链中事实上是包含了外部Klass的活动对象的;
// 3 在函数Klass返回后，其中的getName作用域链被初始化为包含Klass函数的活动对象和全局变量对象;
// 4 这样getName就可以访问Klass函数中的所有变量，这样做的结果就是阻止了Klass执行结束后销毁其name变量;
// 5 换句话说，Klass的执行环境与其作用域链会被回收，但是其activation object会被保留在内存中，知道getName被销毁后才回收，最后Klass的活动对象才被销毁;
// PS：显然闭包占有更多的资源，若是不及时回收会对性能造成影响，这里各位要小心才行。
//
// 闭包与变量
// 作用域链的这种配置机制也产生了一个影响不到的问题：
// 闭包只能取得包含函数（外部函数）中变量的最后一个值。因为闭包所保存的是函数的活动对象，是整个变量对象，而不是某一个值;

function createFunc() {
    var r = [];
    for (var i = 0; i < 10; i++) {
        r[i] = function () {
            return i;
        };
    }
    return r;
}

// 这是一有趣的代码，我们这里返回了一个数组，数组里面装了10函数，但是我们这是个函数保存的是同一个外部函数的活动对象，而i最后的值是10，所以所有函数最后打印出来的都是10。这里要怎么处理各位都知道了，我还是贴个代码吧：

function createFunc() {
    var r = [];
    for (var i = 0; i < 10; i++) {
        r[i] = (function (num) {
           return function () {
                return num;
            }
        })(i);
    }
    return r;
}

// --------------------------------------------------------------------------------
// 第一题settimeout与setInterval
var a = 6;
setTimeout(function () {
    alert(a);
    a = 666;
}, 1000);
a = 66;


var a = 6;
setInterval(function () {
    alert(a);
    a = 666;
}, 1000);
a = 66;

// --------------------------------------------------------------------------------
// 第二题
var tt = 'aa';
function test(){
    alert(tt);
    var tt = 'dd';
    alert(tt);
}
test();


// 其中var tt的定义会提前，这道题相当于：
var tt = 'aa';
function test(){
    var tt；
    alert(tt);
    tt = 'dd';
    alert(tt);
}
test();

// 在互动变量中应该使用内部tt，所以第一次是undefined第二次是dd，这道题本身不难，但是容易引起混淆：
var a = '11';
var a;
alert(a);//11

// 我们稍稍变形：
var a = 10;
function test() {
    a = 100;
    alert(a);
    alert(this.a);
    var a;
    alert(a);
}
test();

// 这个代码相当于：
var a = 10;
function test() {
    var a;
    a = 100;
    alert(a);//100
    alert(this.a);//10
    alert(a);//100
}
test();
// 我们只看this.a，这里this指向的是window，至于this的东西，我们后面点再说。

// --------------------------------------------------------------------------------
// 第三题
f = function () { return true; };
g = function () { return false; };
(function () {
    if (g() && [] == ![]) {
        f = function f() { return false; };
        function g() { return true; }
    }
})();
alert(f()); // true or false ?

// 这道题看上去有点乱。。。考察了很多东西，我们先说说其中的一个有问题的地方：

不要在if里面定义function请使用函数表达式，在if中定义function会让结果难以估计javascript可能会修正其中的程序而忽略if判断，但是这不是我们这里要研究的，但是他直接影响我做题的思路啊，这里果断给把题改了：
f = function () { return true; };
g = function () { return false; };
(function () {
    if (g() && [] == ![]) {
        f = function f() { return false; };
        g = function() { return true; }
    }
})();
alert(f()); // true or false ?

// 其中第五行的function f()中的f会被忽略掉，他还有个坑爹的地方是：
var s1 = g();//false
var s2 = g() && []; //false
var s3 = ![]; //false
var s4 = g() && [] == ![]; //false
var s5 = (g() && []) == ![]; //true
// 这道题稍不注意就要完蛋，s4为什么是false我都猜不透。。。所以答案是true了

// --------------------------------------------------------------------------------
// 第四题
function say667() {
    // Local variable that ends up within closure
    var num = 666;
    var sayAlert = function () { alert(num); }
    num++;
    return sayAlert;
}
var sayAlert = say667();
sayAlert();

// --------------------------------------------------------------------------------
// 第五题
var foo = {
    bar: function() {
        return this.baz;
    },
    baz: 1
};
(function() {
    return typeof arguments[0]();
})(foo.bar);

// 刚刚无意间看到了这道题，很有点意思的我们来详细理一理：
// ① 下面调用函数时候，使用了前面的对象作为参数;
// ② 对象里面却是一个函数，而且使用了内部的属性;
// ③ 返回时候调用了该函数，但是我们知道此时匿名函数的内部this指向的是windows;
// window没有baz变量，所以返回的是undefined

// --------------------------------------------------------------------------------
// 补充我们这里改下代码：
var a = foo.bar;
var foo = {
    bar: function () {
        alert(this);
        return this.baz;
    },
    baz: 1
};
(function (func) {
    //alert(func());
    console.log(func)
    console.log(arguments)
    alert(arguments[0]())
})(foo.bar);

// 大家注意看第10,11行调用方式带来的不同！
// ① 使用func方式调用的话，3行this指向为window
// ② 使用arguments[0]()调用的话，this指向为Arguments
// 不管怎样，baz他们都是找不到的所以为undefined，至于下面这个有一点点差异,
// 我们不管怎么调用都会返回111，因为他确实是有值的，不要被他所外衣所疑惑，但是这里还真有个疑惑点：
// 我们以func方式调用时候，会为window增加一个baz=111的属性，但是使用arguments[0]的方法调用我就搞不清会为谁增加属性了，各位可以看看。。
// 经过最后测试，发现：

var foo = {
    bar: function () {
        return this.baz;
    },
    baz: 1
};
(function (func) {
    arguments['baz'] = 12;
    console.log(arguments)
    alert(arguments[0]());
})(foo.bar);

// 他应该是给arguments赋值了，但是arguments是不能乱操作的，所以断点根本看不到，但是却被读取了，这样改了后会打印12

// --------------------------------------------------------------------------------
// 第六题
var foo = {
    bar: function() {
        this.baz=123;
        return this.baz;
    },
    baz: 1
};
(function() {
    console.log(arguments[0])
    return typeof arguments[0]();
})(foo.bar)
