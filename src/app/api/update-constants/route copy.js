import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const constants = await req.json();
    // const filePath = path.join(process.cwd(), 'app', 'utils', 'constants.js');
    const filePath = path.join(process.cwd(), 'src', 'app', 'utils', 'constants.js');

    
    let fileContent = '';
    // Object.entries(constants).forEach(([key, value]) => {
    //   fileContent += `export const ${key} = ${JSON.stringify(value, null, 2)};\n\n`;
    // });


    Object.entries(constants).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Handle arrays
        fileContent += `export const ${key} = [\n${value.map(item => `  ${JSON.stringify(item)}`).join(',\n')}\n];\n\n`;
      } else if (typeof value === 'object' && value !== null) {
        // Check if the object is array-like (has numeric keys starting from 0)
        const isArrayLike = Object.keys(value).every((key, index) => Number(key) === index);
        if (isArrayLike) {
          // Convert array-like object to array
          const arrayValue = Object.values(value);
          fileContent += `export const ${key} = [\n${arrayValue.map(item => `  ${JSON.stringify(item)}`).join(',\n')}\n];\n\n`;
        } else {
          // Handle regular objects
          fileContent += `export const ${key} = ${JSON.stringify(value, null, 2)};\n\n`;
        }
      } else {
        // Handle primitive values
        fileContent += `export const ${key} = ${JSON.stringify(value)};\n\n`;
      }
    });

    console.log('Attempting to write to:', filePath);
    fs.writeFileSync(filePath, fileContent);
    
    return NextResponse.json({ message: 'Constants updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating constants:', error);
    return NextResponse.json({ message: 'Failed to update constants' }, { status: 500 });
  }
}