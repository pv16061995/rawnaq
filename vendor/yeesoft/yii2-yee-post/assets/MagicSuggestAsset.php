<?php

namespace yeesoft\post\assets;

use yii\web\AssetBundle;

class MagicSuggestAsset extends AssetBundle
{

    public $sourcePath = '@vendor/nicolasbize/magicsuggest';
    public $css = [
        'magicsuggest-min.css'
    ];
    public $js = [
        'magicsuggest-min.js'
    ];
    public $depends = [
        'yii\web\JqueryAsset',
    ];

}
