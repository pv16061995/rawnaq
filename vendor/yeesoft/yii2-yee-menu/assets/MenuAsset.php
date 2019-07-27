<?php

namespace yeesoft\menu\assets;

use yii\web\AssetBundle;

class MenuAsset extends AssetBundle
{
    public $sourcePath = '@vendor/yeesoft/yii2-yee-menu/assets/source';
    public $css = [
        'css/menu.css',
    ];
    public $js = [
        'js/menu.js',
    ];
    public $depends = [
        'yii\bootstrap\BootstrapAsset',
        'yii\web\JqueryAsset',
        'yii\jui\JuiAsset',
    ];
}
