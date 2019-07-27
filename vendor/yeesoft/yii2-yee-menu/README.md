# yii2-yee-menu

Yii2 Framework - Yee CMS - Menu Module
=====

Module for managing menus 
------------

This module is part of Yee CMS. This module allows you to create and manage menus on Yee Control Panel. 
Also, this module includes a widget to render menus on frontend.


Installation
------------

- Either run

```
composer require --prefer-dist yeesoft/yii2-yee-menu "~0.1.0"
```

or add

```
"yeesoft/yii2-yee-menu": "~0.1.0"
```

to the require section of your `composer.json` file.

- Run migrations:

```php
yii migrate --migrationPath=@vendor/yeesoft/yii2-yee-menu/migrations/
```

Configuration
------

- In your backend config file

```php
'modules'=>[
    'menu' => [
        'class' => 'yeesoft\menu\MenuModule',
    ],
],
```

Usage on frontend
---

- Widget namespace:
```php
use yeesoft\menu\widgets\Menu;
```

- Render menu by ID:

```php
echo Menu::widget(['id' => 'main-menu']); 
```

Menu Widget Options
-------

Use this options to configurate menu widget:
 
- `id` - Menu model id to render navigation.

- `wrapper` - Menu wrapper - two dimensional array. First element will be placed before menu, second element will be placed after menu

- `options` - Menu and submenus options.

  If `options` is one dimensional array then this options will be applied to all sub-menus. Example:
    ```php
    'options' => ['class' => 'nav nav-menu']
    ```
    
  If `options` is two dimensional array then this options will be applied according to nested submenu level. If there is no options for current level, default settings will be applied. Example:
    ```php
    'options' => [
      [ 'class' => 'nav nav-first-level'],
      [ 'class' => 'nav nav-second-level']
    ]
    ```

- `encodeLabels` - Whether the nav items labels should be HTML-encoded.

- `dropDownCaret` - This property allows you to customize the HTML which is used to generate the drop down caret symbol, which is displayed next to the button text to indicate the drop down functionality.

  Example of widget settings:
  ```php
  echo Menu::widget([
    'id' => 'main-menu',
    'dropDownCaret' => '<span class="arrow"></span>',
    'wrapper' => [
      '<div class="navbar-default sidebar" role="navigation">',
      '</div>'
    ],
    'options' => [
      [ 'class' => 'nav nav-first-level'],
      [ 'class' => 'nav nav-second-level'],
      [ 'class' => 'nav nav-third-level']
    ],
  ])
  ```
  
Screenshots
-------  

[Flickr - Yee CMS Menus Module](https://www.flickr.com/photos/134050409@N07/sets/72157655803713779)
