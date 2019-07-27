<?php

namespace yeesoft\settings\controllers;

/**
 * ReadingController implements Reading Settings page.
 *
 * @author Taras Makitra <makitrataras@gmail.com>
 */
class ReadingController extends SettingsBaseController
{
    public $modelClass = 'yeesoft\settings\models\ReadingSettings';
    public $viewPath = '@vendor/yeesoft/yii2-yee-settings/views/reading/index';

}