# yii2-yee-user

##Yee CMS - User Module

####Backend module for managing users, roles, permissions, etc. 

This module is part of Yee CMS (based on Yii2 Framework).

Installation
------------

Either run

```
composer require --prefer-dist yeesoft/yii2-yee-user "~0.1.0"
```

or add

```
"yeesoft/yii2-yee-user": "~0.1.0"
```

to the require section of your `composer.json` file.

Run migrations:

```php
yii migrate --migrationPath=@vendor/yeesoft/yii2-yee-user/migrations/
```

Configuration
------
- In your backend config file

```php
'modules'=>[
    'user' => [
        'class' => 'yeesoft\user\UserModule',
    ],
],
```

Dashboard widget
-------  

You can use dashboard widget to display short information about users.

Add this code in your control panel dashboard to display widget:
```php
echo \yeesoft\user\widgets\dashboard\Users::widget();
```

Screenshots
-------  

[Flickr - Yee CMS User Module](https://www.flickr.com/photos/134050409@N07/sets/72157656671517306)
