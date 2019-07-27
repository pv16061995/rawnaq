<?php

namespace yeesoft\user\controllers;

use yeesoft\controllers\admin\BaseController;

/**
 * UserVisitLogController implements the CRUD actions for UserVisitLog model.
 */
class VisitLogController extends BaseController
{
    /**
     *
     * @inheritdoc
     */
    public $modelClass = 'yeesoft\models\UserVisitLog';

    /**
     *
     * @inheritdoc
     */
    public $modelSearchClass = 'yeesoft\user\models\search\UserVisitLogSearch';

    /**
     *
     * @inheritdoc
     */
    public $enableOnlyActions = ['index', 'view', 'grid-page-size'];

}