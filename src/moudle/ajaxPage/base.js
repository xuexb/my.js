/**
 * 异步分页
 * @copyright 嫁拍
 * @author xieliang
 * @email admin@xuexb.com
 *
 * @example
 *     1, var demo = new AjaxPage({
                url: '/api.php',
                offsetTop: 20,
                elem: '#J-test',
                tpl: $('#J-tpl').html(),
                filterData: function(res){
                    return {
                        list: res.list,
                        type: 1
                    }
                }
            }).request();
            demo.request({
                type: this.getAttribute('data-type'),
                page: 1
            });
        2, demo.on('success', function(res){});
 */

define(function(require){
    'use strict';

    var $ = require('./jquery'),
        Event = require('./event'),
        Template = require('./template'),
        pro;


    /**
     * 构造函数
     * @param {object} config 配置对象
     */
    function AjaxPage(config){
        var self = this;
        config = self.config = $.extend(true, {}, AjaxPage.defaults, config || {});
        self.__event = new Event();
        self.__dom = {};
        self.__count = self.__page_count = 0;

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
        
        self.status = 0;

        //设置容器
        self.__dom.wrap = $(config.elem).eq(0);

        if(!self.$('wrap').length){
            throw new Error('选择器为空');
        }

        if(!config.url){
            throw new Error('后端URL为空');
        }

        if(!$.isPlainObject(config.data)){
            config.data = AjaxPage.defaults.data;
        }



        self.init();
    }

    /**
     * 原型链
     * @type {object}
     */
    pro = AjaxPage.prototype;


    /**
     * 初始化
     */
    pro.init = function(){

        var self = this,
            config = self.config;

        self.$('wrap').html('\
            <div class="ui-ajax">\
                <div class="ui-ajax-error" data-dom="error"></div>\
                <div class="ui-ajax-loading success" data-dom="loading"><span>加载中...</span></div>\
                <div class="ui-ajax-list" data-dom="list"></div>\
                <div class="ui-ajax-page" data-dom="page"></div>\
                <div class="ui-ajax-mask" data-dom="mask"></div>\
            </div>');

        self.$('page').on('click', 'a', function(){
            var page;

            if (this.className !== 'current' && this.className !== 'disabled') {
                page = parseInt(this.getAttribute('data-page'), 10) || 1;

                if(self.__event.trigger(self, 'page', [{page: page}, 'page']) !== false){
                    self.request({
                        page: page
                    }, 'page');
                }
            }
            return !1;
        });

        self.$('error').on('click', function(){
            self.reload();
        });

        if(config.request){
            self.request(null, 'init');
        }

         return self;
    }


    /**
     * 绑定事件
     * @param  {string} type     事件名， 支持 beforeSend请求前, success请求成功, error请求失败
     * @param  {function} calblack 回调方法
     * @return {object}          当前实例
     */
    pro.on = function(type, calblack){
        return this.__event.on(type, calblack), this;
    }

    pro.one = function(type, calblack){
        return this.__event.one(type, calblack), this;
    }


    /**
     * 卸载事件
     * @param  {string} type     事件名， 支持 beforeSend请求前, success请求成功, error请求失败
     * @param  {function} calblack 回调方法
     * @return {object}          当前实例
     */
    pro.off = function(type, calblack){
        return this.__event.off(type, calblack), this;
    }


    /**
     * 设置/获取数据
     * @param  {string} key   要操作的key
     * @param  {string|undefined|null} value 如果为空则为获取，如果为null则为删除，否则为设置
     */
    pro.data = function(key, value){
        var self = this;

        if(!key){
            return self;
        }

        if(value === void 0){
            return self.config.data[key];
        } else if(value === null) {
            delete self.config.data[key];
        } else {
            self.config.data[key] = value;
        }

        return self;
    } 


    /**
     * 发送请求
     * @param {object} param 发送携带的参数，该参数会合并为 config.data
     * @param {string} type 请求的类型，有reload,page,request,init等
     */
    pro.request = function(param, type){
        var self = this,
            config = self.config;

        if(self.status === 1){
            return self;
        }

        self.$('error').slideUp();


        //如果第一个不是 {}
        if(!$.isPlainObject(param)){
            param = null;
        }

        //默认为request请求的
        type = type || 'request';

        // 如果请求前事件返回false，则不请求， 并拿参数和类型作为参数
        if(self.__event.trigger(self, 'beforeSend',[param || {}, type]) === false){
            self.status = 4;
            return false;
        }


        if(type === 'page'){
            self.scrollTo();
        }

        if(type !== 'init'){
            self.$('loading').show();
            self.$('mask').show();
        }


        //设置状态
        self.status = 1;


        // 把参数合并到config.data
        if(param){
            config.data = $.extend(config.data, param);
        }



        $.ajax({
            url: config.url,
            data: config.data,
            type: 'GET',
            dataType: 'json',
            cache: false
        }).success(function(res){

            self.__renderData(res);

        }).error(function(){
            self.__event.trigger(self, 'error');
            self.status = 2;

            self.$('error').html('加载出错, 点击重试').stop().show();
        }).complete(function(){
            var status = self.status;
            
            if(status === 2){
                self.$('loading').hide();
            } else {
                self.status = 1;
                self.$('loading').slideUp(400, function(){
                    self.status = status;
                });
            }

            self.$('mask').hide();
        });


        return self;
    }



    /**
     * 渲染数据
     */
    pro.__renderData = function(res){
        var self = this,
            config = self.config,
            html;

        // 容错
        res.list = res.list || [];

        self.status = 3;


        if('function' === typeof(config.filterData)){
            res = config.filterData.call(self, res) || {};
        }


        if(self.__event.trigger(self, 'success', [res]) === false){
            return false;
        }


        html = Template.compile(config.tpl)(res);

        self.$('list').html(html);

        // $(html).hide().appendTo(self.$('list').empty()).fadeIn();


        config.data.page = parseInt(config.data.page, 10) || 1;
        self.__count = parseInt(res.total, 10) || 0;//总数
        self.__page_count = Math.ceil(self.__count / config.data.page_size); //计算出多少页

        if(config.data.page > self.__page_count){
            config.data.page = self.__page_count;
        }

        self.__setPage();
    }


    /**
     * 设置分页 1.0
     */
    pro.__setPage = function(){
        var self = this;

        if(self.__page_count < 2){
            self.$('page').empty();
            return self;
        }

        var html = '<div class="ui-page mt20"><div class="ui-page-cnt">',
            config = self.config,
            page = config.data.page,//当前页
            page_count = self.__page_count,//总页
            start = page - 2,//起始页码
            len = 1,//最多出现5个页码
            end;//结束页码

        if(page_count < 6){//如果总页小于6则直接循环
            start = 1;
            end = page_count;
        } else if(page >= page_count - 2){//如果当前页接近末尾
            start = page - 4 + (page_count - page);
            end = page_count;
        } else {
            if(start < 1){//如果小于1
                start = 1;
            }
            end = start;

            while(true){
                if(len >= 5 || end >= page_count){//出现5次就跳出  或者为最后一页
                    break;
                }
                end += 1;
                len += 1;
            }
        }
        

        //处理上一页
        if(page === 1){
            html += '<a href="#" class="disabled">《</a>';
        } else {
            if(page - 5 < 2){
                html += '<a href="#" data-page="1">《</a>';
            } else {
                html += '<a href="#" data-page="'+ (page - 5) +'">《</a>';
            }
        }

        for (; start <= end; start++) {
            if(start === page){
                html += '<a data-page="'+ start +'" href="#" class="current">'+ start +'</a>'
            } else {
                html += '<a data-page="'+ start +'" href="#">'+ start +'</a>'
            }
        }


        //处理下一页
        if(page === page_count){
            html += '<a href="#" class="disabled">》</a>';
        } else {
            if(page + 5 > page_count){
                html += '<a href="#" data-page="'+ page_count +'">》</a>';
            } else {
                html += '<a href="#" data-page="'+ (page + 5) +'">》</a>';
            }
        }

        html += '</div></div>';

        self.$('page').html(html);

    }

    /**
     * 设置分页 2.0
     */
    /*pro.__setPage = function(){
        var self = this;

        if(self.__page_count < 2){
            self.$('page').empty();
            return self;
        }


        var config = self.config,
            str = '',
            page = config.data.page,//当前页
            pageCount = self.__page_count,//总页
            i = 1;


        if (page > 1) {
            str += 
                '<a href="#" data-page="1" class="ui-page-first">\
                    <i></i>首页\
                </a>';
        } else {
            str += 
                '<a href="#" data-page="1" class="ui-page-first disabled">\
                    <i></i>首页\
                </a>';
        }

        if (pageCount < 7) {
            for (i; i <= pageCount; i++) {
                if (page === i) {
                    str += '<span class="current">' + i + '</span>';
                } else {
                    str += '<a href="#" data-page="'+ i +'">' + i + '</a>';
                }
            }
        } else {
            var start, end;
            if (page === 1) {
                str += '<span class="current">1</span>';
            } else {
                str += '<a data-page="1" href="#">1</a>';
            }
            if (page > 4) {
                str += '<span>...</span>';
            }
            if (page < 5) {
                start = 1;
            } else {
                start = page - 2;
            }

            if (page > (pageCount - 4)) {
                end = pageCount;
            } else {
                end = page + 3;
            }
            for (var i2 = start; i2 < end; i2++) {
                if (i2 !== 1 && i2 !== pageCount) { //避免重复输出1和最后一页
                    if (i2 === page) {
                        str += '<span class="current">' + i2 + '</span>';
                    } else {
                        str += '<a data-page="'+ i2+'" href="#">' + i2 + '</a>';
                    }
                }
            }
            if (page < (pageCount - 4)) {
                str += '<span>...</span>';
            };
            if (page === pageCount) {
                str += '<span class="current">' + pageCount + '</span>';
            } else {
                str += '<a data-page="'+ pageCount+'" href="#">' + pageCount + '</a>';
            };
            start = end = null;
        }

        if (page < pageCount) {
            str += 
                '<a href="#" data-page="'+ pageCount +'" class="ui-page-last">\
                    尾页<i></i>\
                </a>';
        } else {
            str += 
                '<a href="#" data-page="'+ pageCount +'" class="ui-page-last disabled">\
                    尾页<i></i>\
                </a>';
        }

        self.$('page').html('<div class="ui-page mt20"><div class="ui-page-cnt">' + str + '</div></div>');
    }*/


    




    /**
     * 设置滚动条滚动到容器顶
     */
    pro.scrollTo = function(){
        var top = this.$('wrap').offset().top;
        $('body, html').animate({ scrollTop: top + this.config.offsetTop}, 500, 'easeOutExpo')
    }



    /**
     * 选择器
     * @param  {string} name 要选择的东东，支持 wrap,page,list,loading
     * @return {jQuery}     jquery对象
     */
    pro.$ = function(name){
        var dom = this.__dom;
        return dom[name] || (dom[name] = dom.wrap.find('[data-dom="'+ name +'"]'));
    }



    /**
     * 刷新
     */
    pro.reload = function(){
        return this.request(null, 'reload'), this;
    }



    /**
     * 默认参数
     * @type {Object}
     */
    AjaxPage.defaults = {
        elem: null,//替换容器
        data: {
            page_size: 15,
            page: 1
        },//向后端发送的东东
        url: '',//后端url
        request: false,//是否开始请求
        offsetTop: 0,//x轴偏移
        tpl: null//模板， 基于artTemplate
    }

    return AjaxPage;
});