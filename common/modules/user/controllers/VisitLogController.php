<?php

namespace common\modules\user\controllers;

use yeesoft\controllers\admin\BaseController;

/**
 * UserVisitLogController implements the CRUD actions for UserVisitLog model.
 */
class VisitLogController extends BaseController
{
    public function init()
    {
        $this->layout = '@app/views/layouts/admin/main.php';
    }
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