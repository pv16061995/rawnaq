<?php

namespace common\modules\post\assets;

use yii\web\AssetBundle;

class MagicSuggestAsset extends AssetBundle
{

    public $sourcePath = '@common/modules/post/assets';
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
