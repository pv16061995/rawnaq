<?php

use yeesoft\helpers\Html;
use common\modules\hotel\models\Service;
use yeesoft\widgets\ActiveForm;
use yeesoft\widgets\LanguagePills;
use common\modules\hotel\widgets\Select2;

/* @var $this yii\web\View */
/* @var $model common\modules\hotel\models\Service */
/* @var $form yeesoft\widgets\ActiveForm */
?>

<div class="hotel-service-form">

    <?php
    $form = ActiveForm::begin([
        'id' => 'hotel-service-form',
        'validateOnBlur' => false,
    ])
    ?>

    <div class="row">
        <div class="col-md-9">
            <div class="panel panel-default">
                <div class="panel-body">

                    <?php if ($model->isMultilingual()): ?>
                        <?= LanguagePills::widget() ?>
                    <?php endif; ?>

                    <?= $form->field($model, 'title')->textInput(['maxlength' => true]) ?>

                    <?= $form->field($model, 'slug')->textInput(['maxlength' => true]) ?>

                    <?php //$form->field($model, 'service_type')->widget(MagicSuggest::className(), ['items' => Service::getServiceType(),'keyField'=>'key','placeholder'=>'Select Service Type', 'callback'=>"function(data){ return data.name + ' (<b>' + data.used + '</b>)'; }", 'resultAsString'=>true]); ?>
                    <?= $form->field($model, 'service_type')->widget(Select2::classname(), [
                        'data' => Service::getServiceType(),
                        'placeholder' => 'Select Service Type..',
                        'initSelection'=> $model->service_type,
                        'templateResult' => "function(item) { if(!item.id) item.text; return $('<span>' + item.text + '</span>' +'<b>('+item.used+')</b>'); }",
                        //'escapeMarkup' => "function (m) { return m; }",
                        //'formatResult' => "function(item) { if(!item.id) item.text; return '<span>' + item.text + '</span>' +'<b>('+item.used+')</b>'; }",
                        //'formatSelection' => "function(item) { if(!item.id) item.text; return '<span>' + item.text + '</span>' +'<b>('+item.used+')</b>'; }",

                    ]); ?>

                </div>
            </div>
        </div>

        <div class="col-md-3">
            <div class="panel panel-default">
                <div class="panel-body">
                    <div class="record-info">

                        <div class="form-group">
                            <?php if ($model->isNewRecord): ?>
                                <?= Html::submitButton(Yii::t('yee', 'Create'), ['class' => 'btn btn-primary']) ?>
                                <?= Html::a(Yii::t('yee', 'Cancel'), ['index'], ['class' => 'btn btn-default']) ?>
                            <?php else: ?>
                                <?= Html::submitButton(Yii::t('yee', 'Save'), ['class' => 'btn btn-primary']) ?>
                                <?= Html::a(Yii::t('yee', 'Delete'), ['delete', 'id' => $model->id], [
                                    'class' => 'btn btn-default',
                                    'data' => [
                                        'confirm' => Yii::t('yii', 'Are you sure you want to delete this item?'),
                                        'method' => 'post',
                                    ],
                                ])
                                ?>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <?php ActiveForm::end(); ?>

</div>