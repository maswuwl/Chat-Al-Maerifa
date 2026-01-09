
import { ProjectFile } from '../types';
import { Validator } from './Validator';
import { monitorLogger } from './Logger';
import { AutoRepair } from './AutoRepair';

export class ProjectWatcher {
  static watch(project: ProjectFile[]) {
    if (project.length === 0) return;

    monitorLogger.log('SYSTEM', `Analyzing new project version (${project.length} files)`);
    
    const result = Validator.validate(project);

    if (result.isValid && result.warnings.length === 0) {
      monitorLogger.log('INFO', 'Project validation passed. Integrity confirmed.');
    }

    result.warnings.forEach(w => {
      monitorLogger.log('WARN', w);
    });

    result.errors.forEach(e => {
      monitorLogger.log('ERROR', e);
      const fix = AutoRepair.suggestFix(e);
      if (fix) {
        monitorLogger.log('SYSTEM', `Auto-Repair Suggestion: ${fix}`);
      }
    });
  }
}
