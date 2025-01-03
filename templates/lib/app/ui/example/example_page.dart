import 'package:baseX/base_x.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'package:${snakeCaseName}/app/ui/example/example_controller.dart';

class ExamplePage extends BaseXWidget<ExampleController> {
  @override
  String get routeName => '/example';

  @override
  Widget? appBar(BuildContext context) => null;

  @override
  Widget? body(BuildContext context) {
    return Column(
      children: [
        Obx(
          () => Expanded(
            child: c.userList.isEmpty
                ? Center(
                    child: Text(
                      'EMPTY LISTING',
                      style: TextStyle(color: Colors.black),
                    ),
                  )
                : ListView.separated(
                    itemBuilder: (BuildContext context, int index) {
                      return DecoratedBox(
                        decoration: BoxDecoration(border: Border.all(color: Colors.blueAccent)),
                        child: Column(
                          children: [
                            Text(c.userList[index].id.toString()),
                            SizedBox(height: 10),
                            Text(c.userList[index].name),
                            SizedBox(height: 10),
                            Text(c.userList[index].address),
                            SizedBox(height: 10),
                            Text(c.userList[index].age.toString()),
                            SizedBox(height: 10),
                            Text(c.userList[index].email),
                            SizedBox(height: 10),
                          ],
                        ),
                      );
                    },
                    separatorBuilder: (_, __) => Divider(),
                    itemCount: c.userList.length,
                  ),
          ),
        ),
        TextButton(
            child: Text('Home Page'),
            onPressed: () {
              c.fetchData();
            })
      ],
    );
  }
}
