<?php

use yii\widgets\ListView;

/* @var $this yii\web\View */
/* @var $searchLinkModel yeesoft\menu\models\search\SearchMenuLink */

$dataProvider = $searchLinkModel->search((is_array($searchParams) ? $searchParams : []));
$queryParams  = Yii::$app->getRequest()->getQueryParams();
?>

<?php if (empty($queryParams)): ?>
    <h4>
        <?= Yii::t('yee/menu', 'Please, select menu to view menu links...') ?>
    </h4>
<?php elseif (!isset($parentId) && $dataProvider->count == 0): ?>
    <h4>
        <?= Yii::t('yee/menu', 'Selected menu doesn\'t contain any link. Click "Add New Link" to create a link for this menu.') ?>
    </h4>
<?php else: ?>
    <?=
    ListView::widget([
        'id' => 'menu-link-grid',
        'showOnEmpty' => true,
        'dataProvider' => $dataProvider,
        'layout' => "{items}",
        'options' => [
            'tag' => 'ul',
            'class' => 'sortable',
            'data-parentid' => (isset($parentId) ? $parentId : null)
        ],
        'itemOptions' => [
            'tag' => 'li',
            'class' => 'sortable-item',
        ],
        'itemView' => function ($model, $key, $index, $widget) use ($searchLinkModel) {
        return $this->render('link', ['model' => $model, 'searchLinkModel' => $searchLinkModel]);
    },
    ])
    ?>
<?php endif; ?>




