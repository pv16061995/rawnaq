<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model yeesoft\menu\models\Menu */

$this->title = Yii::t('yee', 'Create {item}', ['item' => Yii::t('yee/menu', 'Menu')]);
$this->params['breadcrumbs'][] = ['label' => Yii::t('yee/menu', 'Menus'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>

<div class="menu-create">
    <h3 class="lte-hide-title"><?= Html::encode($this->title) ?></h3>
    <?= $this->render('_form', compact('model')) ?>
</div>