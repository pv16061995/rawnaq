<?php

use yeesoft\grid\GridPageSize;
use yeesoft\grid\GridView;
use yeesoft\helpers\Html;
use yeesoft\post\models\Tag;
use yii\helpers\Url;
use yii\widgets\Pjax;

/* @var $this yii\web\View */
/* @var $searchModel yeesoft\post\search\TagSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = Yii::t('yee/media', 'Tags');
$this->params['breadcrumbs'][] = ['label' => Yii::t('yee/post', 'Posts'), 'url' => ['default/index']];
$this->params['breadcrumbs'][] = $this->title;

?>
<div class="post-tag-index">

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
                    <?= GridPageSize::widget(['pjaxId' => 'post-tag-grid-pjax']) ?>
                </div>
            </div>

            <?php Pjax::begin(['id' => 'post-tag-grid-pjax']) ?>

            <?= GridView::widget([
                'id' => 'post-tag-grid',
                'dataProvider' => $dataProvider,
                'filterModel' => $searchModel,
                'bulkActionOptions' => [
                    'gridId' => 'post-tag-grid',
                    'actions' => [Url::to(['bulk-delete']) => Yii::t('yee', 'Delete')]
                ],
                'columns' => [
                    ['class' => 'yeesoft\grid\CheckboxColumn', 'options' => ['style' => 'width:10px']],
                    [
                        'class' => 'yeesoft\grid\columns\TitleActionColumn',
                        'controller' => '/post/tag',
                        'title' => function (Tag $model) {
                            return Html::a($model->title, ['update', 'id' => $model->id], ['data-pjax' => 0]);
                        },
                        'buttonsTemplate' => '{update} {delete}',
                    ],
                    'slug',
                ],
            ]); ?>

            <?php Pjax::end() ?>
        </div>
    </div>
</div>