import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sample',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './sample.html',
  styleUrl: './sample.css'
})
export class SampleComponent {
  colorRoles = [
    'primary', 'on-primary', 'primary-container', 'on-primary-container', 'inverse-primary',
    'secondary', 'on-secondary', 'secondary-container', 'on-secondary-container',
    'tertiary', 'on-tertiary', 'tertiary-container', 'on-tertiary-container',
    'error', 'on-error', 'error-container', 'on-error-container',
    'background', 'on-background',
    'surface', 'on-surface', 'surface-variant', 'on-surface-variant', 'inverse-surface', 'inverse-on-surface',
    'outline', 'outline-variant',
    'scrim', 'shadow',
    'surface-container-lowest', 'surface-container-low', 'surface-container', 'surface-container-high', 'surface-container-highest',
    'surface-dim', 'surface-bright'
  ];

  constructor(private snackBar: MatSnackBar) {}

  copyToClipboard(role: string) {
    const variableName = `var(--mat-sys-${role})`;
    navigator.clipboard.writeText(variableName).then(() => {
      this.snackBar.open(`${variableName} copied to clipboard!`, 'Close', {
        duration: 2000,
      });
    });
  }
}
