import { execSync } from 'child_process';
import * as vscode from 'vscode';

export class GitService {
  static getStagedDiff(): string {
    try {
      // Get the workspace folder (assumes single-root workspace)
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
      if (!workspaceFolder) {
        throw new Error('No workspace folder open');
      }

      // Run git diff --staged in the workspace folder
      return execSync('git diff --staged', { cwd: workspaceFolder, encoding: 'utf8' });
    } catch (error) {
      vscode.window.showErrorMessage('Git error: Unable to fetch staged changes. Is Git installed and a repo initialized?');
      throw error;
    }
  }

  static commit(message: string): void {
    try {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
      if (!workspaceFolder) {
        throw new Error('No workspace folder open');
      }

      execSync(`git commit -m "${message}"`, { cwd: workspaceFolder, encoding: 'utf8' });
      vscode.window.showInformationMessage('Commit successful!');
    } catch (error : any) {
      vscode.window.showErrorMessage('Commit failed: ' + error.message);
      throw error;
    }
  }
}