#!/usr/bin/env node

/**
 * WordPress Block Creator
 * Creates blocks using @wordpress/create-block with sensible defaults
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

// Configuration
const CONFIG = {
  baseDir: path.join('assets', 'src', 'blocks'),
  defaults: {
    variant: 'static',
    namespace: 'ambrygen',
  },
  validArgs: ['title', 'variant', 'namespace', 'category', 'icon', 'keywords', 'short-description'],
  timeout: 300000,
};

// Simple logger
const log = {
  info: (msg) => console.log(`ℹ ${msg}`),
  success: (msg) => console.log(`✓ ${msg}`),
  error: (msg) => console.error(`✖ ${msg}`),
  warn: (msg) => console.warn(`⚠ ${msg}`),
};

/**
 * Validate block name format
 */
function validateBlockName(name) {
  if (!name?.trim()) {
    throw new Error('Block name is required');
  }

  const trimmed = name.trim();

  if (!/^[a-z0-9-]+$/.test(trimmed)) {
    throw new Error('Block name must contain only lowercase letters, numbers, and hyphens');
  }

  if (trimmed.startsWith('-') || trimmed.endsWith('-')) {
    throw new Error('Block name cannot start or end with a hyphen');
  }

  return trimmed;
}

/**
 * Parse command line arguments
 */
function parseArguments(args) {
  const parsed = {};
  const remaining = [];

  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, ...valueParts] = arg.slice(2).split('=');
      const value = valueParts.join('=');
      const normalizedKey = key.toLowerCase();

      if (CONFIG.validArgs.includes(normalizedKey) && value) {
        parsed[normalizedKey] = value;
      } else if (!CONFIG.validArgs.includes(normalizedKey)) {
        log.warn(`Unknown argument: --${key}`);
      }
    } else {
      remaining.push(arg);
    }
  }

  // Apply defaults
  Object.entries(CONFIG.defaults).forEach(([key, value]) => {
    if (!(key in parsed)) {
      parsed[key] = value;
    }
  });

  return { parsed, remaining };
}

/**
 * Build command arguments
 */
function buildCommandArgs(blockName, targetDir, args, remaining) {
  const cmdArgs = [
    '@wordpress/create-block',
    blockName,
    `--target-dir=${targetDir}`,
    '--no-plugin',
  ];

  // Add parsed args
  Object.entries(args).forEach(([key, value]) => {
    if (value) cmdArgs.push(`--${key}=${value}`);
  });

  // Add remaining args
  if (remaining.length) {
    cmdArgs.push(...remaining);
  }

  return cmdArgs;
}

/**
 * Check if directory exists
 */
async function directoryExists(dirPath) {
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Execute block creation command
 */
function executeBlockCreation(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', args, { stdio: 'inherit' });

    const timer = setTimeout(() => {
      child.kill();
      reject(new Error('Command timed out after 5 minutes'));
    }, CONFIG.timeout);

    child.on('error', (error) => {
      clearTimeout(timer);
      reject(new Error(`Failed to execute: ${error.message}`));
    });

    child.on('exit', (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

/**
 * Verify block was created
 */
async function verifyBlockCreation(blockDir, blockName) {
  if (!(await directoryExists(blockDir))) {
    throw new Error(`Block directory not found: ${blockDir}`);
  }

  // Check essential files
  const essentialFiles = ['block.json', 'index.js'];
  for (const file of essentialFiles) {
    const filePath = path.join(blockDir, file);
    try {
      await fs.access(filePath);
    } catch {
      log.warn(`Missing file: ${file}`);
    }
  }

  log.success(`Block "${blockName}" created at ${blockDir}`);
}

/**
 * Main function
 */
async function main() {
  try {
    const args = process.argv.slice(2);

    // Get and validate block name
    const blockName = validateBlockName(args.shift());
    log.info(`Creating block: ${blockName}`);

    // Parse arguments
    const { parsed, remaining } = parseArguments(args);

    // Setup paths
    await fs.mkdir(CONFIG.baseDir, { recursive: true });
    const blockDir = path.join(CONFIG.baseDir, blockName);

    // Check if already exists
    if (await directoryExists(blockDir)) {
      throw new Error(`Block "${blockName}" already exists at ${blockDir}`);
    }

    // Build and execute command
    const cmdArgs = buildCommandArgs(blockName, blockDir, parsed, remaining);
    await executeBlockCreation(cmdArgs);

    // Verify creation
    await verifyBlockCreation(blockDir, blockName);

  } catch (error) {
    log.error(error.message);
    process.exit(1);
  }
}

// Run
main();