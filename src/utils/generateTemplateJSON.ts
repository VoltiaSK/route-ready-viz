
import { generateTemplateJSON } from './dataFetcher';
import fs from 'fs';
import path from 'path';

// Generate the JSON file
const jsonData = generateTemplateJSON();

// Convert to JSON string with nice formatting
const jsonString = JSON.stringify(jsonData, null, 2);

// Determine output path (could be configured)
const outputPath = path.join(__dirname, '../../public/fleetData.json');

// Write to file
fs.writeFileSync(outputPath, jsonString, 'utf8');

console.log(`Template JSON file with 150 vehicles created at: ${outputPath}`);
console.log(`EV readiness should be approximately 92%.`);

// This file can be run with:
// npx ts-node src/utils/generateTemplateJSON.ts
