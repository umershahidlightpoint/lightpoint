import { Theme } from '../models/theme.model';

export const blue: Theme = {
  name: 'blue',
  properties: {
    '--primary': '#0275d8',
    '--on-primary': '#ffffff',
    '--primary-light': '#519ddf',
    '--on-primary-light': '#ffffff',
    '--secondary': '#f4f5f7',
    '--on-secondary': '#000000',
    '--tertiary': '#6c757d',
    '--on-tertiary': '#ffffff'
  }
};

export const purple: Theme = {
  name: 'purple',
  properties: {
    '--primary': '#563d7c',
    '--on-primary': '#ffffff',
    '--primary-light': '#a17adc',
    '--on-primary-light': '#ffffff',
    '--secondary': '#f4f5f7',
    '--on-secondary': '#000000',
    '--tertiary': '#6c757d',
    '--on-tertiary': '#ffffff'
  }
};
