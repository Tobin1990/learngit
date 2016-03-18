//由于使用了bower，有很多非必须资源。通过set project.files对象指定需要编译的文件夹和引用的资源
fis.set('project.files', ['page/**', 'map.json', 'modules/**', 'lib']);

fis.set('location', '/kent_project/baidu/project/dboss/dist'); //本地xampp路径
fis.set('product', '/kent_project/baidu/project/dboss/product'); //本地模拟生产路径
fis.set('statics', '/statics'); //static目录

//FIS modjs模块化方案，您也可以选择amd/commonjs等
fis.hook('module', {
    mode: 'mod'
});

/*************************目录规范*****************************/
fis.match("**/*", {
        release: '${statics}/$&' //生成目录
    })
    //modules下面都是模块化资源
    .match(/^\/modules\/(.*)\.(js)$/i, {
        isMod: true,
        id: '$1', //id支持简写，去掉modules和.js后缀中间的部分
        release: '${statics}/$&'
    })
    //modules下面都是模块化资源
    .match(/^\/modules\/(.*)\.(css)$/i, {
        isMod: true,
        id: '$1', //id支持简写，去掉modules和.css后缀中间的部分
        release: '${statics}/$&'
    })
    //page下面的页面发布时去掉page文件夹
    .match(/^\/page\/(.*)$/i, {
        useCache: false,
        release: '$1'
    })
    //一级同名组件，可以引用短路径，比如modules/jquery/juqery.js
    //直接引用为var $ = require('jquery');
    .match(/^\/modules\/([^\/]+)\/\1\.(js)$/i, {
        id: '$1'
    })
    //less的mixin文件无需发布
    .match(/^(.*)mixin\.less$/i, {
        release: false
    })
    //前端模板,当做类js文件处理，可以识别__inline, __uri等资源定位标识
    .match("**/*.tmpl", {
        isJsLike: true,
        release: false
    })
    //页面模板不用编译缓存
    .match(/.*\.(html|jsp|tpl|vm|htm|asp|aspx|php)$/, {
        useCache: false
    })



/****************异构语言编译*****************/
//less的编译
//npm install [-g] fis-parser-less
fis.match('**/*.less', {
    rExt: '.css', // from .scss to .css
    parser: fis.plugin('less', {
        //fis-parser-less option
    })
});



//打包与css sprite基础配置
fis.match('::packager', {
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
        resourceType: 'mod',
        useInlineMap: true // 资源映射表内嵌
    }),
    packager: fis.plugin('map'),
    spriter: fis.plugin('csssprites', {
        layout: 'matrix',
        margin: '15'
    })
})

/********************** 提交代码到远程QA测试环境下 ********************/
//使用方法 fis3 release qa
fis.media('qa').match('*', {
  deploy: fis.plugin('http-push', {
    receiver: 'http://cq.01.p.p.baidu.com:8888/receiver.php', //接收脚本
    to: '/home/work/htdocs' // 注意这个是指的是测试机器的路径，而非本地机器
  })
});
// /d/xampp/htdocs/kent_project/baidu/project/dboss/dist
/********************** 提交代码到本地XAMPP环境下 ********************/
//使用方法 fis3 release xampp
fis.media('xampp').match("**/*", {
        url: '${location}${statics}$&' //在本地xampp环境下的文件访问路径
    }).match('*', {
    deploy: fis.plugin('local-deliver', {
        to: 'd://xampp/htdocs/kent_project/baidu/project/dboss/dist' // 本地物理路径
    })
});
/**********************生产环境下CSS、JS压缩合并*****************/
//使用方法 fis3 release prod
fis.media('prod').match("**/*", {
        url: '${product}${statics}$&' //在本地环境下的文件访问路径,如发布到生成环境一定要去掉
    })
    //注意压缩时.async.js文件是异步加载的，不能直接用annotate解析
    .match('**.js', {
        preprocessor: fis.plugin('annotate'),
        optimizer: fis.plugin('uglify-js')
    })
    .match('/**(\.async).js', {
        preprocessor: null,
        optimizer: null
    })
    .match('/**(side_bar).js', {
        preprocessor: null,
        optimizer: null
    })
    .match('/**(ace_extra).js', {
        preprocessor: null,
        optimizer: null
    })
    .match('**.css', {
        optimizer: fis.plugin('clean-css')
    })
    .match("lib/mod.js", {
        packTo: "/pkg/vendor.js"
    })
    //所有页面中引用到的bower js资源
    .match("bower_components/**/*.js", {
        packTo: "/pkg/vendor.js"
    })
    //所有页面中引用到的bower css资源
    .match("bower_components/**/*.css", {
        packTo: "/pkg/vendor.css"
    })
    .match('*', {
        deploy: fis.plugin('local-deliver', {
        //receiver: 'http://cq.01.p.p.baidu.com:8888/receiver.php', //接收脚本
            to: 'd://xampp/htdocs/kent_project/baidu/project/dboss/product' // 本地物理路径
        })
    });