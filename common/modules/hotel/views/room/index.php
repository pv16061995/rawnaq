<?php

use yeesoft\grid\GridPageSize;
use yeesoft\grid\GridView;
use yeesoft\helpers\Html;
use common\modules\hotel\models\Room;
use common\modules\hotel\models\Hotel;
use yii\helpers\Url;
use yii\widgets\Pjax;

/* @var $this yii\web\View */
/* @var $searchModel common\modules\hotel\search\RoomSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = ($hotel_id)?Yii::t('yee/media', 'Rooms'):Yii::t('yee/media', 'Hotels');
$this->params['breadcrumbs'][] = ['label' => Yii::t('yee/hotel', 'Hotels'), 'url' => ['default/index']];
if($hotel_id){
    $hotel = Hotel::findOne($hotel_id);
    if($hotel){
        $this->params['breadcrumbs'][] = ['label' => $hotel->translation->title, 'url' => ['default/update/'.$hotel_id]];
    }
}
$this->params['breadcrumbs'][] = $this->title;

?>
<div class="hotel-room-index">

    <div class="row">
        <div class="col-sm-12">
            <h3 class="lte-hide-title page-title"><?= Html::encode($this->title) ?></h3>
            <?php if($hotel_id){
                    echo Html::a(Yii::t('yee', 'Add New'), ['room/create?hotel_id='.$hotel_id], ['class' => 'btn btn-sm btn-primary']);
                }
            ?>
        </div>
    </div>

    <div class="panel panel-default">
        <div class="panel-body">

            <div class="row">
                <div class="col-sm-12 text-right">
                    <?= GridPageSize::widget(['pjaxId' => 'hotel-room-grid-pjax']) ?>
                </div>
            </div>

            <?php Pjax::begin(['id' => 'hotel-room-grid-pjax']) ?>

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
                        'title' => ($hotel_id)?function (Room $model) {
                            return Html::a($model->title, ['update', 'id' => $model->id], ['data-pjax' => 0]);
                        }:function (Hotel $model) {
                            return Html::a($model->title, ['index', 'hotel_id' => $model->id], ['data-pjax' => 0]);
                        },
                        'buttonsTemplate' => ($hotel_id)?'{update} {delete}':'',
                    ],
                ],
            ]); ?>

            <?php Pjax::end() ?>
        </div>
    </div>
</div>