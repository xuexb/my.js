module.exports = function(grunt) {
    'use strict';

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
        src: ['./Gruntfile.js', './src/**/*.js']
    }

    // http服务配置
    connect.server = {
        options: {
            port: '81',
            base: './',
            hostname: '127.0.0.1',
            keepalive: true,
            open: true
        }
    }



    grunt.initConfig(obj);



    //激活插件
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('test', function(){
        console.log('test');
        grunt.task.run('connect')
    });
}