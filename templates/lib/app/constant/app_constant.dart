import 'package:flutter/material.dart';

import 'package:baseX/base_x.dart';

class AppConstant extends DefaultBaseConstant {
  @override
  Widget get defaultLoadingWidget => const Center(
          child: CircularProgressIndicator(
        color: Colors.blue,
      ));

  @override
  Position get position => Position.top;
}
