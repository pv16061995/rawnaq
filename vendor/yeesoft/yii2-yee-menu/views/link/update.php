<?php

use yii\helpers\Html;
use yeesoft\menu\models\search\SearchMenuLink;
use yii\helpers\StringHelper;

/* @var $this yii\web\View */
/* @var $model yeesoft\models\MenuLink */

$formName = StringHelper::basename(SearchMenuLink::className());

$this->title = Yii::t('yee/menu', 'Update Menu Link');
$this->params['breadcrumbs'][] = ['label' => Yii::t('yee/menu', 'Menus'), 'url' => ['/menu/default/index']];
$this->params['breadcrumbs'][] = ['label' => $model->menu->title, 'url' => ['/menu/default/index', "{$formName}[menu_id]" => $model->menu_id]];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="menu-link-update">
    <h1><?= Html::encode($this->title) ?></h1>
    <?= $this->render('_form', compact('model')) ?>
</div>
