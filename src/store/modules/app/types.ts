export interface AppState {
  theme: string;
  navbar: boolean;
  menu: boolean;
  hideMenu: boolean;
  menuCollapse: boolean;
  themeColor: string;
  menuWidth: number;
  globalSettings: boolean;
  device: string;
  tabBar: boolean;
  [key: string]: unknown;
}
