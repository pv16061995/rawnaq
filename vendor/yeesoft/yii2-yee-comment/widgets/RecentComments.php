<?php

namespace yeesoft\comment\widgets;

use yeesoft\comment\models\search\CommentSearch;
use yeesoft\comments\models\Comment;
use yeesoft\models\User;
use yeesoft\widgets\DashboardWidget;
use Yii;

class RecentComments extends DashboardWidget
{

    /**
     * Most recent comments limit
     */
    public $recentLimit = 5;
    
    public $layout = 'layout';
    public $commentTemplate = 'comment';

    public function run()
    {
        $recentComments = Comment::find()
                ->active()
                ->orderBy(['created_at' => SORT_DESC])
                ->limit($this->recentLimit)
                ->all();

        return $this->render($this->layout, [
            'recentComments' => $recentComments,
            'commentTemplate' => $this->commentTemplate,
        ]);
    }

}
