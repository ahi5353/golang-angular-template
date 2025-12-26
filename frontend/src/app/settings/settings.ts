import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule
  ],
  templateUrl: './settings.html',
  styles: [`
    .settings-container {
      padding: 24px;
      max-width: 600px;
      margin: 0 auto;
    }
    .settings-section {
      background: var(--mat-sys-surface-container-low);
      padding: 24px;
      border-radius: 12px;
      margin-top: 16px;
    }
    .color-picker-wrapper {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }
    .native-color-picker {
      width: 48px;
      height: 48px;
      padding: 0;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
    }
  `]
})
export class SettingsComponent {
  themeColor: string = '';
  isLoading = false;

  constructor(
    private themeService: ThemeService,
    private snackBar: MatSnackBar
  ) {
    this.themeColor = this.themeService.themeColor;
  }

  async saveTheme() {
    this.isLoading = true;
    try {
      await this.themeService.setTheme(this.themeColor);
      this.snackBar.open('テーマ設定を保存しました', '閉じる', { duration: 3000 });
    } catch (e) {
      console.error(e);
      this.snackBar.open('保存に失敗しました', '閉じる', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }
}
