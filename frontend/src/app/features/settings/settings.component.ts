import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ThemeService } from '../../core/services/theme.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  primaryColor: string = '#ffffff';
  isLoading = false;

  constructor(
    private themeService: ThemeService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.http.get<{ primaryColor: string }>('/api/settings')
      .subscribe({
        next: (settings) => {
          if (settings.primaryColor) {
            this.primaryColor = settings.primaryColor;
            this.themeService.applyTheme(this.primaryColor);
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load settings', err);
          this.isLoading = false;
        }
      });
  }

  onColorChange(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    this.primaryColor = color;
    this.themeService.applyTheme(color);
  }

  onHexChange(color: string) {
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      this.themeService.applyTheme(color);
    }
  }

  async saveSettings() {
    this.isLoading = true;
    try {
      await this.themeService.saveTheme(this.primaryColor);
      this.snackBar.open('設定を保存しました', '閉じる', { duration: 3000 });
    } catch (err) {
      console.error('Failed to save settings', err);
      this.snackBar.open('保存に失敗しました', '閉じる', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }
}
