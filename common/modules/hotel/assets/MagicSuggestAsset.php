<?php

namespace common\modules\hotel\assets;

use yii\web\AssetBundle;

class MagicSuggestAsset extends AssetBundle
{

    public $sourcePath = '@app/modules/hotel/assets';
    public $css = [
        'css/magicsuggest-min.css'
    ];
    public $js = [
        'js/magicsuggest-min.js'
    ];
    public $depends = [
        'yii\web\JqueryAsset',
    ];

}
