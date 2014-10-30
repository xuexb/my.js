module.exports = function(grunt) {
    'use strict'; //严禁模式

    var config = grunt.file.readJSON('package.json'); //读取 package.json 配置


    var obj = {}; //初始化对象
    var jshint = obj.jshint = {}; //jshint


    //配置包
    obj.pkg = config;


    //jshint
    jshint.options = {
        jshintrc: true
    }


    jshint.all = {
        src: ['./Gruntfile.js' './src/**/*.js']
    }



    grunt.initConfig(obj);



    //激活插件
    grunt.loadNpmTasks('grunt-contrib-jshint');
}