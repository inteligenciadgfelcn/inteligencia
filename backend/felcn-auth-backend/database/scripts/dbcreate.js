const { execSync } = require('child_process');
const path = require('path');

const dockerContainer = process.argv[2] || 'postgres16';
const sqlFile = path.join(__dirname, 'dbcreate.sql');
const containerSqlFile = '/tmp/dbcreate.sql';

try {
  console.log(`\n >>> Creando Base de datos en ${dockerContainer}...\n`);
  
  console.log(`\nReiniciando el contenedor ${dockerContainer}...\n`);
  execSync(`docker restart ${dockerContainer}`, { stdio: 'inherit' });

  // Wait a bit for the container to be ready
  execSync('node -e "setTimeout(() => {}, 2000)"');

  console.log(`\nPreparando script de creación...\n`);
  execSync(`docker cp "${sqlFile}" ${dockerContainer}:${containerSqlFile}`, { stdio: 'inherit' });

  console.log(`\nEjecutando script de creación...\n`);
  console.log(`\n========== dbcreate.sql =========\n`);
  execSync(`docker exec ${dockerContainer} bash -c "cat ${containerSqlFile}"`, { stdio: 'inherit' });
  console.log(`\n---------------------------------\n`);
  
  execSync(`docker exec ${dockerContainer} bash -c "psql -U postgres -f ${containerSqlFile}"`, { stdio: 'inherit' });

  console.log(`\n [Éxito]: Base de datos creada en el contenedor ${dockerContainer}\n`);
} catch (error) {
  console.error('\n\nERROR: Ocurrió un error mientras se ejecutaba el script :(\n\n');
  process.exit(1);
}
