<?php

namespace common\modules\media\assets;

use yii\web\AssetBundle;

class UploaderAsset extends AssetBundle
{
    public $sourcePath = '@common/modules/media/assets/source';
    public $css = [
        'css/uploader.css',
    ];
    public $depends = [
        'yii\bootstrap\BootstrapAsset',
    ];
}
