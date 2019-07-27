<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model common\models\Hotel */

$this->title = Yii::t('yee', 'Create {item}', ['item' => Yii::t('yee/hotel', 'Hotel')]);
$this->params['breadcrumbs'][] = ['label' => Yii::t('yee/hotel', 'Hotels'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="hotel-create">
    <h3 class="lte-hide-title"><?= Html::encode($this->title) ?></h3>
    <?= $this->render('_form', compact('model', 'modelsGalleries', 'modelsServices')) ?>
</div>
