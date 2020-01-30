import { Injectable, Inject } from '@angular/core';
import { LPToolkitConfigService } from './lp-toolkit-config.service';
import { LPToolkitConfig } from '../models/lp-toolkit-config.model';
import { blue, purple } from '../assets/theme';
import { Theme } from '../models/theme.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private active: Theme = blue;
  private availableThemes: Theme[] = [blue, purple];

  constructor(@Inject(LPToolkitConfigService) private config: LPToolkitConfig) {
    this.availableThemes = this.availableThemes.concat(config.themes);
  }

  getAvailableThemes(): Theme[] {
    return this.availableThemes;
  }

  getActiveTheme(): Theme {
    return this.active;
  }

  setActiveTheme(theme: Theme): void {
    this.active = theme;

    Object.keys(this.active.properties).forEach(property => {
      document.documentElement.style.setProperty(property, this.active.properties[property]);
    });
  }
}
