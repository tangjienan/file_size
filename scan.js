const testFolder = process.cwd();
const fs = require('fs');
var path = require("path")
var pq = require("js-priority-queue")

let queue = new pq({ comparator: function(a, b) { return b.size - a.size }});
let visited = []
let globalCount = 0

var scanFileUpto = function(level, currentFolder) {
    if (level != 0) {
        let absFile = path.join(currentFolder, "..");
        console.log(absFile)
        scanFileUpto(level - 1, absFile)
    }
    readFolder(currentFolder)
}

var readFolder = function(currentFolder) {
    fs.readdir(currentFolder, (err, files) => {
        if (files == undefined) return
        files.forEach(file => {
          //if (file === "Terminal.app") return
          let absFile = path.join(currentFolder, file);
          if (is_dir(absFile)) {
              //console.log(absFile)
              globalCount += 1
              readFolder(absFile)
          } else {
            let size =  getFilesizeInBytes(absFile)
            if (size == -1) return
            var obj = {
                name : absFile,
                size : size
            }
            //console.log(file)
            queue.queue(obj)
          }
        });
        globalCount -= 1
        console.log(globalCount)
        if (globalCount == 0) {
           largest(10)
        }
    })
}

function getFilesizeInBytes(filename) {
    try {
            var stats = fs.statSync(filename)
            var fileSizeInBytes = stats["size"]
            return fileSizeInBytes / (1024 * 1024)
        }
        catch(err) {
            //console.log('it does not exist');
            return -1;
    }
   
}

function is_dir(path) {
    try {
        var stat = fs.lstatSync(path);
        return stat.isDirectory();
    } catch (e) {
        return false;
    }
}

var largest = function(k) {
    if ( k >= queue.length) k = queue.length - 1
    while ( k > 0) {
        var firstItem = queue.dequeue();
        console.log(firstItem.name + " " + firstItem.size + "mb")
        k -= 1
    }
}

scanFileUpto(1, __dirname)

