var fs = require('fs');
var path = require('path');
var rd = require('rd');
module.exports = function(){
    rd.read('./downloads', function (err, files) {
    if (err) throw err;
    files.map(function(filePath){
        if (path.extname(filePath) === '.download') {
            fs.unlinkSync(filePath)
        }
    })
    });
}