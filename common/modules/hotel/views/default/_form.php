<?php

use yeesoft\helpers\Html;
use yeesoft\media\widgets\TinyMce;
use yeesoft\models\User;
use common\modules\hotel\models\Destination;
use common\modules\hotel\models\Hotel;
use common\modules\hotel\models\Room;
use yeesoft\widgets\ActiveForm;
use yeesoft\widgets\LanguagePills;
use yii\jui\DatePicker;
use yii\helpers\Url;
use yeesoft\grid\GridPageSize;
use yeesoft\grid\GridView;
use common\modules\hotel\widgets\MagicSuggest;
use common\modules\hotel\models\Service;
use wbraganca\dynamicform\DynamicFormWidget;
use common\modules\hotel\widgets\Select2;

/* @var $this yii\web\View */
/* @var $model common\modules\hotel\models\Hotel */
/* @var $form yeesoft\widgets\ActiveForm */
?>

    <div class="hotel-form">

        <?php
        $form = ActiveForm::begin([
            'id' => 'hotel-form',
            'validateOnBlur' => false,
            'validateOnBlur' => false,
            'enableClientValidation' => false,
            'enableAjaxValidation' => false,
            'validateOnChange' => true,
            'options' => [
                'enctype' => 'multipart/form-data',
                'id' => 'hotel-form'
            ]
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

                        <?= $form->field($model, 'slug')->textInput(['maxlength' => true]) ?>
                        
                        <?php //$form->field($model, 'serviceValues')->widget(MagicSuggest::className(), ['items' => Service::getServices()]); ?>

                        <?= $form->field($model, 'content')->widget(TinyMce::className()); ?>

                    </div>
                </div>

<?php /*
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
                                'formId' => 'hotel-form',
                                'formFields' => [
                                    'service_id',
                                    'service_description',
                                ],
                            ]); ?>
                            <label>Services</label>
                            <button type="button" class="pull-right add-item btn btn-success btn-xs"><i class="fa fa-plus"></i> Add Service</button>
                            <div class="clearfix"></div>
                            <div class="container-items"><!-- widgetContainer -->
                                <?php foreach ($modelsServices as $i => $modelService) : ?>
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
                                                    if (!$modelService->isNewRecord) {
                                                        echo Html::activeHiddenInput($modelService, "[{$i}]id");
                                                    }
                                                    ?>
                                                    <?= //$form->field($modelService, "[{$i}]service_id")->widget(Select2::classname(), [
                                                    //     'data' => Service::getServices(),
                                                    //     'placeholder' => 'Select Service..',
                                                    //     'initSelection'=> $modelService->service_id,
                                                    //     'templateResult' => "function(item) { if(!item.id) item.text; return $('<span>' + item.text + '</span>' +'<b>('+item.used+')</b>'); }",
                                                    ]); 
                                                    $form->field($modelService, "[{$i}]service_id")->dropDownList(Service::getServicesForDropBox(), ['prompt' => '', 'encodeSpaces' => true])
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
*/ ?>
<? /*  

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
                        'formId' => 'hotel-form',
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
*/ ?>                
                <?php if (!$model->isNewRecord) : ?>
                <div class="panel panel-default">
                    <div class="panel-body">
                        <div class="record-info">
                            <div class="row">
                                <div class="col-sm-12">
                                    <h3 class="lte-hide-title page-title">Rooms</h3>
                                    <?php echo Html::a(Yii::t('yee', 'Add New'), ['room/create?hotel_id=' . $model->id], ['class' => 'btn btn-sm btn-primary']); ?>
                                </div>
                            </div>
                            <?= GridView::widget([
                                'id' => 'hotel-room-grid',
                                'dataProvider' => $dataProvider,
                                'filterModel' => $searchModel,
                                'bulkActionOptions' => [
                                    'gridId' => 'hotel-room-grid',
                                    'actions' => [Url::to(['bulk-delete']) => Yii::t('yee', 'Delete')]
                                ],
                                'columns' => [
                                    ['class' => 'yeesoft\grid\CheckboxColumn', 'options' => ['style' => 'width:10px']],
                                    [
                                        'class' => 'yeesoft\grid\columns\TitleActionColumn',
                                        'controller' => '/hotel/room',
                                        'title' => function (Room $model) {
                                //echo "<pre>"; print_r($model->hotelRooms);exit;
                                            return Html::a($model->title, ['room/update', 'id' => $model->id], ['data-pjax' => 0]);
                                        },
                                        'buttonsTemplate' => '{update} {delete}',
                                    ],
                                ],
                            ]); ?>
                        </div>
                    </div>
                </div>
                <?php endif; ?>
            </div>

            <div class="col-md-3">

                <div class="panel panel-default">
                    <div class="panel-body">
                        <div class="record-info">
                            <?php if (!$model->isNewRecord) : ?>

                                <div class="form-group clearfix">
                                    <label class="control-label" style="float: left; padding-right: 5px;">
                                        <?= $model->attributeLabels()['created_at'] ?> :
                                    </label>
                                    <span><?= $model->createdDatetime ?></span>
                                </div>

                                <div class="form-group clearfix">
                                    <label class="control-label" style="float: left; padding-right: 5px;">
                                        <?= $model->attributeLabels()['updated_at'] ?> :
                                    </label>
                                    <span><?= $model->updatedDatetime ?></span>
                                </div>

                                <div class="form-group clearfix">
                                    <label class="control-label" style="float: left; padding-right: 5px;">
                                        <?= $model->attributeLabels()['updated_by'] ?> :
                                    </label>
                                    <span><?= $model->updatedBy->username ?></span>
                                </div>

                            <?php endif; ?>

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
                                    ]) ?>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="panel panel-default">
                    <div class="panel-body">

                        <div class="record-info">
                            <?= $form->field($model, "price")->hiddenInput()->label(false); ?>

                            <?= $form->field($model, "address")->textInput(['maxlength' => true]) ?>
                            
                            <?= $form->field($model, 'star_rating')->dropDownList([5 => '5 Stars', 4 => '4 Stars', 3 => '3 Stars', 2 => '2 Stars', 1 => '1 Stars']) ?>
                            
                            <?= $form->field($model, 'destination_id')->dropDownList(Destination::getDestinations(), ['prompt' => '', 'encodeSpaces' => true]) ?>
                            
                            <?= $form->field($model, 'published_at')
                                ->widget(DatePicker::className(), ['dateFormat' => 'yyyy-MM-dd', 'options' => ['class' => 'form-control']]); ?>

                            <?= $form->field($model, 'status')->dropDownList(Hotel::getStatusList()) ?>

                            <?= $form->field($model, "distance")->textInput(['maxlength' => true]) ?>

                            <?= $form->field($model, "travel")->textInput(['maxlength' => true]) ?>

                            <?= $form->field($model, "no_of_rooms")->textInput(['maxlength' => true]) ?>

                            <?= $form->field($model, "recommended_for")->textInput(['maxlength' => true]) ?>
                            
                            <?= $form->field($model, 'show_on_home')->dropDownList([0 => 'No', 1 => 'Yes']) ?>

                            <?php if (!$model->isNewRecord) : ?>
                                <?= $form->field($model, 'created_by')->dropDownList(User::getUsersList()) ?>
                            <?php endif; ?>

                            <?= $form->field($model, 'comment_status')->dropDownList(Hotel::getCommentStatusList()) ?>

                            <?= $form->field($model, 'view')->dropDownList($this->context->module->viewList) ?>

                            <?= $form->field($model, 'layout')->dropDownList($this->context->module->layoutList) ?>

                        </div>
                    </div>
                </div>

                <div class="panel panel-default">
                    <div class="panel-body">
                        <div class="record-info">
                            <?= $form->field($model, 'thumbnail')->widget(yeesoft\media\widgets\FileInput::className(), [
                                'name' => 'image',
                                'buttonTag' => 'button',
                                'buttonName' => Yii::t('yee', 'Browse'),
                                'buttonOptions' => ['class' => 'btn btn-default btn-file-input'],
                                'options' => ['class' => 'form-control'],
                                'template' => '<div class="hotel-thumbnail thumbnail"></div><div class="input-group">{input}<span class="input-group-btn">{button}</span></div>',
                                'thumb' => $this->context->module->thumbnailSize,
                                'imageContainer' => '.hotel-thumbnail',
                                'pasteData' => yeesoft\media\widgets\FileInput::DATA_URL,
                                'callbackBeforeInsert' => 'function(e, data) {
                                $(".hotel-thumbnail").show();
                            }',
                            ]) ?>

                            <?= $form->field($model, 'logo')->widget(yeesoft\media\widgets\FileInput::className(), [
                                'name' => 'image',
                                'buttonTag' => 'button',
                                'buttonName' => Yii::t('yee', 'Browse'),
                                'buttonOptions' => ['class' => 'btn btn-default btn-file-input'],
                                'options' => ['class' => 'form-control'],
                                'template' => '<div class="hotel-logo thumbnail"></div><div class="input-group">{input}<span class="input-group-btn">{button}</span></div>',
                                'thumb' => 'small',
                                'imageContainer' => '.hotel-logo',
                                'pasteData' => yeesoft\media\widgets\FileInput::DATA_URL,
                                'callbackBeforeInsert' => 'function(e, data) {
                                $(".hotel-logo").show();
                            }',
                            ]) ?>
                            <?= $form->field($model, 'banner')->widget(yeesoft\media\widgets\FileInput::className(), [
                                'name' => 'image',
                                'buttonTag' => 'button',
                                'buttonName' => Yii::t('yee', 'Browse'),
                                'buttonOptions' => ['class' => 'btn btn-default btn-file-input'],
                                'options' => ['class' => 'form-control'],
                                'template' => '<div class="hotel-banner thumbnail"></div><div class="input-group">{input}<span class="input-group-btn">{button}</span></div>',
                                'thumb' => 'original',
                                'imageContainer' => '.hotel-banner',
                                'pasteData' => yeesoft\media\widgets\FileInput::DATA_URL,
                                'callbackBeforeInsert' => 'function(e, data) {
                                $(".hotel-banner").show();
                            }',
                            ]) ?>
                        </div>
                    </div>
                </div>

                <div class="panel panel-default">
                    <div class="panel-body">
                        <div class="record-info">
                            <?= $form->field($model, 'view')->dropDownList($this->context->module->viewList) ?>

                            <?= $form->field($model, 'layout')->dropDownList($this->context->module->layoutList) ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <?php ActiveForm::end(); ?>

    </div>
