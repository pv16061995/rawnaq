<?php

namespace common\modules\settings\controllers;

/**
 * ReadingController implements Social Media Settings page.
 *
 * @author Muhammad Zakir Mughal <zakirmughal89@gmail.com>
 */
class SocialController extends SettingsBaseController
{
    public $modelClass = 'common\modules\settings\models\SocialMediaSettings';
    public $viewPath = '@common/modules/settings/views/social/index';

    public function init()
    {
        $this->layout = '@app/views/layouts/admin/main.php';
    }
}