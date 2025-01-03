import 'package:flutter/material.dart';

import 'package:baseX/base_x.dart';
import 'package:get/get.dart';

class LoadingController extends BaseXController {
  TextEditingController form = TextEditingController();
  RxString prefValue = ''.obs;
  bool isloader = false;

  @override
  void onInit() {
    super.onInit();
  }
}
