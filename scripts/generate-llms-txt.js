#!/usr/bin/env node

/**
 * Script to generate llms.txt file and markdown versions of documentation
 * This follows the specification from https://llmstxt.org/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(path.resolve(__dirname, '..'), 'content', 'docs');
const OUTPUT_DIR = path.join(path.resolve(__dirname, '..'), 'public');
const LLMS_TXT_PATH = path.join(OUTPUT_DIR, 'llms.txt');
const LLMS_FULL_TXT_PATH = path.join(OUTPUT_DIR, 'llms-full.txt');
// Use environment variable for base URL if available, otherwise use default
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://github.com/cloud-media-forge';

// Utility to remove frontmatter and import statements from MDX files
function cleanMarkdown(content) {
  // Remove frontmatter (between --- markers)
  let cleanedContent = content.replace(/^---[\s\S]*?---\n/m, '');
  
  // Remove import statements
  cleanedContent = cleanedContent.replace(/import[\s\S]*?;\n/gm, '');
  
  // Remove JSX component tags (like <Cards>, <Card>, etc.)
  cleanedContent = cleanedContent.replace(/<Cards>[\s\S]*?<\/Cards>/gm, '');
  cleanedContent = cleanedContent.replace(/<Card[\s\S]*?\/>/gm, '');
  cleanedContent = cleanedContent.replace(/<Card[\s\S]*?<\/Card>/gm, '');
  
  // Replace other JSX components with their content
  cleanedContent = cleanedContent.replace(/<[\w]+[\s\S]*?>([\s\S]*?)<\/[\w]+>/gm, '$1');
  
  // Preserve mermaid diagrams with a note for LLMs
  cleanedContent = cleanedContent.replace(/```mermaid([\s\S]*?)```/gm, (match, diagramCode) => {
    return '```mermaid' + diagramCode + '```\n\n*Note: Above is a mermaid diagram code that represents a visual element in the documentation.*\n';
  });
  
  return cleanedContent.trim();
}

// Function to recursively find all MDX files
function findMdxFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    console.warn(`Directory not found: ${dir}`);
    return fileList;
  }
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findMdxFiles(filePath, fileList);
    } else if (file.endsWith('.mdx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to convert file path to URL path
function filePathToUrlPath(filePath) {
  const relativePath = path.relative(DOCS_DIR, filePath);
  const urlPath = relativePath
    .replace(/\.mdx$/, '')
    .replace(/\/index$/, '')
    .replace(/\\/g, '/');
  
  return `${BASE_URL}/docs/${urlPath}`;
}

// Function to generate markdown version of a file
function generateMarkdownVersion(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const cleanedContent = cleanMarkdown(content);
  
  // Create directory for the markdown file if it doesn't exist
  const relativePath = path.relative(DOCS_DIR, filePath);
  const mdFilePath = path.join(OUTPUT_DIR, 'docs', relativePath.replace(/\.mdx$/, '.md'));
  const mdFileDir = path.dirname(mdFilePath);
  
  if (!fs.existsSync(mdFileDir)) {
    fs.mkdirSync(mdFileDir, { recursive: true });
  }
  
  // Write markdown file
  fs.writeFileSync(mdFilePath, cleanedContent);
  
  // Return URL to the markdown file
  return `${filePathToUrlPath(filePath)}.md`;
}

// Function to get title from MDX file
function getTitleFromMdx(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const titleMatch = content.match(/title:\s*["']?(.*?)["']?(\n|,)/);
  
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }
  
  // If no title in frontmatter, use filename
  const filename = path.basename(filePath, '.mdx');
  return filename.charAt(0).toUpperCase() + filename.slice(1).replace(/-/g, ' ');
}

// Organize docs by category
function organizeDocs(files) {
  const categories = {};
  
  files.forEach(file => {
    const relativePath = path.relative(DOCS_DIR, file);
    const parts = relativePath.split(path.sep);
    
    if (parts.length > 1) {
      const category = parts[0];
      
      if (!categories[category]) {
        categories[category] = [];
      }
      
      categories[category].push(file);
    } else {
      // Root level files
      if (!categories['Core']) {
        categories['Core'] = [];
      }
      categories['Core'].push(file);
    }
  });
  
  return categories;
}

// Main function to generate llms.txt
function generateLlmsTxt() {
  console.log('Generating llms.txt and markdown versions of documentation...');
  
  // Ensure DOCS_DIR exists
  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`Error: Documentation directory not found at ${DOCS_DIR}`);
    process.exit(1);
  }
  
  // Find all MDX files
  const mdxFiles = findMdxFiles(DOCS_DIR);
  
  if (mdxFiles.length === 0) {
    console.warn(`Warning: No MDX files found in ${DOCS_DIR}`);
  }
  
  const categories = organizeDocs(mdxFiles);
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Ensure docs output directory exists
  const docsOutputDir = path.join(OUTPUT_DIR, 'docs');
  if (!fs.existsSync(docsOutputDir)) {
    fs.mkdirSync(docsOutputDir, { recursive: true });
  }
  
  // Generate markdown versions for all files
  const docLinks = {};
  const docContents = {};
  Object.keys(categories).forEach(category => {
    docLinks[category] = categories[category].map(file => {
      const title = getTitleFromMdx(file);
      const markdownUrl = generateMarkdownVersion(file);
      const content = fs.readFileSync(file, 'utf8');
      const cleanedContent = cleanMarkdown(content);
      
      docContents[markdownUrl] = {
        title,
        content: cleanedContent,
        category
      };
      
      return { title, url: markdownUrl, path: file };
    });
  });
  
  // Build llms.txt content
  let llmsTxtContent = '# MediaForge\n\n';
  llmsTxtContent += '> MediaForge is a restaking-powered Layer 2 network built on the OP Stack that extends Ethereum\'s security through EigenLayer\'s restaking mechanism while leveraging Optimism\'s proven infrastructure for scalability.\n\n';
  llmsTxtContent += 'MediaForge documentation provides comprehensive resources for developers, validators, and users to understand and interact with the MediaForge ecosystem.\n\n';
  
  // Add categories and links
  Object.keys(docLinks).forEach(category => {
    llmsTxtContent += `## ${category}\n\n`;
    
    docLinks[category].forEach(({ title, url, path }) => {
      // Get a brief description from the file if possible
      let description = '';
      try {
        const content = fs.readFileSync(path, 'utf8');
        const descMatch = content.match(/description:\s*["']?(.*?)["']?(\n|,)/);
        if (descMatch && descMatch[1]) {
          description = ': ' + descMatch[1].trim();
        }
      } catch {
        // Ignore errors - just continue without a description
      }
      
      llmsTxtContent += `- [${title}](${url})${description}\n`;
    });
    
    llmsTxtContent += '\n';
  });
  
  // Write llms.txt file
  fs.writeFileSync(LLMS_TXT_PATH, llmsTxtContent);
  
  console.log(`Generated llms.txt at ${LLMS_TXT_PATH}`);
  console.log(`Generated ${mdxFiles.length} markdown files in ${path.join(OUTPUT_DIR, 'docs')}`);
  
  // Generate llms-full.txt with all content
  generateLlmsFullTxt(docContents);
}

// Function to generate llms-full.txt with all content
function generateLlmsFullTxt(docContents) {
  console.log('Generating llms-full.txt with all documentation content...');
  
  // Start with the same header as llms.txt
  let fullContent = '# MediaForge\n\n';
  fullContent += '> MediaForge is a restaking-powered Layer 2 network built on the OP Stack that extends Ethereum\'s security through EigenLayer\'s restaking mechanism while leveraging Optimism\'s proven infrastructure for scalability.\n\n';
  fullContent += 'MediaForge documentation provides comprehensive resources for developers, validators, and users to understand and interact with the MediaForge ecosystem.\n\n';
  fullContent += '## Table of Contents\n\n';
  
  // Group content by category
  const contentsByCategory = {};
  Object.entries(docContents).forEach(([url, { title, content, category }]) => {
    if (!contentsByCategory[category]) {
      contentsByCategory[category] = [];
    }
    contentsByCategory[category].push({ title, content, url });
  });
  
  // Add table of contents
  Object.keys(contentsByCategory).forEach(category => {
    fullContent += `- [${category}](#${category.toLowerCase().replace(/\s+/g, '-')})\n`;
    contentsByCategory[category].forEach(({ title }) => {
      fullContent += `  - [${title}](#${title.toLowerCase().replace(/\s+/g, '-')})\n`;
    });
  });
  
  fullContent += '\n---\n\n';
  
  // Add all content
  Object.keys(contentsByCategory).forEach(category => {
    fullContent += `## ${category}\n\n`;
    
    contentsByCategory[category].forEach(({ title, content, url }) => {
      fullContent += `### ${title}\n\n`;
      fullContent += `*Source: [${url}](${url})*\n\n`;
      fullContent += `${content}\n\n`;
      fullContent += '---\n\n';
    });
  });
  
  // Write the full content file
  fs.writeFileSync(LLMS_FULL_TXT_PATH, fullContent);
  
  console.log(`Generated llms-full.txt at ${LLMS_FULL_TXT_PATH}`);
}

// Run the generator and catch any errors
try {
  generateLlmsTxt();
} catch (error) {
  console.error('Error generating llms.txt:', error);
  process.exit(1);
} 