<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model yeesoft\post\models\Tag */

$this->title = Yii::t('yee/post', 'Create Tag');
$this->params['breadcrumbs'][] = ['label' => Yii::t('yee/post', 'Posts'), 'url' => ['default/index']];
$this->params['breadcrumbs'][] = ['label' => Yii::t('yee/post', 'Tags'), 'url' => ['index']];
$this->params['breadcrumbs'][] = Yii::t('yee', 'Create');
?>

<div class="post-tag-create">
    <h3 class="lte-hide-title"><?= Html::encode($this->title) ?></h3>
    <?= $this->render('_form', compact('model')) ?>
</div>