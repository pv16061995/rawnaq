<?php

use yeesoft\grid\GridView;
use yeesoft\helpers\Html;
use yeesoft\models\Menu;
use yeesoft\models\User;
use yeesoft\menu\assets\MenuAsset;
use yii\bootstrap\Alert;

/* @var $this yii\web\View */
/* @var $searchModel yeesoft\menu\models\search\SearchMenu */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title                   = Yii::t('yee/menu', 'Menus');
$this->params['breadcrumbs'][] = $this->title;

MenuAsset::register($this);
?>
<div class="menu-index">

    <div class="row">
        <div class="col-sm-12">
            <h3 class="lte-hide-title page-title"><?= Html::encode($this->title) ?></h3>
            <?= Html::a(Yii::t('yee/menu', 'Add New Menu'), ['/menu/default/create'], ['class' => 'btn btn-sm btn-primary']) ?>
            <?= Html::a(Yii::t('yee/menu', 'Add New Link'), ['/menu/link/create'], ['class' => 'btn btn-sm btn-primary']) ?>

            <?= Alert::widget([
                'options' => ['class' => 'alert-primary menu-link-alert'],
                'body' => '<span class="glyphicon glyphicon-refresh glyphicon-spin"></span>',
            ]) ?>

            <?= Alert::widget([
                'options' => ['class' => 'alert-danger menu-link-alert'],
                'body' => Yii::t('yee/menu', 'An error occurred during saving menu!'),
            ]) ?>
            
            <?= Alert::widget([
                'options' => ['class' => 'alert-info menu-link-alert'],
                'body' => Yii::t('yee/menu', 'The changes have been saved.'),
            ]) ?>
        </div>
    </div>

    <div class="row">
        <div class="col-sm-4">
            <div class="panel panel-default">
                <div class="panel-body">
                    <?=
                    GridView::widget([
                        'id' => 'menu-grid',
                        'dataProvider' => $dataProvider,
                        'layout' => '{items}',
                        'columns' => [
                            [
                                'class' => 'yeesoft\grid\columns\TitleActionColumn',
                                'controller' => '/menu/default',
                                'buttonsTemplate' => '{update} {delete}',
                                'title' => function (Menu $model) {
                                    if (User::hasPermission('viewMenuLinks')) {
                                        return Html::a($model->title, ['/menu/default/index', 'SearchMenuLink[menu_id]' => $model->id], ['data-pjax' => 0]);
                                    } else {
                                        return Html::a($model->title, ['/menu/default/view', 'id' => $model->id], ['data-pjax' => 0]);
                                    }
                                },
                            ],
                        ],
                    ])
                    ?>
                </div>
            </div>
        </div>

        <div class="col-sm-8">
            <div class="panel panel-default">
                <div class="panel-body">
                    <div class="sortable-container menu-itemes">
                        <?=
                        $this->render('links', [
                            'searchLinkModel' => $searchLinkModel,
                            'searchParams' => ['parent_id' => ''],
                        ]);
                        ?>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>


