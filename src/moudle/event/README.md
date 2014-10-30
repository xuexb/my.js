# 事件对象

> 可以主动触发/分发一个事件机制，多用于用户行为交互监听

## API

### Event.trigger

``` js
/**
 * 触发事件
 * @param {string|object} type 事件名或者this指针
 * @param {array} data 触发时附带的数据
 * @return {boolean} 回调里是否有return false
 */
```

### Event.on

``` js
/**
 * 添加事件
 * @param   {String}    事件类型
 * @param   {Function}  监听函数
 * @return {object} self
 */
```

### Event.one

``` js
/**
 * 绑定一次事件
 * @param  {string}   type     事件类型
 * @param  {Function} callback 监听函数
 * @return {object}            self
 */
```

### Event.off

``` js
/**
 * 删除事件
 * @param   {String}    事件类型
 * @param   {Function|undefined}  监听函数，如果为空则卸载全部type的事件
 * @return {object} self
 */
```

## Demo

### 默认

```js
var demo = new Event();
demo.on('login', function(data){
     console.log(data);
});
//code
demo.trigger('login', [{}]);
```

### 绑定一次事件
```js
var demo2 = new Event();
demo2.one('login', function(){
    console.log(+new Date(), 'one'); 
});
demo2.on('login', function(){
    console.log(+new Date()); 
});
demo2.trigger('login');
```

### 卸载事件
```js
var demo3 = new Event();
demo3.on('login', function(){
    console.log(+new Date());
    this.off('login');
});
demo3.trigger('login').trigger('login');
```

### 改变回调里this指针
```js
var demo4 = new Event();
demo4.on('login', function(){
    console.log(this);
});
demo4.trigger('login').trigger(window, 'login');
```