<?php

use yeesoft\grid\GridPageSize;
use yeesoft\grid\GridQuickLinks;
use yeesoft\grid\GridView;
use yeesoft\helpers\Html;
use yeesoft\models\Role;
use yeesoft\models\User;
use yii\helpers\ArrayHelper;
use yii\helpers\Url;
use yii\widgets\Pjax;

/**
 * @var yii\web\View $this
 * @var yii\data\ActiveDataProvider $dataProvider
 * @var yeesoft\user\models\search\UserSearch $searchModel
 */
$this->title = Yii::t('yee/user', 'Users');
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="user-index">

    <div class="row">
        <div class="col-sm-12">
            <h3 class="lte-hide-title page-title"><?= Html::encode($this->title) ?></h3>
            <?= Html::a(Yii::t('yee', 'Add New'), ['/user/default/create'], ['class' => 'btn btn-sm btn-primary']) ?>
        </div>
    </div>

    <div class="panel panel-default">
        <div class="panel-body">

            <div class="row">
                <div class="col-sm-6">
                    <?= GridQuickLinks::widget([
                        'model' => User::className(),
                        'searchModel' => $searchModel,
                    ]) ?>
                </div>

                <div class="col-sm-6 text-right">
                    <?= GridPageSize::widget(['pjaxId' => 'user-grid-pjax']) ?>
                </div>
            </div>

            <?php
            Pjax::begin([
                'id' => 'user-grid-pjax',
            ])
            ?>

            <?= GridView::widget([
                'id' => 'user-grid',
                'dataProvider' => $dataProvider,
                'filterModel' => $searchModel,
                'bulkActionOptions' => [
                    'gridId' => 'user-grid',
                ],
                'columns' => [
                    ['class' => 'yeesoft\grid\CheckboxColumn', 'options' => ['style' => 'width:10px']],
                    [
                        'attribute' => 'username',
                        'controller' => '/user/default',
                        'class' => 'yeesoft\grid\columns\TitleActionColumn',
                        'title' => function (User $model) {
                            if (User::hasPermission('editUsers')) {
                                return Html::a($model->username, ['/user/default/update', 'id' => $model->id], ['data-pjax' => 0]);
                            } else {
                                return $model->username;
                            }
                        },
                        'buttonsTemplate' => '{update} {delete} {permissions} {password}',
                        'buttons' => [
                            'permissions' => function ($url, $model, $key) {
                                return Html::a(Yii::t('yee/user', 'Permissions'),
                                    Url::to(['user-permission/set', 'id' => $model->id]), [
                                        'title' => Yii::t('yee/user', 'Permissions'),
                                        'data-pjax' => '0'
                                    ]
                                );
                            },
                            'password' => function ($url, $model, $key) {
                                return Html::a(Yii::t('yee/user', 'Password'),
                                    Url::to(['default/change-password', 'id' => $model->id]), [
                                        'title' => Yii::t('yee/user', 'Password'),
                                        'data-pjax' => '0'
                                    ]
                                );
                            }
                        ],
                        'options' => ['style' => 'width:300px']
                    ],
                    [
                        'attribute' => 'email',
                        'format' => 'raw',
                        'visible' => User::hasPermission('viewUserEmail'),
                    ],
                    /* [
                      'class' => 'yeesoft\grid\columns\StatusColumn',
                      'attribute' => 'email_confirmed',
                      'visible' => User::hasPermission('viewUserEmail'),
                      ], */
                    [
                        'attribute' => 'gridRoleSearch',
                        'filter' => ArrayHelper::map(Role::getAvailableRoles(Yii::$app->user->isSuperAdmin),
                            'name', 'description'),
                        'value' => function (User $model) {
                            return implode(', ',
                                ArrayHelper::map($model->roles, 'name',
                                    'description'));
                        },
                        'format' => 'raw',
                        'visible' => User::hasPermission('viewUserRoles'),
                    ],
                    /*  [
                      'attribute' => 'registration_ip',
                      'value' => function(User $model) {
                      return Html::a($model->registration_ip,
                      "http://ipinfo.io/".$model->registration_ip,
                      ["target" => "_blank"]);
                      },
                      'format' => 'raw',
                      'visible' => User::hasPermission('viewRegistrationIp'),
                      ], */
                    [
                        'class' => 'yeesoft\grid\columns\StatusColumn',
                        'attribute' => 'superadmin',
                        'visible' => Yii::$app->user->isSuperadmin,
                        'options' => ['style' => 'width:60px']
                    ],
                    [
                        'class' => 'yeesoft\grid\columns\StatusColumn',
                        'attribute' => 'status',
                        'optionsArray' => [
                            [User::STATUS_ACTIVE, Yii::t('yee', 'Active'), 'primary'],
                            [User::STATUS_INACTIVE, Yii::t('yee', 'Inactive'), 'info'],
                            [User::STATUS_BANNED, Yii::t('yee', 'Banned'), 'default'],
                        ],
                        'options' => ['style' => 'width:60px']
                    ],
                ],
            ]);
            ?>

            <?php Pjax::end() ?>

        </div>
    </div>
</div>
