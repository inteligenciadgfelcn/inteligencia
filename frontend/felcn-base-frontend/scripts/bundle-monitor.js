#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script para monitorear el impacto de las migraciones MUI → Vristo
 * Analiza bundle sizes y dependencias para medir la reducción conseguida
 */

const BASELINE_FILE = '.bundle-baseline.json';
const ANALYSIS_DIR = '.next/analyze';

// Colores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getBundleInfo() {
  try {
    // Leer package.json para dependencias
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = packageJson.dependencies || {};
    
    // Contar dependencias MUI
    const muiDeps = Object.keys(dependencies).filter(dep => 
      dep.startsWith('@mui/') || 
      dep.includes('material-ui') ||
      dep === 'mui' ||
      dep.includes('@emotion/')
    );

    // Obtener tamaños de build si existen
    let buildSizes = {};
    try {
      const buildOutput = execSync('npm run build 2>&1', { encoding: 'utf8' });
      
      // Parsear output de Next.js build
      const sizeMatches = buildOutput.match(/(\d+\.?\d*\s?[kMG]?B)/g);
      if (sizeMatches) {
        buildSizes.totalSize = sizeMatches[sizeMatches.length - 1];
      }
      
      // Buscar información específica del bundle
      const routeInfo = buildOutput.split('\n').filter(line => 
        line.includes('kB') && (line.includes('/') || line.includes('chunks'))
      );
      
      buildSizes.routes = routeInfo.length;
      buildSizes.details = routeInfo.slice(0, 5); // Primeras 5 rutas
      
    } catch (error) {
      buildSizes = { error: 'Build failed', message: error.message };
    }

    return {
      timestamp: new Date().toISOString(),
      totalDependencies: Object.keys(dependencies).length,
      muiDependencies: muiDeps.length,
      muiDependenciesList: muiDeps,
      buildSizes,
      nodeModulesSize: getNodeModulesSize()
    };
    
  } catch (error) {
    return { error: 'Failed to analyze bundle', message: error.message };
  }
}

function getNodeModulesSize() {
  try {
    const output = execSync('du -sh node_modules 2>/dev/null || echo "N/A"', { encoding: 'utf8' });
    return output.trim().split('\t')[0];
  } catch {
    return 'N/A';
  }
}

function saveBaseline(data) {
  fs.writeFileSync(BASELINE_FILE, JSON.stringify(data, null, 2));
  log(`✅ Baseline guardada en ${BASELINE_FILE}`, 'green');
}

function loadBaseline() {
  try {
    return JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8'));
  } catch {
    return null;
  }
}

function compareWithBaseline(current, baseline) {
  const comparison = {
    dependencies: {
      total: current.totalDependencies - baseline.totalDependencies,
      mui: current.muiDependencies - baseline.muiDependencies
    },
    nodeModules: {
      current: current.nodeModulesSize,
      baseline: baseline.nodeModulesSize
    }
  };

  // Calcular porcentaje de reducción MUI
  if (baseline.muiDependencies > 0) {
    comparison.muiReduction = {
      absolute: baseline.muiDependencies - current.muiDependencies,
      percentage: ((baseline.muiDependencies - current.muiDependencies) / baseline.muiDependencies * 100).toFixed(1)
    };
  }

  return comparison;
}

function displayReport(current, baseline = null) {
  log('\n📊 Bundle Monitoring Report', 'bold');
  log('================================', 'blue');
  
  log(`\n📅 Timestamp: ${current.timestamp}`, 'blue');
  log(`📦 Total Dependencies: ${current.totalDependencies}`, 'blue');
  log(`🎨 MUI Dependencies: ${current.muiDependencies}`, 'yellow');
  log(`💾 Node Modules Size: ${current.nodeModulesSize}`, 'blue');

  if (current.muiDependenciesList.length > 0) {
    log('\n🎨 MUI Dependencies Found:', 'yellow');
    current.muiDependenciesList.forEach(dep => {
      log(`  • ${dep}`, 'yellow');
    });
  }

  if (current.buildSizes.error) {
    log(`\n❌ Build Status: ${current.buildSizes.error}`, 'red');
    log(`   Message: ${current.buildSizes.message}`, 'red');
  } else {
    log('\n✅ Build Status: Success', 'green');
    if (current.buildSizes.totalSize) {
      log(`📊 Bundle Size: ${current.buildSizes.totalSize}`, 'green');
    }
    log(`🌐 Routes Analyzed: ${current.buildSizes.routes}`, 'green');
  }

  if (baseline) {
    log('\n📈 Comparison with Baseline:', 'bold');
    log('==============================', 'blue');
    
    const comparison = compareWithBaseline(current, baseline);
    
    const depChange = comparison.dependencies.total;
    const muiChange = comparison.dependencies.mui;
    
    log(`📦 Total Dependencies: ${depChange >= 0 ? '+' : ''}${depChange}`, depChange <= 0 ? 'green' : 'red');
    log(`🎨 MUI Dependencies: ${muiChange >= 0 ? '+' : ''}${muiChange}`, muiChange <= 0 ? 'green' : 'red');
    
    if (comparison.muiReduction) {
      log(`🎯 MUI Reduction: ${comparison.muiReduction.absolute} packages (${comparison.muiReduction.percentage}%)`, 'green');
    }
    
    log(`💾 Node Modules: ${comparison.nodeModules.baseline} → ${comparison.nodeModules.current}`, 'blue');
  }

  log('\n🎯 Migration Progress:', 'bold');
  log('=====================', 'blue');
  log('✅ VristoStatCard - MUI eliminated', 'green');
  log('✅ InformacionCard - MUI eliminated', 'green');
  log('✅ CustomBadge - MUI eliminated', 'green');
  log('✅ FullScreenLoading - MUI eliminated', 'green');
  log('✅ Backdrop - MUI eliminated', 'green');
  log('✅ ProgresoLineal - MUI eliminated', 'green');
  log('🔄 CustomDrawer - In progress', 'yellow');
  
  log('\n💡 Next Steps:', 'blue');
  log('• Fix CustomDrawer MUI dependencies', 'blue');
  log('• Remove unused MUI imports', 'blue');
  log('• Complete MUI package removal', 'blue');
}

// Función principal
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'baseline':
      const baselineData = getBundleInfo();
      saveBaseline(baselineData);
      displayReport(baselineData);
      break;
      
    case 'compare':
      const currentData = getBundleInfo();
      const baseline = loadBaseline();
      
      if (!baseline) {
        log('❌ No baseline found. Run: npm run bundle:baseline', 'red');
        process.exit(1);
      }
      
      displayReport(currentData, baseline);
      break;
      
    case 'current':
    default:
      const current = getBundleInfo();
      displayReport(current);
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = { getBundleInfo, compareWithBaseline, displayReport };