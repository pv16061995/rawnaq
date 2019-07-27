<?php

use yii\jui\JuiAsset;
use yii\web\JsExpression;
use yeesoft\helpers\Html;
use common\modules\hotel\models\Room;
use common\modules\hotel\models\Service;
use yeesoft\widgets\ActiveForm;
use yeesoft\widgets\LanguagePills;
use wbraganca\dynamicform\DynamicFormWidget;
use common\modules\hotel\models\HotelRoomGalleryImage;
use kartik\file\FileInput as KFileInput;
use yeesoft\media\widgets\TinyMce;

/* @var $this yii\web\View */
/* @var $model common\modules\hotel\models\Room */
/* @var $form yeesoft\widgets\ActiveForm */
?>

<div class="hotel-room-form">

    <?php
    $form = ActiveForm::begin([
        'id' => 'hotel-room-form',
        'validateOnBlur' => false,
        'enableClientValidation' => false,
        'enableAjaxValidation' => false,
        'validateOnChange' => true,
        'options' => [
            'enctype' => 'multipart/form-data',
            'id' => 'hotel-room-form'
        ]
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
                    
                    <?= $form->field($model, 'content')->widget(TinyMce::className()); ?>
                    
                    <?= $form->field($model, 'thumbnail')->widget(yeesoft\media\widgets\FileInput::className(), [
                        'name' => 'image',
                        'buttonTag' => 'button',
                        'buttonName' => Yii::t('yee', 'Browse'),
                        'buttonOptions' => ['class' => 'btn btn-default btn-file-input'],
                        'options' => ['class' => 'form-control'],
                        'template' => '<div class="room-thumbnail thumbnail"></div><div class="input-group">{input}<span class="input-group-btn">{button}</span></div>',
                        'thumb' => $this->context->module->thumbnailSize,
                        'imageContainer' => '.room-thumbnail',
                        'pasteData' => yeesoft\media\widgets\FileInput::DATA_URL,
                        'callbackBeforeInsert' => 'function(e, data) {
                                $(".room-thumbnail").show();
                            }',
                    ]) ?>

                </div>
            </div>
            
            <div class="panel panel-default">
                <div class="panel-body">
                    <div class="record-info">
                        <?php DynamicFormWidget::begin([
                            'widgetContainer' => 'dynamicServiceform_wrapper', // required: only alphanumeric characters plus "_" [A-Za-z0-9_]
                            'widgetBody' => '.container-items', // required: css class selector
                            'widgetItem' => '.item', // required: css class
                            'limit' => 999, // the maximum times, an element can be cloned (default 999)
                            'min' => 0, // 0 or 1 (default 1),
                            'insertButton' => '.add-item', // css class
                            'deleteButton' => '.remove-item', // css class
                            'model' => $modelsServices[0],
                            'formId' => 'hotel-room-form',
                            'formFields' => [
                                'service_id',
                                'service_description',
                            ],
                        ]); ?>
                        <label>Services</label>
                        <button type="button" class="pull-right add-item btn btn-success btn-xs"><i class="fa fa-plus"></i> Add Service</button>
                        <div class="clearfix"></div>
                        <div class="container-items"><!-- widgetContainer -->
                            <?php foreach ($modelsServices as $i => $modelService): ?>
                                <div class="item panel panel-default"><!-- widgetBody -->
                                    <div class="panel-heading">
                                        <h3 class="panel-title pull-left">Service</h3>
                                        <div class="pull-right">
                                            <button type="button" class="remove-item btn btn-danger btn-xs"><i class="glyphicon glyphicon-minus"></i></button>
                                        </div>
                                        <div class="clearfix"></div>
                                    </div>
                                    <div class="panel-body">
                                        <div class="row">
                                            <div class="col-sm-6">
                                                <?php
                                                // necessary for update action.
                                                if (! $modelService->isNewRecord) {
                                                    echo Html::activeHiddenInput($modelService, "[{$i}]id");
                                                }
                                                ?>
                                                <?=
                                                $form->field($modelService,  "[{$i}]service_id")->dropDownList(Service::getServicesForDropBox(), ['prompt' => '', 'encodeSpaces' => true])
                                                ?>
                                            </div>
                                            <div class="col-sm-6">
                                                <?= $form->field($modelService, "[{$i}]service_description")->textInput(['maxlength' => true]) ?>
                                            </div>
                                        </div><!-- .row -->
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                        <?php DynamicFormWidget::end(); ?>
                    </div>
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
                        'model' => $modelsRoomGalleries[0],
                        'formId' => 'hotel-room-form',
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
                            <?php foreach ($modelsRoomGalleries as $index => $modelsRoomGallery): ?>
                                <tr class="form-options-item">
                                    <td class="sortable-handle text-center vcenter" style="cursor: move;">
                                        <i class="fa fa-arrows"></i>
                                    </td>
                                    <td class="vcenter">
                                        <?= $form->field($modelsRoomGallery, "[{$index}]description")->label(false)->textInput(['maxlength' => 128]); ?>
                                    </td>
                                    <td>
                                        <?php if (!$modelsRoomGallery->isNewRecord): ?>
                                            <?= Html::activeHiddenInput($modelsRoomGallery, "[{$index}]id"); ?>
                                        <?php endif; ?>
                                        <?php
                                        $modelImage = HotelRoomGalleryImage::findOne(['id' => $modelsRoomGallery->image_id]);
                                        $initialPreview = [];
                                        if ($modelImage) {
                                            $pathImg = Yii::$app->fileStorage->baseUrl . '/' . $modelImage->path;
                                            $initialPreview[] = Html::img($pathImg, ['class' => 'file-preview-image']);
                                        }
                                        ?>
                                        <?= /*$form->field($modelsRoomGallery, "[{$index}]img")->label(false)->widget(KFileInput::classname(), [
                                            'options' => [
                                                'multiple' => false,
                                                'accept' => 'image/*',
                                                'class' => 'optionvalue-img'
                                            ],
                                            'pluginOptions' => [
                                                'previewFileType' => 'image',
                                                'showCaption' => false,
                                                'showUpload' => false,
                                                'browseClass' => 'btn btn-default btn-sm',
                                                'browseLabel' => ' Pick image',
                                                'browseIcon' => '<i class="glyphicon glyphicon-picture"></i>',
                                                'removeClass' => 'btn btn-danger btn-sm',
                                                'removeLabel' => ' Delete',
                                                'removeIcon' => '<i class="fa fa-trash"></i>',
                                                'previewSettings' => [
                                                    'image' => ['width' => '138px', 'height' => 'auto']
                                                ],
                                                'initialPreview' => $initialPreview,
                                                'layoutTemplates' => ['footer' => '']
                                            ]
                                        ])*/
                                        $form->field($modelsRoomGallery, "[{$index}]img")->widget(yeesoft\media\widgets\FileInput::className(), [
                                            'name' => 'image',
                                            'buttonTag' => 'button',
                                            'buttonName' => Yii::t('yee', 'Browse'),
                                            'buttonOptions' => ['class' => 'btn btn-default btn-file-input'],
                                            'options' => ['class' => 'form-control'],
                                            'template' => '<div class="room-thumbnail-'.$index.' thumbnail-room"></div><div class="input-group">{input}<span class="input-group-btn">{button}</span></div>',
                                            'thumb' => $this->context->module->thumbnailSize,
                                            'imageContainer' => '.room-thumbnail-'.$index,
                                            'pasteData' => yeesoft\media\widgets\FileInput::DATA_URL,
                                            'callbackBeforeInsert' => 'function(e, data) {
                                                    $(".room-thumbnail-'.$index.'").show();
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
    var thumbnail = $("#room-thumbnail").val();
    if(thumbnail.length == 0){
        $('.room-thumbnail').hide();
    } else {
        $('.room-thumbnail').html('<img src="' + thumbnail + '" />');
    }
        
    $('.thumbnail-room').each(function(index){
        if(index>0){
            $(this).attr('class','thumbnail-room room-thumbnail-'+index);
        }
        var thumbnail = $(this).parent().find('input').val();
        if(thumbnail.length == 0){
            $('.room-thumbnail-'+index).hide();
        } else {
            $('.room-thumbnail-'+index).html('<img src="' + thumbnail + '" />');
        }
    });
    
    /*$(".optionvalue-img").on("filecleared", function(event) {
        var regexID = /^(.+?)([-\d-]{1,})(.+)$/i;
        var id = event.target.id;
        var matches = id.match(regexID);
        if (matches && matches.length === 4) {
            var identifiers = matches[2].split("-");
            $("#optionvalue-" + identifiers[1] + "-deleteimg").val("1");
        }
    });
    
    var fixHelperSortable = function(e, ui) {
        ui.children().each(function() {
            $(this).width($(this).width());
        });
        return ui;
    };
    
    $(".form-options-body").sortable({
        items: "tr",
        cursor: "move",
        opacity: 0.6,
        axis: "y",
        handle: ".sortable-handle",
        helper: fixHelperSortable,
        update: function(ev){
            $(".dynamicform_wrapper").yiiDynamicForm("updateContainer");
        }
    }).disableSelection();
    
    $(".dynamicServiceform_wrapper").on("beforeInsert", function(e, item) {
        console.log("beforeInsert");
    });
    
    $(".dynamicServiceform_wrapper").on("afterInsert", function(e, item) {
        console.log("afterInsert");
    });
    
    $(".dynamicServiceform_wrapper").on("beforeDelete", function(e, item) {
        if (! confirm("Are you sure you want to delete this item?")) {
            return false;
        }
        return true;
    });
    
    $(".dynamicServiceform_wrapper").on("afterDelete", function(e) {
        console.log("Deleted item!");
    });
    
    $(".dynamicServiceform_wrapper").on("limitReached", function(e, item) {
        alert("Limit reached");
    });*/
JS;

JuiAsset::register($this);
$this->registerJs($js, yii\web\View::POS_READY);
?>