<?php

namespace yeesoft\post\widgets\dashboard;

use yeesoft\models\User;
use yeesoft\post\models\Post;
use yeesoft\post\models\search\PostSearch;
use yeesoft\widgets\DashboardWidget;
use Yii;

class Posts extends DashboardWidget
{
    /**
     * Most recent post limit
     */
    public $recentLimit = 5;

    /**
     * Post index action
     */
    public $indexAction = 'post/default/index';

    /**
     * Total post options
     *
     * @var array
     */
    public $options;

    public function run()
    {
        if (!$this->options) {
            $this->options = $this->getDefaultOptions();
        }

        if (User::hasPermission('viewPosts')) {
            $searchModel = new PostSearch();
            $formName = $searchModel->formName();

            $recentPosts = Post::find()->orderBy(['id' => SORT_DESC])->limit($this->recentLimit)->all();

            foreach ($this->options as &$option) {
                $count = Post::find()->filterWhere($option['filterWhere'])->count();
                $option['count'] = $count;
                $option['url'] = [$this->indexAction, $formName => $option['filterWhere']];
            }

            return $this->render('posts', [
                'height' => $this->height,
                'width' => $this->width,
                'position' => $this->position,
                'posts' => $this->options,
                'recentPosts' => $recentPosts,
            ]);
        }
    }

    public function getDefaultOptions()
    {
        return [
            ['label' => Yii::t('yee', 'Published'), 'icon' => 'ok', 'filterWhere' => ['status' => Post::STATUS_PUBLISHED]],
            ['label' => Yii::t('yee', 'Pending'), 'icon' => 'search', 'filterWhere' => ['status' => Post::STATUS_PENDING]],
        ];
    }
}