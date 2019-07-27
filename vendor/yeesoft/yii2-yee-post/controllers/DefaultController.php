<?php

namespace yeesoft\post\controllers;

use yeesoft\controllers\admin\BaseController;
use yeesoft\models\User;

/**
 * PostController implements the CRUD actions for Post model.
 */
class DefaultController extends BaseController
{

    public function init()
    {
        $this->modelClass = $this->module->postModelClass;
        $this->modelSearchClass = $this->module->postModelSearchClass;

        $this->indexView = $this->module->indexView;
        $this->viewView = $this->module->viewView;
        $this->createView = $this->module->createView;
        $this->updateView = $this->module->updateView;

        parent::init();
    }

    protected function getRedirectPage($action, $model = null)
    {
        if (!User::hasPermission('editPosts') && $action == 'create') {
            return ['view', 'id' => $model->id];
        }

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
