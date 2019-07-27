<?php

use yii\helpers\Html;

/**
 * @var yii\web\View $this
 * @var yeesoft\models\AuthItemGroup $model
 */

$this->title = Yii::t('yee/user', 'Update Permission Group');
$this->params['breadcrumbs'][] = ['label' => Yii::t('yee/user', 'Users'), 'url' => ['/user/default/index']];
$this->params['breadcrumbs'][] = ['label' => Yii::t('yee/user', 'Permission Groups'), 'url' => ['/user/permission-groups/index']];
$this->params['breadcrumbs'][] = $this->title;
?>

<div class="permission-groups-update">
    <h3 class="lte-hide-title"><?= Html::encode($this->title) ?></h3>
    <?= $this->render('_form', compact('model')) ?>
</div>
