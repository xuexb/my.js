/**
 * 弹出层
 * @author xieliang
 * @email admin@xuexb.com
 *
 * @感谢artDialog,也是参考artDialog
 */

define(function(require){
    'use strict';
    
    var guid = 0,
        __expando = 'dialog-'+ (+new Date());


    var __config = require('./config'),
        $ = require('../lib/jquery'),
        $window = $(window),
        prototype;


    require('./dialog.css');


    function Dialog(config){
        // 合并配置参数
        config = $.extend(true, {}, __config, config || {});


        // 根据ID判断是否重复
        config.id = config.id || __expando + (guid += 1);
        if(Dialog.list[config.id]){
            return Dialog.list[config.id].zIndex();
        }


        // 如果按钮不是数组
        if(!$.isArray(config.button)){
            config.button = [];
        }


        // 确定按钮
        if (config.ok) { //如果有确认按钮则追加到button数组里
            config.button.push({
                id: 'ok',
                value: config.okValue,
                callback: config.ok,
                focus: true
            });
        }


        // 取消按钮
        if (config.cancel) { //如果有取消按钮则追加到button数组里
            config.button.push({
                id: 'cancel',
                value: config.cancelValue,
                callback: config.cancel
            });
        }

        this.config = config;
        return Dialog.list[config.id] = this.__create();
    }


    /**
     * 原型链
     * @type {object}
     */
    prototype = Dialog.prototype;


    /**
     * 初始化 
     * @return {self}
     */
    prototype.__create = function(){
        var self = this,
            config = self.config;

        /**
         * $缓存对象
         * @type {Object}
         */
        self.__cache = {};


        /**
         * 按钮回调事件
         * @type {Object}
         */
        self.__callback = {};

        //输出html
        self.__createHTML(); 

        if(config.className){
            self.$('wrap').addClass(config.className);
        }


        self.button.apply(self, config.button); //处理按钮组


        self.title(config.title) //设置标题
            .content(config.content) //设置内容
            .width(config.width) //设置宽高
            .height(config.height) //设置宽高
            .time(config.time) //设置自动关闭
            .zIndex() //置顶
            .__addEvent(); //绑定事件

        self[config.show ? 'show' : 'hide'](); //去焦点.focus();//是否显示



        self.$('close').click(function() {
            self.__click('cancel');
        });

        if(config.lock){
            self.lock(); //如果有遮罩
        }

        if(config.initialize){
            config.initialize.call(self); //如果有初始化参数则call下
        }

        return self;
    }


    prototype.lock = function() {

        var self = this,
            config = self.config,
            div,
            css;

        if (self.locked) {
            return self;
        }

        div = document.createElement('div');
        css = {
        }



        div.className = 'ui-dialog-mask';

        css['backgroundColor'] = config.backgroundColor;
        css['opacity'] = config.backgroundOpacity;



        document.body.appendChild(div);


        if(self.visibled){
            css.display = 'block';   
        }


        self.__cache.mask = $(div).css(css);

        self.locked = true;



        self.$('wrap').addClass('ui-dialog-modal');

        return self.zIndex();
    }


    /** 解开屏锁 */
    prototype.unlock = function() {
        var self = this;

        if (!self.locked) {
            return self;
        }

        self.$('mask').remove();

        self.$('wrap').removeClass('ui-dialoge-modal');
        self.locked = false;

        //删除元素引用
        delete self.__cache.mask;

        return self;
    }


    prototype.button = function() {
        var self = this,
            callback = self.__callback,
            args = [].slice.call(arguments);


        $.each(args, function(index, val){
            var $a, id, className = 'ui-dialog-button',
                options, isNew;

            //找到唯一ID
            id = val.id || val.value;

            if(callback[id]){
                $a = self.$('button-'+ id);
            } else {
                isNew = 1;

                callback[id] = {};

                $a = $('<a />').attr({
                    'data-node': 'button-'+ id,
                    herf: '#'
                });
            }

            options = $.extend(callback[id], val);


            $a.addClass('ui-dialog-button');


            if(val.value){
                $a.html(val.value);
            }

            if(options.className){
                className += ' '+ options.className;
            }

            //如果禁用
            if (options.disabled) {
                className += ' '+ 'ui-dialog-button-disabled';
            } 

            //如果为聚焦
            if (options.focus) {
                if(self.__focus_btn){
                    self.__focus_btn.removeClass('ui-dialog-button-focus');
                }

                self.__focus_btn = $a;
                className += ' ui-dialog-button-focus'; //给当前添加聚焦
            }


            $a[0].className = className;


            if(isNew){
                $a.data('id', id);
                self.$('buttons').append($a);
            }
        });
    

        if(self.__focus_btn){
            self.__focus_btn.focus();
        }

        self.$('buttons')[args.length ? 'show' : 'hide']();

        return self.position();
    }


    prototype.__click = function(id) {
        var self = this,
            fn = self.__callback[id] && self.__callback[id].callback;

        return typeof fn !== 'function' || fn.call(self) !== false ?
            self.close() : self;
    }


    prototype.close = function(){
        var self = this,
            key,
            beforeunload;

        if (self.closed) {
            return self;
        }


        beforeunload = self.config.beforeunload;

        if (beforeunload && beforeunload.call(self) === false) {
            return self;
        }


        if (Dialog.focus === self) {
            Dialog.focus = null;
        }




        // self._trigger('close');


        self.time().unlock(); //._removeEvent();//jQuery会自己卸载
        delete Dialog.list[self.config.id];
        self.$('wrap').remove()

        //采用v6的删除方法，减少资源
        for (key in self) {
            // delete self[key];
        }

        self.closed = true;


        return self;
    }

    prototype.__addEvent = function(){
        var self = this;
        // 优化事件代理
        self.$('buttons').on('click', 'a', function() {
            var callbackID,
                $that = $(this);

            if (!$that.hasClass('ui-dialog-button-disabled')) {
                callbackID = $that.data('id');
                if(callbackID){
                    // console.log(callbackID)
                    self.__click(callbackID);
                }
            }

            return !1;
        });

        self.$('wrap').on('mousedown', function() {
            self.zIndex();
        });
    }



    /** 显示对话框 */
    prototype.show = function() {
        var self = this;

        if (self.visibled === true) {
            return self;
        }

        self.visibled = true;

        self.$('wrap').show().addClass('ui-dialog-show');

        if (self.__cache.mask) {
            self.__cache.mask.show();
        }

        // self._trigger('show');

        return self;
    }

    prototype.hide = function() {
        var self = this;

        if (self.visibled === false) {
            return self;
        }

        self.visibled = false;

        self.$('wrap').hide().removeClass('ui-dialog-show');


        if (self.__cache.mask) {
            self.__cache.mask.hide();
        }



        // self._trigger('hide');

        return self;
    }


    /** 置顶对话框 */
    prototype.zIndex = function() {

        var self = this,
            top = Dialog.focus,
            index = __config.zIndex += 2;

        // 设置叠加高度
        self.$('wrap').css('zIndex', index);
        
        if(self.__cache.mask){
            self.__cache.mask.css('zIndex', index - 1);
        }

        // 设置最高层的样式
        if(top){
            top.$('wrap').removeClass('ui-dialog-focus');
        }

        Dialog.focus = self;
        self.$('wrap').addClass('ui-dialog-focus');

        return self;
    }


    /**
     * 定时关闭
     * @param {Number} 单位毫秒, 无参数则停止计时器
     */
    prototype.time = function(time) {

        var self = this,
            timer = self.__timer;

        if(timer){
            clearTimeout(timer);
        }

        if (time) {
            self.__timer = setTimeout(function() {
                self.__click('close');
            }, time);
        }


        return self;
    }


    /**
     * 设置内容
     * @param {String} 内容 (可选)
     */
    prototype.content = function(message) {
        this.$('content').html(message); //设置内容不解释
        return this.position();
    }

    prototype.width = function(num){
        this.$('content').width(num);
        return this.position();
    }


    prototype.height = function(num){
        this.$('content').height(num);
        return this.position();
    }


    prototype.position = function(){
        var wrap = this.$('wrap')[0],
            fixed = this.config.fixed, //判断是否为fixed定位
            dl = fixed ? 0 : $window.scrollLeft(), //如果不是则找到滚动条
            dt = fixed ? 0 : $window.scrollTop(), //同上
            ww = $window.width(), //窗口的宽
            wh = $window.height(), //窗口的高
            ow = wrap.offsetWidth, //当前弹层的宽
            oh = wrap.offsetHeight, //同上
            left = (ww - ow) / 2 + dl,
            top = (wh - oh) / 2 + dt;

        // console.log(ow, oh)

        wrap.style.left = Math.max(parseInt(left), dl) + 'px';
        wrap.style.top = Math.max(parseInt(top), dt) + 'px';

        return this;
    }


    /**
     * 设置标题
     * @param  {string} str 设置标题
     * @return {self}
     */
    prototype.title = function(str){
        var self = this,
            className = 'ui-dialog-noTitle'; //没有标题时的class
        if (str === false) { //如果参数为false才不显示标题
            self.$('title').hide().empty();
            self.$('wrap').addClass(className);
        } else {
            self.$('title').html(str).show();
            self.$('wrap').removeClass(className);
        }

        return self;
    }


    /**
     * 创建HTMl代码到页面
     * @return {self}
     */
    prototype.__createHTML = function(){
        var $wrap = $('<div />').css({
            position: 'absolute',
            left: '-9999em',
            top: 0,
            outline: 'none'
        }).attr({
            'role': this.config.lock ? 'alertdialog' : 'dialog',
            'tabindex': -1
        });

        $wrap[0].innerHTML = this.config.tpl;

        document.body.appendChild($wrap[0]);
        this.__cache.wrap = $wrap;
    }



    /**
     * 获取jquery对象
     * @param  {string} id 模板里data-node的值
     * @return {jQuery object}
     */
    prototype.$ = function(id) {
        var cache = this.__cache;
        return cache[id] || (cache[id] = cache.wrap.find('[data-node=' + id + ']'));
    }





    /**
     * 缓存列表
     * @type {Object}
     */
    Dialog.list = {};

    Dialog.get = function(id){
        return Dialog.list[id] || Dialog.list;
    }


    // 浏览器窗口改变后重置对话框位置
    $window.bind('resize', function() {
        var id;
        for (id in Dialog.list) {
            Dialog.list[id].position();
        }
    });


    Dialog.focus = null;
window.dialog = Dialog;
window.$= $;
    return Dialog;
});