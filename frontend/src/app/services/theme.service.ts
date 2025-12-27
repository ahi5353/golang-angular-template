import { Injectable, Inject, DOCUMENT } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  argbFromHex,
  hexFromArgb,
  Hct,
  SchemeTonalSpot,
  MaterialDynamicColors,
} from '@material/material-color-utilities';

interface SettingsResponse {
  theme_color: string;
}

const APP_FONT_FAMILY = 'Roboto, "Noto Sans JP", "Yu Gothic UI", "Yu Gothic", Meiryo, sans-serif';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _themeColor = '#3f51b5';

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

    // --- ここが肝：seed color -> DynamicScheme (light/dark) ---
    const seed = argbFromHex(hex);
    const seedHct = Hct.fromInt(seed);

    const lightScheme = new SchemeTonalSpot(seedHct, /*isDark*/ false, /*contrast*/ 0.0);
    const darkScheme  = new SchemeTonalSpot(seedHct, /*isDark*/ true,  /*contrast*/ 0.0);
    // ↑ SchemeTonalSpot + MaterialDynamicColors を使う流れは MCU の推奨寄りの使い方 [5](https://www.npmjs.com/package/@material/material-color-utilities)

    const varsLight = this.buildMatSysVars(lightScheme);
    const varsDark  = this.buildMatSysVars(darkScheme);
    const varsTypography = this.buildTypographyVars();

    const styleContent = `
:root, body {
${varsLight}
${varsTypography}
}
@media (prefers-color-scheme: dark) {
  :root, body {
${varsDark}
  }
}
`;

    const styleId = 'custom-theme-styles';
    let styleTag = this.document.getElementById(styleId) as HTMLStyleElement;
    if (!styleTag) {
      styleTag = this.document.createElement('style');
      styleTag.id = styleId;
      this.document.head.appendChild(styleTag);
    }
    styleTag.textContent = styleContent;
  }

  /**
   * Angular Material の system variables（--mat-sys-*）へ流すCSS文字列を生成
   *
   * V21の system variables には surface-dim/bright や surface-container-* が含まれる [3](https://stackoverflow.com/questions/78539225/whats-use-system-variables-in-angular-material)[4](https://github.com/angular/components/issues/29104)
   */
  private buildMatSysVars(dynamicScheme: any): string {
    // system variables の候補（色系）一覧には surface container/dim/bright も含まれる [4](https://github.com/angular/components/issues/29104)
    const roles: string[] = [
      // Neutrals / surfaces
      'background', 'onBackground',
      'surface', 'onSurface',
      'surfaceDim', 'surfaceBright',
      'surfaceContainerLowest', 'surfaceContainerLow', 'surfaceContainer',
      'surfaceContainerHigh', 'surfaceContainerHighest',
      'surfaceVariant', 'onSurfaceVariant',
      'inverseSurface', 'inverseOnSurface',

      // Outline / shadow
      'outline', 'outlineVariant',
      'shadow', 'scrim',

      // Primary / secondary / tertiary
      'primary', 'onPrimary',
      'primaryContainer', 'onPrimaryContainer',
      'inversePrimary',

      'secondary', 'onSecondary',
      'secondaryContainer', 'onSecondaryContainer',

      'tertiary', 'onTertiary',
      'tertiaryContainer', 'onTertiaryContainer',

      // Error
      'error', 'onError',
      'errorContainer', 'onErrorContainer',

      // Fixed colors（Angular Materialでは “components では未使用” と書かれているが、定義自体はある [3](https://stackoverflow.com/questions/78539225/whats-use-system-variables-in-angular-material)[4](https://github.com/angular/components/issues/29104)）
      'primaryFixed', 'primaryFixedDim', 'onPrimaryFixed', 'onPrimaryFixedVariant',
      'secondaryFixed', 'secondaryFixedDim', 'onSecondaryFixed', 'onSecondaryFixedVariant',
      'tertiaryFixed', 'tertiaryFixedDim', 'onTertiaryFixed', 'onTertiaryFixedVariant',
    ];

    let css = '';

    for (const role of roles) {
      // MaterialDynamicColors にその role が無い場合もあるので安全にスキップ
      const dyn = (MaterialDynamicColors as any)[role];
      if (!dyn || typeof dyn.getArgb !== 'function') continue;

      const argb = dyn.getArgb(dynamicScheme);
      const value = hexFromArgb(argb);

      // camelCase -> kebab-case (primaryContainer -> primary-container)
      const kebab = role.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
      css += `  --mat-sys-${kebab}: ${value};\n`;
    }

    return css;
  }

  private buildTypographyVars(): string {
    return `
  --mat-sys-brand-family-name: ${APP_FONT_FAMILY};
  --mat-sys-plain-family-name: ${APP_FONT_FAMILY};
`;
  }
}
