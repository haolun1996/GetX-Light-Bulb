import 'dart:ui';

import 'package:baseX/base_x.dart';
import 'package:shared_preferences/shared_preferences.dart';

AppSharedPref? S;

class AppSharedPref extends BaseXSharePref {
  late SharedPreferences _prefs;

  AppSharedPref(SharedPreferences prefs) : _prefs = prefs;

  static const String _fcmTokenKey = 'FCMtoken';

  set fcmToken(String? value) {
    if (value == null) {
      _prefs.remove(_fcmTokenKey);
    } else {
      saveKeyWithValue(_fcmTokenKey, value);
    }
  }

  String? get fcmToken => _prefs.getString(_fcmTokenKey);

  @override
  set accessToken(String? value) {
    if (value == null) {
      _prefs.remove(BaseXSharePref.tokenKey);
    } else {
      saveKeyWithValue(BaseXSharePref.tokenKey, value);
    }
  }

  @override
  String get accessToken => _prefs.getString(BaseXSharePref.tokenKey) ?? '';

  @override
  set languageCode(Locale? value) {
    if (value == null) {
      _prefs.remove(BaseXSharePref.languageCodeKey);
    } else {
      saveKeyWithValue(BaseXSharePref.languageCodeKey, value);
    }
  }

  @override
  Locale get languageCode => Locale(_prefs.getString(BaseXSharePref.languageCodeKey) ?? 'en');

  @override
  void saveKeyWithValue(String key, value) {
    XLogger.info('key: $key | value: $value');
    if (value is String) {
      _prefs.setString(key, value);
    } else if (value is bool) {
      _prefs.setBool(key, value);
    } else if (value is int) {
      _prefs.setInt(key, value);
    } else if (value is double) {
      _prefs.setDouble(key, value);
    } else if (value is List<String>) {
      _prefs.setStringList(key, value);
    }
  }
}
