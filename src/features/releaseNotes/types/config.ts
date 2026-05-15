export interface PageConfig {
  features: {
    fullscreen: boolean;
    sidePanels: boolean;
    commandPalette: boolean;
    persistence: boolean;
    duplicateRelease: boolean;
    deleteRelease: boolean;
    sharing: boolean;
  };
  ui: {
    compactDensity: boolean;
    showDocs: boolean;
    showConfig: boolean;
    primaryColor?: string;
  };
  grid: {
    enableSorting: boolean;
    enableFiltering: boolean;
    enableColumnResizing: boolean;
    rowHeight: number;
    headerHeight: number;
  };
}

export const defaultConfig: PageConfig = {
  features: {
    fullscreen: true,
    sidePanels: true,
    commandPalette: true,
    persistence: true,
    duplicateRelease: true,
    deleteRelease: true,
    sharing: true,
  },
  ui: {
    compactDensity: true,
    showDocs: true,
    showConfig: false,
  },
  grid: {
    enableSorting: true,
    enableFiltering: true,
    enableColumnResizing: true,
    rowHeight: 40,
    headerHeight: 48,
  }
};

export const basicConfig: PageConfig = {
  ...defaultConfig,
  features: {
    ...defaultConfig.features,
    sidePanels: false,
    commandPalette: false,
    sharing: false,
  },
  ui: {
    ...defaultConfig.ui,
    showDocs: false,
    showConfig: true,
  }
};

export const enterpriseDemoConfig: PageConfig = {
  ...defaultConfig,
  ui: {
    ...defaultConfig.ui,
    showConfig: true,
  }
};
