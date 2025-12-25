import { Injectable, Inject, DOCUMENT } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  argbFromHex,
  themeFromSourceColor,
  applyTheme,
  hexFromArgb
} from '@material/material-color-utilities';

interface SettingsResponse {
  theme_color: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _themeColor = '#3f51b5'; // Default color

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {}

  get themeColor(): string {
    return this._themeColor;
  }

  async loadTheme(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.get<SettingsResponse>('/api/settings').pipe(
          catchError(() => of({ theme_color: this._themeColor }))
        )
      );
      this.setThemeLocal(response.theme_color);
    } catch (e) {
      console.error('Failed to load theme', e);
      this.setThemeLocal(this._themeColor);
    }
  }

  async setTheme(hex: string): Promise<void> {
    await firstValueFrom(this.http.put('/api/settings', { theme_color: hex }));
    this.setThemeLocal(hex);
  }

  private setThemeLocal(hex: string) {
    this._themeColor = hex;
    const theme = themeFromSourceColor(argbFromHex(hex));

    // Generate CSS variables for both light and dark schemes
    // We map M3 tokens to Angular Material M3 system variables
    const lightScheme = theme.schemes.light;
    const darkScheme = theme.schemes.dark;

    // We need to construct a CSS string that overrides the variables.
    // Angular Material M3 variables generally follow the pattern --mat-sys-{token}
    // See: https://material.angular.io/guide/theming#using-system-variables

    const generateCss = (scheme: any, prefix: string = '') => {
        let css = '';
        const props = [
            'primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer',
            'secondary', 'onSecondary', 'secondaryContainer', 'onSecondaryContainer',
            'tertiary', 'onTertiary', 'tertiaryContainer', 'onTertiaryContainer',
            'error', 'onError', 'errorContainer', 'onErrorContainer',
            'background', 'onBackground',
            'surface', 'onSurface', 'surfaceVariant', 'onSurfaceVariant',
            'outline', 'outlineVariant',
            'shadow', 'scrim', 'inverseSurface', 'inverseOnSurface', 'inversePrimary',
            'surfaceDim', 'surfaceBright', 'surfaceContainerLowest', 'surfaceContainerLow',
            'surfaceContainer', 'surfaceContainerHigh', 'surfaceContainerHighest'
        ];

        props.forEach(prop => {
            // Convert camelCase to kebab-case
            const kebab = prop.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
            const value = hexFromArgb(scheme[prop]);
            css += `  --mat-sys-${kebab}: ${value};\n`;
        });
        return css;
    };

    const lightCss = generateCss(lightScheme);
    const darkCss = generateCss(darkScheme);

    const styleContent = `
      :root, body {
        ${lightCss}
      }
      @media (prefers-color-scheme: dark) {
        :root, body {
          ${darkCss}
        }
      }
    `;

    // Remove existing theme style tag if it exists
    const styleId = 'custom-theme-styles';
    let styleTag = this.document.getElementById(styleId) as HTMLStyleElement;
    if (!styleTag) {
      styleTag = this.document.createElement('style');
      styleTag.id = styleId;
      this.document.head.appendChild(styleTag);
    }
    styleTag.textContent = styleContent;
  }
}
