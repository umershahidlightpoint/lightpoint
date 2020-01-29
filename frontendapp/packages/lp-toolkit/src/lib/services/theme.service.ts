import { Injectable } from '@angular/core';
import { Theme, blue, purple } from '../assets/theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private active: Theme = blue;
  private availableThemes: Theme[] = [blue, purple];

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
