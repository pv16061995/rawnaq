<?php

namespace common\modules\hotel\assets;

use yii\web\AssetBundle;

class Select2Asset extends AssetBundle
{

    public $sourcePath = '@app/modules/hotel/assets';
    public $css = [
        'css/select2-min.css'
    ];
    public $js = [
        'js/select2.full-min.js'
    ];
    public $depends = [
        'yii\web\JqueryAsset',
    ];

}
