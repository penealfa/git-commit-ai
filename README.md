# Git Commit AI

A VS Code extension that suggests meaningful Git commit messages based on your staged changes using AI-powered generation via the Hugging Face Inference API.

## Features

- **Git Integration**: Analyzes staged changes with `git diff --staged`.
- **AI-Powered Suggestions**: Generates commit messages using a free Hugging Face model (e.g., Mixtral-8x7B-Instruct).
- **User Interface**: Displays suggestions in a VS Code Quick Pick modal, allowing you to approve, edit, or regenerate messages.
- **Commit Execution**: Commits directly with `git commit -m` when a message is approved.
- **Customization**: Supports different commit styles (Conventional Commits, casual, detailed) and API token configuration.
- **Error Handling**: Provides feedback for Git or API issues.

## Installation

1. **Install from VS Code Marketplace**:
   - Search for `Git Commit AI` in the Extensions view (Ctrl+Shift+X or Cmd+Shift+X).
   - Click **Install**.

2. **Manual Installation** (for development):
   - Clone this repository:
     ```bash
     git clone https://github.com/penealfa/git-commit-ai
     cd git-commit-ai
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Open in VS Code and press F5 to run in Extension Development Host mode.

## Prerequisites

- **Git**: Installed and available in your PATH (run `git --version` to check).
- **Hugging Face API Token**: A free token from [huggingface.co](https://huggingface.co/settings/tokens) with **Read** access.

## Usage

1. **Stage Changes**:
   - Make changes in your Git repository and stage them:
     ```bash
     git add .
     ```

2. **Generate Commit Message**:
   - Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P).
   - Run `Suggest Commit Message`.
   - A Quick Pick menu will appear with:
     - A suggested commit message.
     - Options to "Regenerate" or "Custom" (write your own).

3. **Approve or Edit**:
   - Select the suggestion and press Enter to commit.
   - Choose "Custom" to edit the message in an input box.
   - Select "Regenerate" to get a new suggestion.

4. **Commit**:
   - The extension executes `git commit -m "<message>"` and shows a success message.

## Configuration

Customize the extension via VS Code settings:

- **`gitCommitAI.apiToken`**:
  - Your Hugging Face API token.
  - Default: `""` (empty, must be set).
  - How to set: Open Settings (Ctrl+,), search for `gitCommitAI.apiToken`, and paste your token.

- **`gitCommitAI.commitStyle`**:
  - Style of generated commit messages.
  - Options: `conventional`, `casual`, `detailed`.
  - Default: `conventional`.
  - Examples:
    - `conventional`: `feat: add new feature`
    - `casual`: `Yo, added some cool stuff!`
    - `detailed`: `Updated the button text from "CV" to "Download CV" for clarity`

## Example

1. Stage a change:
   ```bash
   echo "Download CV" > page.tsx
   git add page.tsx
   ```
2. Run `Suggest Commit Message`.
3. See a suggestion like:
   - Casual: `Changed the CV button text, yo!`
4. Press Enter to commit.

## Troubleshooting

- **"No staged changes found"**:
  - Ensure you’ve staged changes with `git add`.
  - Verify you’re in a Git repository folder (run `git status`).

- **"AI API error: 401 Unauthorized"**:
  - Check your Hugging Face API token in settings.

- **"AI API error: 429 Too Many Requests"**:
  - You’ve hit the free tier rate limit. Wait or upgrade to a Hugging Face PRO account.

- **No suggestions**:
  - Confirm internet connectivity and token validity.
  - Check the Debug Console (F5 mode) for errors.

## Development

### Prerequisites
- Node.js and npm
- VS Code
- `yo` and `generator-code`:
  ```bash
  npm install -g yo generator-code
  ```

### Setup
1. Scaffold the extension:
   ```bash
   yo code
   ```
2. Install dependencies:
   ```bash
   npm install --save axios @types/node child-process-promise
   ```
3. Run in debug mode:
   - Open in VS Code, press F5.

### Build and Publish
1. Package:
   ```bash
   npm install -g vsce
   vsce package
   ```
2. Publish:
   - Get a Personal Access Token from [Visual Studio Marketplace](https://marketplace.visualstudio.com/).
   - Run:
     ```bash
     vsce publish --pat <your-token>
     ```

## Limitations

- Requires an internet connection for API calls.
- Free Hugging Face API has rate limits (~30 requests/hour).
- Single-root workspaces only (multi-root support not implemented).

## Contributing

Feel free to submit issues or pull requests on [GitHub](https://github.com/penealfa/git-commit-ai).

## Acknowledgments

- Built with [VS Code API](https://code.visualstudio.com/api).
- Powered by [Hugging Face Inference API](https://huggingface.co/docs/api-inference).
