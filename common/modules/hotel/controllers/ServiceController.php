<?php

namespace common\modules\hotel\controllers;

use yeesoft\controllers\admin\BaseController;

/**
 * ServiceController implements the CRUD actions for common\modules\hotel\models\Service model.
 */
class ServiceController extends BaseController
{

    public $disabledActions = ['view', 'bulk-activate', 'bulk-deactivate'];

    public function init()
    {
        $this->layout = '@app/views/layouts/admin/main.php';
        $this->modelClass = $this->module->serviceModelClass;
        $this->modelSearchClass = $this->module->serviceModelSearchClass;

        $this->indexView = $this->module->serviceIndexView;
        $this->viewView = $this->module->serviceViewView;
        $this->createView = $this->module->serviceCreateView;
        $this->updateView = $this->module->serviceUpdateView;

        parent::init();
    }

    public function actionCreate()
    {
        //echo "<pre>"; print_r($_POST);exit;
        return parent::actionCreate(); // TODO: Change the autogenerated stub
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
