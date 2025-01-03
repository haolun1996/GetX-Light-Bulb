import 'dart:ui';

import 'package:baseX/base_x.dart';

// Get.put<XLangController>(LanguageController()); needed to put on binding so that api can work
// XLangController langc = Get.find(); XLangController is used just can overwrite those method
class LanguageController<T extends XLabel, K extends XLanguage>
    extends XLangController<XLabel, XLanguage> {
  @override
  void onInit() {
    super.onInit();
    init();
  }

  void init() async {
    super.initData(create: (JSONLIST data) => XLabel.listFromJson(data));
  }

  @override
  List<XLanguage> get languageList => [
        XLanguage('English', Locale('en')),
        XLanguage('简体中文', Locale('zh')),
        XLanguage('Bahasa Malaysia', Locale('ms')),
      ];
}
