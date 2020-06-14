import { join, BufReader, parse, _ } from "./deps.ts";

interface Planet{
    [key: string] : string
}

let readFile = async function (strPath: string) { 
    return await Deno.readTextFile(await Deno.realPath(strPath));
}

let readDir = async function (dirPath: string) {
    let ary = [];
    for await (const dirEntry of Deno.readDir(dirPath)) {
        ary.push(dirEntry.name);
    }
    return ary;
}

let findHabitablePlanets = async function (strPath: string) {
    strPath = await Deno.realPath(strPath);
    const file = await Deno.open(strPath, { read: true });
    const bufReader = new BufReader(file);
    const result = await parse(bufReader, {header: true, comment: '#'})
    Deno.close(file.rid);
    
    const habitablePlanets = (result as Array<Planet>).filter((planet) => {
        const planetaryRadius = Number(planet['koi_prad']);
        // const stellarMass = Number(planet['koi_smass']);
        const stellarRadius = Number(planet['koi_srad']);
        
        return (planet['koi_disposition'] === 'CONFIRMED'
            && planetaryRadius > 0.5 && planetaryRadius < 1.5
            // && stellarMass > 0.78 && stellarMass < 1.04
            && stellarRadius > 0.99 && stellarRadius < 1.01
        );
    });
    
    return habitablePlanets.map((planet) => {
        return _.pick(planet, [
            'koi_prad',
            'koi_srad',
            'kepler_name',
            'koi_tce_plnt_num',
            'koi_steff'
        ]);
    });
}

let results = await findHabitablePlanets('./nasa_data/cumulative_2020.06.13_17.31.23.csv');
console.log(results);
console.log("Results : ", results.length);
