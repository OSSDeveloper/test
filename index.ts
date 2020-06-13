
let readFile = function (filePath: string): string {
    let data = Deno.readTextFileSync(filePath);
    console.log(data);
    return data;
}

readFile('./README.md');