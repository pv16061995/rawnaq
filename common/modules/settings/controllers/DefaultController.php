<?php

namespace common\modules\settings\controllers;

/**
 * DefaultController implements General Settings page.
 *
 * @author Muhammad Zakir Mughal <zakirmughal89@gmail.com>
 */
class DefaultController extends SettingsBaseController
{
    public $modelClass = 'common\modules\settings\models\GeneralSettings';
    public $viewPath = '@common/modules/settings/views/default/index';

    public function init()
    {
        $this->layout = '@app/views/layouts/admin/main.php';
    }
}