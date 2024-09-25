import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

export function cloneRepo(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Clonando el repositorio...');

    const homeDir = os.homedir(); // Obtener el directorio del usuario
    const destinationFolder = path.join(homeDir, 'repos', options.path || 'new-project-schema'); // Asegúrate de que la ruta sea correcta

    // Verifica si el directorio de destino ya existe
    if (tree.exists(destinationFolder)) {
      context.logger.error(`La carpeta de destino "${destinationFolder}" ya existe. Abortando la clonación.`);
      return tree; // Devuelve el árbol sin realizar la clonación
    }

    const repoUrl = 'https://github.com/EBL09/standard.git';
    const branch = options.branch || 'schema';

    // Clonar el repositorio y hacer checkout de la rama específica
    try {
      execSync(`git clone --branch ${branch} ${repoUrl} ${destinationFolder}`, { stdio: 'inherit' });
      context.logger.info(`Repositorio clonado y rama ${branch} seleccionada.`);
      
      // Eliminar el directorio .git para que no quede rastro
      const gitDir = path.join(destinationFolder, '.git');
      if (fs.existsSync(gitDir)) {
        fs.rmSync(gitDir, { recursive: true, force: true }); // Elimina el directorio .git
        context.logger.info(`Directorio .git eliminado de "${destinationFolder}".`);
      }
    } catch (e) {
      context.logger.error('Error al clonar el repositorio:', e.message);
    }

    return tree; // Devuelve el árbol modificado
  };
}
