<?php

namespace yeesoft\user\controllers;

use yeesoft\controllers\admin\BaseController;
use yeesoft\models\AuthItemGroup;
use yeesoft\user\models\search\AuthItemGroupSearch;

/**
 * AuthItemGroupController implements the CRUD actions for AuthItemGroup model.
 */
class PermissionGroupsController extends BaseController
{
    /**
     * @var AuthItemGroup
     */
    public $modelClass = 'yeesoft\models\AuthItemGroup';

    /**
     * @var AuthItemGroupSearch
     */
    public $modelSearchClass = 'yeesoft\user\models\search\AuthItemGroupSearch';

    public $disabledActions = ['view'];

    /**
     * Define redirect page after update, create, delete, etc
     *
     * @param string $action
     * @param AuthItemGroup $model
     *
     * @return string|array
     */
    protected function getRedirectPage($action, $model = null)
    {
        switch ($action) {
            case 'delete':
                return ['index'];
                break;
            case 'create':
                return ['update', 'id' => $model->code];
                break;
            default:
                return ['index'];
        }
    }
}