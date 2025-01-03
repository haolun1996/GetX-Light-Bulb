import 'dart:math';

import 'package:flutter/foundation.dart';

import 'package:${snakeCaseName}/app/service/example/example_service.dart';
import 'package:baseX/base_x.dart';
import 'package:faker/faker.dart';

// How to use ?
// Get.put<ExamppleAuthService>(ExampleAuthServiceImpl(apiXService: defaultService));
class ExampleFakeServiceImpl implements ApiServiceMixin, ExampleService {
  @override
  late ApiXService defaultServ;

  @override
  String apiPath = 'category/';

  static final ExampleFakeServiceImpl service = ExampleFakeServiceImpl._();

  factory ExampleFakeServiceImpl({ApiXService? apiXService}) {
    if (apiXService == null) {
      service.defaultServ = defaultService;
    } else {
      service.defaultServ = apiXService;
    }

    return service;
  }

  ExampleFakeServiceImpl._() {
    if (kDebugMode) {
      print('ExampleFakeServiceImpl had created!');
    }
  }

  @override
  Future getUserList(OnFail onFail) async {
    List<ExampleUser> userList = [];

    for (int i = 0; i < 10; i++) {
      Faker faker = Faker.withGenerator(RandomGenerator());
      ExampleUser user = ExampleUser(
        faker.person.random.integer(100),
        faker.person.name(),
        faker.internet.email(),
        faker.person.random.integer(50),
        faker.address.city(),
      );
      userList.add(user);
    }
    return userList;
  }
}

class ExampleUser extends XData {
  final int id;
  final String name;
  final String email;
  final int age;
  final String address;

  ExampleUser(
    this.id,
    this.name,
    this.email,
    this.age,
    this.address,
  );

  factory ExampleUser.fromJson(Map<String, dynamic> json) {
    return ExampleUser(json['id'], json['name'], json['email'], json['age'], json['address']);
  }

  static List<ExampleUser> listFromJson(List json) {
    List<ExampleUser> list = [];
    for (var item in json) {
      if (item != null) {
        list.add(ExampleUser.fromJson(item));
      }
    }
    return list;
  }

  @override
  String toString() => 'ExampleUser(code: $id, name: $name)';

  @override
  JSON toJson() {
    // TODO: implement toJson
    throw UnimplementedError();
  }
}
