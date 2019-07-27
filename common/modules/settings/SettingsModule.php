<?php
/**
 * @link http://www.yee-soft.com/
 * @copyright Copyright (c) 2015 Taras Makitra
 * @license http://www.apache.org/licenses/LICENSE-2.0
 */

namespace common\modules\settings;

/**
 * Settings Module For Yee CMS
 *
 * @author Taras Makitra <makitrataras@gmail.com>
 */
class SettingsModule extends \yii\base\Module
{
    /**
     * Version number of the module.
     */
    const VERSION = '0.1.0';

    /**
     * @inheritdoc
     */
    public $controllerNamespace = 'common\modules\settings\controllers';
    
    public $thumbnailSize = 'original';

}