<?php
use yeesoft\helpers\Html;
use yeesoft\media\widgets\TinyMce;
use yeesoft\settings\assets\SettingsAsset;
use yeesoft\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model yeesoft\models\Setting */
/* @var $form yeesoft\widgets\ActiveForm */

$this->title = Yii::t('yee/settings', 'Home Settings');
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

        <?= $form->field($model, 'banner_heading')->textInput()->hint($model->getDescription('banner_heading')) ?>
        <?= $form->field($model, 'banner_description')->textInput()->hint($model->getDescription('banner_description')) ?>
        <?= $form->field($model, 'banner_img')->widget(yeesoft\media\widgets\FileInput::className(), [
                                'name' => 'image',
                                'buttonTag' => 'button',
                                'buttonName' => Yii::t('yee', 'Browse'),
                                'buttonOptions' => ['class' => 'btn btn-default btn-file-input'],
                                'options' => ['class' => 'form-control'],
                                'template' => '<div class="banner thumbnail"></div><div class="input-group">{input}<span class="input-group-btn">{button}</span></div>',
                                'thumb' => $this->context->module->thumbnailSize,
                                'imageContainer' => '.banner',
                                'pasteData' => yeesoft\media\widgets\FileInput::DATA_URL,
                                'callbackBeforeInsert' => 'function(e, data) {
                                $(".banner").show();
                            }',
                            ]) ?>
        <?= $form->field($model, 'banner_page_link')->textInput()->hint($model->getDescription('banner_page_link')) ?>
        
        <?= $form->field($model, 'content_text')->widget(TinyMce::className())->hint($model->getDescription('content_text')); ?>
        

        <div class="form-group">
            <?= Html::submitButton(Yii::t('yee', 'Save'), ['class' => 'btn btn-primary']) ?>
        </div>

        <?php ActiveForm::end(); ?>

    </div>
</div>


<?php 
$js = <<<JS
    
    var banner = $("#homesettings-banner_img").val();
    if(banner.length == 0){
        $('.banner').hide();
    } else {
        $('.banner').html('<img src="' + banner + '" />');
    }
JS;
$this->registerJs($js, yii\web\View::POS_READY);
?>
