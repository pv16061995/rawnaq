<?php

use yeesoft\helpers\Html;

/* @var $this yii\web\View */
/* @var $model common\models\Testimonial */

$this->title = $model->client_name;
$this->params['breadcrumbs'][] = ['label' => Yii::t('yee/testimonial', 'Testimonials'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="testimonial-view">

    <h3 class="lte-hide-title"><?= Html::encode($this->title) ?></h3>

    <div class="panel panel-default">
        <div class="panel-body">

            <?= Html::a(Yii::t('yee', 'Edit'), ['update', 'id' => $model->id], ['class' => 'btn btn-sm btn-primary']) ?>

            <?= Html::a(Yii::t('yee', 'Delete'), ['delete', 'id' => $model->id], [
                'class' => 'btn btn-sm btn-default',
                'data' => [
                    'confirm' => Yii::t('yii', 'Are you sure you want to delete this item?'),
                    'method' => 'post',
                ],
            ]) ?>

            <?= Html::a(Yii::t('yee', 'Add New'), ['create'], ['class' => 'btn btn-sm btn-primary pull-right']) ?>

        </div>
    </div>

    <div class="panel panel-default">
        <div class="panel-body">
            <h2><?= $model->client_name ?></h2>
            <?= $model->getThumbnail(['class' => 'thumbnail pull-left', 'style' => 'width: 240px; margin:0 7px 7px 0;']) ?>
            <?= $model->remarks ?>
        </div>
    </div>


</div>
