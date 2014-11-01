# 异步分页插件

> 一个基于 `jQuery.ajax` 的分页插件
>
> 依赖： event.js,ajaxPage.css,artTemplate.js,jQuery.js
>
> 自动分页，模板渲染到页面中，可通过Api来设置各种场景，详见demo

## Api

### ajaxPage.request

发送一个请求，参数为一个参数对象，会合并到 `config.data` 里，然后用`config.data`向`config.url`发送请求

``` js
/**
 * 发送请求
 * @param {object} param 发送携带的参数，该参数会合并为 config.data
 * @return {object} self
 */

request({
    page: 1
});

request({
    type: 'all',
    page: 1,
    ok: 1
});
```

### ajaxPage.scrollTo

设置滚动条滚动到窗口位置，会根据`config.offsetTop`进行偏移

``` js
/**
 * 设置滚动条滚动到容器顶
 * @return {object} self
 */
```


### ajaxPage.$

选择窗口内`jQuery`元素，有 `wrap(初始化窗口 config.elem设置的)`, `page(分页)`, `list(列表)`, `loading(加载层)`, `error(出错层)`, `mask(遮罩层)`


``` js
/**
 * 选择器
 * @param  {string} name 要选择的东东，支持 wrap,page,list,loading,error,mask
 * @return {jQuery}     jquery对象
 */
```


### ajaxPage.reload

刷新当前实例

> ps: 
>
> reload(); => request();//当前页刷新
>
> request({page: 1});//刷新到第一页

### ajaxPage.data

``` js
/**
 * 设置/获取数据
 * @param  {string} key   要操作的key
 * @param  {string|undefined|null} value 如果为空则为获取，如果为null则为删除，否则为设置
 * @return {object} self
 */

// config.data = {page_size: 12, page:2}
data('page', 1).data('type', 'all');
// config.data = {page_size: 12, page: 1, type: 'all'}
data('page_size') => 12

request({page: 1}) == data('page', 1).request();
```


### ajaxPage.on

监听事件

``` js
/**
 * 绑定事件
 * @param  {string} type     事件名， 支持 beforeSend请求前, success请求成功, error请求失败， page分页点击
 * @param  {function} calblack 回调方法
 * @return {object}          self
 */
```

### ajaxPage.one

监听一次性事件

``` js
/**
 * 绑定事件
 * @param  {string} type     事件名， 支持 beforeSend请求前, success请求成功, error请求失败， page分页点击
 * @param  {function} calblack 回调方法
 * @return {object}          self
 */
```

### ajaxPage.off

卸载事件

``` js
/**
 * 绑定事件
 * @param  {string} type     事件名， 支持 beforeSend请求前, success请求成功, error请求失败， page分页点击
 * @param  {function|undefined} calblack 回调方法，为空则卸载全部type事件
 * @return {object}          self
 */
```


## 状态码说明

``` js
/**
 * 状态码
 * @type {Number}
 * @example
 *     0, 默认
 *     1, 正在加载
 *     2, 加载出错
 *     3, 加载成功
 *     4, 请求前beforeSend返回false
 */

ajaxPage.status = 0;
```



## 默认参数

``` js
/**
 * 默认参数
 * @type {Object}
 */
{
    elem: null,//替换容器
    data: {
        page_size: 15,//每页多少个，必须参数
        page: 1//当前页，必须参数
    },//向后端发送的东东
    url: '',//后端url
    request: true,//是否开始请求
    offsetTop: 0,//x轴偏移
    tpl: null,//模板字符串， 基于artTemplate
    filterData: null//返回值数据过滤
}
```

## 后端返回值格式

### 有数据时

```js
{
    "total": 123,//数据总数，要用这个+config.data.page_size进行分页
    "list": [//数据列表
        {
            "test": 1//具体什么数据，看自己需求
        }
    ]
}
```


### 无数据

```js
{
    "total": 0,
    "list": []
}
```


## Demo

### 默认

``` js
var demo1 = new AjaxPage({
    url: '/api.php',
    elem: '#J-list',
    tpl: $('#J-tpl').html()//模板字符串
});
```


### 外部导航改变数据

### 事件的使用

### 过滤数据的使用

### 不显示分页并滚动加载

### 某种状态下不请求数据