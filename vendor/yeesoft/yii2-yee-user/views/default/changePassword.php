<?php

use yeesoft\widgets\ActiveForm;
use yii\helpers\Html;

/**
 * @var yii\web\View $this
 * @var yeesoft\models\User $model
 */
$this->title = Yii::t('yee/user', 'Update User Password');
$this->params['breadcrumbs'][] = ['label' => Yii::t('yee/user', 'Users'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;

?>
<div class="user-update">

    <h3 class="lte-hide-title"><?= Html::encode($this->title) ?></h3>

    <div class="panel panel-default">
        <div class="panel-body">

            <div class="user-form">

                <?php $form = ActiveForm::begin([
                    'id' => 'user',
                    'layout' => 'horizontal',
                ]); ?>

                <?= $form->field($model, 'password')->passwordInput(['maxlength' => 255, 'autocomplete' => 'off']) ?>

                <?= $form->field($model, 'repeat_password')->passwordInput(['maxlength' => 255, 'autocomplete' => 'off']) ?>

                <div class="form-group">
                    <div class="col-sm-offset-3 col-sm-9">
                        <?= Html::submitButton(Yii::t('yee', 'Save'), ['class' => 'btn btn-primary']) ?>
                    </div>
                </div>

                <?php ActiveForm::end(); ?>

            </div>
        </div>
    </div>

</div>
