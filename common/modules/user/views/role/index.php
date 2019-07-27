<?php

use yeesoft\grid\GridPageSize;
use yeesoft\grid\GridView;
use yeesoft\helpers\Html;
use yeesoft\models\Role;
use yii\helpers\Url;
use yii\widgets\Pjax;

/**
 * @var yii\data\ActiveDataProvider $dataProvider
 * @var yeesoft\user\models\search\RoleSearch $searchModel
 * @var yii\web\View $this
 */
$this->title = Yii::t('yee/user', 'Roles');
$this->params['breadcrumbs'][] = ['label' => Yii::t('yee/user', 'Users'), 'url' => ['/user/default/index']];
$this->params['breadcrumbs'][] = $this->title;
?>

<div class="role-index">

    <div class="row">
        <div class="col-sm-12">
            <h3 class="lte-hide-title page-title"><?= Html::encode($this->title) ?></h3>
            <?= Html::a(Yii::t('yee', 'Add New'), ['create'], ['class' => 'btn btn-sm btn-primary']) ?>
        </div>
    </div>

    <div class="panel panel-default">
        <div class="panel-body">

            <div class="row">
                <div class="col-sm-12 text-right">
                    <?= GridPageSize::widget(['pjaxId' => 'role-grid-pjax']) ?>
                </div>
            </div>

            <?php Pjax::begin(['id' => 'role-grid-pjax']) ?>

            <?=
            GridView::widget([
                'id' => 'role-grid',
                'dataProvider' => $dataProvider,
                'filterModel' => $searchModel,
                'bulkActionOptions' => [
                    'gridId' => 'role-grid',
                    'actions' => [Url::to(['bulk-delete']) => Yii::t('yee', 'Delete')]
                ],
                'columns' => [
                    ['class' => 'yeesoft\grid\CheckboxColumn', 'options' => ['style' => 'width:10px']],
                    [
                        'attribute' => 'description',
                        'class' => 'yeesoft\grid\columns\TitleActionColumn',
                        'controller' => '/user/role',
                        'title' => function (Role $model) {
                            return Html::a($model->description,
                                ['view', 'id' => $model->name],
                                ['data-pjax' => 0]);
                        },
                        'buttons' => [
                            'view' => function ($url, $model, $key) {
                                $options = array_merge([
                                    'title' => Yii::t('yee', 'Settings'),
                                    'aria-label' => Yii::t('yee', 'Settings'),
                                    'data-pjax' => '0',
                                ]);
                                return Html::a(Yii::t('yee', 'Settings'), $url, $options);
                            }
                        ],
                    ],
                    [
                        'attribute' => 'name',
                        'options' => ['style' => 'width:200px'],
                    ],
                ],
            ]);
            ?>

            <?php Pjax::end() ?>
        </div>
    </div>
</div>




















