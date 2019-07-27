<?php

use yeesoft\helpers\Html;
use yii\helpers\HtmlPurifier;

/* @var $this yii\web\View */
?>

    <div class="pull-<?= $position ?> col-lg-<?= $width ?> widget-height-<?= $height ?>">
        <div class="panel panel-default dw-widget">
            <div class="panel-heading"><?= Yii::t('yee/post', 'Posts Activity') ?></div>
            <div class="panel-body">

                <?php if (count($recentPosts)): ?>
                    <div class="clearfix">
                        <?php foreach ($recentPosts as $post) : ?>
                            <div class="clearfix dw-post">

                                <div class="clearfix">
                                    <div style="float: right">
                                        <a class="dot-left"><?= HtmlPurifier::process($post->author->username); ?></a>
                                        <span class="dot-left dot-right"><?= "{$post->publishedDate}" ?></span>
                                    </div>
                                    <div>
                                        <?= Html::a(HtmlPurifier::process($post->title), ['post/default/view', 'id' => $post->id]) ?>
                                    </div>
                                </div>

                                <div class="dw-post-content">
                                    <?= HtmlPurifier::process(mb_substr(strip_tags($post->content), 0, 200, "UTF-8")); ?>
                                    <?= (strlen(strip_tags($post->content)) > 200) ? '...' : '' ?>
                                </div>

                            </div>

                        <?php endforeach; ?>
                    </div>

                    <div class="dw-quick-links">
                        <?php $list = [] ?>
                        <?php foreach ($posts as $post) : ?>
                            <?php $list[] = Html::a("<b>{$post['count']}</b> {$post['label']}", $post['url']); ?>
                        <?php endforeach; ?>
                        <?= implode(' | ', $list) ?>
                    </div>

                <?php else: ?>
                    <h4><em><?= Yii::t('yee/post', 'No posts found.') ?></em></h4>
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
.dw-post {
    border-bottom: 1px solid #eee;
    margin: 7px;
    padding: 0 0 5px 5px;
}
.dw-post-content {
    font-size: 0.9em;
    text-align: justify;
    margin: 10px 0 5px 0;
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