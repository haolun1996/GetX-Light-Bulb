import 'package:baseX/base_x.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'package:${snakeCaseName}/app/ui/loading/loading_controller.dart';

class LoadingPage extends BaseXWidget<LoadingController> {
  @override
  String get routeName => '/loading';

  @override
  Widget? appBar(BuildContext context) => null;

  @override
  Widget? body(BuildContext context) {
    return Center(
      child: Text(
        'Loading Page',
      ),
    );
  }
}
