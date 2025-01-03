import 'package:baseX/base_x.dart';
import 'package:flutter/material.dart';

import 'package:${snakeCaseName}/app/ui/home/home_controller.dart';

class HomePage extends BaseXWidget<HomeController> {
  @override
  String get routeName => '/main';

  @override
  Widget? appBar(BuildContext context) => null;

  @override
  Widget? body(BuildContext context) {
    return Container(
      width: double.infinity,
      height: double.infinity,
      color: Colors.red,
      child: Center(
        child: TextButton(
            child: Text('Home Page'),
            onPressed: () {
              // TODO onpress
            }),
      ),
    );
  }
}
