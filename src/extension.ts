import * as vscode from 'vscode';
import { GitService } from './git';
import { AIService } from './ai';
import { Settings } from './settings';

// Define types for QuickPick items
interface SuggestionItem extends vscode.QuickPickItem {
  message: string;
}

interface ActionItem extends vscode.QuickPickItem {
  // No additional properties, just label and description from QuickPickItem
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('git-commit-ai.suggestCommit', async () => {
    try {
      // Get staged changes
      const diff = GitService.getStagedDiff();
      if (!diff.trim()) {
        vscode.window.showWarningMessage('No staged changes found');
        return;
      }

      // Generate suggestions
      const style = Settings.getCommitStyle();
      const suggestions = await AIService.generateCommitMessage(diff, style);

      // Show UI
      const items: (SuggestionItem | ActionItem)[] = [
        ...suggestions.map((msg): SuggestionItem => ({
          label: msg,
          description: 'Press Enter to commit, or edit',
          message: msg
        })),
        { label: 'Regenerate', description: 'Get new suggestions' } as ActionItem,
        { label: 'Custom', description: 'Write your own message' } as ActionItem
      ];

      const action = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select a commit message or action'
      });

      if (!action) return;

      if (action.label === 'Regenerate') {
        vscode.commands.executeCommand('git-commit-ai.suggestCommit');
        return;
      }

      let finalMessage: string;
      if (action.label === 'Custom') {
        finalMessage = await vscode.window.showInputBox({
          prompt: 'Enter your commit message',
          value: suggestions[0]
        }) || '';
      } else {
        // Type guard to check if action has message property
        finalMessage = 'message' in action ? action.message : suggestions[0];
      }

      if (finalMessage) {
        GitService.commit(finalMessage);
      }
    } catch (error) {
      console.error(error);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}