import { Component, forwardRef, OnInit, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { Theme } from '../../models/theme.model';

@Component({
  selector: 'lp-select-theme',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectThemeComponent),
      multi: true
    }
  ],
  templateUrl: './select-theme.component.html',
  styleUrls: ['./select-theme.component.scss']
})
export class SelectThemeComponent implements OnInit, ControlValueAccessor {
  public themes: Theme[];

  @Input() name: string;
  @Input() theme: Theme;
  @Input() activeTheme: string;

  onChange: any = () => {};
  onTouched: any = () => {};

  get value(): Theme {
    return this.theme;
  }

  set value(theme: Theme) {
    this.theme = theme;
    this.onChange(theme);
    this.onTouched();
  }

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    const availableThemes: Theme[] = this.themeService.getAvailableThemes();
    this.themes = availableThemes;
    if (this.activeTheme) {
      this.value = availableThemes.find(element => element.name === this.activeTheme);
    }
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  writeValue(theme) {
    if (theme) {
      this.value = theme;
    }
  }

  onThemeChange() {
    this.themeService.setActiveTheme(this.theme);
  }
}
