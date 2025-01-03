import 'package:baseX/base_x.dart';
import 'package:get/get.dart';

import 'package:${snakeCaseName}/app/service/example/example_fake_service_impl.dart';
import 'package:${snakeCaseName}/app/service/example/example_service.dart';

class ExampleController extends BaseXController {
  ExampleService _exampleService = Get.find();
  RxList<ExampleUser> userList = <ExampleUser>[].obs;

  @override
  void onInit() {
    super.onInit();
    fetchData();
  }

  void fetchData() async {
    List<ExampleUser> responseList =
        await _exampleService.getUserList((code, message, result) => false);

    if (responseList.isNotEmpty) {
      userList.value = responseList;
    }
  }
}
