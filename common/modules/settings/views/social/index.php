<?php

use yeesoft\helpers\Html;
use yeesoft\settings\assets\SettingsAsset;
use yeesoft\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model yeesoft\models\Setting */
/* @var $form yeesoft\widgets\ActiveForm */

$this->title = Yii::t('yee/settings', 'Social Settings');
$this->params['breadcrumbs'][] = $this->title;

SettingsAsset::register($this);
?>
<div class="setting-index">

    <div class="row">
        <div class="col-lg-8"><h3 class="lte-hide-title page-title"><?= Html::encode($this->title) ?></h3></div>
        <div class="col-lg-4"></div>
    </div>

    <div class="setting-form">
        <?php
        $form = ActiveForm::begin([
            'id' => 'setting-form',
            'validateOnBlur' => false,
            'fieldConfig' => [
                'template' => "<div class=\"settings-group\"><div class=\"settings-label\">{label}</div>\n<div class=\"settings-field\">{input}\n{hint}\n{error}</div></div>"
            ],
        ])
        ?>

        <?= $form->field($model, 'fb_link')->textInput()->hint($model->getDescription('fb_link')) ?>
        <?= $form->field($model, 'tw_link')->textInput()->hint($model->getDescription('tw_link')) ?>
        <?= $form->field($model, 'yt_link')->textInput()->hint($model->getDescription('yt_link')) ?>
        <?= $form->field($model, 'ld_link')->textInput()->hint($model->getDescription('ld_link')) ?>
        <?= $form->field($model, 'in_link')->textInput()->hint($model->getDescription('in_link')) ?>

        <div class="form-group">
            <?= Html::submitButton(Yii::t('yee', 'Save'), ['class' => 'btn btn-primary']) ?>
        </div>

        <?php ActiveForm::end(); ?>

    </div>
</div>


