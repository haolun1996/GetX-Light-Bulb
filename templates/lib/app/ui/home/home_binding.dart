import 'package:get/get.dart';

import 'package:${snakeCaseName}/app/ui/home/home_controller.dart';

class HomeBindings extends Bindings {
  @override
  void dependencies() {
    Get.put(HomeController());
  }
}
