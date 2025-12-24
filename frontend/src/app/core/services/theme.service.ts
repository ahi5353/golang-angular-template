import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import {
  argbFromHex,
  themeFromSourceColor,
  applyTheme,
  hexFromArgb
} from '@material/material-color-utilities';

interface ThemeSettings {
  primaryColor: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentPrimaryColor = new BehaviorSubject<string>('');

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  loadTheme(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve();
    }

    return firstValueFrom(this.http.get<ThemeSettings>('/api/settings'))
      .then(settings => {
        if (settings && settings.primaryColor) {
          this.applyTheme(settings.primaryColor);
        }
      })
      .catch(err => {
        console.error('Failed to load theme settings', err);
      });
  }

  saveTheme(color: string): Promise<any> {
    return firstValueFrom(this.http.put('/api/settings', { primaryColor: color }))
      .then(() => {
        if (this.currentPrimaryColor.value !== color) {
          this.applyTheme(color);
        }
      });
  }

  applyTheme(color: string) {
    this.currentPrimaryColor.next(color);

    try {
      const source = argbFromHex(color);
      const theme = themeFromSourceColor(source);

      this.injectThemeStyles(theme);

    } catch (e) {
      console.error('Error applying theme', e);
    }
  }

  private injectThemeStyles(theme: any) {
    let style = document.getElementById('dynamic-theme-styles');
    if (!style) {
      style = document.createElement('style');
      style.id = 'dynamic-theme-styles';
      document.head.appendChild(style);
    }

    const toCssVar = (name: string, argb: number) => {
        return `${name}: ${hexFromArgb(argb)};`;
    };

    // Simple helper to generate vars block
    const generateVars = (scheme: any) => {
      let css = '';
      for (const key of [
        'primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer',
        'secondary', 'onSecondary', 'secondaryContainer', 'onSecondaryContainer',
        'tertiary', 'onTertiary', 'tertiaryContainer', 'onTertiaryContainer',
        'error', 'onError', 'errorContainer', 'onErrorContainer',
        'background', 'onBackground', 'surface', 'onSurface',
        'surfaceVariant', 'onSurfaceVariant', 'outline', 'outlineVariant',
        'inverseSurface', 'inverseOnSurface', 'inversePrimary'
      ]) {
          // Convert camelCase to kebab-case
          const cssName = '--mat-sys-' + key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
          css += toCssVar(cssName, scheme[key]);
      }
      return css;
    };

    style.innerHTML = `
      body {
        ${generateVars(theme.schemes.light)}
      }
      @media (prefers-color-scheme: dark) {
        body {
          ${generateVars(theme.schemes.dark)}
        }
      }
    `;
  }
}
