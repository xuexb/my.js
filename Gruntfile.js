module.exports = function(grunt) {
    'use strict';

    var Url = require('url');
    var fs = require('fs');
    var marked = require('marked');

    var config = grunt.file.readJSON('package.json'); //读取 package.json 配置


    var obj = {}; //初始化对象
    var connect = obj.connect = {}; //web server
    var jshint = obj.jshint = {}; //jshint


    //配置包
    obj.pkg = config;


    //jshint
    jshint.options = {
        jshintrc: true
    }
    jshint.all = {
        src: ['./src/**/*.js']
    }

    // http服务配置
    connect.server = {
        options: {
            port: '8800',
            base: './',
            hostname: '127.0.0.1',
            keepalive: true,
            open: true,
            middleware: function(connect, options, middlewares) {
                // inject a custom middleware into the array of default middlewares
                middlewares.unshift(function(req, res, next) {
                    var url = Url.parse(req.url).pathname,
                        html, tpl;


                    url = '.'+ url;

                    
                    //如果是目录
                    if(url.substr(url.length - 1) === '/'){
                        if (fs.existsSync(url + 'README.md')) {
                            url += 'README.md';
                        }
                    }

                    // 如果不是md文档则下一个
                    if (url.substr(url.length - 3) !== '.md') {
                        return next();
                    }

                    

                    if (!fs.existsSync(url)) {
                        return res.end('404');
                    }

                    html = fs.readFileSync(url).toString();

                    // console.log(html);

                    if(!html){
                        return res.end('error');
                    }

                    // 读取模板内容
                    tpl = fs.readFileSync('./markdown.tpl').toString();

                    // md化
                    html = marked(html);

                    // 替换md文档到模板里
                    tpl = tpl.replace('{{body}}', html);

                    // 生成标题
                    html = html.match(/<h1(?:.*?)>(.+?)<\/h1>/) || ['', url.substr(url.lastIndexOf('/') + 1) || 'md文档'];

                    // 替换标题
                    tpl = tpl.replace('{{title}}', html[1]);

                    res.end(tpl);
                });

                return middlewares;
            }
        }
    }



    grunt.initConfig(obj);



    //激活插件
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('server', function() {
        grunt.task.run('connect')
    });
}