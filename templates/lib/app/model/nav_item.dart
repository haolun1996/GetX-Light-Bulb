import 'package:flutter/material.dart';

class NavItem {
  final int id;
  final String title;
  final Widget child;
  IconData? icon;
  String? image;
  String? imageSelected;

  NavItem(
    this.id,
    this.title,
    this.icon,
    this.image,
    this.imageSelected,
    this.child,
  );

  NavItem.icon(
    this.id,
    this.title,
    this.icon,
    this.child,
  );

  NavItem.imgIcon(
    this.id,
    this.title,
    this.image,
    this.child,
  );
}
