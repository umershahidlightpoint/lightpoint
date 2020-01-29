import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Theme } from '../../assets/theme';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'lp-select-theme',
  templateUrl: './select-theme.component.html',
  styleUrls: ['./select-theme.component.scss']
})
export class SelectThemeComponent implements OnInit {
  @Input() activeTheme = 'blue';
  @Output() themeChange = new EventEmitter<string>();

  public theme: Theme;
  public themes: Theme[];

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    const availableThemes: Theme[] = this.themeService.getAvailableThemes();

    this.theme = availableThemes.find(element => element.name === this.activeTheme);
    this.themes = availableThemes;
  }

  onThemeChange() {
    this.themeService.setActiveTheme(this.theme);
    this.themeChange.emit(this.theme.name);
  }
}
