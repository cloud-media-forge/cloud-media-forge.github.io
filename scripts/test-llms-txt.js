#!/usr/bin/env node

/**
 * Script to test the llms.txt generation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LLMS_TXT_PATH = path.join(path.resolve(__dirname, '..'), 'public', 'llms.txt');
const LLMS_FULL_TXT_PATH = path.join(path.resolve(__dirname, '..'), 'public', 'llms-full.txt');
const DOCS_PATH = path.join(path.resolve(__dirname, '..'), 'public', 'docs');

console.log('Testing llms.txt and llms-full.txt generation...');

// Check if llms.txt exists
if (!fs.existsSync(LLMS_TXT_PATH)) {
  console.error(`Error: llms.txt not found at ${LLMS_TXT_PATH}`);
  process.exit(1);
}

// Read llms.txt content
const llmsTxtContent = fs.readFileSync(LLMS_TXT_PATH, 'utf8');

// Check if llms.txt has expected structure
if (!llmsTxtContent.startsWith('# MediaForge')) {
  console.error('Error: llms.txt does not start with "# MediaForge"');
  process.exit(1);
}

if (!llmsTxtContent.includes('> MediaForge is a restaking-powered Layer 2 network')) {
  console.error('Error: llms.txt does not contain the expected introduction');
  process.exit(1);
}

// Check if markdown files exist
if (!fs.existsSync(DOCS_PATH)) {
  console.error(`Error: Docs directory not found at ${DOCS_PATH}`);
  process.exit(1);
}

// Extract links from llms.txt
const linkRegex = /\[.*?\]\((.*?)\)/g;
const links = [];
let match;
while ((match = linkRegex.exec(llmsTxtContent)) !== null) {
  links.push(match[1]);
}

if (links.length === 0) {
  console.error('Error: No links found in llms.txt');
  process.exit(1);
}

console.log(`Found ${links.length} links in llms.txt`);

// Verify some links exist locally (without the domain)
let foundValidLinks = false;
for (const link of links) {
  const url = new URL(link);
  const localPath = path.join(DOCS_PATH, url.pathname.replace('/docs/', ''));
  
  if (fs.existsSync(localPath)) {
    console.log(`Found valid link: ${localPath}`);
    foundValidLinks = true;
    break;
  }
}

if (!foundValidLinks) {
  console.error('Warning: None of the links in llms.txt point to existing local files');
}

// Now test llms-full.txt
if (!fs.existsSync(LLMS_FULL_TXT_PATH)) {
  console.error(`Error: llms-full.txt not found at ${LLMS_FULL_TXT_PATH}`);
  process.exit(1);
}

// Read llms-full.txt content
const llmsFullTxtContent = fs.readFileSync(LLMS_FULL_TXT_PATH, 'utf8');

// Check if llms-full.txt has expected structure
if (!llmsFullTxtContent.startsWith('# MediaForge')) {
  console.error('Error: llms-full.txt does not start with "# MediaForge"');
  process.exit(1);
}

if (!llmsFullTxtContent.includes('Table of Contents')) {
  console.error('Error: llms-full.txt does not contain a Table of Contents');
  process.exit(1);
}

// Check the size difference - llms-full.txt should be much larger
const llmsTxtSize = llmsTxtContent.length;
const llmsFullTxtSize = llmsFullTxtContent.length;

if (llmsFullTxtSize <= llmsTxtSize) {
  console.error('Error: llms-full.txt is not larger than llms.txt as expected');
  process.exit(1);
}

console.log(`llms.txt size: ${llmsTxtSize} bytes`);
console.log(`llms-full.txt size: ${llmsFullTxtSize} bytes (${Math.round(llmsFullTxtSize/llmsTxtSize)}x larger)`);

console.log('Test completed successfully!'); 