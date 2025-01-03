import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'package:${snakeCaseName}/app/model/nav_item.dart';
import 'package:${snakeCaseName}/app/routes/app_routes.dart';
import 'package:${snakeCaseName}/app/ui/nav_bar_bottom/nav_controller.dart';
import 'package:baseX/base_x.dart';
import 'package:get/get.dart';

class NavBar extends BaseXWidget<NavBarController> {
  @override
  String get routeName => '/menu';

  @override
  Widget? appBar(BuildContext context) => null;

  Widget navBottomItem(bool selected, NavItem item) {
    return InkWell(
      onTap: () => controller.changeTabIndex(item.id),
      child: Stack(
        children: [
          Center(
            child: Column(
              children: [
                SizedBox(height: 10),
                // Image.asset('assets/${selected ? item.imageSelected : item.image}.png',
                //     width: 25, height: 25),
                Icon(
                  item.icon,
                  color: selected ? Colors.white : Colors.black,
                ),

                SizedBox(height: 5),
                Text(item.title,
                    style: TextStyle(fontSize: 14, color: selected ? Colors.blue : Colors.grey)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Obx(() {
        return Column(
          children: [
            Expanded(
              child: IndexedStack(
                index: controller.tabIndex.value,
                children: [...AppPages.navList.map((e) => e.child).toList()],
              ),
            ),
            DecoratedBox(
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                      color: Colors.black.withOpacity(0.25),
                      offset: const Offset(0, -1),
                      blurRadius: 22),
                ],
              ),
              child: SafeArea(
                top: false,
                minimum: EdgeInsets.only(bottom: 15),
                child: Row(
                  children: [
                    ...AppPages.navList
                        .map((nav) => Expanded(
                              child: navBottomItem(nav.id == controller.tabIndex.value, nav),
                            ))
                        .toList()
                  ],
                ),
              ),
            ),
          ],
        );
      }),
    );
  }

  @override
  Widget? body(BuildContext context) => null;
}
