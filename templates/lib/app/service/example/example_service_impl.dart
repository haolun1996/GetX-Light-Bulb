import 'dart:async';

import 'package:flutter/foundation.dart';

import 'package:${snakeCaseName}/app/service/example/example_fake_service_impl.dart';
import 'package:${snakeCaseName}/app/service/example/example_service.dart';
import 'package:baseX/base_x.dart';

// How to use ?
// Get.put<ExamppleAuthService>(ExampleAuthServiceImpl(apiXService: defaultService));
class ExampleServiceImpl implements ApiServiceMixin, ExampleService {
  @override
  late ApiXService defaultServ;

  @override
  String apiPath = 'category/';

  static final ExampleServiceImpl service = ExampleServiceImpl._();

  factory ExampleServiceImpl({ApiXService? apiXService}) {
    if (apiXService == null) {
      service.defaultServ = defaultService;
    } else {
      service.defaultServ = apiXService;
    }

    return service;
  }

  ExampleServiceImpl._() {
    if (kDebugMode) {
      print('ExampleServiceImpl had created!');
    }
  }

  @override
  Future getUserList(OnFail onFail) async {
    // call api with get endpoint user
    return <ExampleUser>[];
  }
}

class ExampleCountry extends XData {
  String code;
  String name;

  ExampleCountry(this.code, this.name);

  factory ExampleCountry.fromJson(Map<String, dynamic> json) {
    return ExampleCountry(json['code'], json['name']);
  }

  static List<ExampleCountry> listFromJson(List json) {
    List<ExampleCountry> list = [];
    for (var item in json) {
      if (item != null) {
        list.add(ExampleCountry.fromJson(item));
      }
    }
    return list;
  }

  @override
  String toString() => 'Country(code: $code, name: $name)';

  @override
  JSON toJson() {
    // TODO: implement toJson
    throw UnimplementedError();
  }
}
