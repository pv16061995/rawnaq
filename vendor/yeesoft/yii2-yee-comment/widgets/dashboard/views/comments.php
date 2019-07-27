<?php

use yeesoft\comments\assets\CommentsAsset;
use yeesoft\comments\Comments;
use yii\helpers\Html;
use yii\helpers\HtmlPurifier;

/* @var $this yii\web\View */

$commentsAsset = CommentsAsset::register($this);
Comments::getInstance()->commentsAssetUrl = $commentsAsset->baseUrl;
?>

    <div class="pull-<?= $position ?> col-lg-<?= $width ?> widget-height-<?= $height ?>">
        <div class="panel panel-default dw-widget">
            <div class="panel-heading"><?= Yii::t('yee', 'Comments Activity') ?></div>
            <div class="panel-body">

                <?php if (count($recentComments)): ?>
                    <div class="clearfix">
                        <?php foreach ($recentComments as $comment) : ?>

                            <div class="clearfix comment">
                                <div class="avatar">
                                    <img src="<?= Comments::getInstance()->renderUserAvatar($comment->user_id) ?>"/>
                                </div>

                                <div class="comment-content">
                                    <div class="comment-header">
                                        <a class="author"><?= Html::encode($comment->getAuthor()); ?></a>
                                        <span class="time dot-left dot-right">
                                            <?= "{$comment->createdDate} {$comment->createdTime}" ?>
                                        </span>
                                    </div>
                                    <div class="comment-text">
                                        <?= HtmlPurifier::process(mb_substr(Html::encode($comment->content), 0, 64, "UTF-8")); ?>
                                        <?= (strlen($comment->content) > 64) ? '...' : '' ?>
                                    </div>
                                </div>
                            </div>

                        <?php endforeach; ?>
                    </div>

                    <div class="dw-quick-links">
                        <?php $list = [] ?>
                        <?php foreach ($comments as $comment) : ?>
                            <?php $list[] = Html::a("<b>{$comment['count']}</b> {$comment['label']}", $comment['url']); ?>
                        <?php endforeach; ?>
                        <?= implode(' | ', $list) ?>
                    </div>

                <?php else: ?>
                    <h4><em><?= Yii::t('yee', 'No comments found.') ?></em></h4>
                <?php endif; ?>

            </div>
        </div>
    </div>
<?php
$css = <<<CSS
.dw-widget{
    position:relative;
    padding-bottom:15px;
}
.dw-widget .comment{
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
    margin-bottom: 5px;
}
.dw-quick-links{
    position: absolute;
    bottom:10px;
    left:0;
    right:0;
    text-align: center;
}
CSS;

$this->registerCss($css);
?>