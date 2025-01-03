part of 'app_routes.dart';

class AppPages {
  AppPages._();

  static final routes = [
    // Initial pages
    // cGetPageInitial(LoadingPage(), binding: LoadingBinding()),

    //Common pages
    // cGetPageInitial(ExamplePage(), binding: ExampleBindings()),

    //Menu
    cGetPageInitial(NavBar(), binding: NavBarBinding()),
  ];

  static final List<NavItem> navList = [
    NavItem.icon(
      0,
      'Home',
      Icons.home,
      HomePage(),
    ),
  ];
}
