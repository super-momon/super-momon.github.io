/**
 * Design System Validation Script
 * 
 * Scans components for common design system violations:
 * - Hardcoded colors (hex, rgb, hsl)
 * - Arbitrary Tailwind values outside design tokens
 * - Missing accessibility attributes
 * - Inconsistent animation patterns
 * 
 * Usage: node .github/skills/design-monitor/scripts/validate.js [path]
 * Example: node .github/skills/design-monitor/scripts/validate.js src/components/
 */

const fs = require('fs');
const path = require('path');

// Configuration
const VALID_EXTENSIONS = ['.tsx', '.jsx', '.ts', '.js'];
const EXCLUDED_DIRS = ['node_modules', '.next', 'dist', 'build'];
const EXCLUDED_FILES = ['globals.css']; // globals.css is where tokens are defined

// Validation patterns
const PATTERNS = {
  hardcodedHex: {
    regex: /#[0-9a-fA-F]{3,6}/g,
    severity: 'high',
    message: 'Hardcoded hex color found. Use CSS variables instead.'
  },
  hardcodedRgb: {
    regex: /rgba?\([^)]+\)/g,
    severity: 'high',
    message: 'Hardcoded RGB color found. Use CSS variables instead.'
  },
  hardcodedHsl: {
    regex: /hsla?\([^)]+\)/g,
    severity: 'high',
    message: 'Hardcoded HSL color found. Use CSS variables instead.'
  },
  arbitraryTailwind: {
    regex: /text-\[[^\]]+\](?!var\(--)/g,
    severity: 'medium',
    message: 'Arbitrary Tailwind value without CSS variable.'
  },
  divAsButton: {
    regex: /<div[^>]*onClick/g,
    severity: 'critical',
    message: 'div used as button without role. Use <button> or add role="button".'
  },
  imgWithoutAlt: {
    regex: /<img(?![^>]*alt=)/g,
    severity: 'critical',
    message: 'Image without alt attribute.'
  },
  buttonWithoutLabel: {
    regex: /<button(?![^>]*aria-label)[^>]*>[^<]*<[^>]*>/g,
    severity: 'high',
    message: 'Button with only icon/child elements needs aria-label.'
  }
};

// Results storage
const results = {
  critical: [],
  high: [],
  medium: [],
  low: [],
  filesScanned: 0
};

/**
 * Recursively scan directory for files
 */
function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.includes(entry.name)) {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (VALID_EXTENSIONS.includes(ext) && !EXCLUDED_FILES.includes(entry.name)) {
        validateFile(fullPath);
      }
    }
  }
}

/**
 * Validate a single file
 */
function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  results.filesScanned++;
  
  // Check each pattern
  for (const [patternName, pattern] of Object.entries(PATTERNS)) {
    lines.forEach((line, index) => {
      const matches = line.match(pattern.regex);
      if (matches) {
        matches.forEach(match => {
          const issue = {
            file: filePath,
            line: index + 1,
            code: line.trim(),
            match: match,
            message: pattern.message,
            pattern: patternName
          };
          
          results[pattern.severity].push(issue);
        });
      }
    });
  }
}

/**
 * Format and print results
 */
function printResults() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║           DESIGN SYSTEM VALIDATION REPORT                         ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');
  
  console.log(`Files scanned: ${results.filesScanned}\n`);
  
  // Critical issues
  if (results.critical.length > 0) {
    console.log('❌ CRITICAL ISSUES:', results.critical.length);
    console.log('─'.repeat(70));
    results.critical.forEach(issue => {
      console.log(`\n📍 ${issue.file}:${issue.line}`);
      console.log(`   ${issue.message}`);
      console.log(`   Found: ${issue.match}`);
      console.log(`   Code: ${issue.code.substring(0, 80)}`);
    });
    console.log('\n');
  }
  
  // High severity issues
  if (results.high.length > 0) {
    console.log('⚠️  HIGH PRIORITY:', results.high.length);
    console.log('─'.repeat(70));
    results.high.forEach(issue => {
      console.log(`\n📍 ${issue.file}:${issue.line}`);
      console.log(`   ${issue.message}`);
      console.log(`   Found: ${issue.match}`);
    });
    console.log('\n');
  }
  
  // Medium severity issues
  if (results.medium.length > 0) {
    console.log('⚡ MEDIUM PRIORITY:', results.medium.length);
    console.log('─'.repeat(70));
    results.medium.forEach(issue => {
      console.log(`\n📍 ${issue.file}:${issue.line}`);
      console.log(`   ${issue.message}`);
    });
    console.log('\n');
  }
  
  // Summary
  const totalIssues = results.critical.length + results.high.length + results.medium.length;
  
  console.log('═'.repeat(70));
  console.log(`TOTAL ISSUES: ${totalIssues}`);
  console.log(`  Critical: ${results.critical.length}`);
  console.log(`  High: ${results.high.length}`);
  console.log(`  Medium: ${results.medium.length}`);
  console.log('═'.repeat(70));
  
  if (totalIssues === 0) {
    console.log('\n✅ No design system violations found!\n');
  } else {
    console.log('\n💡 Review the issues above and update components to follow design system.\n');
  }
  
  // Exit code
  process.exit(totalIssues > 0 ? 1 : 0);
}

// Main execution
const targetPath = process.argv[2] || 'src/';
const fullPath = path.resolve(targetPath);

if (!fs.existsSync(fullPath)) {
  console.error(`Error: Path "${fullPath}" does not exist.`);
  process.exit(1);
}

console.log(`Scanning: ${fullPath}\n`);

if (fs.statSync(fullPath).isDirectory()) {
  scanDirectory(fullPath);
} else {
  validateFile(fullPath);
}

printResults();
