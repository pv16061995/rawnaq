<?php

namespace yeesoft\settings\controllers;

/**
 * DefaultController implements General Settings page.
 *
 * @author Taras Makitra <makitrataras@gmail.com>
 */
class DefaultController extends SettingsBaseController
{
    public $modelClass = 'yeesoft\settings\models\GeneralSettings';
    public $viewPath = '@vendor/yeesoft/yii2-yee-settings/views/default/index';

}