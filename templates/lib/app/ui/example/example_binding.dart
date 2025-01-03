import 'package:baseX/base_x.dart';
import 'package:get/get.dart';

import 'package:${snakeCaseName}/app/service/example/example_fake_service_impl.dart';
import 'package:${snakeCaseName}/app/service/example/example_service.dart';
import 'package:${snakeCaseName}/app/service/example/example_service_impl.dart';
import 'package:${snakeCaseName}/app/ui/example/example_controller.dart';

class ExampleBindings extends Bindings {
  @override
  void dependencies() {
    Get.put<ExampleService>(ExampleServiceImpl(apiXService: defaultService));
    Get.put(ExampleController());
  }
}
