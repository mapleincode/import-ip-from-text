'use strict';

const async = require('async');
const Toshihiko = require('toshihiko');
const config = require('./config.json');
const fs = require('fs');
const Iconv  = require('iconv').Iconv;
const iconv = new Iconv('GBK', 'UTF-8');

const toshihiko = new Toshihiko.Toshihiko("mysql", config.mysql);
const Type = Toshihiko.Type;

const IpTable = toshihiko.define('ip', [
    { name: 'ipNo', type: Type.Integer, primaryKey: true },
    { name: 'ipStart',  type: Type.String },
    { name: 'ipEnd', type: Type.String },
    { name: 'place', type: Type.String },
    { name: 'attribution', type: Type.String }
]);



function getText(callback) {
    fs.readFile(config.ipText.path, { encoding: null }, function(err, buffer) {
        if(err) {
            return callback(err);
        }
        let text;
        if(config.ipText.encoding.toLowerCase() === 'gbk') {
            text = iconv.convert(buffer).toString();
        } else {
            text = buffer.toString();
        }
        return callback(undefined, text);
    });
}

function convert(ip) {
    const t = ip.split('.');
    return parseInt(t[0] * 256 * 256 * 256) + parseInt(t[1] * 256 * 256) + parseInt(t[2] * 256) + parseInt(t[3]);
}

function splitData(text) {
    text = text.replace(/\r/g, '\n');
    const array = text.split('\n').map(s => s.trim()).filter(s => s);

    const saveArray = [];

    for(const s of array) {
        const t = s.split(' ').map(s => s.trim()).filter(s => s);
        if(t.length < 4) {
            continue;
        }
        const ipStart = t.shift();
        const ipEnd = t.shift();
        const place = t.shift();
        const attribution = t.join(' ');
        const ipNo = convert(ipStart);

        saveArray.push(IpTable.build({
            ipNo,
            ipStart,
            ipEnd,
            place,
            attribution
        }));
    }

    async.eachLimit(saveArray, 5, function(save, callback) {
        save.save(callback);
    }, function(err) {
        console.log(err);
        console.log('end');
    })
}


getText(function(err, text) {
    splitData(text);
});
