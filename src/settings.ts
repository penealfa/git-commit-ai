import * as vscode from 'vscode';

export class Settings {
  static getApiToken(): string {
    return vscode.workspace.getConfiguration('gitCommitAI').get('apiToken') || '';
  }

  static getCommitStyle(): 'conventional' | 'casual' | 'detailed' {
    return vscode.workspace.getConfiguration('gitCommitAI').get('commitStyle') || 'conventional';
  }
}