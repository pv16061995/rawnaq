# yii2-yee-settings

##Yee CMS - Settings Module

####Module for managing settings 

This module is part of Yee CMS (based on Yii2 Framework).

Settings module lets you easily create settings pages. After module installation general settings page will be created. This page contains such options as `site title`, `time format` and `date format`, `timezone`, etc.

Also you can use setting component. It allows you to get and set settings from application.

Installation
------------

Either run

```
composer require --prefer-dist yeesoft/yii2-yee-settings "~0.1.0"
```

or add

```
"yeesoft/yii2-yee-settings": "~0.1.0"
```

to the require section of your `composer.json` file.

Run migrations:

```php
yii migrate --migrationPath=@vendor/yeesoft/yii2-yee-settings/migrations/
```

Configuration
------
- In your backend config file

```php
'modules'=>[
	'settings' => [
		'class' => 'yeesoft\settings\SettingsModule',
	],
],
```

- Component settings in common config file

```php
'components'=>[
	'settings' => [
		'class' => 'yeesoft\components\Settings'
	],
],
```

Usage
---

######Get setting:

You can use array or string with dot notation to separate the group from the key when you try to get some setting.

```php
$setting = Yii::$app->settings->get('general.title');
```

is equivalent to

```php
$setting = Yii::$app->settings->get('general.title');
```

######Set setting:

Here you can use the same parameters as in the previous case.

```php
Yii::$app->settings->set('general.title','My Site');
```

Setting Component Options
-------

Use this options to configurate setting component:
 
- `cache` - the cache object or the application component ID of the cache object. Settings will be cached through this cache object, if it is available.

- `cacheKey` - key used by the cache component.

Creating own settings page
-------

- Insert into `settings` table your new settings:
```sql
INSERT INTO `setting`(`group`,`key`,`value`,`description`) 
VALUES ('image','width','120','Default images width'),
       ('image','height','90','Default images height');
```

- Create settings model for settings group by extending **yeesoft\settings\models\BaseSettingsModel** class. This model should contain `GROUP` const with settings group name. Also model should contain list of properties with names that match settings name. In model you can specify rules for fields.
```php
namespace backend\models;

class ImageSettings extends \yeesoft\settings\models\BaseSettingsModel
{
    const GROUP = 'image';

    public $width;
    public $height;

    public function rules()
    {
        return [
            [['width', 'height'], 'required'],
            [['width', 'height'], 'integer'],
        ];
    }
}
```

- Create view file `backend/views/image-settings/index.php` to display your model form.
```php
use backend\models\ImageSettings;
use yeesoft\settings\assets\SettingsAsset;
use yii\helpers\Html;
use yeesoft\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model backend\models\ImageSetting */
/* @var $form yeesoft\widgets\ActiveForm */

SettingsAsset::register($this);
?>
<div class="setting-index">
    <h3 class="lte-hide-title page-title">Image Settings</h3>

    <div class="setting-form">
        <?php
        $form = ActiveForm::begin([
            'id' => 'setting-form',
            'validateOnBlur' => false,
            'fieldConfig' => [
                'template' => "<div class=\"settings-group\"><div class=\"settings-label\">{label}</div>\n<div class=\"settings-field\">{input}\n{hint}\n{error}</div></div>"
            ],
        ])
        ?>

        <?= $form->field($model, 'width')->textInput(['maxlength' => true])->hint($model->getDescription('width')) ?>
        <?= $form->field($model, 'height')->textInput(['maxlength' => true])->hint($model->getDescription('height')) ?>
        <?= Html::submitButton('Save', ['class' => 'btn btn-primary']) ?>

        <?php ActiveForm::end(); ?>
    </div>
</div>
```

- Create settings controller by extending **yeesoft\settings\controllers\SettingsBaseController** class.
Controller should contain `$modelClass` and `$viewPath` properties which contain recently created model and view 

```php
namespace backend\controllers;

class ImageSettingsController extends \yeesoft\settings\controllers\SettingsBaseController
{
    public $modelClass = '\backend\models\ImageSettings';
    public $viewPath   = '@backend/views/image-settings/index';
}
```

- Open your settings page: `yoursite.com/admin/image-settings`
  
Screenshots
-------  

[Flickr - Yee CMS Settings Module](https://www.flickr.com/photos/134050409@N07/sets/72157656663599746)
