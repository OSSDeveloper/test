"use strict";
let readFile = function (filePath) {
    let data = Deno.readTextFileSync(filePath);
    console.log(data);
    return data;
};
readFile('./README.md');
//# sourceMappingURL=file:///D:/Users/Vijay/deno/test/deno_dir/gen/file/D/Users/Vijay/deno/test/index.ts.js.map