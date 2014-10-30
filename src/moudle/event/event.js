/**
 * 事件对象
 * @copyright 嫁拍
 * @author xieliang
 * @email admin@xuexb.com
 *
 *
 * @example
 *     1, var a = new Event();
 *         a.on('login', function(data){});
 *         a.trigger('login').trigger('login', {});
 *         a.off('login');
 *     2, var b = new Event(),c = function(){}
 *         a.on('test', c); 
 *         a.off('test', c);
 */

define(function(){
    'use strict';


    var pro;

    /**
     * 构造函数
     */
    function Event(){
        this.__listener = {};//事件空间
    }

    /**
     * 原型链
     */
    pro = Event.prototype;


    /**
     * 触发事件
     * @return {boolean} 是否有return false
     */
    pro.trigger = function(type, type2){
        var self = this,
            listeners,
            i = 0,
            args = arguments;

        //如果不是str则说明要改变this指针
        if('string' !== typeof(type)){
            self = type;
            type = type2;
            args = [].slice.call(args, 2);
        } else {
            args = [].slice.call(args, 1);
        }

        listeners = this.__getListener(type);

        for (;i < listeners.length; i++) {
            if(listeners[i].callback.apply(self, args) === false){
                return false;
            }
            if(listeners[i].one){
                listeners.splice(i--, 1);
            }
        }

        return true;
    }


    /**
     * 添加事件
     * @param   {String}    事件类型
     * @param   {Function}  监听函数
     */
    pro.on = function(type, callback){
        var self = this;
        self.__getListener(type).push({
            one: false,
            callback: callback
        });
        return self;
    }


    pro.one = function(type, callback){
        var self = this;
        self.__getListener(type).push({
            callback: callback,
            one: true
        });
        return self;
    }


    /**
     * 获取事件队列
     * @param  {string} type 事件名
     * @return {array}      事件队列
     */
    pro.__getListener = function(type) {
        var listener = this.__listener;
        if (!listener[type]) {
            listener[type] = [];
        }
        return listener[type];
    }



    /**
     * 删除事件
     * @param   {String}    事件类型
     * @param   {Function}  监听函数
     */
    pro.off = function(type, callback) {
        var self = this,
            listeners = self.__getListener(type),
            i;

        if ('function' === typeof callback) {
            for (i = 0; i < listeners.length; i++) {
                if (callback === listeners[i]) {
                    listeners.splice(i--, 1);
                }
            }
        } else {
            listeners.length = 0;
        }

        return self;
    }


    return Event;
});