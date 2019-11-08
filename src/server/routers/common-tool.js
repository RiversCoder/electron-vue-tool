const path = require('path');
const request = require('request');
const async = require("async");
const fs = require('fs');
const mkdirp =require('mkdirp');

// 公共方法
async function sleep(duration) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
    });
};

// 验证文件夹是否存在，如果不存在创建该文件夹
async function mkdir(path) {
    console.log('准备创建目录：%s', path);
    if (fs.existsSync(path)) {
        console.log('目录：%s 已经存在', path);
    }else {
        return mkdirp(path, function (err) {
            console.log('目录：%s 创建成功'.info, path);
        });
    }
}