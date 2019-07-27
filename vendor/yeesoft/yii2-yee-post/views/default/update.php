<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model common\models\Post */

$this->title = Yii::t('yee', 'Update "{item}"', ['item' => $model->title]);
$this->params['breadcrumbs'][] = ['label' => Yii::t('yee/post', 'Posts'), 'url' => ['index']];
$this->params['breadcrumbs'][] = ['label' => $model->title, 'url' => ['view', 'id' => $model->id]];
$this->params['breadcrumbs'][] = Yii::t('yee', 'Update');
?>

<div class="post-update">
    <h3 class="lte-hide-title"><?= Html::encode($this->title) ?></h3>
    <?= $this->render('_form', compact('model')) ?>
</div>


