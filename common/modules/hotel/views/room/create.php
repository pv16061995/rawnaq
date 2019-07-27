<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model common\modules\hotel\models\Rooms */

$this->title = Yii::t('yee/media', 'Create Room');
$this->params['breadcrumbs'][] = ['label' => Yii::t('yee/hotel', 'Hotels'), 'url' => ['default/index']];
$this->params['breadcrumbs'][] = ['label' => Yii::t('yee/hotel', 'Rooms'), 'url' => ['index']];
$this->params['breadcrumbs'][] = Yii::t('yee', 'Create');
?>

<div class="hotel-room-create">
    <h3 class="lte-hide-title"><?= Html::encode($this->title) ?></h3>
    <?= $this->render('_form', compact('model','modelsRoomGalleries', 'modelsServices')) ?>
</div>