<?php
$css = <<<CSS
.ms-ctn .ms-sel-ctn {
    margin-left: -6px;
    margin-top: -2px;
}
.ms-ctn .ms-sel-item {
    color: #666;
    font-size: 14px;
    cursor: default;
    border: 1px solid #ccc;
}
CSS;

$js = <<<JS
    var thumbnail = $("#hotel-thumbnail").val();
    if(thumbnail.length == 0){
        $('.hotel-thumbnail').hide();
    } else {
        $('.hotel-thumbnail').html('<img src="' + thumbnail + '" />');
    }
    
    var banner = $("#hotel-banner").val();
    if(banner.length == 0){
        $('.hotel-banner').hide();
    } else {
        $('.hotel-banner').html('<img src="' + banner + '" />');
    }
    
    var logo = $("#hotel-logo").val();
    if(logo.length == 0){
        $('.hotel-logo').hide();
    } else {
        $('.hotel-logo').html('<img src="' + banner + '" />');
    }
    
    $(".dynamicform_wrapper").on("beforeInsert", function(e, item) {
        console.log("beforeInsert");
    });
    
    $(".dynamicform_wrapper").on("afterInsert", function(e, item) {
        console.log("afterInsert");
    });
    
    $(".dynamicform_wrapper").on("beforeDelete", function(e, item) {
        if (! confirm("Are you sure you want to delete this item?")) {
            return false;
        }
        return true;
    });
    
    $(".dynamicform_wrapper").on("afterDelete", function(e) {
        console.log("Deleted item!");
    });
    
    $(".dynamicform_wrapper").on("limitReached", function(e, item) {
        alert("Limit reached");
    });
        
        
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
JS;

$this->registerCss($css);
$this->registerJs($js, yii\web\View::POS_READY);
?>