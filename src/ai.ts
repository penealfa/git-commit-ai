import axios from 'axios';
import * as vscode from 'vscode';
import { Settings } from './settings';

export class AIService {
  private static readonly ENDPOINT = 'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1';
  private static cache: Map<string, string[]> = new Map();

  static async generateCommitMessage(diff: string, style: 'conventional' | 'casual' | 'detailed'): Promise<string[]> {
    const cacheKey = `${diff}-${style}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const token = Settings.getApiToken();
    if (!token) {
      throw new Error('Please set your Hugging Face API token in settings');
    }

    const prompt = this.buildPrompt(diff, style);
    try {
      console.log('Sending prompt to API:', prompt);
      const response = await axios.post(
        this.ENDPOINT,
        {
          inputs: prompt,
          parameters: { max_new_tokens: 100, temperature: 0.7 } // Increased to allow full message
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const generatedText = response.data[0]?.generated_text;
      console.log('Full generated text:', generatedText);
      if (!generatedText) {
        throw new Error('No generated text in API response');
      }

      // Extract the message after the diff
      const messageStart = generatedText.indexOf(diff) + diff.length;
      let message = generatedText.substring(messageStart).trim();

      // Look for [message] format
      const match = message.match(/\[(.*?)\]/);
      if (match && match[1]) {
        message = match[1].trim();
      } else {
        // Fallback: Take first line, strip any unwanted prefixes
        const lines = message.split('\n').map((line: string) => line.trim()).filter((line: any) => line);
        message = lines[0].replace(/^(Commit message:|Example output:|\[.*?:)/i, '').trim();
      }

      // Fallback if no valid message
      if (!message || message === generatedText || message === '[message]') {
        message = style === 'conventional' ? 'feat: tweak button text' : 
                  style === 'casual' ? 'Changed the CV button text, yo!' : 
                  'Updated the button text from "CV" to "Download CV" for clarity';
      }

      console.log('Processed message:', message);
      const finalMessages = [message];
      this.cache.set(cacheKey, finalMessages);
      return finalMessages;
    } catch (error : any) {
      vscode.window.showErrorMessage('AI API error: ' + (error.response?.status || error.message));
      console.error('API error details:', error.response?.data || error);
      throw error;
    }
  }

  private static buildPrompt(diff: string, style: 'conventional' | 'casual' | 'detailed'): string {
    const styleInstructions: { [key in 'conventional' | 'casual' | 'detailed']: string } = {
      conventional: 'Follow Conventional Commits (e.g., feat: add feature, fix: resolve bug)',
      casual: 'Use a casual, conversational tone',
      detailed: 'Provide a detailed description of changes'
    };

    return `Given this code diff, generate a single Git commit message in the specified style. Output the message in this exact format: [message]. Include no other text, prefixes, or explanations.
Style: ${styleInstructions[style]}
Diff:
${diff}`;
  }
}