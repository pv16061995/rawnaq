<?php

use yeesoft\comments\Comments;
use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model yeesoft\comments\models\Comment */

$this->title = Yii::t('yee', 'Update "{item}"', ['item' => Comments::t('comments', 'Comment')]);
$this->params['breadcrumbs'][] = ['label' => Comments::t('comments', 'Comments'), 'url' => ['index']];
$this->params['breadcrumbs'][] = Yii::t('yee', 'Update');
?>
<div class="comment-update">
    <h3 class="lte-hide-title"><?= Html::encode($this->title) ?></h3>
    <?= $this->render('_form', compact('model')) ?>
</div>