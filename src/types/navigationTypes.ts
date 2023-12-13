export type Navigation = {
  navigate: Function;
  goBack: () => void;
};

export type CommonNavigationProps = {
  navigation: Navigation;
  route: any;
};
