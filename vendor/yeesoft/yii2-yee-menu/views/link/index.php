<?php

use yeesoft\grid\GridPageSize;
use yeesoft\grid\GridView;
use yeesoft\helpers\Html;
use yeesoft\helpers\FA;
use yeesoft\models\Menu;
use yeesoft\models\MenuLink;
use yii\helpers\ArrayHelper;
use yii\helpers\Url;
use yii\widgets\Pjax;

/* @var $this yii\web\View */
/* @var $searchModel yeesoft\menu\models\search\SearchMenuLink */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = Yii::t('yee/menu', 'Menu Links');
$this->params['breadcrumbs'][] = ['label' => Yii::t('yee/menu', 'Menus'), 'url' => ['/menu/default/index']];
$this->params['breadcrumbs'][] = $this->title;

?>
<div class="menu-link-index">

    <div class="row">
        <div class="col-sm-12">
            <h3 class="lte-hide-title page-title"><?= Html::encode($this->title) ?></h3>
            <?= Html::a(Yii::t('yee', 'Add New'), ['/menu/link/create'], ['class' => 'btn btn-sm btn-primary']) ?>
        </div>
    </div>

    <div class="panel panel-default">
        <div class="panel-body">

            <div class="row">
                <div class="col-sm-12 text-right">
                    <?= GridPageSize::widget(['pjaxId' => 'menu-link-grid-pjax']) ?>
                </div>
            </div>

            <?php Pjax::begin(['id' => 'menu-link-grid-pjax']) ?>

            <?=
            GridView::widget([
                'id' => 'menu-link-grid',
                'dataProvider' => $dataProvider,
                'filterModel' => $searchModel,
                'bulkActionOptions' => [
                    'gridId' => 'menu-link-grid',
                    'actions' => [Url::to(['bulk-delete']) => Yii::t('yee', 'Delete')]
                ],
                'columns' => [
                    ['class' => 'yeesoft\grid\CheckboxColumn', 'options' => ['style' => 'width:10px']],
                    [
                        'attribute' => 'image',
                        'value' => function (MenuLink $model) {
                            return FA::icon($model->image)->fixedWidth();
                        },
                        'format' => 'raw',
                        'contentOptions' => [
                            'style' => 'width:20px; text-align:center;'
                        ]
                    ],
                    [
                        'class' => 'yeesoft\grid\columns\TitleActionColumn',
                        'controller' => '/menu/link',
                        'attribute' => 'id',
                        'title' => function (MenuLink $model) {
                            return Html::a($model->label,
                                ['/menu/link/update', 'id' => $model->id], ['data-pjax' => 0]);
                        },
                        'format' => 'raw',
                        'buttonsTemplate' => '{update} {delete}',
                        'options' => ['style' => 'width:220px']
                    ],
                    [
                        'attribute' => 'menu_id',
                        'filter' => ArrayHelper::merge(['' => Yii::t('yee', 'Not Selected')], Menu::getMenus()),
                        'value' => function (MenuLink $model) {
                            return ($model->menu instanceof Menu) ? $model->menu->title : Yii::t('yii', '(not set)');
                        },
                        'format' => 'raw',
                    ],
                    'link',


                    'parent_id',
                    'order',
                ],
            ]);
            ?>

            <?php Pjax::end() ?>
        </div>
    </div>
</div>


