<?php

use yeesoft\helpers\Html;
use yeesoft\media\widgets\TinyMce;
use common\modules\hotel\models\Destination;
use yeesoft\widgets\ActiveForm;
use yeesoft\widgets\LanguagePills;
use wbraganca\dynamicform\DynamicFormWidget;

/* @var $this yii\web\View */
/* @var $model common\modules\hotel\models\Destination */
/* @var $form yeesoft\widgets\ActiveForm */
?>

<div class="hotel-destination-form">

    <?php
    $form = ActiveForm::begin([
        'id' => 'hotel-destination-form',
        'validateOnBlur' => false,
    ])
    ?>

    <div class="row">
        <div class="col-md-9">
            <div class="panel panel-default">
                <div class="panel-body">

                    <?php if ($model->isMultilingual()) : ?>
                        <?= LanguagePills::widget() ?>
                    <?php endif; ?>

                    <?= $form->field($model, 'title')->textInput(['maxlength' => true]) ?>

                    <?php echo $form->field($model, 'parent_id')->dropDownList(Destination::getDestinations(), ['prompt' => '', 'encodeSpaces' => true]) ?>

                    <?= $form->field($model, 'slug')->textInput(['maxlength' => true]) ?>

                    <?= $form->field($model, 'sub_description')->textarea(['rows' => 6]) ?>
                    
                    <?= $form->field($model, 'description')->widget(TinyMce::className()); ?>
                    
                    <?= $form->field($model, 'thumbnail')->widget(yeesoft\media\widgets\FileInput::className(), [
                        'name' => 'image',
                        'buttonTag' => 'button',
                        'buttonName' => Yii::t('yee', 'Browse'),
                        'buttonOptions' => ['class' => 'btn btn-default btn-file-input'],
                        'options' => ['class' => 'form-control'],
                        'template' => '<div class="destination-thumbnail thumbnail"></div><div class="input-group">{input}<span class="input-group-btn">{button}</span></div>',
                        'thumb' => $this->context->module->thumbnailSize,
                        'imageContainer' => '.destination-thumbnail',
                        'pasteData' => yeesoft\media\widgets\FileInput::DATA_URL,
                        'callbackBeforeInsert' => 'function(e, data) {
                                $(".destination-thumbnail").show();
                            }',
                    ]) ?>
                    
                    <?= $form->field($model, 'banner')->widget(yeesoft\media\widgets\FileInput::className(), [
                        'name' => 'image',
                        'buttonTag' => 'button',
                        'buttonName' => Yii::t('yee', 'Browse'),
                        'buttonOptions' => ['class' => 'btn btn-default btn-file-input'],
                        'options' => ['class' => 'form-control'],
                        'template' => '<div class="destination-banner thumbnail"></div><div class="input-group">{input}<span class="input-group-btn">{button}</span></div>',
                        'thumb' => 'original',
                        'imageContainer' => '.destination-banner',
                        'pasteData' => yeesoft\media\widgets\FileInput::DATA_URL,
                        'callbackBeforeInsert' => 'function(e, data) {
                                $(".destination-banner").show();
                            }',
                    ]) ?>

                </div>
            </div>
            
            <div class="panel panel-default">
                <div class="panel-body">
                    <label><i class="fa fa-check-square-o"></i> Gallery</label>
                    <?php DynamicFormWidget::begin([
                        'widgetContainer' => 'dynamicform_wrapper',
                        'widgetBody' => '.form-options-body',
                        'widgetItem' => '.form-options-item',
                        'min' => 1,
                        'insertButton' => '.add-item',
                        'deleteButton' => '.delete-item',
                        'model' => $modelsGalleries[0],
                        'formId' => 'hotel-destination-form',
                        'formFields' => [
                            'description',
                            'img'
                        ],
                    ]); ?>
                    <table class="table table-bordered table-striped margin-b-none">
                        <thead>
                        <tr>
                            <th style="width: 90px; text-align: center"></th>
                            <th class="required">Description</th>
                            <th style="width: 188px;">Image</th>
                            <th style="width: 90px; text-align: center">Actions</th>
                        </tr>
                        </thead>
                        <tbody class="form-options-body">
                            <?php foreach ($modelsGalleries as $index => $modelsRoomGallery) : ?>
                                <tr class="form-options-item">
                                    <td class="sortable-handle text-center vcenter" style="cursor: move;">
                                        <i class="fa fa-arrows"></i>
                                    </td>
                                    <td class="vcenter">
                                        <?= $form->field($modelsRoomGallery, "[{$index}]description")->label(false)->textInput(['maxlength' => 128]); ?>
                                    </td>
                                    <td>
                                        <?php if (!$modelsRoomGallery->isNewRecord) : ?>
                                            <?= Html::activeHiddenInput($modelsRoomGallery, "[{$index}]id"); ?>
                                        <?php endif; ?>
                                        <?=
                                        $form->field($modelsRoomGallery, "[{$index}]img")->widget(yeesoft\media\widgets\FileInput::className(), [
                                            'name' => 'image',
                                            'buttonTag' => 'button',
                                            'buttonName' => Yii::t('yee', 'Browse'),
                                            'buttonOptions' => ['class' => 'btn btn-default btn-file-input'],
                                            'options' => ['class' => 'form-control'],
                                            'template' => '<div class="room-thumbnail-' . $index . ' thumbnail-room"></div><div class="input-group">{input}<span class="input-group-btn">{button}</span></div>',
                                            'thumb' => $this->context->module->thumbnailSize,
                                            'imageContainer' => '.room-thumbnail-' . $index,
                                            'pasteData' => yeesoft\media\widgets\FileInput::DATA_URL,
                                            'callbackBeforeInsert' => 'function(e, data) {
                                                    $(".room-thumbnail-' . $index . '").show();
                                                }',
                                        ])->label(false)

                                        ?>

                                    </td>
                                    <td class="text-center vcenter">
                                        <button type="button" class="delete-item btn btn-danger btn-xs"><i class="fa fa-minus"></i></button>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colspan="3"></td>
                            <td><button type="button" class="add-item btn btn-success btn-sm"><span class="fa fa-plus"></span> New</button></td>
                        </tr>
                        </tfoot>
                    </table>
                    <?php DynamicFormWidget::end(); ?>
                </div>
            </div>
        </div>

        <div class="col-md-3">
            <div class="panel panel-default">
                <div class="panel-body">
                    <div class="record-info">
                        <?= $form->field($model, 'show_on_home')->dropDownList([0 => 'No', 1 => 'Yes']) ?>

                        <?= $form->field($model, 'visible')->checkbox() ?>

                        <div class="form-group">
                            <?php if ($model->isNewRecord) : ?>
                                <?= Html::submitButton(Yii::t('yee', 'Create'), ['class' => 'btn btn-primary']) ?>
                                <?= Html::a(Yii::t('yee', 'Cancel'), ['index'], ['class' => 'btn btn-default']) ?>
                            <?php else : ?>
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
<style>
    .thumbnail-room{
        width: 250px;
    }
    .thumbnail-room img{
        width: 100%;
    }
</style>
<?php
$js = <<<JS
    var thumbnail = $("#destination-thumbnail").val();
    if(thumbnail.length == 0){
        $('.destination-thumbnail').hide();
    } else {
        $('.destination-thumbnail').html('<img src="' + thumbnail + '" />');
    }
    
    var banner = $("#destination-banner").val();
    if(banner.length == 0){
        $('.destination-banner').hide();
    } else {
        $('.destination-banner').html('<img src="' + banner + '" />');
    }
        
    $('.thumbnail-room').each(function(index){
        if(index>0){
            $(this).attr('class','thumbnail-room room-thumbnail-'+index);
            $(this).css('width', '200px');
            $(this).find('img').css('width', '100%');
        }
        var thumbnail = $(this).parent().find('input').val();
        if(thumbnail.length == 0){
            $('.room-thumbnail-'+index).hide();
        } else {
            $('.room-thumbnail-'+index).html('<img src="' + thumbnail + '" />');
        }
    });
JS;

$this->registerJs($js, yii\web\View::POS_READY);
?>