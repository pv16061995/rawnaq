<?php

namespace common\modules\settings\controllers;

/**
 * ReadingController implements Social Media Settings page.
 *
 * @author Muhammad Zakir Mughal <zakirmughal89@gmail.com>
 */
class HomeController extends SettingsBaseController
{
    public $modelClass = 'common\modules\settings\models\HomeSettings';
    public $viewPath = '@common/modules/settings/views/home/index';

    public function init()
    {
        $this->layout = '@app/views/layouts/admin/main.php';
    }
}