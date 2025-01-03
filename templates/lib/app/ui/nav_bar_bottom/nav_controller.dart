import 'package:baseX/base_x.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'package:${snakeCaseName}/app/model/nav_item.dart';

class NavBarController extends BaseXController {
  RxInt tabIndex = 0.obs;

  void changeTabIndex(int index) {
    tabIndex.value = index;
  }

  @override
  Future<bool> onBack() async {
    return true;
  }
}
