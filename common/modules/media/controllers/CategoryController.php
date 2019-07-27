<?php

namespace common\modules\media\controllers;

use yeesoft\controllers\admin\BaseController;

/**
 * CategoryController implements the CRUD actions for yeesoft\media\models\Category model.
 */
class CategoryController extends BaseController
{
    public $modelClass = 'common\modules\media\models\Category';
    public $modelSearchClass = 'common\modules\media\models\CategorySearch';
    public $disabledActions = ['view', 'bulk-activate', 'bulk-deactivate'];

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