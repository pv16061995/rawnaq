<?php

namespace common\modules\settings\controllers;

/**
 * ReadingController implements Reading Settings page.
 *
 * @author Muhammad Zakir Mughal <zakirmughal89@gmail.com>
 */
class ReadingController extends SettingsBaseController
{
    public $modelClass = 'common\modules\settings\models\ReadingSettings';
    public $viewPath = '@common/modules/settings/views/reading/index';

    public function init()
    {
        $this->layout = '@app/views/layouts/admin/main.php';
    }
}