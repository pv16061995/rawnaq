<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model common\modules\hotel\models\Destination */

$this->title = Yii::t('yee/media', 'Update Destination');
$this->params['breadcrumbs'][] = ['label' => Yii::t('yee/hotel', 'Hotels'), 'url' => ['default/index']];
$this->params['breadcrumbs'][] = ['label' => Yii::t('yee/hotel', 'Destinations'), 'url' => ['index']];
$this->params['breadcrumbs'][] = Yii::t('yee', 'Update');
?>
<div class="hotel-destination-update">
    <h3 class="lte-hide-title"><?= Html::encode($this->title) ?></h3>
    <?= $this->render('_form', compact('model', 'modelsGalleries')) ?>
</div>