<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model common\modules\hotel\models\Service */

$this->title = Yii::t('yee/media', 'Update Service');
$this->params['breadcrumbs'][] = ['label' => Yii::t('yee/hotel', 'Services'), 'url' => ['default/index']];
$this->params['breadcrumbs'][] = ['label' => Yii::t('yee/hotel', 'Services'), 'url' => ['index']];
$this->params['breadcrumbs'][] = Yii::t('yee', 'Update');
?>
<div class="hotel-service-update">
    <h3 class="lte-hide-title"><?= Html::encode($this->title) ?></h3>
    <?= $this->render('_form', compact('model')) ?>
</div>