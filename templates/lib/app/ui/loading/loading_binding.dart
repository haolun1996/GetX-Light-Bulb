import 'package:get/get.dart';

import 'package:${snakeCaseName}/app/ui/loading/loading_controller.dart';

class LoadingBinding extends Bindings {
  @override
  void dependencies() {
    Get.put(LoadingController());
  }
}
