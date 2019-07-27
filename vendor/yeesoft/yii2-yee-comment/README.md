# yii2-yee-comment

##Yee CMS - Comments Module

####Backend module for managing comments 

This module is part of Yee CMS (based on Yii2 Framework).

Comments module allows you manage comments from control panel. 

Installation
------------

- Either run

```
composer require --prefer-dist yeesoft/yii2-yee-comment "~0.1.0"
```

or add

```
"yeesoft/yii2-yee-comment": "~0.1.0"
```

to the require section of your `composer.json` file.

- Run migrations

```php
yii migrate --migrationPath=@vendor/yeesoft/yii2-yee-comment/migrations/
```

Configuration
------
- Install and configurate [Frontend Comments Module](https://github.com/yeesoft/yii2-comments)

- In your backend config file

```php
'modules'=>[
    'comment' => [
        'class' => 'yeesoft\comment\CommentModule',
    ],
],
```

Dashboard widget
-------  

You can use dashboard widget to display short information about recently published comments.

Add this code in your control panel dashboard to display widget:
```php
echo \yeesoft\comment\widgets\dashboard\Comments::widget();
```

Screenshots
-------  

[Flickr - Yee CMS Backend Comments Module](https://www.flickr.com/photos/134050409@N07/sets/72157654412179193)
