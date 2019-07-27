<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model common\models\Testimonial */

$this->title = Yii::t('yee', 'Create {item}', ['item' => Yii::t('yee/testimonial', 'Testimonial')]);
$this->params['breadcrumbs'][] = ['label' => Yii::t('yee/testimonial', 'Testimonials'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="testimonial-create">
    <h3 class="lte-hide-title"><?= Html::encode($this->title) ?></h3>
    <?= $this->render('_form', compact('model')) ?>
</div>
