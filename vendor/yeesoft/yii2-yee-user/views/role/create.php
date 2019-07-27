<?php
/**
 *
 * @var yii\web\View $this
 * @var yeesoft\widgets\ActiveForm $form
 * @var yeesoft\models\Role $model
 */
use yii\helpers\Html;

$this->title = Yii::t('yee/user', 'Create Role');
$this->params['breadcrumbs'][] = ['label' => Yii::t('yee/user', 'Users'), 'url' => ['/user/default/index']];
$this->params['breadcrumbs'][] = ['label' => Yii::t('yee/user', 'Roles'), 'url' => ['/user/role/index']];
$this->params['breadcrumbs'][] = $this->title;
?>

<div class="role-create">
    <h3 class="lte-hide-title"><?= Html::encode($this->title) ?></h3>
    <?= $this->render('_form', compact('model')) ?>
</div>