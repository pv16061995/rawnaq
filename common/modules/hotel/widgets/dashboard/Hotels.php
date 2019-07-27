<?php

namespace common\modules\hotel\widgets\dashboard;

use yeesoft\models\User;
use common\modules\hotel\models\Hotel;
use common\modules\hotel\models\search\HotelSearch;
use yeesoft\widgets\DashboardWidget;
use Yii;

class Hotels extends DashboardWidget
{
    /**
     * Most recent hotel limit
     */
    public $recentLimit = 5;

    /**
     * Hotel index action
     */
    public $indexAction = 'hotel/default/index';

    /**
     * Total hotel options
     *
     * @var array
     */
    public $options;

    public function run()
    {
        if (!$this->options) {
            $this->options = $this->getDefaultOptions();
        }

        if (User::hasPermission('viewHotels')) {
            $searchModel = new HotelSearch();
            $formName = $searchModel->formName();

            $recentHotels = Hotel::find()->orderBy(['id' => SORT_DESC])->limit($this->recentLimit)->all();

            foreach ($this->options as &$option) {
                $count = Hotel::find()->filterWhere($option['filterWhere'])->count();
                $option['count'] = $count;
                $option['url'] = [$this->indexAction, $formName => $option['filterWhere']];
            }

            return $this->render('hotels', [
                'height' => $this->height,
                'width' => $this->width,
                'position' => $this->position,
                'hotels' => $this->options,
                'recentHotels' => $recentHotels,
            ]);
        }
    }

    public function getDefaultOptions()
    {
        return [
            ['label' => Yii::t('yee', 'Published'), 'icon' => 'ok', 'filterWhere' => ['status' => Hotel::STATUS_PUBLISHED]],
            ['label' => Yii::t('yee', 'Pending'), 'icon' => 'search', 'filterWhere' => ['status' => Hotel::STATUS_PENDING]],
        ];
    }
}