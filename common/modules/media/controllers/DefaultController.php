<?php

namespace common\modules\media\controllers;

use yeesoft\controllers\admin\BaseController;

class DefaultController extends BaseController
{

    public $disabledActions = ['view', 'create', 'update', 'delete', 'toggle-attribute',
        'bulk-activate', 'bulk-deactivate', 'bulk-delete', 'grid-sort', 'grid-page-size'];

    public function init()
    {
        $this->layout = '@app/views/layouts/admin/main.php';
    }
    public function actionIndex()
    {
        return $this->render('index');
    }

    public function actionSettings()
    {
        return $this->render('settings');
    }

}