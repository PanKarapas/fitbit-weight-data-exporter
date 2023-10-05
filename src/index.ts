import StreamZip from "node-stream-zip";
import { FitbitWeightDataPoint, FitbitWeightDataPointMetric } from "./model";
import * as fs from 'fs';
import { AsyncParser } from '@json2csv/node';
import moment from "moment";

if(process.argv.length == 4) {
    processZip("resources/MyFitbitData.zip", "output/Pan.csv");
} else {
    console.log("Usage: node index.js <input-file>.zip <output-file>.csv");
}

async function processZip(file: string, output: string) {
    const zip = new StreamZip.async({ file });
    const entries = await zip.entries();
    let outputData: FitbitWeightDataPointMetric[] = [];
    for (const key of Object.keys(entries)) {
        const entry = entries[key];
        if(entry.isFile && entry.name.match(".+?\/Personal & Account\/weight-.*")) {
            const values: FitbitWeightDataPoint[] = JSON.parse((await zip.entryData(entry.name)).toString());
            outputData = outputData.concat(values.map(convertToMetric));
        }
    }
    fs.writeFileSync(output, await new AsyncParser().parse(outputData).promise());
    await zip.close();
}


function convertToMetric(data: FitbitWeightDataPoint): FitbitWeightDataPointMetric {
    return {
        ...data,
        weight: Math.round(data.weight * 0.453592 * 10) / 10,
        date: moment(data.date, "MM/DD/YY").format("DD/MM/YYYY")
    };
}