<?php

namespace common\modules\page\controllers;

use yeesoft\controllers\admin\BaseController;

/**
 * Controller implements the CRUD actions for Page model.
 */
class DefaultController extends BaseController
{
    public $modelClass = 'common\modules\page\models\Page';
    public $modelSearchClass = 'common\modules\page\models\search\PageSearch';

    public function init()
    {
        $this->layout = '@app/views/layouts/admin/main.php';
    }
    protected function getRedirectPage($action, $model = null)
    {
        switch ($action) {
            case 'update':
                return ['update', 'id' => $model->id];
                break;
            case 'create':
                return ['update', 'id' => $model->id];
                break;
            default:
                return parent::getRedirectPage($action, $model);
        }
    }
}