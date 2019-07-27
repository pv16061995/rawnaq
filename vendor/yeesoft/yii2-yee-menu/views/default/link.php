<?php

use yeesoft\helpers\Html;
use yeesoft\helpers\FA;

/* @var $this yii\web\View */
/* @var $model yeesoft\models\MenuLink; */
/* @var $searchLinkModel yeesoft\menu\models\search\SearchMenuLink */
?>

<div class="sortable-item-content" data-linkid="<?= $model->id ?>">

    <?php if(!empty($model->image)): ?>
        <div class="pull-left" style="padding: 3px 15px 0 0;">
            <?= FA::icon($model->image)->size(FA::SIZE_LARGE)->fixedWidth() ?>
        </div>
    <?php endif; ?>
    <div class="pull-left">
        <b><?= $model->label ?></b><br/>
        <span class="menu-link"><?= (empty($model->link)?"(no link)":"[{$model->link}]") ?></span>
    </div>
    <div class="menu-link-actions">
        <?= Html::a('['.Yii::t('yee', 'Edit').']', ['/menu/link/update', 'id' => $model->id], ['data-pjax' => 0]) ?>
        <br/>
            <?= Html::a('['.Yii::t('yee', 'Delete').']', ['/menu/link/delete', 'id' => $model->id], [
                    'data-confirm' => Yii::t('yii', 'Are you sure you want to delete this item?'),
                    'data-method' => 'post',
                    'data-pjax' => '0',
                ]) ?>
    </div>
    
</div>
<span class="sortable-drag-icon glyphicon glyphicon-move"></span>
<?=
$this->render('links', [
    'searchLinkModel' => $searchLinkModel,
    'searchParams' => ['parent_id' => $model->id],
    'parentId' => $model->id,
]);
?>