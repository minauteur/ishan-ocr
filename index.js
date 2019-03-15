var fs = require('fs');
var path = require('path');

var searchRecursive = function(dir, pattern) {
  // This is where we store pattern matches of all files inside the directory
  var results = [];

  // Read contents of directory
  fs.readdirSync(dir).forEach(function (dirInner) {
    // Obtain absolute path
    dirInner = path.resolve(dir, dirInner);

    // Get stats to determine if path is a directory or a file
    var stat = fs.statSync(dirInner);

    // If path is a directory, scan it and combine results
    if (stat.isDirectory()) {
      results = results.concat(searchRecursive(dirInner, pattern));
    }

    // If path is a file and ends with pattern then push it onto results
    if (stat.isFile() && dirInner.endsWith(pattern)) {
      results.push(dirInner);
    }
  });

  return results;
};

var files = searchRecursive('./png', '.json'); // replace dir and pattern
                                                // as you seem fit

console.log(files);

let text = "";
for (let i=0; i<files.length; i++){
    let cur_path = files[i];
    let filename = cur_path.split('\\').pop();
    let header = "\r\n-------\r\n BEGIN \"text\" sub-object content from "+filename+"\r\n";
    let content = fs.readFileSync(cur_path);
    let json = JSON.parse(content);
    if (json.hasOwnProperty('fullTextAnnotation')) {
      text = text+header+json.fullTextAnnotation.text;
        console.log(json.fullTextAnnotation.text);
    }


}
fs.writeFile('combined-output.txt', text, (err) => {
  // throws an error, you could also catch it here
  if (err) throw err;

  // success case, the file was saved
  console.log('text output saved!');
});